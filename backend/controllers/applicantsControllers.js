const prisma = require("../config/prisma");
const { ObjectId } = require("bson");
const QRCode = require("qrcode");

const dotenv = require("dotenv");
dotenv.config();

const nodemailer = require("nodemailer");

const sendEmail = async (subject, message, send_to, sent_from) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.outlook.com",
        secure: false,
        port: "587",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const options = {
        from: 'internshipfair@sharjah.ac.ae',
        to: send_to,
        subject: subject,
        html: message
    };

    transporter.sendMail(options, function (err, info) {
        if (err) console.log(err);
        else { console.log("Email sent"); }
    });
};

// Branded HTML ticket-confirmation email. Table-based layout with inline
// styles for email-client compatibility (Gmail/Outlook strip <style> blocks
// and most fl<box); office green (#0E7F41) identity throughout.
function buildTicketEmail({ fullName, uniId, email, major, college, studyLevel, expectedToGraduate, cgpa, fileName, qrUrl, ticketUrl }) {
    const safe = (v, fallback = "—") => (v && String(v).trim() !== "" ? String(v) : fallback);
    const row = (label, value) => `
        <tr>
          <td style="padding:7px 0;color:#6b7280;font-size:14px;width:42%;">${label}</td>
          <td style="padding:7px 0;color:#111827;font-size:14px;font-weight:600;">${safe(value)}</td>
        </tr>`;

    return `
    <div style="margin:0;padding:24px 12px;background-color:#f3f6f4;font-family:'Segoe UI',Arial,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0E7F41,#0a5f31);padding:36px 32px;text-align:center;">
            <div style="display:inline-block;width:56px;height:56px;line-height:56px;background:rgba(255,255,255,0.15);border-radius:50%;font-size:28px;margin-bottom:12px;">🎟️</div>
            <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">You're all set, ${safe(fullName, "there").split(" ")[0]}!</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Your Job Fair 2025 ticket is confirmed</p>
          </td>
        </tr>

        <!-- QR -->
        <tr>
          <td style="padding:28px 32px 8px;text-align:center;">
            <img src="${qrUrl}" alt="Your ticket QR code" width="188" style="width:188px;height:188px;border:1px solid #eef2f0;border-radius:12px;padding:8px;background:#fff;" />
            <p style="margin:12px 0 0;color:#6b7280;font-size:13px;">Show this QR code at the entrance to check in</p>
          </td>
        </tr>

        <!-- Event details -->
        <tr>
          <td style="padding:20px 32px 8px;">
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:18px 20px;">
              <p style="margin:0 0 10px;color:#0a5f31;font-size:15px;font-weight:700;">📍 Event Details</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${row("Date", "Tuesday, 22 April 2025")}
                ${row("Time", "10:00 AM – 02:00 PM")}
                ${row("Location", "Building M11 — University of Sharjah")}
                ${row("Companies", "70+ participating")}
              </table>
            </div>
          </td>
        </tr>

        <!-- Applicant details -->
        <tr>
          <td style="padding:12px 32px 8px;">
            <div style="border:1px solid #eef2f0;border-radius:12px;padding:18px 20px;">
              <p style="margin:0 0 10px;color:#111827;font-size:15px;font-weight:700;">🧾 Your Ticket Info</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${row("Full Name", fullName)}
                ${row("University ID", uniId)}
                ${row("Email", email)}
                ${row("College", college)}
                ${row("Major", major)}
                ${row("Study Level", studyLevel)}
                ${row("Expected to Graduate", expectedToGraduate || "Graduated")}
                ${cgpa && cgpa != 0 ? row("GPA", cgpa) : ""}
                ${row("Uploaded CV", fileName || "No CV uploaded")}
              </table>
            </div>
          </td>
        </tr>

        <!-- Retrieve ticket CTA -->
        <tr>
          <td style="padding:16px 32px 4px;text-align:center;">
            <a href="${ticketUrl}" style="display:inline-block;background:#0E7F41;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:10px;">View my ticket anytime</a>
            <p style="margin:10px 0 0;color:#9ca3af;font-size:12px;">Retrieve it any time using your University ID (${safe(uniId)})</p>
          </td>
        </tr>

        <!-- Tips -->
        <tr>
          <td style="padding:16px 32px 8px;">
            <p style="margin:0 0 6px;color:#111827;font-size:14px;font-weight:600;">Before you come:</p>
            <ul style="margin:0;padding-left:18px;color:#4b5563;font-size:13px;line-height:1.7;">
              <li>Arrive early for a smoother check-in.</li>
              <li>Bring printed or digital copies of your CV.</li>
              <li>Dress professionally and be ready to meet employers.</li>
            </ul>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 32px 32px;text-align:center;border-top:1px solid #eef2f0;">
            <p style="margin:0;color:#9ca3af;font-size:13px;">Best regards,</p>
            <p style="margin:2px 0 0;color:#0a5f31;font-size:14px;font-weight:700;">CASTO Office — University of Sharjah</p>
          </td>
        </tr>
      </table>
    </div>`;
}

const newId = () => new ObjectId().toHexString();
const isValidId = (id) => /^[0-9a-fA-F]{24}$/.test(id || "");

// YYYY-MM-DD, matching the plain string shape Mongo always returned for
// these fields (dashboard frontend code does .split("-")[0] on birthdate
// directly — see MainBanner.jsx — so a raw Date's full ISO datetime string
// must not leak through).
function dateOnlyString(date) {
    if (!date) return null;
    return date.toISOString().slice(0, 10);
}

// Maps a Prisma `applicants` row back into the applicantDetails-nested shape
// the frontend already expects (unchanged API contract from the Mongo days).
// Kept identical to apps/dashboard/backend's version since both apps' UIs
// consume the same shape. cgpa/birthdate/ExpectedToGraduate/gender/
// studyLevel are now real Decimal/Date/Enum types in Prisma — converted
// back to the plain strings the frontend has always received.
function toApplicantJson(row) {
    if (!row) return row;
    return {
        _id: row.id,
        applicantDetails: {
            uniId: row.uniId,
            fullName: row.fullName,
            birthdate: dateOnlyString(row.birthdate),
            gender: row.gender,
            nationality: row.nationality,
            studyLevel: row.studyLevel,
            college: row.college,
            major: row.major,
            email: row.email,
            phoneNumber: row.phoneNumber,
            cgpa: row.cgpa === null || row.cgpa === undefined ? null : row.cgpa.toString(),
            city: row.city,
            linkedIn: row.linkedIn,
            technicalSkills: row.technicalSkills,
            nonTechnicalSkills: row.nonTechnicalSkills,
            experience: row.experience,
            languages: row.languages,
            ExpectedToGraduate: dateOnlyString(row.expectedToGraduate),
            fieldInterest: row.fieldInterest,
            opportunityType: row.opportunityType,
            preferredWorkCity: row.preferredWorkCity,
            careerGoals: row.careerGoals,
            availability: row.availability,
        },
        cv: row.cvMetadata,
        attended: row.attended,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        user_id: (row.relations || []).filter(r => r.relationType === "applied").map(r => r.company?.companyName ?? r.companyId),
        flags: (row.relations || []).filter(r => r.relationType === "flagged").map(r => r.company?.companyName ?? r.companyId),
        rejectedBy: (row.relations || []).filter(r => r.relationType === "rejected").map(r => r.company?.companyName ?? r.companyId),
        shortlistedBy: (row.relations || []).filter(r => r.relationType === "shortlisted").map(r => r.company?.companyName ?? r.companyId),
    };
}

const applicantWithRelationsInclude = {
    relations: { include: { company: { select: { companyName: true } } } },
};

const testFunc = async (req, res) => {
    res.json("Make it work");
};

const getAllApplicants = async (req, res) => {
    try {
        const applicants = await prisma.applicant.findMany({
            where: { fullName: { not: null } },
            include: applicantWithRelationsInclude,
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json(applicants.map(toApplicantJson));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const VALID_GENDERS = ["Male", "Female"];
const VALID_STUDY_LEVELS = ["Bachelor", "Master", "PhD", "Diploma"];

// gender/studyLevel are now real MySQL ENUMs (see schema.prisma) — Prisma
// throws if handed a value outside the set, unlike Mongo's old untyped
// Object field. This is the live public submission endpoint, so an
// unrecognized value (blank, typo, a form field that hasn't caught up with
// the enum) must degrade to null rather than 500ing a real applicant's
// submission.
function toEnumOrNull(value, allowed) {
    return allowed.includes(value) ? value : null;
}

// cgpa is now DECIMAL(3,2) — same conversion rules as the migration
// (see apps/dashboard/backend/migrations/generate-seed.js's sqlCgpa):
// blank/non-numeric/out-of-range -> null rather than rejecting the submission.
function toCgpaOrNull(value) {
    if (value === null || value === undefined || value === "") return null;
    const n = Number(value);
    if (isNaN(n) || n < 0 || n > 9.99) return null;
    return n;
}

function toDateOrNull(value) {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
}

async function createApplicant(req, { userIdField }) {
    const d = req.body;
    const cvData = req.file ? {
        url: req.file.path,
        public_id: req.file.filename,
        originalname: req.file.originalname
    } : null;

    const id = newId();

    await prisma.applicant.create({
        data: {
            id,
            uniId: d.uniId ?? null,
            fullName: d.fullName ?? null,
            birthdate: toDateOrNull(d.birthdate),
            gender: toEnumOrNull(d.gender, VALID_GENDERS),
            nationality: d.nationality ?? null,
            studyLevel: toEnumOrNull(d.studyLevel, VALID_STUDY_LEVELS),
            college: d.college ?? null,
            major: d.major ?? null,
            email: d.email ?? null,
            phoneNumber: d.phoneNumber ?? null,
            cgpa: toCgpaOrNull(d.cgpa),
            city: d.city ?? null,
            linkedIn: d.linkedIn ?? null,
            technicalSkills: d.technicalSkills ?? null,
            nonTechnicalSkills: d.nonTechnicalSkills ?? null,
            experience: d.experience ?? null,
            languages: d.languages ?? null,
            expectedToGraduate: toDateOrNull(d.ExpectedToGraduate),
            fieldInterest: d.fieldInterest ?? undefined,
            opportunityType: d.opportunityType ?? undefined,
            preferredWorkCity: d.preferredWorkCity ?? null,
            careerGoals: d.careerGoals ?? null,
            availability: d.availability ?? null,
            cvMetadata: cvData ?? undefined,
            attended: false,
        },
    });

    if (userIdField && isValidId(userIdField)) {
        const companyExists = await prisma.company.findUnique({ where: { id: userIdField }, select: { id: true } });
        if (companyExists) {
            await prisma.applicantCompanyRelation.create({
                data: { applicantId: id, companyId: userIdField, relationType: "applied" },
            }).catch(() => {});
        }
    }

    return prisma.applicant.findUnique({ where: { id }, include: applicantWithRelationsInclude });
}

const addApplicant = async (req, res) => {
    const userId = !req.user ? null : req.user._id;
    try {
        console.log("Recieved POST request to /applicants");
        console.log("Request body: ", req.body);
        console.log("Uploaded applicant CV: ", req.file);

        const applicantProfile = await createApplicant(req, { userIdField: userId });
        console.log(applicantProfile);

        QRCode.toDataURL(JSON.stringify(applicantProfile.id), (err, url) => {
            res.status(200).json({ url: url, applicantProfile: toApplicantJson(applicantProfile) });
            const ticketUrl = `${req.body.dashboardUrl || 'https://job-fair-control.vercel.app'}/my-qr-code`;
            sendEmail(
                `Your Job Fair 2025 Ticket — #${req.body.uniId}`,
                buildTicketEmail({
                    fullName: req.body.fullName,
                    uniId: req.body.uniId,
                    email: req.body.email,
                    major: req.body.major,
                    college: req.body.college,
                    studyLevel: req.body.studyLevel,
                    expectedToGraduate: req.body.ExpectedToGraduate,
                    cgpa: req.body.cgpa,
                    fileName: req.file?.originalname,
                    qrUrl: url,
                    ticketUrl,
                }),
                req.body.email,
                `CASTO Office <${process.env.USER_EMAIL}>`
            );
        });

    } catch (error) {
        console.log("----this is the error---\n\n\n\n\n\n\n\n\n\n\n\n-", error, "---------\n\n\n\n\n\n\n\n");
        res.status(500).json({ error: "Request is never sent...T-T" });
    }
};

const getApplicant = async (req, res) => {
    const { id } = req.params;

    if (!isValidId(id)) {
        return res.status(404).json({ error: "No such id for an applicant" });
    }

    try {
        const applicant = await prisma.applicant.findUnique({ where: { id }, include: applicantWithRelationsInclude });
        res.status(200).json(toApplicantJson(applicant));
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: "did not find the applicant" });
    }
};

// See apps/dashboard/backend's addRelationByCompanyName: the frontend
// (shared BriefInfo.jsx-equivalent flows) sends the company NAME, not id.
async function findCompanyIdByName(companyName) {
    if (!companyName) return null;
    const company = await prisma.company.findFirst({ where: { companyName }, select: { id: true } });
    return company?.id ?? null;
}

async function addRelationByCompanyName(applicantId, companyName, relationType) {
    const companyId = await findCompanyIdByName(companyName);
    if (!companyId) return null;
    return prisma.applicantCompanyRelation.upsert({
        where: { applicantId_companyId_relationType: { applicantId, companyId, relationType } },
        create: { applicantId, companyId, relationType },
        update: {},
    });
}

const updateApplicant = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(404).json({ error: "No such id for an applicant" });
        }

        if (req.body.hasOwnProperty("user_id") && Array.isArray(req.body.user_id) && req.body.user_id[0]) {
            await addRelationByCompanyName(id, req.body.user_id[0], "applied")
                .catch((err) => console.log({ error: err.message }));
        }

        const applicant = await prisma.applicant.findUnique({ where: { id }, include: applicantWithRelationsInclude });
        console.log(id);
        console.log(applicant);

        res.status(200).json(toApplicantJson(applicant));

    } catch (error) {
        console.log({ error: error.message });
        res.status(404).json({ error: "No such id for an applicant" });
    }
};

const addApplicantPublic = async (req, res) => {
    try {
        const applicantProfile = await createApplicant(req, { userIdField: null });

        console.log(applicantProfile, "------this is the added applicant publically-----");

        QRCode.toDataURL((JSON.stringify(applicantProfile.id)), (err, url) => {
            res.status(200).json({ url: url, applicantProfile: toApplicantJson(applicantProfile) });
            const ticketUrl = `${req.body.dashboardUrl || 'https://job-fair-control.vercel.app'}/my-qr-code`;
            sendEmail(
                `Your Entry Confirmation – Ticket #${req.body.uniId}`,
                `<div style="max-width:600px;margin:auto;padding:30px;background-color:#ffffff;border-radius:12px;box-shadow:0 0 15px rgba(0,0,0,0.08);font-family:Arial,sans-serif;">
                  <h2 style="color:#0E7F41;text-align:center;font-weight:bold;">🎓 Your Entry Confirmation</h2>

                  <p style="color:#34495e;font-size:16px;line-height:1.6;">
                    Dear <strong>${req.body.fullName}</strong>,
                  </p>

                  <p style="color:#34495e;font-size:16px;line-height:1.6;">
                    The <strong>Career Advancement and Student Training Office (CASTO)</strong> is excited to welcome you to our annual <strong>Internship and Career Fair 2025</strong>!
                  </p>

                  <p style="color:#2c3e50;font-size:16px;">Please keep your QR code handy on the day of the event for entry and to share your profile with employers.</p>

                  <div style="margin-bottom:20px;">
                    <h3 style="color:#2c3e50;border-bottom:1px solid #ddd;padding-bottom:5px;">🧾 Your Ticket Info</h3>
                    <ul style="list-style-type:none;padding-left:0;color:#555;">
                        <li><strong>Full Name:</strong> ${req.body.fullName ? req.body.fullName : 'Not specified'}</li>
                        <li><strong>ID Number:</strong> ${req.body.uniId ? req.body.uniId : 'Not specified'}</li>
                        <li><strong>Email:</strong> ${req.body.email ? req.body.email : 'Not specified'}</li>
                        <li><strong>Major:</strong> ${req.body.major ? req.body.major : 'Not specified'}</li>
                        <li><strong>College:</strong> ${req.body.college ? req.body.college : 'Not specified'}</li>
                        <li><strong>Study Level:</strong> ${req.body.studyLevel ? req.body.studyLevel : 'Not specified'}</li>
                        <li><strong>Expected to Graduate:</strong> ${req.body.ExpectedToGraduate ? req.body.ExpectedToGraduate : 'Graduted'}</li>
                        ${req.body.cgpa && req.body.cgpa != 0 ? `<li><strong>GPA:</strong> ${req.body.cgpa}</li>` : ''}
                        ${req.file?.originalname ? `<li><strong>Uploaded File:</strong> ${req.file.originalname}</li>` : 'No uploaded CV'}
                    </ul>
                </div>


                  <div style="margin:20px 0;padding:15px;border:1px solid #e0e0e0;border-radius:8px;background-color:#f4fef7;">
                    <h3 style="color:#2c3e50;margin-bottom:10px;">📍 Event Details</h3>
                    <ul style="list-style-type:none;padding-left:0;color:#555;">
                      <li><strong>Date:</strong> 22 - Apr - 2025 (Tuesday)</li>
                      <li><strong>Time:</strong> 10:00 AM – 2:00 PM</li>
                      <li><strong>Venue:</strong> Main Building M11 – University of Sharjah</li>
                      <li><strong>Companies Participating:</strong> 70+ Employers</li>
                    </ul>
                  </div>

                  <div style="text-align:center;margin:30px 0;">
                    <img src="${url}" alt="QR Code" style="max-width:200px;border-radius:6px;" />
                    <p style="color:#777;font-size:14px;margin-top:8px;">Scan this QR code at the entrance</p>
                  </div>

                  <div style="text-align:center;margin:20px 0;padding:12px;background-color:#f4fef7;border-radius:8px;">
                    <p style="color:#34495e;font-size:14px;margin:0;">Lost this email or need your ticket again?</p>
                    <a href="${ticketUrl}" style="color:#0E7F41;font-weight:bold;font-size:14px;">View your ticket anytime here</a>
                    <p style="color:#777;font-size:12px;margin:6px 0 0;">using your University ID (${req.body.uniId})</p>
                  </div>

                  <div style="margin-top:20px;">
                    <p style="color:#34495e;font-size:16px;">✅ Quick Tips:</p>
                    <ul style="color:#555;padding-left:20px;">
                      <li>Arrive early to avoid the crowd.</li>
                      <li>Dress professionally and be confident!</li>
                    </ul>
                  </div>

                  <footer style="text-align:center;margin-top:30px;border-top:1px solid #e0e0e0;padding-top:15px;">
                    <p style="color:#999;font-size:14px;">Best of Luck!</p>
                    <p style="color:#999;font-size:14px;">CASTO Team – University of Sharjah</p>
                  </footer>
                </div>`,
                req.body.email,
                "CASTO – Internship Fair <internshipfair@sharjah.ac.ae>"
            );
        });

    } catch (error) {
        console.log("Error in addApplicantPublic:", error);
        res.status(500).json({ error: error.message });
    }
};

const emailRequest = async (req, res) => {
    console.log(req.body, "This is the request\n\n\n\n\n");

    const emailTemplate = {
        i: `<div style="max-width:600px; padding:20px; background-color:#f9f9f9; border-radius:10px; box-shadow:0 0 10px rgba(0,0,0,0.1); text-align:center; font-family:Arial, sans-serif; color:#333; line-height:1.6;">
            <h1 style="margin-bottom:20px; font-size:24px;">Interview Invitation</h1>
            <p>Dear ${req.body.fullName},</p>
            <p>Congratulations! We are pleased to inform you that you have been selected for an interview.</p>
            <p><strong>Interview Details:</strong></p>
            <ul style="list-style-type:none; padding:0;">
                <li><strong>Name:</strong> ${req.body.fullName}</li>
                <li><strong>Email:</strong> ${req.body.email}</li>
                <li><strong>Interview Date:</strong> [Interview Date]</li>
                <li><strong>Interview Time:</strong> [Interview Time]</li>
                <li><strong>Interview Location:</strong> [Interview Location]</li>
            </ul>
            <p>Please confirm your availability for the interview by replying to this email at your earliest convenience.</p>
            <p>We look forward to meeting you.</p>
            <p>Best Regards,<br>Interview Team</p>
        </div>
        `,
        r: `<div style="max-width:600px; padding:20px; background-color:#f9f9f9; border-radius:10px; box-shadow:0 0 10px rgba(0,0,0,0.1); text-align:center; font-family:Arial, sans-serif; color:#333; line-height:1.6;">
        <h1 style="margin-bottom:20px; font-size:24px;">Application Update</h1>
        <p>Dear ${req.body.fullName},</p>
        <p>We regret to inform you that your application for the position has not been successful. We sincerely appreciate the time and effort you put into your application.</p>
        <p>We received a high number of qualified applicants, and after careful consideration, we have selected candidates whose qualifications more closely match our needs at this time.</p>
        <p>Thank you for your interest in joining our team. We wish you all the best in your future endeavors.</p>
        <p>Best Regards,<br>The Hiring Team</p>
    </div>
    `,
        o: `Hala`

    };

    switch (req.body.type) {
        case "interview":
            sendEmail(
                `JobFair ticket #${req.body.uniId}`,
                emailTemplate["i"],
                `${req.body.email}`,
                "🥲 <internshipfair@sharjah.ac.ae>",
            );
            break;
        case "rejection":
            sendEmail(
                `JobFair ticket #${req.body.uniId}`,
                emailTemplate["r"],
                `${req.body.email}`,
                "🥲 <internshipfair@sharjah.ac.ae>",
            );
            break;
        case "other":
            sendEmail(
                `JobFair ticket #${req.body.uniId}`,
                emailTemplate["o"],
                `${req.body.email}`,
                "🥲 <internshipfair@sharjah.ac.ae>",
            );
    }

    res.status(200).json({ message: "email sent!" });
};

const apply = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(404).json({ error: "No such a comapny with this id" });
        }

        if (req.body.hasOwnProperty("user_id") && Array.isArray(req.body.user_id) && req.body.user_id[0]) {
            await addRelationByCompanyName(id, req.body.user_id[0], "applied");
        }

        const applicant = await prisma.applicant.findUnique({ where: { id }, include: applicantWithRelationsInclude });
        console.log(id);
        console.log(applicant);

        res.status(200).json(toApplicantJson(applicant));

    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const getCompanies = async (req, res) => {
    try {
        const companies = await prisma.company.findMany();
        res.json(companies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCompany = async (req, res) => {
    const { id } = req.params;
    if (!isValidId(id)) {
        return res.status(400).json({ message: "Not a valid id" + id });
    }

    try {
        const company = await prisma.company.findUnique({ where: { id } });
        res.json(company);
    } catch (error) {
        return res.json({ error: error });
    }
};

const confirmAttendant = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(404).json({ error: "No such id for an applicant" });
        }

        let applicant;
        if (req.body.hasOwnProperty("attended")) {
            applicant = await prisma.applicant.update({ where: { id }, data: { attended: true }, include: applicantWithRelationsInclude });
        } else {
            applicant = await prisma.applicant.findUnique({ where: { id }, include: applicantWithRelationsInclude });
        }
        console.log(id);
        console.log(applicant);

        res.status(200).json(toApplicantJson(applicant));

    } catch (error) {
        // Was a hang-forever bug: this catch never sent a response, so a
        // well-formed but nonexistent id (isValidId only checks format,
        // not existence) left the request open with no reply.
        console.log({ error: error.message });
        res.status(404).json({ error: "No such id for an applicant" });
    }
};

// Function to send post-fair evaluation email
const sendEvaluationEmail = async (req, res) => {
    try {
        const { applicantEmail, applicantName, uniId, surveyLink } = req.body;

        if (!applicantEmail || !applicantName) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const evaluationEmailTemplate = `
        <div style="max-width:600px;margin:auto;padding:30px;background-color:#ffffff;border-radius:12px;box-shadow:0 0 15px rgba(0,0,0,0.08);font-family:Arial,sans-serif;">
            <div style="text-align:center;margin-bottom:20px;">
                <h2 style="color:#0E7F41;margin:0;">Thank You for Attending!</h2>
                <p style="color:#666;font-size:14px;margin-top:5px;">Internship & Career Fair 2025</p>
            </div>

            <p style="color:#34495e;font-size:16px;line-height:1.6;">
                Dear <strong>${applicantName}</strong>,
            </p>

            <p style="color:#34495e;font-size:16px;line-height:1.6;">
                Thank you for attending the <strong>University of Sharjah Internship & Career Fair 2025</strong>. We hope you had a valuable experience connecting with potential employers.
            </p>

            <div style="margin:25px 0;padding:20px;border-radius:10px;background:linear-gradient(135deg, #f0fff4 0%, #e6f7ff 100%);border:1px solid #b7eb8f;">
                <h3 style="color:#0E7F41;margin-top:0;">We Value Your Feedback!</h3>
                <p style="color:#555;font-size:15px;margin-bottom:15px;">
                    Your opinion matters to us. Please take a few minutes to share your experience and help us improve future events.
                </p>
                <a href="${surveyLink || 'https://forms.office.com/your-survey-link'}"
                   style="display:inline-block;padding:12px 30px;background-color:#0E7F41;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:bold;font-size:15px;">
                    Complete the Survey
                </a>
            </div>

            <div style="margin:20px 0;padding:15px;border:1px solid #e0e0e0;border-radius:8px;background-color:#fafafa;">
                <h4 style="color:#2c3e50;margin-top:0;">What's Next?</h4>
                <ul style="color:#555;padding-left:20px;margin-bottom:0;">
                    <li>Companies will be reviewing applications and reaching out to shortlisted candidates.</li>
                    <li>Keep an eye on your email for interview invitations.</li>
                    <li>Update your LinkedIn profile with your job fair experience.</li>
                    <li>Follow up with companies you're interested in.</li>
                </ul>
            </div>

            <div style="margin-top:25px;padding:15px;background-color:#f8f9fa;border-radius:8px;">
                <p style="color:#666;font-size:14px;margin:0;text-align:center;">
                    Questions? Contact us at <a href="mailto:internshipfair@sharjah.ac.ae" style="color:#0E7F41;">internshipfair@sharjah.ac.ae</a>
                </p>
            </div>

            <footer style="text-align:center;margin-top:30px;border-top:1px solid #e0e0e0;padding-top:15px;">
                <p style="color:#999;font-size:14px;margin:5px 0;">Best of luck in your career journey!</p>
                <p style="color:#999;font-size:14px;margin:5px 0;">CASTO Team – University of Sharjah</p>
            </footer>
        </div>
        `;

        await sendEmail(
            `Your Feedback Matters! - Career Fair 2025`,
            evaluationEmailTemplate,
            applicantEmail,
            "CASTO – Career Fair Feedback <internshipfair@sharjah.ac.ae>"
        );

        res.status(200).json({ message: "Evaluation email sent successfully" });
    } catch (error) {
        console.error("Error sending evaluation email:", error);
        res.status(500).json({ error: error.message });
    }
};

// Function to send bulk evaluation emails to all attendees
const sendBulkEvaluationEmails = async (req, res) => {
    try {
        const { surveyLink } = req.body;

        const attendees = await prisma.applicant.findMany({ where: { attended: true } });

        if (attendees.length === 0) {
            return res.status(404).json({ message: "No attendees found" });
        }

        let successCount = 0;
        let failCount = 0;

        for (const attendee of attendees) {
            try {
                const email = attendee.email;
                const name = attendee.fullName;

                if (email && name) {
                    const evaluationEmailTemplate = `
                    <div style="max-width:600px;margin:auto;padding:30px;background-color:#ffffff;border-radius:12px;box-shadow:0 0 15px rgba(0,0,0,0.08);font-family:Arial,sans-serif;">
                        <div style="text-align:center;margin-bottom:20px;">
                            <h2 style="color:#0E7F41;margin:0;">Thank You for Attending!</h2>
                            <p style="color:#666;font-size:14px;margin-top:5px;">Internship & Career Fair 2025</p>
                        </div>

                        <p style="color:#34495e;font-size:16px;line-height:1.6;">
                            Dear <strong>${name}</strong>,
                        </p>

                        <p style="color:#34495e;font-size:16px;line-height:1.6;">
                            Thank you for attending the <strong>University of Sharjah Internship & Career Fair 2025</strong>. We hope you had a valuable experience connecting with potential employers.
                        </p>

                        <div style="margin:25px 0;padding:20px;border-radius:10px;background:linear-gradient(135deg, #f0fff4 0%, #e6f7ff 100%);border:1px solid #b7eb8f;">
                            <h3 style="color:#0E7F41;margin-top:0;">We Value Your Feedback!</h3>
                            <p style="color:#555;font-size:15px;margin-bottom:15px;">
                                Your opinion matters to us. Please take a few minutes to share your experience and help us improve future events.
                            </p>
                            <a href="${surveyLink || 'https://forms.office.com/your-survey-link'}"
                               style="display:inline-block;padding:12px 30px;background-color:#0E7F41;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:bold;font-size:15px;">
                                Complete the Survey
                            </a>
                        </div>

                        <footer style="text-align:center;margin-top:30px;border-top:1px solid #e0e0e0;padding-top:15px;">
                            <p style="color:#999;font-size:14px;margin:5px 0;">Best of luck in your career journey!</p>
                            <p style="color:#999;font-size:14px;margin:5px 0;">CASTO Team – University of Sharjah</p>
                        </footer>
                    </div>
                    `;

                    await sendEmail(
                        `Your Feedback Matters! - Career Fair 2025`,
                        evaluationEmailTemplate,
                        email,
                        "CASTO – Career Fair Feedback <internshipfair@sharjah.ac.ae>"
                    );
                    successCount++;
                }
            } catch (emailError) {
                console.error(`Failed to send email to ${attendee.email}:`, emailError);
                failCount++;
            }
        }

        res.status(200).json({
            message: "Bulk evaluation emails processed",
            totalAttendees: attendees.length,
            successCount,
            failCount
        });
    } catch (error) {
        console.error("Error sending bulk evaluation emails:", error);
        res.status(500).json({ error: error.message });
    }
};

// Public ticket lookup — a student who already applied can come back, enter
// the University ID they applied with, and retrieve their ticket (QR value +
// attendance status) instead of filling the whole form again. Mirrors the
// dashboard's lookupApplicantByUniId so both apps behave identically.
const lookupApplicantByUniId = async (req, res) => {
    try {
        const uniId = req.params.uniId?.trim();
        if (!uniId) return res.status(400).json({ error: "University ID is required" });

        const applicant = await prisma.applicant.findFirst({
            where: { uniId },
            orderBy: { createdAt: "desc" },
        });
        if (!applicant) return res.status(404).json({ error: "No application found for that University ID" });

        res.status(200).json({
            id: applicant.id,
            fullName: applicant.fullName,
            uniId: applicant.uniId,
            attended: applicant.attended,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllApplicants, addApplicant, getApplicant, updateApplicant, testFunc, addApplicantPublic,
    emailRequest, apply, getCompanies, getCompany, confirmAttendant, sendEvaluationEmail, sendBulkEvaluationEmails,
    lookupApplicantByUniId,
};
