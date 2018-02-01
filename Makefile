
GIT_INDEX_FILE = .deploy-index
export GIT_INDEX_FILE


all:
	echo "Run 'make deploy' to deploy to Heroku"


deploy:
		# Build
		npm install
		npm run build

		# Push to the "deploy" branch
		deployment/deploy.py

.PHONY: deploy


