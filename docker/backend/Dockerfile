FROM onscene/flojoy-base:latest

# Set the working directory in the container
WORKDIR /code

# Copy the requirements file to the container
COPY requirements.txt .

# Install the required packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code to the container
COPY . /code/

# Expose port 8000 for the Django application
EXPOSE 8000

# Run the command to start the Django application
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
