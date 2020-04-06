


const handleEntries = (req,res)  => {
    const {id} = req.body;
    db('users').where('id', '=', id)
    .increment('entries',1)
    .returning('entries' )
    .then(entries => {
        res.send(entries[0])
    }).catch(err => res.status(400).json('can t update entries'))
}

module.exports = {
    handleEntries:handleEntries
}