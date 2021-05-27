import { relative, join, extname } from "path";
import { fileExists } from "file-exists-safe";
import { lex } from "./lexer";
import { parse } from "./parser";
import { translate } from "./translator";

async function resolvePath(path: string) {
  const file = extname(path) === "si" ? relative(process.cwd(), path) : join(relative(process.cwd(), path), "index.si");
  const exact = await fileExists(file);
  if(exact) {
    return file;
  } else {
    return undefined;
  }
}

if(process.argv.length < 3) {
  console.error("Not enough arguments");
} else {
  const entry = process.argv[2];
  resolvePath(entry).then(async (path) => {
    if(path === undefined) {
      console.error("Entry does not exist.");
    } else {
      const tokens = lex(path);
      // const ast = parse(tokens);
      // translate(ast);
    }
  });
}

// read file from argv[1]
// lex -> tokens
// parse -> ast
// 
