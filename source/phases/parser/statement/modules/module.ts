import { haveTokens, Token, Tokens } from "../../../scanner";
import { ParsePhase, ParseResult } from "../..";
import { ASTNode, Kinds } from "../../node";
import { getErrorResult, getResult } from "../../result";

type Modules = {
  [name: string]: ModuleNode;
};

export interface ModuleNode extends ASTNode {
  kind: Kinds.module;
  self: boolean; // always false at top level (no default)
  wildcard: boolean;
  modules?: Modules;
}

type TokenGroupList = Token[][];

function parseSV(tokens: Token[], separator: Tokens, end: Tokens) {
  const list: TokenGroupList = [[]];
  let pointer = 1; // skip opener
  while(tokens[pointer].kind !== end) {
    if(tokens[pointer].kind === separator) {
      list.push([]);
    } else {
      list[list.length-1].push(tokens[pointer]);
    }
    pointer+=1;
  }
  return {
    list,
    tokens: tokens.slice(pointer)
  };
}

function parseCSV(tokens: Token[], end: Tokens) {
  return parseSV(tokens, Tokens.comma, end);
}

// { a, b }
export function parseCurlyCSV(tokens: Token[]) {
  return parseCSV(tokens, Tokens.close_curly);
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
    } else if(haveTokens(tokens, Tokens.identifier) && tokens[0].value) {
      return moduleNode(
        parent.self,
        parent.wildcard,
        mergeModule(parent.modules, tokens[0].value, moduleNode(true))
      );
    } else {
      throw new Error("syntax error");
    }
  } else if(haveTokens(tokens, Tokens.identifier, Tokens.dot) && tokens[0].value) {
    return moduleNode(
      parent.self,
      parent.wildcard,
      mergeModule(parent.modules, tokens[0].value, integrateModulePath(moduleNode(), tokens.slice(2)))
    );
  } else {
    throw new Error("syntax error");
  }
}

const parseWildcard: ParsePhase<ModuleNode> = (tokens: Token[]) => {
  if(haveTokens(tokens, Tokens.semi)) {
    return getResult(tokens.slice(1), moduleNode(false, true));
  } else {
    return getErrorResult(tokens, Kinds.module, "missing semi-colon");
  }
};

export const parseModules: ParsePhase<ModuleNode> = (tokens: Token[]): ParseResult<ModuleNode> => {
  if(haveTokens(tokens, Tokens.multiply)) {
    return parseWildcard(tokens.slice(1));
  } else if(haveTokens(tokens, Tokens.open_curly)) {
    const result = parseCurlyCSV(tokens);
    const modules = result.list.reduce((retval, group) => {
      return integrateModulePath(retval, group);
    }, moduleNode());
    if(haveTokens(result.tokens, Tokens.close_curly)) {
      return {
        context: result.tokens.slice(1),
        value: modules,
        errors: []
      };
    } else {
      throw new Error("syntax error");
    }
  } else if(haveTokens(tokens, Tokens.identifier) && tokens[0].value) {
    return {
      context: tokens.slice(1),
      value: moduleNode(
        false,
        false,
        mergeModule({}, tokens[0].value, moduleNode(true))
      ),
      errors: []
    };
  } else {
    throw new Error("syntax error");
  }
};
