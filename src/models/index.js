// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { InvoiceForm, JsaForm, CapillaryForm, Template, User, PricingPlan, LaborCost, Consumable, CableDetail, Person, CapillaryFlush } = initSchema(schema);

export {
  InvoiceForm,
  JsaForm,
  CapillaryForm,
  Template,
  User,
  PricingPlan,
  LaborCost,
  Consumable,
  CableDetail,
  Person,
  CapillaryFlush
};