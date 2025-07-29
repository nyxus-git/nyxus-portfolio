# backend/alembic/env.py
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import sys
import os

# --- CRITICAL: Add the parent directory ('backend') to the Python path ---
# This allows Alembic to find the 'app' module from within the alembic directory.
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
# Example path added: /home/nyxus/projects/nyxus-portfolio/backend
# --- END CRITICAL ---

# Import your application's configuration and database setup
# These imports must happen AFTER sys.path is updated
from app.core.config import settings
from app.db.base import Base # Import Base from the dedicated file

# --- CRITICAL: Import ALL models HERE to ensure they are registered with Base ---
# This is the step that was likely missing or incorrect.
# Alembic's autogenerate looks at Base.metadata, which only knows about tables
# that have been imported and defined.
from app.models import User, Project # Import the actual model classes
# --- END CRITICAL ---

# this is the Alembic Config object
config = context.config

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set the SQLAlchemy URL from your settings
config.set_main_option('sqlalchemy.url', settings.SQLALCHEMY_DATABASE_URI)

# add your model's MetaData object here for 'autogenerate' support
# Use the Base.metadata which now includes User and Project tables
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()