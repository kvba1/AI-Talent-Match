# Use an official Python runtime as a parent image
FROM python:3.12

# Set the working directory in the container
WORKDIR /app

# Set Flask app environment variable
ENV FLASK_APP=app.py

# Copy the requirements file to the working directory
COPY requirements.txt ./

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code to the working directory
COPY . .

# Make port 5001 available to the world outside this container
EXPOSE 5001

# Run app.py when the container launches
CMD ["python", "app.py"]
