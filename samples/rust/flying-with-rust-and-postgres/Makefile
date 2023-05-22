PORT = 8080
TAG = flying_with_rust_and_postgres
DB_PORT = 5432
DB_PASSWORD = mySuperSecretPassword!
CONNECTION_STRING = postgres://postgres:mySuperSecretPassword!@localhost:5432/postgres?sslmode=disable

.PHONY: build
build: 
	docker build . -t $(TAG)

.PHONY: run
run:
	docker run -d \
		-p $(PORT):$(PORT) \
		-e PORT=$(PORT) \
		--name $(TAG) \
		-it $(TAG)

.PHONY: stop
stop:
	docker stop $(TAG)

.PHONY: start
start:
	docker start $(TAG)

.PHONY: db-run
db-run:
	docker run -d \
		-p $(DB_PORT):$(DB_PORT) \
		-e POSTGRES_PASSWORD=mySuperSecretPassword! \
		--name fly_demo_db \
		postgres

.PHONY: db-start
db-start:
	docker start fly_demo_db

.PHONY: db-stop
db-stop:
	docker stop fly_demo_db

.PHONY: run-server
run-server:
	PORT=$(PORT) DATABASE_URL=$(CONNECTION_STRING) cargo run
