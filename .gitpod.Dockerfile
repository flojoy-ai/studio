FROM gitpod/workspace-fullRUN sudo apt-get update# Install Cypress-base dependencies
RUN sudo apt-get install -y \
    libgtk2.0-0 \
    libgtk-3-0RUN sudo DEBIAN_FRONTEND=noninteractive apt-get install -yq \
    libgbm-dev \
    libnotify-devRUN sudo apt-get install -y \
    libgconf-2-4 \
    libnss3 \
    libxss1RUN sudo apt-get install -y \
    libasound2 \
    libxtst6 \
    xauth \
    xvfb