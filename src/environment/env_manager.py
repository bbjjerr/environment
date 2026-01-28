"""Environment variable management utilities."""

import os
from typing import Dict, Optional


class EnvironmentManager:
    """
    Manager for environment variables.

    This class provides utilities for getting, setting, and managing
    environment variables in a structured way.
    """

    @staticmethod
    def get(key: str, default: Optional[str] = None) -> Optional[str]:
        """
        Get an environment variable.

        Args:
            key: The environment variable name.
            default: Default value if not found.

        Returns:
            The environment variable value or default.
        """
        return os.getenv(key, default)

    @staticmethod
    def set(key: str, value: str) -> None:
        """
        Set an environment variable.

        Args:
            key: The environment variable name.
            value: The value to set.
        """
        os.environ[key] = value

    @staticmethod
    def unset(key: str) -> None:
        """
        Unset an environment variable.

        Args:
            key: The environment variable name to remove.
        """
        if key in os.environ:
            del os.environ[key]

    @staticmethod
    def get_all() -> Dict[str, str]:
        """
        Get all environment variables.

        Returns:
            A dictionary of all environment variables.
        """
        return dict(os.environ)

    @staticmethod
    def load_from_dict(env_dict: Dict[str, str], override: bool = False) -> None:
        """
        Load environment variables from a dictionary.

        Args:
            env_dict: Dictionary of environment variables to load.
            override: If True, override existing variables. If False,
                     only set variables that don't already exist.
        """
        for key, value in env_dict.items():
            if not isinstance(value, str):
                value = str(value)
            if override or key not in os.environ:
                os.environ[key] = value
