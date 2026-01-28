"""Tests for the Config class."""

from environment.config import Config


class TestConfig:
    """Test cases for Config class."""

    def test_init_empty(self):
        """Test initialization with no arguments."""
        config = Config()
        assert config.to_dict() == {}

    def test_init_with_dict(self):
        """Test initialization with a dictionary."""
        initial_config = {"key1": "value1", "key2": 42}
        config = Config(initial_config)
        assert config.to_dict() == initial_config

    def test_get_existing_key(self):
        """Test getting an existing key."""
        config = Config({"key1": "value1"})
        assert config.get("key1") == "value1"

    def test_get_missing_key_with_default(self):
        """Test getting a missing key with default value."""
        config = Config()
        assert config.get("missing", "default") == "default"

    def test_get_missing_key_without_default(self):
        """Test getting a missing key without default value."""
        config = Config()
        assert config.get("missing") is None

    def test_set(self):
        """Test setting a configuration value."""
        config = Config()
        config.set("key1", "value1")
        assert config.get("key1") == "value1"

    def test_from_env(self, monkeypatch):
        """Test loading from environment variable."""
        monkeypatch.setenv("TEST_VAR", "test_value")
        config = Config()
        value = config.from_env("key1", "TEST_VAR")
        assert value == "test_value"
        assert config.get("key1") == "test_value"

    def test_from_env_with_default(self):
        """Test loading from non-existent environment variable with default."""
        config = Config()
        value = config.from_env("key1", "NON_EXISTENT_VAR", "default_value")
        assert value == "default_value"
        assert config.get("key1") == "default_value"

    def test_to_dict(self):
        """Test converting config to dictionary."""
        initial_dict = {"key1": "value1", "key2": 42}
        config = Config(initial_dict)
        result_dict = config.to_dict()
        assert result_dict == initial_dict
        # Ensure it's a copy, not the same object
        assert result_dict is not config._config
