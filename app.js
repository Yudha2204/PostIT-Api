const express = require('express');
const dbController = require('./databaseController');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

const PORT = process.env.PORT || 4300;
const driveAPI = require('./drive');

const app = express()
    .use(cors())
    .use(bodyParser.json({ limit: '100mb' }));

app.listen(PORT, () => {
    console.log(`Listening Port ${PORT}`)
})

app.get('/videos', async(req, res) => {
    const data = req.query;
    const result = await dbController.getListVideo(data.date, data.type);
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
    fs.writeFile('./' + file.fileName, base64data, 'base64', async(err) => {
        if (err) {
            console.log('write file', err);
        }
    });


    await ffmpeg('./' + file.fileName)
        .setFfmpegPath(ffmpegPath)
        .output('./ff' + file.fileName)
        .setStartTime(file.start)
        .setDuration(file.end)
        .on('end', async() => {
            await driveAPI.uploadFile(file).then(() => {
                fs.unlink('./' + file.fileName, (err) => {
                    console.log('delete file from server', err);
                })
                fs.unlink('./ff' + file.fileName, (err) => {
                    console.log('delete file from server', err);
                })

                res.status(200).send({ result: "OK" })
            })
        })
        .on('error', (err) => {
            console.log(err)
        })
        .run();



})