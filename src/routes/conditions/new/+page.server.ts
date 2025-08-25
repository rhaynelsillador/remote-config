import type { PageServerLoad, Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import sql from '$lib/server/db';

export const load = (async () => {
    try {
        // Get all parameters that can be used as target parameters (not conditions themselves)
        const parameters = await prisma.parameters.findMany({
            where: {
                targeting_key: null, // Only main parameters, not conditions
            },
            select: {
                id: true,
                key: true,
                code: true,
                variant: true
            },
            orderBy: {
                key: 'asc'
            }
        });

        return {
            parameters
        };
    } catch (err) {
        console.error('Error loading parameters:', err);
        throw error(500, {
            message: 'Error loading parameters'
        });
    }
}) satisfies PageServerLoad;

export const actions = {
    create: async ({ request }) => {
        try {
            const data = await request.formData();
            const rulesJson = data.get('rules') as string;
            let rules = [];
            
            if (rulesJson) {
                try {
                    rules = JSON.parse(rulesJson);
                } catch (e) {
                    console.warn('Invalid rules JSON:', rulesJson);
                }
            }
            
            // Debug log the form data
            console.log('Creating condition with data:', {
                name: data.get('name'),
                description: data.get('description'),
                rules: rules
            });
            
            // Insert into conditions table using raw SQL
            const result = await sql`
                INSERT INTO conditions (name, description, condition_json)
                VALUES (${data.get('name') as string}, ${data.get('description') as string}, ${rules}::jsonb)
                RETURNING id
            `;
            
            console.log('Insert result:', result);

            throw redirect(303, `/conditions`);
        } catch (err) {
            if (err instanceof Response) throw err;
            
            console.error('Error creating condition:', err);
            return {
                success: false,
                error: 'Failed to create condition'
            };
        }
    }
} satisfies Actions;
