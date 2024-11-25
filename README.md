# Weather-Dashboard 

This project is an Telegram based weather bot with Dashboard built using the MERN stack (MongoDB, Express, React, Node.js).

## Project Setup

To get started with the project, follow the steps below:

First, clone the repository, navigate to the project folder, install all dependencies, and configure the environment variables.

```bash
## Clone the repository
git clone https://github.com/Insidenhhset/Weather-dashboard-.git

## To Run dashboard Navigate to weatherpanel
cd weatherpanel/backend

## Install backend dependencies and run backend
npm install
nodemon server.js

#3 If your frontend is in a separate folder, navigate to it and install frontend dependencies
cd ..
npm install
npm start

#Run bot server which is located in telegram-weather-bot
npm install
npm start

## Create a .env file in the root directory and add the following environment variables:

PORT=5000
MONGODB_URL=YOUR_DB_URL
BOT_TOKEN=YOUR_BOT_TOKEN
WEATHER_API_KEY=YOUR_API_KEY
BACKEND_URL=http://localhost:5000
BOT_URL=http://localhost:3001
JWT_SECRET=YOUR_JWT_SECRET
BASE_URL=http://localhost:3000
