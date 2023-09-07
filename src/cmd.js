#! /usr/bin/env node
const { spawnSync } = require("child_process");
var path = require('path');
const fs = require('fs-extra');

const { program } = require('commander');

const npmName = process.platform == 'win32' ? 'npm.cmd' : 'npm';
const defaultConfig = {
    "main": "src/index.js",
    "scripts": {
      "build": "vite build",
      "test": "vitest run"
    },

    "devDependencies": {
      "vite": "^4.2.1",
      "vitest": "^0.29.7",
      "lavendeux": "^1.0.0"
    }
}
const defaultReadme = (config) => [
    `# ${config.name}`,
    config.description ? `## ${config.description}\n` : '',
    '### An extension for [Lavendeux](https://rscarson.github.io/lavendeux/)',
    '',
    'Compile this extension with "npx lavendeux build"',
    'Test this extension with "npm test"',
].join('\n');

function spawnChild(cmd, args) {
    spawnSync(cmd, args, { stdio: "inherit", stdin: "inherit" });
}

/**
 * Create the package.json config and return its contents
 */
function buildPackageJson(targetDir, name) {
    const targetFile = path.resolve(targetDir, 'package.json');
    defaultConfig.name = name;

    // Write out defaults
    const jsonConfig = JSON.stringify(defaultConfig, null, 2);
    fs.writeFileSync(targetFile, jsonConfig);

    // Generate the config
    spawnChild(npmName, ['init']);

    // Install deps
    spawnChild(npmName, ['install']);
    spawnChild(npmName, ['install', 'lavendeux']);

    // Read the result
    let data = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
    return data;
}

/**
 * Create a readme for the extension
 */
function buildReadme(targetDir, config) {
    const targetFile = path.resolve(targetDir, 'readme.md');
    console.log(config);
    const readmeContent = defaultReadme(config);
    fs.writeFileSync(targetFile, readmeContent);
}

/**
 * Copy remaining parts of the template to the target
 */
function copyTemplate(targetDir) {
    const scrDir = path.resolve(__dirname, '../template');
    fs.copySync(scrDir, targetDir);
}

/**
 * Determine if a target directory is empty
 */
function isEmpty(targetDir) {
    const files = fs.readdirSync(targetDir);
    return files.length === 0;
}

// Get package.json config
const targetFile = path.resolve(__dirname, '../package.json');
let data = JSON.parse(fs.readFileSync(targetFile, 'utf8'));

program
.name(data.name)
.description(data.description)
.version(data.version);

program
.command('init')
.description('Creates a new extension')
.argument('<name>', 'Name of the new extension')
.option('--force', 'Continue even if the directory is not empty')
.action((name, options) => {
    const dir = process.cwd();

    // Make sure we don't bulldoze anything
    if (!options.force && !isEmpty(dir)) {
        console.log('Target directory is not empty. Exiting.');
        process.exit(1);
    }

    const config = buildPackageJson(dir, name);
    buildReadme(dir, config);
    copyTemplate(dir)
});

program
.command('build')
.description('Compile the extension. Alias of "npm run build"')
.action(() => {
    spawnChild(npmName, ['run', 'build']);
});

program
.command('test')
.description('Compile the extension. Alias of "npm test"')
.action(() => {
    spawnChild(npmName, ['test']);
});

program.parse();