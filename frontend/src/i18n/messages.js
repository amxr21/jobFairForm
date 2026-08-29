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
            preferencesOptionalNote: "These fields are optional but help us match you with the right opportunities.",
            stepOf: "Step {current} of {total}",
            optionalSuffix: " (Optional)",
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
            nonTechnicalSkills: "Non-technical Skills",
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
            noOptionsFound: "No matching options found",
            selectPreferredLocation: "Select preferred location",
            selectAvailability: "Select availability",
        },
        datePicker: {
            chooseDate: "Choose a date",
            previousMonth: "Previous month",
            nextMonth: "Next month",
            selectMonth: "Select month",
            selectYear: "Select year",
            monthLabel: "Month: {month}",
            yearLabel: "Year: {year}",
            setGraduationDateHint: 'Check "Are you a current student?" below to set your expected graduation date.',
        },
        // SkillsMultiSelect's `noun` prop only ever takes these two English
        // values ("skill" from ProfessionalInfo, "field" from Preferences).
        // English can template "{noun}s selected" onto either noun with no
        // grammar issue, so it does.
        // English can safely template "{noun}s" onto either "skill" or
        // "field" with no grammar issue, unlike Arabic (see the ar block for
        // why that side is two full noun-specific phrase sets instead).
        // Structured the same way regardless — skill/field/remove — so
        // both locales resolve through one consistent lookup shape.
        multiSelect: {
            skill: {
                searchPlaceholder: "Search skills...",
                addCustom: '+ Add "{value}"',
                noMatching: "No matching skills",
                typeToSearch: "Type to search or add custom skills...",
                allSelected: "All skills selected",
                countSelected: "{count} skills selected",
                countSelectedOne: "1 skill selected",
                noneSelectedYet: "No skills selected yet",
                optionsSuffix: "{label} options",
            },
            field: {
                searchPlaceholder: "Search fields...",
                addCustom: '+ Add "{value}"',
                noMatching: "No matching fields",
                typeToSearch: "Type to search or add custom fields...",
                allSelected: "All fields selected",
                countSelected: "{count} fields selected",
                countSelectedOne: "1 field selected",
                noneSelectedYet: "No fields selected yet",
                optionsSuffix: "{label} options",
            },
            remove: "Remove {value}",
        },
        errors: {
            required: "This field is required",
            completeFields: "Please complete: {fields}",
            completeRequired: "Please complete the required fields",
            submitGeneric: "Something went wrong submitting your application. Please try again.",
            submitTimeout: "The server took too long to respond. Please try submitting again.",
            submitFileTooLarge: "Your CV is too large. Please upload a file under 4MB.",
            submitRejected: "Some of your details were rejected. Please review the form and try again.",
            submitServerError: "The server had a problem saving your application. Please try again in a moment.",
            submitNoConnection: "Couldn't reach the server. Check your connection and try again.",
            cvTooLarge: "Your CV must be under 4MB.",
            cvUnreadable: "That file could not be read. Please choose it again.",
        },
        confirmation: {
            submittingOverlay: "Submitting your application…",
            heading: "You're all set!",
            body: "Your application is in. Bring your QR code ticket to the entrance on event day.",
            eventDate: "Tuesday, 22nd April 2025",
            eventTime: "10:00 AM – 02:00 PM",
            eventLocation: "Building M11",
            generatingQr: "Generating QR…",
            qrCaption: "Screenshot this QR code for entry and to share your profile with 70+ companies.",
            downloadQr: "Download QR",
        },
        languagesField: {
            other: "Other",
            selectOrType: "Select additional languages or type your own:",
            typePlaceholder: "Type a language...",
            add: "Add",
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
            preferencesOptionalNote: "هذه الحقول اختيارية لكنها تساعدنا على إيجاد الفرص الأنسب لك.",
            stepOf: "الخطوة {current} من {total}",
            optionalSuffix: " (اختياري)",
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
            noOptionsFound: "لا توجد خيارات مطابقة",
            selectPreferredLocation: "اختر الموقع المفضل",
            selectAvailability: "اختر التوفر",
        },
        datePicker: {
            chooseDate: "اختر تاريخا",
            previousMonth: "الشهر السابق",
            nextMonth: "الشهر التالي",
            selectMonth: "اختر الشهر",
            selectYear: "اختر السنة",
            monthLabel: "الشهر: {month}",
            yearLabel: "السنة: {year}",
            setGraduationDateHint: "حدد \"هل أنت طالب حالي؟\" أدناه لتعيين تاريخ التخرج المتوقع.",
        },
        // "مهارة" (skill) is feminine and "مجال" (field) is masculine, so a
        // single Arabic template cannot correctly agree with both nouns the
        // way the English template does — "لا توجد مهارات مطابقة" (skill,
        // feminine plural adjective) is simply a different sentence from "لا
        // يوجد مجال مطابق" (field, masculine). Two complete noun-specific
        // phrase sets, keyed by noun, rather than one broken template.
        multiSelect: {
            skill: {
                searchPlaceholder: "ابحث عن مهارة...",
                addCustom: 'إضافة "{value}"+',
                noMatching: "لا توجد مهارات مطابقة",
                typeToSearch: "اكتب للبحث أو أضف مهارات مخصصة...",
                allSelected: "تم اختيار جميع المهارات",
                countSelected: "تم اختيار {count} مهارات",
                countSelectedOne: "تم اختيار مهارة واحدة",
                noneSelectedYet: "لم يتم اختيار أي مهارة بعد",
                optionsSuffix: "خيارات {label}",
            },
            field: {
                searchPlaceholder: "ابحث عن مجال...",
                addCustom: 'إضافة "{value}"+',
                noMatching: "لا يوجد مجال مطابق",
                typeToSearch: "اكتب للبحث أو أضف مجالات مخصصة...",
                allSelected: "تم اختيار جميع المجالات",
                countSelected: "تم اختيار {count} مجالات",
                countSelectedOne: "تم اختيار مجال واحد",
                noneSelectedYet: "لم يتم اختيار أي مجال بعد",
                optionsSuffix: "خيارات {label}",
            },
            remove: "إزالة {value}",
        },
        errors: {
            required: "هذا الحقل مطلوب",
            completeFields: "يرجى إكمال: {fields}",
            completeRequired: "يرجى إكمال الحقول المطلوبة",
            submitGeneric: "حدث خطأ أثناء إرسال طلبك. يرجى المحاولة مرة أخرى.",
            submitTimeout: "استغرق الخادم وقتًا طويلاً للاستجابة. يرجى إعادة المحاولة.",
            submitFileTooLarge: "السيرة الذاتية كبيرة جدًا. يرجى رفع ملف أقل من 4 ميجابايت.",
            submitRejected: "تم رفض بعض بياناتك. يرجى مراجعة النموذج والمحاولة مرة أخرى.",
            submitServerError: "واجه الخادم مشكلة في حفظ طلبك. يرجى المحاولة مرة أخرى بعد قليل.",
            submitNoConnection: "تعذر الوصول إلى الخادم. تحقق من اتصالك وحاول مرة أخرى.",
            cvTooLarge: "يجب أن تكون السيرة الذاتية أقل من 4 ميجابايت.",
            cvUnreadable: "تعذرت قراءة هذا الملف. يرجى اختياره مرة أخرى.",
        },
        confirmation: {
            submittingOverlay: "جاري إرسال طلبك…",
            heading: "تم كل شيء!",
            body: "تم استلام طلبك. يرجى إحضار تذكرة رمز QR الخاصة بك عند الدخول يوم الفعالية.",
            // Western numerals throughout per UAE web convention — not
            // Eastern Arabic-Indic — matching the rest of this file's dates.
            eventDate: "الثلاثاء، 22 أبريل 2025",
            eventTime: "10:00 صباحًا – 02:00 مساءً",
            eventLocation: "المبنى M11",
            generatingQr: "جاري إنشاء رمز QR…",
            qrCaption: "التقط لقطة شاشة لرمز QR هذا للدخول ولمشاركة ملفك الشخصي مع أكثر من 70 جهة توظيف.",
            downloadQr: "تحميل رمز QR",
        },
        languagesField: {
            other: "أخرى",
            selectOrType: "اختر لغات إضافية أو اكتب لغتك الخاصة:",
            typePlaceholder: "اكتب لغة...",
            add: "إضافة",
        },
    },
};

// Field labels are passed around the form as raw English literals
// (`label={"Gender"}`, `label={"City"}`, ...) rather than as message keys —
// that's how FieldShell, Input, SelectInput and SkillsMultiSelect all
// identify a field (used for formData lookups, ids, aria wiring). Rebuilding
// every call site to pass a translation key instead would touch dozens of
// lines for no functional gain, so this derives an { "English label": "Arabic
// label" } map straight from messages.en.fields / messages.ar.fields instead
// — the same shape as the *Labels maps in i18n/options.js, so it works with
// the existing labelFor() helper. FieldShell is the single place every field
// renders its label, so wiring it there covers the whole form.
export const fieldLabelMap = Object.fromEntries(
    Object.entries(messages.en.fields).map(([key, english]) => [english, messages.ar.fields[key] || ""])
);

export default messages;
