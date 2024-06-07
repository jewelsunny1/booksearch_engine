const express = require('express');
const path = require('path');
//ApolloServer allows you to build a GraphQL API quick and easy.
const {ApolloServer} = require ('apollo-server-express')
const db = require('./config/connection');
const {typeDefs, resolvers} = require('./schemas')
const {authMiddleware} = require ('./utils/auth')
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

//set up Appoloserver
const server= new ApolloServer({
  typeDefs,
  resolvers,
  context:authMiddleware,
  //Refers to middleware used in web applications tohandle authentication
  //Can perform varoious tasks, such as checking if a user us authenticated b/f allowing access to certain router or endpoints
  //authMiddleware is used to check if a req contain valid authentication credentials( JWT token) b/f preceding to the GraphQL resolvers.If the credentials are valid, the middleware would allow the request to proceed; otherwise, it would reject the request or redirect the user to a login page.

})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
}//By setting up your server to serve static files in this way, you create a seamless integration between your front-end and back-end, making your application easier to deploy and manage in production.

//integrate Apollo server with express
const startServer= async ()=>{
  await  server.start();//The start method likely performs tasks like initializing the server, setting up necessary resources, or preparing it to handle incoming requests.
  server.applyMiddleware({app})//This method integrates the Apollo Server with the Express application, allowing the Express app to handle GraphQL requests at the specified middleware path (usually /graphql).

  db.once('open', () => {
    app.listen(PORT, () => 
      console.log(`🌍 Now listening on localhost:${PORT}${server.graphqlPath}`)
  );
});
};

startServer();

app.use(routes);

