docker-migrate-db:
	docker compose exec db alembic upgrade head

start-db:
	docker compose up -d db