require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const requireAuth = require("../middlewares/requireAuth");

// Cloudinary configuration
const { cloudinary, upload } = require("../config/cloudinary");

const {getAllApplicants, getApplicant, addApplicant, testFunc, updateApplicant, addApplicantPublic, emailRequest, apply, getCompanies, getCompany, confirmAttendant, sendEvaluationEmail, sendBulkEvaluationEmails} = require("../controllers/applicantsControllers")

const router = express.Router();

const uri = process.env.URI;

mongoose.connect(uri);
const connection = mongoose.connection;

connection.once("open", ()=>{
    console.log("DB connected successfully");
});


// Download CV - now redirects to Cloudinary URL
const downloadCV = async (req, res) => {
    try {
        const cvUrl = req.params.id;

        // If it's a Cloudinary URL, redirect to it
        if (cvUrl.startsWith('http')) {
            return res.redirect(cvUrl);
        }

        // For legacy GridFS IDs, return not found
        return res.status(404).json({ message: 'File not found. Please re-upload CV.' });

    } catch (error) {
        console.error('Error fetching CV:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


// route to get the company
router.get("/companies", getCompanies);

// route to get the company details from its id
router.get("/companies/:id", getCompany);



router.get("/cv/:id", downloadCV);

router.patch("/applicant/apply/:id", apply);




router.post("/email", emailRequest);

// Evaluation email routes
router.post("/evaluation-email", sendEvaluationEmail);
router.post("/bulk-evaluation-emails", sendBulkEvaluationEmails);

router.post("/applicants", (req, res, next) => {
    upload.single("cvfile")(req, res, (err) => {
        if (err) {
            console.log("Upload middleware error:", err);
            return res.status(400).json({ error: err.message });
        }
        console.log("After upload middleware - req.file:", req.file);
        console.log("After upload middleware - req.body keys:", Object.keys(req.body));
        next();
    });
}, addApplicantPublic);

router.use(requireAuth);

router.get("/", testFunc);

router.get("/applicants/:id", getApplicant);

router.get("/applicants", getAllApplicants);

router.patch("/applicants/:id", updateApplicant);

router.patch("/applicants/confirm/:id", confirmAttendant);


router.post("/applicants", upload.single("cvfile"), addApplicant)


// an applicant will open a simple page that ask him for his id
// once he gets in he will have to open a QR code scanner
// + the applicant will be able to see the companies he/she applied for
// the scanner will identify the company by reading the id stored in the Qr code
// once he scanned it, a success message will show up and the applicant will be stored in the company dashboard

// We need a page, a new router
// the success will result in adding the applicant name to the list of companies he applied for

module.exports = router;
