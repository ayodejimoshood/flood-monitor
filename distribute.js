const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  appName: 'UK Flood Monitor',
  version: '0.1.0',
  githubRepo: 'ayodejimoshood/flood-monitor',
  platforms: ['mac', 'win', 'linux']
};

// Create a releases directory if it doesn't exist
const releasesDir = path.join(__dirname, 'releases');
if (!fs.existsSync(releasesDir)) {
  fs.mkdirSync(releasesDir);
}

// Function to build for a specific platform
function buildForPlatform(platform) {
  console.log(`Building for ${platform}...`);
  try {
    execSync(`npm run electron:build:${platform}`, { stdio: 'inherit' });
    console.log(`✅ Build for ${platform} completed successfully!`);
    return true;
  } catch (error) {
    console.error(`❌ Build for ${platform} failed:`, error.message);
    return false;
  }
}

// Function to copy built files to releases directory
function copyToReleases(platform) {
  console.log(`Copying ${platform} files to releases directory...`);
  
  const distDir = path.join(__dirname, 'dist');
  const files = fs.readdirSync(distDir);
  
  let platformFiles = [];
  
  if (platform === 'mac') {
    platformFiles = files.filter(file => file.endsWith('.dmg') || file.endsWith('-mac.zip'));
  } else if (platform === 'win') {
    platformFiles = files.filter(file => file.endsWith('.exe') || file.endsWith('.msi'));
  } else if (platform === 'linux') {
    platformFiles = files.filter(file => file.endsWith('.AppImage') || file.endsWith('.deb') || file.endsWith('.rpm'));
  }
  
  if (platformFiles.length === 0) {
    console.error(`❌ No ${platform} files found in dist directory.`);
    return false;
  }
  
  platformFiles.forEach(file => {
    const sourcePath = path.join(distDir, file);
    const destPath = path.join(releasesDir, file);
    fs.copyFileSync(sourcePath, destPath);
    console.log(`  - Copied ${file} to releases directory`);
  });
  
  console.log(`✅ ${platform} files copied successfully!`);
  return true;
}

// Function to generate release notes
function generateReleaseNotes() {
  console.log('Generating release notes...');
  
  const releaseNotes = `# ${config.appName} v${config.version}

## Release Notes

### New Features
- Initial release of the UK Flood Monitor desktop application
- Search for stations by name, river, or town
- View detailed measurements including water level, flow rate, and more
- Interactive charts showing readings over time

### Downloads
${config.platforms.map(platform => {
  const platformName = platform === 'mac' ? 'macOS' : platform === 'win' ? 'Windows' : 'Linux';
  return `- [${platformName}](https://github.com/${config.githubRepo}/releases/download/v${config.version}/${config.appName.replace(/ /g, '.')}-${config.version}-${platform === 'mac' ? 'arm64.dmg' : platform === 'win' ? 'setup.exe' : 'x86_64.AppImage'})`;
}).join('\n')}

### System Requirements
- macOS 10.13 or later
- Windows 10 or later
- Ubuntu 18.04, Debian 10, or Fedora 30 or later

### Known Issues
- None at this time

## Feedback
Please report any issues or provide feedback at https://github.com/${config.githubRepo}/issues
`;

  const releaseNotesPath = path.join(releasesDir, 'RELEASE_NOTES.md');
  fs.writeFileSync(releaseNotesPath, releaseNotes);
  console.log(`✅ Release notes generated at ${releaseNotesPath}`);
}

// Function to update download page
function updateDownloadPage() {
  console.log('Updating download page...');
  
  const downloadPagePath = path.join(__dirname, 'download.html');
  let downloadPage = fs.readFileSync(downloadPagePath, 'utf8');
  
  // Update version number
  downloadPage = downloadPage.replace(/v\d+\.\d+\.\d+/g, `v${config.version}`);
  
  fs.writeFileSync(downloadPagePath, downloadPage);
  console.log(`✅ Download page updated with version ${config.version}`);
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const platformArg = args[0];
  
  if (platformArg && !config.platforms.includes(platformArg)) {
    console.error(`❌ Invalid platform: ${platformArg}. Valid platforms are: ${config.platforms.join(', ')}`);
    process.exit(1);
  }
  
  const platformsToBuild = platformArg ? [platformArg] : config.platforms;
  
  console.log(`🚀 Starting distribution process for ${config.appName} v${config.version}`);
  console.log(`📦 Building for platforms: ${platformsToBuild.join(', ')}`);
  
  for (const platform of platformsToBuild) {
    const buildSuccess = buildForPlatform(platform);
    if (buildSuccess) {
      copyToReleases(platform);
    }
  }
  
  generateReleaseNotes();
  updateDownloadPage();
  
  console.log(`\n🎉 Distribution process completed!`);
  console.log(`📁 Release files are available in the 'releases' directory.`);
  console.log(`📝 Next steps:`);
  console.log(`  1. Review the release files in the 'releases' directory`);
  console.log(`  2. Upload the files to GitHub Releases: https://github.com/${config.githubRepo}/releases/new`);
  console.log(`  3. Copy the contents of RELEASE_NOTES.md for the release description`);
  console.log(`  4. Deploy the updated download.html page`);
}

main().catch(error => {
  console.error('❌ Distribution process failed:', error);
  process.exit(1);
}); 