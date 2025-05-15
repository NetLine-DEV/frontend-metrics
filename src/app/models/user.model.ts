import { IGroup } from "./group.model";
import { IPermission } from "./permission.model";

export interface IUser {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  is_superuser: boolean;
  groups: IGroup[];
  permissions: IPermission[];
}
