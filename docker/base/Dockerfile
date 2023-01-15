# https://hub.docker.com/r/nikolaik/python-nodejs
FROM nikolaik/python-nodejs:latest

# For Django hot reload
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /code

#Install the requirements
COPY requirements.txt /code/
RUN pip install -r requirements.txt

COPY . /code/
