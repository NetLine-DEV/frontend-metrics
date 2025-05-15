import { IContentType } from "./contentType.model";

export interface IPermission {
  id: number;
  name: string;
  codename: string;
  content_type: IContentType;
}
