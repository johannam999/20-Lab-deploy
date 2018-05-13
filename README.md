# Project Name
**Author**: Joanna Coll
**Version**: 1.0.0 

## Overview
This app creates an account with login and a sign-up functionality for the user, using the best practice for authentication and authorization. The user uses a password which is sent to the server, where a hash password gets created (encoded user password) and the original user password deleted. The token seed gets created on server side and token on client side to keep the user logged in without sending password each time. From this moment user can access their account using just token until it expires.
Deploying fully built app on Heroku after passing Travis test. Testing it.

## Getting Started
1. To start you need to install all the necessary dependencies and create all the directories.
2. Start with building Schema for the user Account and mock account for testing purpose.
3. Build a server and add start and stop routes.
4. Create initial test for server.
5. Write logger.js and export it.
6. Create error-middleware.js and error-middleware.js to handle errors and export it.
7. Make sure server listens on port 7000 in .env file. Write test for .env.
8. Create authentication route and set up token and token seed verification in basic-auth-middleware.js and bearer-auth-middleware.js.
9. Create profile Schema and profile server routes.
10. Write test for all the routes and create mock profile for testing.

DEPLOYMENT:
1. Install babel-cli and stage-O.
2. Make changes in .env, package.json, index.js and main.js files accordingly.
3. Ignore build folder in .eslintignore and test the server.
4. Create a new Github repository and move all the files and folders to it. 
5. Set up travis for this Github repository and make the first push so that Travis started testing.
6. Make sure to change settings in Github repository to protect the branch and set travis to pass the test before any merges.
7. Create new application in Heroku and wait for CI to pass.
8. Add variables Node_env, mongodb and key in Heroku settings.
9. Deploy application and make sure the logs are showing no errors.
10. Test the app using terminal.



## Architecture
JavaScript, Node.js, Airbnb package, babelrc, stage-O, nodemon, mongodb, mongoose, other dependencies

## Change Log

05-12-2018 11:50pm - The application is deployed.
05-13-2018 9:30am - Finished writing README.md


## Credits and Collaborations