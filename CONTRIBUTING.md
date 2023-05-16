# Contributing guidelines

## Git Notes

**1. Cloning** - Use `--recursive` argument when cloning the repository to add all the submodules to the project. For example: `git clone --recursive https://github.com/flojoy-io/studio.git`

**2. Branch Switching** - When switching from one branch to another run following git command to update all the submodules following `git checkout <branch name>` command:
`    git submodule update --init --recursive`

**3. Commiting & Pushing** - Before pushing your changes to [Flojoy Studio](https://github.com/flojoy-io/studio) repo, make sure to CD into all the submodule directories and make PR's to these repo by creating branch and pushing new changes.

## How to contribute code

### Pull Request Workflow

**1. New PR** - As a contributor, you submit a New PR on GitHub. Before submitting your PR make sure to test your changes and the system is working. PR body should include description of changes introduced, and the testing steps you have undertaken to test those.

**2. Review** - We inspect
every incoming PR. At this stage we check if the PR is valid and meets certain quality
requirements. - For example: we check if PR has sufficient
description, if applicable unit tests are added, passed CI, no merge-conflics, etc. If the PR passes all the quality checks then reviewer (person familiar with the
code/functionality) reviews the changes. If all looks good, reviewer would approve the PR. Otherwise changes will be requested. - You make the change and
submit for review again. - This cycle repeats itself till the PR gets
approved.

**3. Approved** - Once the PR is approved, We will merge it into `develop` branch, which will eventually end-up in `main` branch.

---

### How to create a custom node

1.  **Node Function** - A python function for the node. Create a new script file and place it in right category folder in `/PYTHON/nodes/` directory. The script file name should be the node name in uppercase.
    import `@flojoy` decorator and `DataContainer` class from `flojoy` package :

    ```bash
        from flojoy import flojoy, DataContainer
    ```

    Decorate your function with `@flojoy` like below:

    ```bash
        @flojoy
        def NODE_NAME(v, params): // use Node name as function name in uppercase
    ```

    - `v`: This will receive the output of all the incoming nodes and this will be in `list` format.
    - `params:` A node can have some parameters that can change its behavior. These parameters can be modified in CTRL panel. You have to declare them in manifest file (see below). This will be in `dict` format.

    Your node function should return an object of `DataContainer` class.

    **DataContainer:** A python class that can represent these different types of data objects:

    - 'grayscale'
    - 'matrix'
    - 'dataframe'
    - 'image'
    - 'ordered_pair'
    - 'ordered_triple'
    - 'scalar'
    - (see [https://github.com/flojoy-io/flojoy-python/blob/develop/flojoy/flojoy_python.py#L51](https://github.com/flojoy-io/python/blob/feature/nested-loop/flojoy/flojoy_python.py#L44))

    Here is an example of how to return `DataContainer` object:

    ```code
        x = 10
        y = 15
        return DataContainer(type='ordered_pair', x=x, y=y)
        # {'type': 'ordered_pair', 'x': [10], 'y':[15] } // DataContainer output
    ```

2.  **Manifest File** - Write a manifest file for the node in yaml format in `/PYTHON/nodes/MANIFEST` folder. The name of the file should contain `.manifest.yaml` suffix following the node name. Here is an example of manifest file of `SINE WAVE` node `sine.manifest.yaml`.

    ```yaml
    COMMAND:
      - {
          name: Sine Wave,
          key: SINE,
          type: SIMULATION,
          parameters:
            {
              frequency: { type: float, default: 1 },
              offset: { type: float, default: 0 },
              amplitude: { type: float, default: 1 },
              waveform:
                {
                  type: select,
                  options: [sine, square, triangle, sawtooth],
                  default: sine,
                },
            },
        }
    ```

    **COMMAND:** `COMMAND` is a list of object. Where each object contains:

    `name:` Name of the node.

    `key:` A string to identify the node uniquely among all nodes.

    `type:` A key of sub-category from `COMMAND_MANIFEST.ts` in [`src/feature/flow_chart_panel/manifest/COMMAND_MANIFEST.ts`](https://github.com/flojoy-io/flojoy-desktop/blob/main/src/feature/flow_chart_panel/manifest/COMMANDS_MANIFEST.ts)

    `parameters:` Parameters which the node expects in it's function's parameter `params`. Ctrl panel uses this manifest to populate UI where users can modify these parameter values. It's an Object, where each key is a parameter name and value is an object of:

    - `type:` Type of parameter value should be set to one of `integer`, `string`, `float` or `select`. If you want to add a new type discuss it with the team.
    - `default:` Default value of the parameter.
    - `options:` Array of options, each option should be of the same type as declared.

3.  **New Category** - If your node belongs to a category which doesn't have a corresponding folder in `PYTHON/nodes` directory.

    - Create a folder with category name in uppercase inside `PYTHON/nodes/` directory.
    - Import all files containing that folder in `watch.py` file in `PYTHON/WATCH/watch.py` directory like below:

    ```code
        from nodes.CONDITIONALS import *
    ```

    - Register that category under proper parent category in `src/feature/flow_chart_panel/manifest/COMMANT_MANIFEST.ts` file in `section` array variable with category name and key.
    - In `write_python_metadata.py` file located in root directory, add category folder name in `dirs` list variable.

4.  Add function to `__init__.py` within category folder. For example, here is `__init__.py` in the Simulations folder:

    ```py
        __all__ = ["SINE", "RAND", "CONSTANT", "LINSPACE", "TIMESERIES"]
    ```

    Each category function must be listed in their respective `__init__.py` file.

5.  Run `python3 write_python_metadata.py` in the root folder.

6.  Run `python3 generate_manifest.py` in the root folder.

7.  **Node Styling** - To be added.

---

---

### How to run automated test in local

Run cypress e2e tests:

```bash
    npm run test
```

You can also create an example app with your custom node and generate e2e test for it. To do so:

1. Save your example app in `public/example-apps` folder.
2. Add your app to cypress e2e config file in `cypress/e2e/config_example_app_test.json` with file location from `public/example-apps` and a test key as follows:
   ```json
   [
     { "title": "butterworth/butterworth.txt", "test_id": "withdefaultParam" },
     { "title": "FIR/FIR.txt", "test_id": "withdefaultParam" }
     // add your example app here
   ]
   ```
   _note: There can be multiple tests for one example app, in that case their test id must be different from one another._
3. You can also test your app with your desired parameter values for each node. To do so, you have to add another field called `nodes` which will be an array of object. Here is an example for [`butterworth.txt`](./public/example-apps/butterworth/butterworth.txt):
   ```json
   [
     {
       "title": "butterworth/butterworth.txt",
       "test_id": "with_default_param"
     },
     { "title": "FIR/FIR.txt", "test_id": "with_default_param" },
     {
       "title": "butterworth/butterworth.txt",
       "test_id": "with_custom_param",
       "nodes": [
         {
           "id": "LINSPACE-bdd46aa2-4485-4c36-be42-a1746599a92d", // id of the node to use custom parameter value
           "params": {
             "start": 300
           }
         }
       ]
     }
   ]
   ```
