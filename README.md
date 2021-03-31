
# Leaderboard

  

### NOTE: I know the styling sucks. I am going to try fixing the styling soon. If anyone wants to help, please make a PR.

  

## Introduction

This project is a simple application for me to get experience in creating Full Stack Applications. It is a simple leaderboard website which would have an admin website to control the scores and a public website to view the leaderboard. The admin website will have analytics to view trends and how progress is going. I am still getting ideas on how to continue this project, so you will definitely find things changing frequently.


### Requirements

  

- Working MySQL Server (for Session and Scores Storage)

- Node.JS and NPM
- Nginx (Optional)
  
### Things left to do
  

 - [ ] Change admin username/password in Admin Panel. (Currently can only be done in API)
 - [ ] Improve CSS and styling
 - [ ] Add API Support for ranges
 
  This list might get bigger but I have no ideas what to add.   

## Installation

  

There are only a few simple steps to get this application running.

  

1. We need to create a database to store the application information.
   Login to the MySQL server, and execute  
   ``` sql 
   CREATE DATABASE leaderboard;
   ``` 
   You can change the name of the database to whatever you want.
2. To not give the application too much privileges on the MySQL server, we need to create a new user.
   In the MySQL server, execute 
   ``` sql
   CREATE USER 'leaderboard'@'127.0.0.1' IDENTIFIED BY 'somePassword';
   GRANT ALL PRIVILEGES ON leaderboard.* TO 'leaderboard'@'127.0.0.1' WITH GRANT OPTION;
   FLUSH PRIVILEGES;
   ```
   If you are running MySQL version 8 or higher, you will need to execute 
   ``` sql 
   CREATE USER 'leaderboard'@'127.0.0.1' IDENTIFIED WITH mysql_native_password BY 'somePassword';
   GRANT ALL PRIVILEGES ON leaderboard.* TO 'leaderboard'@'127.0.0.1' WITH GRANT OPTION;
   FLUSH PRIVILEGES;
   ```
      You can change the name of the user to whatever you want and of course change the password to a stronger one.
3. After setting up the MySQL environment, we can move to configuring the app. Copy the `config.json.example` file and edit it depending on your needs. Place the previously used database and MySQL user and password in there and choose a free open port to use for the webserver. Generate a good random session secret by either smashing your head at the keyboard and break it or using your Password Manager's generator.
4. Get in the working directory and run
	``` sh
	npm install
	```
	So it installs all the required packages.
5. To start the app, run this in the working directory.
	``` sh
	node .
	```
#### Optional stuff

- Use a Nginx reverse proxy to add support for HTTPS

## FAQs
Q: I cannot use ports less than 1024.
A: This is a linux feature. You need to run as root/with sudo to have access to those ports.

Q: I am using MySQL version 8 and I am getting an error while the app is logging in to the MySQL server.
A: MySQL version 8 defaults to a different type of authentication for users. This is not supported by a dependency I use, so you will need to create a user with a supported authentication as explained in Step 2 in Installation. 

More to come.
