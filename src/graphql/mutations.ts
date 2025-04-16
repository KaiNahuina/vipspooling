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
    CableCompanyLocation
    OilCompany
    WellNumberName
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
    CableCompanyLocation
    OilCompany
    WellNumberName
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
    CableCompanyLocation
    OilCompany
    WellNumberName
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
    CustomerName
    FormDate
    EffectiveDate
    Location
    Personnel {
      Role
      PersonName
      Signature
      __typename
    }
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
    CustomerName
    FormDate
    EffectiveDate
    Location
    Personnel {
      Role
      PersonName
      Signature
      __typename
    }
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
    CustomerName
    FormDate
    EffectiveDate
    Location
    Personnel {
      Role
      PersonName
      Signature
      __typename
    }
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
