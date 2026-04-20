#!/bin/bash
set -e

echo "=================================="
echo "  Evergreen Bank - Deploy Script  "
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_NAME="evergreen-bank"
PROJECT_NAME="evergreen-bank"

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: git is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}All prerequisites met${NC}"
echo ""

# Step 1: GitHub Setup
echo -e "${BLUE}Step 1: GitHub Setup${NC}"
echo "---------------------"

# Check if gh CLI is installed
if command -v gh &> /dev/null; then
    echo -e "${GREEN}GitHub CLI (gh) found${NC}"
    
    # Check if authenticated
    if ! gh auth status &> /dev/null; then
        echo -e "${YELLOW}Please authenticate with GitHub${NC}"
        gh auth login --web
    fi
    
    # Check if repo already exists
    if gh repo view "$REPO_NAME" &> /dev/null; then
        echo -e "${YELLOW}Repository '$REPO_NAME' already exists on GitHub${NC}"
    else
        echo "Creating GitHub repository..."
        gh repo create "$REPO_NAME" --public --source=. --push
        echo -e "${GREEN}Repository created and code pushed${NC}"
    fi
else
    echo -e "${YELLOW}GitHub CLI (gh) not found${NC}"
    echo "Please create a GitHub repository manually and push code:"
    echo ""
    echo "  1. Go to https://github.com/new and create a public repo named '$REPO_NAME'"
    echo "  2. Run these commands:"
    echo ""
    echo "     git remote add origin https://github.com/YOUR_USERNAME/$REPO_NAME.git"
    echo "     git branch -M main"
    echo "     git push -u origin main"
    echo ""
    read -p "Press Enter after you've pushed to GitHub..."
fi

echo ""

# Step 2: Vercel Setup
echo -e "${BLUE}Step 2: Vercel Deployment${NC}"
echo "-------------------------"

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    echo -e "${GREEN}Vercel CLI found${NC}"
    
    # Check if authenticated
    if ! vercel whoami &> /dev/null; then
        echo -e "${YELLOW}Please authenticate with Vercel${NC}"
        vercel login
    fi
    
    echo "Deploying to Vercel..."
    vercel --prod
    echo -e "${GREEN}Deployment complete!${NC}"
else
    echo -e "${YELLOW}Vercel CLI not found${NC}"
    echo "Install it with: npm i -g vercel"
    echo ""
    echo "Then run: vercel --prod"
    echo ""
fi

echo ""
echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}  Deployment Process Complete!    ${NC}"
echo -e "${GREEN}==================================${NC}"
echo ""
echo "Your Evergreen Bank app should now be:"
echo "  - On GitHub: https://github.com/YOUR_USERNAME/$REPO_NAME"
echo "  - On Vercel: https://$PROJECT_NAME.vercel.app"
echo ""
echo "Next steps:"
echo "  1. Set up your Supabase project"
echo "  2. Add environment variables in Vercel dashboard"
echo "  3. Configure your domain if needed"
echo ""
