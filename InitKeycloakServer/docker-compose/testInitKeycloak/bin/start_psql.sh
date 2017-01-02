#!/bin/bash

scriptPos=${0%/*}

DB_USER=homer
DB_USERPWD=bartSucks4

case $1 in
    list|--list|-l)
        docker run -it --rm --net keycloaktest_default --link keycloaktest_db_1:postgres postgres:alpine psql -h postgres -U homer --list
        exit 0
        ;;
esac

docker run -it --rm --net keycloaktest_default --link keycloaktest_db_1:postgres postgres:alpine psql -h postgres -U homer -d postgres
