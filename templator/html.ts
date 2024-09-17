import * as cheerio from 'cheerio';
import type { Config } from '.';

export function processHTML(config: Config, documentText: string) {
  const templates: { [key: string]: string } = {}

  const $ = cheerio.load(documentText, {
    xml: {
      xmlMode: false
    }
  });

  const registeredValues: string[] = [];
  const registerValue = (name: string, value: any) => {
    (globalThis as any)[name] = value;
    registeredValues.push(name);
  }
  let currentScript: string = "";

  // Register global values
  registerValue("inputs", config.inputs);

  registerValue("getTemplate", (id: string) => {
    
  });

  for (const script of $('script[templator]')) {
    try {
      currentScript = $(script).text();
      new Function(currentScript)();
    } catch(exception: any) {
      exception.cause = currentScript;
      throw exception
    }
  }

  // Remove global values
  for(const method of registeredValues) {
    delete (globalThis as any)[method];
  }
}