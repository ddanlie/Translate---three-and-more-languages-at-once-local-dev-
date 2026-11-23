.PHONY: rundev

rundev:
	cd frontend && npm run dev -- --host 0.0.0.0 & \
	cd backend/default && uv run python manage.py runserver
