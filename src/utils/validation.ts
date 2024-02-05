export const exhaustiveCheck = (value: never, message = `Unhandled case: ${value}`): never => {
    throw new Error(message)
}

export const validateArray = (array: unknown, validator: (value: unknown) => boolean): boolean => {
    return Array.isArray(array) && array.every(validator)
}
