#!/bin/bash

# stop the test environment

scriptPos=${0%/*}

composeFile="$scriptPos/../docker-compose.yml"

docker-compose -f "$composeFile" down


