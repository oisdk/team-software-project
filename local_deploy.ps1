#Windows 10 seems to have scripts disabled by default for some reason.
#If that's an issue open a powershell as administrator and use Set-ExecutionPolicy RemoteSigned
#Run the script using .\local_deploy.ps1
#Thanks to Adam for the original script!

# Stop and remove old docker container
docker stop monopoly
docker rm monopoly

# Build and run new container
docker build -t my_apache .
docker run -dit --name monopoly -p 80:80 -d my_apache
