import type { PageServerLoad } from './$types';
import { getById, getAllTagConditions } from '$lib/server/parameters';
import { error } from '@sveltejs/kit';
import sql from '$lib/server/db';

export const load: PageServerLoad = async ({ params }) => {
	try {
		// Get parameter with conditions using the same SQL pattern as parameters list
		const parameterResult = await sql`
			SELECT p.*, 
			(SELECT json_agg(p1) FROM parameters p1 WHERE p1.targeting_key = p.id) as sub_params,
			(
				SELECT json_agg(condition_group)
				FROM (
					SELECT 
						pc.value,
						json_agg(c ORDER BY pc.condition_order) AS conditions
					FROM parameter_condition pc
					JOIN conditions c ON pc.condition_id = c.id
					WHERE pc.parameter_id = p.id
					GROUP BY pc.value
				) AS condition_group
			) AS condition_json
			FROM parameters p 
			WHERE p.id = ${params.id}
		`;
		
		if (parameterResult.length === 0) {
			throw error(404, 'Parameter not found');
		}
		
		const parameter = parameterResult[0];
		const conditions = await getAllTagConditions(params.id);
		
		return {
			parameter,
			conditions
		};
	} catch (err) {
		console.error('Error loading parameter:', err);
		throw error(404, 'Parameter not found');
	}
};
