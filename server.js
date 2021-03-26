const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const app = express()
const knex = require('knex')
const register = require('./controllers/register')
const signin = require('./controllers/signin')
const updateProfile = require('./controllers/updateProfile')
const updateEntries = require('./controllers/updateEntries')


const db = knex({
    client: 'pg',
    connection: {
      connectionString:process.env.DATABASE_URL,
      ssl:false,
    }
  });

 

app.use(express.json());
app.use(cors());




app.post('/signin', (req,res) => {signin.handleSignIn(req,res,db,bcrypt)})

app.post('/register', (req,res) => {register.handleRegister(req,res,db,bcrypt)})

app.get("/profile/:id", (req,res) => {updateProfile.updateProfile(req,res,db)} )

app.put('/image', (req,res) => {updateEntries.handleEntries(req,res,db)})


app.listen(process.env.PORT || 3000, () => {
    console.log(`app is runing on port ${process.env.PORT}`)
})