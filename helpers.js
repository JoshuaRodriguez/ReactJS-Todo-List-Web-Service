module.exports = (function() {
    let determineErrorMessage = (statusCode) => {
        let statusMessage = '';
        if (statusCode === 404) {
            statusMessage = 'api endpoint not found';
        } else if (statusCode === 500) {
            statusMessage = 'Internal Server Error';
        }
        return statusMessage;
    };

    return {
        determineErrorMessage
    }
}());