#!/bin/bash

curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -

sudo apt install nodejs

node --version

curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | sudo tee /usr/share/keyrings/yarnkey.gpg >/dev/null

echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt-get update && sudo apt-get install yarn

yarn install --frozen-lockfile

yarn build

mv build/ dist
