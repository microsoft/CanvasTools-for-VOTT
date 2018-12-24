import { Tag } from "./Tag";
import { ITagsDescriptor } from "../Interface/ITagsDescriptor";

/**
 * Represents a composition of region tags
 */
export class TagsDescriptor {
    /**
     * Creates a new `TagDescriptor` object based on extracting specific properties from any provided object 
     * @remarks The `TagDescriptor` object is *immutable*. All public properties return copies of objects.
     * @param data - An `ITagDescriptor` object with the `primary` and `secondary` properties implementing `ITag` and `ITag[]` interfaces
     * @returns A new `TagDescriptor` object
     */
    public static BuildFromJSON(data: ITagsDescriptor): TagsDescriptor {
        let p = Tag.BuildFromJSON(data.primary);
        let s = (data.secondary === undefined) ? [] : data.secondary.map((tag) => Tag.BuildFromJSON(tag));

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
        return this.primaryTag.copy();
    }

    /**
     * Returns an array of all secondary tags (no order guaranteed). *Readonly*
     */
    public get secondary(): Tag[] {
        return this.allTags.filter((tag) => {
            return (tag !== this.primary);
        })
    }

    /**
     * Creates a new `TagDescriptor` object with specified tags
     * @param primaryTag - Primary `Tag` for the descriptor
     * @param secondaryTags - An array of secondary tags (optional)
     */
    constructor(primaryTag: Tag, secondaryTags: Tag[] = []) {
        this.allTags = new Array<Tag>(primaryTag, ...secondaryTags);
        this.primaryTag = primaryTag;
    }

    /**
     * Returns a string with a space separated list of tags with primary tag first
     */
    public toString(): string {
        let str = this.primary.name;

        this.secondary.forEach((tag) => {
            str += " " + tag.name;
        });

        return str;
    }

    /**
     * Returns an `ITagsDescriptor` object with `primary` and `secondary` properties
     */
    public toJSON(): ITagsDescriptor {
        return {
            primary: this.primaryTag.toJSON(),
            secondary: this.secondary.map((tag) => tag.toJSON())
        }
    }
}
