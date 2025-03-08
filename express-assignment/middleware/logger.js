const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const { method, url, ip } = req;
    
    // Get query parameters if any
    const queryParams = Object.keys(req.query).length ? JSON.stringify(req.query) : 'none';
    
    // Get request body if any (for POST/PUT requests)
    const body = Object.keys(req.body || {}).length ? JSON.stringify(req.body) : 'none';
    
    // Log the request details
    console.log(`
[${timestamp}] Request Details:
- Method: ${method}
- URL: ${url}
- IP Address: ${ip}
- Query Params: ${queryParams}
- Body: ${body}
----------------------------------------`);

    // Add response logging
    const originalSend = res.send;
    res.send = function (data) {
        console.log(`
[${timestamp}] Response Details:
- Status: ${res.statusCode}
- Response Time: ${Date.now() - req._startTime}ms
----------------------------------------`);
        originalSend.apply(res, arguments);
    };

    // Store request start time
    req._startTime = Date.now();
    next();
};

module.exports = logger; 