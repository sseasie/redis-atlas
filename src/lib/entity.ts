import type { FieldType } from "~/lib/field.js"
import type { SchemaData } from "~/lib/schema.js"
import type { RedisConnection } from "./repository.js"

export class Entity<T extends Record<string, FieldType>> {
    data: SchemaData<T>
    key: string
    #redis: RedisConnection

    constructor(key: string, data: SchemaData<T>, redis: RedisConnection) {
        this.key = key
        this.data = data
        this.#redis = redis
    }

    async update(data: Partial<SchemaData<T>>) {
        if (!this.#redis.isOpen) {
            await this.#redis.connect()
        }

        const incomingData = { ...this.data, ...data }
        await this.#redis.json.set(this.key, "$", incomingData)

        this.data = incomingData
        return this
    }
}
