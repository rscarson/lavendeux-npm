import { LavendeuxValue, Types } from './value';

/**
 * An argument to a function or @decorator
 */
export class LavendeuxArgument {
    constructor(type, optional=false) {
        this.type = type;
        this.optional = optional;
    }

    /**
     * Parse a value and cooerce it to the right type
     * @param {Object} inValue 
     * @returns value
     */
    unwrap(inValue) {
        let value = LavendeuxValue.unwrap(inValue);
        return LavendeuxValue.cooerce(value, this.type);
    }

    /**
     * Validate a value against this argument
     * @param {Object} inValue 
     * @returns boolean
     */
    validate(inValue) {
        if (this.type == Types.Any) return true;
        let inType = LavendeuxValue.typeOf(inValue);
        switch(this.type) {
            case 'Integer':
            case 'Float':
            case 'Numeric':
                return ['Integer', 'Float'].includes(inType);
            
            default:
                // Other types can always be cooerced
                return true;
        }
    }
}