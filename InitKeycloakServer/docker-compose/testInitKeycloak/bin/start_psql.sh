#!/bin/bash

scriptPos=${0%/*}

DB_USER=homer
DB_USERPWD=bartSucks4

dbContName=testinitkeycloak_db_1
netName=testinitkeycloak_initkeycloak-it

case $1 in
    list|--list|-l)
        docker run -it --rm --net $netName --link $dbContName:postgres postgres:alpine psql -h postgres -U homer --list
        exit 0
        ;;
esac

docker run -it --rm --net $netName --link $dbContName:postgres postgres:alpine psql -h postgres -U homer -d postgres
