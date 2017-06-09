let determineErrorMessage = (statusCode) => {
    let statusMessage = '';
    if (statusCode === 404) {
        statusMessage = 'api endpoint not found';
    } else if (statusCode === 500) {
        statusMessage = 'Internal Server Error';
    }
    return statusMessage;
};

let sendJsonResponse = (res, status, content) => {
    res.status(status).json(content);
};

let sanitizeRequestData = () => {

}

module.exports = {
    determineErrorMessage,
    sendJsonResponse,
    sanitizeRequestData
}