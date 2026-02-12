const { execSync } = require('child_process');

try {
    console.log('Running build...');
    execSync('npm run build', { stdio: 'inherit', shell: true });
    console.log('Build completed successfully.');
} catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
}
