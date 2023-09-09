import { LavendeuxValue, Types } from './value';
import { LavendeuxArgument } from './argument';

/**
 * A callable function for use in Lavendeux
 */
export class LavendeuxFunction {
    constructor(name, returnType, callback) {
        this.name = name;
        this.args = [];
        this.callback = callback;
        this.argListLocked = false;
        this.returnType = returnType;

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
        return this._addArgument(Types.Integer, optional);
    }

    /**
     * Add a float typed argument to the function
     * @param {Boolean} optional True if the argument is optional.
     */
    addFloatArgument(optional=false) {
        return this._addArgument(Types.Float, optional);
    }

    /**
     * Add a int or float typed argument to the function
     * @param {Boolean} optional True if the argument is optional.
     */
    addNumericArgument(optional=false) {
        return this._addArgument(Types.Numeric, optional);
    }

    /**
     * Add a string typed argument to the function
     * @param {Boolean} optional True if the argument is optional.
     */
    addStringArgument(optional=false) {
        return this._addArgument(Types.String, optional);
    }

    /**
     * Add a boolean typed argument to the function
     * @param {Boolean} optional True if the argument is optional.
     */
    addBooleanArgument(optional=false) {
        return this._addArgument(Types.Boolean, optional);
    }

    /**
     * Add an array typed argument to the function
     * @param {Boolean} optional True if the argument is optional.
     */
    addArrayArgument(optional=false) {
        return this._addArgument(Types.Array, optional);
    }

    /**
     * Add an object typed argument to the function
     * @param {Boolean} optional True if the argument is optional.
     */
    addObjectArgument(optional=false) {
        return this._addArgument(Types.Object, optional);
    }

    /**
     * Add an untyped argument to the function
     * @param {Boolean} optional True if the argument is optional.
     */
    addArgument(optional=false) {
        return this._addArgument(Types.Any, optional);
    }

    /**
     * Add a parameter to the function
     * @param {String} type The type of value expected (Types)
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
            argv[k] = expectedArgs[k] ? expectedArgs[k].unwrap(argv[k]) : LavendeuxValue.unwrap(argv[k]);
        });

        // Populate the state
        let state = (typeof getState === "function") ? getState() : {};
        
        // Run the inner callback function
        let value = LavendeuxValue.wrap(
            this.callback(...argv),
            this.returnType
        );

        // Return the new state
        if (typeof setState === "function") {
            setState(state);
        }

        return value;
    }

    register() {
        let callbackName = this.registeredName();
        globalThis.extensionDetails.functions[this.name] = callbackName;
        globalThis[`${callbackName}_args`] = this.args;
        globalThis[callbackName] = (argv) => this.call(argv);
    }
}