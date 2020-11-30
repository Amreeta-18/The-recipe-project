# Sous Chef  
When people have some ingredients in their fridge but have no idea what to make, they can visit this website, search with the ingredient(s) they have, and get the recipe recommendations based on their ingredients.  
This is a group project of CS 561 Software Engineering Method at Oregon State University.  
## How to use
### Setup
`$ git clone git@github.com:wengair/react-example.git`  
Clone this repo to your computer.  
Since we use the RESTful style to connect the frontend and backend, we need to install the library for both of them.  
`$ npm install`  
Run this command to install all the necessary libraries for the backend (the root folder `/`).  
Then enter the `/frontend` folder and `$ npm install` again to install all necessary libraries for the frontend.  
### During the development
#### Frontend
Now you only need to run `$ npm start` in the frontend folder for frontend development.  
It will connect to Heroku's database automatically.  
#### Backend
Since we use the PostgreSQL database on Heorku and its URL is changing all the time, you need to install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) first so that you can get the correct URL before running the `server.js`.  
Now you need to run `$ npm run dev` in the root folder to get the right URL to connect to Heroku's database.  
Also, you need to run `$ npm run dev` in the frontend folder if you want to try out the new backend with the frontend.

Unlike the frontend, you need to restart the server by `$ npm run dev` again if you made any change.

## File Structure
### Backend
The root folder is the backend folder so basically, the frontend folder is put inside the backend folder.  
`migrations` contains the data schema of this project.  
`receipeRecord` contains the sample data we get from Spoonacular.  
`services` contains files that are called in `server.js`.  
`tests` contains all tests for this website.  

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