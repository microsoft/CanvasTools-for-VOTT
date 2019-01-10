import { ITag } from "./ITag";

export interface ITagsDescriptor {
    primary: ITag;
    secondary?: ITag[];
}
