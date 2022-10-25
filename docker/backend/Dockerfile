# https://hub.docker.com/r/nikolaik/python-nodejs
FROM nikolaik/python-nodejs:latest
WORKDIR /code

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY package.json package.json
RUN npm install --legacy-peer-deps

COPY . .

RUN python -c 'import yaml, json; f=open("src/STATUS_CODES.json", "w"); f.write(json.dumps(yaml.safe_load(open("STATUS_CODES.yml").read()), indent=4)); f.close();'

# TODO investigate on these symlink commands later
# RUN echo 'create symlinks...'
# RUN ln STATUS_CODES.yml PYTHON/WATCH/
# RUN ln STATUS_CODES.yml src
RUN python jsonify_funk.py
RUN python generate_manifest.py

EXPOSE 5000
CMD ["node", "server.js"]

