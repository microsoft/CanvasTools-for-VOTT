import { Tag } from "./Tag";

export class TagsDescriptor {
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
}
