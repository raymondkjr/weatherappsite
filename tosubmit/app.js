// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// [START gae_node_request_example]
const express = require('express');
const cors = require('cors');

const https = require('https');

const app = express();

app.use(express.static('dist'));
app.use(cors());
app.get('/:lat,:long', (req, res) => {
    //res.send(JSON.stringify("hello" + req.params.lat));
    var url = "https://api.tomorrow.io/v4/timelines?location=" + req.params.lat + "," + req.params.long + "&fields=temperature,temperatureApparent,temperatureMin,temperatureMax,windSpeed,windDirection,humidity,pressureSeaLevel,weatherCode,precipitationProbability,precipitationType,sunriseTime,sunsetTime,visibility,cloudCover,uvIndex&timesteps=1d&timesteps=1h&timesteps=current&timezone=America/Los_Angeles&units=imperial&apikey=hRLZhurdz2OEdZprhgDi3L5YdhsnYxLc";
    https.get(url, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            res.send(data);
        });
    });
    //res.send(url);
    //let repsonse = await fetch(url);
    //let data = await response.json();
    //res.send(JSON.stringify(data));
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;
