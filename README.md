[![main: CI](https://github.com/flojoy-ai/studio/actions/workflows/electron-test.yml/badge.svg?branch=main)](https://github.com/flojoy-ai/studio/actions/workflows/electron-test.yml) [![codecov](https://codecov.io/gh/flojoy-ai/studio/graph/badge.svg?token=BIB703MANI)](https://codecov.io/gh/flojoy-ai/studio)

# Flojoy Studio

_Open-source test sequencer for hardware validation_ 🟢 🟡 🔴 

Use to validate mission critical components such as PCB boards, wire harnesses, and battery packs.

### Features
- Automate pytest, Python, and/or Robot Framework scripts as saveable test sequences
- No-code GUI to run test sequences - clearly report pass 🟢 / fail 🔴 status to operator
- No-code, visual scripting interface for common test & measure automation routines
- Optionally sync test runs with [Flojoy Cloud](https://github.com/flojoy-ai/cloud/)

---

# Quickstart

Please find installer downloads for Mac, Windows, and Linux at https://docs.flojoy.ai/studio/installation/

🆘 Need help installing? Please ask on [Flojoy's Discord](https://discord.com/invite/7HEBr7yG8c)

# License and Copyright

Flojoy is released under the [AGPLv3 license](https://www.gnu.org/licenses/agpl-3.0.en.html). This is a copy-left license in the GPL family of licenses. As with all [OSI approved licenses](https://opensource.org/licenses/alphabetical), there are no restrictions on what code licensed under AGPLv3 can be used for. However, the requirements for what must be shared publicly are greater than for licenses that are more commonly used in the Python ecosystem like [Apache-2](https://opensource.org/licenses/Apache-2.0), [MIT](https://opensource.org/licenses/MIT), and [BSD-3](https://opensource.org/licenses/BSD-3-Clause).

The Flojoy copyright is owned by Flojoy Inc, and contributors are asked to sign a Contributor License Agreement (based on the Oracle CLA) that grants the company the non-exclusive right to re-license the contribution in the future. For example, the project could be re-licensed to one of the more permissive licenses above (eg MIT or BSD).

If interested in using Flojoy in a context where the AGPL license is prohibitive, [please get in touch](mailto:jp@flojoy.io) or [contact sales](https://www.flojoy.ai/contact-sales).

# Screenshots

## Test sequencer

To use the test sequencer, simply import existing pytest, Python, and/or Robot Framework scripts. For pytest, the test sequencer will automatically atomize your tests as rows.

![image](https://github.com/flojoy-ai/studio/assets/1865834/9cfcfb86-24bc-46fd-82de-e9fd9db2ef3b)

## No-code script builder

Quickly build test & measure automation apps by wiring together premade "blocks." Custom blocks can also be written in Python.

![image](https://github.com/flojoy-ai/studio/assets/1865834/b1efa4f7-a58a-4406-9b37-2311611fb1bd)

# Architecture

![backend-architecture](https://github.com/flojoy-ai/studio/assets/69379081/ed72cea2-17bb-4aa3-a26d-7eec19b24685)
