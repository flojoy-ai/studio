FROM python:3.10.12
# How to build and run this file immediately (Use a different tag name, probably)
# DOCKER_BUILDKIT=1 docker build -t marvinirwin/studio -f Dockerfile .
# How to run it
# docker run -it -p 8080:8080 marvinirwin/studio
# Then head to http://localhost:8080
# How to push the built image to docker hub so that all tasks can use it
# docker push marvinirwin/studio

LABEL org.opencontainers.image.source https://github.com/flojoy-ai/rc

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get install -y git && \
    apt-get install -y libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libgtk-3-0 libasound2 && \
    apt-get install -y dbus && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# This is the current best way to install node 18 using the aptitude package manager
RUN set -uex; \
    apt-get install -y ca-certificates curl gnupg; \
    mkdir -p /etc/apt/keyrings; \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
     | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg; \
    NODE_MAJOR=18; \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" \
     > /etc/apt/sources.list.d/nodesource.list; \
    apt-get update; \
    apt-get install nodejs -y;
RUN npm install -g pnpm

WORKDIR /studio

# Copy dependency files first to avoid re-installing dependencies when only these files change
# Makes rebuilding the container _much faster
COPY package.json package.json
COPY bauhaus bauhaus

# Install Node dependencies
RUN pnpm install

COPY requirements.txt requirements.txt

# Install Python dependencies
RUN pip install --upgrade pip \
    && pip install -r requirements.txt --no-cache-dir \
    && pip install qcodes

# Now copy the rest of the files in studio
COPY . .

WORKDIR /
# Clone docs in order to extract the example project configurations into studio, 
# so that studio can resolve projects with just a reference
ARG DOCS_BRANCH=main
RUN git clone --depth 1 --branch $DOCS_BRANCH https://github.com/flojoy-io/docs.git /docs

RUN chmod +x /studio/scripts/populate-example-projects.sh 
RUN /studio/scripts/populate-example-projects.sh --docsDirectory /docs/docs --outputFile /studio/src/data/docs-example-apps.ts
WORKDIR /studio

ARG REMOTE_STUDIO_PORT
ENV REMOTE_STUDIO_PORT=$REMOTE_STUDIO_PORT
RUN DEPLOY_ENV=remote VITE_IS_CLOUD_DEMO=true npx vite build

CMD ["npm", "run", "start-remote-project"]