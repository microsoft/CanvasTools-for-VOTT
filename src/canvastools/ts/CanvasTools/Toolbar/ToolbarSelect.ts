import { ToolbarAction } from './ToolbarAction';
export type IconCallback = (action: string) => void;

export class ToolbarSelect {
    public onAction: IconCallback;
    public action: ToolbarAction;
    public key: string[];
    protected focused: boolean = false;
    protected isSelected: boolean = false;

    constructor(onAction: IconCallback, action?: ToolbarAction, key?: string[]) {
        this.onAction = onAction;
        this.action = action
        this.key = key;
    }

    public select() {
        this.isSelected = true;
    }

    public unselect() {
        this.isSelected = false;
    }

    public activate() {
        if (this.action) {
            this.onAction(this.action);
            this.select();
        }
    }

    public isFocused() {
        return this.focused;
    }
    
    protected onfocusCallback = () => {
        this.focused = true;
    }

    protected onfocusoutCallback = () => {
        this.focused = false;
    }
}