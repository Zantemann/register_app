export type RegisterStatus = 'attending' | 'not_attending' | 'not_responded';

export interface IUser {
  _id: string;
  fullName: string;
  phoneNumber?: string;
  registerStatus: RegisterStatus;
  allergies?: string;
  guests: Array<IUser>;
}

export interface ISession {
  _id: string;
  sessionId: string;
  userId: IUser;
  expiresAt: Date;
}
