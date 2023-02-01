FROM onscene/flojoy-base:latest

# Set the working directory in the container
WORKDIR /code

# Copy the requirements file to the container
COPY requirements.txt .

# Install the required packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code to the container
COPY . /code/

RUN python3 -c 'import yaml, json; f=open("src/STATUS_CODES.json", "w"); f.write(json.dumps(yaml.safe_load(open("STATUS_CODES.yml").read()), indent=4)); f.close();'
RUN python3 write_python_metadata.py
RUN python3 generate_manifest.py
RUN sh od-script.sh

# Expose port 8000 for the Django application
EXPOSE 8000

# Run the command to start the Django application
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
