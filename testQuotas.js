const API_KEY = "AIzaSyBHE-XUdIZmIpa3Or8lIkL8vu-BR3bxYfA";

async function testModel(modelName) {
    const v = 'v1beta';
    console.log(`Testing ${modelName}...`);
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/${v}/models/${modelName}:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Respond 'OK'." }] }]
            })
        });
        if (response.ok) {
            const data = await response.json();
            console.log(`${modelName} success:`, data.candidates[0].content.parts[0].text);
            return true;
        } else {
            console.error(`${modelName} error: ${response.status} ${response.statusText}`);
            const err = await response.json();
            console.error(JSON.stringify(err, null, 2));
            return false;
        }
    } catch (error) {
        console.error(`${modelName} fetch error:`, error);
        return false;
    }
}

async function runTests() {
    await testModel('gemini-2.0-flash-lite');
    await testModel('gemini-1.5-flash');
}

runTests();
