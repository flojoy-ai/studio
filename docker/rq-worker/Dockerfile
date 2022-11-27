# https://hub.docker.com/r/nikolaik/python-nodejs
FROM nikolaik/python-nodejs:latest

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .
RUN cd PYTHON
WORKDIR /PYTHON

CMD [ "rq", "worker", "--url", "redis://redis:6379", "flojoy" ]
# CMD [ "rq", "worker", "flojoy" ]