#!/usr/bin/env bash

# Login to aws and docker
eval $(aws ecr get-login --no-include-email --region us-west-2)

# Build the docker image
docker build -t monopoly .
# Tag the image as latest and push to the server
docker tag monopoly:latest 490164210756.dkr.ecr.us-west-2.amazonaws.com/monopoly:latest
docker push 490164210756.dkr.ecr.us-west-2.amazonaws.com/monopoly:latest

# Get the old task and stop it
task_arn=$(aws ecs list-tasks --cluster monopoly --output text --region us-west-2)
task_arn=${task_arn#"TASKARNS"}
aws ecs stop-task --task $task_arn --cluster monopoly --region us-west-2
# Run new task
aws ecs run-task --task-definition Monopoly --cluster monopoly --region us-west-2
