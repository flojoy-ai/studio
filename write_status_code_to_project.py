import yaml, json;

def write_to_json():
  destinations = ["src/STATUS_CODES.json", "worker-manager/STATUS_CODES.json"]
  for path in destinations:
    f=open(path, "w")
    f.write(json.dumps(yaml.safe_load(open("STATUS_CODES.yml", encoding='utf8').read()), indent=4))
    f.close();

write_to_json()