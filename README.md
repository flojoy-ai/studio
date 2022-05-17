# Flojoy

<img width="150" alt="image" src="https://user-images.githubusercontent.com/1865834/167226835-89577df4-0e92-4e6e-9cfb-769a8eb80683.png">

## Joyful Visual Scripting for Python

Flojoy is an open-source desktop and web app for Python scripting that welcomes but does not require Python coding. Using a simple drag-drop interface, pre-written Python scripts are wired together as nodes in a flow chart. These flow charts represent simple but powerful Python scripts that can be created by non-coders, then deployed as apps or APIs for ETL, DAQ, AI, CI, data visualization, and simulation. Advanced Python practioners can add their own custom Python scripts as nodes in the flow chart, which can be published and reused by other Flojoy users.

## Screenshots

#### A Visual Python Script (VPS) that generates a sine wave, adds noise, and visualizes the results in 2 charts
<img width="743" alt="image" src="https://user-images.githubusercontent.com/1865834/167227351-54b2bb39-f8e6-48c5-b2ef-efd36571ae02.png">

#### Light mode - the same VPS in Flojoy's light mode 
<img width="751" alt="image" src="https://user-images.githubusercontent.com/1865834/167229171-086b3d58-a6dc-4e87-8b7b-30c99cde7317.png">

#### Control panel for building apps the control and visualize node parameters and outputs
<img width="702" alt="image" src="https://user-images.githubusercontent.com/1865834/167229214-941a16d8-7320-4466-be5a-4a6282ebfeb1.png">

#### Python code for the SINE node in the above VPS
<img width="714" alt="image" src="https://user-images.githubusercontent.com/1865834/167229258-de7bdcf4-8df9-42ac-a1c0-c8f8afe6f9c7.png">


## Prior work of note

- [Ryven - Flow-based visual scripting for Python](https://ryven.org/) - Heroic open-source effort by a single grad student
- [Datablocks](https://datablocks.pro/) - Same idea as Flojoy, but code blocks are JavaScript instead of Python
- Apache Airflow. Famous project with some nice DAG visualizers, but requires coding and significant learning investment. Flojoy aspires to enable non-coders with similar Python-based ETL capabilities within minutes of first using th app.
- Alteryx - de facto commercial product for visual ETL scripting
- LabVIEW - de facto commercial product for visual DAQ scripting
- AWS Step Function - AWS visual scripting product for ETL and AI
- Azure ML Studio - Azure visual scripting product for AI and ML
- [NodeRed](https://nodered.org/) - "Node-RED is a programming tool for wiring together hardware devices, APIs and online services"

## Architecture

1. Flojoy is a single-page React app that hinges on the https://reactflow.dev/ open-source library. Creating the Flow Chart and control dashboard is done entirely in JavaScript (React), without any interaction with a backend service.
3. React Flow serializes flow chart layout and metadata as JSON. When an app user clicks the "Run Visual Python Script" button, this JSON payload is sent to a Node (Express) server ([server.js](server.js)) through the `/wfc` endpoint ("Write Flow Chart"). Express listens on port 5000, so that `create-react-app` can listen on port 3000 for development purposes (hot reloading). The flow chart object is saved in local storage for convenient access throughout the app. 
4. ([server.js](server.js)) writes the flow chart JSON object to Redis memory, then calls a Python script ([watch.py](https://github.com/jackparmer/flojoy/tree/main/PYTHON/WATCH) that pulls the flowchart object from Redis and munges it into a `networkx` object. (There's a Jupyter notebook in the PYTHON folder that messily illustrates transmorgifying React Flow JSON into a `networkx` object).
5. As a `networkx` object, it's easy to perform a topological sort to determine the order of Python script execution. The Python scripts corresponding to the React Flow nodes are in the [FUNCTIONS](https://github.com/jackparmer/flojoy/tree/main/PYTHON/FUNCTIONS) folder.
6. In topological order, the Python functions are queued as jobs in Redis using the RQ (Redis Queue) library - a lighter weight alternative to Celery. As the jobs are queued, attention is paid to which job inputs depend on other job outputs. RQ makes this easy with its `depends_on` kwarg (in the `enqueue` function).
7. When Python jobs finish, watch.py sets a flag in Redis. The React app polls the Express server (`server.js`) once per second to see if this flag is set. If it is, then `server.js` resets the flag and returns the script results to the frontend where they are visualized in the control panel, logs tab, and flow chart node modals.

## Running locally (Mac/Linux only)

TODO: Add a requirements.txt for Python packages

1. Clone the repo
2. Make sure that you have Python, Redis, and Node already installed
3. `cd` into the project root and run `$ sh mac_startup.sh` (Flojoy does not run on Windows yet)

## Major things that are missing or do not work 💀

- [ ] Currently the Control Panel does not do anything. You can create a layout of input and output controls, which is cached in local storage, but these  control parameters are not yet sent to the backend and integrated with running Python jobs. When the Flojoy user changes an app parameter through the Control Panel dashboard (such as with a slider), the script should immediately rerun and display the latest results in the Control Panel.

- [ ] There are no tests or CI

- [ ] You cannot currently save a flowchart and Control Panel state as a file, then reload this state later by opening the file. Both the flow chart and control panel serialize as JSON, so the file could simply be these 2 stringified JSON objects in a YAML file with a some metadata in the header. `.vps` as a file extension (Visual Python Script)? 

- [ ] The app doesn't work on Windows

## Minor things that might be nice 🎀

- [ ] Flojoy currently uses an interval in App.js to ping the backend every second with an HTTP request and check the server state (such as whether the job queue is finished). This would be ideally suited for websockets and the `ws` library, allowing real-time feedback on which Python jobs are running and pushing the result when complete. 

- [ ] It would be nice to have a "Load an example" menu item in the flow chart tab, with a showcase of simple and fun VPS examples for AI, DAQ, image processing, simulation, etc.

- [ ] It would be nice to host a free serverless version of this app on Netlify with GitHub/Google login, so that curious Internet visitors can try the app without downloading it.

- [ ] Better Desktp packaging, such as with Electron. 
