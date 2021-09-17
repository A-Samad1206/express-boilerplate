const mongoose = require('mongoose');
const url = process.env.MONGO_URI;
console.log('urlurlurlurl', url);
module.exports = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(`Mongodb connected....`.cyan.bold);
    })
    .catch((err) => {
      {
        console.log(`==========================================`.red.bold);
        console.log(
          `Error From Catch Block of Mongoose connection logic`.red.bold
        );
        console.log(err.message);
        console.log(
          `*******************************************`.red.underline.bold
        );
      }
    });

  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to db...');
  });

  mongoose.connection.on('error', (err) => {
    console.log(err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected...');
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log(
        'Mongoose connection is disconnected due to app termination...'
      );
      process.exit(0);
    });
  });
};
