
declare type Name = {
  first: string,
  last: string,
  middle: string,
  nickname: string
}

declare type Address = {
  street: string,
  city: string,
  county: string,
  state: string,
  zip: string,
  phone_day: string,
  phone_eve: string,
  phone_mbl: string,
  email: string
}

declare type HistoryLog = {
  id: string,
  change: string
}

declare type Call = {
  assigned_to: string,
  fm_number: string,
  mail_sent: boolean,
  email_sent: boolean,
  history: HistoryLog[]
}

declare type Flight = {
  id: string,
  status: string,
  status_note: string,
  confirmed_date: string,
  confirmed_by: string,
  seat: string,
  bus: string,
  waiver: boolean,
  history: HistoryLog[]
}

declare type VeteranFlight = {
  flight: Flight,
  group: string
}

declare type GuardianFlight = {
  flight: Flight,
  training: string,
  training_notes: string,
  training_complete: boolean,
  paid: boolean,
  booksOrdered: number
}

declare type Pairing = {
  id: string,
  name: string
}

declare type PairedVeterans = {
  pref_notes: string,
  pairings: Pairing[],
  history: HistoryLog[]
}

declare type Shirt = {
  size: string
}

declare type Notes = {
  other: string,
  service: string
}

declare type VeteranMedical = {
  limitations: string,
  examRequired: boolean,
  level: string,
  review: string,
  usesWheelchair: boolean,
  usesCane: boolean,
  usesWalker: boolean,
  usesScooter: boolean,
  requiresOxygen: boolean,
  isWheelchairBound: boolean,
  release: boolean
}

declare type GuardianMedical = {
  limitations: string,
  experience: string,
  release: boolean
}

declare type Metadata = {
  created_at: string,
  created_by: string,
  updated_at: string,
  updated_by: string
}

declare type Contact = {
  relation: string,
  name: string,
  address: Address
}

declare type MilService = {
  service_number: string,
  dates: string,
  rank: string,
  branch: string,
  activity: string
}


declare type PairedGuardian = {
  pref_notes: string,
  id: string,
  name: string,
  history: HistoryLog[]
}

declare type Apparel = {
  date: string,
  item: string,
  delivery: string,
  notes: string,
  by: string
}

declare type General = {
  app_date: string,
  name: Name,
  address: Address,
  shirt: Shirt,
  birth_date: string,
  weight: string,
  gender: string,
  alt_contact: Contact,
  emerg_contact: Contact,
  call: Call,
  apparel: Apparel,
  metadata: Metadata
}

declare type VeteranDbDoc = {
  _id: string,
  _rev: string,
  general: General,
  guardian: PairedGuardian,
  vet_type: string,
  medical: VeteranMedical,
  service: MilService,
  media_ok: boolean,
  flight: VeteranFlight
}

declare type GuardianDbDoc = {
  _id: string,
  _rev: string,
  general: General,
  veteran: PairedVeterans,
  occupation: string,
  medical: GuardianMedical,
  notes: Notes,
  flight: GuardianFlight
}

declare type VeteranCallSheet = {
  _id?: string,
  data: VeteranDbDoc,
  requestedGuradian: Contact,
  isRemoved: boolean

}

declare type GuardianCallSheet = {
  _id?: string,
  data: GuardianDbDoc,
  understandsFee: boolean,
  acceptsMailCall: boolean,
  isRemoved: boolean
}

