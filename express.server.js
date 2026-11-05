const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/health', (req, res) => {
  res.status(200).send('Bot service is running');
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});   
