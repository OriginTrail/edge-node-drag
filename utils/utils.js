const logger = require('./logger.js');

function getKnowledgeAssets(chunks, environment) {
    return chunks.map((chunk) => {
        return {
            assetName: chunk.name,
            assetUAL: chunk.ual,
            issuerName: 'OriginTrail',
            issuerUAL:
                environment === 'mainnet'
                    ? 'did:dkg:otp/0x5cac41237127f94c2d21dae0b14bfefa99880630/307803'
                    : 'did:dkg:otp/0x1a061136ed9f5ed69395f18961a0a535ef4b3e5f/339972',
            chunk: chunk.langchain_text,
            explorerBaseURL:
                environment === 'mainnet'
                    ? 'https://dkg.origintrail.io/explore?ual='
                    : 'https://dkg-testnet.origintrail.io/explore?ual=',
            defaultIdentifier: chunk.url ?? ''
            // to be introduced later
            // images: chunk.image,
            // videos: chunk.video,
        };
    });
}

function getKnowledgeAssetsGeneric(chunks, environment) {
    return chunks.map((chunk) => {
        return {
            assetName: chunk.name,
            assetUAL: chunk.ual,
            issuerName: 'OriginTrail',
            issuerUAL:
                environment === 'mainnet'
                    ? 'did:dkg:otp/0x5cac41237127f94c2d21dae0b14bfefa99880630/307803'
                    : 'did:dkg:otp/0x1a061136ed9f5ed69395f18961a0a535ef4b3e5f/339972',
            chunk: chunk.abstract,
            explorerBaseURL:
                environment === 'mainnet'
                    ? 'https://dkg.origintrail.io/explore?ual='
                    : 'https://dkg-testnet.origintrail.io/explore?ual=',
            defaultIdentifier: chunk.url ?? ''
            // to be introduced later
            // images: chunk.image,
            // videos: chunk.video,
        };
    });
}

function getKnowledgeAssetsVector(chunks, environment) {
    return chunks.map((chunk) => {
        return {
            // you should use vector DB metadata name field and include it in the vector service call
            assetName: chunk.name ?? '',
            assetUAL: chunk.ual,
            issuerName: 'OriginTrail',
            issuerUAL:
                environment === 'mainnet'
                    ? 'did:dkg:otp/0x5cac41237127f94c2d21dae0b14bfefa99880630/307803'
                    : 'did:dkg:otp/0x1a061136ed9f5ed69395f18961a0a535ef4b3e5f/339972',
            chunk: chunk.langchain_text,
            explorerBaseURL:
                environment === 'mainnet'
                    ? 'https://dkg.origintrail.io/explore?ual='
                    : 'https://dkg-testnet.origintrail.io/explore?ual=',
            defaultIdentifier: chunk.url ?? ''
            // to be introduced later
            // images: chunk.image,
            // videos: chunk.video,
        };
    });
}

function getToken(bearerToken) {
    return bearerToken.split(' ')[1];
}

function getSparqlQuery(headline) {
    let query = `
  PREFIX schema: <http://schema.org/>
SELECT ?ual ?name ?fileFormat ?headline ?abstract
WHERE {
  GRAPH ?ual {
    ?doc a schema:DigitalDocument;
         schema:name ?name;
         schema:fileFormat ?fileFormat;
         schema:headline ?headline;
         schema:abstract ?abstract.
    
       
    FILTER (
     REGEX(?headline, "${headline}", "i")
    )
  }
}
GROUP BY ?ual ?name ?fileFormat ?headline ?abstract`;
    return query;
}

module.exports = {
    getKnowledgeAssets,
    getKnowledgeAssetsGeneric,
    getKnowledgeAssetsVector,
    getToken,
    getSparqlQuery
};
