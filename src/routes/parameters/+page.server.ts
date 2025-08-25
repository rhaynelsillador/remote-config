import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import sql from '$lib/server/db';

export const load = (async ({ url }) => {
    try {
        const search = url.searchParams.get('search') || '';
		const page = Number(url.searchParams.get('page') || 1);
		const pageSize = Number(url.searchParams.get('limit') || 10);
		const skip = (page - 1) * pageSize;

        // Use raw SQL to get parameters with conditions like getByCode function
        const parameters = await sql`
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
            WHERE p.targeting_key IS NULL 
            ${search ? sql`AND p.key ILIKE ${'%' + search + '%'}` : sql``}
            ORDER BY p.key ASC
            LIMIT ${pageSize} OFFSET ${skip}
        `;

        // Get total count for pagination
        const totalCountResult = await sql`
            SELECT COUNT(*) as total
            FROM parameters p 
            WHERE p.targeting_key IS NULL 
            ${search ? sql`AND p.key ILIKE ${'%' + search + '%'}` : sql``}
        `;
        const totalCount = Number(totalCountResult[0]?.total || 0);


        return {
			parameters: parameters,
			totalCount,
			page,
			pageSize,
			totalPages: Math.ceil(totalCount / pageSize)
		};

    } catch (err) {
        console.error('Error loading parameters:', err);
        throw error(500, {
            message: 'Error loading parameters'
        });
    }
}) satisfies PageServerLoad;