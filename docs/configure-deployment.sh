#!/bin/bash

# Docusaurus GitHub Pages Configuration Script
# This script helps configure docusaurus.config.ts for GitHub Pages deployment

set -e

echo "================================================"
echo "Docusaurus GitHub Pages Configuration"
echo "================================================"
echo ""

# Get GitHub username
read -p "Enter your GitHub username/organization: " GITHUB_USER

# Get repository name
read -p "Enter your repository name: " REPO_NAME

# Confirm
echo ""
echo "Configuration:"
echo "  GitHub User: $GITHUB_USER"
echo "  Repository: $REPO_NAME"
echo "  Site URL: https://$GITHUB_USER.github.io/$REPO_NAME/"
echo ""
read -p "Is this correct? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo "Configuration cancelled."
    exit 1
fi

# Update docusaurus.config.ts
CONFIG_FILE="docusaurus.config.ts"

if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: $CONFIG_FILE not found!"
    exit 1
fi

# Create backup
cp "$CONFIG_FILE" "$CONFIG_FILE.backup"
echo "Created backup: $CONFIG_FILE.backup"

# Replace placeholders
sed -i "s|https://YOUR-GITHUB-USERNAME.github.io|https://$GITHUB_USER.github.io|g" "$CONFIG_FILE"
sed -i "s|/REPOSITORY-NAME/|/$REPO_NAME/|g" "$CONFIG_FILE"
sed -i "s|YOUR-GITHUB-USERNAME|$GITHUB_USER|g" "$CONFIG_FILE"
sed -i "s|REPOSITORY-NAME|$REPO_NAME|g" "$CONFIG_FILE"

echo ""
echo "✅ Configuration updated successfully!"
echo ""
echo "Next steps:"
echo "1. Review the updated $CONFIG_FILE"
echo "2. Set up git remote: git remote add origin https://github.com/$GITHUB_USER/$REPO_NAME.git"
echo "3. Push to GitHub: git push origin master"
echo "4. Enable GitHub Pages in repository settings (Settings → Pages → Branch: gh-pages)"
echo "5. GitHub Actions will automatically deploy your site"
echo ""
echo "Your site will be available at: https://$GITHUB_USER.github.io/$REPO_NAME/"
echo ""
