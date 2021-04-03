
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
 
  This list might get bigger but I have no idea what to add.   

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
3. After setting up the MySQL environment, we can move to configuring the app. Copy the `config.json.example` file and edit it depending on your needs. (Don't forget to rename the file to `config.json`) Place the previously used database and MySQL user and password in there and choose a free open port to use for the webserver. Generate a good random session secret by either smashing your head at the keyboard and break it or using your Password Manager's generator.
4. Get in the working directory and run
	``` sh
	npm install
	```
	So it installs all the required packages.
5. To start the app, run this in the working directory.
	``` sh
	node .
	```
6. Login to the admin panel using the port specified in `config.json` (**8080** as default) and using `admin` as the username and password.

#### Optional stuff

- Use a Nginx reverse proxy to add support for HTTPS
- Use Systemd or PM2 to automate starting and restarting the app.

## FAQs
Q: I cannot use ports less than 1024.
A: This is a linux feature. You need to run as root/with sudo to have access to those ports.

Q: I am using MySQL version 8 and I am getting an error while the app is logging in to the MySQL server.
A: MySQL version 8 defaults to a different type of authentication for users. This is not supported by a dependency I use, so you will need to create a user with a supported authentication as explained in Step 2 in Installation. 

Q: Program errors with `Cannot find module './config.json'`
A: You have not copied the `config.json.example` file, renamed it and filled it in like in Step 3 of the Installation.

Q: Program errors with `connect ECONNREFUSED`
A: Your SQL setup in the config.json file is incorrect. Attempt the Installation again using the above steps.

Q: The admin panel wont log in with the default credentials
A: This typically occurs when you are using http over https because the program tries to create a secure cookie to store the login validation. To fix this: 
- On Windows, use `Windows-Devel.bat` to run the program.
- On Linux, run the program using `DEVEL=true node .` or just preprending `DEVEL=true` to the start of your run command.

Q: The admin panel is asking for a username and password but I haven't specified one.
A: As per the Installation instructions, the username and password for the default installation is `admin`.

More to come.
