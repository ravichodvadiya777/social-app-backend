import express, {Express} from 'express';
import router from './routes';
const app:Express = express();
const port = 3000;
// const name = 'asf'

app.use(router)

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});