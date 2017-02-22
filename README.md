KeycloakTests
=============
Setup for a test environment to play with Keycloak SSO and currently some JAVA stuff like Apache Tomcat and Jetty.

JettyAuthTests - tests three simple Servlets running in Jetty agains a Keycloak SSO server
TomcatAuthTests - tests the servlets in a Apache Tomcat v8 against a Keycloak SSO server

The subprojects contain the sources to setup environment with Apache httpd, Keycloak, Jetty and Postgres.
The systems are setup with docker compose and as a alternative with Vagrant.

All stuff with keycloak v2.5.1.Final

Requirements
------------
There are two ways to play with it:
1. Local build and run. It needs docker, docker-compose, java8 and gradle
2. Self deploying virtual machine: vagrant
