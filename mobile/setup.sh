#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Install iOS dependencies
echo "Installing iOS dependencies..."
cd ios
pod install
cd ..

# Start the development server
echo "Starting development server..."
npm start 