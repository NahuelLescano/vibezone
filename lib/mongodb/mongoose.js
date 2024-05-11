const mongoose = require('mongoose');
let isConnected = false

export const connectToDB = async() =>{
  mongoose.set('stickQuery',true)
  if(isConnected){
    console.log('MogoDB is already connected')
    return
  }
  try{
    await mongoose.connect(process.env.MONGODB_URL,{
      dbName: 'VibeZone',
      useNewUrlPArse: true,
      useUnifiedTopology: true,
    });
    isConnected= true;
    console.log('MongoDB is connected')
  }catch(error){
    console.log(error)
  }
} 