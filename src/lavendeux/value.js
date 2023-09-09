/**
 * Valid types for function/decorator arguments
 */
export const Types = {
    Float:"Float", Integer:"Integer", Numeric:"Numeric",
    
    // These can be converted from any type
    String:"String", Boolean:"Boolean", Array:"Array", Object:"Object",
    Any:""
}
    
    /**
 * A value for use with Lavendeux
 */
export class LavendeuxValue {
    /**
     * Determine the type of an incoming value
     * @param {Object} inValue 
     * @returns Type of the value given
     */
    static typeOf(inValue) {
        let inType = Object.keys(inValue);
        return inType.length ? inType[0] : false;
    }

    /**
     * Cooerce a value to a given type
     * Should mimic Lavendeux's type cooersion
     * @param {Any} value 
     * @param {String} targetType Type to wrap as
     * @returns New value
     */
    static cooerce(value, targetType) {
        switch (targetType) {
            case 'Integer': return Math.floor( Number(value) );
            case 'Numeric':
            case 'Float': 
                return Number(value);
            case 'Boolean': return !!value;
            case 'String':
                if (Array.isArray(value) || typeof value === 'object') {
                    return JSON.stringify(value);
                } else {
                    return `${value}`;
                }
            case 'Array': 
                if (Array.isArray(value)) {
                    return value;
                } else if (typeof value === 'object') {
                    return Object.values(value);
                } else {
                    return [value];
                }
            case 'Object':
                if (Array.isArray(value)) {
                    return Object.assign({}, value);
                } else if (typeof value === 'object') {
                    return value;
                } else {
                    return {0: value};
                }
            default: return value;
        }
    }

    /**
     * Return a raw value
     * @param {Object} inValue 
     * @returns value
     */
    static unwrap(inValue) {
        let type = this.typeOf(inValue);
        let value = Object.values(inValue)[0];
        switch (type) {
            case 'Object':
                let result = {};
                for (const pair of value) {
                    let k = this.unwrap(pair[0]);
                    let v = this.unwrap(pair[1]);
                    switch (this.typeOf(pair[0])) {
                        case 'Object':
                        case 'Array':
                            k = JSON.stringify(k);
                            break;
                        default:
                    }
                    result[k] = v;
                }
                value = result;
                break;
            case 'Array':
                Object.keys(value).forEach(k => {
                    value[k] = this.unwrap(value[k]);
                });
                break;
        }

        return value;
    }

    /**
     * Wrap a value for returning to Lavendeux
     * @param {Any} value 
     * @param {String} targetType Type to wrap as
     * @returns Wrapped value
     */
    static wrap(value, targetType=Types.Any) {
        value = this.cooerce(value, targetType);

        if (Array.isArray(value)) {
            return {'Array': value.map(e => this.wrap(e))}
        } else if (typeof value === 'object') {
            let result = [];
            Object.keys(value).forEach(k => {
                result.push([
                    this.wrap(k),
                    this.wrap(value[k])
                ])
            });
            return {'Object': result};
        } else if (typeof value === 'string' || value instanceof String) {
            return {'String': value};
        } else if (Number.isInteger(value)) {
            return {'Integer': value};
        } else if (Number(value) === value) {
            return {'Float': value};
        } else return {'Boolean': value == true};
    }
}
