const mongoose = require('mongoose');
//mongodb://localhost:27017
//mongodb+srv://ayan:LYF9VV0fDgZOAMhr@inotebookbase.2dpxe3d.mongodb.net/
const connectToMongo = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/inotebook', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = connectToMongo;
