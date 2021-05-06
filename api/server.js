// BUILD YOUR SERVER HERE
const express = require('express')
const User = require('./users/model')

const server = express()

server.use(express.json())

server.get('/api/users', (req, res) => {
    User.find()
        .then(users => {
            res.status(200).json(users)
            // returns an array of users
        })
        .catch(() => {
            res.status(500).json({ message: "The users information could not be retrieved" })
        })
})

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id
    User.findById(id)
        .then(users => {
            if(!users) {
                res.status(404).json({message:`The user with the specified ID ${id} does not exist`})
            } else {
                res.json(users)
            }
        })
        .catch(() => {
            res.status(500).json({ message: "The user information could not be retrieved" })
        })
})

server.post('/api/users', (req, res) => {
    const newUser = req.body
    if(!newUser.name || !newUser.bio){
        res.status(400).json({ message: 'Please provide name and bio for the user'})
    } else {
        User.insert(newUser)
            .then(users => {
                res.json(users)
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    }
})

server.put('/api/users/:id', async (req, res) => {
    const id = req.params.id
    const changes = req.body
    
try {
    if (!changes.name || !changes.bio){
        res.status(400).json({ message: "Please provide name and bio for the user" })
    } else {
        const updatedUser = await User.update(id, changes)
        if (!updatedUser) {
            res.status(500).json({ message: "The user information could not be modified" })
        } else {
            res.json(updatedUser)
        }
    }
} catch(err) {
    res.status(404).json({message:`The user with the specified ID ${id} does not exist` })
}

})


server.delete('/api/dogs/:id', async (req, res) => {

    try {
        const removed = await User.remove(req.params.id)
        if(!removed){
            res.status(500).json({ message: "The user could not be removed" })
        } else {
            res.json(removed)
        }
    } catch(err){
        res.status(404).json({message:`The user with the specified ID ${req.params.id} does not exist`})
    }
})




server.use('*', (req, res) => {
    res.status(404).json({ message: 'resource not found in this server'})
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
