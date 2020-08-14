const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

dotenv.config({ path: './config.env' });

const uri = process.env.DATABASE_URL;
mongoose
  .connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB is connected 🚀'));

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);

  //if i'm use directly process.exit it stop server immediately means it not good but we stop server gracefully so first close all request then close server
  server.close(() => {
    process.exit(1); //it shutdown process 0:success 1:uncalled exception
  });
});

//each time some where in application unhandled Rejection also promise rejection occur then the process object emit new () is unhandledRejection ;
