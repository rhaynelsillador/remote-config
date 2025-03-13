import { create } from '$lib/server/flags';
import type { PageServerLoad, Actions } from './$types';

export const actions = {
	create: async ({ _, request }) => {
		const data = await request.formData();
		const key = data.get('key');
		const code = data.get('code');
		const value = data.get('value');
		const meta = data.get('meta');
		const platform = data.get('platform');

		const result = await create(key?.toString(),
			code?.toString(),
			value?.toString(),
			meta?.toString(),
			platform?.toString(),
		)

		return { success: result };
	}
} satisfies Actions;
