import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  return res.send({
    message: 'I am working v3',
  });
});

app.post('', async (req, res) => {
  console.log(req.body);
  return res.send({
    message: 'Hello from post',
  });
});

const PORT = 3000;

try {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
}
