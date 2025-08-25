import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
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
		
		// Get parameters that use this condition
		const parametersUsing = await sql`
			SELECT DISTINCT p.id, p.key, p.variant, p.default_value, pc.value as condition_value
			FROM parameters p
			JOIN parameter_condition pc ON p.id = pc.parameter_id
			WHERE pc.condition_id = ${parseInt(params.id)}
			ORDER BY p.key ASC
		`;
		
		return {
			condition,
			parametersUsing
		};
	} catch (err) {
		console.error('Error loading condition:', err);
		throw error(404, 'Condition not found');
	}
};
