import { getByCode } from '$lib/server/parameters';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const parameters = await getByCode(env.APP_CODE!)
	console.log("parameters", parameters);
	if (parameters) {
		return {
			parameters
		};
	}
	error(404, 'Not found');
};
