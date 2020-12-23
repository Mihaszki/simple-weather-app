const express = require('express');
const https = require('https');
const app = express();
const port = 3000;
// You can get api key from openweathermap.org
const { api_key } = require('./weather_api_config.json');

app.get('/', (req, res) => {
    res.send('It works!');
});

app.get('/location/:location/', (req, res) => {
    if (!req.params.location) {
        res.status(500);
        res.send({ 'Error': 'You haven\'t specified your location!' });
        console.log('You haven\'t specified your location!');
    }

    // 5 day forecast with 3-hour step
    https.get(`https://api.openweathermap.org/data/2.5/forecast?q=${req.params.location}&units=metric&lang=en&appid=${api_key}`, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            console.log('The whole response has been received!');
            res.send(JSON.parse(data));
        });

    // An error has been received.
    }).on('error', (err) => {
        res.status(500);
        res.send({ 'Error': err.message });
        console.log('Error: ' + err.message);
    });
});

app.listen(port, () => {
    console.log(`simple-weater-app-backend listening at port: ${port}`);
});