import reduceFirst from "reduce-first";
import { Context, hasChanged } from "../context";
import { getRawToken, RawTokens } from "./raw";
import { getValueToken, ValueTokens } from "./value";

export type Tokens =
  | RawTokens
  | ValueTokens;

export const Tokens = {
  ...ValueTokens,
  ...RawTokens
};

export function getToken(context: Context): Context {
  const strategies = [
    getRawToken,
    getValueToken
  ];
  const result = reduceFirst(strategies, (strategy) => {
    const nextContext = strategy(context);
    return hasChanged(context, nextContext) ? nextContext : undefined;
  });
  if(result === undefined) {
    throw new Error(`Invalid Token: '${context.file[0]}' ${context.location}`);
  } else {
    return result;
  }
}