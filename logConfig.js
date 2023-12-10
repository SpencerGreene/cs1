const isDebug = true;
const isInfo = false;

function LOG(...args) { if (isDebug) console.log(...args); }
function INFO(...args) { if (isInfo) console.info(...args); }
function ERROR(...args) { console.error(...args); }

export { LOG, ERROR, INFO };