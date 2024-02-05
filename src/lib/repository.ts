import { nanoid } from "nanoid"
import type { createClient, createCluster } from "redis"
import { createRediSearchSchema } from "~/utils/redis.js"
import { Entity } from "./entity.js"
import type { FieldType } from "./field.js"
import type { Schema, SchemaData } from "./schema.js"

export type RedisConnection = ReturnType<typeof createClient> | ReturnType<typeof createCluster>

export class Repository<T extends Record<string, FieldType>> {
    #redis: RedisConnection
    #schema: Schema<T>

    constructor(redis: RedisConnection, schema: Schema<T>) {
        this.#redis = redis
        this.#schema = schema
    }

    async createIndex(): Promise<void> {
        if (!this.#redis.isOpen) {
            await this.#redis.connect()
        }

        const currentIndexHash = await this.#redis.get(this.#schema.indexHashKey)
        const incomingIndexHash = this.#schema.indexHash

        if (currentIndexHash === incomingIndexHash) {
            return
        }

        if (currentIndexHash) {
            await this.dropIndex()
        }

        const indexSchema = createRediSearchSchema(this.#schema.fields)

        await Promise.all([
            this.#redis.ft.create(this.#schema.indexKey, indexSchema, {
                ON: "JSON",
                PREFIX: `${this.#schema.prefix}:`,
            }),
            this.#redis.set(this.#schema.indexHashKey, incomingIndexHash),
        ])
    }

    async dropIndex(): Promise<void> {
        if (!this.#redis.isOpen) {
            await this.#redis.connect()
        }

        await Promise.all([
            this.#redis.del(this.#schema.indexHashKey),
            this.#redis.ft.dropIndex(this.#schema.indexKey),
        ])
    }

    async save(id: string | undefined, data: SchemaData<T>): Promise<Entity<T>> {
        if (!this.#redis.isOpen) {
            await this.#redis.connect()
        }

        const key = id ? `${this.#schema.prefix}:${id}` : `${this.#schema.prefix}:${nanoid()}`
        await this.#redis.json.set(key, "$", data)
        return new Entity(key, data, this.#redis)
    }
}
