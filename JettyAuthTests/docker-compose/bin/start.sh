#!/bin/bash

# start or setup the keycloak/apache/jetty environment 

scriptPos=${0%/*}

absPathToBase=$(pushd $scriptPos/.. > /dev/null; pwd ; popd > /dev/null)

composeFile="$scriptPos/../docker-compose.yml"

keycloakAdmin=batman
keycloakAdminPwd=IchBinBatman

if ! [ -d $scriptPos/../httpd/sites-conf ]; then mkdir -p $scriptPos/../httpd/sites-conf; fi
if ! [ -d $scriptPos/../jetty/webapps ]; then mkdir -p $scriptPos/../jetty/webapps; fi
if ! [ -d $scriptPos/../db/pg_data ]; then mkdir -p $scriptPos/../db/pg_data; fi

httpdContName=jettyauthtest_apache_0.2
keycloakContName=jettyauthtest_keycloak_0.2

docker ps -f name="$httpdContName" | grep "$httpdContName" > /dev/null && echo -en "\033[1;31m  container seems to be up: $httpdContName\033[0m\n" && exit 1


# install needed test webapps ...

if [ $# -eq 0 ] || ! [ -f $scriptPos/../jetty/webapps/eins.war ]; then
    rm -f "$scriptPos/../jetty/webapps"/*.*
    pushd "$scriptPos/../../app-eins" > /dev/null
    gradle clean assemble
    cp build/libs/app-eins.war ../docker-compose/jetty/webapps/eins.war
    popd > /dev/null
    pushd "$scriptPos/../../app-eins-2" > /dev/null
    gradle clean assemble
    cp build/libs/app-eins-2.war ../docker-compose/jetty/webapps/eins2.war
    popd > /dev/null
    pushd "$scriptPos/../../app-zwei" > /dev/null
    gradle clean assemble
    cp build/libs/app-zwei.war ../docker-compose/jetty/webapps/zwei.war
    popd > /dev/null
fi


if docker ps -a -f name="$httpdContName" | grep "$httpdContName" > /dev/null; then
    docker-compose -f "$composeFile" start
else
    if ! [ -d "$scriptPos/../db/pg_data" ]; then
        mkdir "$scriptPos/../db/pg_data"
    fi

    docker-compose -f "$composeFile" up -d
    if ! docker exec $keycloakContName keycloak/bin/add-user-keycloak.sh --user "$keycloakAdmin" --password "$keycloakAdminPwd"; then
        echo -en "\033[1;31m  error while init keycloak user \033[0m\n"
        exit 1
    else
        docker stop $keycloakContName
        docker start $keycloakContName

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
            if docker logs $keycloakContName | grep 'Admin console listening on http'; then
                finished=1
            else
                echo "wait for finished keycload ..."
                sleep 1
            fi
        done
        "$initKeycloakDir/InitKeycloakServer.sh" -i "$absPathToBase/conf/init_keycloak.json" -k "http://localhost:8000/auth" -u $keycloakAdmin -p $keycloakAdminPwd
    fi
fi

