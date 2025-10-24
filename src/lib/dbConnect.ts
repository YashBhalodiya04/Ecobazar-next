import mongoose from "mongoose";

type connectionObject = {
  isConnected: number;
};

const connection = {} as connectionObject;

const dbconnect = async (): Promise<void> => {
  if (!process.env.MONDODB_URL) {
  throw new Error("Please add your Mongo URI to .env.local");
}

  if (connection.isConnected) {
    console.log("already connected");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONDODB_URL as string);
    connection.isConnected = db.connections[0].readyState;
    console.log("db connected");
  } catch (error) {
    console.error("Database connection failed",error);
    process.exit(1);
  }
};

export default dbconnect;
