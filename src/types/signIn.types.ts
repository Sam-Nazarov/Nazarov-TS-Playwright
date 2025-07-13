import { ROLES } from 'data/roles.data';
import { IResponseFields } from './api.types';

export interface ICredentials {
  username: string;
  password: string;
}

export interface IUser {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  createdOn: string;
  roles: ROLES[];
}

export interface ILoginResponse extends IResponseFields {
  User: IUser;
}

export interface IUsersResponse extends IResponseFields {
  Users: IUser[];
}
