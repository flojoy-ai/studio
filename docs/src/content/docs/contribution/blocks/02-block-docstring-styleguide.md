---
title: Block Docstring Styleguide
description: A styleguide for writing docstrings for Flojoy Blocks.
slug: "contribution/blocks/docstring-styleguide"
sidebar:
  order: 2
---

Welcome to the Block Docstring Styleguide to Flojoy Blocks.

Our styleguide is based on the [NumPy Docstring Styleguide](https://numpydoc.readthedocs.io/en/latest/format.html),
which is a widely used styleguide for Python docstrings. If you are already
familiar with it, then you are good to go. If not, we recommend you to give
the following sections a quick read :)

## Sections

The docstring consists of a number of sections separated by headings.
Each heading should be underlined in hyphens, and the section ordering
should be consistent with the description below.

### 1. Short summary

A one-line summary that does not use variable names or the function name, e.g.

Note that having a good short summary is very important since it will
be used for SEO.

```python
def add(a: Scalar, b: Scalar) -> Scalar:
    """The sum of two Scalar DataContainers.

    """
```

### 2. Extended Summary

A few sentences giving an extended description. This section should be used to
clarify functionality, not to discuss implementation detail or background theory.
You may refer to the parameters and the function name, but parameter descriptions
still belong in the Parameters section.

```python
def add(a: Scalar, b: Scalar) -> Scalar:
    """The sum of two Scalar DataContainers.

    This function accepts two Scalar DataContainers, `a` and `b`,
    and returns their sum also as a Scalar DataContainer.
    """
```

### 3. Parameters

Description of the function arguments, keywords and their respective types.

```python
def add(a: Scalar, b: Scalar) -> Scalar:
    """The sum of two Scalar DataContainers.

    This function accepts two Scalar DataContainers, `a` and `b`,
    and returns their sum also as a Scalar DataContainer.

    Parameters
    ----------
    a : Scalar
        First Scalar DataContainer.
    b : Scalar
        Second Scalar DataContainer.
    """
```

If it is not necessary to specify a keyword argument, use optional:

```python
"""
a : Scalar, optional
"""
```

If there is a default value, you can specify it like this:

```python
"""
some_parameter : bool, default=True
"""
```

### 4. Returns

Explanation of the returned values and their types. Similar to the Parameters section,
except the name of each return value is optional.
The type of each return value is always required:

```python
def add(a: Scalar, b: Scalar) -> Scalar:
    """The sum of two Scalar DataContainers.

    This function accepts two Scalar DataContainers, `a` and `b`,
    and returns their sum also as a Scalar DataContainer.

    Parameters
    ----------
    a : Scalar
        First Scalar DataContainer.
    b : Scalar
        Second Scalar DataContainer.

    Returns
    -------
    Scalar
        Sum of `a` and `b` as a Scalar DataContainer.
    """
```

Note: also make sure to enclose variables in single backticks.

Here we go, you have successfully written a Flojoy Block docstring! 🎉

(This is currently a small subset of NumPy's Docstring Styleguide,
more docstring features such as Raises, Notes, etc. will be support in the future)

Need help with docstring formatting? Join our [Discord community](https://discord.gg/7HEBr7yG8c)
and we will help you out!
