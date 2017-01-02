#!/bin/bash

scriptPos=${0%/*}

docker exec keycloaktest_keycloak_1 keycloak/bin/add-user-keycloak.sh --user batman --password robinSucksToo
