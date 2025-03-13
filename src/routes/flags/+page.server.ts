import { getByCode } from '$lib/server/flags';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const flags = await getByCode("send_money")
	if (flags) {
		return {
			flags
		};
	}
	error(404, 'Not found');
};
