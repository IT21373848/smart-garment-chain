// import mongoose from 'mongoose';

// const MONGODB_URI = process.env.MONGODB_URI as string;

// if (!MONGODB_URI) {
//   throw new Error('Please define the MONGODB_URI environment variable');
// }

// /** 
//  * Cached connection for MongoDB.
//  */
// //@ts-expect-error
// let cached = global?.mongoose;

// if (!cached) {
//   // @ts-expect-error
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function dbConnect() {
//   if (cached.conn) {
//     console.log('Using cached database connection');
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     console.log('Connecting to MongoDB...');
//     cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
//       return mongoose;
//     });
//   }
//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export default dbConnect;