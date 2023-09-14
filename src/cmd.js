#! /usr/bin/env node
const { LavendeuxCommand } = require('./lavendeux/command');
const { program } = require('commander');

const data = LavendeuxCommand.getOwnConfig();

program
.name(data.name)
.description(data.description)
.version(data.version);

program
.command('init')
.description('Creates a new extension')
.argument('<name>', 'Name of the new extension')
.option('--force', 'Continue even if the directory is not empty')
.option('--typescript', 'Generate using the typescript template')
.action(LavendeuxCommand.commandInit);

program
.command('build')
.description('Compile the extension. Alias of "npm run build"')
.action(LavendeuxCommand.commandBuild);

program
.command('test')
.description('Test the extension. Alias of "npm test"')
.action(LavendeuxCommand.commandTest);

program.parse();