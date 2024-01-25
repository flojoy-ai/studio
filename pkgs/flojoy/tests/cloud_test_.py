import pytest
from flojoy.cloud import Dataframe, FlojoyCloud, SystemModelPart, Boolean
from typing import Tuple

WorkspaceInfo = Tuple[FlojoyCloud, str]

# Set all of these variables to run the tests
# This should be run in a completely fresh/empty workspace.
WORKSPACE_ID = ""
API_URL = ""
WORKSPACE_ID = ""

runnable = WORKSPACE_ID != "" and API_URL != "" and WORKSPACE_ID != ""


@pytest.fixture
def workspace():
    client = FlojoyCloud(workspace_secret=WORKSPACE_ID, api_url=API_URL)
    return client, WORKSPACE_ID


@pytest.fixture
def model_teardown(workspace: WorkspaceInfo):
    yield
    client, workspace_id = workspace
    for model in client.get_all_system_models(workspace_id):
        client.delete_model(model.id)
    for model in client.get_all_device_models(workspace_id):
        client.delete_model(model.id)


@pytest.mark.skipif(not runnable, reason="Need environment setup")
def test_model_routes(workspace: WorkspaceInfo, model_teardown):
    client, workspace_id = workspace
    device_model = client.create_device_model(
        name="test-device-model", workspace_id=workspace_id
    )
    device_model2 = client.create_device_model(
        name="test-device-model2", workspace_id=workspace_id
    )
    system_model = client.create_system_model(
        name="test-system-model",
        workspace_id=workspace_id,
        parts=[
            SystemModelPart(modelId=device_model.id, count=2),
            SystemModelPart(modelId=device_model2.id, count=1),
        ],
    )

    models = client.get_all_models(workspace_id=workspace_id)
    assert len(models) == 3

    models = [model.id for model in models]

    assert device_model.id in models
    assert device_model2.id in models
    assert system_model.id in models

    device_models = client.get_all_device_models(workspace_id=workspace_id)
    assert len(device_models) == 2

    system_models = client.get_all_system_models(workspace_id=workspace_id)
    assert len(system_models) == 1

    client.delete_model(system_model.id)

    system_models = client.get_all_system_models(workspace_id=workspace_id)
    assert len(system_models) == 0

    client.delete_model(device_model.id)

    device_models = client.get_all_device_models(workspace_id=workspace_id)
    assert len(device_models) == 1

    client.delete_model(device_model2.id)

    device_models = client.get_all_device_models(workspace_id=workspace_id)
    assert len(device_models) == 0

    models = client.get_all_models(workspace_id=workspace_id)
    assert len(models) == 0


@pytest.fixture
def project_setup(workspace: WorkspaceInfo):
    client, workspace_id = workspace
    model = client.create_device_model("test-model", workspace_id)
    yield model
    for project in client.get_all_projects(workspace_id):
        client.delete_project(project.id)
    client.delete_model(model.id)


@pytest.mark.skipif(not runnable, reason="Need environment setup")
def test_project_routes(workspace: WorkspaceInfo, project_setup):
    client, workspace_id = workspace
    model = project_setup

    project1 = client.create_project(
        name="test-project1", model_id=model.id, workspace_id=workspace_id
    )
    get_result = client.get_project_by_id(project1.id)

    assert get_result.id == project1.id
    assert get_result.name == project1.name

    project2 = client.create_project(
        name="test-project2", model_id=model.id, workspace_id=workspace_id
    )

    workspace_projects = sorted(
        client.get_all_projects(workspace_id),
        key=lambda x: x.created_at,
    )
    assert [project1, project2] == workspace_projects

    get_result = client.get_project_by_id(project2.id)

    assert get_result.id == project2.id
    assert get_result.name == "test-project2"

    client.update_project(name="test-project2-updated", project_id=project2.id)

    get_result = client.get_project_by_id(project2.id)

    assert get_result.id == project2.id
    assert get_result.name == "test-project2-updated"

    client.delete_project(project1.id)
    client.delete_project(project2.id)

    workspace_projects = client.get_all_projects(workspace_id)
    assert workspace_projects == []


@pytest.fixture
def hardware_setup(workspace: WorkspaceInfo):
    client, workspace_id = workspace
    device_model = client.create_device_model("test-device-model", workspace_id)
    system_model = client.create_system_model(
        "test-system-model",
        workspace_id,
        parts=[SystemModelPart(modelId=device_model.id, count=2)],
    )
    device_project = client.create_project(
        "device-project", device_model.id, workspace_id
    )
    system_project = client.create_project(
        "system-project", system_model.id, workspace_id
    )

    yield device_model, system_model, device_project, system_project

    client.delete_project(device_project.id)
    client.delete_project(system_project.id)

    for hardware in client.get_all_hardware(workspace_id):
        client.delete_hardware_by_id(hardware.id)

    client.delete_model(system_model.id)
    client.delete_model(device_model.id)


@pytest.mark.skipif(not runnable, reason="Need environment setup")
def test_hardware_routes(workspace: WorkspaceInfo, hardware_setup):
    client, workspace_id = workspace
    device_model, system_model, device_project, system_project = hardware_setup

    # Create some devices
    device1 = client.create_device(
        workspace_id=workspace_id,
        name="test-device1",
        model_id=device_model.id,
    )

    res = client.get_hardware_by_id(device1.id)
    assert res.id == device1.id
    assert res.name == device1.name

    device2 = client.create_device(
        workspace_id=workspace_id,
        name="test-device2",
        model_id=device_model.id,
    )

    res = client.get_hardware_by_id(device2.id)
    assert res.id == device2.id
    assert res.name == device2.name

    # Create a system
    system = client.create_system(
        workspace_id=workspace_id,
        name="test-system",
        model_id=system_model.id,
        device_ids=[device1.id, device2.id],
    )

    res = client.get_hardware_by_id(system.id)
    assert res.id == system.id
    assert res.name == system.name

    # Get all hardware
    hardware = client.get_all_hardware(workspace_id)
    assert len(hardware) == 3

    # Get all devices
    devices = client.get_all_devices(workspace_id)
    assert len(devices) == 2

    devices = client.get_all_devices(workspace_id, only_available=True)
    assert len(devices) == 0

    # Get all systems
    systems = client.get_all_systems(workspace_id)
    assert len(systems) == 1

    # Add to project
    client.add_hardware_to_project(
        project_id=device_project.id,
        hardware_id=device1.id,
    )

    devices = client.get_all_devices(workspace_id, project_id=device_project.id)
    assert len(devices) == 1

    # Then remove and check again
    client.remove_hardware_from_project(
        project_id=device_project.id,
        hardware_id=device1.id,
    )

    devices = client.get_all_devices(workspace_id, project_id=device_project.id)
    assert len(devices) == 0

    # Add system to project
    systems = client.get_all_systems(workspace_id, project_id=system_project.id)
    assert len(systems) == 0

    client.add_hardware_to_project(
        project_id=system_project.id,
        hardware_id=system.id,
    )

    systems = client.get_all_systems(workspace_id, project_id=system_project.id)
    assert len(systems) == 1

    client.delete_hardware_by_id(system.id)
    hardware = client.get_all_hardware(workspace_id)
    assert len(hardware) == 2
    systems = client.get_all_systems(workspace_id)
    assert len(systems) == 0

    client.delete_hardware_by_id(device1.id)
    devices = client.get_all_devices(workspace_id)
    assert len(devices) == 1
    client.delete_hardware_by_id(device2.id)
    devices = client.get_all_devices(workspace_id)
    assert len(devices) == 0


@pytest.fixture
def test_setup(workspace: WorkspaceInfo):
    client, workspace_id = workspace
    model = client.create_device_model("model", workspace_id)
    project = client.create_project("project", model.id, workspace_id)

    yield project

    for test in client.get_all_tests_by_project_id(project.id):
        client.delete_test(test.id)

    client.delete_project(project.id)
    client.delete_model(model.id)


@pytest.mark.skipif(not runnable, reason="Need environment setup")
def test_test_routes(workspace: WorkspaceInfo, test_setup):
    client, _ = workspace
    project = test_setup

    test1 = client.create_test(
        name="test1", project_id=project.id, measurement_type="boolean"
    )

    res = client.get_test_by_id(test1.id)
    assert res.name == test1.name
    assert res.id == test1.id

    test2 = client.create_test(
        name="test2", project_id=project.id, measurement_type="dataframe"
    )

    res = client.get_test_by_id(test2.id)
    assert res.name == test2.name
    assert res.id == test2.id

    client.update_test(name="test2-updated", test_id=test2.id)
    res = client.get_test_by_id(test2.id)
    assert res.name == "test2-updated"

    tests = client.get_all_tests_by_project_id(project.id)
    assert len(tests) == 2

    client.delete_test(test1.id)

    tests = client.get_all_tests_by_project_id(project.id)
    assert len(tests) == 1

    client.delete_test(test2.id)

    tests = client.get_all_tests_by_project_id(project.id)
    assert len(tests) == 0


@pytest.fixture
def measurement_setup(workspace: WorkspaceInfo):
    client, workspace_id = workspace
    model = client.create_device_model("model", workspace_id)
    project = client.create_project("project", model.id, workspace_id)
    device = client.create_device(
        workspace_id, "device", model.id, project_id=project.id
    )

    bool_test = client.create_test(
        "boolean-test", project.id, measurement_type="boolean"
    )
    df_test = client.create_test(
        "dataframe-test", project.id, measurement_type="dataframe"
    )

    yield bool_test, df_test, device

    for measurement in client.get_all_measurements_by_test_id(bool_test.id):
        client.delete_measurement_by_id(measurement.id)
    for measurement in client.get_all_measurements_by_test_id(df_test.id):
        client.delete_measurement_by_id(measurement.id)

    client.delete_test(bool_test.id)
    client.delete_test(df_test.id)

    client.delete_project(project.id)
    client.delete_hardware_by_id(device.id)
    client.delete_model(model.id)


@pytest.mark.skipif(not runnable, reason="Need environment setup")
def test_measurement_routes(workspace: WorkspaceInfo, measurement_setup):
    client, workspace_id = workspace
    bool_test, df_test, device = measurement_setup

    client.upload(
        data=Boolean(passed=True),
        test_id=bool_test.id,
        hardware_id=device.id,
        name="bool",
    )

    client.upload(
        data=Dataframe(
            dataframe={"col1": [1, 2, 3], "col2": [4, 5, 6], "col3": [7, 8, 9]}
        ),
        test_id=df_test.id,
        hardware_id=device.id,
        name="df",
    )

    bool_measurements = client.get_all_measurements_by_test_id(bool_test.id)
    assert len(bool_measurements) == 1

    df_measurements = client.get_all_measurements_by_test_id(df_test.id)
    assert len(df_measurements) == 1

    bool_meas = client.get_measurement_by_id(bool_measurements[0].id)
    assert bool_meas.name == "bool"
    assert bool_meas.data["passed"]
    assert bool_meas.id == bool_measurements[0].id

    df_meas = client.get_measurement_by_id(df_measurements[0].id)
    assert df_meas.name == "df"

    client.delete_measurement_by_id(bool_meas.id)

    bool_measurements = client.get_all_measurements_by_test_id(bool_test.id)
    assert len(bool_measurements) == 0

    client.delete_measurement_by_id(df_meas.id)

    df_measurements = client.get_all_measurements_by_test_id(df_test.id)
    assert len(df_measurements) == 0
