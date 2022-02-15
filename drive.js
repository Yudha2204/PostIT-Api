const { google } = require('googleapis')

const path = require('path');
const dbController = require('./databaseController');
const fs = require('fs');


const CLIENT_ID = '262786399580-ahknd5pohkapbmqfi241t7rclbgrqn8n.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = '1//04kszuSXI_GwsCgYIARAAGAQSNwF-L9IrVyF9MeCgg4R3tJxHyHgDNYzXF9rDxUjcJ4qrPqT3C8W2wm-yBC2U9Xs9p1KZaUsO3Xc';

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
});


const apis = {};

apis.uploadFile = async(data, res) => {
    const filePath = path.join('./', data.name);
    try {

        const response = await drive.files.create({
            requestBody: {
                name: data.name,
                mimeType: data.type,
            },
            media: {
                mimeType: data.type,
                body: fs.createReadStream(filePath),
            },
        });
        await drive.permissions.create({
            fileId: response.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });
        await dbController.insertNewVideo(1, response.data.id).catch((e) => {
            console.log("Insert New Video", e)
        });
    } catch (error) {
        console.log("Upload new video", error)
    }
}

// uploadFile();

// async function generatePublicUrl() {
//     try {
//         const result = await drive.files.get({
//             fileId: '19yCq5NJqciQVgfifIcG_jhAdohK1GBz9',
//             fields: 'webViewLink, webContentLink',
//         });
//         console.log(result.data);
//     } catch (error) {
//         console.log(error.message);
//     }
// }

// generatePublicUrl();

module.exports = apis;