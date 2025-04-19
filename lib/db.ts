/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as fs from "fs";
import * as pg from "pg";

export default class Database {
	private static instance: Database | undefined;
	private pool: pg.Pool;

	private constructor() {
		this.pool = new pg.Pool({
			connectionString: process.env.DATABASE_URL,
			ssl: !process.env.DATABASE_URL?.includes("localhost") && !process.env.DATABASE_URL?.includes("docker"),
		});
	}

	public static getInstance(): Database {
		if (!Database.instance) {
            Database.instance = new Database();
            Database.instance.createTables().catch((error) => {
                console.error("Error creating tables:", error);
            });
		}
		return Database.instance;
	}

	public async query<T extends pg.QueryResultRow>(
		queryText: string,
		values?: unknown[]
	): Promise<pg.QueryResult<T> & { error?: string }> {
		// const start = Date.now();
		try {
			// const duration = Date.now() - start;
			const result = await this.pool.query<T>(queryText, values);
			// console.log("executed query", { queryText, duration, rows: result.rowCount });
			return result;
		} catch (error) {
			console.error("error running query", { queryText, values, error });
			return { rows: [], rowCount: 0, command: "", oid: 0, fields: [], error: (error as Error).message };
		}
	}

	public async queryOne<T extends pg.QueryResultRow>(queryText: string, values?: unknown[]): Promise<T> {
		const result = await this.query<T>(queryText, values);
		return result.rows[0];
	}

	public async executeSql(filePath: string): Promise<void> {
		const sql = fs.readFileSync(filePath, "utf8");
		await this.query(sql);
	}

	public async createTables(): Promise<void> {
		await this.executeSql("bin/tables.sql");
	}

	public async clear(): Promise<void> {
		const sql = `SELECT * FROM databases;`;
		const result = await this.query<{ db_name: string; db_user: string }>(sql);
		const databases = result.rows;
		for (const database of databases) {
			await this.query(`DROP DATABASE IF EXISTS ${database.db_name};`);
			await this.query(`DROP ROLE IF EXISTS ${database.db_user};`);
		}
		await this.dropTables();
	}

	public async dropTables(): Promise<void> {
		const sql = `
			DROP TABLE IF EXISTS auth_sessions CASCADE;
			DROP TABLE IF EXISTS verification_tokens CASCADE;
			DROP TABLE IF EXISTS accounts CASCADE;
			DROP TABLE IF EXISTS databases CASCADE;
			DROP TABLE IF EXISTS users CASCADE;
			DROP TABLE IF EXISTS user_logs CASCADE;
			DROP TABLE IF EXISTS database_logs CASCADE;
		`;
		await this.query(sql);
	}

	public async clearAllTables(): Promise<void> {
		const sql = `
			DELETE FROM auth_sessions;
			DELETE FROM verification_tokens;
			DELETE FROM accounts;
			DELETE FROM databases;
			DELETE FROM users;
			DELETE FROM user_logs;
			DELETE FROM database_logs;
		`;
		await this.query(sql);
	}
}
