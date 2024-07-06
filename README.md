[![main: CI](https://github.com/flojoy-ai/studio/actions/workflows/electron-test.yml/badge.svg?branch=main)](https://github.com/flojoy-ai/studio/actions/workflows/electron-test.yml) [![codecov](https://codecov.io/gh/flojoy-ai/studio/graph/badge.svg?token=BIB703MANI)](https://codecov.io/gh/flojoy-ai/studio)

# Flojoy Studio

_Open-source test sequencer for hardware validation_ 🟢 🟡 🔴 

Use to validate mission critical components such as PCBs, wire harnesses, and battery packs.

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

MIT licensed. This is free software - please use and modify however you wish.

# Screenshots

## Test sequencer

To use the test sequencer, simply import existing pytest, Python, and/or Robot Framework scripts. For pytest, the test sequencer will automatically atomize your tests as rows.

![image](https://github.com/flojoy-ai/studio/assets/1865834/9cfcfb86-24bc-46fd-82de-e9fd9db2ef3b)

## No-code script builder

Quickly build test & measure automation apps by wiring together premade "blocks." Custom blocks can also be written in Python.

![image](https://github.com/flojoy-ai/studio/assets/1865834/b1efa4f7-a58a-4406-9b37-2311611fb1bd)

# Architecture

![backend-architecture](https://github.com/flojoy-ai/studio/assets/69379081/ed72cea2-17bb-4aa3-a26d-7eec19b24685)
