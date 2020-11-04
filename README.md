# This is an example of React app
## What I did before
`$ npx create-react-app react-example`  
This command will generate a boilerplate like the master branch.  

## How to use
### Setup
`$ git clone git@github.com:wengair/react-example.git`  
Clone this repo to your computer.  
Since we use the RESTful style to connect the frontend and backend, we need to install the library for both of them.  
`$ npm install`  
Run this command to install all the necessary libraries for the backend (the root folder `/`).  
Then enter the `/frontend` folder and `$ npm install` again to install all necessary libraries for the frontend.  
### During the development
Since our frontend and backend are separated, you need to run `$ npm start` in both folders (`/` and `/frontend`) to make the site work properly.  
Or you could only run the command in one folder if you don't need another one.  
For frontend:  
This command will run the app and you can open [http://localhost:3000](http://localhost:3000) to view it in the browser.  
One benefit is if you changed something, you don't need to rerun the command. Localhost will change it automatically.  
You would want to `control + c` to stop and run `npm start` again if you have some relatively important change.  
E.g. changing something in HTML's `<head>`.  

For backend:  
This command will run the server and you can open [http://localhost:8080](http://localhost:8080) to view endpoints in the browser.  
Unlike the frontend, you need to restart the server by `$ npm start` again if you make any change.

## File Structure
### Backend
The root folder is the backend folder so basically, the frontend folder is put inside the backend folder.  
`models` contains the table settings that we'll use in MongoDB  
`receipeRecord` contains the data we get from Spoonacular  
`services` contains files that are called in `server.js`  

### Frontend
`public` contains HTML files like favicon.  
`src/components` contains small elements that can be used repeatedly in pages.  
`src/hooks` contains all custom hook files.  
`src/lib` contains util functions or config that can be used repeatedly in pages.  
`src/views` contains the components that represent the whole page.  

## Miscellaneous
- Naming convention  
  React component: camelcase starting with capital, e.g. SearchResult  
  React custom hook: starts with use..., e.g. useInput  
  JavaScript variable: camelcase, e.g. queryString  
- Eslint is used for making sure our work maintains the same code style.  
  You might find some warnings when you run `$ npm start`.  
  It doesn't really affect any performance but it would be great if you could follow the instruction and fix the style issues.  
- I included the `.env` since it's easier for us to develop, normally we shouldn't do that though.  


# mlab(MONGODB) setup and operations  
- Defining the MONGOURI variable in server.js
- Defining or creating the model files which represent the data schema like the dbSchema.js file in the models folder
- Creating an object to the model using mongoose package and connecting to mongodb using MONGOURI
- Using the object we can do all sort of operations on the database.
- Please refer to the comments that have updated in the server.js file for more clarity.
- Or else you can refer to the following links
   - https://www.w3schools.com/nodejs/nodejs_mongodb_createcollection.asp
   - https://medium.com/@umarmagaji/connecting-mongodb-using-mlab-with-node-js-application-fd3de5b94a7a
   - https://medium.com/better-programming/how-to-use-mongoose-with-node-js-913a8073b29c
