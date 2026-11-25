"""Helpers for exposing .env variables as Django settings."""

from pathlib import Path

from dotenv import dotenv_values, load_dotenv


_BOOLEAN_VALUES = {
    "true": True,
    "yes": True,
    "on": True,
    "false": False,
    "no": False,
    "off": False,
}


def _parse_value(raw: str):
    """Convert a raw .env string into a bool, int, float or str."""
    value = raw.strip()

    if value.lower() in _BOOLEAN_VALUES:
        return _BOOLEAN_VALUES[value.lower()]

    for caster in (int, float):
        try:
            return caster(value)
        except ValueError:
            continue

    return value


def _find_env_file(settings_globals: dict) -> Path | None:
    """Look for a .env next to the settings module, its parent, or BASE_DIR."""
    base_dir = Path(settings_globals.get("BASE_DIR", Path.cwd()))
    settings_file = settings_globals.get("__file__")

    candidates = [base_dir / ".env", base_dir / "config" / ".env"]
    if settings_file:
        settings_dir = Path(settings_file).resolve().parent
        candidates += [settings_dir / ".env", settings_dir.parent / ".env"]

    for candidate in candidates:
        if candidate.is_file():
            return candidate

    return None


def load_env_settings(settings_globals: dict, env_file: str | Path | None = None) -> dict:
    """
    Load `env_file` into os.environ and expose every variable as a setting.

    Call it from a settings module with `load_env_settings(globals())`.
    Settings already defined in the module are never overwritten, so explicit
    values keep precedence over the .env file.
    """
    env_file = Path(env_file) if env_file is not None else _find_env_file(settings_globals)
    if env_file is None:
        return settings_globals

    load_dotenv(env_file)

    for key, raw in dotenv_values(env_file).items():
        if raw is None:
            continue
        settings_globals.setdefault(key, _parse_value(raw))

    return settings_globals
