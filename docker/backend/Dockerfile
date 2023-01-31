# https://hub.docker.com/r/nikolaik/python-nodejs

# FROM onscene/flojoy-base:latest
FROM syridit/flojoy-development:latest

WORKDIR /code

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . /code/

RUN python3 -c 'import yaml, json; f=open("src/STATUS_CODES.json", "w"); f.write(json.dumps(yaml.safe_load(open("STATUS_CODES.yml").read()), indent=4)); f.close();'
RUN python3 jsonify_funk.py
RUN python3 generate_manifest.py
RUN sh od-script.sh

EXPOSE 8000

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]