/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createInvoiceForm = /* GraphQL */ `mutation CreateInvoiceForm(
  $input: CreateInvoiceFormInput!
  $condition: ModelInvoiceFormConditionInput
) {
  createInvoiceForm(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateInvoiceFormMutationVariables,
  APITypes.CreateInvoiceFormMutation
>;
export const updateInvoiceForm = /* GraphQL */ `mutation UpdateInvoiceForm(
  $input: UpdateInvoiceFormInput!
  $condition: ModelInvoiceFormConditionInput
) {
  updateInvoiceForm(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateInvoiceFormMutationVariables,
  APITypes.UpdateInvoiceFormMutation
>;
export const deleteInvoiceForm = /* GraphQL */ `mutation DeleteInvoiceForm(
  $input: DeleteInvoiceFormInput!
  $condition: ModelInvoiceFormConditionInput
) {
  deleteInvoiceForm(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteInvoiceFormMutationVariables,
  APITypes.DeleteInvoiceFormMutation
>;
export const createJsaForm = /* GraphQL */ `mutation CreateJsaForm(
  $input: CreateJsaFormInput!
  $condition: ModelJsaFormConditionInput
) {
  createJsaForm(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateJsaFormMutationVariables,
  APITypes.CreateJsaFormMutation
>;
export const updateJsaForm = /* GraphQL */ `mutation UpdateJsaForm(
  $input: UpdateJsaFormInput!
  $condition: ModelJsaFormConditionInput
) {
  updateJsaForm(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateJsaFormMutationVariables,
  APITypes.UpdateJsaFormMutation
>;
export const deleteJsaForm = /* GraphQL */ `mutation DeleteJsaForm(
  $input: DeleteJsaFormInput!
  $condition: ModelJsaFormConditionInput
) {
  deleteJsaForm(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteJsaFormMutationVariables,
  APITypes.DeleteJsaFormMutation
>;
export const createCapillaryForm = /* GraphQL */ `mutation CreateCapillaryForm(
  $input: CreateCapillaryFormInput!
  $condition: ModelCapillaryFormConditionInput
) {
  createCapillaryForm(input: $input, condition: $condition) {
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
    CapillaryFlush {
      Confirmation
      Amount
      __typename
    }
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
` as GeneratedMutation<
  APITypes.CreateCapillaryFormMutationVariables,
  APITypes.CreateCapillaryFormMutation
>;
export const updateCapillaryForm = /* GraphQL */ `mutation UpdateCapillaryForm(
  $input: UpdateCapillaryFormInput!
  $condition: ModelCapillaryFormConditionInput
) {
  updateCapillaryForm(input: $input, condition: $condition) {
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
    CapillaryFlush {
      Confirmation
      Amount
      __typename
    }
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
` as GeneratedMutation<
  APITypes.UpdateCapillaryFormMutationVariables,
  APITypes.UpdateCapillaryFormMutation
>;
export const deleteCapillaryForm = /* GraphQL */ `mutation DeleteCapillaryForm(
  $input: DeleteCapillaryFormInput!
  $condition: ModelCapillaryFormConditionInput
) {
  deleteCapillaryForm(input: $input, condition: $condition) {
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
    CapillaryFlush {
      Confirmation
      Amount
      __typename
    }
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
` as GeneratedMutation<
  APITypes.DeleteCapillaryFormMutationVariables,
  APITypes.DeleteCapillaryFormMutation
>;
export const createTemplate = /* GraphQL */ `mutation CreateTemplate(
  $input: CreateTemplateInput!
  $condition: ModelTemplateConditionInput
) {
  createTemplate(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateTemplateMutationVariables,
  APITypes.CreateTemplateMutation
>;
export const updateTemplate = /* GraphQL */ `mutation UpdateTemplate(
  $input: UpdateTemplateInput!
  $condition: ModelTemplateConditionInput
) {
  updateTemplate(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateTemplateMutationVariables,
  APITypes.UpdateTemplateMutation
>;
export const deleteTemplate = /* GraphQL */ `mutation DeleteTemplate(
  $input: DeleteTemplateInput!
  $condition: ModelTemplateConditionInput
) {
  deleteTemplate(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteTemplateMutationVariables,
  APITypes.DeleteTemplateMutation
>;
export const createUser = /* GraphQL */ `mutation CreateUser(
  $input: CreateUserInput!
  $condition: ModelUserConditionInput
) {
  createUser(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateUserMutationVariables,
  APITypes.CreateUserMutation
>;
export const updateUser = /* GraphQL */ `mutation UpdateUser(
  $input: UpdateUserInput!
  $condition: ModelUserConditionInput
) {
  updateUser(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateUserMutationVariables,
  APITypes.UpdateUserMutation
>;
export const deleteUser = /* GraphQL */ `mutation DeleteUser(
  $input: DeleteUserInput!
  $condition: ModelUserConditionInput
) {
  deleteUser(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteUserMutationVariables,
  APITypes.DeleteUserMutation
>;
export const createPricingPlan = /* GraphQL */ `mutation CreatePricingPlan(
  $input: CreatePricingPlanInput!
  $condition: ModelPricingPlanConditionInput
) {
  createPricingPlan(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreatePricingPlanMutationVariables,
  APITypes.CreatePricingPlanMutation
>;
export const updatePricingPlan = /* GraphQL */ `mutation UpdatePricingPlan(
  $input: UpdatePricingPlanInput!
  $condition: ModelPricingPlanConditionInput
) {
  updatePricingPlan(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdatePricingPlanMutationVariables,
  APITypes.UpdatePricingPlanMutation
>;
export const deletePricingPlan = /* GraphQL */ `mutation DeletePricingPlan(
  $input: DeletePricingPlanInput!
  $condition: ModelPricingPlanConditionInput
) {
  deletePricingPlan(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeletePricingPlanMutationVariables,
  APITypes.DeletePricingPlanMutation
>;
