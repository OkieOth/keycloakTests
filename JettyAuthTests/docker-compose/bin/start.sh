#!/bin/bash

# start or setup the keycloak/apache/jetty environment 

scriptPos=${0%/*}

absPathToBase=$(pushd $scriptPos/.. > /dev/null; pwd ; popd > /dev/null)

projectName=jettyauthtest
composeFile="$scriptPos/../docker-compose.yml"

keycloakAdmin=batman
keycloakAdminPwd=IchBinBatman

if ! [ -d $scriptPos/../httpd/sites-conf ]; then mkdir -p $scriptPos/../httpd/sites-conf; fi


httpdContName=${projectName}_httpd_1

docker ps -f name="$httpdContName" | grep "$httpdContName" > /dev/null && echo -en "\033[1;31m  container seems to be up: $httpdContName\033[0m\n" && exit 1

if docker ps -a -f name="$httpdContName" | grep "$httpdContName" > /dev/null; then
    docker-compose -p "$projectName" -f "$composeFile" start
else
    if ! [ -d "$scriptPos/../db/pg_data" ]; then
        mkdir "$scriptPos/../db/pg_data"
    fi
    docker-compose -p "$projectName" -f "$composeFile" up -d
    if ! docker exec ${projectName}_keycloak_1 keycloak/bin/add-user-keycloak.sh --user "$keycloakAdmin" --password "$keycloakAdminPwd"; then
        echo -en "\033[1;31m  error while init keycloak user \033[0m\n"
        exit 1
    else
        docker stop ${projectName}_keycloak_1
        docker start ${projectName}_keycloak_1

        # init of the keycloak test database ...
        tmpDir="$scriptPos/../tmp"
        initKeycloakDir="$tmpDir/InitKeycloakServer"
        if ! [ -d "$tmpDir" ]; then
            mkdir "$tmpDir"            
        fi        
        if [ -d "$initKeycloakDir" ]; then
            rm -rf "$initKeycloakDir"
        fi
        pushd "$scriptPos/../../../InitKeycloakServer" > /dev/null
        gradle buildRelease
        cp -r build/release ../JettyAuthTests/docker-compose/tmp/InitKeycloakServer
        popd > /dev/null
        # keycloak: wait for start finished ...
        finished=0
        while [ $finished -eq 0 ]; do
            if docker logs ${projectName}_keycloak_1 | grep 'Admin console listening on http'; then
                finished=1
            else
                echo "wait for finished keycload ..."
                sleep 1
            fi
        done
        "$initKeycloakDir/InitKeycloakServer.sh" -i "$absPathToBase/conf/init_keycloak.json" -k "http://localhost:8000/auth" -u $keycloakAdmin -p $keycloakAdminPwd
    fi
fi

