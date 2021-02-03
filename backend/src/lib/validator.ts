import Joi from 'joi';

import * as db from './db';

export type SchemaTemplate = {
    slug: string,
    capacity: number,
    capacityMax: number,
    startDate: number,
    endDate: number,
    form: {
      [text: string]: {
        type: string,
        required?: boolean,
        label?: string,
        value?: string,
        options?: string[],
      }
    }
}

export type RegTemplate = {
  name: string,
  email: string,
  [text: string]: string
}

async function validateSchema(schema: SchemaTemplate, reg: RegTemplate): Promise<RegTemplate> {

  const schemaError = new Error('invalid schema');
  schemaError.name = 'ValidationError';

  if (Object.keys(schema.form).length !== Object.keys(reg).length) {
    throw schemaError;
  }

  for (const item in reg) {
    let schemaCheck = Joi.string().trim().label(item);

    if (schema.form[item].required === true) {
      schemaCheck = schemaCheck.required()
    } else {
      schemaCheck = schemaCheck.allow('')
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



export async function validateReg(schema: SchemaTemplate, reg: RegTemplate): Promise<unknown> {
      const value = await validateSchema(schema, reg);
      const count = await db.count(String(schema.slug));
      const nowDate = new Date().getTime();
      if (count >= schema.capacityMax) {
        throw new Error('query is full');
      } else if (nowDate < schema.startDate || nowDate > schema.endDate) {
        throw new Error('query is not open');
      } else {
        return value
      }
}