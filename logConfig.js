const isDebug = true;

function LOG(...args) {
    if (isDebug) console.log(...args);
}

function ERROR(...args) {
    console.error(...args);
}

export { LOG, ERROR };