import z from 'zod';

const schema = z.object({
  id: z.string({
    required_error: "ID is required",
    invalid_type_error: "ID must be a string"
  }),
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string"
  }),
  portfolio: z.string({
    required_error: "portfolio is required",
    invalid_type_error: "portfolio must be a string"
  }).url(),
  salary: z.number({
    invalid_type_error: "salary must be a number"
  }).optional(),
})


type ValidatePayload = z.infer<typeof schema>

const payload: ValidatePayload = {
  id: "35625",
  name: "New user",
  portfolio: "https://dev.to/isnan__h/custom-schema-validation-in-typescript-with-zod-5cp5"
}

const parseSchema = (props: ValidatePayload) => {
  return schema.parse(props)
}

const result = parseSchema(payload)
console.log(JSON.stringify(result))
