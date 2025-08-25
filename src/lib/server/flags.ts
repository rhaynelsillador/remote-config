import type { Row, RowList } from 'postgres';
import sql from './db';

export async function create(key?: string, code?: string, value?: string, meta?: string, platform?: string): Promise<boolean> {
	try {
		const flag = await sql`
				insert into flags
				(key, code, value, meta_data, platform, variant, targeting_version)
				values
				(${key}, ${code}, ${value}, ${meta}, ${platform}, ${"default"}, ${"*"})
				`
		console.log("flagflag" , flag)
		return Promise.resolve(true)
	} catch (err) {
		console.log(err)
		return Promise.reject(err)
	}
}

export async function update(flag: { id: string, key: string; code: number, value: string, meta: string, platform: string }): Promise<boolean> {
	try {
		const r = await sql`
				update flags
				set key=${flag.key}, code=${flag.code}, value=${flag.value}, meta_data=${flag.meta}, platform=${flag.platform}
				where id=${flag.id}
				`
		console.log(r)
		return Promise.resolve(true)
	} catch (err) {
		console.log(err)
		return Promise.reject(err)
	}
}

export async function getById(id: string): Promise<Row> {
	try {
		const result = await sql`select * from flags where id = ${id} `;
		if (result.length > 0) {
			return Promise.resolve(result[0])
		}
		return Promise.reject()
	} catch (err) {
		return Promise.reject(err)
	}
}

export async function getByCode(code: string): Promise<RowList<Row[]>> {
	try {
		const result = await sql`select * from flags where code = ${code} AND targeting_key is NULL`;

		return Promise.resolve(result)
	} catch (err) {
		return Promise.reject(err)
	}
}

export async function count(code: string, key: string, targetKey: string): Promise<number> {
	try {
		const result = await sql`select * from flags
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
