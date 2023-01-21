FROM onscene/flojoy-base:latest

# Set the working directory in the container
WORKDIR /code

# Copy the requirements file to the container
COPY requirements.txt .

# Install the required packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code to the container
COPY . /code/

# Expose port 6379 for the redis
EXPOSE 6379

# Run the command to start the RQ worker
CMD ["rq", "worker", "flojoy-watch", "--url", "redis://redis:6379"]
