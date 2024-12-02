import { EUserType } from '../enums/EUserType';

export interface IUserInfo {
  name: string;
  email: string;
  picture: string;
  userType: EUserType;
  exp: number;
}
