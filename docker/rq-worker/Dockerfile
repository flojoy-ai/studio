# https://hub.docker.com/r/nikolaik/python-nodejs
FROM ubuntu
# ...
ENV DEBIAN_FRONTEND noninteractive
RUN sudo apt-get install --no-install-recommends -yq make gfortran libcoarrays-dev libopenmpi-dev open-coarrays-bin > /dev/null && \
  sudo apt-get clean -q
FROM nikolaik/python-nodejs:latest

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .
RUN cd PYTHON
WORKDIR /PYTHON

CMD [ "rq", "worker", "--url", "redis://redis:6379", "flojoy" ]