# https://hub.docker.com/r/nikolaik/python-nodejs
# FROM --platform=linux/amd64 flojoy-app-base-image
FROM --platform=linux/amd64 flojoy-desktop-base-image

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .
RUN cd PYTHON
WORKDIR /PYTHON

CMD [ "rq", "worker", "--url", "redis://redis:6379", "flojoy" ]
# CMD [ "rq", "worker", "flojoy" ]