import type { PageServerLoad, Actions } from './$types';
import { getById, update, count, createTarget, getAllTargets } from '$lib/server/flags';
import { fail } from '@sveltejs/kit';
export const load: PageServerLoad = async ({ params }) => {
	const flag = await getById(params.id);
	const targets = await getAllTargets(flag.code, flag.key, flag.platform)
	return {
		flag,
		targetKeys: targets,
	};
};

export const actions = {
	delete: async (event) => {
		console.log('delete')
	},

	update: async ({ cookies, request, url }) => {
		const data = await request.formData();

		const id = data.get('id')?.toString();
		const key = data.get('key')?.toString();
		const code = data.get('code')?.toString();
		const value = data.get('value')?.toString();
		const meta = data.get('meta')?.toString();
		const platform = data.get('platform')?.toString();

		let flag: any = {
			id,
			key,
			code,
			value,
			meta,
			platform
		}

		await update(flag)

		return { success: true };
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
	}
} satisfies Actions;
