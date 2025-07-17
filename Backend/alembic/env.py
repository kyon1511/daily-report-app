import os
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# モデル変更に関する参照場所
from app.models import Base

# .envファイルを読み込む
from dotenv import load_dotenv
load_dotenv()

# .envから取得したDBのURLをAlembicに渡す
DATABASE_URL = os.getenv("DATABASE_URL")

# Alembicの設定オブジェクト
config = context.config
config.set_main_option("sqlalchemy.url", str(DATABASE_URL))

# ログ設定
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# モデルのメタデータ（テーブル構造）を指定
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
