import os;
import sys;

script_path = ''

for path in sys.path:
    if 'site-packages' in path:
        parent_dir = os.path.dirname(path)
        if os.path.isdir(os.path.join(parent_dir, 'Scripts')):
            script_path = os.path.join(parent_dir, 'Scripts')

if script_path:
  print(script_path)
else:
  raise ValueError("Script path not found!")

