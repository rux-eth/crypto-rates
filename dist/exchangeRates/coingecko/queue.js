"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leftInQueue = exports.maxQueue = exports.increaseQueue = exports.getQueue = exports.resetQueue = exports.defaultKey = void 0;
// not very secure tbh. Provide keys at your own risk
let queue = new Map();
let timeout;
exports.defaultKey = 'key';
async function resetQueue(key) {
    try {
        if (timeout) {
            await timeout;
        }
        else {
            console.log('waiting');
            timeout = new Promise((resolve) => setTimeout(resolve, 60000));
            await timeout;
            timeout = undefined;
        }
    }
    finally {
        queue.set(key !== null && key !== void 0 ? key : exports.defaultKey, 0);
    }
}
exports.resetQueue = resetQueue;
function getQueue(key) {
    var _a;
    return (_a = queue.get(key !== null && key !== void 0 ? key : exports.defaultKey)) !== null && _a !== void 0 ? _a : 0;
}
exports.getQueue = getQueue;
function increaseQueue(num, key) {
    var _a;
    const k = key !== null && key !== void 0 ? key : exports.defaultKey;
    const oldQueue = (_a = queue.get(k)) !== null && _a !== void 0 ? _a : 0;
    queue.set(k, oldQueue + num);
}
exports.increaseQueue = increaseQueue;
function maxQueue(key) {
    return (key !== null && key !== void 0 ? key : exports.defaultKey) === exports.defaultKey ? 45 : 500;
}
exports.maxQueue = maxQueue;
function leftInQueue(key) {
    const k = key !== null && key !== void 0 ? key : exports.defaultKey;
    return maxQueue(k) - getQueue(k);
}
exports.leftInQueue = leftInQueue;
