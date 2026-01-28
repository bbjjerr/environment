# Examples

This directory contains example scripts demonstrating the usage of the environment package.

## Running the Examples

Make sure you have installed the package first:

```bash
# From the repository root
pip install -e .
```

### demo.py

A comprehensive demonstration of the Config and EnvironmentManager classes:

```bash
python examples/demo.py
```

This example shows:
- Creating and managing configuration with the Config class
- Loading configuration from environment variables
- Using EnvironmentManager to get, set, and manage environment variables
- Loading multiple environment variables from a dictionary
