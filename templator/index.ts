import { existsSync, readFileSync, mkdirSync, writeFileSync, cpSync, rmSync, watch } from "fs";
import { dirname, resolve, relative, join } from "path";
import { exit } from "process";
import { parseArgs } from "util";
import { processHTML } from "./html";
import { readConfig, type Config } from "./config";

async function watchForChanges(config: Config, configDirectory: string) {
  console.log(config, configDirectory)
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

  if(values.help) {
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

  if (!existsSync(values['config']!)) {
    console.error(`Config file "${values['config']}" not found!`);
    exit(1);
  }

  const configPath = resolve(values['config']!);
  const config = await readConfig(configPath)

  if (config == undefined) {
    exit(1);
  }

  // Remove out directory if exists
  if (existsSync(config.out)) {
    rmSync(config.out, {
      recursive: true
    });
  }
  mkdirSync(config.out);

  // Process HTML files
  for (const template of config.templates) {
    console.info(`Processing ${template}...`)
    const html = processHTML(config, readFileSync(template).toString());
    console.info("Done! Writing to disk...");

    const relativeTarget = relative(config.root, template);
    const absoluteTarget = resolve(config.out, relativeTarget);
    const directory = resolve(config.out, dirname(relativeTarget));

    if (!existsSync(directory))
      mkdirSync(directory);
    writeFileSync(absoluteTarget, html);
    console.info("Done!");
  }

  // Copy public
  cpSync(join(config.root, 'public'), join(config.out, 'public'), {
    recursive: true,
    dereference: true,
    errorOnExist: true
  })

  if (config.watch) {
    watchForChanges(config, dirname(resolve(values['config']!)));
  }
}
main();
