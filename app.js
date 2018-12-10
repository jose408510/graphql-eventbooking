const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql')
const app = express();

app.use(bodyParser.json());
const Port = process.env.Port || 3000 

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        
        type RootQuery {
            events: [String!]!
        }

        type RootMutation {
            createEvent(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return ['cooking', 'Saling', 'Coding']
        },
        createEvent: (args) => {
            const eventName = args.name;
            return eventName;
        }
    },
    graphiql: true
  })
)

app.listen(Port, () => {
    console.log(`Listening on Port ${Port}`)
})