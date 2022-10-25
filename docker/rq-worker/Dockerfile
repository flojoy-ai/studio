# https://hub.docker.com/r/nikolaik/python-nodejs
FROM ubuntu
# ...
# stop some interactive prompts, also need "-yq" on apt-get
ENV DEBIAN_FRONTEND=noninteractive

# locale
RUN apt-get update -q > /dev/null && \
  apt-get install --no-install-recommends -yq apt-utils locales language-pack-en dialog > /dev/null && \
  locale-gen $LANGUAGE $LANG

# add sudo commmand
RUN apt-get -yq install sudo > /dev/null

# create and switch to a non-priviliged (but sudo-enabled) user, arbitrary name
RUN echo "nonprivuser ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
RUN useradd --no-log-init --home-dir /home/nonprivuser --create-home --shell /bin/bash nonprivuser && adduser nonprivuser sudo
USER nonprivuser
WORKDIR /home/nonprivuser

RUN sudo apt-get install --no-install-recommends -yq make gfortran 
FROM nikolaik/python-nodejs:latest

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .
RUN cd PYTHON
WORKDIR /PYTHON

CMD [ "rq", "worker", "--url", "redis://redis:6379", "flojoy" ]