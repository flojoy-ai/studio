import os;
import sys;

script_path = ''

def get_parent_with_scripts(path):
    while path != os.path.dirname(path):  # stop at root directory
        if "Scripts" in os.listdir(path):
            return os.path.join(path, 'Scripts')
        path = os.path.dirname(path)
    return None
      
      
for path in sys.path:
    if 'site-packages' in path:
        has_script = get_parent_with_scripts(path)
        if has_script:
          script_path = has_script

if script_path:
  print(script_path)
else:
  raise ValueError("Script path not found!")

