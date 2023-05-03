[![main: CI](https://github.com/flojoy-io/flojoy-desktop/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/flojoy-io/flojoy-desktop/actions/workflows/main.yml)

# Flojoy

Please see [CONTRIBUTING](https://github.com/flojoy-io/flojoy-desktop/blob/main/CONTRIBUTING.md) to add your own custom Python nodes to Flojoy apps.

---

# Flojoy Quickstart

Please refer to the following link for installation guidelines: https://docs.flojoy.io/getting-started/install/

# Running ElectronJS locally

If you'd like to run Flojoy as an Electron app:

1. (Optional) Set the following env variables. These variables are used in the [docker-compose.yml file](docker-compose.yml) to set the image tags.
   Put any specific tag value if you need, otherwise Docker will use the latest by default.

```
BACKEND_IMAGE_TAG=latest
RQ_WORKER_IMAGE_TAG=latest
WATCH_IMAGE_TAG=latest
```

2. Run `npm run electron-dev` to start Electron app locally. It will start the Docker containers to run the necessary backend parts.

To package the Electron app, run `npm run electron-package`. The `dist` folder will hold the generated artifacts.

# CD

Currently there are two CD workflows.

1. [Base image CD](.github/workflows/cd_image.yaml): Builds and pushes the base image used in [the docker files](./docker).
2. [CD](.github/workflows/cd.yaml): Runsi if a version tag is added. It builds packages, creates executables and creates github release with those artifacts.

## Using CD to build executables

The CD workflow is triggered when any change is pushed to any tag. So, to trigger it,

1. Tag a commit with v\*.. pattern. For example : `git tag v0.1.1`
2. push the commit and tag : `git push && git push --tags`
3. The CD workflow will then run, generate artifacts and create draft release with those artifacts.
4. Go to `https://github.com/flojoy-io/flojoy-desktop/releases` to check the new draft release.

# License and Copyright

Flojoy is released under the [AGPLv3 license](https://www.gnu.org/licenses/agpl-3.0.en.html). This is a copy-left license in the GPL family of licenses. As with all [OSI approved licenses](https://opensource.org/licenses/alphabetical), there are no restrictions on what code licensed under AGPLv3 can be used for. However, the requirements for what must be shared publicly are greater than for licenses that are more commonly used in the Python ecosystem like [Apache-2](https://opensource.org/licenses/Apache-2.0), [MIT](https://opensource.org/licenses/MIT), and [BSD-3](https://opensource.org/licenses/BSD-3-Clause).

The Flojoy copyright is owned by On-Scence Creative, and contributors are asked to sign a Contributor License Agreement (based on the Oracle CLA) that grants the company the non-exclusive right to re-license the contribution in the future. For example, the project could be re-licensed to one of the more permissive licenses above, or it could be dual licensed with a commercial license as a means to support the project.

If you might be interested in using Flojoy in a context where the AGPL license is prohibitive, [please get in touch](mailto:jack.parmer@proton.me).

# Architecture diagram

![image](https://user-images.githubusercontent.com/1865834/228073014-4be8ef9c-8437-488c-a6c7-daf4ac18547a.png)
