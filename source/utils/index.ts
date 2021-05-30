
export type ValueOf<T> = Extract<T[keyof T], string>;

export type ConditionalKeys<Base, Condition> = NonNullable<{
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
}[keyof Base]>;

export function asArray<T>(arr: T | T[]) {
  return Array.isArray(arr) ? arr : [arr];
}

export type Enum<T extends string> = {
  [Key in T]: Key;
};

export function getEnum<T extends Record<string, any>>(object: T) {
  return (Object.keys(object) as (keyof T)[]).reduce((retval, key) => {
    retval[key] = key;
    return retval;
  }, {} as {
    [Key in keyof T]: Key;
  });
}
