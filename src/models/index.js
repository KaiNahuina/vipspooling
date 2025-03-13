// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { InvoiceForm, JsaForm, Template, User, LaborCost, Consumable, CableDetail, Person } = initSchema(schema);

export {
  InvoiceForm,
  JsaForm,
  Template,
  User,
  LaborCost,
  Consumable,
  CableDetail,
  Person
};