import DKG from "dkg.js";
import logger from "../utils/logger.js";

class DKGService {
  constructor(userData) {
    //TODO: move this into a separate config file
    this.clientBaseConfig = {
      port: "8900",
      maxNumberOfRetries: 30,
      frequency: 2,
      contentType: "all",
      nodeApiVersion: "/v1",
    };

    this.queryConfig = {
      // auth: { token: JWTToken },
    };

    this.client = this.configureDKGClient(userData);
  }

  getParanetRepositoryName(paranetUAL) {
    return paranetUAL.replace(/[/:]/g, "-").toLowerCase();
  }
  getDKGOptions(userData) {
    return {
      endpoint: userData.endpoint,
      // blockchain: userData.blockchain,
      environment: userData.environment,
    };
  }

  configureDKGClient(userData) {
    return new DKG({
      ...this.clientBaseConfig,
      ...this.getDKGOptions(userData),
    });
  }

  /**
   * Queries the DKG (Decentralized Knowledge Graph) with the provided query.
   *
   * @param {string|string[]} query - The query to be executed. If a single string is provided, it will be executed as a single query.
   * If an array of strings is provided, each query will be executed sequentially.
   * @param userData
   * @returns {Promise<any[][]>} - A promise that resolves to an array of arrays. Each inner array represents the results of a single query.
   * If a query does not return any data, the corresponding inner array will be empty.
   * If an error occurs during the query, the corresponding inner array will be empty.
   */
  async query(query, userData) {
    let queries = Array.isArray(query) ? query : [query];
    let results = [];
    for (const q of queries) {
      try {
        if (
          userData.edgeNodePublishMode &&
          userData.edgeNodePublishMode !== "public"
        ) {
          this.queryConfig.paranetUAL = userData.paranetUAL;
        }
        const result = await this.client.graph.query(
          q,
          "SELECT",
          this.queryConfig
        );
        if (!result?.data?.length) {
          logger.info(`Query ${q} did not return any data.`);
          logger.info(JSON.stringify(result.data));
          results.push([]);
        } else {
          results.push(result.data);
        }
      } catch (e) {
        logger.error(`Error while querying the graph for ${q}: `, e.message);
        results.push([]);
      }
    }
    return results;
  }
}

export default DKGService;
