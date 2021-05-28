import { PotentialParseResult } from "../../..";
import { haveTokens, Token, Tokens } from "../../../../lexer";
import { ASTNode, Kinds } from "../../../node";

export interface BooleanNode extends ASTNode {
  kind: Kinds.boolean;
  value: boolean;
}

export function parseBoolean(tokens: Token[]): PotentialParseResult<BooleanNode> {
  if(haveTokens(tokens, Tokens.true) || haveTokens(tokens, Tokens.false)) {
    return {
      tokens: tokens.slice(1),
      node: {
        kind: Kinds.boolean,
        value: tokens[0].kind === Tokens.true
      }
    };
  } else {
    return undefined;
  }
}
