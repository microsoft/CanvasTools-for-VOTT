import { Tag, ITag } from "./Tag";

export interface ITagsDescriptor {
    primary: ITag;
    secondary?: ITag[];
}

export class TagsDescriptor {
    public static BuildFromJSON(data: ITagsDescriptor): TagsDescriptor {
        let p = Tag.BuildFromJSON(data.primary);
        let s = (data.secondary === undefined) ? [] : data.secondary.map((tag) => Tag.BuildFromJSON(tag));

        return new TagsDescriptor(p, s);
    }

    public primary: Tag;
    public secondary: Tag[];

    constructor(primaryTag: Tag, secondaryTags: Tag[] = []) {
        this.primary = primaryTag;
        this.secondary = secondaryTags;
    }

    public toString(): string {
        let str = this.primary.name;

        this.secondary.forEach((tag) => {
            str += " " + tag.name;
        });

        return str;
    }

    public toJSON(): ITagsDescriptor {
        return {
            primary: this.primary.toJSON(),
            secondary: this.secondary.map((tag) => tag.toJSON())
        }
    }
}
