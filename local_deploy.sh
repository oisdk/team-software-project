#!/usr/bin/env bash

# Stop and remove old docker container
docker stop monopoly
docker rm monopoly

# Build and run new container
docker build -t my_apache .
docker run -dit --name monopoly -p 80:80 -d my_apache