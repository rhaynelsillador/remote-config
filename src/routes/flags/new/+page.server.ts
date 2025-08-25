import type { Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import sql from '$lib/server/db';

export const actions: Actions = {
	create: async ({ request }) => {
		try {
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

			// Check if flag name already exists
			const existingFlag = await sql`
				SELECT id FROM flags WHERE name = ${name}
			`;

			if (existingFlag.length > 0) {
				return fail(400, {
					error: true,
					message: 'Flag with this name already exists'
				});
			}

			// Insert new flag
			await sql`
				INSERT INTO flags (name, value, description, created_at, updated_at)
				VALUES (${name}, ${value}, ${description}, NOW(), NOW())
			`;

			return redirect(302, '/flags');
		} catch (err) {
			console.error('Error creating flag:', err);
			return fail(500, {
				error: true,
				message: 'Failed to create flag'
			});
		}
	}
};
