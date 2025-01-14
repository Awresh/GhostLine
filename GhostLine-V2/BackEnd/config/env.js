// env.mjs
 const config = {
    PORT: process.env.PORT || 5000,
    DB_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/myapp',
    SECRET_KEY: process.env.SECRET_KEY || 'mysecretkey'
  };
  
  module.exports={
    config
  }