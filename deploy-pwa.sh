#!/bin/bash
# PWA Build and Deployment Script

echo "🚀 Starting PWA build and deployment process..."

# Clean up previous build
echo "🧹 Cleaning up previous build..."
rm -rf dist

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Please fix the errors and try again."
  exit 1
fi

echo "✅ Build successful!"

# Validate PWA files
echo "🔍 Validating PWA files..."

if [ -f "dist/sw.js" ]; then
  echo "✅ Service worker (sw.js) found"
else
  echo "❌ Service worker (sw.js) not found"
  exit 1
fi

if [ -f "dist/manifest.webmanifest" ]; then
  echo "✅ Web App Manifest (manifest.webmanifest) found"
else
  echo "❌ Web App Manifest (manifest.webmanifest) not found"
  exit 1
fi

# Check for PWA icons
echo "🔍 Checking PWA icons..."
ICONS_FOUND=0
for icon in dist/pwa-192x192.png dist/pwa-512x512.png dist/pwa-maskable-192x192.png dist/pwa-maskable-512x512.png; do
  if [ -f "$icon" ]; then
    echo "✅ Icon found: $icon"
    ICONS_FOUND=$((ICONS_FOUND+1))
  else
    echo "⚠️ Icon not found: $icon"
  fi
done

if [ $ICONS_FOUND -eq 0 ]; then
  echo "❌ No PWA icons found. Please check your configuration."
  exit 1
fi

# Remove test script from production build
echo "🔧 Removing test script from production build..."
sed -i '' -e '/<!-- PWA Test Script/d' -e '/test-pwa.js/d' dist/index.html

# Preview the build
echo "🌐 Starting preview server..."
echo "📱 Test your PWA at http://localhost:4173/"
echo "🔍 Check for:"
echo "  - Service worker registration"
echo "  - Offline functionality"
echo "  - Installation prompt"
echo "  - Correct layout (chart below metrics)"
echo ""
echo "Press Ctrl+C to stop the preview server when done testing."

npm run preview

# Deploy to GitHub Pages
echo "🚀 Ready to deploy to GitHub Pages?"
echo "Run 'npm run deploy' to publish your PWA."