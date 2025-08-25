import type { PageServerLoad, Actions } from './$types';
import { getById, update, count, createTarget, getAllConditions, getAllTagConditions } from '$lib/server/parameters';
import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
export const load: PageServerLoad = async ({ params }) => {
	const flag = await getById(params.id);
	const targets = await getAllTagConditions(params.id)
	const conditions = await getAllConditions()
	return {
		flag,
		targetKeys: targets,
		conditions : conditions
	};
};

export const actions = {
	delete: async (event) => {
		console.log('delete')
	},

	update: async ({ cookies, request, url, params }) => {
		try {
			const data = await request.formData();
			console.log('=== UPDATE ACTION START ===');
			console.log('Form data entries:');
			for (let [key, value] of data.entries()) {
				console.log(`${key}: ${value}`);
			}
			
			// Extract conditions from form inputs
			const formConditions: any[] = [];
			const conditionMap = new Map();
			
			// Parse form data to extract conditions
			for (let [key, value] of data.entries()) {
				if (key.startsWith('conditions[') && key.includes('].')) {
					const match = key.match(/conditions\[(\d+)\]\.(\w+)/);
					if (match) {
						const index = parseInt(match[1]);
						const field = match[2];
						
						if (!conditionMap.has(index)) {
							conditionMap.set(index, {});
						}
						
						conditionMap.get(index)[field] = value.toString();
					}
				}
			}
			
			// Convert map to array and filter out empty conditions
			for (let [index, condition] of conditionMap.entries()) {
				if (condition.id && condition.value) {
					formConditions.push({
						id: parseInt(condition.id),
						value: condition.value,
						condition_order: parseInt(condition.condition_order) || (index + 1)
					});
				}
			}
			
			console.log('Extracted form conditions:', formConditions);
			
			// Get targetKeys from form data (this includes user additions)
			const targetKeysJson = data.get('targetKeys')?.toString();
			let processedTargetKeys = [];
			if (targetKeysJson) {
				try {
					processedTargetKeys = JSON.parse(targetKeysJson);
					console.log('Parsed targetKeys:', processedTargetKeys);
				} catch (e) {
					console.error('Error parsing targetKeys:', e);
					processedTargetKeys = [];
				}
			}

			const id = data.get('id')?.toString();
			const key = data.get('key')?.toString();
			const code = data.get('code')?.toString();
			const default_value = data.get('default_value')?.toString() || '';
			const variant = data.get('variant')?.toString();
			const description = data.get('description')?.toString();

			// Use form conditions (actual user input) instead of targetKeys
			const conditions = formConditions;

			let flag: any = {
				id,
				key,
				code,
				default_value,
				variant,
				description,
				conditions: conditions  // Use form conditions
			}
			
			console.log('Updating flag with conditions:', flag);
			console.log('Conditions array:', JSON.stringify(conditions, null, 2));
			console.log('Conditions is array:', Array.isArray(conditions));
			console.log('Conditions length:', conditions.length);
			
			await update(flag);
			console.log('Flag updated successfully');

			// Get updated flag data from database
			const updatedFlag = await getById(params.id);

			console.log('=== UPDATE ACTION SUCCESS ===');
			return { 
				flag: updatedFlag, 
				success: true 
			};
		} catch (error) {
			console.error('Update error:', error);
			return fail(500, { 
				error: true, 
				message: 'Failed to update parameter' 
			});
		}
	},

	upload: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());

		if (
			!(formData.fileToUpload as File).name ||
			(formData.fileToUpload as File).name === 'undefined'
		) {
			return fail(400, {
				error: true,
				message: 'You must provide a file to upload'
			});
		}

		const { fileToUpload } = formData as { fileToUpload: File };

		const bytes = Buffer.from(await fileToUpload.arrayBuffer());
		const data = JSON.parse(bytes.toString())

		console.log(formData.key)
		console.log(formData.code)
		console.log(formData.platform)


		data.forEach(async (target: string) => {
			const c = await count(formData.code.toString(), formData.key.toString(), target);
			if (c == 0) {
				await createTarget(
					formData.key.toString(),
					formData.code.toString(),
					"true",
					target,
					formData.platform.toString(),
				)
			}
		})

		return { success: true };
	},

	

} satisfies Actions;


const extractConditions = (formData: FormData): Record<string, any>[] => {
	let conditions: Record<string, any>[] = [];

	for (const [key, value] of formData.entries()) {
		const match = key.match(/^conditions\[(\d+)\]\.(id|name|value|condition_order)$/);

		if (match) {
		const index = parseInt(match[1], 10);
		const field = match[2];

		if (!conditions[index]) {
			conditions[index] = {};
		}

		conditions[index][field] = value;
		}
	}

	return conditions;
}