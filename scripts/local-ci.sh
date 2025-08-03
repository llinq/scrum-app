#!/bin/bash

# Script para executar todas as verificações localmente antes de fazer push

echo "Running local CI checks..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para verificar se comando foi bem sucedido
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}[OK] $1 passed${NC}"
    else
        echo -e "${RED}[ERROR] $1 failed${NC}"
        exit 1
    fi
}

echo "Checking dependencies for security vulnerabilities..."

# API Security Audit
echo "Auditing API dependencies..."
cd scrum-app-api
npm audit --audit-level=high
check_status "API security audit"
cd ..

# Web Security Audit
echo "Auditing Web dependencies..."
cd scrum-app-web
npm audit --audit-level=high
check_status "Web security audit"
cd ..

echo -e "${YELLOW}Installing dependencies...${NC}"

# Install API dependencies
cd scrum-app-api
npm ci
check_status "API dependencies installation"
cd ..

# Install Web dependencies
cd scrum-app-web
npm ci
check_status "Web dependencies installation"
cd ..

echo -e "${YELLOW}Running linting...${NC}"

# API Lint
cd scrum-app-api
npm run lint
check_status "API linting"
cd ..

# Web Lint
cd scrum-app-web
npm run lint
check_status "Web linting"
cd ..

echo -e "${YELLOW}Type checking...${NC}"

# API Type Check
cd scrum-app-api
npx tsc --noEmit
check_status "API type checking"
cd ..

# Web Type Check
cd scrum-app-web
npx tsc --noEmit
check_status "Web type checking"
cd ..

echo -e "${YELLOW}Building applications...${NC}"

# Build API
cd scrum-app-api
npm run build
check_status "API build"
cd ..

# Build Web
cd scrum-app-web
NEXT_PUBLIC_API_URL=http://localhost:3001 npm run build
check_status "Web build"
cd ..

echo -e "${GREEN}All checks passed! Ready to push!${NC}"
