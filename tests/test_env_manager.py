"""Tests for the EnvironmentManager class."""

from environment.env_manager import EnvironmentManager


class TestEnvironmentManager:
    """Test cases for EnvironmentManager class."""

    def test_get_existing_var(self, monkeypatch):
        """Test getting an existing environment variable."""
        monkeypatch.setenv("TEST_VAR", "test_value")
        assert EnvironmentManager.get("TEST_VAR") == "test_value"

    def test_get_missing_var_with_default(self):
        """Test getting a missing variable with default."""
        assert EnvironmentManager.get("NON_EXISTENT_VAR", "default") == "default"

    def test_get_missing_var_without_default(self):
        """Test getting a missing variable without default."""
        assert EnvironmentManager.get("NON_EXISTENT_VAR") is None

    def test_set(self, monkeypatch):
        """Test setting an environment variable."""
        EnvironmentManager.set("TEST_SET_VAR", "new_value")
        assert EnvironmentManager.get("TEST_SET_VAR") == "new_value"

    def test_unset(self, monkeypatch):
        """Test unsetting an environment variable."""
        monkeypatch.setenv("TEST_UNSET_VAR", "value")
        assert EnvironmentManager.get("TEST_UNSET_VAR") == "value"

        EnvironmentManager.unset("TEST_UNSET_VAR")
        assert EnvironmentManager.get("TEST_UNSET_VAR") is None

    def test_unset_nonexistent(self):
        """Test unsetting a non-existent variable doesn't raise error."""
        # Should not raise an exception
        EnvironmentManager.unset("NON_EXISTENT_VAR")

    def test_get_all(self, monkeypatch):
        """Test getting all environment variables."""
        monkeypatch.setenv("TEST_VAR_1", "value1")
        monkeypatch.setenv("TEST_VAR_2", "value2")

        all_vars = EnvironmentManager.get_all()
        assert isinstance(all_vars, dict)
        assert "TEST_VAR_1" in all_vars
        assert "TEST_VAR_2" in all_vars
        assert all_vars["TEST_VAR_1"] == "value1"
        assert all_vars["TEST_VAR_2"] == "value2"

    def test_load_from_dict_no_override(self, monkeypatch):
        """Test loading from dict without overriding existing vars."""
        monkeypatch.setenv("EXISTING_VAR", "original")

        env_dict = {"EXISTING_VAR": "new_value", "NEW_VAR": "value"}

        EnvironmentManager.load_from_dict(env_dict, override=False)

        # Should not override existing variable
        assert EnvironmentManager.get("EXISTING_VAR") == "original"
        # Should set new variable
        assert EnvironmentManager.get("NEW_VAR") == "value"

    def test_load_from_dict_with_override(self, monkeypatch):
        """Test loading from dict with overriding existing vars."""
        monkeypatch.setenv("EXISTING_VAR", "original")

        env_dict = {"EXISTING_VAR": "new_value", "NEW_VAR": "value"}

        EnvironmentManager.load_from_dict(env_dict, override=True)

        # Should override existing variable
        assert EnvironmentManager.get("EXISTING_VAR") == "new_value"
        # Should set new variable
        assert EnvironmentManager.get("NEW_VAR") == "value"
