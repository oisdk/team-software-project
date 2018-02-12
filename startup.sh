#!/bin/bash
service mysql start && mysql -e 'CREATE DATABASE db;' && mysql db < initialise_server.sql
/usr/sbin/apache2 -D FOREGROUND

if ! (( $(ps -ef | grep -v grep | grep mysql | wc -l) > 0 )); then
    chown -R mysql:mysql /var/lib/mysql /var/run/mysqld && \
    service mysql start && \
    mvn -q verify site
fi
