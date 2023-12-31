import child_process from "child_process";
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class LavendeuxCommand {
    static npmName = (process.platform == 'win32') ? 'npm.cmd' : 'npm';
    static spawnChild = (cmd, args) => child_process.spawnSync(cmd, args, { stdio: "inherit", stdin: "inherit" });
    static spawnNpm = (args) => this.spawnChild(this.npmName, args);
    static defaultConfig = {
        "main": "src/index.js",
        "scripts": {
          "build": "vite build",
          "test": "vitest run"
        },
        
        "dependencies": {},
        "devDependencies": {
          "vite": "^4.2.1",
          "vitest": "^0.29.7"
        }
    };
    static defaultReadme = (config) => [
        `# ${config.name}`,
        config.description ? `## ${config.description}\n` : '',
        '### An extension for [Lavendeux](https://rscarson.github.io/lavendeux/)',
        '',
        'Compile this extension with "npx lavendeux build"',
        'Test this extension with "npm test"',
    ].join('\n');

    /**
     * Returns the configuration of this package
     */
    static getOwnConfig() {
        const targetFile = path.resolve(__dirname, '../package.json');
        return JSON.parse(fs.readFileSync(targetFile, 'utf8'));
    }

    constructor(targetDir) {
        this.targetDir = targetDir;
        this.config = LavendeuxCommand.defaultConfig;
    }

    /**
     * Resolve a filename to absolute form
     * @param {String} name Filename
     * @param {String} dir Path to use - target directory by default
     * @returns String
     */
    filePath(name, dir=false) {
        if (!dir) dir = this.targetDir;
        return path.resolve(dir, name);
    }
    
    /**
     * Returns true if the directory is empty
     * @param {String} dir Path to check - target directory by default
     * @returns Boolean
     */
    isEmpty(dir=false) {
        if (!dir) dir = this.targetDir;
        const files = fs.readdirSync(dir);
        return files.length === 0;
    }

    /**
     * Creates and fills out package.json
     * Generates the configuration details needed by later steps
     */
    initPackage(name, ts=false) {
        const targetFile = this.filePath('package.json');
        this.config.name = name;

        if (ts) {
            this.config.main = 'src/index.ts';
        }

        // Write out defaults
        const jsonConfig = JSON.stringify(this.config, null, 2);
        fs.writeFileSync(targetFile, jsonConfig);

        // Generate the config
        LavendeuxCommand.spawnNpm(['init']);

        // Install deps
        LavendeuxCommand.spawnNpm(['install']);
        LavendeuxCommand.spawnNpm(['install', 'lavendeux']);

        if (ts) {
            LavendeuxCommand.spawnNpm(['install', 'typescript']);
        }

        // Read the result
        this.config = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
        return this.config;
    }
    
    /**
     * Writes out a template readme file
     */
    writeReadme() {
        const targetFile = this.filePath('readme.md');
        const readmeContent = LavendeuxCommand.defaultReadme(this.config);
        fs.writeFileSync(targetFile, readmeContent);
    }

    /**
     * Copy in the remaining files from the template
     */
    copyTemplate(ts=false) {
        const template_path = ts ? '../../template_ts' : '../template';
        const scrDir = this.filePath(template_path, __dirname);
        fs.copySync(scrDir, this.targetDir);
    }

    /**
     * Command that initializes a new extension
     * npm lavendeux init <name> [--force]
     */
    static commandInit(name, options) {
        let palette = new LavendeuxCommand(process.cwd());
    
        // Make sure we don't bulldoze anything
        if (!options.force && !palette.isEmpty()) {
            console.log('Target directory is not empty. Exiting.');
            process.exit(1);
        }

        palette.initPackage(name, options.typescript);
        palette.writeReadme();
        palette.copyTemplate();
    }

    /**
     * Command that compiles an extension
     * npm lavendeux build
     */
    static commandBuild(options) {
        LavendeuxCommand.spawnNpm(['run', 'build', Object.keys(options).map(k => `--${k}`)]);
    }

    /**
     * Command that tests an extension
     * npm lavendeux test
     */
    static commandTest(options) {
        LavendeuxCommand.spawnNpm(['run', 'test', Object.keys(options).map(k => `--${k}`)]);
    }
}