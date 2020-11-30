export const config = {
  sous: {
    domain: 'http://127.0.0.1:3000',
    apiUrl: process.env.REACT_APP_DEV ? 'http://127.0.0.1:8080/api/v1/' : 'https://sous-chef-recipe.herokuapp.com/api/v1/',
  },
}