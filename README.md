# Hungry-Lone-Wolf
----------
## Table of Contents 
1. [Overview](#overview)
2. [Technologies](#technologies)
3. [Local Installation](#installation)
4. [App Display](#display)


<a name="overview"></a>
## Overview 
Afraid to eat alone or have no one to try out the new hot restaurant with ? Hungry Lone Wolf is the perfect solution for you. This node application allows users to find others around the area to share a meal with. A user's ideal meal buddy is selected via 6 survey questions, including date, time, location, gender preference, age preference, and cuisine preference. The ideal meal buddy's profile must fit exactly to the user's answers to the first 5 questions and have at least 1 shared cuisine prefrence (user can select multiple). Once the ideal candidates are filtered out, they are pushed to an array every time they have a shared cuisine preferenece with the user (weighted probability). Finally, a random number is generated, and the candidate at that array index will be selected as the ideal date. This web app includes the functionality for users to email their date, view upcoming dates, and view past dates.   

<a name="technologies"></a>
## Technologies
 - Express.js 
 - Bootstrap
 - Google Maps API
 - Sequelize
 - MySQL
 	- Local database
 - JawsDB
 	- Deployed Heroku database 
 - Handlebars
 - Passport.js 
 - Helper Date  

<a name="installation"></a>
## Local Installation
### Step 1: Git Clone
Clone Hungry-Lone-Wolf to your local git repo like the following:
> git clone https://github.com/lawrencel13110123/Hungry-Lone-Wolf
The Hungry-Lone-Wolf project and its files should now be in your project folder.

### Step 2: Install Dependencies
Install the following dependencies listed in the `package.json` file: 

> npm install

Once completed, you will see a `node_modules` folder in your local repo.

The dependencies should now be in the local `node_modules` folder.

### Step 3: Set up MySQL database 

Via terminal type in these bash command once you are in the db directory 

> mysql -u root -p
>
> enter your MySQL password 
>
> source schema.sql 
>
> exit 

### Step 4: Launch app 
Via terminal type in these bash command once you are in the Hungry-Lone-Wolf root directory 

> node server.js 

Go to your browser and type in `localhost:3000` in your URL bar. Now you should see the application open locally.
To visit deployed application, go to https://still-depths-49015.herokuapp.com

<a name="display"></a>
## App Display
### User 1 (Gates) signup
![User 1 (Gates) signup](/public/assets/images/gates_signup.gif)

### User 2 (Buffett) signup
![User 2 (Buffett) signup](/public/assets/images/buffett_signup.gif)

### User 2 (Buffett) survey
![User 2 (Buffett) survey](/public/assets/images/buffett_survey.jpg)

### User 1 (Gates) survey
![User 1 (Gates) survey](/public/assets/images/gates_survey.gif)

### User 1 (Gates) plan
![User 1 (Gates) plan](/public/assets/images/gates_plan.gif)


