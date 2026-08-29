// UI copy: labels, buttons, placeholders, errors, headings — anything that is
// not a form OPTION VALUE. Option values (Gender, City, Nationality, College,
// Major, skills, industries, opportunity types) live in options.js instead,
// because they carry a second responsibility: mapping the Arabic label back
// to the exact English string the backend and formData expect. See
// src/i18n/README.md.
//
// Every key here is EN-authoritative. An empty or missing AR string falls
// back to the EN one via t() in useTranslation.jsx — never renders blank, and
// is easy to grep for what's left to translate: search this file for `: ""`.

export const messages = {
    en: {
        nav: {
            registerNow: "Register Now",
            checkMyTicket: "Check My Ticket",
            takesMinutes: "Takes about 3 minutes · no account needed",
        },
        steps: {
            personalInfo: "Personal Information",
            professionalInfo: "Professional Information",
            preferences: "Preferences",
            stepOf: "Step {current} of {total}",
        },
        actions: {
            back: "Back",
            continue: "Continue",
            submit: "Submit application",
            submitting: "Submitting…",
        },
        fields: {
            firstName: "First Name",
            lastName: "Last Name",
            universityId: "University ID",
            dateOfBirth: "Date of Birth",
            gender: "Gender",
            city: "City",
            nationality: "Nationality",
            email: "Email address",
            mobile: "Mobile number",
            linkedin: "LinkedIn URL",
            languages: "Languages",
            studyProgram: "Study Program",
            college: "College",
            major: "Major",
            technicalSkills: "Technical Skills",
            nonTechnicalSkills: "Non-technical skills",
            cgpa: "CGPA",
            expectedGraduate: "Expected to Graduate",
            currentStudent: "Are you a current student?",
            experience: "Experience",
            noExperience: "No prior experience",
            resume: "Attach your resume",
            fieldInterest: "Field Interest",
            preferredWorkCity: "Preferred Work City",
            opportunityType: "What type of opportunity are you looking for?",
            careerGoals: "Career Goals",
            availability: "Availability",
        },
        placeholders: {
            selectDate: "Select a date",
            searchIndustries: "Search industries...",
            chooseFile: "Choose file",
            changeFile: "Change file",
            fileHint: "PDF or Word, under 4MB",
        },
        errors: {
            required: "This field is required",
            completeFields: "Please complete: {fields}",
        },
    },
    // Empty strings fall back to English via t(). Fill these in progressively
    // — nothing here needs to be complete before the switch ships, since
    // every gap is silently covered by the fallback.
    ar: {
        nav: {
            registerNow: "سجل الآن",
            checkMyTicket: "تحقق من تذكرتي",
            takesMinutes: "يستغرق حوالي 3 دقائق · لا يتطلب حساب",
        },
        steps: {
            personalInfo: "المعلومات الشخصية",
            professionalInfo: "المعلومات المهنية",
            preferences: "التفضيلات",
            stepOf: "الخطوة {current} من {total}",
        },
        actions: {
            back: "رجوع",
            continue: "متابعة",
            submit: "إرسال الطلب",
            submitting: "جاري الإرسال…",
        },
        fields: {
            firstName: "الاسم الأول",
            lastName: "الاسم الأخير",
            universityId: "معرف الطالب الجامعي",
            dateOfBirth: "تاريخ الميلاد",
            gender: "الجنس",
            city: "المدينة",
            nationality: "الجنسية",
            email: "عنوان البريد الإلكتروني",
            mobile: "رقم الهاتف المحمول",
            linkedin: "رابط LinkedIn",
            languages: "اللغات",
            studyProgram: "برنامج الدراسة",
            college: "الكلية",
            major: "التخصص",
            technicalSkills: "المهارات التقنية",
            nonTechnicalSkills: "المهارات غير التقنية",
            cgpa: "معدل الطالب التراكمي",
            expectedGraduate: "التاريخ المتوقع للتخرج",
            currentStudent: "هل أنت طالب حالي؟",
            experience: "الخبرة",
            noExperience: "بدون خبرة سابقة",
            resume: "أرفق سيرتك الذاتية",
            fieldInterest: "مجال الاهتمام",
            preferredWorkCity: "مدينة العمل المفضلة",
            opportunityType: "ما نوع الفرصة الوظيفية التي تبحث عنها؟",
            careerGoals: "الأهداف الوظيفية",
            availability: "التوفر",
        },
        placeholders: {
            selectDate: "اختر تاريخا",
            searchIndustries: "ابحث عن القطاعات...",
            chooseFile: "اختر ملف",
            changeFile: "غير الملف",
            fileHint: "PDF أو Word، أقل من 4 ميجابايت",
        },
        errors: {
            required: "هذا الحقل مطلوب",
            completeFields: "يرجى إكمال: {fields}",
        },
    },
};

export default messages;
