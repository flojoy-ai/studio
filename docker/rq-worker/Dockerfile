# https://hub.docker.com/r/nikolaik/python-nodejs
# FROM --platform=linux/amd64 flojoy-app-base-image
FROM onscene/flojoy-base:latest

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt


COPY . .

RUN sh yaml-script.sh

RUN cd PYTHON
WORKDIR /PYTHON

CMD [ "rq", "worker", "--url", "redis://redis:6379", "flojoy" ]
# CMD [ "rq", "worker", "flojoy" ]