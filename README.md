# dRAG API

## Installation

```sh
npm install
```

```sh
cp .env.example .env
```

After creating .env, please setup your real values for following variables:

1. LLM_API_KEY - Example dRAG uses LLM to formulate the answer. If you want to add your own variables for any other provider, model or any kind of data you need, you can do in Auth service -> UserConfig table, those variables will be available inside your DRAG:
    ```javascript
    const userData = await authService.authenticateAndCache(req);
    ```

```sh
CREATE DATABASE drag_logging;
```

```sh
npx sequelize-cli db:migrate
```

```sh
npm run start
```

## Vectorization controller

In case you want to use the vectorization controller, you have to set up the following services: HuggingFace, Zilliz and Cohere which is optional.

HuggingFace - used for vectorization embedding model
https://huggingface.co/

Zilliz - used for hosting the vector database
https://cloud.zilliz.com/

Cohere ReRanker - used for improving retrieval results accuracy
https://dashboard.cohere.com/
