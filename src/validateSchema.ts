import { validate, Schema } from 'jsonschema'

export const validateSchema = (data: any, schema: Schema) => {
  const result = validate(data, schema)

  if (result.errors && result.errors.length) {
    const firstError = result.errors[0]

    let error: any
    if (firstError.name == 'additionalProperties') {
      error = new Error(firstError.message)
    } else {
      error = new Error(
        `Key ${firstError.property.replace('instance.', '')} is required`
      )
    }

    error.status = 400

    throw error
  }

  return true
}

export default validateSchema
