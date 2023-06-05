import os
import yaml

path = os.path

N_PATH = "nodes/"


def get_md_file_content(file_path: str, node_label: str, has_example: bool):
    file_dir, _ = path.split(file_path)
    nodes_index = file_dir.replace("\\", "/").find(N_PATH)
    node_path = file_dir[nodes_index:].replace("\\", "/").replace(N_PATH, "")
    node_file_path = (
        file_path[nodes_index:]
        .replace("\\", "/")
        .replace(N_PATH, "")
        .replace(".md", ".py")
    )
    appendix_folder_path = path.join(file_dir[nodes_index:], "appendix/").replace(
        "\\", "/"
    )

    common_section = """
[//]: # (Custom component imports)

import DocString from '@site/src/components/DocString';
import PythonCode from '@site/src/components/PythonCode';
import Parameters from '@site/src/components/Parameters';
import AppDisplay from '@site/src/components/AppDisplay';
import SectionBreak from '@site/src/components/SectionBreak';
import AppendixSection from '@site/src/components/AppendixSection';

[//]: # (TODO: Machine-generate this section)

import DocstringSource from '!!raw-loader!./a1-[autogen]/docstring.txt';
import PythonSource from '!!raw-loader!./a1-[autogen]/python_code.txt';
import ParametersSource from '!!raw-loader!./a1-[autogen]/parameters.yaml';

<DocString>{{DocstringSource}}</DocString>
<PythonCode GLink='{node_file_path}'>{{PythonSource}}</PythonCode>
<Parameters>{{ParametersSource}}</Parameters>

<SectionBreak />

    """.format(
        node_file_path=node_file_path
    )

    example_section_default = """

[//]: # (Examples)

## Examples

<AppDisplay 
  GLink='{node_path}'
  nodeLabel='{node_label}'>
</AppDisplay>

<SectionBreak />

    """.format(
        node_label=node_label, node_path=node_path
    )

    example_section = """

[//]: # (Examples)

## Examples

import Example1 from './examples/EX1/example.md';
import App1 from '!!raw-loader!./examples/EX1/app.txt';
import Data1 from '!!raw-loader!./examples/EX1/output.txt';

<AppDisplay 
    data={{Data1}}
    nodeLabel='{node_label}'>
    {{App1}}
</AppDisplay>

<Example1 />

<SectionBreak />
  
    """.format(
        node_label=node_label
    )

    appendix_section = """

[//]: # (Appendix)

import Notes from './appendix/notes.md';
import Hardware from './appendix/hardware.md';
import Media from './appendix/media.md';

## Appendix

<AppendixSection index={{0}} folderPath='{appendix_folder_path}'>{{Notes}}</AppendixSection>
<AppendixSection index={{1}} folderPath='{appendix_folder_path}'>{{Hardware}}</AppendixSection>
<AppendixSection index={{2}} folderPath='{appendix_folder_path}'>{{Media}}</AppendixSection>


""".format(
        appendix_folder_path=appendix_folder_path
    )

    return (
        common_section + example_section + appendix_section
        if has_example
        else common_section + example_section_default + appendix_section
    )


def write_file_recursive(file_path: str, content: str):
    # Split the path into directory and file name
    directory, _ = path.split(file_path)

    # Create directories recursively if they don't exist
    os.makedirs(directory, exist_ok=True)

    # Write the file
    with open(file_path, "w") as file:
        file.write(content)


def process_python_file(input_file_path: str, output_path: str, manifest_map: dict):
    with open(input_file_path, "r") as file:
        content = file.read()

    # Extract docstring
    docstring = extract_docstring(content)

    # Extract function code
    function_code = extract_function_code(content)
    autogen_dir_name = "a1-[autogen]"
    # Write docstring to a file
    docstring_file_path = path.join(output_path, autogen_dir_name, "docstring.txt")
    write_file_recursive(docstring_file_path, docstring)

    # Write function code to a file
    function_code_file_path = path.join(
        output_path, autogen_dir_name, "python_code.txt"
    )
    write_file_recursive(function_code_file_path, function_code)

    # write parameters
    input_dir, input_file_name = path.split(input_file_path)
    node_name = input_file_name.replace(".py", "")
    map_item = manifest_map.get(node_name, None)
    param_content = ""
    if map_item is not None:
        params: dict | None = map_item.get("parameters", None)
        if params is not None and len(params.keys()) > 0:
            param_content = yaml.dump(params)

    parameters_file_path = path.join(output_path, autogen_dir_name, "parameters.yaml")
    write_file_recursive(parameters_file_path, param_content)

    # appendix
    appendix_dir_path = path.join(output_path, "appendix")
    for f in ["hardware.md", "media.md", "notes.md"]:
        write_file_recursive(path.join(appendix_dir_path, f), "")

    # examples
    has_example = False
    example_dir_path = path.join(output_path, "examples", "EX1")
    for f in ["app.txt", "example.md", "output.txt"]:
        if path.exists(path.join(input_dir, f)):
            has_example = True
            with open(path.join(input_dir, f), "r") as file:
                c = file.read()
                file.close()
                write_file_recursive(path.join(example_dir_path, f), c)
        else:
            has_example = False
    # write md file with file name
    md_file_path = path.join(
        output_path, path.basename(input_file_path).replace(".py", ".md")
    )
    md_file_content = get_md_file_content(
        md_file_path, input_file_name.replace(".py", ""), has_example=has_example
    )
    write_file_recursive(md_file_path, md_file_content)


def extract_docstring(content: str):
    # Find the start and end of the docstring
    if '"""' in content:
        docstring_start = content.find('"""')
        docstring_end = content.find('"""', docstring_start + 3)

        # Extract the docstring
        docstring = content[docstring_start + 3 : docstring_end]
        return docstring
    return ""


def extract_function_code(content: str):
    # Find the start of the function code
    docstring = extract_docstring(content)
    content = content.replace(docstring, "").replace('"""', "")

    return content


nodes_dir = path.join("PYTHON", "nodes")
manifest_dir = path.join(nodes_dir, "MANIFEST")
docs_dir = path.abspath(path.join(path.pardir, "docs", "docs"))


def generate_manifest_map():
    manifest_map = {}
    for root, _, files in os.walk(manifest_dir):
        for file in files:
            allowed_file_ext = [".manifest.yaml", ".manifest.yml"]
            if any(ext in file for ext in allowed_file_ext):
                m_content = None
                with open(path.join(root, file), "r") as f:
                    read_file = f.read()
                    m_content = yaml.load(read_file, Loader=yaml.FullLoader)
                    f.close()
                manifest_map[m_content["COMMAND"][0]["key"]] = m_content["COMMAND"][0]
    return manifest_map


def write_doc_string():
    file_path = None
    manifest_map = generate_manifest_map()
    for root, _, files in os.walk(nodes_dir):
        for file in files:
            if (
                file.endswith(".py")
                and "test" not in file
                and file.split(".py")[0] != "__init__"
            ):
                path_index = root.index("nodes")
                path_from_second_dir = root[path_index:]
                docs_file_path = path.join(docs_dir, path_from_second_dir)
                file_path = path.join(root, file)
                process_python_file(file_path, docs_file_path, manifest_map)


write_doc_string()
