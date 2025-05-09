/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateInvoiceForm = /* GraphQL */ `subscription OnCreateInvoiceForm(
  $filter: ModelSubscriptionInvoiceFormFilterInput
) {
  onCreateInvoiceForm(filter: $filter) {
    WorkTicketID
    InvoiceDate
    Spooler
    WorkType
    CableCompany
    CableCompanyLocation
    OilCompany
    WellName
    WellNumber
    LaborCosts {
      rate
      qty
      amount
      __typename
    }
    JobType
    Consumables {
      item
      qty
      rate
      amount
      __typename
    }
    Notes
    CableDetails {
      CableType
      CableLength
      __typename
    }
    ReelNumber
    ExtraCharges
    InvoiceTotal
    CustomerSignature
    FinalProductFile
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateInvoiceFormSubscriptionVariables,
  APITypes.OnCreateInvoiceFormSubscription
>;
export const onUpdateInvoiceForm = /* GraphQL */ `subscription OnUpdateInvoiceForm(
  $filter: ModelSubscriptionInvoiceFormFilterInput
) {
  onUpdateInvoiceForm(filter: $filter) {
    WorkTicketID
    InvoiceDate
    Spooler
    WorkType
    CableCompany
    CableCompanyLocation
    OilCompany
    WellName
    WellNumber
    LaborCosts {
      rate
      qty
      amount
      __typename
    }
    JobType
    Consumables {
      item
      qty
      rate
      amount
      __typename
    }
    Notes
    CableDetails {
      CableType
      CableLength
      __typename
    }
    ReelNumber
    ExtraCharges
    InvoiceTotal
    CustomerSignature
    FinalProductFile
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateInvoiceFormSubscriptionVariables,
  APITypes.OnUpdateInvoiceFormSubscription
>;
export const onDeleteInvoiceForm = /* GraphQL */ `subscription OnDeleteInvoiceForm(
  $filter: ModelSubscriptionInvoiceFormFilterInput
) {
  onDeleteInvoiceForm(filter: $filter) {
    WorkTicketID
    InvoiceDate
    Spooler
    WorkType
    CableCompany
    CableCompanyLocation
    OilCompany
    WellName
    WellNumber
    LaborCosts {
      rate
      qty
      amount
      __typename
    }
    JobType
    Consumables {
      item
      qty
      rate
      amount
      __typename
    }
    Notes
    CableDetails {
      CableType
      CableLength
      __typename
    }
    ReelNumber
    ExtraCharges
    InvoiceTotal
    CustomerSignature
    FinalProductFile
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteInvoiceFormSubscriptionVariables,
  APITypes.OnDeleteInvoiceFormSubscription
>;
export const onCreateJsaForm = /* GraphQL */ `subscription OnCreateJsaForm($filter: ModelSubscriptionJsaFormFilterInput) {
  onCreateJsaForm(filter: $filter) {
    WorkTicketID
    CustomerName
    CreatedBy
    FormDate
    EffectiveDate
    Location
    Personnel {
      Role
      PersonName
      Signature
      __typename
    }
    FinalProductFile
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateJsaFormSubscriptionVariables,
  APITypes.OnCreateJsaFormSubscription
>;
export const onUpdateJsaForm = /* GraphQL */ `subscription OnUpdateJsaForm($filter: ModelSubscriptionJsaFormFilterInput) {
  onUpdateJsaForm(filter: $filter) {
    WorkTicketID
    CustomerName
    CreatedBy
    FormDate
    EffectiveDate
    Location
    Personnel {
      Role
      PersonName
      Signature
      __typename
    }
    FinalProductFile
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateJsaFormSubscriptionVariables,
  APITypes.OnUpdateJsaFormSubscription
>;
export const onDeleteJsaForm = /* GraphQL */ `subscription OnDeleteJsaForm($filter: ModelSubscriptionJsaFormFilterInput) {
  onDeleteJsaForm(filter: $filter) {
    WorkTicketID
    CustomerName
    CreatedBy
    FormDate
    EffectiveDate
    Location
    Personnel {
      Role
      PersonName
      Signature
      __typename
    }
    FinalProductFile
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteJsaFormSubscriptionVariables,
  APITypes.OnDeleteJsaFormSubscription
>;
export const onCreateCapillaryForm = /* GraphQL */ `subscription OnCreateCapillaryForm(
  $filter: ModelSubscriptionCapillaryFormFilterInput
) {
  onCreateCapillaryForm(filter: $filter) {
    WorkTicketID
    SubmissionDate
    Date
    TechnicianName
    Customer
    WellName
    TypeOfJob
    VisualConfirmation
    IntervalPumping
    PressureWhilePumping
    PressureBleed
    CapillaryFlush
    ManifoldStatus
    LineTest
    CapillarySize
    Metallurgy
    Length
    FluidPumped
    TotalGallons
    Notes
    FinalProductFile
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateCapillaryFormSubscriptionVariables,
  APITypes.OnCreateCapillaryFormSubscription
>;
export const onUpdateCapillaryForm = /* GraphQL */ `subscription OnUpdateCapillaryForm(
  $filter: ModelSubscriptionCapillaryFormFilterInput
) {
  onUpdateCapillaryForm(filter: $filter) {
    WorkTicketID
    SubmissionDate
    Date
    TechnicianName
    Customer
    WellName
    TypeOfJob
    VisualConfirmation
    IntervalPumping
    PressureWhilePumping
    PressureBleed
    CapillaryFlush
    ManifoldStatus
    LineTest
    CapillarySize
    Metallurgy
    Length
    FluidPumped
    TotalGallons
    Notes
    FinalProductFile
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateCapillaryFormSubscriptionVariables,
  APITypes.OnUpdateCapillaryFormSubscription
>;
export const onDeleteCapillaryForm = /* GraphQL */ `subscription OnDeleteCapillaryForm(
  $filter: ModelSubscriptionCapillaryFormFilterInput
) {
  onDeleteCapillaryForm(filter: $filter) {
    WorkTicketID
    SubmissionDate
    Date
    TechnicianName
    Customer
    WellName
    TypeOfJob
    VisualConfirmation
    IntervalPumping
    PressureWhilePumping
    PressureBleed
    CapillaryFlush
    ManifoldStatus
    LineTest
    CapillarySize
    Metallurgy
    Length
    FluidPumped
    TotalGallons
    Notes
    FinalProductFile
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteCapillaryFormSubscriptionVariables,
  APITypes.OnDeleteCapillaryFormSubscription
>;
export const onCreateTemplate = /* GraphQL */ `subscription OnCreateTemplate($filter: ModelSubscriptionTemplateFilterInput) {
  onCreateTemplate(filter: $filter) {
    TemplateID
    Version
    TemplateDate
    Content
    file
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateTemplateSubscriptionVariables,
  APITypes.OnCreateTemplateSubscription
>;
export const onUpdateTemplate = /* GraphQL */ `subscription OnUpdateTemplate($filter: ModelSubscriptionTemplateFilterInput) {
  onUpdateTemplate(filter: $filter) {
    TemplateID
    Version
    TemplateDate
    Content
    file
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateTemplateSubscriptionVariables,
  APITypes.OnUpdateTemplateSubscription
>;
export const onDeleteTemplate = /* GraphQL */ `subscription OnDeleteTemplate($filter: ModelSubscriptionTemplateFilterInput) {
  onDeleteTemplate(filter: $filter) {
    TemplateID
    Version
    TemplateDate
    Content
    file
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteTemplateSubscriptionVariables,
  APITypes.OnDeleteTemplateSubscription
>;
export const onCreateUser = /* GraphQL */ `subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
  onCreateUser(filter: $filter) {
    UserID
    Name
    Email
    Role
    phoneNumber
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserSubscriptionVariables,
  APITypes.OnCreateUserSubscription
>;
export const onUpdateUser = /* GraphQL */ `subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
  onUpdateUser(filter: $filter) {
    UserID
    Name
    Email
    Role
    phoneNumber
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserSubscriptionVariables,
  APITypes.OnUpdateUserSubscription
>;
export const onDeleteUser = /* GraphQL */ `subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
  onDeleteUser(filter: $filter) {
    UserID
    Name
    Email
    Role
    phoneNumber
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserSubscriptionVariables,
  APITypes.OnDeleteUserSubscription
>;
export const onCreatePricingPlan = /* GraphQL */ `subscription OnCreatePricingPlan(
  $filter: ModelSubscriptionPricingPlanFilterInput
) {
  onCreatePricingPlan(filter: $filter) {
    id
    PlanID
    PlanDate
    Description
    file
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreatePricingPlanSubscriptionVariables,
  APITypes.OnCreatePricingPlanSubscription
>;
export const onUpdatePricingPlan = /* GraphQL */ `subscription OnUpdatePricingPlan(
  $filter: ModelSubscriptionPricingPlanFilterInput
) {
  onUpdatePricingPlan(filter: $filter) {
    id
    PlanID
    PlanDate
    Description
    file
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdatePricingPlanSubscriptionVariables,
  APITypes.OnUpdatePricingPlanSubscription
>;
export const onDeletePricingPlan = /* GraphQL */ `subscription OnDeletePricingPlan(
  $filter: ModelSubscriptionPricingPlanFilterInput
) {
  onDeletePricingPlan(filter: $filter) {
    id
    PlanID
    PlanDate
    Description
    file
    createdAt
    updatedAt
    _version
    _deleted
    _lastChangedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeletePricingPlanSubscriptionVariables,
  APITypes.OnDeletePricingPlanSubscription
>;
