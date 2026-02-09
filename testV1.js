const API_KEY = "AIzaSyBHE-XUdIZmIpa3Or8lIkL8vu-BR3bxYfA";

async function testV1() {
    const v = 'v1';
    const model = 'gemini-1.5-flash';
    console.log(`Testing ${model} on ${v}...`);
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/${v}/models/${model}:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Respond 'OK'." }] }]
            })
        });
        if (response.ok) {
            const data = await response.json();
            console.log(`Success:`, data.candidates[0].content.parts[0].text);
        } else {
            console.error(`Error: ${response.status} ${response.statusText}`);
            const err = await response.text();
            console.error(err);
        }
    } catch (error) {
        console.error(`Fetch error:`, error);
    }
}

testV1();
