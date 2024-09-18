import { existsSync } from "fs";
import { exit } from "process";
import { extname, resolve } from "path";
import { Glob } from "bun";

export interface Config {
  out: string,
  root: string,
  templates: string[],
  inputs: {
    [key: string]: Array<string>
  },
  watch?: string
}

export async function readConfig(configPath: string): Promise<Config | undefined> {
  let config: Config = Object.fromEntries(Object.entries((await import(configPath) as any).default)) as any;

  // Check existance of necessary values
  if (config.out == undefined) {
    console.error(`"out" is missing in config!`);
    return;
  }
  if (config.root == undefined) {
    console.error(`"root" is missing in config!`);
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
  // Resolve path for root
  config.root = resolve(config.root);

  // Resolve paths for templates and inputs
  const resolvedTemplates = []
  for (const template of config.templates) {
    const glob = new Glob(template);

    for await (const file of glob.scan({
      onlyFiles: true,
      cwd: config.root,
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
        cwd: config.root,
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
      if (extname(element) == '.toml' || extname(element) == '.json') {
        config.inputs[inputKey][i] = (await import(element)).default;
      }
    }
  }

  return config;
}
