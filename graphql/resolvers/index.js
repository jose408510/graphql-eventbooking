const bcrypt = require('bcryptjs')

const Event = require('../../models/event')
const User = require('../../models/user')

const events = eventIds => {
    return Event.find({_id: {$in: eventIds}})
    .then(events => {
        return events.map(event => {
            return { ...event._doc, id: event.id, creator: user.bind(this, event.creator)}
        })
    })
    .catch(err => {
        throw err;
    }) 
}


const user = userId => {
    return User.findById(userId)
    .then(user => {
        return { 
            ...user._doc,
             _id: user.id,
            createEvents: events.bind(this, user._doc.createEvents)
        }
    })
    .catch( err => {
        throw err;
    })
}


module.exports = { events: () => {
       return Event.find()
       .populate('creator')
        .then(events => {
            return events.map(event => { //to remove metadata that comes with mongoose 
                return {
                    ...event._doc ,
                     _id: event._doc._id.toString(),
                     creator: user.bind(this, event._doc.creator)
                 }
            })
        })
        .catch()
    },
    createEvent: args => {
        const event = new Event ({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: "5c1807129c9d8d9060bce20c"
        })
        let createdEvent;
        console.log(event)
        return event
        .save()
        .then(result => {
            createdEvent = {...result._doc , _id: event.id }
            return User.findById("5c1807129c9d8d9060bce20c")
        })
        .then( user => {
            if(!user) {
                throw new Error(" User not found")
            }
            console.log(event)
            user.createdEvents.push(event) //createdEvents from models in user 
            return user.save()
        }).then(result => {
            return createdEvent;
        })
        .catch(err => {
            console.log(err)
            throw err;
        })
    },
    createUser: args => {
        return User.findOne({
            email: args.userInput.email
        }).then(user => {
            if(user) {
                throw new Error('User exist Already')
            }
            return bcrypt.hash(args.userInput.password, 12)
        })
        return bcrypt // saying bascilly wait until its resolved asyn opperation
        .hash(args.userInput.password , 12)
        .then( hashedPassword => {
            const user = new User ({
                email: args.userInput.email,
                password: hashedPassword
            });
            return user.save();
        })
        .then( result =>{
            return { ...result._doc, _id: result.id }
        })
        .catch(err => {
            throw err; 
        })
    }
}