FROM onscene/flojoy-base:latest
# Set the working directory in the container
WORKDIR /code

# Copy the requirements file to the container
COPY requirements.txt .

# Install the required packages
RUN pip install --no-cache-dir -r requirements.txt

COPY yaml-script.sh .

# Make yaml-script.sh executable
RUN chmod +x yaml-script.sh

# Run the yaml-script.sh file
RUN bash yaml-script.sh

# # # Run the yaml-script.sh file
# RUN sh yaml-script.sh

# Copy the rest of the application code to the container
COPY . /code/

# Run jsonify_funk.py file
RUN python3 jsonify_funk.py

# Run generate_manifest.py file
RUN python3 generate_manifest.py

# # RUN CD PYTHON
WORKDIR /code/PYTHON

# Expose port 6379 for the redis
EXPOSE 6379

# Run the command to start the RQ worker
CMD ["rq", "worker", "flojoy", "--url", "redis://redis:6379"]
