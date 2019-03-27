export type EventHandler = (args?: any) => void;

export class EventEmitter {
    private handlers: {
        [eventName: string]: EventHandler[];
    };

    constructor() {
        this.handlers = Object.create({});
    }

    public on(eventName: string, handler: EventHandler) {
        if (this.handlers[eventName] === undefined) {
            this.handlers[eventName] = [handler];
        } else {
            // allow multiple occurencies of the handler
            this.handlers[eventName].push(handler);
        }
    }

    public onAsync(eventName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.on(eventName, resolve);
        });
    }

    public off(eventName: string, handler: EventHandler) {
        if (this.handlers[eventName] !== undefined) {
            // remove all handler occurencies
            this.handlers[eventName] = this.handlers[eventName].filter((h) => h !== handler);
        }
    }

    public emit(eventName: string, args?: any) {
        if (this.handlers[eventName] !== undefined) {
            this.handlers[eventName].forEach((handler) => handler(args));
        }
    }
}
