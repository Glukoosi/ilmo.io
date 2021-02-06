import Joi from 'joi';

import * as db from './db';

export interface SchemaTemplate {
  slug: string,
  type: 'registration',
  public: boolean,
  capacity: number,
  capacityMax: number,
  startDate: number,
  endDate: number,
  form: {
    [text: string]: {
      type: 'Text' | 'Email' | 'Select',
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
  form: Joi.object()
    .pattern(Joi.string().min(1).max(20),
      Joi.object({
        type: Joi.string()
          .trim()
          .valid('Text', 'Email', 'Select')
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
  const value = await validateEntry(schema, reg);
  const count = await db.count(String(schema.slug));
  const nowDate = new Date().getTime();
  if (count >= schema.capacityMax) {
    throw new Error('query is full');
  } else if (nowDate < schema.startDate || nowDate > schema.endDate) {
    throw new Error('query is not open');
  } else {
    return value;
  }
}

export async function validateSchema(schema: SchemaTemplate): Promise<SchemaTemplate> {
  return await schemaForSchemas.validateAsync(schema);
}
