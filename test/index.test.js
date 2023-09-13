import { test, expect, describe } from 'vitest';
import { Lavendeux } from '../src';

describe('Lavendeux', () => {
    test('import', () => {
        let extension = new Lavendeux('test1', 'test2', 'test3');
        Lavendeux.register(extension);
        expect(typeof globalThis.extension).toBe('function');
    });
});