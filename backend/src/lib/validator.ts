import Joi from 'joi';

import * as db from './db';

export interface SchemaTemplate {
  slug: string,
  type: 'registration',
  public: boolean,
  capacity: number,
  capacityMax: number,
  startDate: Date,
  endDate: Date,
  apiKey: string,
  form: {
    [text: string]: {
      type: 'Text' | 'TextArea' | 'Email' | 'Select',
      label: string,
      required?: boolean,
      options?: string[],
    }
  }
}

export interface RegTemplate {
  name: string,
  email: string,
  [text: string]: string
}

const schemaForSchemas = Joi.object({
  slug: Joi.string()
    .trim()
    .alphanum()
    .min(1)
    .max(100)
    .invalid('schemas', 'users')
    .required(),
  type: Joi.string()
    .trim()
    .valid('registration')
    .required(),
  heading: Joi.string()
    .trim()
    .min(1)
    .max(500)
    .required(),
  description: Joi.string()
    .trim()
    .min(1)
    .max(2000),
  public: Joi.boolean()
    .required(),
  capacity: Joi.number()
    .integer()
    .min(1)
    .max(500)
    .required(),
  capacityMax: Joi.number()
    .integer()
    .min(1)
    .max(500)
    .required(),
  startDate: Joi.date()
    .timestamp()
    .required(),
  endDate: Joi.date()
    .timestamp()
    .greater(Joi.ref('startDate')),
  form: Joi.object({
    name: Joi.object({
      type: Joi.string()
        .trim()
        .valid('Text')
        .required(),
      label: Joi.string()
        .trim()
        .min(1)
        .max(255)
        .required(),
      required: true,
    }),
    email: Joi.object({
      type: Joi.string()
        .trim()
        .valid('Email')
        .required(),
      label: Joi.string()
        .trim()
        .min(1)
        .max(255)
        .required(),
      required: true,
    })
  })
    .pattern(Joi.string().min(1).max(20),
      Joi.object({
        type: Joi.string()
          .trim()
          .valid('Text', 'TextArea', 'Email', 'Select')
          .required(),
        label: Joi.string()
          .trim()
          .min(1)
          .max(255)
          .required(),
        required: Joi.boolean(),
        options: Joi.array()
          .items(Joi.string()
            .min(1)
            .max(100)
          )
          .max(50)
      })
    )
    .max(50)
})

async function validateEntry(schema: SchemaTemplate, reg: RegTemplate): Promise<RegTemplate> {

  const schemaError = new Error('invalid schema');
  schemaError.name = 'ValidationError';

  if (Object.keys(schema.form).length !== Object.keys(reg).length) {
    throw schemaError;
  }

  for (const item in reg) {
    let schemaCheck = Joi.string().trim().label(item);

    if (schema.form[item].required === true) {
      schemaCheck = schemaCheck.required();
    } else {
      schemaCheck = schemaCheck.allow('');
    }

    switch (schema.form[item].type) {
      case 'Text': {
        schemaCheck = schemaCheck
          .max(255);
        break;
      }
      case 'TextArea': {
        schemaCheck = schemaCheck
          .max(2000);
        break;
      }
      case 'Email': {
        schemaCheck = schemaCheck
          .email()
          .max(255);
        break;
      }
      case 'Select': {
        schemaCheck = schemaCheck
          .max(255);
          if (!schema.form[item].options?.includes(reg[item]) && schema.form[item].required) {
            schemaError.message = `"${item}" has to be one of the options`
            throw schemaError;
          }
        break;
      }
      default: {
        throw schemaError;
      }
    }
    reg[item] = Joi.attempt(reg[item], schemaCheck) 
  }
  return reg;
}

export async function validateReg(schema: SchemaTemplate, reg: RegTemplate): Promise<RegTemplate> {
  const validationError = new Error('invalid schema');
  validationError.name = 'ValidationError';

  const value = await validateEntry(schema, reg);
  const count = await db.count(String(schema.slug));
  const nowDate = new Date();
  if (count >= schema.capacityMax) {
    validationError.message = 'query is full'
    throw validationError;
  } else if (nowDate < schema.startDate || nowDate > schema.endDate) {
    validationError.message = 'query is not open'
    throw validationError;
  } else {
    return value;
  }
}

export async function validateSchema(schema: SchemaTemplate): Promise<SchemaTemplate> {
  schema.startDate = new Date(schema.startDate)
  schema.endDate = new Date(schema.endDate)
  return await schemaForSchemas.validateAsync(schema);
}
