import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
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

export const actions: Actions = {
	update: async ({ params, request }) => {
		try {
			const flagId = parseInt(params.id);
			
			if (isNaN(flagId)) {
				return fail(400, {
					error: true,
					message: 'Invalid flag ID'
				});
			}

			const data = await request.formData();
			const name = data.get('name')?.toString();
			const value = data.get('value')?.toString();
			const description = data.get('description')?.toString() || null;

			if (!name) {
				return fail(400, {
					error: true,
					message: 'Flag name is required'
				});
			}

			if (value === undefined || value === '') {
				return fail(400, {
					error: true,
					message: 'Flag value is required'
				});
			}

			// Check if flag name already exists for a different flag
			const existingFlag = await sql`
				SELECT id FROM flags WHERE name = ${name} AND id != ${flagId}
			`;

			if (existingFlag.length > 0) {
				return fail(400, {
					error: true,
					message: 'Flag with this name already exists'
				});
			}

			// Update flag
			await sql`
				UPDATE flags 
				SET name = ${name}, value = ${value}, description = ${description}, updated_at = NOW()
				WHERE id = ${flagId}
			`;

			return redirect(302, `/flags/${flagId}`);
		} catch (err) {
			console.error('Error updating flag:', err);
			return fail(500, {
				error: true,
				message: 'Failed to update flag'
			});
		}
	},

	delete: async ({ params }) => {
		try {
			const flagId = parseInt(params.id);
			
			if (isNaN(flagId)) {
				return fail(400, {
					error: true,
					message: 'Invalid flag ID'
				});
			}

			// Delete flag
			await sql`
				DELETE FROM flags WHERE id = ${flagId}
			`;

			return redirect(302, '/flags');
		} catch (err) {
			console.error('Error deleting flag:', err);
			return fail(500, {
				error: true,
				message: 'Failed to delete flag'
			});
		}
	}
};
