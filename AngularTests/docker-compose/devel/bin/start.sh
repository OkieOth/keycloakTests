#!/bin/bash

# start or setup the keycloak/apache/tomcat environment 

scriptPos=${0%/*}

absPathToBase=$(pushd $scriptPos/.. > /dev/null; pwd ; popd > /dev/null)

composeFile="$scriptPos/../docker-compose.yml"

keycloakAdmin=batman
keycloakAdminPwd=IchBinBatman

if ! [ -d $scriptPos/../httpd/sites-conf ]; then mkdir -p $scriptPos/../httpd/sites-conf; fi
if ! [ -d $scriptPos/../tomcat/webapps ]; then mkdir -p $scriptPos/../tomcat/webapps; fi
if ! [ -d $scriptPos/../db/pg_data ]; then mkdir -p $scriptPos/../db/pg_data; fi

tomcatContName=angularauthtest_tomcat_devel_0.2
keycloakContName=angularauthtest_keycloak_devel_0.2

docker ps -f name="$tomcatContName" | grep "$tomcatContName" > /dev/null && echo -en "\033[1;31m  container seems to be up: $tomcatContName\033[0m\n" && exit 1


# install needed test webapps ...

if [ $# -eq 0 ] || ! [ -f $scriptPos/../tomcat/webapps/eins.war ]; then
    rm -f $scriptPos/../tomcat/webapps/*.*
    pushd $scriptPos/../../../app-eins > /dev/null
    gradle clean assemble
    cp build/libs/eins.war ../docker-compose/devel/tomcat/webapps
    popd > /dev/null
fi


if docker ps -a -f name="$tomcatContName" | grep "$tomcatContName" > /dev/null; then
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
        pushd "$scriptPos/../../../../InitKeycloakServer" > /dev/null
        gradle buildRelease
        cp -r build/release ../AngularTests/docker-compose/devel/tmp/InitKeycloakServer
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

