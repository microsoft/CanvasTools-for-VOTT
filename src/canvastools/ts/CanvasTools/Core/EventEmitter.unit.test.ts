import { EventEmitter } from "./EventEmitter";

describe("EventEmitter Tests", () => {
    it("Create Emitter", () => {
        const emitter = new EventEmitter();

        expect(emitter).not.toBeNull();
        expect(emitter).toHaveProperty("on");
        expect(emitter).toHaveProperty("off");
        expect(emitter).toHaveProperty("emit");
    });

    it("Subscribe one handler to event", () => {
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

    it("Subscribe multiple handlers to event", () => {
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

    it("Subscrube and unsubscribe from event", () => {
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

    it("Subscribe to multiple events", () => {
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

    it("Subscrybe async with promise", async () => {
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
