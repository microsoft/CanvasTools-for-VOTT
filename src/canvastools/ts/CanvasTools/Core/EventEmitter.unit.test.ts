import { EventEmitter } from "./EventEmitter";

describe("Core.EventEmitter Tests", () => {
    it("emitter can be created", () => {
        const emitter = new EventEmitter();

        expect(emitter).not.toBeNull();
        expect(emitter).toHaveProperty("on");
        expect(emitter).toHaveProperty("off");
        expect(emitter).toHaveProperty("emit");
    });

    it("emitter works with one handler per one event (on, emit)", () => {
        const emitter = new EventEmitter();

        const eventName = "test";
        let testValue = 0;
        const defaultValue = 1;
        const newValue = 10;

        emitter.on(eventName, (value?) => {
            if (value !== undefined) {
                testValue = value;
            } else {
                testValue = defaultValue;
            }
        });
        expect(testValue).toBe(0);

        emitter.emit(eventName);
        expect(testValue).toBe(defaultValue);

        emitter.emit(eventName, newValue);
        expect(testValue).toBe(newValue);
    });

    it("emitter works with multiple handlers for one event (on, emit)", () => {
        const emitter = new EventEmitter();

        const eventName = "test";
        const testValues = [];

        const handlersNumber = 3;
        for (let i = 0; i < handlersNumber; i++) {
            emitter.on(eventName, () => {
                const v = i;
                testValues.push(v);
            });
        }

        emitter.emit(eventName);
        expect(testValues.length).toBe(handlersNumber);
        for (let i = 0; i < handlersNumber; i++) {
            expect(testValues).toContain(i);
        }
    });

    it("emitter allos subscribing and unsubscribing from event (on, off, emit)", () => {
        const emitter = new EventEmitter();
        const eventName = "test";

        const testValues = [];
        let setValue = 0;

        const callback = () => {
            testValues.push(setValue++);
        };

        emitter.on(eventName, callback);
        emitter.emit(eventName);
        expect(testValues.length).toBe(1);

        emitter.off(eventName, callback);
        emitter.emit(eventName);
        expect(testValues.length).toBe(1);
    });

    it("emitters works with multiple events (on, emit)", () => {
        const emitter = new EventEmitter();
        const eventName1 = "one";
        const eventName2 = "two";
        const testValues = [];
        const setValue1 = 1;
        const setValue2 = 2;

        emitter.on(eventName1, () => {
            testValues.push(setValue1);
        });

        emitter.on(eventName2, () => {
            testValues.push(setValue2);
        });

        emitter.emit(eventName1);
        expect(testValues.length).toBe(1);
        expect(testValues).toContain(setValue1);

        emitter.emit(eventName2);
        expect(testValues.length).toBe(2);
        expect(testValues).toContain(setValue2);
    });

    it("emitter allow async promises wrappers for handlers (onAsync, emit)", async () => {
        const emitter = new EventEmitter();
        const eventName = "test";

        let testValue = 0;
        const setValue = 1;
        const promise = emitter.onAsync(eventName).then(() => {
            testValue = setValue;
        });

        emitter.emit(eventName);
        await promise;
        expect(testValue).toBe(setValue);
    });
});
