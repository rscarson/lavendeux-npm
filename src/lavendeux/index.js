"use strict";

import { LavendeuxValue, Types } from './value';
import { LavendeuxFunction } from './function';
import { LavendeuxDecorator } from './decorator';

globalThis.extension = () => globalThis.extensionDetails;

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
    constructor(name, author, version="1.0.0") {
        globalThis.extensionDetails = {
            name: `${name}`,
            author: `${author}`,
            version: `${version}`,

            functions: {},
            decorators: {}
        };
    }

    /**
     * Add a callable function
     * @param {String} name The name of the new function
     * @param {*} callback Callback function to execute
     */
    _addFunction(name, expectedType, callback) {
        return new LavendeuxFunction(name, expectedType, callback);
    }

    /**
     * Add a callable function that wraps the integer type
     * @param {String} name The name of the new function
     * @param {*} callback Callback function to execute
     */
    addIntegerFunction(name, callback) {
        return this._addFunction(name, Types.Integer, callback);
    }

    /**
     * Add a callable function that wraps the float type
     * @param {String} name The name of the new function
     * @param {*} callback Callback function to execute
     */
    addFloatFunction(name, callback) {
        return this._addFunction(name, Types.Float, callback);
    }

    /**
     * Add a callable function that wraps the integer or float type
     * @param {String} name The name of the new function
     * @param {*} callback Callback function to execute
     */
    addNumericFunction(name, callback) {
        return this._addFunction(name, Types.Numeric, callback);
    }

    /**
     * Add a callable function that wraps the string type
     * @param {String} name The name of the new function
     * @param {*} callback Callback function to execute
     */
    addStringFunction(name, callback) {
        return this._addFunction(name, Types.String, callback);
    }

    /**
     * Add a callable function that wraps the boolean type
     * @param {String} name The name of the new function
     * @param {*} callback Callback function to execute
     */
    addBooleanFunction(name, callback) {
        return this._addFunction(name, Types.Boolean, callback);
    }

    /**
     * Add a callable function that wraps the array type
     * @param {String} name The name of the new function
     * @param {*} callback Callback function to execute
     */
    addArrayFunction(name, callback) {
        return this._addFunction(name, Types.Array, callback);
    }

    /**
     * Add a callable function that wraps the object type
     * @param {String} name The name of the new function
     * @param {*} callback Callback function to execute
     */
    addObjectFunction(name, callback) {
        return this._addFunction(name, Types.Object, callback);
    }

    /**
     * Add a callable function that wraps any type
     * @param {String} name The name of the new function
     * @param {*} callback Callback function to execute
     */
    addFunction(name, callback) {
        return this._addFunction(name, Types.Any, callback);
    }

    /**
     * Add a callable decorator
     * @param {String} name The name of the new decorator
     * @param {String} expectedType The type expected by the decorator (Types)
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
        return this._addDecorator(name, Types.Integer, callback);
    }

    /**
     * Add a callable decorator that wraps the float type
     * @param {String} name The name of the new decorator
     * @param {*} callback Callback function to execute
     */
    addFloatDecorator(name, callback) {
        return this._addDecorator(name, Types.Float, callback);
    }

    /**
     * Add a callable decorator that wraps the integer or float type
     * @param {String} name The name of the new decorator
     * @param {*} callback Callback function to execute
     */
    addNumericDecorator(name, callback) {
        return this._addDecorator(name, Types.Numeric, callback);
    }

    /**
     * Add a callable decorator that wraps the string type
     * @param {String} name The name of the new decorator
     * @param {*} callback Callback function to execute
     */
    addStringDecorator(name, callback) {
        return this._addDecorator(name, Types.String, callback);
    }

    /**
     * Add a callable decorator that wraps the boolean type
     * @param {String} name The name of the new decorator
     * @param {*} callback Callback function to execute
     */
    addBooleanDecorator(name, callback) {
        return this._addDecorator(name, Types.Boolean, callback);
    }

    /**
     * Add a callable decorator that wraps the array type
     * @param {String} name The name of the new decorator
     * @param {*} callback Callback function to execute
     */
    addArrayDecorator(name, callback) {
        return this._addDecorator(name, Types.Array, callback);
    }

    /**
     * Add a callable decorator that wraps the object type
     * @param {String} name The name of the new decorator
     * @param {*} callback Callback function to execute
     */
    addObjectDecorator(name, callback) {
        return this._addDecorator(name, Types.Object, callback);
    }

    /**
     * Add a callable decorator that wraps any type
     * @param {String} name The name of the new decorator
     * @param {*} callback Callback function to execute
     */
    addDecorator(name, callback) {
        return this._addDecorator(name, Types.Any, callback);
    }
}