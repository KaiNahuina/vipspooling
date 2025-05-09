/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateInvoiceFormInput = {
  WorkTicketID: string,
  InvoiceDate: string,
  Spooler: string,
  WorkType: string,
  CableCompany: string,
  CableCompanyLocation: string,
  OilCompany: string,
  WellName: string,
  WellNumber: string,
  LaborCosts: Array< LaborCostInput | null >,
  JobType: Array< string | null >,
  Consumables: Array< ConsumableInput | null >,
  Notes?: string | null,
  CableDetails?: CableDetailInput | null,
  ReelNumber: string,
  ExtraCharges?: number | null,
  InvoiceTotal: number,
  CustomerSignature: string,
  FinalProductFile?: string | null,
  _version?: number | null,
};

export type LaborCostInput = {
  rate?: number | null,
  qty?: number | null,
  amount?: number | null,
};

export type ConsumableInput = {
  item?: string | null,
  qty?: number | null,
  rate?: number | null,
  amount?: number | null,
};

export type CableDetailInput = {
  CableType?: string | null,
  CableLength?: number | null,
};

export type ModelInvoiceFormConditionInput = {
  InvoiceDate?: ModelStringInput | null,
  Spooler?: ModelStringInput | null,
  WorkType?: ModelStringInput | null,
  CableCompany?: ModelStringInput | null,
  CableCompanyLocation?: ModelStringInput | null,
  OilCompany?: ModelStringInput | null,
  WellName?: ModelStringInput | null,
  WellNumber?: ModelStringInput | null,
  JobType?: ModelStringInput | null,
  Notes?: ModelStringInput | null,
  ReelNumber?: ModelStringInput | null,
  ExtraCharges?: ModelFloatInput | null,
  InvoiceTotal?: ModelFloatInput | null,
  CustomerSignature?: ModelStringInput | null,
  FinalProductFile?: ModelStringInput | null,
  and?: Array< ModelInvoiceFormConditionInput | null > | null,
  or?: Array< ModelInvoiceFormConditionInput | null > | null,
  not?: ModelInvoiceFormConditionInput | null,
  _deleted?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type InvoiceForm = {
  __typename: "InvoiceForm",
  WorkTicketID: string,
  InvoiceDate: string,
  Spooler: string,
  WorkType: string,
  CableCompany: string,
  CableCompanyLocation: string,
  OilCompany: string,
  WellName: string,
  WellNumber: string,
  LaborCosts:  Array<LaborCost | null >,
  JobType: Array< string | null >,
  Consumables:  Array<Consumable | null >,
  Notes?: string | null,
  CableDetails?: CableDetail | null,
  ReelNumber: string,
  ExtraCharges?: number | null,
  InvoiceTotal: number,
  CustomerSignature: string,
  FinalProductFile?: string | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export type LaborCost = {
  __typename: "LaborCost",
  rate?: number | null,
  qty?: number | null,
  amount?: number | null,
};

export type Consumable = {
  __typename: "Consumable",
  item?: string | null,
  qty?: number | null,
  rate?: number | null,
  amount?: number | null,
};

export type CableDetail = {
  __typename: "CableDetail",
  CableType?: string | null,
  CableLength?: number | null,
};

export type UpdateInvoiceFormInput = {
  WorkTicketID: string,
  InvoiceDate?: string | null,
  Spooler?: string | null,
  WorkType?: string | null,
  CableCompany?: string | null,
  CableCompanyLocation?: string | null,
  OilCompany?: string | null,
  WellName?: string | null,
  WellNumber?: string | null,
  LaborCosts?: Array< LaborCostInput | null > | null,
  JobType?: Array< string | null > | null,
  Consumables?: Array< ConsumableInput | null > | null,
  Notes?: string | null,
  CableDetails?: CableDetailInput | null,
  ReelNumber?: string | null,
  ExtraCharges?: number | null,
  InvoiceTotal?: number | null,
  CustomerSignature?: string | null,
  FinalProductFile?: string | null,
  _version?: number | null,
};

export type DeleteInvoiceFormInput = {
  WorkTicketID: string,
  _version?: number | null,
};

export type CreateJsaFormInput = {
  WorkTicketID: string,
  CustomerName: string,
  CreatedBy: string,
  FormDate: string,
  EffectiveDate: string,
  Location: string,
  Personnel: Array< PersonInput | null >,
  FinalProductFile?: string | null,
  _version?: number | null,
};

export type PersonInput = {
  Role: string,
  PersonName: string,
  Signature: string,
};

export type ModelJsaFormConditionInput = {
  WorkTicketID?: ModelStringInput | null,
  CreatedBy?: ModelStringInput | null,
  FormDate?: ModelStringInput | null,
  EffectiveDate?: ModelStringInput | null,
  Location?: ModelStringInput | null,
  FinalProductFile?: ModelStringInput | null,
  and?: Array< ModelJsaFormConditionInput | null > | null,
  or?: Array< ModelJsaFormConditionInput | null > | null,
  not?: ModelJsaFormConditionInput | null,
  _deleted?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type JsaForm = {
  __typename: "JsaForm",
  WorkTicketID: string,
  CustomerName: string,
  CreatedBy: string,
  FormDate: string,
  EffectiveDate: string,
  Location: string,
  Personnel:  Array<Person | null >,
  FinalProductFile?: string | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export type Person = {
  __typename: "Person",
  Role: string,
  PersonName: string,
  Signature: string,
};

export type UpdateJsaFormInput = {
  WorkTicketID?: string | null,
  CustomerName: string,
  CreatedBy?: string | null,
  FormDate?: string | null,
  EffectiveDate?: string | null,
  Location?: string | null,
  Personnel?: Array< PersonInput | null > | null,
  FinalProductFile?: string | null,
  _version?: number | null,
};

export type DeleteJsaFormInput = {
  CustomerName: string,
  _version?: number | null,
};

export type CreateCapillaryFormInput = {
  WorkTicketID: string,
  SubmissionDate?: string | null,
  Date: string,
  TechnicianName: string,
  Customer: string,
  WellName: string,
  TypeOfJob: string,
  VisualConfirmation: string,
  IntervalPumping: string,
  PressureWhilePumping: string,
  PressureBleed: string,
  CapillaryFlush: string,
  ManifoldStatus: string,
  LineTest: string,
  CapillarySize: string,
  Metallurgy: string,
  Length: string,
  FluidPumped: string,
  TotalGallons: string,
  Notes?: string | null,
  FinalProductFile?: string | null,
  _version?: number | null,
};

export type ModelCapillaryFormConditionInput = {
  SubmissionDate?: ModelStringInput | null,
  Date?: ModelStringInput | null,
  TechnicianName?: ModelStringInput | null,
  Customer?: ModelStringInput | null,
  WellName?: ModelStringInput | null,
  TypeOfJob?: ModelStringInput | null,
  VisualConfirmation?: ModelStringInput | null,
  IntervalPumping?: ModelStringInput | null,
  PressureWhilePumping?: ModelStringInput | null,
  PressureBleed?: ModelStringInput | null,
  CapillaryFlush?: ModelStringInput | null,
  ManifoldStatus?: ModelStringInput | null,
  LineTest?: ModelStringInput | null,
  CapillarySize?: ModelStringInput | null,
  Metallurgy?: ModelStringInput | null,
  Length?: ModelStringInput | null,
  FluidPumped?: ModelStringInput | null,
  TotalGallons?: ModelStringInput | null,
  Notes?: ModelStringInput | null,
  FinalProductFile?: ModelStringInput | null,
  and?: Array< ModelCapillaryFormConditionInput | null > | null,
  or?: Array< ModelCapillaryFormConditionInput | null > | null,
  not?: ModelCapillaryFormConditionInput | null,
  _deleted?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CapillaryForm = {
  __typename: "CapillaryForm",
  WorkTicketID: string,
  SubmissionDate?: string | null,
  Date: string,
  TechnicianName: string,
  Customer: string,
  WellName: string,
  TypeOfJob: string,
  VisualConfirmation: string,
  IntervalPumping: string,
  PressureWhilePumping: string,
  PressureBleed: string,
  CapillaryFlush: string,
  ManifoldStatus: string,
  LineTest: string,
  CapillarySize: string,
  Metallurgy: string,
  Length: string,
  FluidPumped: string,
  TotalGallons: string,
  Notes?: string | null,
  FinalProductFile?: string | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export type UpdateCapillaryFormInput = {
  WorkTicketID: string,
  SubmissionDate?: string | null,
  Date?: string | null,
  TechnicianName?: string | null,
  Customer?: string | null,
  WellName?: string | null,
  TypeOfJob?: string | null,
  VisualConfirmation?: string | null,
  IntervalPumping?: string | null,
  PressureWhilePumping?: string | null,
  PressureBleed?: string | null,
  CapillaryFlush?: string | null,
  ManifoldStatus?: string | null,
  LineTest?: string | null,
  CapillarySize?: string | null,
  Metallurgy?: string | null,
  Length?: string | null,
  FluidPumped?: string | null,
  TotalGallons?: string | null,
  Notes?: string | null,
  FinalProductFile?: string | null,
  _version?: number | null,
};

export type DeleteCapillaryFormInput = {
  WorkTicketID: string,
  _version?: number | null,
};

export type CreateTemplateInput = {
  TemplateID: string,
  Version: string,
  TemplateDate?: string | null,
  Content?: string | null,
  file: string,
  _version?: number | null,
};

export type ModelTemplateConditionInput = {
  Version?: ModelStringInput | null,
  TemplateDate?: ModelStringInput | null,
  Content?: ModelStringInput | null,
  file?: ModelStringInput | null,
  and?: Array< ModelTemplateConditionInput | null > | null,
  or?: Array< ModelTemplateConditionInput | null > | null,
  not?: ModelTemplateConditionInput | null,
  _deleted?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type Template = {
  __typename: "Template",
  TemplateID: string,
  Version: string,
  TemplateDate?: string | null,
  Content?: string | null,
  file: string,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export type UpdateTemplateInput = {
  TemplateID: string,
  Version?: string | null,
  TemplateDate?: string | null,
  Content?: string | null,
  file?: string | null,
  _version?: number | null,
};

export type DeleteTemplateInput = {
  TemplateID: string,
  _version?: number | null,
};

export type CreateUserInput = {
  UserID: string,
  Name: string,
  Email: string,
  Role: string,
  phoneNumber?: string | null,
  _version?: number | null,
};

export type ModelUserConditionInput = {
  Name?: ModelStringInput | null,
  Email?: ModelStringInput | null,
  Role?: ModelStringInput | null,
  phoneNumber?: ModelStringInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
  _deleted?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type User = {
  __typename: "User",
  UserID: string,
  Name: string,
  Email: string,
  Role: string,
  phoneNumber?: string | null,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export type UpdateUserInput = {
  UserID: string,
  Name?: string | null,
  Email?: string | null,
  Role?: string | null,
  phoneNumber?: string | null,
  _version?: number | null,
};

export type DeleteUserInput = {
  UserID: string,
  _version?: number | null,
};

export type CreatePricingPlanInput = {
  id?: string | null,
  PlanID: string,
  PlanDate?: string | null,
  Description?: string | null,
  file: string,
  _version?: number | null,
};

export type ModelPricingPlanConditionInput = {
  PlanID?: ModelStringInput | null,
  PlanDate?: ModelStringInput | null,
  Description?: ModelStringInput | null,
  file?: ModelStringInput | null,
  and?: Array< ModelPricingPlanConditionInput | null > | null,
  or?: Array< ModelPricingPlanConditionInput | null > | null,
  not?: ModelPricingPlanConditionInput | null,
  _deleted?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type PricingPlan = {
  __typename: "PricingPlan",
  id: string,
  PlanID: string,
  PlanDate?: string | null,
  Description?: string | null,
  file: string,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export type UpdatePricingPlanInput = {
  id: string,
  PlanID?: string | null,
  PlanDate?: string | null,
  Description?: string | null,
  file?: string | null,
  _version?: number | null,
};

export type DeletePricingPlanInput = {
  id: string,
  _version?: number | null,
};

export type ModelInvoiceFormFilterInput = {
  WorkTicketID?: ModelIDInput | null,
  InvoiceDate?: ModelStringInput | null,
  Spooler?: ModelStringInput | null,
  WorkType?: ModelStringInput | null,
  CableCompany?: ModelStringInput | null,
  CableCompanyLocation?: ModelStringInput | null,
  OilCompany?: ModelStringInput | null,
  WellName?: ModelStringInput | null,
  WellNumber?: ModelStringInput | null,
  JobType?: ModelStringInput | null,
  Notes?: ModelStringInput | null,
  ReelNumber?: ModelStringInput | null,
  ExtraCharges?: ModelFloatInput | null,
  InvoiceTotal?: ModelFloatInput | null,
  CustomerSignature?: ModelStringInput | null,
  FinalProductFile?: ModelStringInput | null,
  id?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelInvoiceFormFilterInput | null > | null,
  or?: Array< ModelInvoiceFormFilterInput | null > | null,
  not?: ModelInvoiceFormFilterInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelInvoiceFormConnection = {
  __typename: "ModelInvoiceFormConnection",
  items:  Array<InvoiceForm | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelJsaFormFilterInput = {
  WorkTicketID?: ModelStringInput | null,
  CustomerName?: ModelStringInput | null,
  CreatedBy?: ModelStringInput | null,
  FormDate?: ModelStringInput | null,
  EffectiveDate?: ModelStringInput | null,
  Location?: ModelStringInput | null,
  FinalProductFile?: ModelStringInput | null,
  id?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelJsaFormFilterInput | null > | null,
  or?: Array< ModelJsaFormFilterInput | null > | null,
  not?: ModelJsaFormFilterInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelJsaFormConnection = {
  __typename: "ModelJsaFormConnection",
  items:  Array<JsaForm | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelCapillaryFormFilterInput = {
  WorkTicketID?: ModelStringInput | null,
  SubmissionDate?: ModelStringInput | null,
  Date?: ModelStringInput | null,
  TechnicianName?: ModelStringInput | null,
  Customer?: ModelStringInput | null,
  WellName?: ModelStringInput | null,
  TypeOfJob?: ModelStringInput | null,
  VisualConfirmation?: ModelStringInput | null,
  IntervalPumping?: ModelStringInput | null,
  PressureWhilePumping?: ModelStringInput | null,
  PressureBleed?: ModelStringInput | null,
  CapillaryFlush?: ModelStringInput | null,
  ManifoldStatus?: ModelStringInput | null,
  LineTest?: ModelStringInput | null,
  CapillarySize?: ModelStringInput | null,
  Metallurgy?: ModelStringInput | null,
  Length?: ModelStringInput | null,
  FluidPumped?: ModelStringInput | null,
  TotalGallons?: ModelStringInput | null,
  Notes?: ModelStringInput | null,
  FinalProductFile?: ModelStringInput | null,
  id?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelCapillaryFormFilterInput | null > | null,
  or?: Array< ModelCapillaryFormFilterInput | null > | null,
  not?: ModelCapillaryFormFilterInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelCapillaryFormConnection = {
  __typename: "ModelCapillaryFormConnection",
  items:  Array<CapillaryForm | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelTemplateFilterInput = {
  TemplateID?: ModelIDInput | null,
  Version?: ModelStringInput | null,
  TemplateDate?: ModelStringInput | null,
  Content?: ModelStringInput | null,
  file?: ModelStringInput | null,
  id?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelTemplateFilterInput | null > | null,
  or?: Array< ModelTemplateFilterInput | null > | null,
  not?: ModelTemplateFilterInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelTemplateConnection = {
  __typename: "ModelTemplateConnection",
  items:  Array<Template | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelUserFilterInput = {
  UserID?: ModelIDInput | null,
  Name?: ModelStringInput | null,
  Email?: ModelStringInput | null,
  Role?: ModelStringInput | null,
  phoneNumber?: ModelStringInput | null,
  id?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelPricingPlanFilterInput = {
  id?: ModelIDInput | null,
  PlanID?: ModelStringInput | null,
  PlanDate?: ModelStringInput | null,
  Description?: ModelStringInput | null,
  file?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelPricingPlanFilterInput | null > | null,
  or?: Array< ModelPricingPlanFilterInput | null > | null,
  not?: ModelPricingPlanFilterInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelPricingPlanConnection = {
  __typename: "ModelPricingPlanConnection",
  items:  Array<PricingPlan | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelSubscriptionInvoiceFormFilterInput = {
  WorkTicketID?: ModelSubscriptionIDInput | null,
  InvoiceDate?: ModelSubscriptionStringInput | null,
  Spooler?: ModelSubscriptionStringInput | null,
  WorkType?: ModelSubscriptionStringInput | null,
  CableCompany?: ModelSubscriptionStringInput | null,
  CableCompanyLocation?: ModelSubscriptionStringInput | null,
  OilCompany?: ModelSubscriptionStringInput | null,
  WellName?: ModelSubscriptionStringInput | null,
  WellNumber?: ModelSubscriptionStringInput | null,
  JobType?: ModelSubscriptionStringInput | null,
  Notes?: ModelSubscriptionStringInput | null,
  ReelNumber?: ModelSubscriptionStringInput | null,
  ExtraCharges?: ModelSubscriptionFloatInput | null,
  InvoiceTotal?: ModelSubscriptionFloatInput | null,
  CustomerSignature?: ModelSubscriptionStringInput | null,
  FinalProductFile?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionInvoiceFormFilterInput | null > | null,
  or?: Array< ModelSubscriptionInvoiceFormFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionJsaFormFilterInput = {
  WorkTicketID?: ModelSubscriptionStringInput | null,
  CustomerName?: ModelSubscriptionStringInput | null,
  CreatedBy?: ModelSubscriptionStringInput | null,
  FormDate?: ModelSubscriptionStringInput | null,
  EffectiveDate?: ModelSubscriptionStringInput | null,
  Location?: ModelSubscriptionStringInput | null,
  FinalProductFile?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionJsaFormFilterInput | null > | null,
  or?: Array< ModelSubscriptionJsaFormFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelSubscriptionCapillaryFormFilterInput = {
  WorkTicketID?: ModelSubscriptionStringInput | null,
  SubmissionDate?: ModelSubscriptionStringInput | null,
  Date?: ModelSubscriptionStringInput | null,
  TechnicianName?: ModelSubscriptionStringInput | null,
  Customer?: ModelSubscriptionStringInput | null,
  WellName?: ModelSubscriptionStringInput | null,
  TypeOfJob?: ModelSubscriptionStringInput | null,
  VisualConfirmation?: ModelSubscriptionStringInput | null,
  IntervalPumping?: ModelSubscriptionStringInput | null,
  PressureWhilePumping?: ModelSubscriptionStringInput | null,
  PressureBleed?: ModelSubscriptionStringInput | null,
  CapillaryFlush?: ModelSubscriptionStringInput | null,
  ManifoldStatus?: ModelSubscriptionStringInput | null,
  LineTest?: ModelSubscriptionStringInput | null,
  CapillarySize?: ModelSubscriptionStringInput | null,
  Metallurgy?: ModelSubscriptionStringInput | null,
  Length?: ModelSubscriptionStringInput | null,
  FluidPumped?: ModelSubscriptionStringInput | null,
  TotalGallons?: ModelSubscriptionStringInput | null,
  Notes?: ModelSubscriptionStringInput | null,
  FinalProductFile?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionCapillaryFormFilterInput | null > | null,
  or?: Array< ModelSubscriptionCapillaryFormFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelSubscriptionTemplateFilterInput = {
  TemplateID?: ModelSubscriptionIDInput | null,
  Version?: ModelSubscriptionStringInput | null,
  TemplateDate?: ModelSubscriptionStringInput | null,
  Content?: ModelSubscriptionStringInput | null,
  file?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionTemplateFilterInput | null > | null,
  or?: Array< ModelSubscriptionTemplateFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelSubscriptionUserFilterInput = {
  UserID?: ModelSubscriptionIDInput | null,
  Name?: ModelSubscriptionStringInput | null,
  Email?: ModelSubscriptionStringInput | null,
  Role?: ModelSubscriptionStringInput | null,
  phoneNumber?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelSubscriptionPricingPlanFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  PlanID?: ModelSubscriptionStringInput | null,
  PlanDate?: ModelSubscriptionStringInput | null,
  Description?: ModelSubscriptionStringInput | null,
  file?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionPricingPlanFilterInput | null > | null,
  or?: Array< ModelSubscriptionPricingPlanFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
};

export type CreateInvoiceFormMutationVariables = {
  input: CreateInvoiceFormInput,
  condition?: ModelInvoiceFormConditionInput | null,
};

export type CreateInvoiceFormMutation = {
  createInvoiceForm?:  {
    __typename: "InvoiceForm",
    WorkTicketID: string,
    InvoiceDate: string,
    Spooler: string,
    WorkType: string,
    CableCompany: string,
    CableCompanyLocation: string,
    OilCompany: string,
    WellName: string,
    WellNumber: string,
    LaborCosts:  Array< {
      __typename: "LaborCost",
      rate?: number | null,
      qty?: number | null,
      amount?: number | null,
    } | null >,
    JobType: Array< string | null >,
    Consumables:  Array< {
      __typename: "Consumable",
      item?: string | null,
      qty?: number | null,
      rate?: number | null,
      amount?: number | null,
    } | null >,
    Notes?: string | null,
    CableDetails?:  {
      __typename: "CableDetail",
      CableType?: string | null,
      CableLength?: number | null,
    } | null,
    ReelNumber: string,
    ExtraCharges?: number | null,
    InvoiceTotal: number,
    CustomerSignature: string,
    FinalProductFile?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdateInvoiceFormMutationVariables = {
  input: UpdateInvoiceFormInput,
  condition?: ModelInvoiceFormConditionInput | null,
};

export type UpdateInvoiceFormMutation = {
  updateInvoiceForm?:  {
    __typename: "InvoiceForm",
    WorkTicketID: string,
    InvoiceDate: string,
    Spooler: string,
    WorkType: string,
    CableCompany: string,
    CableCompanyLocation: string,
    OilCompany: string,
    WellName: string,
    WellNumber: string,
    LaborCosts:  Array< {
      __typename: "LaborCost",
      rate?: number | null,
      qty?: number | null,
      amount?: number | null,
    } | null >,
    JobType: Array< string | null >,
    Consumables:  Array< {
      __typename: "Consumable",
      item?: string | null,
      qty?: number | null,
      rate?: number | null,
      amount?: number | null,
    } | null >,
    Notes?: string | null,
    CableDetails?:  {
      __typename: "CableDetail",
      CableType?: string | null,
      CableLength?: number | null,
    } | null,
    ReelNumber: string,
    ExtraCharges?: number | null,
    InvoiceTotal: number,
    CustomerSignature: string,
    FinalProductFile?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeleteInvoiceFormMutationVariables = {
  input: DeleteInvoiceFormInput,
  condition?: ModelInvoiceFormConditionInput | null,
};

export type DeleteInvoiceFormMutation = {
  deleteInvoiceForm?:  {
    __typename: "InvoiceForm",
    WorkTicketID: string,
    InvoiceDate: string,
    Spooler: string,
    WorkType: string,
    CableCompany: string,
    CableCompanyLocation: string,
    OilCompany: string,
    WellName: string,
    WellNumber: string,
    LaborCosts:  Array< {
      __typename: "LaborCost",
      rate?: number | null,
      qty?: number | null,
      amount?: number | null,
    } | null >,
    JobType: Array< string | null >,
    Consumables:  Array< {
      __typename: "Consumable",
      item?: string | null,
      qty?: number | null,
      rate?: number | null,
      amount?: number | null,
    } | null >,
    Notes?: string | null,
    CableDetails?:  {
      __typename: "CableDetail",
      CableType?: string | null,
      CableLength?: number | null,
    } | null,
    ReelNumber: string,
    ExtraCharges?: number | null,
    InvoiceTotal: number,
    CustomerSignature: string,
    FinalProductFile?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type CreateJsaFormMutationVariables = {
  input: CreateJsaFormInput,
  condition?: ModelJsaFormConditionInput | null,
};

export type CreateJsaFormMutation = {
  createJsaForm?:  {
    __typename: "JsaForm",
    WorkTicketID: string,
    CustomerName: string,
    CreatedBy: string,
    FormDate: string,
    EffectiveDate: string,
    Location: string,
    Personnel:  Array< {
      __typename: "Person",
      Role: string,
      PersonName: string,
      Signature: string,
    } | null >,
    FinalProductFile?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdateJsaFormMutationVariables = {
  input: UpdateJsaFormInput,
  condition?: ModelJsaFormConditionInput | null,
};

export type UpdateJsaFormMutation = {
  updateJsaForm?:  {
    __typename: "JsaForm",
    WorkTicketID: string,
    CustomerName: string,
    CreatedBy: string,
    FormDate: string,
    EffectiveDate: string,
    Location: string,
    Personnel:  Array< {
      __typename: "Person",
      Role: string,
      PersonName: string,
      Signature: string,
    } | null >,
    FinalProductFile?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeleteJsaFormMutationVariables = {
  input: DeleteJsaFormInput,
  condition?: ModelJsaFormConditionInput | null,
};

export type DeleteJsaFormMutation = {
  deleteJsaForm?:  {
    __typename: "JsaForm",
    WorkTicketID: string,
    CustomerName: string,
    CreatedBy: string,
    FormDate: string,
    EffectiveDate: string,
    Location: string,
    Personnel:  Array< {
      __typename: "Person",
      Role: string,
      PersonName: string,
      Signature: string,
    } | null >,
    FinalProductFile?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type CreateCapillaryFormMutationVariables = {
  input: CreateCapillaryFormInput,
  condition?: ModelCapillaryFormConditionInput | null,
};

export type CreateCapillaryFormMutation = {
  createCapillaryForm?:  {
    __typename: "CapillaryForm",
    WorkTicketID: string,
    SubmissionDate?: string | null,
    Date: string,
    TechnicianName: string,
    Customer: string,
    WellName: string,
    TypeOfJob: string,
    VisualConfirmation: string,
    IntervalPumping: string,
    PressureWhilePumping: string,
    PressureBleed: string,
    CapillaryFlush: string,
    ManifoldStatus: string,
    LineTest: string,
    CapillarySize: string,
    Metallurgy: string,
    Length: string,
    FluidPumped: string,
    TotalGallons: string,
    Notes?: string | null,
    FinalProductFile?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdateCapillaryFormMutationVariables = {
  input: UpdateCapillaryFormInput,
  condition?: ModelCapillaryFormConditionInput | null,
};

export type UpdateCapillaryFormMutation = {
  updateCapillaryForm?:  {
    __typename: "CapillaryForm",
    WorkTicketID: string,
    SubmissionDate?: string | null,
    Date: string,
    TechnicianName: string,
    Customer: string,
    WellName: string,
    TypeOfJob: string,
    VisualConfirmation: string,
    IntervalPumping: string,
    PressureWhilePumping: string,
    PressureBleed: string,
    CapillaryFlush: string,
    ManifoldStatus: string,
    LineTest: string,
    CapillarySize: string,
    Metallurgy: string,
    Length: string,
    FluidPumped: string,
    TotalGallons: string,
    Notes?: string | null,
    FinalProductFile?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeleteCapillaryFormMutationVariables = {
  input: DeleteCapillaryFormInput,
  condition?: ModelCapillaryFormConditionInput | null,
};

export type DeleteCapillaryFormMutation = {
  deleteCapillaryForm?:  {
    __typename: "CapillaryForm",
    WorkTicketID: string,
    SubmissionDate?: string | null,
    Date: string,
    TechnicianName: string,
    Customer: string,
    WellName: string,
    TypeOfJob: string,
    VisualConfirmation: string,
    IntervalPumping: string,
    PressureWhilePumping: string,
    PressureBleed: string,
    CapillaryFlush: string,
    ManifoldStatus: string,
    LineTest: string,
    CapillarySize: string,
    Metallurgy: string,
    Length: string,
    FluidPumped: string,
    TotalGallons: string,
    Notes?: string | null,
    FinalProductFile?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type CreateTemplateMutationVariables = {
  input: CreateTemplateInput,
  condition?: ModelTemplateConditionInput | null,
};

export type CreateTemplateMutation = {
  createTemplate?:  {
    __typename: "Template",
    TemplateID: string,
    Version: string,
    TemplateDate?: string | null,
    Content?: string | null,
    file: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdateTemplateMutationVariables = {
  input: UpdateTemplateInput,
  condition?: ModelTemplateConditionInput | null,
};

export type UpdateTemplateMutation = {
  updateTemplate?:  {
    __typename: "Template",
    TemplateID: string,
    Version: string,
    TemplateDate?: string | null,
    Content?: string | null,
    file: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeleteTemplateMutationVariables = {
  input: DeleteTemplateInput,
  condition?: ModelTemplateConditionInput | null,
};

export type DeleteTemplateMutation = {
  deleteTemplate?:  {
    __typename: "Template",
    TemplateID: string,
    Version: string,
    TemplateDate?: string | null,
    Content?: string | null,
    file: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    UserID: string,
    Name: string,
    Email: string,
    Role: string,
    phoneNumber?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    UserID: string,
    Name: string,
    Email: string,
    Role: string,
    phoneNumber?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeleteUserMutationVariables = {
  input: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    UserID: string,
    Name: string,
    Email: string,
    Role: string,
    phoneNumber?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type CreatePricingPlanMutationVariables = {
  input: CreatePricingPlanInput,
  condition?: ModelPricingPlanConditionInput | null,
};

export type CreatePricingPlanMutation = {
  createPricingPlan?:  {
    __typename: "PricingPlan",
    id: string,
    PlanID: string,
    PlanDate?: string | null,
    Description?: string | null,
    file: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdatePricingPlanMutationVariables = {
  input: UpdatePricingPlanInput,
  condition?: ModelPricingPlanConditionInput | null,
};

export type UpdatePricingPlanMutation = {
  updatePricingPlan?:  {
    __typename: "PricingPlan",
    id: string,
    PlanID: string,
    PlanDate?: string | null,
    Description?: string | null,
    file: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeletePricingPlanMutationVariables = {
  input: DeletePricingPlanInput,
  condition?: ModelPricingPlanConditionInput | null,
};

export type DeletePricingPlanMutation = {
  deletePricingPlan?:  {
    __typename: "PricingPlan",
    id: string,
    PlanID: string,
    PlanDate?: string | null,
    Description?: string | null,
    file: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type GetInvoiceFormQueryVariables = {
  WorkTicketID: string,
};

export type GetInvoiceFormQuery = {
  getInvoiceForm?:  {
    __typename: "InvoiceForm",
    WorkTicketID: string,
    InvoiceDate: string,
    Spooler: string,
    WorkType: string,
    CableCompany: string,
    CableCompanyLocation: string,
    OilCompany: string,
    WellName: string,
    WellNumber: string,
    LaborCosts:  Array< {
      __typename: "LaborCost",
      rate?: number | null,
      qty?: number | null,
      amount?: number | null,
    } | null >,
    JobType: Array< string | null >,
    Consumables:  Array< {
      __typename: "Consumable",
      item?: string | null,
      qty?: number | null,
      rate?: number | null,
      amount?: number | null,
    } | null >,
    Notes?: string | null,
    CableDetails?:  {
      __typename: "CableDetail",
      CableType?: string | null,
      CableLength?: number | null,
    } | null,
    ReelNumber: string,
    ExtraCharges?: number | null,
    InvoiceTotal: number,
    CustomerSignature: string,
    FinalProductFile?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListInvoiceFormsQueryVariables = {
  WorkTicketID?: string | null,
  filter?: ModelInvoiceFormFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListInvoiceFormsQuery = {
  listInvoiceForms?:  {
    __typename: "ModelInvoiceFormConnection",
    items:  Array< {
      __typename: "InvoiceForm",
      WorkTicketID: string,
      InvoiceDate: string,
      Spooler: string,
      WorkType: string,
      CableCompany: string,
      CableCompanyLocation: string,
      OilCompany: string,
      WellName: string,
      WellNumber: string,
      LaborCosts:  Array< {
        __typename: "LaborCost",
        rate?: number | null,
        qty?: number | null,
        amount?: number | null,
      } | null >,
      JobType: Array< string | null >,
      Consumables:  Array< {
        __typename: "Consumable",
        item?: string | null,
        qty?: number | null,
        rate?: number | null,
        amount?: number | null,
      } | null >,
      Notes?: string | null,
      CableDetails?:  {
        __typename: "CableDetail",
        CableType?: string | null,
        CableLength?: number | null,
      } | null,
      ReelNumber: string,
      ExtraCharges?: number | null,
      InvoiceTotal: number,
      CustomerSignature: string,
      FinalProductFile?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncInvoiceFormsQueryVariables = {
  filter?: ModelInvoiceFormFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncInvoiceFormsQuery = {
  syncInvoiceForms?:  {
    __typename: "ModelInvoiceFormConnection",
    items:  Array< {
      __typename: "InvoiceForm",
      WorkTicketID: string,
      InvoiceDate: string,
      Spooler: string,
      WorkType: string,
      CableCompany: string,
      CableCompanyLocation: string,
      OilCompany: string,
      WellName: string,
      WellNumber: string,
      LaborCosts:  Array< {
        __typename: "LaborCost",
        rate?: number | null,
        qty?: number | null,
        amount?: number | null,
      } | null >,
      JobType: Array< string | null >,
      Consumables:  Array< {
        __typename: "Consumable",
        item?: string | null,
        qty?: number | null,
        rate?: number | null,
        amount?: number | null,
      } | null >,
      Notes?: string | null,
      CableDetails?:  {
        __typename: "CableDetail",
        CableType?: string | null,
        CableLength?: number | null,
      } | null,
      ReelNumber: string,
      ExtraCharges?: number | null,
      InvoiceTotal: number,
      CustomerSignature: string,
      FinalProductFile?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetJsaFormQueryVariables = {
  CustomerName: string,
};

export type GetJsaFormQuery = {
  getJsaForm?:  {
    __typename: "JsaForm",
    WorkTicketID: string,
    CustomerName: string,
    CreatedBy: string,
    FormDate: string,
    EffectiveDate: string,
    Location: string,
    Personnel:  Array< {
      __typename: "Person",
      Role: string,
      PersonName: string,
      Signature: string,
    } | null >,
    FinalProductFile?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListJsaFormsQueryVariables = {
  CustomerName?: string | null,
  filter?: ModelJsaFormFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListJsaFormsQuery = {
  listJsaForms?:  {
    __typename: "ModelJsaFormConnection",
    items:  Array< {
      __typename: "JsaForm",
      WorkTicketID: string,
      CustomerName: string,
      CreatedBy: string,
      FormDate: string,
      EffectiveDate: string,
      Location: string,
      Personnel:  Array< {
        __typename: "Person",
        Role: string,
        PersonName: string,
        Signature: string,
      } | null >,
      FinalProductFile?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncJsaFormsQueryVariables = {
  filter?: ModelJsaFormFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncJsaFormsQuery = {
  syncJsaForms?:  {
    __typename: "ModelJsaFormConnection",
    items:  Array< {
      __typename: "JsaForm",
      WorkTicketID: string,
      CustomerName: string,
      CreatedBy: string,
      FormDate: string,
      EffectiveDate: string,
      Location: string,
      Personnel:  Array< {
        __typename: "Person",
        Role: string,
        PersonName: string,
        Signature: string,
      } | null >,
      FinalProductFile?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetCapillaryFormQueryVariables = {
  WorkTicketID: string,
};

export type GetCapillaryFormQuery = {
  getCapillaryForm?:  {
    __typename: "CapillaryForm",
    WorkTicketID: string,
    SubmissionDate?: string | null,
    Date: string,
    TechnicianName: string,
    Customer: string,
    WellName: string,
    TypeOfJob: string,
    VisualConfirmation: string,
    IntervalPumping: string,
    PressureWhilePumping: string,
    PressureBleed: string,
    CapillaryFlush: string,
    ManifoldStatus: string,
    LineTest: string,
    CapillarySize: string,
    Metallurgy: string,
    Length: string,
    FluidPumped: string,
    TotalGallons: string,
    Notes?: string | null,
    FinalProductFile?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListCapillaryFormsQueryVariables = {
  WorkTicketID?: string | null,
  filter?: ModelCapillaryFormFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListCapillaryFormsQuery = {
  listCapillaryForms?:  {
    __typename: "ModelCapillaryFormConnection",
    items:  Array< {
      __typename: "CapillaryForm",
      WorkTicketID: string,
      SubmissionDate?: string | null,
      Date: string,
      TechnicianName: string,
      Customer: string,
      WellName: string,
      TypeOfJob: string,
      VisualConfirmation: string,
      IntervalPumping: string,
      PressureWhilePumping: string,
      PressureBleed: string,
      CapillaryFlush: string,
      ManifoldStatus: string,
      LineTest: string,
      CapillarySize: string,
      Metallurgy: string,
      Length: string,
      FluidPumped: string,
      TotalGallons: string,
      Notes?: string | null,
      FinalProductFile?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncCapillaryFormsQueryVariables = {
  filter?: ModelCapillaryFormFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncCapillaryFormsQuery = {
  syncCapillaryForms?:  {
    __typename: "ModelCapillaryFormConnection",
    items:  Array< {
      __typename: "CapillaryForm",
      WorkTicketID: string,
      SubmissionDate?: string | null,
      Date: string,
      TechnicianName: string,
      Customer: string,
      WellName: string,
      TypeOfJob: string,
      VisualConfirmation: string,
      IntervalPumping: string,
      PressureWhilePumping: string,
      PressureBleed: string,
      CapillaryFlush: string,
      ManifoldStatus: string,
      LineTest: string,
      CapillarySize: string,
      Metallurgy: string,
      Length: string,
      FluidPumped: string,
      TotalGallons: string,
      Notes?: string | null,
      FinalProductFile?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetTemplateQueryVariables = {
  TemplateID: string,
};

export type GetTemplateQuery = {
  getTemplate?:  {
    __typename: "Template",
    TemplateID: string,
    Version: string,
    TemplateDate?: string | null,
    Content?: string | null,
    file: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListTemplatesQueryVariables = {
  TemplateID?: string | null,
  filter?: ModelTemplateFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListTemplatesQuery = {
  listTemplates?:  {
    __typename: "ModelTemplateConnection",
    items:  Array< {
      __typename: "Template",
      TemplateID: string,
      Version: string,
      TemplateDate?: string | null,
      Content?: string | null,
      file: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncTemplatesQueryVariables = {
  filter?: ModelTemplateFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncTemplatesQuery = {
  syncTemplates?:  {
    __typename: "ModelTemplateConnection",
    items:  Array< {
      __typename: "Template",
      TemplateID: string,
      Version: string,
      TemplateDate?: string | null,
      Content?: string | null,
      file: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetUserQueryVariables = {
  UserID: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    UserID: string,
    Name: string,
    Email: string,
    Role: string,
    phoneNumber?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListUsersQueryVariables = {
  UserID?: string | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      UserID: string,
      Name: string,
      Email: string,
      Role: string,
      phoneNumber?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncUsersQuery = {
  syncUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      UserID: string,
      Name: string,
      Email: string,
      Role: string,
      phoneNumber?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetPricingPlanQueryVariables = {
  id: string,
};

export type GetPricingPlanQuery = {
  getPricingPlan?:  {
    __typename: "PricingPlan",
    id: string,
    PlanID: string,
    PlanDate?: string | null,
    Description?: string | null,
    file: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListPricingPlansQueryVariables = {
  id?: string | null,
  filter?: ModelPricingPlanFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListPricingPlansQuery = {
  listPricingPlans?:  {
    __typename: "ModelPricingPlanConnection",
    items:  Array< {
      __typename: "PricingPlan",
      id: string,
      PlanID: string,
      PlanDate?: string | null,
      Description?: string | null,
      file: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncPricingPlansQueryVariables = {
  filter?: ModelPricingPlanFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncPricingPlansQuery = {
  syncPricingPlans?:  {
    __typename: "ModelPricingPlanConnection",
    items:  Array< {
      __typename: "PricingPlan",
      id: string,
      PlanID: string,
      PlanDate?: string | null,
      Description?: string | null,
      file: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type OnCreateInvoiceFormSubscriptionVariables = {
  filter?: ModelSubscriptionInvoiceFormFilterInput | null,
};

export type OnCreateInvoiceFormSubscription = {
  onCreateInvoiceForm?:  {
    __typename: "InvoiceForm",
    WorkTicketID: string,
    InvoiceDate: string,
    Spooler: string,
    WorkType: string,
    CableCompany: string,
    CableCompanyLocation: string,
    OilCompany: string,
    WellName: string,
    WellNumber: string,
    LaborCosts:  Array< {
      __typename: "LaborCost",
      rate?: number | null,
      qty?: number | null,
      amount?: number | null,
    } | null >,
    JobType: Array< string | null >,
    Consumables:  Array< {
      __typename: "Consumable",
      item?: string | null,
      qty?: number | null,
      rate?: number | null,
      amount?: number | null,
    } | null >,
    Notes?: string | null,
    CableDetails?:  {
      __typename: "CableDetail",
      CableType?: string | null,
      CableLength?: number | null,
    } | null,
    ReelNumber: string,
    ExtraCharges?: number | null,
    InvoiceTotal: number,
    CustomerSignature: string,
    FinalProductFile?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdateInvoiceFormSubscriptionVariables = {
  filter?: ModelSubscriptionInvoiceFormFilterInput | null,
};

export type OnUpdateInvoiceFormSubscription = {
  onUpdateInvoiceForm?:  {
    __typename: "InvoiceForm",
    WorkTicketID: string,
    InvoiceDate: string,
    Spooler: string,
    WorkType: string,
    CableCompany: string,
    CableCompanyLocation: string,
    OilCompany: string,
    WellName: string,
    WellNumber: string,
    LaborCosts:  Array< {
      __typename: "LaborCost",
      rate?: number | null,
      qty?: number | null,
      amount?: number | null,
    } | null >,
    JobType: Array< string | null >,
    Consumables:  Array< {
      __typename: "Consumable",
      item?: string | null,
      qty?: number | null,
      rate?: number | null,
      amount?: number | null,
    } | null >,
    Notes?: string | null,
    CableDetails?:  {
      __typename: "CableDetail",
      CableType?: string | null,
      CableLength?: number | null,
    } | null,
    ReelNumber: string,
    ExtraCharges?: number | null,
    InvoiceTotal: number,
    CustomerSignature: string,
    FinalProductFile?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeleteInvoiceFormSubscriptionVariables = {
  filter?: ModelSubscriptionInvoiceFormFilterInput | null,
};

export type OnDeleteInvoiceFormSubscription = {
  onDeleteInvoiceForm?:  {
    __typename: "InvoiceForm",
    WorkTicketID: string,
    InvoiceDate: string,
    Spooler: string,
    WorkType: string,
    CableCompany: string,
    CableCompanyLocation: string,
    OilCompany: string,
    WellName: string,
    WellNumber: string,
    LaborCosts:  Array< {
      __typename: "LaborCost",
      rate?: number | null,
      qty?: number | null,
      amount?: number | null,
    } | null >,
    JobType: Array< string | null >,
    Consumables:  Array< {
      __typename: "Consumable",
      item?: string | null,
      qty?: number | null,
      rate?: number | null,
      amount?: number | null,
    } | null >,
    Notes?: string | null,
    CableDetails?:  {
      __typename: "CableDetail",
      CableType?: string | null,
      CableLength?: number | null,
    } | null,
    ReelNumber: string,
    ExtraCharges?: number | null,
    InvoiceTotal: number,
    CustomerSignature: string,
    FinalProductFile?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnCreateJsaFormSubscriptionVariables = {
  filter?: ModelSubscriptionJsaFormFilterInput | null,
};

export type OnCreateJsaFormSubscription = {
  onCreateJsaForm?:  {
    __typename: "JsaForm",
    WorkTicketID: string,
    CustomerName: string,
    CreatedBy: string,
    FormDate: string,
    EffectiveDate: string,
    Location: string,
    Personnel:  Array< {
      __typename: "Person",
      Role: string,
      PersonName: string,
      Signature: string,
    } | null >,
    FinalProductFile?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdateJsaFormSubscriptionVariables = {
  filter?: ModelSubscriptionJsaFormFilterInput | null,
};

export type OnUpdateJsaFormSubscription = {
  onUpdateJsaForm?:  {
    __typename: "JsaForm",
    WorkTicketID: string,
    CustomerName: string,
    CreatedBy: string,
    FormDate: string,
    EffectiveDate: string,
    Location: string,
    Personnel:  Array< {
      __typename: "Person",
      Role: string,
      PersonName: string,
      Signature: string,
    } | null >,
    FinalProductFile?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeleteJsaFormSubscriptionVariables = {
  filter?: ModelSubscriptionJsaFormFilterInput | null,
};

export type OnDeleteJsaFormSubscription = {
  onDeleteJsaForm?:  {
    __typename: "JsaForm",
    WorkTicketID: string,
    CustomerName: string,
    CreatedBy: string,
    FormDate: string,
    EffectiveDate: string,
    Location: string,
    Personnel:  Array< {
      __typename: "Person",
      Role: string,
      PersonName: string,
      Signature: string,
    } | null >,
    FinalProductFile?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnCreateCapillaryFormSubscriptionVariables = {
  filter?: ModelSubscriptionCapillaryFormFilterInput | null,
};

export type OnCreateCapillaryFormSubscription = {
  onCreateCapillaryForm?:  {
    __typename: "CapillaryForm",
    WorkTicketID: string,
    SubmissionDate?: string | null,
    Date: string,
    TechnicianName: string,
    Customer: string,
    WellName: string,
    TypeOfJob: string,
    VisualConfirmation: string,
    IntervalPumping: string,
    PressureWhilePumping: string,
    PressureBleed: string,
    CapillaryFlush: string,
    ManifoldStatus: string,
    LineTest: string,
    CapillarySize: string,
    Metallurgy: string,
    Length: string,
    FluidPumped: string,
    TotalGallons: string,
    Notes?: string | null,
    FinalProductFile?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdateCapillaryFormSubscriptionVariables = {
  filter?: ModelSubscriptionCapillaryFormFilterInput | null,
};

export type OnUpdateCapillaryFormSubscription = {
  onUpdateCapillaryForm?:  {
    __typename: "CapillaryForm",
    WorkTicketID: string,
    SubmissionDate?: string | null,
    Date: string,
    TechnicianName: string,
    Customer: string,
    WellName: string,
    TypeOfJob: string,
    VisualConfirmation: string,
    IntervalPumping: string,
    PressureWhilePumping: string,
    PressureBleed: string,
    CapillaryFlush: string,
    ManifoldStatus: string,
    LineTest: string,
    CapillarySize: string,
    Metallurgy: string,
    Length: string,
    FluidPumped: string,
    TotalGallons: string,
    Notes?: string | null,
    FinalProductFile?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeleteCapillaryFormSubscriptionVariables = {
  filter?: ModelSubscriptionCapillaryFormFilterInput | null,
};

export type OnDeleteCapillaryFormSubscription = {
  onDeleteCapillaryForm?:  {
    __typename: "CapillaryForm",
    WorkTicketID: string,
    SubmissionDate?: string | null,
    Date: string,
    TechnicianName: string,
    Customer: string,
    WellName: string,
    TypeOfJob: string,
    VisualConfirmation: string,
    IntervalPumping: string,
    PressureWhilePumping: string,
    PressureBleed: string,
    CapillaryFlush: string,
    ManifoldStatus: string,
    LineTest: string,
    CapillarySize: string,
    Metallurgy: string,
    Length: string,
    FluidPumped: string,
    TotalGallons: string,
    Notes?: string | null,
    FinalProductFile?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnCreateTemplateSubscriptionVariables = {
  filter?: ModelSubscriptionTemplateFilterInput | null,
};

export type OnCreateTemplateSubscription = {
  onCreateTemplate?:  {
    __typename: "Template",
    TemplateID: string,
    Version: string,
    TemplateDate?: string | null,
    Content?: string | null,
    file: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdateTemplateSubscriptionVariables = {
  filter?: ModelSubscriptionTemplateFilterInput | null,
};

export type OnUpdateTemplateSubscription = {
  onUpdateTemplate?:  {
    __typename: "Template",
    TemplateID: string,
    Version: string,
    TemplateDate?: string | null,
    Content?: string | null,
    file: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeleteTemplateSubscriptionVariables = {
  filter?: ModelSubscriptionTemplateFilterInput | null,
};

export type OnDeleteTemplateSubscription = {
  onDeleteTemplate?:  {
    __typename: "Template",
    TemplateID: string,
    Version: string,
    TemplateDate?: string | null,
    Content?: string | null,
    file: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    UserID: string,
    Name: string,
    Email: string,
    Role: string,
    phoneNumber?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    UserID: string,
    Name: string,
    Email: string,
    Role: string,
    phoneNumber?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    UserID: string,
    Name: string,
    Email: string,
    Role: string,
    phoneNumber?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnCreatePricingPlanSubscriptionVariables = {
  filter?: ModelSubscriptionPricingPlanFilterInput | null,
};

export type OnCreatePricingPlanSubscription = {
  onCreatePricingPlan?:  {
    __typename: "PricingPlan",
    id: string,
    PlanID: string,
    PlanDate?: string | null,
    Description?: string | null,
    file: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdatePricingPlanSubscriptionVariables = {
  filter?: ModelSubscriptionPricingPlanFilterInput | null,
};

export type OnUpdatePricingPlanSubscription = {
  onUpdatePricingPlan?:  {
    __typename: "PricingPlan",
    id: string,
    PlanID: string,
    PlanDate?: string | null,
    Description?: string | null,
    file: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeletePricingPlanSubscriptionVariables = {
  filter?: ModelSubscriptionPricingPlanFilterInput | null,
};

export type OnDeletePricingPlanSubscription = {
  onDeletePricingPlan?:  {
    __typename: "PricingPlan",
    id: string,
    PlanID: string,
    PlanDate?: string | null,
    Description?: string | null,
    file: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};
