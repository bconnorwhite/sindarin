<div id="sindarin" align="center">
  <h1 align="center">
    <div>🕊</div><i>Sindarin ~</i>
  </h1>
  <h6><a href="https://www.youtube.com/watch?v=vQA5aLctA0I"><i>"An elegant language, for a more civilized age."</i></a></h6>
  <br />
</div>

<h2 id="installation"><div align="right"><a href="#sindarin">🔝</a></div><i>Installation</i></h2>

> Coming Soon&trade;

<h2 id="contents"><div align="right"><a href="#sindarin">🔝</a></div><i>Contents</i></h2>

- [Philosophy](#philosophy)
- ["Blow my mind in 30 seconds"](#blow-my-mind-in-30-seconds)  
  - [Function Baking (currying, but better)](#function-baking-currying-but-better)
  - [Argument Forwarding](#argument-forwarding)
  - [Multi-Return](#multi-return)
  - [Naked Functions](#naked-functions)
- [Syntax](#syntax)
  - [Comments](#comments)
  - [Separators](#separators)
  - [Modules](#modules)
  - [Assignment](#assignment)
  - [Types](#types)
- [Standard Functions](#standard-functions)
  - [Control Flow](#control-flow)
  - [Loops](#loops)
  - [Type Functions](#type-functions)
  - [String Functions](#string-functions)
  - [Array Functions](#array-functions)
- [Operators](#operators)
  - [Generic Operators](#generic-operators)
  - [Comparison Operators](#comparison-operators)
  - [Boolean Operators](#boolean-operators)
  - [Numeric Operators](#numeric-operators)
  - [Destructor Operator](#destructor-operator)
  - [Default Operator](#default-operator)
  - [Ternary Operator](#ternary-operator)
- [Input / Output](#input-output)
- [Development Setup](#development-setup)  

<h2 id="philosophy"><div align="right"><a href="#sindarin">🔝</a></div><i>Philosophy</i></h2>

- Minimize keywords, balance use of separators and operators
- Functional
- Compiled to native
- Type-safety
- Memory-safety
- Copy-on-write
- Don't throw, no try/catch

<h2 id="blow-my-mind-in-30-seconds"><div align="right"><a href="#sindarin">🔝</a></div><i>"Blow my mind in 30 seconds"</i></h2>

### _Partial Arguments_
Commas leave some arguments unspecified, while baking others into a new function:
```
add = (a: number, b: number) => {
  return a + b;
};

increment = add(1,);  // (b: number) => number;

x = increment(2);     // 3
```

### _Argument Forwarding_
With the forward operator (`->`), functions snap together like Legos:
```
add = (a: number, b: number) => {
  return a + b;
};

multiply = (a: number, b: number) => {
  return a * b;
};

y = (m: number, x: number, b: number) => {
  return multiply(m, x)->add(,b);  
  // Less-civilized equivalent: return add(multiply(m, x), b);
};
```
This can also be reversed with the backward operator (`<-`):
```
// if(condition: boolean, then: any, else: any);

z = if(x < y, 1)
  <- if(x == y, 0)
  <- if(y < 10, 4, 10)

// Less-civilized equivalent: z = if(x < y, 1, if(x == y, 0, if(y < 10, 4, 10)))

```

### _Multi-Return_
Functions can also return multiple values:
```si
fetch = (url: string) => {
  // Perform fetch operation...
  return result, error;
};

result, error = fetch("https://example.com/path");
```

This results in some nice patterns when combined with argument forwarding:
```
handleError = (result: any, error?: string) => {
  return if(error, () => {
    log(error);
    return undefined;
  }, result);
};

handleResult = (result?: any) => {
  return log(result);
};

fetch("...")
  ->handleError
  ->handleResult;
```

### _Naked Functions_
Functions without argments don't require `() =>`, and are immediately called:
```
myNum = {
  log("nice");
  return 5;
};

// myNum = 5
```
In an if statement:
```
a = if(1 < 2, {
  log("thing");
  return 5;
}, {
  return 6;
});

// a = 5
```

<h2 id="syntax"><div align="right"><a href="#sindarin">🔝</a></div><i>Syntax</i></h2>

### _Comments_
```
// Single line comment

/**
* Multi
* Line
* Comment
*/
```
### _Separators_
Semi-colons are required at the end of assignments:
```
x = 5;

fn = () => {
  return 6;
};
```

### _Modules_

#### _Imports_

Standard functions are imported:
```
import { if, for };
```

All standard functions can also be imported with `*`:
```
import *;
```

External and relative libraries can be imported with `from`:
```
from "./relative/path" import *;
from "other-library" import { thing };
```
Or import directly:
```
from "https://github.com/example/repo" import { otherThing };
```
Imports can also be deeply nested:
```
from "other-library" import { thing.run };

run();
```
Imports can be aliased:
```
from "other-library" import { start = thing.run };

start();
```

#### _Exports_
All values and functions can be exported:
```
export x = 5;

export add = (a: number, b: number) => {
  return a + b;
};

export struct = {
  a: 1,
  b: {
    nested: 5
  }
};
```
In another module:
```
from "module-1" import { x, add, struct.b };

// b.nested = 5
```

#### _Example sindarin.json:_
Dependencies can be defined in sindarin.json:
```json
{
  "name": "my-package-name",
  "version": "1.0.0",
  "main": "source/index.si",
  "dependencies": {
    "other-library": "https://github.com/my-user/repo-name",
    "relative-alias": "./source/example-dir"
  }
}
```

### _Assignment_
Variables can be assigned without a keyword, and are immuatable by default. Variables also should be camelcase:
```
x = true;
y = 5;
z = "ok";
```
Arrays are initialized with brackets:
```
x = [
  1,
  "a",
  () => 5
];
```
Struct properties are assigned with `=`, and can be indexed with `.` or `[]`:
```
x = {
  a = 2,
  b = "ok",
  1 = "c"
};
y = "b";

// x.a == 1
// x.1 == "c"
// x.y == undefined
// x[y] == "ok
```
Sets are initialized as structs without keys:
```
y = "b";

x = {
  "a",
  1,
  y
};

// x.a == "a";
// y.b == "b";
// x.1 == 1;
```
Sets are also nice for creating enums:
```
x = {
  "TALL",
  "SHORT"
};

// x.TALL == "TALL"
// x["SHORT"] == "SHORT"
```
#### _Mutable Assignment_
Mutable variables can be created with the `~` operator:
```
a ~ 5;
a ~ a + 1;

// a == 6
```
If they are reassigned with `=`, they will remain mutable:
```
a ~ 5;
a = a + 1;
a = a + 1;

// a == 7
```
Variables initialized without a value are also mutable:
```
a;
if(true, a ~ 1);

// a == 1
```

### _Types_
Types should be capitalized and created with `=`, but applied with `:`:
```
import { String, Number };

Person = {
  first: String,
  last: String,
  age: Number
};

a: Person = {
  first = "Ben",
  last = "Kenobi",
  age = 57
};

```
Type assignment inside a struct:
```
b = {
  name: string = "Obi-Wan",
  age: number ~ 57            // Mutable field
};
```

<h2 id="standard-functions"><div align="right"><a href="#sindarin">🔝</a></div><i>Standard Functions</i></h2>

### _Control Flow_

#### _if_
```
import { if };

x = if(1<2, 5, 7);          // x == 5

x = if(false, 6);           // x == 5
x = if(false, 6, undefined) // x == undefined
y = if(false, 6);           // y == undefined
```

### _Loops_

#### _for_
```
import { for };

for([1, 2, 3], (item: number, index: number, array: number[]) => {
  // ...
});
```

#### _do_
```
import { do };

do({
  // ...
}, true);
```

#### _while_
```
import { while };

while(true, {
  // ...
});
```

### _Type Functions_

#### _type_
```
import { type, types, String };

types: { String } = {
  "Boolean",
  "Number",
  "String",
  "Array",
  "Struct",
  "Function",
  "Undefined"
};

type(true);       // types.Boolean
type(1);          // types.Number
type("string");   // types.String
type([1, 2]);     // types.Array
type({ a: 1 });   // types.Struct
type(() => 5);    // types.Function
type(undefined);  // types.Undefined

```

#### _boolean_
```
import { boolean };

boolean(true);      // true
boolean(1);         // true
boolean(0);         // false
boolean("");        // false
boolean("string");  // true
boolean([1, 2]);    // true
boolean([]);        // false
boolean({ a: 1 });  // true
boolean({});        // false
boolean(() => 5);   // true
boolean(undefined); // false
```

#### _number_
```
import { number };

number(true);       // 1
number(1);          // 1
number("1");        // 49
number([1, 2]);     // undefined
number({ a: 1 });   // undefined
number(() => 1);    // undefined
number(undefined);  // undefined
```

#### _string_
```
import { string };

string(true);       // "true"
string(1);          // "1"
string([1, 2]);     // "[1,2]"
string("abc");      // '"abc"'
string({ a: 1 });   // '{"a":1}'
string(() => 1);    // some unique identifier for the function, memory address?
string(undefined);  // "undefined"
string(1, 2);       // "1,2"
```

#### _parse_
(inverse `string`)
```
import { parse };

parse("true");    // true
parse("1");       // 1
parse("1.2");     // 1.2
parse("ok");      // undefined
parse('"ok"');    // "ok"
parse("[1]");     // [1]
parse('{"a":1}'); // { a: 1 }
```
#### _array_
```
import { array };

array(true);                    // [true]
array(1);                       // [1]
array([1, 2]);                  // [[1, 2]]
array({ 0: 1, 1: "b", a: 3 });  // [{ 0: 1, 1: "b", a: 3 }]
array(() => 5);                 // [() => 5]
array(undefined);               // []
array(1, 2);                    // [1, 2]
```

#### _asArray_
```
import { asArray };

asArray(true);                    // [true]
asArray(1);                       // [1]
asArray([1, 2]);                  // [1, 2]
asArray({ 0: 1, 1: "b", a: 3 });  // [1, "b", ["a", 3]]
asArray(() => 5);                 // [() => 5]
asArray(undefined);               // []
asArray(1, 2);                    // [1, 2]
```

#### _struct_
```
import { struct };

struct(true);               // { 0: true }
struct(1);                  // { 0: 1 }
struct([1, "b", ["a", 3]]); // { 0: [1, "b", ["a", 3]] }
struct({ a: 1 });           // { 0: { a: 1 } }
struct(() => 5);            // { 0: () => 5 }
struct(undefined);          // {}
struct(1, 2);               // { 0: 1, 1: 2 }
```

#### _asStruct_
```
import { asStruct };

asStruct(true);               // { 0: true }
asStruct(1);                  // { 0: 1 }
asStruct([1, "b", ["a", 3]]); // { 0: 1, 1: "b", a: 3 }
asStruct({ a: 1 });           // { a: 1 }
asStruct(() => 5);            // { 0: () => 5 }
asStruct(undefined);          // {}
asStruct(1, 2);               // { 0: 1, 1: 2 }
```

#### _destruct_
(inverse `array` / `struct`)
```
import { destruct };

destruct(true);           // true
destruct(5);              // [true, false, true]
destruct("abc");          // ["a", "b", "c"]
destruct([1, 2]);         // 1, 2
destruct({ 0: 1, a: 2 }); // 1, ["a", 2]
destruct(() => 5);        // () => 5
destruct(undefined);      // undefined
destruct([1, 2], [3, 4]); // 1, 2, 3, 4
```

#### _function_
```
import { function };

function(true);       // () => true;
function(1);          // () => 1;
function("string");   // () => string;
function([1, 2]);     // () => [1, 2];
function({ a: 1 });   // () => { a: 1 };
function(() => 5);    // () => () => 5;
function(undefined);  // () => undefined;
```

#### _call_
(reverse `function`)
```
import { call };

call(() => true);     // true;
```


### _String Functions_

#### _length_
```
import { length };

length("ok"); // 2
length("");   // 0
```

#### _split_
```
import { split };

split("abc");                             // ["a", "b", "c"]
split("abc", "b");                        // ["a", "c"]
split("abc", 2);                          // ["ab", "c"]
split("05/14 12:00", ["/", " ", ":"]);    // ["05", "14", "12", "00"]
split("05/14 12:00", [2, 3, 5, 6, 8, 9]); // ["05", "/", "14", " ", "12" ":", "00"]
```


### _Array Functions_

#### _count_
```
import { count };

count([1, "b"]);    // 2

count(true);        // 1
count(1);           // 1
count({ 1, "b" });  // 2 
```

#### _fill_
```
import { fill };

fill(3);                            // [,,];
fill(3, "a");                       // ["a", "a", "a"];
fill(3, (index: number) => index);  // [0, 1, 2];
```

#### _join_
(inverse `destruct` for strings and boolean arrays)
```
import { join };

join(["a", "b", "c"]);      // "abc"
join([true, false, true]);  // 5
```

<h2 id="operators"><div align="right"><a href="#sindarin">🔝</a></div><i>Operators</i></h2>

### _Generic Operators_
#### _Addition_
```
x = 1 + 2;                            // 3
x = "a" + "b";                        // "ab"
x = [1] + [2];                        // [1, 2];
x = { a: 1, b: 2 } + { b: 3, c: 4 };  // { a: 1, b: 3, c: 4 };
x = (() => 5) + ((x: number) => x+2)  // (() => 5)->((x: number) => x-2), equivalent of () => 3
```

#### _Equals_
```
true == true          // true
true == 1             // false - different types are false
1 == 1                // true
"a" == "a"            // true
[1] == [1]            // false (by reference)
{ a: 1 } == { a: 1 }  // false (by reference)

```
### _Comparison Operators_
If operands are same type, primitives are compared by value, and arrays/structs by size. Otherwise, operands are compared by type in the following hierarchy:

`boolean < number < string < array/struct < function`

#### _Less Than_
```
false < true                // true (compare by value)
1 < "a"                     // true (compare by type)
[1] < { a: 1, b: 2, c: 3 }  // true (compare by size)
5 < () => 1                 // true (compare by type)
```
#### _Greater Than_
```
false > true                // false (compare by value)
1 > "a"                     // false (compare by type)
[1] > { a: 1, b: 2, c: 3 }  // false (compare by size)
5 > () => 1                 // false (compare by type)
```
#### _Less Than or Equal_
```
false <= true               // true (compare by value)
1 <= "a"                    // true (compare by type)
[1] <= { a: 1, b: 2, c: 3 } // true (compare by size)
5 <= () => 1                // true (compare by type)
```
#### _Greater Than or Equal_
```
false >= true               // false (compare by value)
1 >= "a"                    // false (compare by type)
[1] >= { a: 1, b: 2, c: 3 } // false (compare by size)
5 >= () => 1                // false (compare by type)
```

### _Boolean Operators_

#### _And_
```
x = true & true;  // true
x = true & 1;     // true
x = true & "a";   // true
x = true & [];    // false
```

#### _Or_
```
x = false | true;  // true
x = false | 1;     // true
x = false | "a";   // true
x = false | [];    // false
```

### _Numeric Operators_
```
x = 4 - 2;    // 2
x = 4 / 2;    // 2
x = 4 / 0;    // infinity
x = 4 * 2;    // 8
x = 4 ^ 2;    // 16
x = 7 % 2;    // 1
```

### _Destructor Operator_
```
a = [1, 2, 3];
b = [0, ...a];  // 0, 1, 2, 3
c = ...a;       // 1, 2, 3
d = ...5;       // [true, false, true]
e = ..."abc";   // ["a", "b", "c"]
```
The destruct operator can also be returned:
```
fn = (..., error) => {
  log(error);
  return ...;
};

a, b, c = fn(1, 2, 3, "ERROR");
```

### _Default Operator_
If `b` is `undefined`, set `a` to `c`, else set `a` to `b`.
```
a = b ?? c;
```

### _Ternary Operator_
If `b` is truthy, set `a` to c, else set `a` to `d`.
```
a = b ? c : d;
```

### _Operator Precendence_
All operators have left to right precedence so that parentheses are required to make the order explicit:
```
a = 1 + 2 * 3;    // 9
a = 1 + (2 * 3);  // 7
```
<h2 id="input-output"><div align="right"><a href="#sindarin">🔝</a></div><i>Input / Output</i></h2>

```
import { log };

log("Hi");
```

<h2 id="development-setup"><div align="right"><a href="#sindarin">🔝</a></div><i>Development Setup</i></h2>

### _Install on macOS:_
```
brew install cmake llvm@11
```

### _Install on Ubuntu:_
```
sudo apt-get install cmake llvm-11
```
