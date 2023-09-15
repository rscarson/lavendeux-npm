"use strict";

import { Types } from './value';
import { LavendeuxFunction } from './function';
import { argv } from 'process';

export { Types } from './value';

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
    constructor(name, author, version) {
        this.name = name;
        this.author = author;
        this.version = version;
        this.functions = {};
        this.decorators = {};

        this.allHandlers = {};
    }

    static register(instance) {
        globalThis.extension = () => instance;
        Object.keys(instance.allHandlers).forEach(f => {
            globalThis[f.registeredName] = (argv) => f.call(argv);
        });
    }

    /**
     * Get the inner callback for a registered function
     * @param {String} name Function name to retrieve
     * @returns 
     */
    getFunctionCallback(name) {
        this.allHandlers[ this.functions[name] ].callback;
    }

    /**
     * Get the inner callback for a registered decorator
     * @param {String} name Function name to retrieve
     * @returns 
     */
    getDecoratorCallback(name) {
        this.allHandlers[ this.decorators[name] ].callback;
    }

    /**
     * Add a callable function
     * @param {String} name The name of the new function
     * @param {*} callback Callback function to execute
     * @param {String} expectedType The type returned by the function (Types)
     */
    addFunction(name, callback, expectedType=Types.Any) {
        let f = new LavendeuxFunction(name, expectedType, callback);
        this.allHandlers[f.registeredName] = f;
        this.functions[name] = f.registeredName;
        return f;
    }

    /**
     * Add a callable function that returns the integer type
     * @param {String} name The name of the new function
     * @param {*} callback Callback function to execute
     */
    addIntegerFunction(name, callback) {
        return this.addFunction(name, callback, Types.Integer);
    }

    /**
     * Add a callable function that returns the float type
     * @param {String} name The name of the new function
     * @param {*} callback Callback function to execute
     */
    addFloatFunction(name, callback) {
        return this.addFunction(name, callback, Types.Float);
    }

    /**
     * Add a callable function that returns the integer or float type
     * @param {String} name The name of the new function
     * @param {*} callback Callback function to execute
     */
    addNumericFunction(name, callback) {
        return this.addFunction(name, callback, Types.Numeric);
    }

    /**
     * Add a callable function that returns the string type
     * @param {String} name The name of the new function
     * @param {*} callback Callback function to execute
     */
    addStringFunction(name, callback) {
        return this.addFunction(name, callback, Types.String);
    }

    /**
     * Add a callable function that returns the boolean type
     * @param {String} name The name of the new function
     * @param {*} callback Callback function to execute
     */
    addBooleanFunction(name, callback) {
        return this.addFunction(name, callback, Types.Boolean);
    }

    /**
     * Add a callable function that returns the array type
     * @param {String} name The name of the new function
     * @param {*} callback Callback function to execute
     */
    addArrayFunction(name, callback) {
        return this.addFunction(name, callback, Types.Array);
    }

    /**
     * Add a callable function that returns the object type
     * @param {String} name The name of the new function
     * @param {*} callback Callback function to execute
     */
    addObjectFunction(name, callback) {
        return this.addFunction(name, callback, Types.Object);
    }

    /**
     * Add a callable decorator
     * @param {String} name The name of the new decorator
     * @param {*} callback Callback function to execute
     * @param {String} expectedType The type expected by the decorator (Types)
     */
    addDecorator(name, callback, expectedType=Types.Any) {
        let f = new LavendeuxFunction(`@${name}`, Types.String, callback);
        f.addArgument(expectedType);

        this.allHandlers[f.registeredName] = f;
        this.decorators[name] = f.registeredName;
        return f;
    }

    /**
     * Add a callable decorator that wraps the integer type
     * @param {String} name The name of the new decorator
     * @param {*} callback Callback function to execute
     */
    addIntegerDecorator(name, callback) {
        return this.addDecorator(name, callback, Types.Integer);
    }

    /**
     * Add a callable decorator that wraps the float type
     * @param {String} name The name of the new decorator
     * @param {*} callback Callback function to execute
     */
    addFloatDecorator(name, callback) {
        return this.addDecorator(name, callback, Types.Float);
    }

    /**
     * Add a callable decorator that wraps the integer or float type
     * @param {String} name The name of the new decorator
     * @param {*} callback Callback function to execute
     */
    addNumericDecorator(name, callback) {
        return this.addDecorator(name, callback, Types.Numeric);
    }

    /**
     * Add a callable decorator that wraps the string type
     * @param {String} name The name of the new decorator
     * @param {*} callback Callback function to execute
     */
    addStringDecorator(name, callback) {
        return this.addDecorator(name, callback, Types.String);
    }

    /**
     * Add a callable decorator that wraps the boolean type
     * @param {String} name The name of the new decorator
     * @param {*} callback Callback function to execute
     */
    addBooleanDecorator(name, callback) {
        return this.addDecorator(name, callback, Types.Boolean);
    }

    /**
     * Add a callable decorator that wraps the array type
     * @param {String} name The name of the new decorator
     * @param {*} callback Callback function to execute
     */
    addArrayDecorator(name, callback) {
        return this.addDecorator(name, callback, Types.Array);
    }

    /**
     * Add a callable decorator that wraps the object type
     * @param {String} name The name of the new decorator
     * @param {*} callback Callback function to execute
     */
    addObjectDecorator(name, callback) {
        return this.addDecorator(name, callback, Types.Object);
    }}
