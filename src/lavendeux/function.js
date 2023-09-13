import { LavendeuxValue, Types } from './value';

/**
 * A callable function for use in Lavendeux
 */
export class LavendeuxFunction {
    constructor(name, returnType, callback) {
        this.name = name;
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
        return (typeof getState === "function");
    }

    /**
     * Get a unique identifier for a function
     * @returns A unique name for this function
     */
    static getRegisteredName(name) {
        let r = (Math.random() + 1).toString(36).substring(8);
        return `lavendeuxfunction_${name}_${r}`;
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
    addIntegerArgument = () => this.addArgument(Types.Integer);

    /**
     * Add a float typed argument to the function
     */
    addFloatArgument = () => this.addArgument(Types.Float);

    /**
     * Add a int or float typed argument to the function
     */
    addNumericArgument = () => this.addArgument(Types.Numeric);

    /**
     * Add a string typed argument to the function
     */
    addStringArgument = () => this.addArgument(Types.String);

    /**
     * Add a boolean typed argument to the function
     */
    addBooleanArgument = () => this.addArgument(Types.Boolean);

    /**
     * Add an array typed argument to the function
     */
    addArrayArgument = () => this.addArgument(Types.Array);

    /**
     * Add an object typed argument to the function
     */
    addObjectArgument = () => this.addArgument(Types.Object);

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
            let type = argv[i] ? argv[i] : Types.Any;
            return LavendeuxValue.unwrap(wrappedValue, type);
        });
    }

    /**
     * Return an object containing the variables available in the parser
     * @returns State
     */
    getState() {
        return LavendeuxFunction.isStateAvailable() 
            ? getState() 
            : {};
    }

    /**
     * Update the parser state
     * @param {Object} state 
     */
    setState(state) {
        if (LavendeuxFunction.isStateAvailable()) {
            setState(state);
        }
    }

    call(argv) {
        // Validate and decode arguments
        argv = this.decodeArguments(argv);

        // Populate the state
        let state = this.getState()
        
        // Run the inner callback function
        let value = LavendeuxValue.wrap(
            this.callback(...argv),
            this.returnType
        );

        // Return the new state
        this.setState(state);

        return value;
    }
}