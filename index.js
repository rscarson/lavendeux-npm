"use strict";

import { name, author, version } from './package.json';

class LavendeuxValue {
    /**
     * Valid types for function/decorator arguments
     */
    static Types = {
        Float:"Float", Integer:"Integer", IntOrFloat:"Float|Integer",
        
        // These can be converted from any type
        String:"String", Boolean:"Boolean", Array:"Array", Object:"Object",
        Any:""
    }

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
     * Return a raw value
     * @param {Object} inValue 
     * @returns value
     */
    static parse(inValue) {
        let type = LavendeuxValue.typeOf(inValue);
        let value = inValue[type];
        switch (type) {
            case 'Object':
                Object.keys(value).forEach(k => {
                    value[this.parse(k)] = value[k];
                    delete value[k];
                });
            case 'Array':
                Object.keys(value).forEach(k => {
                    value[k] = this.parse(value[k]);
                });
                break;
        }

        return value;
    }

    /**
     * Wrap a value for returning to Lavendeux
     * @param {Any} value 
     * @returns Wrapped value
     */
    static wrapValue(value) {
        if (Array.isArray(value)) {
            return value.map(e => LavendeuxValue.wrapValue(e))
        } else if (typeof value === 'object') {
            let result = {};
            Object.keys(value).forEach(k => {
                result[LavendeuxValue.wrapValue(k)] = LavendeuxValue.wrapValue(value[k]);
            });
            return result;
        } else if (typeof value === 'string' || value instanceof String) {
            return {'String': value};
        } else if (Number.isInteger(value)) {
            return {'Integer': value};
        } else if (Number(value) === value) {
            return {'Float': value};
        } else return {'Boolean': value == true};
    }
}

/**
 * An argument to a function or @decorator
 */
class LavendeuxArgument {
    constructor(type, optional=false) {
        this.type = type.split("|");
        this.optional = optional;
    }

    /**
     * Validate a value against this argument
     * @param {Object} inValue 
     * @returns boolean
     */
    validate(inValue) {
        if (this.type.length === 0) return true;
        else return this.type.includes(
            LavendeuxValue.typeOf(inValue)
        );
    }
}

/**
 * A callable function for use in Lavendeux
 */
class LavendeuxFunction {
    constructor(name, callback) {
        this.name = name;
        this.args = [];
        this.callback = callback;
        this.argListLocked = false;

        this.register();
    }

    registeredName() {
        return `lavendeuxfunction_${this.name}`;
    }

    /**
     * Add an integer typed argument to the function
     * @param {Boolean} optional True if the argument is optional.
     */
    addIntegerArgument(optional=false) {
        return this._addArgument(LavendeuxValue.Types.Integer, optional);
    }

    /**
     * Add a float typed argument to the function
     * @param {Boolean} optional True if the argument is optional.
     */
    addFloatArgument(optional=false) {
        return this._addArgument(LavendeuxValue.Types.Float, optional);
    }

    /**
     * Add a int or float typed argument to the function
     * @param {Boolean} optional True if the argument is optional.
     */
    addNumericArgument(optional=false) {
        return this._addArgument(LavendeuxValue.Types.IntOrFloat, optional);
    }

    /**
     * Add a string typed argument to the function
     * @param {Boolean} optional True if the argument is optional.
     */
    addStringArgument(optional=false) {
        return this._addArgument(LavendeuxValue.Types.String, optional);
    }

    /**
     * Add a boolean typed argument to the function
     * @param {Boolean} optional True if the argument is optional.
     */
    addBooleanArgument(optional=false) {
        return this._addArgument(LavendeuxValue.Types.Boolean, optional);
    }

    /**
     * Add an array typed argument to the function
     * @param {Boolean} optional True if the argument is optional.
     */
    addArrayArgument(optional=false) {
        return this._addArgument(LavendeuxValue.Types.Array, optional);
    }

    /**
     * Add an object typed argument to the function
     * @param {Boolean} optional True if the argument is optional.
     */
    addObjectArgument(optional=false) {
        return this._addArgument(LavendeuxValue.Types.Object, optional);
    }

    /**
     * Add an untyped argument to the function
     * @param {Boolean} optional True if the argument is optional.
     */
    addArgument(optional=false) {
        return this._addArgument(LavendeuxValue.Types.Any, optional);
    }

    /**
     * Add a parameter to the function
     * @param {String} type The type of value expected (LavendeuxValue.Types)
     * @param {Boolean} optional True if the argument is optional.
     * @returns This object, for call chaining
     */
    _addArgument(type, optional=false) {
        let callbackName = this.registeredName();
        if (this.argListLocked) {
            throw new Error(`Optional arguments must be the last parameter in a function!`);
        }
        globalThis[`${callbackName}_args`].push(
            new LavendeuxArgument(type, optional)
        );
        this.argListLocked = optional;
        return this;
    }

    call(argv) {
        let callbackName = this.registeredName();
        let expectedArgs = globalThis[`${callbackName}_args`];

        // Validate number of arguments
        let hasOptional = expectedArgs.length ? expectedArgs[expectedArgs.length - 1].optional : false;
        if (argv.length < expectedArgs.length - hasOptional?1:0) {
            throw new Error(`Missing a parameter for ${this.name}: Expected ${expectedArgs.length} arguments`);
        }

        // Validate type of arguments and decode them
        Object.keys(argv).forEach(k => {
            if (expectedArgs[k] && !expectedArgs[k].validate(argv[k])) {
                throw new Error(`Invalid value for parameter ${k+1} of ${this.name}: Expected ${argv[k].type}`);
            }
            argv[k] = LavendeuxValue.parse(argv[k]);
        });

        // Populate the state
        let state = (typeof getState === "function") ? getState() : {};
        
        // Run the inner callback function
        let value = LavendeuxValue.wrapValue(
            this.callback(...argv)
        );

        // Return the new state
        if (typeof setState === "function") {
            setState(state);
        }

        return value;
    }

    register() {
        let callbackName = this.registeredName();
        globalThis.extension.functions[this.name] = callbackName;
        globalThis[`${callbackName}_args`] = this.args;
        globalThis[callbackName] = (argv) => this.call(argv);
    }
}

/**
 * A callable @decorator for use in Lavendeux
 */
class LavendeuxDecorator extends LavendeuxFunction {
    constructor(name, expectedType, callback) {
        super(name, callback);
        this._addArgument(expectedType);
    }

    registeredName() {
        return `lavendeuxdecorator_${this.name}`;
    }

    register() {
        let callbackName = this.registeredName();
        globalThis.extension.decorators[this.name] = callbackName;
        globalThis[`${callbackName}_args`] = this.args;
        globalThis[callbackName] = (argv) => {
            // Wrap as a string
            let v = LavendeuxValue.parse(this.call(argv));
            return LavendeuxValue.wrapValue(`${v}`);
        };
    }
}

/**
 * A lavendeux extension.
 * Use Lavendeux.fromPackage() to build one,
 * then add functions and arguments like so:
 * 
 * function testDecorator(input) {
 *      return 100 * input;
 * }
 * 
 * function testFunction(left, right) {
 *      return left * right;
 * }
 * 
 * const extension = Lavendeux.fromPackage();
 * extension.addIntegerDecorator('test', testDecorator);

 * extension.addFunction('test', testFunction)
 *      .addNumericArgument()
 *      .addNumericArgument();
 * 
 * // Your new extension can then be called from inside Lavendeux with:
 * //   test() and @test
 */
export class Lavendeux {

    /**
     * Build a new extension
     */
    constructor(_name, _author, _version="1.0.0") {
        globalThis.extension = {
            name: `${_name}`,
            author: `${_author}`,
            version: `${_version}`,

            functions: {},
            decorators: {}
        };
    }

    /**
     * Build an extension from the contents of package.json
     * @returns A new extension instance
     */
    static fromPackage() {
        return new Lavendeux(name, author, version);
    }

    /**
     * Add a callable function
     * @param {String} name The name of the new function
     * @param {*} callback Callback function to execute
     */
    addFunction(name, callback) {
        return new LavendeuxFunction(name, callback);
    }

    /**
     * Add a callable decorator
     * @param {String} name The name of the new decorator
     * @param {String} expectedType The type expected by the decorator (LavendeuxValue.Types)
     * @param {*} callback Callback function to execute
     */
    _addDecorator(name, expectedType, callback) {
        return new LavendeuxDecorator(name, expectedType, callback);
    }

    /**
     * Add a callable decorator that wraps the integer type
     * @param {String} name The name of the new decorator
     * @param {*} callback Callback function to execute
     */
    addIntegerDecorator(name, callback) {
        return this._addDecorator(name, LavendeuxValue.Types.Integer, callback);
    }

    /**
     * Add a callable decorator that wraps the float type
     * @param {String} name The name of the new decorator
     * @param {*} callback Callback function to execute
     */
    addFloatDecorator(name, callback) {
        return this._addDecorator(name, LavendeuxValue.Types.Float, callback);
    }

    /**
     * Add a callable decorator that wraps the integer or float type
     * @param {String} name The name of the new decorator
     * @param {*} callback Callback function to execute
     */
    addNumericDecorator(name, callback) {
        return this._addDecorator(name, LavendeuxValue.Types.IntOrFloat, callback);
    }

    /**
     * Add a callable decorator that wraps the string type
     * @param {String} name The name of the new decorator
     * @param {*} callback Callback function to execute
     */
    addStringDecorator(name, callback) {
        return this._addDecorator(name, LavendeuxValue.Types.String, callback);
    }

    /**
     * Add a callable decorator that wraps the boolean type
     * @param {String} name The name of the new decorator
     * @param {*} callback Callback function to execute
     */
    addBooleanDecorator(name, callback) {
        return this._addDecorator(name, LavendeuxValue.Types.Boolean, callback);
    }

    /**
     * Add a callable decorator that wraps the array type
     * @param {String} name The name of the new decorator
     * @param {*} callback Callback function to execute
     */
    addArrayDecorator(name, callback) {
        return this._addDecorator(name, LavendeuxValue.Types.Array, callback);
    }

    /**
     * Add a callable decorator that wraps the object type
     * @param {String} name The name of the new decorator
     * @param {*} callback Callback function to execute
     */
    addObjectDecorator(name, callback) {
        return this._addDecorator(name, LavendeuxValue.Types.Object, callback);
    }

    /**
     * Add a callable decorator that wraps any type
     * @param {String} name The name of the new decorator
     * @param {*} callback Callback function to execute
     */
    addDecorator(name, callback) {
        return this._addDecorator(name, LavendeuxValue.Types.Any, callback);
    }
}