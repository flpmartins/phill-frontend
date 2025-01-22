interface IProfile {
  id: string
  description: string
  permissions: string[]
}

export interface IUser {
  id?: string | null
  name: string
  phone: string
  email: string
  cpf?: string
  avatar?: string | null
  id_profile: string
  profile: IProfile
}
