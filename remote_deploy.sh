eval $(aws ecr get-login --region eu-west-1)
docker build -t monopoly .
docker tag monopoly:latest 490164210756.dkr.ecr.us-west-2.amazonaws.com/monopoly:latest
docker push 490164210756.dkr.ecr.us-west-2.amazonaws.com/monopoly:latest
aws ecs update-service --service Monopoly