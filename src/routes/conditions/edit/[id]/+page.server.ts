import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import sql from '$lib/server/db';

export const load: PageServerLoad = async ({ params }) => {
	try {
		// Get condition details using raw SQL
		const conditionResult = await sql`
			SELECT c.*
			FROM conditions c
			WHERE c.id = ${parseInt(params.id)}
		`;
		
		if (conditionResult.length === 0) {
			throw error(404, 'Condition not found');
		}
		
		const condition = conditionResult[0];
		
		return {
			condition
		};
	} catch (err) {
		console.error('Error loading condition:', err);
		throw error(404, 'Condition not found');
	}
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		try {
			const data = await request.formData();
			const name = data.get('name')?.toString();
			const description = data.get('description')?.toString() || null;
			const rulesJson = data.get('rules') as string;
			
			let rules = [];
			if (rulesJson) {
				try {
					rules = JSON.parse(rulesJson);
				} catch (e) {
					console.warn('Invalid rules JSON:', rulesJson);
				}
			}
			
			if (!name) {
				return fail(400, {
					error: true,
					message: 'Condition name is required'
				});
			}
			
			// Update condition using raw SQL
			await sql`
				UPDATE conditions 
				SET name = ${name}, 
					description = ${description}, 
					condition_json = ${rules}::jsonb,
					updated_at = NOW()
				WHERE id = ${parseInt(params.id)}
			`;
			
			return {
				success: true,
				message: 'Condition updated successfully'
			};
		} catch (error) {
			console.error('Error updating condition:', error);
			return fail(500, {
				error: true,
				message: 'Failed to update condition'
			});
		}
	},
	
	delete: async ({ params }) => {
		try {
			const conditionId = parseInt(params.id);
			console.log('Attempting to delete condition with ID:', conditionId);
			
			// Check if condition exists first
			const conditionExists = await sql`
				SELECT id FROM conditions WHERE id = ${conditionId}
			`;
			
			if (conditionExists.length === 0) {
				return fail(404, {
					error: true,
					message: 'Condition not found'
				});
			}
			
			// Delete condition directly - skip relationship checks for now
			const deleteResult = await sql`
				DELETE FROM conditions 
				WHERE id = ${conditionId}
			`;
			
			console.log('Delete result:', deleteResult);
			
			// Return redirect instead of throwing it
			return redirect(302, '/conditions');
		} catch (error) {
			if (error instanceof Response) {
				throw error; // Re-throw redirect
			}
			console.error('Error deleting condition:', error);
			return fail(500, {
				error: true,
				message: `Failed to delete condition: ${error instanceof Error ? error.message : 'Unknown error'}`
			});
		}
	}
};
