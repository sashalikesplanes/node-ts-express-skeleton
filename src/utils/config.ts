import dotenv from 'dotenv';
const path = __dirname + `/../../.env.${process.env.NODE_ENV}`;
dotenv.config({ path });

const config = {
  port: process.env.APPLICATION_PORT,
};

export default config;
