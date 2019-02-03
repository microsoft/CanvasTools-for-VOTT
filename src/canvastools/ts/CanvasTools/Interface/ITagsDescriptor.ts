import { ITag } from "./ITag";

/**
 * Defines a collection of tags for specified object.
 * @remarks Instead of just defining an array of tags, a clear split to the primary tag
 * and secondary tags is used. It is more a presentation level decision.
 */
export interface ITagsDescriptor {
    /**
     * The primary tag of the object.
     */
    primary: ITag;

    /**
     * The collection of additional tags of the object.
     */
    secondary?: ITag[];
}
