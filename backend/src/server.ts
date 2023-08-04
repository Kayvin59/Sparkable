import dotenv from 'dotenv';
import app from './app';
import dataSource from './data-source';
import { scheduledActions } from './scheduledActions';

dotenv.config();

const port = process.env.PORT;

dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err:any) => {
    console.error('Error during Data Source initialization:', err);
  });

scheduledActions.forEach((job) => {
  job.start();
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
