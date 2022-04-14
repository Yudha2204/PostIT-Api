const sql = require('mssql');
const sqlConfig = require('./dbconfig');

var config = {
    user: 'yudha1404_Test',
    password: '123456',
    server: 'sql.bsite.net\\MSSQL2016',
    database: 'yudha1404_Test',
    options: {
        trustServerCertificate: true
    }
};
const dbController = {};

dbController.insertNewVideo = async(userId, fileId, file) => {
    try {
        let pool = await sql.connect(config);
        let url = `https://alhijrah.sch.id/imagefishery/` + fileId;
        await pool.request().query(`INSERT INTO tblVideo VALUES(${userId}, '${fileId}', '${url}', ${0}, '${file.title}', '${file.description}', '${file.sumber}', '${file.size}', DEFAULT)`);
    } catch (error) {
        throw error;
    }
}

dbController.getListVideo = async(date, type) => {
    try {
        let pool = await sql.connect(config);
        let query = '';
        if (type == 'refresh') {
            query = `SELECT TOP 10 v.VideoID, v.Title, v.Description, v.URL, (SELECT COUNT(*) FROM tblUserLike ul WHERE ul.VideoID = v.VideoID) AS LikeCount, v.UploadDate, 
            CAST((SELECT COUNT(tblUserLike.UserId) FROM tblUserLike WHERE tblUserLike.VideoID = v.VideoID and tblUserLike.UserID = 1) AS bit) AS isLike
            FROM tblVideo WHERE v.UploadDate > '${date}' ORDER BY v.UploadDate DESC`;
        } else if (date == 'undefined') {
            query = `SELECT TOP 20 v.VideoID, v.Title, v.Description, v.URL, (SELECT COUNT(*) FROM tblUserLike ul WHERE ul.VideoID = v.VideoID) AS LikeCount, v.UploadDate, 
            CAST((SELECT COUNT(tblUserLike.UserId) FROM tblUserLike WHERE tblUserLike.VideoID = v.VideoID and tblUserLike.UserID = 1) AS bit) AS isLike
            FROM tblVideo v ORDER BY v.UploadDate DESC`;
        } else {
            query = `SELECT TOP 10 v.VideoID, v.Title, v.Description, v.URL, (SELECT COUNT(*) FROM tblUserLike ul WHERE ul.VideoID = v.VideoID) AS LikeCount, v.UploadDate, 
            CAST((SELECT COUNT(tblUserLike.UserId) FROM tblUserLike WHERE tblUserLike.VideoID = tblVideo.VideoID and tblUserLike.UserID = 1) AS bit) AS isLike
            FROM tblVideo WHERE v.UploadDate < '${date}' ORDER BY v.UploadDate DESC`;
        }
        const result = await pool.request().query(query);
        return result;
    } catch (error) {
        console.log(error);
    }
}

dbController.likeContent = async(userId, contentId, isLike) => {
    try {
        let pool = await sql.connect(config);
        let query = '';
        if (isLike) {
            query = `INSERT INTO tblUserLike VALUES (${userId}, ${contentId})`;
        } else {
            query = `DELETE FROM tblUserLike WHERE UserId = ${userId} AND VideoID = ${contentId}`;
        }
        await pool.request().query(query);
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}

dbController.getMyVideos = async(userId) => {
    try {
        let pool = await sql.connect(config);
        let query = 'SELECT VideoID, FileID, URL, Title, Description, Sumber, UploadDate FROM tblVideo WHERE UserID = ' + userId;
        const result = await pool.request().query(query, [userId]);
        return result;
    } catch (error) {
        console.log(error)
        return false;
    }
}

dbController.deleteVideos = async(videoId) => {
    try {
        let pool = await sql.connect(config);
        let query = 'DELETE FROM tblVideo WHERE VideoID = ' + videoId;
        const result = await pool.request().query(query);
        return result;
    } catch (error) {
        console.log(error)
        return false;
    }
}




module.exports = dbController;