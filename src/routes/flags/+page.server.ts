import type { PageServerLoad, Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ url }) => {
	try {
		const page = parseInt(url.searchParams.get('page') || '1');
		const pageSize = 10;
		const searchQuery = url.searchParams.get('search') || '';
		const offset = (page - 1) * pageSize;

		let flags;
		let totalCount;

		if (searchQuery) {
			flags = await prisma.flags.findMany({
				where: {
					OR: [
						{ name: { contains: searchQuery, mode: 'insensitive' } },
						{ description: { contains: searchQuery, mode: 'insensitive' } }
					]
				},
				orderBy: { created_at: 'desc' },
				skip: offset,
				take: pageSize
			});
			totalCount = await prisma.flags.count({
				where: {
					OR: [
						{ name: { contains: searchQuery, mode: 'insensitive' } },
						{ description: { contains: searchQuery, mode: 'insensitive' } }
					]
				}
			});
		} else {
			flags = await prisma.flags.findMany({
				orderBy: { created_at: 'desc' },
				skip: offset,
				take: pageSize
			});
			totalCount = await prisma.flags.count();
		}

		const totalPages = Math.ceil(totalCount / pageSize);

		return {
			flags,
			pagination: {
				page,
				pageSize,
				totalCount,
				totalPages
			},
			searchQuery
		};
	} catch (err) {
		console.error('Error loading flags:', err);
		error(500, 'Failed to load flags');
	}
};
