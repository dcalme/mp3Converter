/* Modules */
const fs = require('fs');
const axios = require('axios');
const { exec } = require("child_process");

/* Config */
const config = require('./conf.json');

async function getMP3File(file_url, title, artiste, songtitle) {
    axios.get(file_url, {responseType: "stream"})
    .then(function (response) {
        let stream = fs.createWriteStream(`${config.path}${title}.mp3`)
        response.data.pipe(stream)

        stream.on('finish', () => {
            console.log('File Created')
            editMP3metadata(artiste, title, songtitle)
        })
    })
    .catch(function (error) {
        console.log(`Error during download ${error}`)
        
    })
}

function editMP3metadata(artiste, title, songtitle) {
    exec(`id3v2 -a "${artiste}" "${config.path}${title}.mp3" && id3v2 -t "${songtitle}" "${config.path}${title}.mp3"`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return
        }
        console.log(`stdout: ${stdout}`);
        return
    })
}

module.exports = {
    getMP3File: getMP3File,
};