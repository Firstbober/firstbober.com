import * as cheerio from 'cheerio';
import type { Config } from './config';

interface Template {
  html: string,
  'new'(properties: object): void
}
type Templates = { [key: string]: Template }

function processTemplates(config: Config, $: cheerio.CheerioAPI): Templates {
  const templates: Templates = {};

  for (const template of $('template')) {
    const id = $(template).attr('id');
    if (id == undefined) continue;

    templates[id] = {
      html: $(template).html()!,
      'new'() { }
    }

    $(template).remove();
  }

  return templates;
}

function processScripts(config: Config, $: cheerio.CheerioAPI, templates: Templates) {
  const registeredValues: string[] = [];
  const registerValue = (name: string, value: any) => {
    (globalThis as any)[name] = value;
    registeredValues.push(name);
  }
  let currentScript: string = "";

  let instances: any[] = [];

  // Register global values
  registerValue("inputs", config.inputObjects);

  // Get found template by ID
  registerValue("getTemplate", (id: string) => {
    if (templates[id] == undefined) throw new Error(`could not find template with id '${id}'`, {
      cause: currentScript
    });

    const template = templates[id];
    template.new = (props: object) => {
      let newHtml = template.html;
      for(const [key, val] of Object.entries(props)) {
        newHtml = newHtml.replaceAll(`&#x24;{${key}}`, val);
      }

      instances.push($(newHtml));
    }
    return template;
  });

  // Process script tags
  for (const script of $('script[templator]')) {
    try {
      currentScript = $(script).text();
      new Function(currentScript)();
    } catch (exception: any) {
      exception.cause = currentScript;
      throw exception
    }

    $(script).replaceWith(instances);
    instances = [];
  }

  // Remove global values
  for (const method of registeredValues) {
    delete (globalThis as any)[method];
  }
}

export function processHTML(config: Config, documentText: string): string {
  const $ = cheerio.load(documentText, {
    xml: {
      xmlMode: false
    }
  });

  const templates = processTemplates(config, $);
  processScripts(config, $, templates);

  return $.root().html()!;
}