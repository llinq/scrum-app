@echo off
REM Script para executar todas as verificações localmente antes de fazer push (Windows)

echo Running local CI checks...

echo Checking dependencies for security vulnerabilities...

REM API Security Audit
echo Auditing API dependencies...
cd scrum-app-api
call yarn audit --audit-level=high
if %errorlevel% neq 0 (
    echo [ERROR] API security audit failed
    exit /b 1
)
echo [OK] API security audit passed
cd ..

REM Web Security Audit
echo Auditing Web dependencies...
cd scrum-app-web
call npm audit --audit-level=high
if %errorlevel% neq 0 (
    echo [ERROR] Web security audit failed
    exit /b 1
)
echo [OK] Web security audit passed
cd ..

echo Installing dependencies...

REM Install API dependencies
cd scrum-app-api
call yarn install --frozen-lockfile
if %errorlevel% neq 0 (
    echo [ERROR] API dependencies installation failed
    exit /b 1
)
echo [OK] API dependencies installation passed
cd ..

REM Install Web dependencies
cd scrum-app-web
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Web dependencies installation failed
    exit /b 1
)
echo [OK] Web dependencies installation passed
cd ..

echo Running linting...

REM API Lint
cd scrum-app-api
call npm run lint
if %errorlevel% neq 0 (
    echo [ERROR] API linting failed
    exit /b 1
)
echo [OK] API linting passed
cd ..

REM Web Lint
cd scrum-app-web
call npm run lint
if %errorlevel% neq 0 (
    echo [ERROR] Web linting failed
    exit /b 1
)
echo [OK] Web linting passed
cd ..

echo Type checking...

REM API Type Check
cd scrum-app-api
call npx tsc --noEmit
if %errorlevel% neq 0 (
    echo [ERROR] API type checking failed
    exit /b 1
)
echo [OK] API type checking passed
cd ..

REM Web Type Check
cd scrum-app-web
call npx tsc --noEmit
if %errorlevel% neq 0 (
    echo [ERROR] Web type checking failed
    exit /b 1
)
echo [OK] Web type checking passed
cd ..

echo Building applications...

REM Build API
cd scrum-app-api
call yarn build
if %errorlevel% neq 0 (
    echo [ERROR] API build failed
    exit /b 1
)
echo [OK] API build passed
cd ..

REM Build Web
cd scrum-app-web
set NEXT_PUBLIC_API_URL=http://localhost:3001
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Web build failed
    exit /b 1
)
echo [OK] Web build passed
cd ..

echo All checks passed! Ready to push!
