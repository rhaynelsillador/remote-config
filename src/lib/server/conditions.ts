import sql from './db';
import type { Row, RowList } from 'postgres';

export async function getAllConditions(search?: string, limit?: number, offset?: number): Promise<RowList<Row[]>> {
    try {
        const whereClause = search ? sql`WHERE (c.name ILIKE ${'%' + search + '%'})` : sql``;
        const limitClause = limit ? sql`LIMIT ${limit}` : sql``;
        const offsetClause = offset ? sql`OFFSET ${offset}` : sql``;
        
        const result = await sql`
            SELECT c.*
            FROM conditions c
            ${whereClause}
            ORDER BY c.name ASC
            ${limitClause}
            ${offsetClause}
        `;
        
        return result;
    } catch (err) {
        console.error('Error getting all conditions:', err);
        throw err;
    }
}

export async function getConditionById(id: number): Promise<Row | null> {
    try {
        const result = await sql`
            SELECT c.*
            FROM conditions c
            WHERE c.id = ${id}
        `;
        
        return result.length > 0 ? result[0] : null;
    } catch (err) {
        console.error('Error getting condition by id:', err);
        throw err;
    }
}

export async function createCondition(
    name: string, 
    description: string | null = null, 
    rules: any[] = []
): Promise<Row> {
    try {
        const result = await sql`
            INSERT INTO conditions (name, description, condition_json, created_at, updated_at)
            VALUES (${name}, ${description}, ${JSON.stringify(rules)}::jsonb, NOW(), NOW())
            RETURNING *
        `;
        
        return result[0];
    } catch (err) {
        console.error('Error creating condition:', err);
        throw err;
    }
}

export async function updateCondition(
    id: number,
    name: string,
    description: string | null = null,
    rules: any[] = []
): Promise<Row | null> {
    try {
        const result = await sql`
            UPDATE conditions 
            SET name = ${name}, 
                description = ${description}, 
                condition_json = ${JSON.stringify(rules)}::jsonb,
                updated_at = NOW()
            WHERE id = ${id}
            RETURNING *
        `;
        
        return result.length > 0 ? result[0] : null;
    } catch (err) {
        console.error('Error updating condition:', err);
        throw err;
    }
}

export async function deleteCondition(id: number): Promise<boolean> {
    try {
        // Check if condition is being used
        const usage = await sql`
            SELECT COUNT(*) as count
            FROM parameter_condition pc
            WHERE pc.condition_id = ${id}
        `;
        
        if (usage[0].count > 0) {
            throw new Error(`Cannot delete condition. It is used by ${usage[0].count} parameter(s).`);
        }
        
        const result = await sql`
            DELETE FROM conditions 
            WHERE id = ${id}
        `;
        
        return result.count > 0;
    } catch (err) {
        console.error('Error deleting condition:', err);
        throw err;
    }
}

export async function getParametersUsingCondition(conditionId: number): Promise<any[]> {
    try {
        const result = await sql`
            SELECT DISTINCT p.id, p.key, p.variant, p.default_value, pc.value as condition_value
            FROM parameters p
            JOIN parameter_condition pc ON p.id = pc.parameter_id
            WHERE pc.condition_id = ${conditionId}
            ORDER BY p.key ASC
        `;
        
        return result;
    } catch (err) {
        console.error('Error getting parameters using condition:', err);
        throw err;
    }
}

export async function countConditions(search?: string): Promise<number> {
    try {
        const whereClause = search ? sql`WHERE (c.name ILIKE ${'%' + search + '%'})` : sql``;
        
        const result = await sql`
            SELECT COUNT(*) as total
            FROM conditions c
            ${whereClause}
        `;
        
        return Number(result[0].total);
    } catch (err) {
        console.error('Error counting conditions:', err);
        throw err;
    }
}
