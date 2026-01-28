"""Configuration management for environment settings."""

import os
from typing import Any, Dict, Optional


class Config:
    """
    Configuration class for managing environment settings.

    This class provides methods to load, validate, and access
    configuration settings from environment variables.
    """

    def __init__(self, config_dict: Optional[Dict[str, Any]] = None):
        """
        Initialize the Config object.

        Args:
            config_dict: Optional dictionary of configuration values.
                        If None, an empty configuration is created.
        """
        self._config = config_dict.copy() if config_dict else {}

    def get(self, key: str, default: Any = None) -> Any:
        """
        Get a configuration value by key.

        Args:
            key: The configuration key to retrieve.
            default: Default value if key is not found.

        Returns:
            The configuration value or default if not found.
        """
        return self._config.get(key, default)

    def set(self, key: str, value: Any) -> None:
        """
        Set a configuration value.

        Args:
            key: The configuration key to set.
            value: The value to set for the key.
        """
        self._config[key] = value

    def from_env(self, key: str, env_var: str, default: Any = None) -> Any:
        """
        Load a configuration value from an environment variable.

        Args:
            key: The configuration key to set.
            env_var: The environment variable name to read from.
            default: Default value if environment variable is not set.

        Returns:
            The value from the environment variable or default.
        """
        value = os.getenv(env_var, default)
        self._config[key] = value
        return value

    def to_dict(self) -> Dict[str, Any]:
        """
        Convert configuration to a dictionary.

        Returns:
            A dictionary containing all configuration values.
        """
        return self._config.copy()
