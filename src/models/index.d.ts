import { ModelInit, MutableModel, __modelMeta__, CustomIdentifier, OptionallyManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";



type EagerLaborCost = {
  readonly rate?: number | null;
  readonly qty?: number | null;
  readonly amount?: number | null;
}

type LazyLaborCost = {
  readonly rate?: number | null;
  readonly qty?: number | null;
  readonly amount?: number | null;
}

export declare type LaborCost = LazyLoading extends LazyLoadingDisabled ? EagerLaborCost : LazyLaborCost

export declare const LaborCost: (new (init: ModelInit<LaborCost>) => LaborCost)

type EagerConsumable = {
  readonly item?: string | null;
  readonly qty?: number | null;
  readonly rate?: number | null;
  readonly amount?: number | null;
}

type LazyConsumable = {
  readonly item?: string | null;
  readonly qty?: number | null;
  readonly rate?: number | null;
  readonly amount?: number | null;
}

export declare type Consumable = LazyLoading extends LazyLoadingDisabled ? EagerConsumable : LazyConsumable

export declare const Consumable: (new (init: ModelInit<Consumable>) => Consumable)

type EagerCableDetail = {
  readonly CableType?: string | null;
  readonly CableLength?: number | null;
}

type LazyCableDetail = {
  readonly CableType?: string | null;
  readonly CableLength?: number | null;
}

export declare type CableDetail = LazyLoading extends LazyLoadingDisabled ? EagerCableDetail : LazyCableDetail

export declare const CableDetail: (new (init: ModelInit<CableDetail>) => CableDetail)

type EagerPerson = {
  readonly Role: string;
  readonly PersonName: string;
  readonly Signature: string;
}

type LazyPerson = {
  readonly Role: string;
  readonly PersonName: string;
  readonly Signature: string;
}

export declare type Person = LazyLoading extends LazyLoadingDisabled ? EagerPerson : LazyPerson

export declare const Person: (new (init: ModelInit<Person>) => Person)

type EagerInvoiceForm = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<InvoiceForm, 'WorkTicketID'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly WorkTicketID: string;
  readonly InvoiceDate: string;
  readonly Spooler: string;
  readonly WorkType: string;
  readonly CableCompany: string;
  readonly CableCompanyLocation: string;
  readonly OilCompany: string;
  readonly WellName: string;
  readonly WellNumber: string;
  readonly LaborCosts: (LaborCost | null)[];
  readonly JobType: (string | null)[];
  readonly Consumables: (Consumable | null)[];
  readonly Notes?: string | null;
  readonly CableDetails?: CableDetail | null;
  readonly ReelNumber: string;
  readonly ExtraCharges?: number | null;
  readonly InvoiceTotal: number;
  readonly CustomerSignature: string;
  readonly FinalProductFile?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyInvoiceForm = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<InvoiceForm, 'WorkTicketID'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly WorkTicketID: string;
  readonly InvoiceDate: string;
  readonly Spooler: string;
  readonly WorkType: string;
  readonly CableCompany: string;
  readonly CableCompanyLocation: string;
  readonly OilCompany: string;
  readonly WellName: string;
  readonly WellNumber: string;
  readonly LaborCosts: (LaborCost | null)[];
  readonly JobType: (string | null)[];
  readonly Consumables: (Consumable | null)[];
  readonly Notes?: string | null;
  readonly CableDetails?: CableDetail | null;
  readonly ReelNumber: string;
  readonly ExtraCharges?: number | null;
  readonly InvoiceTotal: number;
  readonly CustomerSignature: string;
  readonly FinalProductFile?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type InvoiceForm = LazyLoading extends LazyLoadingDisabled ? EagerInvoiceForm : LazyInvoiceForm

export declare const InvoiceForm: (new (init: ModelInit<InvoiceForm>) => InvoiceForm) & {
  copyOf(source: InvoiceForm, mutator: (draft: MutableModel<InvoiceForm>) => MutableModel<InvoiceForm> | void): InvoiceForm;
}

type EagerJsaForm = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<JsaForm, 'CustomerName'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly WorkTicketID: string;
  readonly CustomerName: string;
  readonly CreatedBy: string;
  readonly FormDate: string;
  readonly EffectiveDate: string;
  readonly Location: string;
  readonly Personnel: (Person | null)[];
  readonly FinalProductFile?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyJsaForm = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<JsaForm, 'CustomerName'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly WorkTicketID: string;
  readonly CustomerName: string;
  readonly CreatedBy: string;
  readonly FormDate: string;
  readonly EffectiveDate: string;
  readonly Location: string;
  readonly Personnel: (Person | null)[];
  readonly FinalProductFile?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type JsaForm = LazyLoading extends LazyLoadingDisabled ? EagerJsaForm : LazyJsaForm

export declare const JsaForm: (new (init: ModelInit<JsaForm>) => JsaForm) & {
  copyOf(source: JsaForm, mutator: (draft: MutableModel<JsaForm>) => MutableModel<JsaForm> | void): JsaForm;
}

type EagerCapillaryForm = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<CapillaryForm, 'WorkTicketID'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly WorkTicketID: string;
  readonly SubmissionDate?: string | null;
  readonly Date: string;
  readonly TechnicianName: string;
  readonly Customer: string;
  readonly WellName: string;
  readonly TypeOfJob: string;
  readonly VisualConfirmation: string;
  readonly IntervalPumping: string;
  readonly PressureWhilePumping: string;
  readonly PressureBleed: string;
  readonly CapillaryFlush: string;
  readonly ManifoldStatus: string;
  readonly LineTest: string;
  readonly CapillarySize: string;
  readonly Metallurgy: string;
  readonly Length: string;
  readonly FluidPumped: string;
  readonly TotalGallons: string;
  readonly Notes?: string | null;
  readonly FinalProductFile?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyCapillaryForm = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<CapillaryForm, 'WorkTicketID'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly WorkTicketID: string;
  readonly SubmissionDate?: string | null;
  readonly Date: string;
  readonly TechnicianName: string;
  readonly Customer: string;
  readonly WellName: string;
  readonly TypeOfJob: string;
  readonly VisualConfirmation: string;
  readonly IntervalPumping: string;
  readonly PressureWhilePumping: string;
  readonly PressureBleed: string;
  readonly CapillaryFlush: string;
  readonly ManifoldStatus: string;
  readonly LineTest: string;
  readonly CapillarySize: string;
  readonly Metallurgy: string;
  readonly Length: string;
  readonly FluidPumped: string;
  readonly TotalGallons: string;
  readonly Notes?: string | null;
  readonly FinalProductFile?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type CapillaryForm = LazyLoading extends LazyLoadingDisabled ? EagerCapillaryForm : LazyCapillaryForm

export declare const CapillaryForm: (new (init: ModelInit<CapillaryForm>) => CapillaryForm) & {
  copyOf(source: CapillaryForm, mutator: (draft: MutableModel<CapillaryForm>) => MutableModel<CapillaryForm> | void): CapillaryForm;
}

type EagerTemplate = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<Template, 'TemplateID'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly TemplateID: string;
  readonly Version: string;
  readonly TemplateDate?: string | null;
  readonly Content?: string | null;
  readonly file: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyTemplate = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<Template, 'TemplateID'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly TemplateID: string;
  readonly Version: string;
  readonly TemplateDate?: string | null;
  readonly Content?: string | null;
  readonly file: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Template = LazyLoading extends LazyLoadingDisabled ? EagerTemplate : LazyTemplate

export declare const Template: (new (init: ModelInit<Template>) => Template) & {
  copyOf(source: Template, mutator: (draft: MutableModel<Template>) => MutableModel<Template> | void): Template;
}

type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<User, 'UserID'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly UserID: string;
  readonly Name: string;
  readonly Email: string;
  readonly Role: string;
  readonly phoneNumber?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<User, 'UserID'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly UserID: string;
  readonly Name: string;
  readonly Email: string;
  readonly Role: string;
  readonly phoneNumber?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

type EagerPricingPlan = {
  readonly [__modelMeta__]: {
    identifier: OptionallyManagedIdentifier<PricingPlan, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly PlanID: string;
  readonly PlanDate?: string | null;
  readonly Description?: string | null;
  readonly file: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPricingPlan = {
  readonly [__modelMeta__]: {
    identifier: OptionallyManagedIdentifier<PricingPlan, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly PlanID: string;
  readonly PlanDate?: string | null;
  readonly Description?: string | null;
  readonly file: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type PricingPlan = LazyLoading extends LazyLoadingDisabled ? EagerPricingPlan : LazyPricingPlan

export declare const PricingPlan: (new (init: ModelInit<PricingPlan>) => PricingPlan) & {
  copyOf(source: PricingPlan, mutator: (draft: MutableModel<PricingPlan>) => MutableModel<PricingPlan> | void): PricingPlan;
}