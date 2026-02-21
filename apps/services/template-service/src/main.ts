import app from './app';

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(port, () => {
  console.log(`[ ready ] http://0.0.0.0:${port}`);
});
