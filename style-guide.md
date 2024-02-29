# Code Style Guide

## TypeScript

### Naming

Use `camelCase` for functions, variables.
Use `PascalCase` for types, interfaces, and classes.
Use `kebab-case` for file names.

---

### Whitespace

Use newlines to separate logical blocks of code.
Always have a newline before a comment.

---

### Don't use relative imports from outside the directory

Relative imports (using `../`) are very annoying to fix when files are moved.
An ESLint rule has been added to mark these are errors.

Relative imports within the same directory (`./`) are ok.

---

### Never use `any`

If you're going to use `any`, what's even the point of using TypeScript?

There are only very specific use cases where `any` absolutely has to be used.
For example, wrapping any function and retaining the signature:

```typescript
function <S extends (...params: any[]) => void>(
  innerFn: S,
): ((...args: Parameters<S>) => void) {
  const fn = function (...args: Parameters<S>) {
  // do something
  };
  return fn;
},
```

Outside of these, `any` should **never** be used.

---

### Avoid casting with `as`

`as` subverts the TypeScript type system and thus should be avoided/used carefully.

This kind of situation happens all too often accidentally:

```typescript
type Foo = {
  bar: string;
  baz: number;
};

const a = { bar: "asdf" };

const b = a as Foo;

// Somewhere later
b.baz; // LSP says it's defined, but it actually isn't when you try to use it
```

It creates situations where you are fooling yourself into thinking an object is a
valid instance of type `T` but it's actually It's almost as bad as just using `any`.

---

### No `JSON.parse` without a Zod schema

Always validate unknown data with Zod. Unknown data is a source of unexpected
issues just like casting with `as`. You should really make sure that the data
is of the type you expected. It may seem fast to just do a `as` cast, but
it will just create more pain for you or other people in the future when
the complexity grows.

### `Record<string, T>`

If you know ahead of time what the keys of this record are going to be, please
just explicitly type them. It's much easier to understand and maintain.

For example, if you know the key is only going to be `Python` or `Pytest` or `Matlab`,
then please use:

```typescript
type TestSequencerSupportedType = "Python" | "Pytest" | "Matlab";

Record<TestSequencerSupportedType, T>;
```

---

### Avoid `Exception` as much as possible

Exceptions are bad because a caller doesn't know when they can be thrown.
Also, callers are not forced to handle possible errors.
Instead, use `Result<T, E>`, which is either a success value holding
the data you want or an error value. This way, any function that can fail
has it encoded in the type.

For interoperability with library code that can throw,
use the `tryCatch` and `tryCatchPromise` functions.

Here's an example of a function that could throw:

```ts
export const getManifest = async (): BlockManifest => {
  const res = await captain.get("blocks/manifest").json(); // could error
  return blockManifestSchema.parse(res); // could error
};
```

Rewritten using result:

```ts
export const getManifest = async (): Promise<
  Result<BlockManifest, Error | ZodError>
> => {
  const res = await tryCatchPromise<unknown, HTTPError>(() =>
    captain.get("blocks/manifest").json(),
  );
  return res.andThen(tryParse(blockManifestSchema));
};
```

`andThen` is a function on a `Result` that takes a function that returns a `Result`.
If the first `Result` is an error, it returns the error.
If it's a success, it calls the function with the success value and returns
the result of that function.
This lets you chain together functions that could fail in an elegant manner,
without having to check for errors and do an early return at every step.
