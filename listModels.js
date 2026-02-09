import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = "AIzaSyBHE-XUdIZmIpa3Or8lIkL8vu-BR3bxYfA";

const genAI = new GoogleGenerativeAI(API_KEY);

async function testModel() {
    try {
        console.log('Testing gemini-2.0-flash...');
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await model.generateContent("Oi, responda apenas 'OK' se estiver funcionando.");
        console.log('Response:', result.response.text());
    } catch (error) {
        console.error('Error with gemini-2.0-flash:');
        console.error(error.message || error);

        try {
            console.log('Testing gemini-2.5-flash...');
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
            const result = await model.generateContent("Oi, responda apenas 'OK' se estiver funcionando.");
            console.log('Response:', result.response.text());
        } catch (error2) {
            console.error('Error with gemini-2.5-flash:');
            console.error(error2.message || error2);
        }
    }
}

testModel();
