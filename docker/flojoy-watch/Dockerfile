# https://hub.docker.com/r/nikolaik/python-nodejs
# FROM --platform=linux/amd64 flojoy-app-base-image
# FROM onscene/flojoy-base:latest
FROM syridit/flojoy-development:latest

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .
WORKDIR '/'

RUN sh od-script.sh

CMD [ "rq", "worker", "--url", "redis://redis:6379", "flojoy-watch" ]