GO_CMD=go
PNPM_CMD=pnpm
DOCKER_CMD=docker-compose

setup:
	@echo "=> Installing dependencies..."
	$(PNPM_CMD) install
	@echo "=> Installing browsers..."
	$(PNPM_CMD) exec playwright install --with-deps chromium
	@echo "=> Baixando modulos do Go..."
	$(GO_CMD) mod tidy

#compile the orchestrator
build:
	@echo "=> Compiling the Engine-E2E-Specter-Bench..."
	cd engine-showdown/cmd/orchestrator && $(GO_CMD) build -o ../../../bin/specter-engine main.go

#start engine(move up docker and tests)
run: build
	@echo "=> Starting the Engine..."
	./bin/specter-engine

#kill enviroment Docker if Go fail in turn off 
down:
	@echo "=> kill enviroment Docker..."
	$(DOCKER_CMD) down -v

clean: down
	rm -rf bin/
