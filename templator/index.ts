import { existsSync, readFileSync } from "fs";
import { extname, dirname, resolve } from "path";
import { exit } from "process";
import { parseArgs } from "util";
import { Glob } from "bun";
import { processHTML } from "./html";

export interface Config {
  out: string,
  templates: string[],
  inputs: {
    [key: string]: Array<string>
  }
}

async function main() {
  const { values, positionals } = parseArgs({
    args: Bun.argv,
    options: {
      config: {
        default: './templator.toml',
        type: 'string'
      }
    },
    strict: true,
    allowPositionals: true
  });

  if (!existsSync(values['config']!)) {
    console.error(`Config file "${values['config']}" not found!`);
    exit(1);
  }

  let config: Config = Object.fromEntries(Object.entries((await import(resolve(values['config']!)) as any).default)) as any;

  // Check existance of necessary values
  if (config.out == undefined) {
    console.error(`"out" is missing in config!`);
    return;
  }
  if (config.templates == undefined) {
    console.error(`"templates" are missing in config!`);
    return;
  }
  if (!Array.isArray(config.templates)) {
    console.error(`the value of "templates" is not an array!`);
    return;
  }
  if (config.inputs == undefined) {
    config.inputs = {};
  }

  // Check if input values are arrays
  let hasErrors = false;
  for (const [key, val] of Object.entries(config.inputs)) {
    if (Array.isArray(val)) continue;
    console.error(`value of "${key}" in inputs is an array!`);
    hasErrors = true;
  }
  if (hasErrors) exit(1);

  // Resolve path for out
  config.out = resolve(config.out);

  // Resolve paths for templates and inputs
  const resolvedTemplates = []
  for (const template of config.templates) {
    const glob = new Glob(template);

    for await (const file of glob.scan({
      onlyFiles: true,
      cwd: dirname(resolve(values['config']!)),
      absolute: true,
    })) {
      if (!existsSync(file)) {
        console.error(`file "${file}" doesn't exists`);
        hasErrors = true
      }
      resolvedTemplates.push(file)
    }
  }
  config.templates = resolvedTemplates;

  // Resolve paths for inputs

  for (const [key, val] of Object.entries(config.inputs)) {
    const resolvedKey = []
    for (const input of val) {
      const glob = new Glob(input);

      for await (const file of glob.scan({
        onlyFiles: true,
        cwd: dirname(resolve(values['config']!)),
        absolute: true,
      })) {
        if (!existsSync(file)) {
          console.error(`file "${file}" doesn't exists`);
          hasErrors = true
        }
        resolvedKey.push(file)
      }
    }
    config.inputs[key] = resolvedKey;
  }
  if (hasErrors) exit(1);

  // Inputs to objects when possible
  for (const inputKey of Object.keys(config.inputs)) {
    for (let i = 0; i < config.inputs[inputKey].length; i++) {
      const element = config.inputs[inputKey][i];
      if(extname(element) == '.toml' || extname(element) == '.json') {
        config.inputs[inputKey][i] = (await import(element)).default;
      }
    }
  }

  // Process HTML files
  for (const template of config.templates) {
    processHTML(config, readFileSync(template).toString());
  }
}
main();
