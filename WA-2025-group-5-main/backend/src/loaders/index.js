const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const helmet = require('helmet'); // You'll need to install this: npm install helmet

module.exports = (app) => {
    // Enable Cross Origin Resource Sharing to all origins by default
    app.use(cors({
        origin: '*', // Allow all origins for development - restrict this in production
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true // Enable if using cookies/sessions
    }));
    // PART OF PREVENTING CSRF (Cross-Site Request Forgery) ATTACKS XSS
    // Set proper security headers but with CSP configured to allow necessary resources
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Allow eval for development
                imgSrc: ["'self'", "data:", "http://localhost:8000"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                connectSrc: ["'self'"],
                fontSrc: ["'self'", "data:"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'none'"],
            },
        },
    }));

    // Request logger middleware
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });

    // Transforms raw string of req.body into JSON
    app.use(bodyParser.json({ limit: '10mb' }));
    // Parses urlencoded bodies (as sent by HTML forms)
    app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

    // Trust first proxy
    // This is important if you're behind a reverse proxy (like Nginx or Heroku)
    /*  Is it a security measure?
        Not directly, but it enables secure behavior in certain scenarios:


        Ensures cookies marked as secure are only sent over HTTPS.
        Allows accurate logging and rate-limiting based on the original client IP.
        Helps in scenarios where the app is behind a load balancer or reverse proxy.
    */
    app.set('trust proxy', 1);

    // Create a session
    // This is important for maintaining user sessions, especially when using authentication
    // and authorization mechanisms.
    // It allows you to store user-specific data across multiple requests.

    app.use(
        session({
            secret: process.env.SESSION_SECRET || "simple-secret", // Use environment variable in production
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: process.env.NODE_ENV === 'production', //  Secure cookies will be used in production
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
            },
        }),
    );

    // Serve static files from public directory if needed
    // app.use(express.static('public'));
};


/*
Session Secret:
The secret property is used to sign the session ID cookie. Using a strong, unpredictable
secret (preferably stored in an environment variable) helps prevent session tampering.
This is called Session Secret Management.


Secure Cookies:
The cookie.secure property ensures that cookies are only sent over HTTPS when in production.
This is called Secure Cookie Configuration.


Session Expiry:
The cookie.maxAge property sets a time limit for the session, reducing the risk of
long-lived sessions being exploited. This is part of Session Expiry Management.


Resave and SaveUninitialized:
Setting resave: false and saveUninitialized: false minimizes unnecessary session creation and
storage, reducing potential attack vectors. This is part of Session Storage Optimization.
*/
