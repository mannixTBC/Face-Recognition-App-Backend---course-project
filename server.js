const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const app = express()
const knex = require('knex')
const register = require('./controllers/register')




const db = knex({
    client: 'pg',
    connection: {
      connectionString:process.env.DATABASE_URL,
      ssl:false,
    }
  });

 

app.use(express.json());
app.use(cors());

const database = {
    users:[
        {id:'123',
        name:'user',
        email:'user@yahoo.com',
        pasword:'userpas',
        entries :0,
        join:new Date()
         }, 
         {id:'124',
         name:'john',
         email:'john@yahoo.com',
         pasword:'userpas2',
         entries :0,
         join:new Date()
          },
          {id:'1244',
         name:'john',
         email:'john@yahoo.com',
         pasword:'userpas2',
         entries :0,
         join:new Date()
          }
    ],
    login:[
        {id:'123',
        has:'',
        email:'user@yahoo.com'
    }
    ]
}
app.get('/', (req,res)=>{
    res.send(database);
})

app.post('/signin', (req,res) => {
  
    db.select('email', 'hash').from('login')
    .where('email','=', req.body.email)
   .then(data=>{
       
       const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
       
       if(isValid){
           return db.select('*').from('users')
           .where('email','=',req.body.email)
           .then(user=>{
            res.json(user[0])
           })
           .catch(err=> res.status(400).json(err))
       }else{
        res.status(400).json('wrong user name or pasword')
       }
       
   } ).catch(err=> res.status(400).json(err))
})

app.post('/register', (req,res) => {register.handleRegister(req,res,db,bcrypt)})

app.get("/profile/:id", (req,res) => {
    const {id} = req.params;
   
    db.select('*').from('users').where({
        id:id
    }).then(user => {
        if(user.length){
            res.json(user[0])
        }else{
            res.status(400).json('not found')
        }
        
    }).catch(err => res.status(400).json('error geting user'))
    
} )

app.put('/image', (req,res) => {
    const {id} = req.body;
    db('users').where('id', '=', id)
    .increment('entries',1)
    .returning('entries' )
    .then(entries => {
        res.send(entries[0])
    }).catch(err => res.status(400).json('can t update entries'))
})






app.listen(process.env.PORT || 3000, () => {
    console.log(`app is runing on port ${process.env.PORT}`)
})