
GIT_INDEX_FILE = .deploy-index
export GIT_INDEX_FILE


all:
	echo "Run 'make deploy' to deploy to Heroku"


dist: node_modules $(shell find . -type f)
		npm run build


node_modules: package.json npm-shrinkwrap.json elm-package.json
	npm install


# Push to the "deploy" branch
deploy: dist
		deployment/deploy.py


.PHONY: deploy


