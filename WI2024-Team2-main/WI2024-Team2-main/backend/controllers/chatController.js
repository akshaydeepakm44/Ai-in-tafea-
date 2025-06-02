require('dotenv').config();
const { Class } = require('../models/model');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const apiKey = process.env.GEMINI_API;

if (!apiKey) {
    console.error('GEMINI_API key is not set in the environment variables.');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-002",
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
    responseSchema: {
        type: "object",
        properties: {
            activities: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        activity_name: {
                            type: "string"
                        },
                        description: {
                            type: "string"
                        },
                        procedure: {
                            type: "string"
                        }
                    },
                    required: [
                        "activity_name",
                        "description",
                        "procedure"
                    ]
                }
            }
        },
        required: [
            "activities"
        ]
    },
});

const getChat =  async (req, res) => {
    try {
        const { token, lesson } = req.body;

        // Validate input
        if (!lesson?.classId || !lesson?.skills) {
            return res.status(400).json({ error: 'classId and skills are required.' });
        }

        const classId = lesson.classId;
        const skills = lesson.skills;

        const classData = await Class.findById(classId); // Replace with your Class model query
        if (!classData) {
            return res.status(404).json({ error: 'Class not found.' });
        }

        const grade = classData.standard;

        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });

        const result = await chatSession.sendMessage(`grade: ${grade}\nskills: ${skills}`).then((response) => {
            return response.response.text();
        });

        console.log('Gemini API response:', result);

        let activities;
        try {
            activities = JSON.parse(result);
        } catch (parseError) {
            console.error('Error parsing Gemini API response:', parseError);
            return res.status(500).json({ error: 'Error parsing Gemini API response', details: parseError.message });
        }

        res.json(activities);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred', details: error.message });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { token, lesson, message, messageHistory } = req.body;

        // Validate input
        if (!lesson || !message || !messageHistory) {
            return res.status(400).json({ error: 'Lesson, message, and message history are required.' });
        }

        console.log("Received message:", message);
        console.log("Message history:", messageHistory);

        const chatSession = model.startChat({
            generationConfig,
            history: messageHistory.map(msg => ({
                role: msg.role,
                content: msg.content
            })),
        });

        const result = await chatSession.sendMessage(message).then((response) => {
            return response.response.text();
        });

        console.log('Gemini API response:', result);

        let reply;
        try {
            reply = JSON.parse(result);
        } catch (parseError) {
            console.error('Error parsing Gemini API response:', parseError);
            return res.status(500).json({ error: 'Error parsing Gemini API response', details: parseError.message });
        }

        res.json({ reply });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred', details: error.message });
    }
};

module.exports = { getChat, sendMessage };