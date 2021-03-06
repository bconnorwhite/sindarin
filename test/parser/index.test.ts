import { test, expect } from "@jest/globals";
import { scan, parse } from "../../source/phases";

test("basic", () => {
  const tokens = scan({
    contents: "import { output };",
    location: {
      path: "/test/file.si",
      line: 1,
      char: 0
    }
  });
  const result = parse(tokens.value ?? []);
  expect(result.value?.kind).toBe("root");
  expect(result.value?.value[0].kind).toBe("import");
});

test("array assignment", () => {
  const tokens = scan({
    contents: "a = [];",
    location: {
      path: "/test/file.si",
      line: 1,
      char: 0
    }
  });
  const result = parse(tokens.value ?? []);
  expect(result.value?.kind).toBe("root");
  expect(result.value?.value[0].kind).toBe("assignment");
});

test("array set max length", () => {
  const tokens = scan({
    contents: "[](5);",
    location: {
      path: "/test/file.si",
      line: 1,
      char: 0
    }
  });
  const result = parse(tokens.value ?? []);
  expect(result.value?.kind).toBe("root");
  expect(result.value?.value[0].kind).toBe("tuple");
});

test("rune", () => {
  const tokens = scan({
    contents: "'a';",
    location: {
      path: "/test/file.si",
      line: 1,
      char: 0
    }
  });
  const result = parse(tokens.value ?? []);
  expect(result.value?.kind).toBe("root");
  expect(result.value?.value[0].kind).toBe("tuple");
});

test("export", () => {
  const tokens = scan({
    contents: "a = 5;\nexport a;",
    location: {
      path: "/test/file.si",
      line: 1,
      char: 0
    }
  });
  const result = parse(tokens.value ?? []);
  expect(result.value?.kind).toBe("root");
  expect(result.value?.value[1].kind).toBe("export");
});

test("from", () => {
  const tokens = scan({
    contents: "from \"<stdlib.h>\" import { rand };",
    location: {
      path: "/test/file.si",
      line: 1,
      char: 0
    }
  });
  const result = parse(tokens.value ?? []);
  expect(result.value?.kind).toBe("root");
  expect(result.value?.value[0].kind).toBe("import");
});
