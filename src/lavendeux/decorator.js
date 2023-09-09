import { Types } from './value';
import { LavendeuxFunction } from './function';

/**
 * A callable @decorator for use in Lavendeux
 */
export class LavendeuxDecorator extends LavendeuxFunction {
    constructor(name, expectedType, callback) {
        super(name, Types.String, callback);
        this._addArgument(expectedType);
    }

    registeredName() {
        return `lavendeuxdecorator_${this.name}`;
    }

    register() {
        let callbackName = this.registeredName();
        globalThis.extensionDetails.decorators[this.name] = callbackName;
        globalThis[`${callbackName}_args`] = this.args;
        globalThis[callbackName] = (argv) => this.call(argv);
    }
}