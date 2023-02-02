FROM onscene/flojoy-base:latest
# Set the working directory in the container
WORKDIR /code

# Copy the requirements file to the container
COPY requirements.txt .

# Install the required packages
RUN pip install -r requirements.txt

COPY yaml-script.sh .

# Make yaml-script.sh executable
RUN chmod +x yaml-script.sh

# Run the yaml-script.sh file
RUN bash yaml-script.sh

# # # Run the yaml-script.sh file
# RUN sh yaml-script.sh

# Copy the rest of the application code to the container
COPY . /code/

# Run write_python_metadata.py file
RUN python3 write_python_metadata.py

# Run generate_manifest.py file
RUN python3 generate_manifest.py

# Make od-script.sh executable
RUN chmod +x od-script.sh

# Run the od-script.sh file
RUN bash od-script.sh

# # RUN CD PYTHON
WORKDIR /code/PYTHON

# Run the command to start the RQ worker
CMD ["rq", "worker", "flojoy", "--url", "redis://redis:6379"]
