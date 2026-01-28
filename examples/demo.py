#!/usr/bin/env python
"""Example demonstrating the environment package usage."""

from environment import Config, EnvironmentManager


def main():
    """Demonstrate Config and EnvironmentManager functionality."""
    print("=" * 60)
    print("Environment Package Demo")
    print("=" * 60)

    # Demo 1: Using Config
    print("\n1. Config Management:")
    print("-" * 60)
    config = Config()
    config.set("app_name", "MyApp")
    config.set("version", "1.0.0")
    config.set("debug", True)

    print(f"App Name: {config.get('app_name')}")
    print(f"Version: {config.get('version')}")
    print(f"Debug Mode: {config.get('debug')}")
    print(f"All Config: {config.to_dict()}")

    # Demo 2: Loading from environment variables
    print("\n2. Loading from Environment Variables:")
    print("-" * 60)
    EnvironmentManager.set("DATABASE_URL", "postgresql://localhost/mydb")
    EnvironmentManager.set("API_KEY", "abc123xyz")

    config2 = Config()
    config2.from_env("db_url", "DATABASE_URL")
    config2.from_env("api_key", "API_KEY")
    config2.from_env("port", "PORT", default="8000")

    print(f"Database URL: {config2.get('db_url')}")
    print(f"API Key: {config2.get('api_key')}")
    print(f"Port (with default): {config2.get('port')}")

    # Demo 3: EnvironmentManager
    print("\n3. Environment Manager:")
    print("-" * 60)
    print(f"Get DATABASE_URL: {EnvironmentManager.get('DATABASE_URL')}")

    # Load multiple variables
    env_vars = {"SERVICE_NAME": "MyService", "LOG_LEVEL": "INFO"}
    EnvironmentManager.load_from_dict(env_vars)

    print(f"Service Name: {EnvironmentManager.get('SERVICE_NAME')}")
    print(f"Log Level: {EnvironmentManager.get('LOG_LEVEL')}")

    print("\n" + "=" * 60)
    print("Demo completed successfully!")
    print("=" * 60)


if __name__ == "__main__":
    main()
