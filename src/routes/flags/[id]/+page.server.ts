import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import sql from '$lib/server/db';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const flagId = parseInt(params.id);
		
		if (isNaN(flagId)) {
			error(400, 'Invalid flag ID');
		}

		const flags = await sql`
			SELECT id, name, value, description, created_at, updated_at
			FROM flags 
			WHERE id = ${flagId}
		`;

		if (flags.length === 0) {
			error(404, 'Flag not found');
		}

		return {
			flag: flags[0]
		};
	} catch (err) {
		console.error('Error loading flag:', err);
		error(500, 'Failed to load flag');
	}
};
