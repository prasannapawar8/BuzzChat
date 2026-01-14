@echo off
REM Real-time Chat Application - Windows Setup Helper
REM Usage: setup.bat [command]

setlocal enabledelayedexpansion

REM Colors using color codes
set GREEN=2
set RED=C
set YELLOW=E
set BLUE=1

cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   Real-time Chat Application - Windows Helper              ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check command line argument
if "%1"=="" (
    goto help
) else if "%1"=="setup" (
    goto setup_project
) else if "%1"=="env" (
    goto setup_env
) else if "%1"=="start" (
    goto start_dev
) else if "%1"=="build" (
    goto build_prod
) else if "%1"=="test" (
    goto test_api
) else if "%1"=="clean" (
    goto cleanup
) else if "%1"=="help" (
    goto help
) else (
    color 0C
    echo Error: Unknown command "%1"
    color 0F
    echo.
    goto help
)

:setup_project
color 0E
echo.
echo 1/3: Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo Error: Node.js is not installed
    echo Download from: https://nodejs.org
    color 0F
    exit /b 1
)
color 0A
echo OK: Node.js found
echo.

color 0E
echo 2/3: Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    color 0C
    echo Error: Failed to install server dependencies
    color 0F
    exit /b 1
)
color 0A
echo OK: Server dependencies installed
cd ..
echo.

color 0E
echo 3/3: Installing client dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    color 0C
    echo Error: Failed to install client dependencies
    color 0F
    exit /b 1
)
color 0A
echo OK: Client dependencies installed
cd ..
echo.

color 0E
echo Running: setup.bat env
call setup.bat env
goto end

:setup_env
color 0E
echo.
echo Setting up environment files...
echo.

if not exist server\.env (
    copy server\.env.example server\.env
    color 0A
    echo OK: Created server\.env
    color 0E
    echo Edit server\.env with your values
)

if not exist client\.env (
    copy client\.env.example client\.env
    color 0A
    echo OK: Created client\.env
    color 0E
    echo Edit client\.env with API URL
)
echo.
color 0A
echo OK: Environment setup complete
goto end

:start_dev
color 0E
echo.
echo Starting development servers...
echo.
if "%2"=="-server" (
    color 01
    echo Starting backend only...
    cd server
    call npm run dev
) else if "%2"=="-client" (
    color 01
    echo Starting frontend only...
    cd client
    call npm run dev
) else (
    color 01
    echo Start development servers:
    echo.
    echo Command Prompt 1:
    echo   cd server
    echo   npm run dev
    echo.
    echo Command Prompt 2:
    echo   cd client
    echo   npm run dev
    echo.
    color 0E
    echo Then open browser to: http://localhost:5173
)
goto end

:build_prod
color 0E
echo.
echo Building for production...
echo.

echo Backend ready at: \server\server.js
echo.

color 0E
echo Building frontend...
cd client
call npm run build
if %errorlevel% neq 0 (
    color 0C
    echo Error: Frontend build failed
    color 0F
    exit /b 1
)
color 0A
echo OK: Frontend built successfully
echo Output: \client\dist
cd ..
goto end

:test_api
color 0E
echo.
echo Testing API endpoints...
echo.

color 01
echo Testing health check...
curl http://localhost:5000/health
echo.

color 01
echo Testing register endpoint...
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
echo.

color 0A
echo OK: API test complete
goto end

:cleanup
color 0E
echo.
echo Cleaning up...
echo.

set /p delete_node="Delete node_modules? (y/n): "
if /i "%delete_node%"=="y" (
    color 0E
    echo Deleting node_modules...
    rmdir /s /q server\node_modules 2>nul
    rmdir /s /q client\node_modules 2>nul
    color 0A
    echo OK: Cleaned node_modules
)

set /p delete_env="Delete .env files? (y/n): "
if /i "%delete_env%"=="y" (
    color 0E
    echo Deleting .env files...
    del /q server\.env 2>nul
    del /q client\.env 2>nul
    color 0A
    echo OK: Cleaned .env files
)
goto end

:help
color 0E
echo.
echo Available Commands:
echo.
color 0A
echo setup.bat setup       - Install dependencies
echo setup.bat env         - Setup environment files
echo setup.bat start       - Start development servers
echo setup.bat build       - Build for production
echo setup.bat test        - Test API endpoints
echo setup.bat clean       - Clean up node_modules and .env
echo setup.bat help        - Show this help
echo.
color 0E
echo Examples:
echo.
echo   setup.bat setup          # First time setup
echo   setup.bat env            # Setup .env files
echo   setup.bat start          # Start dev servers
echo   setup.bat start -server  # Start backend only
echo   setup.bat start -client  # Start frontend only
echo   setup.bat build          # Production build
echo.
goto end

:end
color 0F
echo.
