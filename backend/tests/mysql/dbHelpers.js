const prisma = require("../../config/prisma");

// Deletes all rows this test suite might have written to, in
// child-before-parent order. Only ever runs against jobfair_test
// (enforced by setupEnv.js), never against real data.
async function resetDb() {
    await prisma.applicantCompanyRelation.deleteMany({});
    await prisma.applicant.deleteMany({});
    await prisma.company.deleteMany({});
}

let idCounter = 0;
function testId() {
    idCounter += 1;
    return idCounter.toString(16).padStart(24, "0");
}

module.exports = { prisma, resetDb, testId };
