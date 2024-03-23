"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function responseHandler(req, res, next) {
    const originalSend = res.send;
    let isConverted = false;
    res.send = function (body) {
        const noAccessToken = typeof body === "object" && !body?.accessToken;
        const isSuccessStatus = res.statusCode >= 200 && res.statusCode <= 299;
        if (!isConverted && noAccessToken && isSuccessStatus) {
            isConverted = true;
            const dataKeys = Object.keys(body);
            const converted = destructureObject(body, dataKeys);
            return originalSend.call(res, converted);
        }
        else {
            return originalSend.call(res, body);
        }
    };
    next();
}
function destructureObject(data, dataKeys) {
    let instance = {};
    for (const index in dataKeys) {
        const key = dataKeys[index];
        const value = data[key];
        if (value && Array.isArray(value)) {
            // way to get the RowDataPacket's values
            const parsedArr = value.map((item) => JSON.parse(JSON.stringify(item)));
            const result = parsedArr.map((item) => convert(item));
            instance = { ...instance, [key]: result };
        }
        else if (data.hasOwnProperty(key) && typeof value === "object" && value) {
            const result = destructureObject(value, dataKeys);
            const converted = convert(result);
            const length = Object.keys(converted).length;
            const newValue = Array.isArray(value) ? length ? [converted] : [] : converted;
            instance = { ...instance, [key]: newValue };
        }
        else {
            instance = { ...instance, ...data };
        }
        ;
    }
    ;
    return instance;
}
;
function convert(data) {
    let modified = {};
    Object.keys(data).forEach((key, index) => {
        const lowerCaseKey = key.toLowerCase();
        modified = {
            ...modified,
            [lowerCaseKey]: data[`${key}`],
        };
    });
    return modified;
}
;
exports.default = responseHandler;
