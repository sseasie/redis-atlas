import type { RediSearchSchema } from "redis"
import { SchemaFieldTypes } from "redis"
import type { Field, FieldType } from "~/lib/field.js"
import { exhaustiveCheck } from "./validation.js"

const createNumeric = <T extends FieldType>(field: Field<T>): RediSearchSchema[string] => ({
    type: SchemaFieldTypes.NUMERIC,
    AS: field.name,
    SORTABLE: field.isSortable ? true : undefined,
    NOINDEX: field.isIndexed ? undefined : true,
})

const createTag = <T extends FieldType>(field: Field<T>): RediSearchSchema[string] => ({
    type: SchemaFieldTypes.TAG,
    AS: field.name,
    SORTABLE: field.isSortable ? true : undefined,
    NOINDEX: field.isIndexed ? undefined : true,
})

const createText = <T extends FieldType>(field: Field<T>): RediSearchSchema[string] => ({
    type: SchemaFieldTypes.TEXT,
    AS: field.name,
    SORTABLE: field.isSortable ? true : undefined,
    NOINDEX: field.isIndexed ? undefined : true,
})

export const createRediSearchSchema = <T extends FieldType>(
    fields: Record<string, Field<T>>,
): RediSearchSchema => {
    const schema: RediSearchSchema = {}

    for (const key in fields) {
        const field = fields[key]

        if (field === undefined) {
            continue
        }

        switch (field.type) {
            case "string": {
                schema[field.jsonPath] = createTag(field)
                break
            }
            case "string[]": {
                schema[field.jsonPath] = createTag(field)
                break
            }
            case "number": {
                schema[field.jsonPath] = createNumeric(field)
                break
            }
            case "number[]": {
                schema[field.jsonPath] = createNumeric(field)
                break
            }
            case "boolean": {
                schema[field.jsonPath] = createTag(field)
                break
            }
            case "date": {
                schema[field.jsonPath] = createNumeric(field)
                break
            }
            case "text": {
                schema[field.jsonPath] = createText(field)
                break
            }
            default: {
                exhaustiveCheck(field.type)
            }
        }
    }

    return schema
}
