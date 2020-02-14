module.exports = {
    transform: {
        "^.+\\.(js|ts)$": "ts-jest",
    },
    testRegex: "(test|spec)\\.(js|ts)$",
    moduleFileExtensions: ["ts", "js"],
    collectCoverage: true,
};