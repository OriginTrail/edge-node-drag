// import { ontologies } from "../temp/ontologies.js";
import axios from "axios";
import logger from "../utils/logger.js";
import dotenv from "dotenv";
import { COOKIE_NAME } from "../utils/constants.js";
dotenv.config("./env");

const DRAG_USER_CONFIG_OPTION = "drag_endpoint";
const AUTH_ENDPOINT = process.env.AUTH_ENDPOINT;

// Here you can change the LLM you are using, you can eather put anthropic or openai models. Just use the different key in the env file
const baseUserData = {
  provider: "openai",
  model: "gpt-4o-mini",
  apiKey: process.env.LLM_API_KEY,
};

export async function authenticateToken(cookie) {
  try {
    const response = await axios.get(`${AUTH_ENDPOINT}/auth/check`, {
      headers: { Cookie: `${COOKIE_NAME}=${cookie}` },
      withCredentials: "true",
    });

    const userConfig = response.data.user.config.find(
      (cfg) => cfg.option === DRAG_USER_CONFIG_OPTION
    ) || null;

    const edgeNodePublishMode = response.data.user.config.find(
      (cfg) => cfg.option === "edge_node_publish_mode"
    )?.value || null;

    const edgeNodeParanetUAL = response.data.user.config.find(
        (cfg) => cfg.option === "edge_node_paranet_ual"
    )?.value || null;

    const environment = response.data.user.config.find(
      (cfg) => cfg.option === "edge_node_environment"
    )?.value || null;

    const runTimeNodeEndpoint = response.data.user.config.find(
      (cfg) => cfg.option === "run_time_node_endpoint"
    )?.value || null;

    const blockchain = response.data.user.config.find(
      (cfg) => cfg.option === "blockchain"
    )?.value || null;

    const vectorDBUri = response.data.user.config.find(
      (cfg) => cfg.option === "milvus_address"
    )?.value || null;

    const vectorDBCredentials = response.data.user.config
      .find((cfg) => cfg.option === "milvus_token")
      ?.value?.split(":") || null;

    const vectorDBUsername = (vectorDBCredentials !== null && vectorDBCredentials.length > 0) ? vectorDBCredentials[0] : null;
    const vectorDBPassword = (vectorDBCredentials !== null && vectorDBCredentials.length > 0) ? vectorDBCredentials[1] : null;

    const vectorCollection = response.data.user.config
      .find((cfg) => cfg.option === "vector_collection")
      ?.value?.split(",") || null;

    const embeddingModelAPIKey = response.data.user.config.find(
      (cfg) => cfg.option === "embedding_model_api_key"
    )?.value || null;

    const embeddingModel = response.data.user.config.find(
      (cfg) => cfg.option === "embedding_model"
    )?.value || null;

    const cohereKey = response.data.user.config.find(
      (cfg) => cfg.option === "cohere_key"
    )?.value || null;

    return {
      userData: {
        ...baseUserData,
        id: userConfig.id,
        edgeNodePublishMode: edgeNodePublishMode,
        paranetUAL: edgeNodeParanetUAL,
        environment: environment,
        endpoint: runTimeNodeEndpoint,
        blockchain: blockchain,
        vectorCollection: vectorCollection,
        vectorDBUri: vectorDBUri,
        vectorDBUsername: vectorDBUsername,
        vectorDBPassword: vectorDBPassword,
        embeddingModelAPIKey: embeddingModelAPIKey,
        embeddingModel: embeddingModel,
        cohereKey: cohereKey,
      },
    };
  } catch (error) {
    logger.error("Error fetching user config: " + error);
  }
}
