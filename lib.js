/* Modules */
const fs = require('fs');
const axios = require('axios');

/* Config */
const config = require('./conf.json');

async function getMP3File(file_url, title) {
    axios.get(file_url, {responseType: "stream"})
    .then(function (response) {
        response.data.pipe(fs.createWriteStream(`${config.path}${title}.mp3`));
    })
    .catch(function (error) {
        console.log(error);
    });
}

module.exports = {
    getMP3File: getMP3File,
};