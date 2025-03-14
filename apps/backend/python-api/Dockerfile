# Use an official Python runtime as a base image
FROM python:3.12

# Set the working directory inside the container
WORKDIR /app

# Install Poetry
RUN pip install poetry

# Copy the poetry configuration files
COPY pyproject.toml poetry.lock ./

RUN poetry install --no-root

# Copy the rest of the application
COPY . .

# Expose the port Flask runs on
EXPOSE 5000

# Set the working directory to src
WORKDIR /app/src

# Run the Flask application
CMD ["poetry", "run", "python", "app.py"]
