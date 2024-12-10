import { EUserType } from '../enums/EUserType';

export interface IUserInfo {
  name: string;
  email: string;
  picture: string;
  type: EUserType;
  exp: number;
}
