// Separate Jest config for MySQL integration tests. This app has no
// demo/in-memory mode, so these are the only automated backend tests —
// see apps/dashboard/backend/tests/mysql/jest.config.js for the sibling
// pattern this mirrors.
module.exports = {
    rootDir: "../../",
    testEnvironment: "node",
    setupFiles: ["<rootDir>/tests/mysql/setupEnv.js"],
    testMatch: ["<rootDir>/tests/mysql/**/*.test.js"],
};
