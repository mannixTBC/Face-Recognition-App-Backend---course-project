



const handleRegister = (req,res,db,bcrypt) => {
    const {email,name,pasword} = req.body
    if(!email || !name || !pasword){
       return res.status(400).json('incorect form submision')
    }
    const hash = bcrypt.hashSync(pasword)
    db.transaction(trx=> {
        trx.insert({
            hash:hash,
            email:email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            console.log(loginEmail)
            return trx('users').returning('*').insert({
                email:loginEmail[0],
                name:name,
                joined: new Date()
            }).then(user => {
                res.json(user[0])
            })
        }).then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register'))

}

module.exports={
    handleRegister:handleRegister
}