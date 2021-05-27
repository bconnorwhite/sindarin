import { haveTokens, Token, Tokens } from "../../../lexer";
import { parseFrom, FromNode } from "./from";
import { parseImport, ImportNode } from "./import";
import { parseExport, ExportNode } from "./export";
import { parseCurlyCSV } from "../../utils";
import { ASTNode, ParseResult } from "../..";
import { Kinds } from "../../node";

type Modules = {
  [name: string]: ModuleNode;
};

export const moduleKind = "module";

export type ModuleKind = typeof moduleKind;

export interface ModuleNode extends ASTNode {
  kind: Kinds.module;
  self: boolean; // always false at top level (no default)
  wildcard: boolean;
  modules?: Modules;
}

function moduleNode(self = false, wildcard = false, modules?: Modules): ModuleNode {
  return {
    kind: Kinds.module,
    self,
    wildcard,
    modules
  };
}

function mergeModule(modules: Modules = {}, key: string, value: ModuleNode) {
  return {
    ...modules,
    [key]: moduleNode(
      modules[key]?.self || value.self,
      modules[key]?.wildcard || value.wildcard,
      value.modules // TODO: actually deep merge this
    )
  };
}

function integrateModulePath(parent: ModuleNode, tokens: Token[]): ModuleNode {
  if(tokens.length === 1) {
    if(haveTokens(tokens, Tokens.multiply)) {
      return moduleNode(parent.self, true, parent.modules);
    } else if(haveTokens(tokens, Tokens.identifier)) {
      return moduleNode(
        parent.self,
        parent.wildcard,
        mergeModule(parent.modules, tokens[0].value, moduleNode(true))
      );
    } else {
      throw new Error("syntax error");
    }
  } else if(haveTokens(tokens, Tokens.identifier, Tokens.dot)) {
    return moduleNode(
      parent.self,
      parent.wildcard,
      mergeModule(parent.modules, tokens[0].value, integrateModulePath(moduleNode(), tokens.slice(2)))
    );
  } else {
    throw new Error("syntax error");
  }
}

function parseWildcard(tokens: Token[]): ParseResult<ModuleNode> {
  if(haveTokens(tokens, Tokens.semi)) {
    return {
      tokens: tokens.slice(1),
      node: moduleNode(false, true)
    };
  } else {
    throw new Error("syntax error");
  }
}

export function parseModules(tokens: Token[]): ParseResult<ModuleNode> {
  if(haveTokens(tokens, Tokens.multiply)) {
    return parseWildcard(tokens.slice(1));
  } else if(haveTokens(tokens, Tokens.open_curly)) {
    const result = parseCurlyCSV(tokens);
    const modules = result.list.reduce((retval, group) => {
      return integrateModulePath(retval, group);
    }, moduleNode());
    if(haveTokens(result.tokens, Tokens.close_curly, Tokens.semi)) {
      return {
        node: modules,
        tokens: result.tokens.slice(2)
      };
    } else {
      throw new Error("syntax error");
    }
  } else {
    throw new Error("syntax error");
  }
}

export {
  ImportNode,
  FromNode,
  ExportNode,
  parseFrom,
  parseImport,
  parseExport
};