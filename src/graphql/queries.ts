/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getInvoiceForm = /* GraphQL */ `query GetInvoiceForm($WorkTicketID: ID!) {
  getInvoiceForm(WorkTicketID: $WorkTicketID) {
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
` as GeneratedQuery<
  APITypes.GetInvoiceFormQueryVariables,
  APITypes.GetInvoiceFormQuery
>;
export const listInvoiceForms = /* GraphQL */ `query ListInvoiceForms(
  $WorkTicketID: ID
  $filter: ModelInvoiceFormFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listInvoiceForms(
    WorkTicketID: $WorkTicketID
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      WorkTicketID
      InvoiceDate
      Spooler
      WorkType
      CableCompany
      CableCompanyLocation
      OilCompany
      WellName
      WellNumber
      JobType
      Notes
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListInvoiceFormsQueryVariables,
  APITypes.ListInvoiceFormsQuery
>;
export const syncInvoiceForms = /* GraphQL */ `query SyncInvoiceForms(
  $filter: ModelInvoiceFormFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncInvoiceForms(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      WorkTicketID
      InvoiceDate
      Spooler
      WorkType
      CableCompany
      CableCompanyLocation
      OilCompany
      WellName
      WellNumber
      JobType
      Notes
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncInvoiceFormsQueryVariables,
  APITypes.SyncInvoiceFormsQuery
>;
export const getJsaForm = /* GraphQL */ `query GetJsaForm($CustomerName: String!) {
  getJsaForm(CustomerName: $CustomerName) {
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
` as GeneratedQuery<
  APITypes.GetJsaFormQueryVariables,
  APITypes.GetJsaFormQuery
>;
export const listJsaForms = /* GraphQL */ `query ListJsaForms(
  $CustomerName: String
  $filter: ModelJsaFormFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listJsaForms(
    CustomerName: $CustomerName
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
      WorkTicketID
      CustomerName
      CreatedBy
      FormDate
      EffectiveDate
      Location
      FinalProductFile
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListJsaFormsQueryVariables,
  APITypes.ListJsaFormsQuery
>;
export const syncJsaForms = /* GraphQL */ `query SyncJsaForms(
  $filter: ModelJsaFormFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncJsaForms(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
      WorkTicketID
      CustomerName
      CreatedBy
      FormDate
      EffectiveDate
      Location
      FinalProductFile
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncJsaFormsQueryVariables,
  APITypes.SyncJsaFormsQuery
>;
export const getCapillaryForm = /* GraphQL */ `query GetCapillaryForm($WorkTicketID: String!) {
  getCapillaryForm(WorkTicketID: $WorkTicketID) {
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
` as GeneratedQuery<
  APITypes.GetCapillaryFormQueryVariables,
  APITypes.GetCapillaryFormQuery
>;
export const listCapillaryForms = /* GraphQL */ `query ListCapillaryForms(
  $WorkTicketID: String
  $filter: ModelCapillaryFormFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listCapillaryForms(
    WorkTicketID: $WorkTicketID
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCapillaryFormsQueryVariables,
  APITypes.ListCapillaryFormsQuery
>;
export const syncCapillaryForms = /* GraphQL */ `query SyncCapillaryForms(
  $filter: ModelCapillaryFormFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncCapillaryForms(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncCapillaryFormsQueryVariables,
  APITypes.SyncCapillaryFormsQuery
>;
export const getTemplate = /* GraphQL */ `query GetTemplate($TemplateID: ID!) {
  getTemplate(TemplateID: $TemplateID) {
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
` as GeneratedQuery<
  APITypes.GetTemplateQueryVariables,
  APITypes.GetTemplateQuery
>;
export const listTemplates = /* GraphQL */ `query ListTemplates(
  $TemplateID: ID
  $filter: ModelTemplateFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listTemplates(
    TemplateID: $TemplateID
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTemplatesQueryVariables,
  APITypes.ListTemplatesQuery
>;
export const syncTemplates = /* GraphQL */ `query SyncTemplates(
  $filter: ModelTemplateFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncTemplates(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncTemplatesQueryVariables,
  APITypes.SyncTemplatesQuery
>;
export const getUser = /* GraphQL */ `query GetUser($UserID: ID!) {
  getUser(UserID: $UserID) {
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
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
export const listUsers = /* GraphQL */ `query ListUsers(
  $UserID: ID
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listUsers(
    UserID: $UserID
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
export const syncUsers = /* GraphQL */ `query SyncUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncUsers(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.SyncUsersQueryVariables, APITypes.SyncUsersQuery>;
export const getPricingPlan = /* GraphQL */ `query GetPricingPlan($id: ID!) {
  getPricingPlan(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetPricingPlanQueryVariables,
  APITypes.GetPricingPlanQuery
>;
export const listPricingPlans = /* GraphQL */ `query ListPricingPlans(
  $id: ID
  $filter: ModelPricingPlanFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listPricingPlans(
    id: $id
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPricingPlansQueryVariables,
  APITypes.ListPricingPlansQuery
>;
export const syncPricingPlans = /* GraphQL */ `query SyncPricingPlans(
  $filter: ModelPricingPlanFilterInput
  $limit: Int
  $nextToken: String
  $lastSync: AWSTimestamp
) {
  syncPricingPlans(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    lastSync: $lastSync
  ) {
    items {
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
    nextToken
    startedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SyncPricingPlansQueryVariables,
  APITypes.SyncPricingPlansQuery
>;
