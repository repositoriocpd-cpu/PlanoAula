const API_KEY = "AIzaSyBHE-XUdIZmIpa3Or8lIkL8vu-BR3bxYfA";

async function testAllModels() {
    const v = 'v1beta';
    try {
        const listResponse = await fetch(`https://generativelanguage.googleapis.com/${v}/models?key=${API_KEY}`);
        if (!listResponse.ok) return;
        const listData = await listResponse.json();
        const models = listData.models.map(m => m.name.split('/').pop());

        for (const modelName of models) {
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/${v}/models/${modelName}:generateContent?key=${API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: "Hi" }] }]
                    })
                });
                if (response.ok) {
                    console.log(`✅ SUCCESS: ${modelName}`);
                }
            } catch (e) { }
        }
    } catch (error) { }
    console.log("DONE");
}

testAllModels();
