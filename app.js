const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Event = require('./models/event')

const app = express();

app.use(bodyParser.json());
const Port = process.env.Port || 3000 

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String! 
        }
        type User {
            _id: ID!
            email: String!
            password: String
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInut {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
           return Event.find()
            .then(events => {
                return events.map(event =>{ //to remove metadata that comes with mongoose 
                    return {...event._doc , _id: event._doc._id.toString() }
                })
            })
            .catch()
        },
        createEvent: args => {
            const event = new Event ({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date)
            })
            return event
            .save()
            .then(result => {
                console.log(result)
                return {...result._doc , _id: event.id }; // 
            })
            .catch(err => {
                console.log(err)
                throw err;
            })
        }
    },
    graphiql: true
  })
)

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-fy13j.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`)
.then(() => {
    app.listen(Port);
}).catch(err => {
    console.log(err);
})
