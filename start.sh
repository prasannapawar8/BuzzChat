#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting Chat Application...${NC}"

# Check if Docker is running
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

# Check if Docker daemon is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker daemon is not running${NC}"
    exit 1
fi

# Build Docker image
echo -e "${YELLOW}📦 Building Docker image...${NC}"
docker build -t chat-app-server ./server

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to build Docker image${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker image built successfully${NC}"

# Start MongoDB container
echo -e "${YELLOW}📦 Starting MongoDB...${NC}"
docker run -d --name mongodb -p 27017:27017 mongo:latest

sleep 2

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to start MongoDB${NC}"
    exit 1
fi

echo -e "${GREEN}✅ MongoDB started${NC}"

# Start backend server
echo -e "${YELLOW}🔧 Starting backend server...${NC}"
docker run -d --name chat-app-server \
  --link mongodb \
  -p 5000:5000 \
  -e MONGODB_URI=mongodb://mongodb:27017/chat-app \
  -e JWT_SECRET=development_secret \
  -e CLOUDINARY_NAME=$CLOUDINARY_NAME \
  -e CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY \
  -e CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET \
  -e CLIENT_URL=http://localhost:5173 \
  chat-app-server

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to start backend server${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Backend server started${NC}"

# Install frontend dependencies and start dev server
echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
cd client
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend dependencies installed${NC}"

echo -e "${GREEN}✅ All services started!${NC}"
echo -e "${YELLOW}Frontend: http://localhost:5173${NC}"
echo -e "${YELLOW}Backend: http://localhost:5000${NC}"
echo -e "${YELLOW}API: http://localhost:5000/api${NC}"

npm run dev
