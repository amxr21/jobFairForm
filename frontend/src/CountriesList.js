const CountriesList = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
    "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
    "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Côte d'Ivoire", "Cabo Verde",
    "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)",
    "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", "Democratic Republic of the Congo", "Denmark", "Djibouti",
    "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini (fmr. 'Swaziland')",
    "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
    "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
    "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon",
    "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
    "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique",
    "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea",
    "North Macedonia (formerly Macedonia)", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea",
    "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
    "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
    "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain",
    "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
    "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
    "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ]
  
  
  const DegreePrograms = {
    "Bachelor": {
      "College of Sharia and Islamic Studies": [
        "Jurisprudence and its Foundations",
        "Foundations of Religion"
      ],
      "College of Arts, Humanities and Social Sciences": [
        "Arabic Language and Literature",
        "English Language and Literature",
        "History and Islamic Civilization",
        "History and Islamic Civilization - Tourism Guidance",
        "Sociology",
        "Education in Early Childhood",
        "French Language and Literature"
      ],
      "College of Business Administration": [
        "Accounting",
        "Business Administration – Management",
        "Finance",
        "Business Administration – Marketing",
        "Supply Chain Management",
        "Business Administration – Human Resource Management",
        "Economics"
      ],
      "College of Engineering": [
        "Civil Engineering",
        "Industrial Engineering and Engineering Management",
        "Electrical and Electronics Engineering",
        "Architectural Engineering",
        "Mechanical Engineering",
        "Sustainable and Renewable Energy Engineering",
        "Mechatronics and Robotics Engineering",
        "Nuclear Engineering",
        "Chemical and Water Desalination Engineering"
      ],
      "College of Health Sciences": [
        "Medical Laboratory Sciences",
        "Medical Diagnostic Imaging",
        "Audiology and Speech Language Pathology",
        "Nursing",
        "Healthcare Management",
        "Physiotherapy",
        "Environmental Health Sciences",
        "Clinical Nutrition and Dietetics"
      ],
      "College of Law": [
        "Law",
        "Law in English"
      ],
      "College of Fine Arts and Design": [
        "Fine Arts",
        "Interior Design",
        "Fashion Design and Textiles",
        "Visual Communication",
        "Museum Studies and Art History"
      ],
      "College of Communication": [
        "Electronic Journalism",
        "Radio and Television",
        "Public Relations",
        "Digital Media Design",
        "Mass Communication"
      ],
      "College of Medicine": [
        "Medicine and Surgery"
      ],
      "College of Dental Medicine": [
        "Dental Surgery"
      ],
      "College of Pharmacy": [
        "Pharmacy"
      ],
      "College of Sciences": [
        "Chemistry",
        "Applied Physics",
        "Mathematics",
        "Biotechnology",
        "Petroleum Geosciences and Remote Sensing"
      ],
      "College of Computing and Informatics": [
        "Business Information Systems",
        "Computer Science",
        "Computer Engineering",
        "Information Technology - Multimedia",
        "Biomedical Informatics",
        "Cybersecurity Engineering"
      ],
      "College of Public Policy": [
        "International Relations"
      ]
    },
  
    "Master": {
      "College of Arts, Humanities and Social Sciences": [
        "Master of Arts in Applied Sociology",
        "Master of Art in Arabic Language and Literature",
        "Master of Art in History and Islamic Civilization",
        "Master of Art in Translation"
      ],
      "College of Business Administration": [
        "Executive Master in Business Administration",
        "Master in Business Administration",
        "Master in Business Analytics"
      ],
      "College of Communication": [
        "Master of Art in Communication",
        "Master of Science in Media Entrepreneur and Digital Innovative Dual Degree"
      ],
      "College of Computing and Informatics": [
        "Master of Science in Artificial Intelligence",
        "Master of Science in Computer Engineering",
        "Master of Science in Computer Science",
        "Master of Science in Cyber Security Engineering",
        "Master of Science in Data Science"
      ],
      "College of Dental Medicine": [
        "Master of Dental Surgery in Endodontics",
        "Master of Dental Surgery in Oral Surgery",
        "Master of Dental Surgery in Periodontology",
        "Master of Dental Surgery in Prosthodontics"
      ],
      "College of Engineering": [
        "Master of Science in Architecture",
        "Master of Science in Biotechnology",
        "Master of Science in Civil Engineering",
        "Master in Conservation Management of Cultured Heritage",
        "Master of Science in Electrical and Electronic Engineering",
        "Master of Science in Engineering Management",
        "Master of Science in Environmental Engineering",
        "Master of Science in Mechanical Engineering",
        "Master of Science in Sustainable and Renewable Energy Engineering"
      ],
      "College of Health Sciences": [
        "Master of Science in Adult Critical Care Nursing",
        "Master of Science in Applied Science",
        "Master of Science in Environmental Health",
        "Master of Science in Medical Diagnostics Imaging",
        "Master of Science in Medical Laboratory Sciences",
        "Master of Science in Physiotherapy",
        "Master of Public Health"
      ],
      "College of Law": [
        "Master in Air and Space Law",
        "Master in Private Law",
        "Master in Public Law"
      ],
      "College of Medicine": [
        "Master of Science in Diabetes Management",
        "Master in Leadership in Health Professional Education"
      ],
      "College of Pharmacy": [
        "Master in Doctor of Pharmacy PharmD",
        "Master in Pharmaceutical Science"
      ],
      "College of Public Policy": [
        "Master of Art in International Relations",
        "Master of Leadership in Higher Education"
      ],
      "College of Sciences": [
        "Master of Science in Applied Mathematics",
        "Masters in Astronomy and Space Sciences",
        "Master of Science in Chemistry",
        "Master of Science in Geographic Information System and Remote Sensing",
        "Master of Science in Molecular Medicine and Translational Research",
        "Master of Science in Physics"
      ],
      "College of Sharia and Islamic Studies": [
        "Master in Exegesis and Hadith",
        "Master in Jurisprudence and Its Foundation"
      ]
    },
  
    "PhD": {
      "College of Arts, Humanities and Social Sciences": [
        "Doctor of Philosophy in Applied Sociology",
        "Doctor of Philosophy in Arabic Language and Literature",
        "Doctor of Philosophy in History and Islamic Civilization",
        "Doctor of Philosophy in Linguistics and Translation"
      ],
      "College of Business Administration": [
        "Doctor of Business Administration"
      ],
      "College of Communication": [
        "Doctor of Philosophy in Communication"
      ],
      "College of Computing and Informatics": [
        "Doctor of Philosophy in Computer Science"
      ],
      "College of Dental Medicine": [
        "Doctor of Philosophy in Dental Sciences"
      ],
      "College of Engineering": [
        "Doctor of Philosophy in Civil Engineering",
        "Doctor of Philosophy in Electrical and Computer Engineering",
        "Doctor of Philosophy in Engineering Management"
      ],
      "College of Health Sciences": [
        "Doctor of Philosophy in Physiotherapy"
      ],
      "College of Law": [
        "Doctor of Philosophy in Private Law",
        "Doctor of Philosophy in Public Law"
      ],
      "College of Medicine": [
        "Doctor of Philosophy in Molecular Medicine and Translational Research"
      ],
      "College of Pharmacy": [
        "Doctor of Philosophy in Pharmaceutical Sciences"
      ],
      "College of Sharia and Islamic Studies": [
        "Doctor of Philosophy in Exegesis and Quran Sciences",
        "Doctor of Philosophy in Hadith and Its Sciences",
        "Doctor of Philosophy in Jurisprudence and Its Foundations"
      ]
    },
  
    "Diploma": {
      "College of Arts, Humanities and Social Sciences": [
        "Professional Diploma in Teaching"
      ],
      "College of Medicine": [
        "Postgraduate Diploma in Ultrasound Technology Applications"
      ]
    }
  };
  
  
  export {CountriesList, DegreePrograms}