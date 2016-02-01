declare type UserProfile = {
  _id?: string,
  userId: string,
  isSystemAdmin: boolean,
  isCenterAdmin: boolean,
  isValidated: boolean,
  name: string,
  phone: string,
  email: string,
  createdAt: string,
  updatedAt: string,
  updatedBy: string,
  isRemoved: boolean
}
