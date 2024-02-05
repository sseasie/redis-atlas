import type { FieldType } from "~/index.js"

export const exhaustiveCheck = (value: never, message = `Unhandled case: ${value}`): never => {
    throw new Error(message)
}

export function isArrayOf<T>(
    array: unknown,
    validator: (value: unknown) => value is T,
): array is T[] {
    return Array.isArray(array) && array.every(validator)
}

export const isDefined = <T>(value: T | undefined): value is T => {
    return value !== undefined
}

export const isString = (value: unknown): value is string => {
    return typeof value === "string"
}

export const isNumber = (value: unknown): value is number => {
    return typeof value === "number"
}

export const isBoolean = (value: unknown): value is boolean => {
    return typeof value === "boolean"
}

export const isDate = (value: unknown): value is Date => {
    return value instanceof Date
}

export const validateField = (value: unknown, type: FieldType): void => {
    switch (type) {
        case "string": {
            if (isDefined(value) && !isString(value)) {
                throw new Error("Invalid default value for string type")
            }
            break
        }
        case "string[]": {
            if (isDefined(value) && !isArrayOf(value, isString)) {
                throw new Error("Invalid default value for string[] type")
            }
            break
        }
        case "number": {
            if (isDefined(value) && !isNumber(value)) {
                throw new Error("Invalid default value for number type")
            }
            break
        }
        case "number[]": {
            if (isDefined(value) && !isArrayOf(value, isNumber)) {
                throw new Error("Invalid default value for number[] type")
            }
            break
        }
        case "boolean": {
            if (isDefined(value) && !isBoolean(value)) {
                throw new Error("Invalid default value for boolean type")
            }
            break
        }
        case "date": {
            if (isDefined(value) && !isDate(value)) {
                throw new Error("Invalid default value for date type")
            }
            break
        }
        case "text": {
            if (isDefined(value) && !isString(value)) {
                throw new Error("Invalid default value for text type")
            }
            break
        }
        default: {
            exhaustiveCheck(type, `Invalid schema type: ${type}`)
        }
    }
}
