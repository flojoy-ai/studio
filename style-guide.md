### Naming

Use `camelCase` for functions, variables.
Use `PascalCase` for types, interfaces, and classes.
Use `kebab-case` for file names.

### Don't use relative imports from outside the directory

Relative imports (using `../`) are extremely annoying to fix when files are moved.
An ESLint rule has been added to mark these are errors.

Relative imports within the same directory (`./`) are ok.

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

It creates situations where you can be tricked into thinking an object is a valid instance of type `T` but it's actually It's almost as bad as just using `any`.

Only use `as` when you absolutely have to, for example when handling errors which are always typed as `unknown`/`any`.

### No `JSON.parse` without a Zod schema

Always validate unknown data with Zod. Unknown data is a source of unexpected issues just like casting with `as`. You should really make sure that the data is of the type you expected.

### Don't use exceptions

Exceptions are bad because a caller doesn't know when they can be thrown. Also, callers are not forced to handle possible errors.
Instead, use `Result<T, E>`, which is either a success value holding the data you want or an error value. This way, any function that can fail has it encoded in the type.

```

```
