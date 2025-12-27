#!/bin/bash

# Quick deploy script for webtest project

echo "🚀 3D Print Platform - Deploy to GitHub"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this from the project directory"
    exit 1
fi

echo "📝 Step 1: What's your GitHub username?"
read -p "GitHub username: " GITHUB_USER

if [ -z "$GITHUB_USER" ]; then
    echo "❌ Error: Username required"
    exit 1
fi

echo ""
echo "🔗 Step 2: Adding GitHub remote..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/$GITHUB_USER/webtest.git

echo ""
echo "📤 Step 3: Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Done! Your code is on GitHub"
echo ""
echo "📍 Repository: https://github.com/$GITHUB_USER/webtest"
echo ""
echo "🌐 Next steps to host online:"
echo "1. Go to: https://vercel.com/signup"
echo "2. Sign in with GitHub"
echo "3. Import repository: webtest"
echo "4. Click Deploy"
echo "5. Your site will be live in 2 minutes!"
echo ""
echo "💡 Or deploy now with Vercel CLI:"
echo "   npx vercel --prod"
