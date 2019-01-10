import { Tag } from "./Tag";
import { ITagsDescriptor } from "../Interface/ITagsDescriptor";

/**
 * Represents a composition of region tags
 */
export class TagsDescriptor {
    /**
     * Creates a new `TagDescriptor` object based on extracting specific properties from any provided object
     * @remarks The `TagDescriptor` object is *immutable*. All public properties return copies of objects.
     * @param data - An `ITagDescriptor` object with the `primary` and `secondary`
     * properties implementing `ITag` and `ITag[]` interfaces
     * @returns A new `TagDescriptor` object
     */
    public static BuildFromJSON(data: ITagsDescriptor): TagsDescriptor {
        let p = null;
        if (data.primary !== null && data.primary !== undefined) {
            p = Tag.BuildFromJSON(data.primary);
        }
        const s = (data.secondary === undefined) ? [] : data.secondary.map((tag) => Tag.BuildFromJSON(tag));

        return new TagsDescriptor(p, s);
    }

    private allTags: Tag[];
    private primaryTag: Tag;

    /**
     * Returns an array of all tags (no order guaranteed). *Readonly*
     */
    public get all() {
        return this.allTags.map((tag) => tag.copy());
    }

    /**
     * Returns the primary tag. *Readonly*
     */
    public get primary(): Tag {
        if (this.primaryTag !== null) {
            return this.primaryTag.copy();
        } else {
            return null;
        }
    }

    /**
     * Returns an array of all secondary tags (no order guaranteed). *Readonly*
     */
    public get secondary(): Tag[] {
        if (this.primaryTag !== null) {
            return this.all.filter((tag) => {
                return (tag.name !== this.primary.name);
            });
        } else {
            return this.all;
        }
    }

    /**
     * Creates a new  empty`TagDescriptor` object
     */
    constructor();
    /**
     * Creates a new `TagDescriptor` object with specified tags
     * @param tags - A tags array with the `tags[0]` used as `primaryTag`
     */
    constructor(tags: Tag[]);
    constructor(primaryTag: Tag, secondaryTags: Tag[]);
    /**
     * Creates a new `TagDescriptor` object with specified tags
     * @param primaryTag - Primary `Tag` for the descriptor
     * @param secondaryTags - An array of secondary tags (optional)
     */
    constructor(arg1?: Tag|Tag[], arg2: Tag[] = []) {
        // empty TagsDescriptor
        if (arg1 === undefined) {
            this.primaryTag = null;
            this.allTags = [];
        } else if (arg1 instanceof Tag) {
            // arg1 = primaryTag, arg2 = secondaryTag
            if (arg2 instanceof Array) {
                this.allTags = new Array<Tag>(arg1, ...arg2);
            } else {
                this.allTags = [arg1];
            }
            this.primaryTag = arg1;
        } else if (arg1 instanceof Array) {
            // arg1 = tags, ignore arg2
            this.allTags = arg1.map((tag) => tag.copy());
            if (arg1.length > 0) {
                this.primaryTag = arg1[0];
            } else {
                this.primaryTag = null;
            }
        } else if (arg1 === null) {
            // arg1 = null | undefined, ignore
            if (arg2 instanceof Array) {
                this.allTags = arg2.map((tag) => tag.copy());
            } else {
                this.allTags = [];
            }
            this.primaryTag = null;
        }
    }

    /**
     * Returns a string with a comma separated list of tags with primary tag first (if present)
     */
    public toString(): string {
        let str = "";
        if (this.primaryTag !== null) {
            str += this.primaryTag.name;

            this.secondary.forEach((tag) => {
                str += ", " + tag.name;
            });
        } else {
            this.secondary.forEach((tag) => {
                str += ", " + tag.name;
            });
            str = str.substring(2, str.length);
        }

        return str;
    }

    /**
     * Returns an `ITagsDescriptor` object with `primary` and `secondary` properties
     */
    public toJSON(): ITagsDescriptor {
        if (this.primaryTag !== null) {
            return {
                primary: this.primaryTag.toJSON(),
                secondary: this.secondary.map((tag) => tag.toJSON()),
            };
        } else {
            return {
                primary: null,
                secondary: this.secondary.map((tag) => tag.toJSON()),
            };
        }
    }
}
