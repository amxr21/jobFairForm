// Mock nodemailer BEFORE requiring app — the real sendEmail() call would
// otherwise attempt a live SMTP connection using whatever EMAIL_USER/
// EMAIL_PASS happen to be in the environment, which is neither reliable
// nor safe to trigger from an automated test run.
jest.mock("nodemailer", () => ({
    createTransport: () => ({
        sendMail: (options, cb) => cb(null, { accepted: [options.to] }),
    }),
}));

const request = require("supertest");
const { prisma, resetDb, testId } = require("./dbHelpers");
const app = require("../../app");

describe("public application submission (POST /applicants, no auth)", () => {
    beforeEach(async () => {
        await resetDb();
    });

    afterAll(async () => {
        await resetDb();
        await prisma.$disconnect();
    });

    it("accepts a minimal valid submission and returns a QR code + the created applicant", async () => {
        const res = await request(app)
            .post("/applicants")
            .field("uniId", "50000001")
            .field("fullName", "Test Applicant")
            .field("email", "test.applicant@example.com")
            .field("gender", "Female")
            .field("studyLevel", "Bachelor")
            .field("cgpa", "3.75")
            .field("birthdate", "2003-05-10")
            .field("ExpectedToGraduate", "2026-06-01");

        expect(res.status).toBe(200);
        expect(res.body.url).toMatch(/^data:image\/png;base64,/); // QR code data URL
        expect(res.body.applicantProfile._id).toBeTruthy();
        expect(res.body.applicantProfile.applicantDetails.fullName).toBe("Test Applicant");
        expect(res.body.applicantProfile.applicantDetails.gender).toBe("Female");
        expect(res.body.applicantProfile.applicantDetails.cgpa).toBe("3.75");
        // birthdate/ExpectedToGraduate must round-trip as plain YYYY-MM-DD,
        // not a full ISO datetime string (see toApplicantJson/dateOnlyString)
        expect(res.body.applicantProfile.applicantDetails.birthdate).toBe("2003-05-10");
        expect(res.body.applicantProfile.applicantDetails.ExpectedToGraduate).toBe("2026-06-01");
        expect(res.body.applicantProfile.attended).toBe(false);
        expect(res.body.applicantProfile.flags).toEqual([]);
    });

    it("stores an invalid gender value as null instead of crashing (enum guard)", async () => {
        const res = await request(app)
            .post("/applicants")
            .field("uniId", "50000002")
            .field("fullName", "Bad Gender Test")
            .field("gender", "Not A Real Option");

        expect(res.status).toBe(200);
        expect(res.body.applicantProfile.applicantDetails.gender).toBeNull();
    });

    it("stores a non-numeric cgpa as null instead of crashing (decimal guard)", async () => {
        const res = await request(app)
            .post("/applicants")
            .field("uniId", "50000003")
            .field("fullName", "Bad CGPA Test")
            .field("cgpa", "not-a-number");

        expect(res.status).toBe(200);
        expect(res.body.applicantProfile.applicantDetails.cgpa).toBeNull();
    });

    it("stores an out-of-range cgpa as null instead of crashing", async () => {
        const res = await request(app)
            .post("/applicants")
            .field("uniId", "50000004")
            .field("fullName", "Out Of Range CGPA")
            .field("cgpa", "40"); // the exact real-data outlier pattern this app must not choke on

        expect(res.status).toBe(200);
        expect(res.body.applicantProfile.applicantDetails.cgpa).toBeNull();
    });

    it("stores an unparseable birthdate as null instead of crashing", async () => {
        const res = await request(app)
            .post("/applicants")
            .field("uniId", "50000005")
            .field("fullName", "Bad Date Test")
            .field("birthdate", "not-a-date");

        expect(res.status).toBe(200);
        expect(res.body.applicantProfile.applicantDetails.birthdate).toBeNull();
    });

    it("handles a completely empty submission (all fields blank) without crashing", async () => {
        const res = await request(app).post("/applicants");
        expect(res.status).toBe(200);
        expect(res.body.applicantProfile._id).toBeTruthy();
    });
});

describe("GET /companies and GET /companies/:id (public)", () => {
    let companyId;

    beforeEach(async () => {
        await resetDb();
        companyId = testId();
        await prisma.company.create({
            data: {
                id: companyId, companyName: "Test Co", email: "testco@example.com",
                password: "hash", sector: "Private", status: "Confirmed",
            },
        });
    });

    afterAll(async () => {
        await resetDb();
        await prisma.$disconnect();
    });

    it("lists companies", async () => {
        const res = await request(app).get("/companies");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.some(c => c.id === companyId)).toBe(true);
    });

    it("returns a single company by id", async () => {
        const res = await request(app).get(`/companies/${companyId}`);
        expect(res.status).toBe(200);
        expect(res.body.companyName).toBe("Test Co");
        expect(res.body.sector).toBe("Private");
    });

    it("400s on a malformed company id", async () => {
        const res = await request(app).get("/companies/not-a-valid-id");
        expect(res.status).toBe(400);
    });
});

describe("PATCH /applicant/apply/:id (public, name-based company relation)", () => {
    let companyId, applicantId;
    const COMPANY_NAME = "Apply Test Co";

    beforeEach(async () => {
        await resetDb();
        companyId = testId();
        applicantId = testId();
        await prisma.company.create({
            data: { id: companyId, companyName: COMPANY_NAME, email: "apply@example.com", password: "hash" },
        });
        await prisma.applicant.create({
            data: { id: applicantId, uniId: "50000010", fullName: "Apply Test Applicant" },
        });
    });

    afterAll(async () => {
        await resetDb();
        await prisma.$disconnect();
    });

    it("resolves the company NAME to a real relation row (matches dashboard app's behavior)", async () => {
        const res = await request(app)
            .patch(`/applicant/apply/${applicantId}`)
            .send({ user_id: [COMPANY_NAME] });

        expect(res.status).toBe(200);
        expect(res.body.user_id).toContain(COMPANY_NAME);

        const row = await prisma.applicantCompanyRelation.findUnique({
            where: { applicantId_companyId_relationType: { applicantId, companyId, relationType: "applied" } },
        });
        expect(row).not.toBeNull();
    });

    it("404s on a malformed applicant id", async () => {
        const res = await request(app)
            .patch("/applicant/apply/not-a-valid-id")
            .send({ user_id: [COMPANY_NAME] });
        expect(res.status).toBe(404);
    });
});

describe("email endpoints (mocked transport, verify they don't crash)", () => {
    it("POST /email accepts an interview-type request", async () => {
        const res = await request(app)
            .post("/email")
            .send({ type: "interview", fullName: "Test", email: "test@example.com", uniId: "50000001" });
        expect(res.status).toBe(200);
    });

    it("POST /evaluation-email requires applicantEmail and applicantName", async () => {
        const res = await request(app).post("/evaluation-email").send({});
        expect(res.status).toBe(400);
    });

    it("POST /evaluation-email succeeds with required fields", async () => {
        const res = await request(app)
            .post("/evaluation-email")
            .send({ applicantEmail: "test@example.com", applicantName: "Test Applicant" });
        expect(res.status).toBe(200);
    });
});

describe("protected routes reject requests without a valid token", () => {
    it("GET /applicants with a garbage token returns 401", async () => {
        const res = await request(app).get("/applicants").set("Authorization", "Bearer not-a-real-token");
        expect(res.status).toBe(401);
    });

    it("GET / (testFunc) with a garbage token returns 401", async () => {
        const res = await request(app).get("/").set("Authorization", "Bearer not-a-real-token");
        expect(res.status).toBe(401);
    });
});
