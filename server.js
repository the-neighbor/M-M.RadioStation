require('dotenv').config();
require('cors');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port =  process.env.PORT || 3000;

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());
app.use(cors());

let nowPlaying = {}; //empty object for offline state
let history = []; //empty array for offline state

app.get('/nowplaying', (req, res) => {
    res.json(nowPlaying);
});

app.get ('/history', (req, res) => {
    res.json(history);
});

// POST /nowplaying - Update the currently playing show
app.post('/nowplaying', (req, res) => {
    const { password } = req.headers;
    const { show_title, show_host, show_description, cover_img, background_img } = req.body;

    //if nowplaying is not empty, add end time and append to history
    if (password !== process.env.PASSWORD) {
        return res.status(401).json({ error: "Unauthorized" });
    } else {
        if (Object.keys(nowPlaying).length) {
            nowPlaying.end_time = new Date();
            history.push(nowPlaying);
        }
        nowPlaying = {};
        if (show_title && show_host && show_description && cover_img) {
            nowPlaying = { show_title, show_host, show_description, cover_img, background_img, start_time: new Date() };
            res.json({ message: "Now playing updated successfully", nowPlaying });
        } else {
            res.status(400).json({ error: "Invalid request, missing required field" });
        }
    }
});

// POST /endshow - Clear the currently playing show
app.post('/endshow', (req, res) => {
    const { password } = req.headers;
    if (password !== process.env.PASSWORD) {
        return res.status(401).json({ error: "Unauthorized" });
    } else {
        if (Object.keys(nowPlaying).length) {
            nowPlaying.end_time = new Date();
            history.push(nowPlaying);
        }
        nowPlaying = {};
        res.json({ message: "Now playing cleared successfully" });
    }
});

app.listen(port, () => {
    console.log(`Radio station API is running at http://localhost:${port}`);
});