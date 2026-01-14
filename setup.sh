#!/bin/bash

# Real-time Chat Application - Setup & Development Helper Scripts

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Real-time Chat Application - Helper Scripts           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function for setup
setup_project() {
    echo -e "${YELLOW}\n📦 Setting up project...${NC}"
    
    # Check Node.js
    if ! command_exists node; then
        echo -e "${RED}❌ Node.js is not installed${NC}"
        echo "Visit: https://nodejs.org"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"
    
    # Setup server
    echo -e "${YELLOW}🔧 Installing server dependencies...${NC}"
    cd server
    npm install
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install server dependencies${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Server dependencies installed${NC}"
    
    # Setup client
    echo -e "${YELLOW}🔧 Installing client dependencies...${NC}"
    cd ../client
    npm install
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install client dependencies${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Client dependencies installed${NC}"
    cd ..
}

# Function to copy env files
setup_env() {
    echo -e "${YELLOW}\n🔐 Setting up environment files...${NC}"
    
    # Server env
    if [ ! -f server/.env ]; then
        cp server/.env.example server/.env
        echo -e "${GREEN}✅ Created server/.env${NC}"
        echo -e "${YELLOW}⚠️  Edit server/.env with your values${NC}"
    fi
    
    # Client env
    if [ ! -f client/.env ]; then
        cp client/.env.example client/.env
        echo -e "${GREEN}✅ Created client/.env${NC}"
        echo -e "${YELLOW}⚠️  Edit client/.env with API URL${NC}"
    fi
}

# Function to start development
start_dev() {
    echo -e "${YELLOW}\n🚀 Starting development servers...${NC}"
    echo -e "${YELLOW}Tip: Use -server or -client flag to run only one${NC}"
    
    # Check if flags provided
    if [ "$1" = "-server" ]; then
        echo -e "${BLUE}Starting backend only...${NC}"
        cd server
        npm run dev
    elif [ "$1" = "-client" ]; then
        echo -e "${BLUE}Starting frontend only...${NC}"
        cd client
        npm run dev
    else
        # Try to start both with concurrently if available
        echo -e "${BLUE}Starting both servers...${NC}"
        echo -e "${YELLOW}Open new terminals:${NC}"
        echo -e "  Terminal 1: cd server && npm run dev"
        echo -e "  Terminal 2: cd client && npm run dev"
    fi
}

# Function to build for production
build_prod() {
    echo -e "${YELLOW}\n🏗️  Building for production...${NC}"
    
    # Build backend (nothing needed, just copy)
    echo -e "${BLUE}Backend ready at: /server/server.js${NC}"
    
    # Build frontend
    echo -e "${YELLOW}Building frontend...${NC}"
    cd client
    npm run build
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Frontend built successfully${NC}"
        echo -e "${BLUE}Output: /client/dist${NC}"
    else
        echo -e "${RED}❌ Frontend build failed${NC}"
        exit 1
    fi
    cd ..
}

# Function to check MongoDB
check_mongodb() {
    echo -e "${YELLOW}\n🗄️  Checking MongoDB...${NC}"
    
    if command_exists mongosh; then
        echo -e "${GREEN}✅ MongoDB CLI found${NC}"
        echo -e "${BLUE}Connecting to MongoDB...${NC}"
        mongosh
    elif command_exists mongo; then
        echo -e "${GREEN}✅ MongoDB CLI found${NC}"
        mongo
    else
        echo -e "${RED}❌ MongoDB CLI not found${NC}"
        echo -e "${YELLOW}Download from: https://www.mongodb.com/try/download/compass${NC}"
    fi
}

# Function to clean up
cleanup() {
    echo -e "${YELLOW}\n🧹 Cleaning up...${NC}"
    
    read -p "Delete node_modules? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf server/node_modules
        rm -rf client/node_modules
        echo -e "${GREEN}✅ Cleaned node_modules${NC}"
    fi
    
    read -p "Delete .env files? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -f server/.env
        rm -f client/.env
        echo -e "${GREEN}✅ Cleaned .env files${NC}"
    fi
}

# Function to test API
test_api() {
    echo -e "${YELLOW}\n🧪 Testing API endpoints...${NC}"
    
    BASE_URL="http://localhost:5000/api"
    
    echo -e "${BLUE}Testing health check...${NC}"
    curl http://localhost:5000/health
    
    echo -e "\n${BLUE}Testing register endpoint...${NC}"
    curl -X POST $BASE_URL/auth/register \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123"
      }'
    
    echo -e "\n${GREEN}✅ API test complete${NC}"
}

# Function to show help
show_help() {
    echo -e "${BLUE}\n📖 Available Commands:${NC}"
    echo -e "${GREEN}./setup.sh setup${NC}       - Install dependencies"
    echo -e "${GREEN}./setup.sh env${NC}         - Setup environment files"
    echo -e "${GREEN}./setup.sh start${NC}       - Start development servers"
    echo -e "${GREEN}./setup.sh build${NC}       - Build for production"
    echo -e "${GREEN}./setup.sh db${NC}          - Connect to MongoDB"
    echo -e "${GREEN}./setup.sh test${NC}        - Test API endpoints"
    echo -e "${GREEN}./setup.sh clean${NC}       - Clean up node_modules & .env"
    echo -e "${GREEN}./setup.sh help${NC}        - Show this help"
    echo -e "\n${YELLOW}Examples:${NC}"
    echo -e "  ./setup.sh setup        # First time setup"
    echo -e "  ./setup.sh env          # Setup .env files"
    echo -e "  ./setup.sh start        # Start dev servers"
    echo -e "  ./setup.sh build        # Production build"
}

# Main script logic
case "${1:-help}" in
    setup)
        setup_project
        setup_env
        echo -e "${GREEN}\n✅ Setup complete!${NC}"
        echo -e "${YELLOW}Next: ./setup.sh start${NC}"
        ;;
    env)
        setup_env
        ;;
    start)
        start_dev "$2"
        ;;
    build)
        build_prod
        ;;
    db)
        check_mongodb
        ;;
    test)
        test_api
        ;;
    clean)
        cleanup
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        show_help
        exit 1
        ;;
esac

echo -e "\n${GREEN}Done!${NC}\n"
