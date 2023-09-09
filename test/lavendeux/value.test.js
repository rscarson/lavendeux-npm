import { test, expect, describe } from 'vitest';
import { LavendeuxValue, Types } from '../../src/lavendeux/value';

describe('LavendeuxValue', () => {
    test('typeOf', () => {
        expect(LavendeuxValue.typeOf({})).toBe(false);
        expect(LavendeuxValue.typeOf({'Integer': 5})).toBe('Integer');
        expect(LavendeuxValue.typeOf({'String': 5})).toBe('String');
    });
    
    test('unwrap', () => {
        expect(LavendeuxValue.unwrap({'Integer': 5})).toBe(5);
        expect(LavendeuxValue.unwrap({'Float': 5.5})).toBe(5.5);
        expect(LavendeuxValue.unwrap({'String': 'test'})).toBe('test');
        expect(LavendeuxValue.unwrap({'Array': [
            {'Integer': 5}, {'String': 'test'}
        ]})).toStrictEqual([5, 'test']);

        // Objects
        expect(LavendeuxValue.unwrap({'Object': [
            [{'Integer': 5},{'Integer': 5}], 
            [{'String': 'test'},{'Integer': 5}]
        ]})).toStrictEqual({5: 5, 'test': 5});
        expect(LavendeuxValue.unwrap({'Object': [
            [{'Array': [{'Integer': 5}]},{'Integer': 5}], 
            [{'String': 'test'},{'Integer': 5}]
        ]})).toStrictEqual({'[5]': 5, 'test': 5});
        expect(LavendeuxValue.unwrap({'Object': [
            [{'Object': [[{'String': "0"}, {'Integer': 1}]]},{'Integer': 5}], 
            [{'String': 'test'},{'Integer': 5}]
        ]})).toStrictEqual({'{"0":1}': 5, 'test': 5});
    });

    test('cooerce', () => {
        expect(LavendeuxValue.cooerce(5.5, Types.Integer)).toBe(5);
        expect(LavendeuxValue.cooerce(5.5, Types.Numeric)).toBe(5.5);
        expect(LavendeuxValue.cooerce(5.5, Types.Float)).toBe(5.5);

        expect(LavendeuxValue.cooerce(0, Types.Boolean)).toBe(false);
        expect(LavendeuxValue.cooerce(5.5, Types.Boolean)).toBe(true);

        expect(LavendeuxValue.cooerce(5.5, Types.String)).toBe("5.5");
        expect(LavendeuxValue.cooerce([5], Types.String)).toBe("[5]");
        expect(LavendeuxValue.cooerce({0:1}, Types.String)).toBe('{"0":1}');
        
        expect(LavendeuxValue.cooerce([5], Types.Array)).toStrictEqual([5]);
        expect(LavendeuxValue.cooerce({0:1}, Types.Array)).toStrictEqual([1]);
        expect(LavendeuxValue.cooerce(5, Types.Array)).toStrictEqual([5]);
        
        expect(LavendeuxValue.cooerce([5], Types.Object)).toStrictEqual({0:5});
        expect(LavendeuxValue.cooerce({0:1}, Types.Object)).toStrictEqual({0:1});
        expect(LavendeuxValue.cooerce(5, Types.Object)).toStrictEqual({0:5});
    })

    test('wrap', () => {
        expect(LavendeuxValue.wrap(5.5, Types.Integer)).toStrictEqual({'Integer': 5});
        expect(LavendeuxValue.wrap(5.5)).toStrictEqual({'Float': 5.5});

        expect(LavendeuxValue.wrap('test')).toStrictEqual({'String': 'test'});
        expect(LavendeuxValue.wrap(false)).toStrictEqual({'Boolean': false});

        expect(LavendeuxValue.wrap([5])).toStrictEqual({'Array': [{'Integer': 5}]});
        expect(LavendeuxValue.wrap([[5]])).toStrictEqual({'Array': [{'Array': [{'Integer': 5}]}]});
        
        expect(LavendeuxValue.wrap({0:1})).toStrictEqual({'Object': [[{'String': "0"}, {'Integer': 1}]]});
    });
});