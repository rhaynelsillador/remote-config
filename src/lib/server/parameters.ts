import type { Row, RowList } from 'postgres';
import sql from './db';
export async function create(key?: string | null, code?: string, default_value?: string, description?: string | null, variant?: string, conditions? : any, targeting_key? : number | null): Promise<boolean> {
	try {
		console.log("create flag", key, code, default_value, description, variant, conditions, targeting_key)
		if(targeting_key === "" || targeting_key === "null" || targeting_key === null || targeting_key === undefined) {
			targeting_key = null
		}
		const [flag] = await sql`
				insert into parameters
				(key, code, default_value, description, variant, environment, targeting_key)
				values
				(${key}, ${code}, ${default_value}, ${description}, ${variant}, ${"uat"}, ${targeting_key ?? null})
				RETURNING id
				`

		console.log("create flag done", flag)
				
		for (const condition of conditions) {
			console.log(
				'condition',
				`INSERT INTO parameter_condition (parameter_id, condition_id, value, condition_order)
				VALUES (${flag.id}, ${condition.id}, ${condition.value}, ${condition.condition_order})`
			);

			await sql`
				INSERT INTO parameter_condition (parameter_id, condition_id, value, condition_order)
				VALUES (${flag.id}, ${condition.id}, ${condition.value}, ${condition.condition_order})
			`;
			}

		await sql`
				UPDATE parameter_versions set version = version + 1
			`;

		return Promise.resolve(true)
	} catch (err) {
		console.log(err)
		return Promise.reject(err)
	}
}

export async function update(flag: { id: string, key: string; code: number, default_value: string, variant: string, description: string, conditions: Record<string, any>}): Promise<boolean> {
	console.log("update flag", 'update parameters set key='+flag.key+', code='+flag.code+', default_value='+flag.default_value+', variant='+flag.variant+', description='+flag.description+' where id='+flag.id)
	try {
		await sql`
				update parameters
				set key=${flag.key}, code=${flag.code}, default_value=${flag.default_value}, variant=${flag.variant}, description=${flag.description}
				where id=${flag.id};
				`

		await sql`
				delete from parameter_condition where parameter_id = ${flag.id};
				`


		for (const condition of flag.conditions) {
			console.log(
				'condition',
				`INSERT INTO parameter_condition (parameter_id, condition_id, value, condition_order)
				VALUES (${flag.id}, ${condition.id}, ${condition.value}, ${condition.condition_order})`
			);

			await sql`
				INSERT INTO parameter_condition (parameter_id, condition_id, value, condition_order)
				VALUES (${flag.id}, ${condition.id}, ${condition.value}, ${condition.condition_order})
			`;
		}

		await sql`
			UPDATE parameter_versions set version = version + 1
		`;
			

		console.log("update flag done")
		// console.log("update flag done", result)
		// console.log("result", result)
		// if (result.count > 0) {
		// 	return Promise.resolve(true)
		// }
		return Promise.resolve(true)
	} catch (err) {
		console.log("err", err)
		return Promise.reject(err)
	}
}



export async function getById(id: string): Promise<Row> {
	try {
		const result = await sql`select * from parameters where id = ${id} `;
		if (result.length > 0) {
			return Promise.resolve(result[0])
		}
		return Promise.reject()
	} catch (err) {
		return Promise.reject(err)
	}
}

export async function getByCode(code: string): Promise<RowList<Row[]>> {
	console.log("getByCode", code)
	try {
		const result = await sql`
		select p.*, 
		(SELECT json_agg(p1) FROM parameters p1 where p1.targeting_key = p.id) as sub_params,
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
		from parameters p where environment = 'uat' AND targeting_key is NULL
		`;
		console.log("getByCode result", result)
		return Promise.resolve(result)
	} catch (err) {
		return Promise.reject(err)
	}
}

export async function count(code: string, key: string, targetKey: string): Promise<number> {
	try {
		const result = await sql`select * from parameters
					where code = ${code}
					AND targeting_key = ${targetKey}
					AND key = ${key}`;
		return Promise.resolve(result.count)
	} catch (err) {
		return Promise.reject(err)
	}
}


export async function createTarget(key?: string, code?: string, value?: string, targeting_key?: string, platform?: string): Promise<boolean> {
	try {
		const flag = await sql`
				insert into flags
				(key, code, value, platform, variant, targeting_version, targeting_key)
				values
				(${key}, ${code}, ${value}, ${platform}, ${"default"}, ${"*"}, ${targeting_key})
				`
		return Promise.resolve(true)
	} catch (err) {
		console.log(err)
		return Promise.reject(err)
	}
}

export async function getAllTargets(code: string, key: string, platform: string): Promise<RowList<Row[]>> {
	try {
		const result = await sql`select * from flags 
					where code = ${code}
					AND targeting_key is not NULL
					AND key = ${key}
					AND platform = ${platform}`;
		return Promise.resolve(result)
	} catch (err) {
		return Promise.reject(err)
	}
}

export async function getAllTagConditions(targeting_key: string): Promise<RowList<Row[]>> {
	try {
		const result = await sql`SELECT c.*, pc.value, pc.condition_order
			FROM conditions c 
			INNER JOIN parameter_condition pc on pc.condition_id = c.id
			WHERE pc.parameter_id = ${targeting_key}
			ORDER BY pc.condition_order asc`;
		return Promise.resolve(result)
	} catch (err) {
		return Promise.reject(err)
	}
}	

export async function getAllConditions(): Promise<RowList<Row[]>> {
	try {
		const result = await sql`SELECT * FROM conditions ORDER BY name ASC`;
		return Promise.resolve(result)
	} catch (err) {
		return Promise.reject(err)
	}
}	