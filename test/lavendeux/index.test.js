import { test, expect, describe } from 'vitest';
import { Lavendeux, Types } from '../../src/lavendeux/index';

describe('Lavendeux', () => {
    test('constructor', () => {
        let extension = new Lavendeux('test1', 'test2', 'test3');
        Lavendeux.register(extension);

        expect(typeof globalThis.extension).toBe('function');
        expect(globalThis.extension()).toMatchObject({
            name: `test1`,
            author: `test2`,
            version: `test3`,

            functions: {},
            decorators: {}
        });
    });

    test('addFunction', () => {
        let extension = new Lavendeux('test1', 'test2', 'test3');
        expect(extension.addIntegerFunction('test', () => {}).returnType).toBe('Integer');
        expect(extension.addFloatFunction('test', () => {}).returnType).toBe('Float');
        expect(extension.addNumericFunction('test', () => {}).returnType).toBe('Numeric');
        expect(extension.addStringFunction('test', () => {}).returnType).toBe('String');
        expect(extension.addBooleanFunction('test', () => {}).returnType).toBe('Boolean');
        expect(extension.addArrayFunction('test', () => {}).returnType).toBe('Array');
        expect(extension.addObjectFunction('test', () => {}).returnType).toBe('Object');
        expect(extension.addFunction('test', () => {}).returnType).toBe('');
    });

    test('addDecorator', () => {
        let extension = new Lavendeux('test1', 'test2', 'test3');
        expect(extension.addIntegerDecorator('test', () => {}).argumentTypes[0]).toBe(Types.Integer);
        expect(extension.addFloatDecorator('test', () => {}).argumentTypes[0]).toBe(Types.Float);
        expect(extension.addNumericDecorator('test', () => {}).argumentTypes[0]).toBe(Types.Numeric);
        expect(extension.addStringDecorator('test', () => {}).argumentTypes[0]).toBe(Types.String);
        expect(extension.addBooleanDecorator('test', () => {}).argumentTypes[0]).toBe(Types.Boolean);
        expect(extension.addArrayDecorator('test', () => {}).argumentTypes[0]).toBe(Types.Array);
        expect(extension.addObjectDecorator('test', () => {}).argumentTypes[0]).toBe(Types.Object);
        expect(extension.addDecorator('test', () => {}).argumentTypes[0]).toBe(Types.Any);
    });
});