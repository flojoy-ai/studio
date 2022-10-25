# https://hub.docker.com/r/nikolaik/python-nodejs
FROM ubuntu
# ...
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && \
    apt-get -y install gcc mono-mcs && \
    rm -rf /var/lib/apt/lists/*
FROM nikolaik/python-nodejs:latest

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .
RUN cd PYTHON
WORKDIR /PYTHON

CMD [ "rq", "worker", "--url", "redis://redis:6379", "flojoy" ]