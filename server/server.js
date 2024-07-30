const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); 
const express = require('express');
const mongoose = require('mongoose'); 
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => authMiddleware({ req }),
});

const startServer = async () => {
  try {
   
    const MONGODB_URI = 'mongodb+srv://user:vsyly40YLYomMGuB@cluster0.ln9p6bm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');

    await server.start();
    server.applyMiddleware({ app });

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/build')));
    }

    app.listen(PORT, () => {
      console.log(`🌍 Now listening on http://localhost:${PORT}`);
      console.log(`🚀 GraphQL server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });

  } catch (error) {
    console.error('Error connecting to MongoDB Atlas', error);
  }
};

startServer().catch(err => {
  console.error('Error starting the server', err);
});
