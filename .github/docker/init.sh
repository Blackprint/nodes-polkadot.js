# Create app folder for our project directory and clone the repositories
mkdir ./app
git clone --depth 1 --recursive https://github.com/Blackprint/Blackprint.git ./app
git clone --depth 1 https://github.com/Blackprint/nodes-polkadot.js.git ./app/nodes/nodes-polkadot.js

# Run the container (force recreate to clear old logs)
docker-compose up --force-recreate