import { getByCode } from '$lib/server/flags';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const flags = await getByCode(env.APP_CODE!)
	if (flags) {
		return {
			flags
		};
	}
	error(404, 'Not found');
};
