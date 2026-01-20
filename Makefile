.PHONY: help build up down restart logs logs-backend logs-frontend shell-backend shell-frontend db-migrate db-studio clean prune

# Default target
help:
	@echo "Kentrick AI SaaS - Available Commands"
	@echo "======================================"
	@echo ""
	@echo "Docker Commands:"
	@echo "  make build          - Build all Docker images"
	@echo "  make up             - Start all services"
	@echo "  make up-build       - Build and start all services"
	@echo "  make down           - Stop all services"
	@echo "  make restart        - Restart all services"
	@echo "  make logs           - View logs from all services"
	@echo "  make logs-backend   - View backend logs"
	@echo "  make logs-frontend  - View frontend logs"
	@echo ""
	@echo "Shell Access:"
	@echo "  make shell-backend  - Open shell in backend container"
	@echo "  make shell-frontend - Open shell in frontend container"
	@echo ""
	@echo "Database Commands:"
	@echo "  make db-migrate     - Run Prisma migrations"
	@echo "  make db-studio      - Open Prisma Studio"
	@echo "  make db-reset       - Reset database (WARNING: destroys data)"
	@echo ""
	@echo "Cleanup Commands:"
	@echo "  make clean          - Stop services and remove volumes"
	@echo "  make prune          - Remove all unused Docker resources"
	@echo ""
	@echo "Development Commands:"
	@echo "  make lint           - Run linters on backend and frontend"
	@echo "  make typecheck      - Run TypeScript type checking"
	@echo ""

# Docker commands
build:
	docker-compose build

up:
	docker-compose up -d

up-build:
	docker-compose up -d --build

down:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-postgres:
	docker-compose logs -f postgres

logs-minio:
	docker-compose logs -f minio

# Shell access
shell-backend:
	docker-compose exec backend sh

shell-frontend:
	docker-compose exec frontend sh

shell-postgres:
	docker-compose exec postgres psql -U kentrick -d kentrick

# Database commands
db-migrate:
	docker-compose exec backend npx prisma migrate dev

db-studio:
	docker-compose exec backend npx prisma studio

db-reset:
	docker-compose exec backend npx prisma migrate reset --force

db-seed:
	docker-compose exec backend npx prisma db seed

# Development commands
lint:
	docker-compose exec backend npm run lint
	docker-compose exec frontend npm run lint

typecheck:
	docker-compose exec backend npm run typecheck
	docker-compose exec frontend npm run typecheck

# Cleanup commands
clean:
	docker-compose down -v --remove-orphans

prune:
	docker system prune -af
	docker volume prune -f

# Install dependencies locally (for IDE support)
install-local:
	cd backend && npm install
	cd frontend && npm install

# Quick start
start: up-build
	@echo "Services are starting..."
	@echo "Frontend: http://localhost:5173"
	@echo "Backend API: http://localhost:3000"
	@echo "MinIO Console: http://localhost:9001"
	@echo ""
	@echo "Run 'make logs' to view logs"
