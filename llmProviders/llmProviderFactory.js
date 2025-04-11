const AnthropicProvider = require('./anthropicProvider.js');
const OpenAIProvider = require('./openaiProvider.js');
const OllamaProvider = require('./ollamaProvider.js');

class LLMProviderFactory {
    static createProvider(config) {
        switch (config.provider) {
            case 'openai':
                return new OpenAIProvider(config);
            case 'anthropic':
                return new AnthropicProvider(config);
            case 'ollama':
                return new OllamaProvider(config);
            default:
                throw new Error('Unsupported LLM provider');
        }
    }
}

module.exports = LLMProviderFactory;
