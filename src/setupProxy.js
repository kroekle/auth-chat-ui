const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    // app.use(proxy('/users', { target: 'http://localhost:8777'}));
    // app.use(proxy('/messages', { target: 'http://localhost:8778'}));
    app.use(proxy('/users', { target: 'http://localhost:9000'}));
    app.use(proxy('/messages', { target: 'http://localhost:9000'}));
}