const fs = require('fs');
const path = require('path');

// Define the required asset files
const requiredAssets = [
  'assets/icon.png',
  'assets/adaptive-icon.png',
  'assets/splash.png',
  'assets/favicon.png'
];

// Ensure the assets directory exists
if (!fs.existsSync('assets')) {
  fs.mkdirSync('assets');
}

// Create placeholder files if they don't exist
requiredAssets.forEach(asset => {
  const filePath = path.resolve(asset);
  const dir = path.dirname(filePath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Create placeholder file if it doesn't exist
  if (!fs.existsSync(filePath)) {
    console.log(`Creating placeholder file: ${asset}`);
    
    // Create a simple 1024x1024 transparent PNG file
    // This is just a base64-encoded minimal PNG
    const placeholder = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
    fs.writeFileSync(filePath, placeholder);
  } else {
    console.log(`Asset already exists: ${asset}`);
  }
});

console.log('All required assets have been created.'); 