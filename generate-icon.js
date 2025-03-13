const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create a simple icon - a blue triangle (representing flood/water)
const size = 512;
const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');

// Fill background with transparent
ctx.clearRect(0, 0, size, size);

// Draw a blue triangle
ctx.fillStyle = '#0070f3';
ctx.beginPath();
ctx.moveTo(size / 2, 50);
ctx.lineTo(size - 50, size - 50);
ctx.lineTo(50, size - 50);
ctx.closePath();
ctx.fill();

// Add a water wave at the bottom
ctx.fillStyle = '#60a5fa';
ctx.beginPath();
ctx.moveTo(50, size - 100);
for (let i = 50; i < size - 50; i += 40) {
  const height = Math.sin((i - 50) / (size - 100) * Math.PI) * 20;
  ctx.lineTo(i + 20, size - 100 + height);
  ctx.lineTo(i + 40, size - 100 - height);
}
ctx.lineTo(size - 50, size - 100);
ctx.lineTo(size - 50, size - 50);
ctx.lineTo(50, size - 50);
ctx.closePath();
ctx.fill();

// Save the icon
const buffer = canvas.toBuffer('image/png');
const iconPath = path.join(__dirname, 'electron', 'icons', 'icon.png');
const trayIconPath = path.join(__dirname, 'electron', 'icons', 'tray-icon.png');

fs.writeFileSync(iconPath, buffer);
fs.writeFileSync(trayIconPath, buffer);

console.log('Icons generated successfully!'); 