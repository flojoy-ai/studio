# https://hub.docker.com/r/nikolaik/python-nodejs
FROM nikolaik/python-nodejs:latest
WORKDIR /code

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY package.json package.json
RUN npm install

COPY . .

RUN python -c 'import yaml, json; f=open("src/STATUS_CODES.json", "w"); f.write(json.dumps(yaml.safe_load(open("STATUS_CODES.yml").read()), indent=4)); f.close();'

RUN cd PYTHON 
CMD [ "rq", "worker", "-u", "redis://redis:6379", "flojoy" ]