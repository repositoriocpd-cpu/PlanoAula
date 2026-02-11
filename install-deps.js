const { execSync } = require('child_process');

try {
    console.log('Installing openai...');
    execSync('npm install openai', { stdio: 'inherit', shell: true });
    console.log('Installation successful.');
} catch (error) {
    console.error('Installation failed:', error);
    process.exit(1);
}
