class GeminiAIExtension {
    constructor(runtime) {
        this.runtime = runtime;
    }

    getInfo() {
        return {
            id: 'geminiapi',
            name: 'Gemini AI',
            blocks: [
                {
                    opcode: 'askGemini',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'ask Gemini [PROMPT] key [KEY]',
                    arguments: {
                        PROMPT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Tell me a short joke.'
                        },
                        KEY: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'PASTE_YOUR_API_KEY_HERE'
                        }
                    }
                }
            ]
        };
    }

    async askGemini(args) {
        const prompt = args.PROMPT;
        const apiKey = args.KEY;

        if (!apiKey || apiKey === 'PASTE_YOUR_API_KEY_HERE') {
            return 'Error: Please provide a valid Gemini API key.';
        }

        // We use the stable gemini-2.5-flash model endpoint
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                return `Error: ${errData.error?.message || response.statusText}`;
            }

            const data = await response.json();
            // Dig down into Gemini's specific JSON response structure
            const textResponse = data.candidates[0].content.parts[0].text;
            return textResponse;

        } catch (error) {
            console.error(error);
            return 'Error: Failed to fetch response from Gemini.';
        }
    }
}

Scratch.extensions.register(new GeminiAIExtension());

