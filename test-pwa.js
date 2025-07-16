// Test script for PWA functionality

// Function to check if service worker is registered
async function checkServiceWorker() {
  console.log('Testing service worker registration...');
  
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        console.log('✅ Service worker is registered:', registration);
        return true;
      } else {
        console.error('❌ No service worker registration found');
        return false;
      }
    } catch (error) {
      console.error('❌ Error checking service worker:', error);
      return false;
    }
  } else {
    console.error('❌ Service workers not supported in this browser');
    return false;
  }
}

// Function to check cache storage
async function checkCacheStorage() {
  console.log('Testing cache storage...');
  
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      console.log('📦 Available caches:', cacheNames);
      
      // Check for our specific cache
      const hasOpenMeteoCache = cacheNames.some(name => name === 'open-meteo-cache');
      if (hasOpenMeteoCache) {
        console.log('✅ Open Meteo cache found');
        
        // Check cache contents
        const cache = await caches.open('open-meteo-cache');
        const keys = await cache.keys();
        console.log(`📊 Cache contains ${keys.length} entries`);
        
        if (keys.length > 0) {
          console.log('✅ Cache has stored API responses');
          return true;
        } else {
          console.warn('⚠️ Cache exists but is empty');
          return false;
        }
      } else {
        console.warn('⚠️ Open Meteo cache not found');
        return false;
      }
    } catch (error) {
      console.error('❌ Error checking cache storage:', error);
      return false;
    }
  } else {
    console.error('❌ Cache API not supported in this browser');
    return false;
  }
}

// Function to test offline functionality
async function testOfflineMode() {
  console.log('Testing offline functionality...');
  console.log('⚠️ To test offline functionality:');
  console.log('1. Load the app and select a city to fetch weather data');
  console.log('2. In Chrome DevTools, go to Network tab and check "Offline"');
  console.log('3. Refresh the page - the app should still display weather data');
  console.log('4. Try selecting a previously loaded city - it should load from cache');
}

// Function to check for installability
function checkInstallability() {
  console.log('Testing PWA installability...');
  
  // Check for manifest
  const manifestLink = document.querySelector('link[rel="manifest"]');
  if (manifestLink) {
    console.log('✅ Web App Manifest is linked:', manifestLink.href);
  } else {
    console.error('❌ No Web App Manifest found');
  }
  
  console.log('⚠️ To test installation:');
  console.log('1. Look for the install icon in Chrome\'s address bar');
  console.log('2. Or go to Chrome menu > Install Dashboard del Clima');
  console.log('3. Follow the installation prompts');
  console.log('4. Verify the app launches in standalone mode');
}

// Run all tests
async function runAllTests() {
  console.log('🧪 Running PWA tests...');
  
  const swRegistered = await checkServiceWorker();
  const cacheWorking = await checkCacheStorage();
  
  checkInstallability();
  testOfflineMode();
  
  console.log('\n📋 Test Summary:');
  console.log(`Service Worker: ${swRegistered ? '✅' : '❌'}`);
  console.log(`Cache Storage: ${cacheWorking ? '✅' : '❌'}`);
  console.log('Installability: Manual check required');
  console.log('Offline Mode: Manual check required');
}

// Execute tests when the page loads
window.addEventListener('load', runAllTests);

console.log('PWA test script loaded. Open the console to see test results.');