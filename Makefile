up:
	@echo STARTING CONTAINER
	@docker-compose up --build --force-recreate

down:
	@echo DESTROYING CONTAINER
	@docker-compose down -v --rmi local

start:
	@echo STARTING APPLICATION
	@./node_modules/.bin/nodemon src/index.js