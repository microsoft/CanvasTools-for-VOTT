export declare class Tag {
    colorHue: number;
    name: string;
    id: string;
    private __colorPure;
    readonly colorPure: string;
    private __colorAccent;
    readonly colorAccent: string;
    private __colorHighlight;
    readonly colorHighlight: string;
    private __colorShadow;
    readonly colorShadow: string;
    private __colorNoColor;
    readonly colorNoColor: string;
    private __colorDark;
    readonly colorDark: string;
    constructor(name: string, colorHue: number, id?: string);
    static getHueFromColor(color: string): number;
}
export declare class TagsDescriptor {
    primary: Tag;
    secondary: Array<Tag>;
    constructor(primaryTag: Tag, secondaryTags?: Array<Tag>);
    toString(): string;
}
