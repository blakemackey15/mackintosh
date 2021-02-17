import express from 'express';

const app = express();
const port = 3000;
app.get('/', (req, res) => {
  res.sendFile('index.html', {root: './views'});
});
app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});