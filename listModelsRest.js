const API_KEY = "AIzaSyBHE-XUdIZmIpa3Or8lIkL8vu-BR3bxYfA";

async function listModels() {
    const v = 'v1beta';
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/${v}/models?key=${API_KEY}`);
        if (response.ok) {
            const data = await response.json();
            console.log(`Version ${v} models:`);
            data.models.forEach(m => console.log(`- ${m.name}`));
        } else {
            console.error(`Version ${v} error: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Version ${v} fetch error:`, error);
    }
}

listModels();
