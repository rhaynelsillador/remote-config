import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import sql from '$lib/server/db';

export const load = (async ({ url }) => {
    try {
        const search = url.searchParams.get('search') || '';
        const page = Number(url.searchParams.get('page') || 1);
        const pageSize = Number(url.searchParams.get('limit') || 10);
        const offset = (page - 1) * pageSize;

        // Get conditions using raw SQL
        const searchCondition = search ? sql`WHERE c.name ILIKE ${'%' + search + '%'}` : sql``;
        
        const conditions = await sql`
            SELECT c.*, COUNT(*) OVER() as total_count
            FROM conditions c
            ${searchCondition}
            ORDER BY c.name ASC
            LIMIT ${pageSize} OFFSET ${offset}
        `;

        const totalCount = conditions.length > 0 ? Number(conditions[0].total_count) : 0;

        return {
            conditions,
            totalCount,
            page,
            pageSize,
            totalPages: Math.ceil(totalCount / pageSize)
        };

    } catch (err) {
        console.error('Error loading conditions:', err);
        throw error(500, {
            message: 'Error loading conditions'
        });
    }
}) satisfies PageServerLoad;
