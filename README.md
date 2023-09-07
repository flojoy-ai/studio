[![main: CI](https://github.com/flojoy-ai/studio/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/flojoy-ai/studio/actions/workflows/main.yml) [![codecov](https://codecov.io/gh/flojoy-ai/studio/graph/badge.svg?token=BIB703MANI)](https://codecov.io/gh/flojoy-ai/studio)

# Flojoy Studio

Flojoy Studio is a desktop visual scripting IDE for running Python scripts - primarily for [DAQ](https://en.wikipedia.org/wiki/Data_acquisition), test benches, robotics control, and no-code embedded systems.

Please see [CONTRIBUTING](https://github.com/flojoy-io/flojoy-desktop/blob/main/CONTRIBUTING.md) to add your own custom Python nodes to Flojoy apps.

---

# Flojoy Quickstart

Please refer to below or the following link for installation guidelines: https://docs.flojoy.ai/getting-started/install/

For all operating systems, please first verify that you have [Python 3.10](https://www.python.org/downloads/), [Node.js](https://nodejs.org/en/download/package-manager), and [Git](https://git-scm.com/download) installed.

🆘 Need help installing? Please ask on [community.flojoy.ai](https://community.flojoy.ai)

## Mac & Linux

Run the installation shell script:

```bash
curl -L https://docs.flojoy.ai/scripts/install.sh | sh
```

Flojoy Studio will open automatically after installation.

The next time that you wish to run Studio, simply navigate to the studio folder and run:

```bash
bash flojoy -v venv
```

## Windows

Run the following installation PowerShell script:

```bash
pwsh -Command "iwr https://docs.flojoy.ai/scripts/install.ps1 -useb | iex"
```

If you encounter an error saying that the pwsh command is not found, powershell can be used instead, though we recommend installing the [latest version of PowerShell](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows).

Flojoy Studio will open automatically after installation.

The next time that you wish to run Studio, simply navigate to the studio folder and run:

```bash
.\flojoy -v venv
```

# License and Copyright

Flojoy is released under the [AGPLv3 license](https://www.gnu.org/licenses/agpl-3.0.en.html). This is a copy-left license in the GPL family of licenses. As with all [OSI approved licenses](https://opensource.org/licenses/alphabetical), there are no restrictions on what code licensed under AGPLv3 can be used for. However, the requirements for what must be shared publicly are greater than for licenses that are more commonly used in the Python ecosystem like [Apache-2](https://opensource.org/licenses/Apache-2.0), [MIT](https://opensource.org/licenses/MIT), and [BSD-3](https://opensource.org/licenses/BSD-3-Clause).

The Flojoy copyright is owned by Flojoy Inc, and contributors are asked to sign a Contributor License Agreement (based on the Oracle CLA) that grants the company the non-exclusive right to re-license the contribution in the future. For example, the project could be re-licensed to one of the more permissive licenses above (eg MIT or BSD).

If interested in using Flojoy in a context where the AGPL license is prohibitive, [please get in touch](mailto:jp@flojoy.io) or [contact sales](https://www.flojoy.ai/contact-sales).

# Architecture diagram

![backend-architecture](https://github.com/flojoy-ai/studio/assets/69379081/ed72cea2-17bb-4aa3-a26d-7eec19b24685)

# Product screenshots

![product_screenshot](https://github.com/flojoy-ai/studio/assets/1865834/e58877fb-b9e4-4831-ac35-de40021dacd3)
