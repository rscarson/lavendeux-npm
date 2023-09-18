import { LavendeuxValue, Types } from './value';

// Define the state in cases where the Lavendeux engine isn't available
let WARNING_STATE_UNAVAILABLE, setState, getState;
if (typeof getState === 'undefined') {
    WARNING_STATE_UNAVAILABLE = true;
    const _lav_state = {};
    getState = () => _lav_state;
    setState = (s) => Object.assign(_lav_state,s);
}

/**
 * A callable function for use in Lavendeux
 */
export class LavendeuxFunction {
    constructor(name, returnType, callback) {
        this.name = name.replace('@', '');
        this.callback = callback;

        this.argumentTypes = []
        this.returnType = returnType;

        this.registeredName = LavendeuxFunction.getRegisteredName(name);
    }

    /**
     * Will return true if the state functions are available
     * Will be false in very old versions of Lavendeux
     */
    static isStateAvailable() {
        return WARNING_STATE_UNAVAILABLE;
    }

    /**
     * Get a unique identifier for a function
     * @returns A unique name for this function
     */
    static getRegisteredName(name) {
        return `lavendeuxfunction_${name}`;
    }

    /**
     * Add an untyped argument to the function
     * @param {Boolean} optional True if the argument is optional.
     */
    addArgument(type=Types.Any) {
        this.argumentTypes.push(type);
        return this;
    }

    /**
     * Add an integer typed argument to the function
     */
    addIntegerArgument() {
        return this.addArgument(Types.Integer);
    }
    
    /**
     * Add a float typed argument to the function
     */
    addFloatArgument() {
        return this.addArgument(Types.Float);
    }
    
    /**
     * Add a int or float typed argument to the function
     */
    addNumericArgument() {
        return this.addArgument(Types.Numeric);
    }
    
    /**
     * Add a string typed argument to the function
     */
    addStringArgument() {
        return this.addArgument(Types.String);
    }
    
    /**
     * Add a boolean typed argument to the function
     */
    addBooleanArgument() {
        return this.addArgument(Types.Boolean);
    }
    
    /**
     * Add an array typed argument to the function
     */
    addArrayArgument() {
        return this.addArgument(Types.Array);
    }
    
    /**
     * Add an object typed argument to the function
     */
    addObjectArgument() {
        return this.addArgument(Types.Object);
    }
    
    /** 
     * Validates and decodes arguments
     * Will throw an error if argument count or types are unexpected
     * @returns Unwrapped arguments
     */
    decodeArguments(argv) {
        // Validate argument count
        if (argv.length < this.argumentTypes.length) {
            throw new Error(`Missing a parameter for ${this.name}: Expected ${this.argumentTypes.length} arguments`);
        } 

        // Validate argument types
        this.argumentTypes.forEach((type, i) => {
            let _type = LavendeuxValue.typeOf(argv[i]);
            if (
                ( type == Types.Numeric && !([Types.Integer, Types.Float].includes(_type)) ) ||
                [Types.Integer, Types.Float].includes(type) && type != _type
            ) {
                throw new Error(`Invalid value for parameter ${i+1} of ${this.name}: Expected ${argv[i].type}`);
            }
        });

        // Uwrap and cooerce
        return argv.map((wrappedValue, i) => {
            let type = this.argumentTypes[i] ? this.argumentTypes[i] : Types.Any;
            return LavendeuxValue.unwrap(wrappedValue, type);
        });
    }

    /**
     * Return an object containing the variables available in the parser
     * @returns State
     */
    getState() {
        const state = getState();
        Object.keys(state).map(k => {
            state[k] = LavendeuxValue.unwrap(state[k]);
        });
        return state;
    }

    /**
     * Update the parser state
     * @param {Object} state 
     */
    setState(state) {
        Object.keys(state).map(k => {
            state[k] = LavendeuxValue.wrap(state[k]);
        });
        setState(state);
    }

    call(argv) {
        // Validate and decode arguments
        argv = this.decodeArguments(argv);

        // Populate the state
        let state = this.getState();
        
        // Run the inner callback function
        let value = LavendeuxValue.wrap(
            this.callback(...argv, state),
            this.returnType
        );

        // Return the new state
        this.setState(state);

        return value;
    }
}