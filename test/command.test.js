import { afterEach, test, expect, describe, vi } from 'vitest';

import child_process from 'child_process';
vi.mock('child_process');

import path from 'path';
vi.mock('path');

import fs from 'fs-extra';
vi.mock('fs-extra');

process.exit = vi.fn();

import { LavendeuxCommand } from '../src/command';

describe('LavendeuxCommand', () => {
    afterEach(() => {
      vi.resetAllMocks();
    });
    
    test('spawnChild', () => {
        LavendeuxCommand.spawnChild('npm', ['test']);
        expect(child_process.spawnSync).toHaveBeenCalledTimes(1);
    });
    
    test('spawnNpm', () => {
        LavendeuxCommand.spawnNpm(['test']);
        expect(child_process.spawnSync).toHaveBeenCalledTimes(1);
    });
    
    test('defaultReadme', () => {
        let readme = LavendeuxCommand.defaultReadme({
            'name': 'foo', description: 'bar'
        });
        expect(readme).toContain('foo');
        expect(readme).toContain('bar');

        readme = LavendeuxCommand.defaultReadme({
            'name': 'foo'
        });
        expect(readme).toContain('foo');
    });
    
    test('getOwnConfig', () => {
        fs.readFileSync.mockReturnValue('{}');

        let config = LavendeuxCommand.getOwnConfig();
        expect(config).toStrictEqual({});
        expect(path.resolve).toHaveBeenCalledTimes(1);
        expect(fs.readFileSync).toHaveBeenCalledTimes(1);
    });
    
    test('filePath', () => {
        let palette = new LavendeuxCommand('DIR');
        
        palette.filePath('A');
        expect(path.resolve).toHaveBeenCalledWith('DIR', 'A');
        
        palette.filePath('A', 'B');
        expect(path.resolve).toHaveBeenCalledWith('B', 'A');
    });
    
    test('isEmpty', () => {
        let palette = new LavendeuxCommand('DIR');

        fs.readdirSync.mockReturnValue([]);
        expect(palette.isEmpty()).toBe(true);
        expect(fs.readdirSync).toHaveBeenCalledWith('DIR');

        fs.readdirSync.mockReturnValue([1]);
        expect(palette.isEmpty('test')).toBe(false);
        expect(fs.readdirSync).toHaveBeenCalledWith('test');
    });
    
    test('initPackage', () => {
        let palette = new LavendeuxCommand('DIR');
        fs.readFileSync.mockReturnValue('{"name":"test"}');

        expect(palette.initPackage('test')).toStrictEqual({'name':'test'});
        expect(child_process.spawnSync).toHaveBeenCalledTimes(3);
    });
    
    test('writeReadme', () => {
        let palette = new LavendeuxCommand('DIR');
        
        palette.writeReadme();
        expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    });
    
    test('copyTemplate', () => {
        let palette = new LavendeuxCommand('DIR');
        
        palette.copyTemplate();
        expect(fs.copySync).toHaveBeenCalledWith(undefined, 'DIR');
    });  
    
    test('commandInit', () => {
        fs.readdirSync.mockReturnValue([]);
        fs.readFileSync.mockReturnValue('{}');

        LavendeuxCommand.commandInit('test', {});
        
        expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
        expect(fs.copySync).toHaveBeenCalledTimes(1);
        expect(child_process.spawnSync).toHaveBeenCalledTimes(3);
    }); 
    
    test('commandInit', () => {
        fs.readdirSync.mockReturnValue([]);
        fs.readFileSync.mockReturnValue('{}');

        LavendeuxCommand.commandInit('test', {});
        
        expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
        expect(fs.copySync).toHaveBeenCalledTimes(1);
        expect(child_process.spawnSync).toHaveBeenCalledTimes(3);
        
        const clb = console.log;
        console.log = vi.fn()

        fs.readdirSync.mockReturnValue([1]);
        LavendeuxCommand.commandInit('test', {});
        expect(process.exit).toHaveBeenCalledTimes(1);

        fs.readdirSync.mockReturnValue([1]);
        LavendeuxCommand.commandInit('test', {'force': true});
        expect(process.exit).toHaveBeenCalledTimes(1);

        console.log = clb;
    });   
    
    test('commandBuild', () => {
        fs.readdirSync.mockReturnValue([]);
        fs.readFileSync.mockReturnValue('{}');

        LavendeuxCommand.commandBuild({});
        expect(child_process.spawnSync).toHaveBeenCalledTimes(1);
    });   
    
    test('commandTest', () => {
        fs.readdirSync.mockReturnValue([]);
        fs.readFileSync.mockReturnValue('{}');

        LavendeuxCommand.commandTest({});
        expect(child_process.spawnSync).toHaveBeenCalledTimes(1);
    });    
});
