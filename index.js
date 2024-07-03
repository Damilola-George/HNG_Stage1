require('dotenv').config();
const express = require('express');
const { default: axios } = require('axios');

const app = express();
const apiKey = process.env.API_KEY;


app.get('/api/hello', async (req, res) => {
  const visitor_name = req.query.visitor_name || 'Guest';
  const client_ip =
  (req.headers['x-forwarded-for']
    ? req.headers['x-forwarded-for'].split(',')[0].trim()
    : req.socket.remoteAddress);


  try {
    const geoResponse = await axios.get(`https://ipapi.co/${client_ip}/json/`);
    const { city } = geoResponse.data;

    const tempResponse = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
    );
    const { temp_c } = tempResponse.data.current;

    const greeting = `Hello, ${visitor_name}! The temperature is ${temp_c} degrees Celsius in ${city}`;

    // console.log(visitor_name, client_ip, city);
    res.json({
      client_ip: client_ip,
      location: city,
      greeting: greeting,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.all('*', (req, res) => {
  res.status(404).json({
    message: 'Data not found',
  });
});

app.listen(8000, () => {
  console.log('Server is listening on port 8000');
});






