import { test, expect, describe } from 'vitest';
import { Lavendeux } from '../../src/lavendeux/index';

describe('Lavendeux', () => {
    test('constructor', () => {
        let extension = new Lavendeux('test1', 'test2', 'test3');
        expect(typeof globalThis.extension).toBe('function');
        expect(globalThis.extensionDetails).toStrictEqual({
            name: `test1`,
            author: `test2`,
            version: `test3`,

            functions: {},
            decorators: {}
        });

        expect(globalThis.extension()).toStrictEqual(globalThis.extensionDetails);
    });

    test('_addFunction', () => {
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

    test('_addDecorator', () => {
        let extension = new Lavendeux('test1', 'test2', 'test3');
        expect(extension.addIntegerDecorator('test', () => {}).args[0].type).toBe('Integer');
        expect(extension.addFloatDecorator('test', () => {}).args[0].type).toBe('Float');
        expect(extension.addNumericDecorator('test', () => {}).args[0].type).toBe('Numeric');
        expect(extension.addStringDecorator('test', () => {}).args[0].type).toBe('String');
        expect(extension.addBooleanDecorator('test', () => {}).args[0].type).toBe('Boolean');
        expect(extension.addArrayDecorator('test', () => {}).args[0].type).toBe('Array');
        expect(extension.addObjectDecorator('test', () => {}).args[0].type).toBe('Object');
        expect(extension.addDecorator('test', () => {}).args[0].type).toBe('');
    });
});