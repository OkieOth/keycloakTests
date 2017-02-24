#!/bin/bash

# stop the test environment

scriptPos=${0%/*}

composeFile="$scriptPos/../docker-compose.yml"

docker-compose -f "$composeFile" down

sudo rm -rf "$scriptPos/../db/*"
sudo rm -rf "$scriptPos/../tomcat/webapps"


