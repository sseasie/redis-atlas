export type FieldTypeMap = {
    string: string
    "string[]": string[]
    number: number
    "number[]": number[]
    boolean: boolean
    date: Date
    text: string
}

export type FieldType = keyof FieldTypeMap

export type FieldAttributes<T extends FieldType> = {
    type: T
    isIndexed?: boolean
    isSortable?: boolean
} & (
    | {
          isRequired: true
          defaultValue?: FieldTypeMap[T]
      }
    | {
          isRequired?: false
          defaultValue?: never
      }
)

export class Field<T extends FieldType> {
    name: string
    #attributes: FieldAttributes<T>

    constructor(name: string, attributes: FieldAttributes<T>) {
        this.name = name
        this.#attributes = attributes
    }

    get type(): T {
        return this.#attributes.type
    }

    get defaultValue(): FieldTypeMap[T] | undefined {
        return this.#attributes.defaultValue
    }

    get isRequired(): boolean {
        return this.#attributes.isRequired ?? false
    }

    get isIndexed(): boolean {
        return this.#attributes.isIndexed ?? true
    }

    get isSortable(): boolean {
        return this.#attributes.isSortable ?? false
    }

    // TODO: allow custom jsonPath for flattening nested objects into the schema
    get jsonPath(): string {
        return `$.${this.name}`
    }
}
