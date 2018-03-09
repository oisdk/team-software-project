---
title: Deployment
...

# Local deployment
Requirements:

- [Docker](https://www.docker.com)

To deploy the server locally just type `./local_deploy.sh` into a console. This should work on an OS running the latest linux kernel or on MacOS. This will build and run the Docker image and will have the web server running on localhost.

Alternatively you can run the commands individually with
```bash
docker build -t my_apache .
docker run -dit --name monopoly -p 80:80 -d my_apache
```

# Remote Deployment on AWS
Requirements:

- [AWS Command Line Interface](https://github.com/aws/aws-cli/releases)
- [AWS Account](https://aws.amazon.com)
- [Docker](https://www.docker.com)

## IAM Account setup
To deploy to Amazons AWS you will need to log into the [Management Console here](https://console.aws.amazon.com). You will then need to set up an account for ec2 to manage tasks on the server, to do this go to to [IAM service](https://console.aws.amazon.com/iam/home) then go to `Users`. You will then need to add a user, choose a name and select the `AWS Management Console access` check box and then choose a password. Click `Next` and then create a group by clicking the `Create Group` button. Name the group whatever you like and search for `AdministratorAccess` check the checkbox and then click `Create Group`. Click `Next` review the details and click `Create User` if it's all correct.

## Repository Setup
From there go to [Elastic Container Service](https://us-west-2.console.aws.amazon.com/ecs/home) service. Then go to Repositories and create a repository for the Docker images, take note of the Repository URI as you'll need this for later.

You now need to log into the aws-cli, do this by typing `aws configure` into a console and enter the account information you created in the previous step.

## Build and Push the Docker image
First you will need to get the login command run this then copy the output and run that.
```bash
aws ecr get-login --no-include-email --region us-west-2
```

You can now build and push the Docker image to your AWS Repository(Replacing <Repository URI> with your URI).
```bash
docker build -t monopoly .
docker tag monopoly:latest <Repository URI>:latest
docker push <Repository URI>:latest
```

## Cluster Setup
Next you will need to create a Cluster for the services to run on, you will do this in by clicking `Create Cluster` from the Cluster menu in the [Elastic Container Service](https://us-west-2.console.aws.amazon.com/ecs/home). Then choose the EC2 Linux + Networking template and click `Next Step`. Name the cluster and configure the rest as desired for yourself.

## Task Definition Setup
Next you'll create a Task Definition that will run the Docker image on the Cluster. To do this click `Create new Task Definition` in the Task Definition menu in the [Elastic Container Service](https://us-west-2.console.aws.amazon.com/ecs/home). Name the task definition whatever you like then add a container by clicking `Add Container` under `Container Definitions`, name the container whatever you like, set the Image field to `<Repository URI>:latest`, add a tcp port mapping on Host Port 80 and Container Port 80, configure the rest as you like or leave the defaults. Then click `Add`. Next click `Create`.

## Service Setup
Next you'll need to create a service inside the cluster to run a task based on the Task Definition. To do this click the cluster you made earlier in the clusters menu in the [Elastic Container Service](https://us-west-2.console.aws.amazon.com/ecs/home), under services click `Create`, select the Task Definition and Cluster, name the Service and set number of tasks to 1. Then click `Next Step`, click `Next Step` again or configure as needed, the same with this step, then review the information and if it's all correct click `Create Service`.

## Accessing the web server
Now that everything is setup you should be able to access the server, to find the ip address of the server goto the `ECS Instances` tab inside the cluster and click the container instance. This will give you information about the server and the ip should be listed as Public IP, open the ip in a browser to access the Monopoly game.

## Redeploying the Docker Image
If there's any changes made to the game or if you need to rebuild the image just run the following commands (replacing the necessary information).

```bash
# Login to aws and docker
eval $(aws ecr get-login --no-include-email --region us-west-2)

# Build the docker image
docker build -t monopoly .
# Tag the image as latest and push to the server
docker tag monopoly:latest <Repository URI>:latest
docker push <Repository URI>:latest

# Get the old task and stop it
task_arn=$(aws ecs list-tasks --cluster <Cluster Name> --output text --region <Your Server Region>)
task_arn=${task_arn#"TASKARNS"}
aws ecs stop-task --task $task_arn --cluster <Cluster Name> --region <Your Server Region>
# Run new task
aws ecs run-task --task-definition <Task Definition Name> --cluster <Cluster Name> --region <Your Server Region>
```
