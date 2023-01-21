FROM onscene/flojoy-base:latest

# Set the working directory in the container
WORKDIR /code

# Copy the requirements file to the container
COPY requirements.txt .

# Install the required packages
RUN pip install -r requirements.txt

# Copy the rest of the application code to the container
COPY . /code/

# Run the command to start the RQ worker
CMD ["rq", "worker", "flojoy-watch", "--url", "redis://redis:6379"]
