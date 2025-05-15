import { IPermission } from "./permission.model";

export interface IGroup {
  group_id: number;
  name: string;
  permissions: IPermission[];
  is_active: true;
}
