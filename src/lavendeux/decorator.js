import { LavendeuxFunction } from './function';
import { Types, LavendeuxValue } from './value';

export class LavendeuxDecorator extends LavendeuxFunction {
    constructor(name, argumentType, callback) {
        super(name, Types.String, callback);
        this.argumentTypes = [argumentType]
        this.registeredName = LavendeuxDecorator.getRegisteredName(name);
    }

    /**
     * Get a unique identifier for a decorator
     * @returns A unique name for this decorator
     */
    static getRegisteredName(name) {
        return `lavendeuxdecorator_${name}`;
    }

    call(arg) {
        return LavendeuxValue.unwrap(
            super.call([arg]),
            Types.String
        );
    }
}