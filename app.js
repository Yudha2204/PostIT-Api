const express = require('express');
const dbController = require('./databaseController');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const PORT = process.env.PORT || 4300;

const driveAPI = require('./drive');

const app = express()
    .use(cors())
    .use(bodyParser.json({ limit: '100mb' }));

app.listen(PORT, () => {
    console.log(`Listening Port ${PORT}`)
})

app.get('/videos', async(req, res) => {
    const data = req.body;
    const result = await dbController.getListVideo(data.date);
    res.send(result.recordset);
})

app.put('/likeContent', async(req, res) => {
    const data = req.body;
    const result = await dbController.likeContent(data.userId, data.contentId, data.isLike);
    if (result) {
        res.send({ result: "OK" });
    } else {
        res.status(500);
        res.send({ result: "Error When Try To Like Or Unlike This Content This Content" });
    }
})

app.post('/uploadFile', async(req, res) => {
    const file = req.body;
    const base64data = file.base64.replace(/^data:.*,/, '');
    fs.writeFile('./files/' + file.name, base64data, 'base64', async(err) => {
        if (err) {
            res.status(500).send(err);
            return;
        }

    });

    await driveAPI.uploadFile(file, res).then(() => {
        fs.unlink('./files/' + file.name, (err) => {
            res.status(500).send(err)
        })
    })
    res.status(200).send({ result: "OK" })
})