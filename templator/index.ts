import * as fs from "fs";
import { dirname, resolve, relative, join, extname } from "path";
import { exit } from "process";
import { parseArgs } from "util";
import { processHTML } from "./html";
import { readConfig, type Config } from "./config";

async function build(config: Config) {
  // Remove out directory if exists
  if (fs.existsSync(config.out)) {
    fs.rmSync(config.out, {
      recursive: true
    });
  }
  fs.mkdirSync(config.out);

  // Process HTML files
  for (const template of config.templates) {
    console.info(`Processing ${template}...`)
    const html = processHTML(config, fs.readFileSync(template).toString());
    console.info("Done! Writing to disk...");

    const relativeTarget = relative(config.root, template);
    const absoluteTarget = resolve(config.out, relativeTarget);
    const directory = resolve(config.out, dirname(relativeTarget));

    if (!fs.existsSync(directory))
      fs.mkdirSync(directory);
    fs.writeFileSync(absoluteTarget, html);
    console.info("Done!");
  }

  // Copy public
  fs.cpSync(join(config.root, 'public'), join(config.out, 'public'), {
    recursive: true,
    dereference: true,
    errorOnExist: true,
  })
}

async function watchForChanges(baseConfig: Config, configPath: string, configDirectory: string) {
  let configToUse = baseConfig;

  const rootWatcherHandler: fs.WatchListener<string> = async (event, filename) => {
    console.log('-----------------------------');
    console.log(`Detected ${event} in ${filename}`);
    console.log('-----------------------------');

    if(filename == null) return;
    const resolvedPath = resolve(configToUse.root, filename);

    // If resolved path is one of templates
    if(configToUse.templates.includes(resolvedPath)) {
      return await build(configToUse);
    }

    // If resolved path is one of inputs
    for (const inputKey of Object.keys(configToUse.inputs)) {
      if(configToUse.inputs[inputKey].includes(resolvedPath)) {
        return await build(configToUse);
      }
    }

    // If resolved path starts with public
    if(dirname(resolvedPath).endsWith('/public')) {
      // Copy public
      fs.cpSync(join(configToUse.root, 'public'), join(configToUse.out, 'public'), {
        recursive: true,
        dereference: true,
        force: true
      })
    }
  };

  let rootWatcher = fs.watch(configToUse.root, { recursive: true }, rootWatcherHandler);

  const configWatcher = fs.watchFile(configPath, async (event, filename) => {
    console.log('-----------------------------');
    console.log('config changed... updating internal state...')
    console.log('-----------------------------');
    rootWatcher.close();

    const newConfig = await readConfig(configPath);
    if(newConfig == undefined) exit(1);
    configToUse = newConfig;

    rootWatcher = fs.watch(configToUse.root, { recursive: true }, rootWatcherHandler);

    return await build(configToUse);
  });

}

async function main() {
  const { values, positionals } = parseArgs({
    args: Bun.argv,
    options: {
      config: {
        default: './templator.toml',
        type: 'string'
      },
      watch: {
        default: '8080',
        type: 'string'
      },
      help: {
        short: 'h',
        type: 'boolean'
      }
    },
    strict: true,
    allowPositionals: true
  });

  if (values.help) {
    console.log(`\
Usage: ${Bun.argv[1]} [OPTION]...
Transforms .html template files via "<script templator>...</script>"

Optional arguments:
      --config [PATH]       path to templator config
      --watch  [PORT]       watches the config and related directories + serves them
      -h, --help            displays this message

[PATH] is './templator.toml' by default
[PORT] is 8080 by default
`)
    exit(0);
  }

  if (!fs.existsSync(values['config']!)) {
    console.error(`Config file "${values['config']}" not found!`);
    exit(1);
  }

  const configPath = resolve(values['config']!);
  const config = await readConfig(configPath)

  if (config == undefined) {
    exit(1);
  }
  config.watch = values['watch'];

  await build(config);

  if (config.watch) {
    watchForChanges(config, configPath, dirname(configPath));
  }
}
main();
