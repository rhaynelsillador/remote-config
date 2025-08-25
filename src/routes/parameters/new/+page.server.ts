
import type { PageServerLoad, Actions } from './$types';
import { getAllConditions, create} from '$lib/server/parameters';
import { prisma } from '$lib/server/prisma';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ params }) => {

	console.log("load new parameters page", params)

	const conditions = await getAllConditions()
	return {

		targetKeys: [],
		conditions : conditions
	};
};
export const actions = {
	create: async ({ _, request }) => {
		const data = await request.formData();
		const conditions = extractConditions(data);
		console.log(conditions);

		console.log("data", data);
		const rawTargetingKey = data.get('targeting_key')?.toString() ?? null;

		const targetingKey = rawTargetingKey ? parseInt(rawTargetingKey) : null;

		const key = data.get('key')?.toString() ?? '';
		const code = data.get('code')?.toString() ?? '';
		const default_value = data.get('default_value')?.toString() || '';
		const variant = data.get('variant')?.toString() ?? '';
		const description = data.get('description')?.toString() ?? null;

		// let newParameter
		// if(targetingKey != null){
		// 	newParameter = await prisma.parameters.create({
		// 		data: {
		// 			key: key,
		// 			code: code,
		// 			variant: variant,
		// 			default_value: default_value,
		// 			environment: env.APP_CODE!,
		// 			targetingParam: {
		// 			connect: { id: targetingKey } // assuming parent param with id 1 exists
		// 			}
		// 		}
		// 	});
		// }else{
		// 	newParameter = await prisma.parameters.create({
		// 		data: {
		// 			key: key,
		// 			code: code,
		// 			variant: variant,
		// 			default_value: default_value,
		// 			environment: env.APP_CODE!,
		// 		}
		// 	});
		// }


		// console.log("newParameter ", newParameter)


		const result = await create(key, code, default_value, description, variant, conditions, targetingKey)

		return { success: true };
	}
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