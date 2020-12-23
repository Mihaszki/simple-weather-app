const express = require('express');
const app = express();
const port = 3000;
// You can get api key from openweathermap.org
const { api_key } = require('./weather_api_config.json');

app.get('/', (req, res) => {
    res.send('It works!');
})

app.get('/location/:location/', (req, res) => {
    res.send('Got it!');
    console.log(api_key);
    console.log(req.params.location);
})

app.listen(port, () => {
    console.log(`simple-weater-app-backend listening at port: ${port}`);
})
