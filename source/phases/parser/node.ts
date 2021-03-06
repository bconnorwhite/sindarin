import { ParametersNode } from "./parameters";
import { SpreadNode } from "./spread";
import { StatementNode } from "./statement";
import { AssignmentNode } from "./statement/assignment";
import { DeclarationNode } from "./statement/assignment/declaration";
import { TypeNode } from "./statement/assignment/declaration/type";
import { ModuleNode } from "./statement/modules/module";
import { ExpressionNode, TupletNode } from "./statement/tuple";
import { BinaryOperationNode, BinaryOperator, BitwiseOperator, isBitwiseOperation, isLogicalOperation, LogicalOperator } from "./statement/tuple/binary-operation";
import { UnaryOperationNode, UnaryOperator } from "./statement/tuple/unary-operation";
import { BooleanNode } from "./statement/tuple/value/boolean";
import { FunctionNode } from "./statement/tuple/value/function";
import { NullNode } from "./statement/tuple/value/null";
import { NumberNode } from "./statement/tuple/value/number";
import { AccessorNode } from "./statement/tuple/value/operation/accessor";
import { CallNode } from "./statement/tuple/value/operation/call";
import { RuneNode } from "./statement/tuple/value/rune";
import { VoidNode } from "./statement/tuple/void";

export enum Kinds {
  root = "root",
  import = "import",
  export = "export",
  from = "from",
  module = "module",
  number = "number",
  string = "string",
  boolean = "boolean",
  null = "null",
  tuple = "tuple",
  array = "array",
  struct = "struct",
  function = "function",
  void = "void",
  identifier = "identifier",
  type = "type",
  unaryOperation = "unaryOperation",
  binaryOperation = "binaryOperation",
  call = "call",
  accessor = "accessor",
  arguments = "arguments",
  parameters = "parameters",
  declaration = "declaration",
  assignment = "assignment",
  return = "return",
  spread = "spread",
  list = "list",
  rune = "rune"
}

export type ASTNode<K extends Kinds = Kinds> = {
  kind: K;
};

export function isNode<K extends Kinds>(node: ASTNode | undefined, kind: K): node is ASTNode<K> {
  return node?.kind === kind;
}

export {
  NullNode,
  NumberNode,
  ExpressionNode,
  VoidNode,
  TupletNode,
  AccessorNode,
  BinaryOperationNode,
  UnaryOperationNode,
  CallNode,
  ParametersNode,
  AssignmentNode,
  DeclarationNode,
  TypeNode,
  FunctionNode,
  SpreadNode,
  RuneNode,
  StatementNode,
  UnaryOperator,
  BooleanNode,
  BitwiseOperator,
  isBitwiseOperation,
  BinaryOperator,
  isLogicalOperation,
  LogicalOperator,
  ModuleNode
};
