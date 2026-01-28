# Environment

A Python package for managing environment variables and configuration settings.

## Features

- **Config Management**: Load and manage configuration from various sources
- **Environment Variables**: Easy-to-use utilities for working with environment variables
- **Type-Safe**: Fully typed for better IDE support and type checking

## Installation

### From Source

```bash
# Clone the repository
git clone https://github.com/bbjjerr/environment.git
cd environment

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install the package
pip install -e .

# Or install with development dependencies
pip install -e ".[dev]"
```

## Usage

### Basic Config Management

```python
from environment import Config

# Create a config object
config = Config()

# Set values
config.set("api_url", "https://api.example.com")
config.set("timeout", 30)

# Get values
api_url = config.get("api_url")
timeout = config.get("timeout", default=60)

# Load from environment variables
config.from_env("database_url", "DATABASE_URL", default="sqlite:///db.sqlite3")
```

### Environment Variable Management

```python
from environment import EnvironmentManager

# Get environment variables
db_host = EnvironmentManager.get("DB_HOST", default="localhost")

# Set environment variables
EnvironmentManager.set("API_KEY", "your-api-key")

# Load multiple variables from a dictionary
env_vars = {
    "DEBUG": "True",
    "LOG_LEVEL": "INFO"
}
EnvironmentManager.load_from_dict(env_vars)
```

## Development

### Setup Development Environment

```bash
# Install development dependencies
pip install -r requirements.txt

# Or install the package with dev extras
pip install -e ".[dev]"
```

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=environment --cov-report=html

# Run specific test file
pytest tests/test_config.py
```

### Code Quality

```bash
# Format code
black src/ tests/

# Lint code
flake8 src/ tests/

# Type checking
mypy src/
```

## Project Structure

```
environment/
├── src/
│   └── environment/
│       ├── __init__.py
│       ├── config.py
│       └── env_manager.py
├── tests/
│   ├── __init__.py
│   ├── test_config.py
│   └── test_env_manager.py
├── .gitignore
├── README.md
├── requirements.txt
└── setup.py
```

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
