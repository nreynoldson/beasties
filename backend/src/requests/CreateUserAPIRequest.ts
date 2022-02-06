/**
 * Fields in a request to create a single Post item.
 */
 export interface CreateUserAPIRequest {
    userName: string
    dateOfBirth: string
    email: string
    zipcode: string
    isShelterOwner: boolean
    shelterName: string
    avatar: string
  }