#!/bin/bash

# stop the test environment

scriptPos=${0%/*}

projectName=tomcatauthtest
composeFile="$scriptPos/../docker-compose.yml"

docker-compose -p "$projectName" -f "$composeFile" down


