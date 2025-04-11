require('dotenv').config();
if (process.env.OTEL_ENABLED?.toLowerCase() === 'true') {
    require('@opentelemetry/auto-instrumentations-node/register');
}

const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes/routes.js');
const { createServer } = require('http');
const logger = require('./utils/logger.js');
const cookieParser = require('cookie-parser');
const { COOKIE_NAME } = require('./utils/constants.js');
const { Server } = require('socket.io');
const { initializeSockets } = require('./services/streamingService.js');

const PORT = process.env.SERVER_PORT || 5000;
const app = express();
const httpServer = createServer(app);

const socketService = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});

initializeSockets(socketService);

app.use(cookieParser());

const requestMiddleware = (req, res, next) => {
    const sessionId = req.cookies[COOKIE_NAME];

    if (sessionId) {
        // Store the session ID in the request object for later use
        req.sessionSid = sessionId;
        logger.info('Captured session ID:' + sessionId);
    } else {
        logger.info('No session.sid cookie found');
    }

    next();
};

// app.use(
//   cors({
//     credentials: true,
//     origin: (origin, callback) => callback(null, origin),
//   })
// );

const allowedOrigins = [
    'http://localhost:8100',
    'http://localhost:5173',
    process.env.UI_ENDPOINT
];

// CORS configuration function
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));
app.use(requestMiddleware);
app.use(express.json());
app.use((req, res, next) => {
    logger.info(`${req.method}: ${req.url} request received`);

    return next();
});

app.use(process.env.ROUTES_PREFIX || '/', routes);

httpServer.listen(PORT, () => {
    logger.info(`ChatDKG Server is running on http://localhost:${PORT}`);
});
