// import { queryExamples, schemas } from "../temp/examples.js";
// import { ontologies } from "../temp/ontologies.js";

export function formulateStandaloneQuestionPrompt(question, chatHistory) {
  return `Based on the provided question "${question}" and the chat history ${JSON.stringify(
    chatHistory
  )}, create a standalone question. 
  If the original question is clear and directly applicable, use it as is. 
  Otherwise, rephrase it to ensure it contains all necessary information for an effective query and is optimized for natural language processing and vector search. 
  The standalone question should be self-contained, reflecting the intent clearly without additional context needed. Respond with the standalone question only.`;
}

export function formulateOntologiesPrompt(question, ontologies) {
  return `Given the question "${question}", identify which ontologies from the provided list ${JSON.stringify(
    ontologies
  )} directly relate to the question's themes and key terms. 
  Use exact matches where possible to select the most applicable ontologies. 
  Return the matching ontologies in a plain JSON array format, preserving the original descriptions exactly as provided. 
  If no ontologies directly match the question's content, return an empty array []. 
  Ensure the response does not reformat or reinterpret the provided ontology descriptions.`;
}

export function formulateSparqlPrompt(question, standaloneQuestion) {
  return `Based on the original question "${question}", the refined standalone question "${standaloneQuestion}", and the applicable ontologies "${JSON.stringify(
    ontologies.Brick
  )}", generate three distinct SPARQL queries. 
  Each query should comprehensively cover the key aspects mentioned in the questions and must include the 'schema:name' property to extract relevant data effectively from RDF stores. 
  Ensure each query is clear and concise, maximizing information retrieval while maintaining structure and precision.
  Utilize the properties and relationships defined in the Brick ontology fully, focusing on capturing all necessary details. 
  Provide the queries as a plain array of strings without additional formatting or Markdown annotations. 
  Example response format should be: ["<SPARQL query1>", "<SPARQL query2>", "<SPARQL query3>"].
  
  Schemas used: "${JSON.stringify(schemas)}".
  Example SPARQL queries: ${queryExamples}`;
}

export function formulateResponsePrompt(question, standaloneQuestion, context) {
  context = JSON.stringify(context);
  let prompt = `** Task Description **
  You are an intelligent assistant designed to provide engaging and informative responses based on relevant data provided to you. Given the question and the associated data provided in JSON format, analyze the data and construct a precise and accurate answer. 

  ** Instructions **
  1. Comprehend the Inquiry: Start by carefully analyzing the user's question to fully understand the core information they are seeking.
  2. Evaluate the Given Data: Carefully review the data provided, focusing on identifying the most relevant and insightful details that address the user's query.
  3. Remain Contextual: Stick to the information available within the provided data, do not provided any data that is outside of the provided context. Return only the information that is provided in the context and are related to the question. Do not put any questions in the answer.
  4. Formulate a Thorough Response: Create a response that directly and comprehensively answers the user's question. Ensure the explanation is clear, detailed, and adds value to the user's understanding.
  5. Engage the User: Deliver the response in an engaging manner, addressing the user directly. Consider asking follow-up questions or offering additional insights to encourage further interaction.
  6. Include Relevant Links: If URLs are included, format them as markdown links (e.g., [link text]) within your response.
  7. Avoid Repetition: Ensure that the response is concise and avoids unnecessary repetition. Speak naturally to the user, without overtly referencing the provided context or using phrases like "Based on the context provided...".
  8. Organize the Response: For longer answers, structure the content with clear sections and headings to improve readability. Use markdown formatting where appropriate to help the user navigate the information easily.
  9. Stay concrete: Do not provid data that was not asked in the question only return necessary infomation.
  10. If you cannot find information in the provided context that is needed to anwer the question just return "No information was found related to the question you provided."
  **Task**:
  For the provided language question, generate a corresponding natural language answer based on the provided context. Adhere to the instructions provided above.

  ** Input **
  The original question: ${question}
  Standalone question: ${standaloneQuestion}
  The provided context: ${context}
    `;
  return prompt;
}

export function formulateContentTypePrompt(standaloneQuestion) {
  return `
    Based on the following standalone question, determine the most appropriate content type (e.g., Dataset, Report, Article, Book, Movie, etc.) from the schema.org ontology:
    
    Example input:
    Where are the characters from in the book The Winds of Winter?

    Example output:
    Book

    Example input:
    Who are the main characters in the movie Interstellar?

    Example output:
    Movie
    Question: "${standaloneQuestion}"

    Return only the content type as a single word string.
  `;
}

export function formulateDigitalDocumentTitlePrompt(standaloneQuestion) {
  return `
    Based on the following standalone question, determine what is the title of entity in focus
    
    Example input:
    Where are the characters from in the book The Winds of Winter?

    Example output:
    The|Winds|of|Winter

    Example input:
    Who are the main characters in the movie Lord of the rings?

    Example output:
    Lord|of|the|rings
    Question: "${standaloneQuestion}"

    Return only the title as where white space is replaced by | as provided in examples.
  `;
}

export function formulateGenericSparql(question, standaloneQuestion) {
  return `
  You are a SPARQL expert.

**Original Question:**
"${question}"

**Standalone Question:**
"${standaloneQuestion}"

**UAL Format:**
did:dkg:<blockchain>/<contract_address>/<collection_id>[/<asset_id>] (e.g., did:dkg:otp:20430/0xb4c24fc54bc811c2659c477b65da8648e499fd39/2205/2 or did:dkg:otp:20430/0xb4c24fc54bc811c2659c477b65da8648e499fd39/2205)

**Task:**
Analyze the original and standalone questions.

- If a UAL is mentioned in the standalone question following the above format, generate a SPARQL query that targets the specific graph identified by that UAL. 
- If no UAL is mentioned, generate a generic SPARQL query that retrieves all relevant data across all graphs.

**Requirements:**
- Return only the SPARQL query in plain text.
- Do not include any formatting characters, markdown, or additional text.
- Ensure the query is syntactically correct.

**Examples:**

1. **Question with UAL (Including Asset ID):**

   **Original Question:**
   Give me all data for this asset did:dkg:otp:20430/0xb4c24fc54bc811c2659c477b65da8648e499fd39/2205/2
   
   **Standalone Question:**
   Give me all data for this asset did:dkg:otp:20430/0xb4c24fc54bc811c2659c477b65da8648e499fd39/2205/2
   
   **Generated SPARQL Query:**
   SELECT ?s ?p ?o WHERE { GRAPH did:dkg:otp:20430/0xb4c24fc54bc811c2659c477b65da8648e499fd39/2205/2 { ?s ?p ?o } }

2. **Question without UAL:**
   
   **Original Question:**
   Who directed Mad Max?
   
   **Standalone Question:**
   Who directed Mad Max?
   
   **Generated SPARQL Query:**
   SELECT ?s ?p ?o WHERE { GRAPH ?g { ?s ?p ?o } } LIMIT 100`;
}
