1. Switch to Alpha Testing Branch
2. install docker on your laptop
3. go to docker files and run the command "docker-compose up" (this will create the zookeeper and the kafka containers)
4. you can check the containers status by "docker ps -a"
// make sure your kafka is running on 9092 port
// api will run on 5000 so that port should be empty too

Now all your setup is done
1. go to hosting_details.txt and install the python packages mentioned
2. go to api gateway folder and run python app.py  --> the flask server should now be running on 5000
3. go to microservices and fire up the 3 microservices
  a. session_management/SessionManagement/SessionManagement microservice -> run Program.cs (c#)
  b. user_management_microservice/src/main/java/ microservice -> run Main.java (java)
  c. data_retrieval microservice -> run app.py (python)

Notes: all our databases are hosted online so you do not need to run those
also all microservices should be running on different terminals
