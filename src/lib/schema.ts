import { createHash } from "node:crypto"
import { validateField } from "~/utils/validation.js"
import type { FieldAttributes, FieldType, FieldTypeMap } from "./field.js"
import { Field } from "./field.js"

export type SchemaDefinition<T extends Record<string, FieldType>> = {
    [K in keyof T]: FieldAttributes<T[K]>
}

export type SchemaData<T extends Record<string, FieldType>> = {
    [K in keyof T]: FieldTypeMap[T[K]]
}

export class Schema<T extends Record<string, FieldType>> {
    #_definition: SchemaDefinition<T>
    readonly prefix: string

    constructor(prefix: string, definition: SchemaDefinition<T>) {
        this.#_definition = definition
        this.prefix = prefix

        for (const key in this.fields) {
            const field = this.fields[key]
            validateField(field.defaultValue, field.type)
        }
    }

    get fields(): Record<keyof T, Field<T[keyof T]>> {
        const fields = {} as Record<keyof T, Field<T[keyof T]>> // beware of type assertion
        for (const key in this.#_definition) {
            fields[key] = new Field(key, this.#_definition[key])
        }
        return fields
    }

    get #fieldSignatures(): string[] {
        return Object.values(this.fields).map((field) => `${field.name}${field.type}`)
    }

    get indexHash(): string {
        const data: string[] = [this.prefix, ...this.#fieldSignatures].sort((a, b) =>
            a.localeCompare(b),
        )

        return createHash("sha1").update(data.join("")).digest("base64url")
    }

    get indexKey(): string {
        return `${this.prefix}:index`
    }

    get indexHashKey(): string {
        return `${this.indexKey}:hash`
    }
}
