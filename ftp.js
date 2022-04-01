const path = require('path');
const dbController = require('./databaseController');
const ftpClient = require('basic-ftp');


const apis = {};

function generateString() {
    let allChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890~=';
    let result = '';
    for (let i = 0; i < 20; i++) {
        result += allChar.charAt(Math.floor(Math.random() * allChar.length));
    }

    return result;
}

apis.uploadFile = async(data) => {
    const filePath = path.join('./', "ff" + data.fileName);
    try {

        const ftp = new ftpClient.Client();

        await ftp.access({
            host: "ftp.alhijrah.sch.id",
            user: "u1696374",
            password: "tidaktau321",
        })

        const result = await ftp.uploadFrom(filePath, `./public_html/postit/${data.fileName}`);

        if (result.code == 226) {
            await dbController.insertNewVideo(1, response.data.id, data).catch((e) => {
                console.log("Insert New Video", e)
            });
        }

    } catch (error) {
        console.log("Upload new video", error)
    }
}
module.exports = apis;