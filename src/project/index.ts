import { strings } from "@angular-devkit/core";
import {
  apply,
  chain,
  mergeWith,
  move,
  Rule,
  template,
  renameTemplateFiles,
  url
} from "@angular-devkit/schematics";
import { SchematicProjectOptions } from "./schema";
import versions from "../versions.json";
import { posix as Path } from 'path';


export default function (options: SchematicProjectOptions): Rule {

  let name = options.name;
  let scope = '';
  if (name.startsWith('@')) {
    const p = name.split('/', 2);
    scope = p[0].substring(1);
    name = strings.dasherize(p[1]);

  }
  options.directory = Path.join(options.directory ?? '.', name);
  
  const packageName = (scope ? `@${scope}/` : '') + name;

  return chain([
    mergeWith(
      apply(url("./files"), [
        template({
          ...strings,
          ...options,
          packageName,
          dot: ".",
          versions,
        }),
        renameTemplateFiles(),
        move(options.directory)
      ])
    )
  ]);
}
