import os;
import sys;
from dotenv import set_key;
def write_to_env(value):
    try:
        open(os.getcwd()+'/.env', 'r')
    except:
        open(os.getcwd()+'/.env', 'w')
    env_file = os.getcwd()+'/.env'
    set_key(env_file, 'REACT_APP_BACKEND_PORT', str(value))

if __name__ == '__main__':
    value = sys.argv[1]
write_to_env(value)