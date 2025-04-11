const LLMProvider = require('./llmProvider.js');
const axios = require('axios');
const { PassThrough, Transform } = require('stream');

export class OllamaProvider extends LLMProvider {
    constructor(config) {
        super(config);
    }

    async createChatCompletion(prompt, stream = false) {
        const response = await axios
            .post(
                'http://localhost:11434/api/generate',
                {
                    model: this.model,
                    prompt,
                    stream
                },
                { responseType: stream ? 'stream' : 'json' }
            )
            .then((r) => r.data);
        if (!stream) return response?.response ?? '';

        const responseStream = new PassThrough({ objectMode: true });
        const t = new TextDecoder();
        response
            .pipe(
                new Transform({
                    transform(chunk, _, callback) {
                        const text = t.decode(chunk);
                        const content = JSON.parse(text).response;
                        this.push({ choices: [{ delta: { content } }] });
                        callback();
                    }
                })
            )
            .pipe(responseStream);
        return responseStream;
    }
}
