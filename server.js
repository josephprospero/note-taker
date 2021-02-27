const express = require('express');
const uniqid = require('uniqid')
const fs = require('fs');
const path = require('path');
const { dataBase } = require('./db/db.json');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function newNotes(body, dbArray) {
    let note = body;
    dbArray.push(note);

    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ dataBase: dbArray }, null, 2)
    );
    return note;
}

function findById(id, dbArray){
    const result = dbArray.filter(note => note.id === id)[0];
    return result;
}

// Beginning of app.get

app.get('/api/notes', (req, res) => {
    res.json(dataBase);
});

app.get('/api/notes/:id', (req, res) => {
    const result = findById(req.params.id, notes);
    if(result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

// HTML

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

// End of app.get

// Start of app.post
app.post('/api/notes', (req, res) => {
    req.body.id = uniqid();
    console.log(req.body);
    let note = newNotes(req.body, dataBase) 
    res.json(note);
})

app.listen(PORT, () => {
    console.log(`API server is now port ${PORT}`)
})