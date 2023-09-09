import { test, expect, describe } from 'vitest';
import { LavendeuxArgument } from '../../src/lavendeux/argument';
import { Types } from '../../src/lavendeux/value';

describe('LavendeuxArgument', () => {
    test('unwrap', () => {
        let argument = new LavendeuxArgument(Types.Integer);
        expect(argument.unwrap({'Float': 5.5})).toBe(5);
        
        argument = new LavendeuxArgument(Types.String);
        expect(argument.unwrap({'Float': 5.5})).toBe("5.5");
    });
    
    test('validate', () => {
        let argument = new LavendeuxArgument(Types.Integer);
        expect(argument.validate({'Float': 5.5})).toBe(true);
        expect(argument.validate({'Integer': 5})).toBe(true);
        expect(argument.validate({'String': '5.5'})).toBe(false);
        
        argument = new LavendeuxArgument(Types.String);
        expect(argument.validate({'Float': 5.5})).toBe(true);
        expect(argument.validate({'Boolean': false})).toBe(true);
        
        argument = new LavendeuxArgument(Types.Any);
        expect(argument.validate({'Float': 5.5})).toBe(true);
    });
});