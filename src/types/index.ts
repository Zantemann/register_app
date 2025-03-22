export type AttendanceStatus = 'attending' | 'not_attending' | 'not_responded';

export interface IUser {
  _id: string;
  fullName: string;
  phoneNumber?: string;
  registerStatus: AttendanceStatus;
  allergies?: string;
  guests: Array<IUser>;
}

export interface ISession {
  _id: string;
  sessionId: string;
  userId: IUser;
  expiresAt: Date;
}
