import { LLMProviderFactory } from "../llmProviders/llmProviderFactory.js";
import {
  formulateStandaloneQuestionPrompt,
  formulateOntologiesPrompt,
  formulateSparqlPrompt,
  formulateResponsePrompt,
  formulateContentTypePrompt,
  formulateDigitalDocumentTitlePrompt,
  formulateGenericSparql,
} from "../utils/prompts.js";

class LLMService {
  constructor(userData) {
    this.standaloneQuestionConfig = this.getConfig(
      userData,
      "standaloneQuestion"
    );
    this.ontologiesConfig = this.getConfig(userData, "ontologies");
    this.sparqlConfig = this.getConfig(userData, "sparql");
    this.responseConfig = this.getConfig(userData, "response");
  }

  getConfig(userData, task) {
    return {
      provider: userData[task]?.provider || userData.provider,
      apiKey: userData[task]?.apiKey || userData.apiKey,
      model: userData[task]?.model || userData.model,
    };
  }

  async createStandaloneQuestion(question, chatHistory) {
    const provider = LLMProviderFactory.createProvider(
      this.standaloneQuestionConfig
    );
    const prompt = formulateStandaloneQuestionPrompt(question, chatHistory);
    return provider.createChatCompletion(prompt);
  }

  async getOntologies(question) {
    const provider = LLMProviderFactory.createProvider(this.ontologiesConfig);
    const prompt = formulateOntologiesPrompt(question);
    return provider.createChatCompletion(prompt);
  }

  //TODO: return array of queries
  async createSparqlQueries(question, standaloneQuestion, ontologies) {
    const provider = LLMProviderFactory.createProvider(this.sparqlConfig);
    const prompt = formulateSparqlPrompt(
      question,
      standaloneQuestion,
      ontologies
    );
    return provider.createChatCompletion(prompt);
  }

  async createGenericQuery(question, standaloneQuestion) {
    const provider = LLMProviderFactory.createProvider(this.sparqlConfig);
    const prompt = formulateGenericSparql(question, standaloneQuestion);
    return provider.createChatCompletion(prompt);
  }

  async generateResponse(question, standaloneQuestion, data) {
    const provider = LLMProviderFactory.createProvider(this.responseConfig);
    const prompt = formulateResponsePrompt(question, standaloneQuestion, data);
    return provider.createChatCompletion(prompt);
  }

  async getContentType(standaloneQuestion) {
    const provider = LLMProviderFactory.createProvider(this.responseConfig);
    const prompt = formulateContentTypePrompt(standaloneQuestion);
    return provider.createChatCompletion(prompt);
  }

  async getDigitalDocumentTitle(standaloneQuestion) {
    const provider = LLMProviderFactory.createProvider(this.responseConfig);
    const prompt = formulateDigitalDocumentTitlePrompt(standaloneQuestion);
    return provider.createChatCompletion(prompt);
  }

  async createChatCompletion(prompt) {
    const provider = LLMProviderFactory.createProvider(this.responseConfig);
    return provider.createChatCompletion(prompt);
  }
}

export default LLMService;
