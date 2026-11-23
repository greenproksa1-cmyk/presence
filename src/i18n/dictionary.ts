import type { Locale, OrganizationTypeKey } from "@/lib/types";

export interface Dictionary {
  localeName: string;
  switchLabel: string;
  nav: {
    home: string;
    about: string;
    event: string;
    register: string;
    privacy: string;
    admin: string;
  };
  header: {
    registerCta: string;
    menu: string;
    close: string;
    official: string;
  };
  common: {
    skipToContent: string;
    loading: string;
    retry: string;
    backHome: string;
    back: string;
    optional: string;
    required: string;
    openMap: string;
    learnMore: string;
    readMore: string;
    all: string;
    search: string;
    reset: string;
    apply: string;
    previous: string;
    next: string;
    page: string;
    of: string;
    notAvailable: string;
    yes: string;
    no: string;
    close: string;
    dismiss: string;
  };
  home: {
    freeAttendance: string;
    instantTicket: string;
    eventDateLabel: string;
    venueLabel: string;
    participationLabel: string;
    heroImageAlt: string;
    aboutCta: string;
    aboutImageAlt: string;
    pointsTitle: string;
    sectorsTitle: string;
    mapCta: string;
    audienceTitle: string;
    audienceDescription: string;
    ctaNote: string;
    locationTitle: string;
    locationHint: string;
    officialPlatform: string;
  };
  register: {
    title: string;
    description: string;
    personalSection: string;
    workSection: string;
    interestSection: string;
    fullName: string;
    fullNamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    phoneHint: string;
    country: string;
    countryPlaceholder: string;
    city: string;
    cityPlaceholder: string;
    company: string;
    companyPlaceholder: string;
    jobTitle: string;
    jobTitlePlaceholder: string;
    organizationType: string;
    organizationTypePlaceholder: string;
    interest: string;
    interestPlaceholder: string;
    consent: string;
    privacyLink: string;
    submit: string;
    submitting: string;
    secureNote: string;
    requiredHint: string;
    successTitle: string;
    successDescription: string;
    viewTicket: string;
    emailQueued: string;
    emailDelayed: string;
    alreadyRegistered: string;
    errors: {
      nameRequired: string;
      nameLength: string;
      emailRequired: string;
      emailInvalid: string;
      phoneRequired: string;
      phoneInvalid: string;
      countryInvalid: string;
      cityRequired: string;
      companyRequired: string;
      jobTitleRequired: string;
      orgTypeInvalid: string;
      interestMax: string;
      consentRequired: string;
      duplicateEmail: string;
      duplicatePhone: string;
      rateLimited: string;
      captcha: string;
      system: string;
      generic: string;
    };
  };
  ticket: {
    pageTitle: string;
    subtitle: string;
    attendee: string;
    registrationNo: string;
    date: string;
    venue: string;
    status: string;
    confirmed: string;
    cancelled: string;
    entryNote: string;
    issuedAt: string;
    copyNumber: string;
    copied: string;
    print: string;
    downloadPdf: string;
    generatingPdf: string;
    pdfError: string;
    shareWhatsApp: string;
    viewTicket: string;
    emailNote: string;
    qrNote: string;
    newTicket: string;
    notFoundTitle: string;
    notFoundBody: string;
    cancelledTitle: string;
    cancelledBody: string;
    backHome: string;
    freeAttendance: string;
    scanHint: string;
    pdfFileName: string;
    shareMessage: string;
  };
  success: {
    title: string;
    description: string;
    viewTicket: string;
    emailNote: string;
    registerAnother: string;
    missingTicket: string;
  };
  about: {
    eyebrow: string;
    audienceEyebrow: string;
    ctaEyebrow: string;
  };
  privacy: {
    eyebrow: string;
    lastUpdated: string;
    contactTitle: string;
    contactBody: string;
    backHome: string;
  };
  footer: {
    explore: string;
    event: string;
    legal: string;
    contact: string;
    privacy: string;
    rights: string;
    builtNote: string;
    accessNote: string;
    noContact: string;
  };
  auth: {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    signIn: string;
    signingIn: string;
    invalid: string;
    rateLimited: string;
    backToSite: string;
    staffNotice: string;
  };
  orgTypes: Record<OrganizationTypeKey, string>;
}

const ar: Dictionary = {
  localeName: "العربية",
  switchLabel: "English",
  nav: {
    home: "الرئيسية",
    about: "عن المنتدى",
    event: "معلومات الفعالية",
    register: "التسجيل",
    privacy: "سياسة الخصوصية",
    admin: "لوحة التحكم",
  },
  header: {
    registerCta: "سجل حضورك الآن",
    menu: "فتح القائمة",
    close: "إغلاق القائمة",
    official: "المنصة الرسمية للتسجيل",
  },
  common: {
    skipToContent: "تجاوز إلى المحتوى",
    loading: "جارٍ التحميل…",
    retry: "إعادة المحاولة",
    backHome: "العودة إلى الرئيسية",
    back: "رجوع",
    optional: "اختياري",
    required: "مطلوب",
    openMap: "فتح الخريطة",
    learnMore: "اعرف المزيد",
    readMore: "اقرأ المزيد",
    all: "الكل",
    search: "بحث",
    reset: "إعادة تعيين",
    apply: "تطبيق",
    previous: "السابق",
    next: "التالي",
    page: "صفحة",
    of: "من",
    notAvailable: "غير متوفر",
    yes: "نعم",
    no: "لا",
    close: "إغلاق",
    dismiss: "تجاهل",
  },
  home: {
    freeAttendance: "حضور مجاني",
    instantTicket: "تذكرة فورية",
    eventDateLabel: "تاريخ المنتدى",
    venueLabel: "مكان الإقامة",
    participationLabel: "نوع المشاركة",
    heroImageAlt: "بوفيه ضيافة احترافي في فعالية",
    aboutCta: "المزيد عن المنتدى",
    aboutImageAlt: "طاولة إعاشة منسقة بعناية",
    pointsTitle: "لماذا هذا المنتدى؟",
    sectorsTitle: "قطاعات يشملها المنتدى",
    mapCta: "فتح الموقع على خرائط Google",
    audienceTitle: "من يستهدفهم المنتدى؟",
    audienceDescription: "جهات وكوادر من مختلف حلقات منظومة الإعاشة والتموين والضيافة.",
    ctaNote: "التسجيل مجاني ومفتوح للجميع · تذكرة إلكترونية فورية مع رمز QR.",
    locationTitle: "مكان انعقاد المنتدى",
    locationHint: "المنطقة المركزية، مكة المكرمة",
    officialPlatform: "منصة رسمية للتسجيل وإدارة الحضور",
  },
  register: {
    title: "التسجيل لحضور المنتدى",
    description:
      "يسعدنا انضمامكم إلى منتدى مكة الغذائي للإعاشة والتموين. يرجى تعبئة البيانات التالية للحصول على تذكرة الحضور الإلكترونية المجانية.",
    personalSection: "البيانات الشخصية",
    workSection: "بيانات جهة العمل",
    interestSection: "اهتمامك بالمنتدى",
    fullName: "الاسم الكامل",
    fullNamePlaceholder: "الاسم الأول واسم العائلة",
    email: "البريد الإلكتروني",
    emailPlaceholder: "name@company.com",
    phone: "رقم الجوال",
    phonePlaceholder: "+966 5X XXX XXXX",
    phoneHint: "أدخل الرقم مع رمز الدولة. الأرقام السعودية تُقبل بصيغة 05 أو +966.",
    country: "الدولة",
    countryPlaceholder: "اختر الدولة",
    city: "المدينة",
    cityPlaceholder: "مثال: مكة المكرمة",
    company: "اسم الشركة أو جهة العمل",
    companyPlaceholder: "اسم الجهة كما تود ظهوره في التذكرة",
    jobTitle: "المسمى الوظيفي",
    jobTitlePlaceholder: "مثال: مدير العمليات",
    organizationType: "نوع الجهة أو النشاط",
    organizationTypePlaceholder: "اختر نوع الجهة",
    interest: "مجال الاهتمام بالمنتدى",
    interestPlaceholder: "مثال: الشراكات، الاستثمار، التوريد، الحلول التقنية…",
    consent:
      "أوافق على سياسة الخصوصية وعلى معالجة بياناتي لأغراض التسجيل وإدارة الحضور.",
    privacyLink: "سياسة الخصوصية",
    submit: "تأكيد التسجيل والحصول على التذكرة",
    submitting: "جارٍ إنشاء تسجيلك…",
    secureNote: "بياناتك محمية، ويُستخدم رقم جوالك للتذكرة وإدارة الحضور فقط.",
    requiredHint: "الحقول المعلّمة بـ * إلزامية.",
    successTitle: "تم تسجيلك بنجاح",
    successDescription: "تذكرتك الإلكترونية جاهزة. احتفظ بها وأبرز رمز QR عند بوابة المنتدى.",
    viewTicket: "عرض التذكرة",
    emailQueued: "أرسلنا نسخة من التذكرة إلى بريدك الإلكتروني.",
    emailDelayed:
      "تذكرتك جاهزة الآن بالأسفل. قد يتأخر وصول البريد الإلكتروني؛ يمكنك تنزيل التذكرة مباشرة.",
    alreadyRegistered: "إذا كنت مسجلًا مسبقًا، استخدم رابط التذكرة الذي وصلك.",
    errors: {
      nameRequired: "يرجى إدخال الاسم الكامل.",
      nameLength: "يجب أن يكون الاسم بين 3 و 120 حرفًا.",
      emailRequired: "يرجى إدخال البريد الإلكتروني.",
      emailInvalid: "صيغة البريد الإلكتروني غير صحيحة.",
      phoneRequired: "يرجى إدخال رقم الجوال.",
      phoneInvalid: "رقم الجوال غير صحيح. أدخله بصيغة دولية تبدأ بـ + مثال: +966501234567.",
      countryInvalid: "يرجى اختيار دولة صحيحة.",
      cityRequired: "يرجى إدخال المدينة.",
      companyRequired: "يرجى إدخال اسم الشركة أو جهة العمل.",
      jobTitleRequired: "يرجى إدخال المسمى الوظيفي.",
      orgTypeInvalid: "يرجى اختيار نوع الجهة.",
      interestMax: "يجب ألا يتجاوز مجال الاهتمام 300 حرف.",
      consentRequired: "يجب الموافقة على سياسة الخصوصية للمتابعة.",
      duplicateEmail: "يوجد تسجيل سابق بهذا البريد الإلكتروني. استخدم رابط التذكرة الذي وصلك.",
      duplicatePhone: "يوجد تسجيل سابق بهذا الرقم. استخدم رابط التذكرة الذي وصلك.",
      rateLimited: "تمت محاولات كثيرة. يرجى المحاولة بعد قليل.",
      captcha: "تعذّر التحقق من أنك لست روبوتًا. يرجى إعادة المحاولة.",
      system: "تعذّر إتمام التسجيل حاليًا بسبب خطأ في النظام. يرجى المحاولة بعد قليل.",
      generic: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
    },
  },
  ticket: {
    pageTitle: "تذكرة الحضور",
    subtitle: "منتدى مكة الغذائي للإعاشة والتموين",
    attendee: "اسم الزائر",
    registrationNo: "رقم التسجيل",
    date: "تاريخ المنتدى",
    venue: "مكان الإقامة",
    status: "حالة التذكرة",
    confirmed: "مؤكدة",
    cancelled: "ملغاة",
    entryNote: "هذه التذكرة معتمدة للدخول بعد التحقق منها عند بوابة المنتدى.",
    issuedAt: "تاريخ الإصدار",
    copyNumber: "نسخ رقم التسجيل",
    copied: "تم النسخ",
    print: "طباعة التذكرة",
    downloadPdf: "تحميل التذكرة PDF",
    generatingPdf: "جارٍ تجهيز الملف…",
    pdfError: "تعذّر إنشاء ملف PDF. يمكنك استخدام زر الطباعة أو حفظ الصفحة.",
    shareWhatsApp: "مشاركة عبر واتساب",
    viewTicket: "عرض التذكرة",
    emailNote: "وصلتك نسخة من هذه التذكرة عبر البريد الإلكتروني عند تفعيله.",
    qrNote: "امسح رمز QR عند بوابة المنتدى للتحقق وتسجيل الحضور.",
    newTicket: "تم إصدار تذكرتك",
    notFoundTitle: "التذكرة غير موجودة",
    notFoundBody: "الرابط غير صحيح أو أن التذكرة لم تعد متاحة. تحقق من الرابط أو تواصل مع فريق المنتدى.",
    cancelledTitle: "تذكرة ملغاة",
    cancelledBody: "هذه التذكرة ملغاة ولا يمكن استخدامها للدخول. يرجى التواصل مع فريق المنتدى.",
    backHome: "العودة إلى الرئيسية",
    freeAttendance: "حضور مجاني",
    scanHint: "عرض الرمز من الشاشة أو نسخة مطبوعة",
    pdfFileName: "تذكرة-منتدى-مكة-الغذائي",
    shareMessage: "تذكرتي لحضور منتدى مكة الغذائي للإعاشة والتموين",
  },
  success: {
    title: "تم تسجيلك بنجاح",
    description: "تذكرتك الإلكترونية جاهزة الآن. احفظ الرابط أو حمّل نسخة PDF.",
    viewTicket: "عرض التذكرة وتحميلها",
    emailNote: "إذا لم يصل البريد الإلكتروني، يمكنك دائمًا فتح التذكرة من الرابط أعلاه.",
    registerAnother: "تسجيل زائر آخر",
    missingTicket: "لم يتم العثور على التذكرة. يرجى التواصل مع فريق المنتدى.",
  },
  about: {
    eyebrow: "تعريف",
    audienceEyebrow: "الفئات المستهدفة",
    ctaEyebrow: "انضم إلينا",
  },
  privacy: {
    eyebrow: "الخصوصية وحماية البيانات",
    lastUpdated: "آخر تحديث",
    contactTitle: "للاستفسار عن الخصوصية",
    contactBody: "يمكنك التواصل مع فريق المنتدى بشأن بياناتك الشخصية عبر بيانات التواصل الرسمية المنشورة في الموقع.",
    backHome: "العودة إلى الرئيسية",
  },
  footer: {
    explore: "استكشف",
    event: "الفعالية",
    legal: "قانوني",
    contact: "تواصل معنا",
    privacy: "سياسة الخصوصية",
    rights: "جميع الحقوق محفوظة",
    builtNote: "منصة تسجيل وإدارة حضور",
    accessNote: "تذكرة إلكترونية فريدة مع رمز QR",
    noContact: "تُنشر بيانات التواصل الرسمية هنا عند اعتمادها.",
  },
  auth: {
    title: "دخول لوحة التحكم",
    subtitle: "مخصص لفريق التنظيم وموظفي الاستقبال المعتمدين.",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    signIn: "تسجيل الدخول",
    signingIn: "جارٍ التحقق…",
    invalid: "بيانات الدخول غير صحيحة.",
    rateLimited: "محاولات دخول كثيرة. يرجى المحاولة بعد 15 دقيقة.",
    backToSite: "العودة إلى الموقع",
    staffNotice: "موظفو الاستقبال يمكنهم الوصول إلى شاشة تسجيل الحضور فقط.",
  },
  orgTypes: {
    catering: "شركة إعاشة وتموين",
    food_beverage: "شركة أغذية ومشروبات",
    hotel: "فندق أو منشأة ضيافة",
    restaurant: "مطعم أو سلسلة مطاعم",
    supply_distribution: "شركة توريد وتوزيع",
    food_manufacturing: "شركة تصنيع غذائي",
    government: "جهة حكومية",
    investor: "مستثمر",
    entrepreneur: "رائد أعمال",
    consultant: "مستشار أو متخصص",
    other: "أخرى",
  },
};

const en: Dictionary = {
  localeName: "English",
  switchLabel: "العربية",
  nav: {
    home: "Home",
    about: "About",
    event: "Event details",
    register: "Register",
    privacy: "Privacy policy",
    admin: "Admin",
  },
  header: {
    registerCta: "Register now",
    menu: "Open menu",
    close: "Close menu",
    official: "Official registration platform",
  },
  common: {
    skipToContent: "Skip to content",
    loading: "Loading…",
    retry: "Retry",
    backHome: "Back to home",
    back: "Back",
    optional: "Optional",
    required: "Required",
    openMap: "Open map",
    learnMore: "Learn more",
    readMore: "Read more",
    all: "All",
    search: "Search",
    reset: "Reset",
    apply: "Apply",
    previous: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
    notAvailable: "Not available",
    yes: "Yes",
    no: "No",
    close: "Close",
    dismiss: "Dismiss",
  },
  home: {
    freeAttendance: "Free attendance",
    instantTicket: "Instant ticket",
    eventDateLabel: "Forum date",
    venueLabel: "Venue",
    participationLabel: "Participation",
    heroImageAlt: "A professionally catered buffet at an event",
    aboutCta: "More about the forum",
    aboutImageAlt: "A carefully arranged catering table",
    pointsTitle: "Why this forum?",
    sectorsTitle: "Sectors represented",
    mapCta: "Open in Google Maps",
    audienceTitle: "Who is it for?",
    audienceDescription:
      "Organisations and professionals from across the catering, supply and hospitality ecosystem.",
    ctaNote: "Free and open to everyone · Instant e-ticket with a QR code.",
    locationTitle: "Forum venue",
    locationHint: "Central area, Makkah",
    officialPlatform: "Official registration & attendance platform",
  },
  register: {
    title: "Register to attend",
    description:
      "We are pleased to welcome you to Makkah Food Catering & Supply Forum. Please complete the form below to receive your free e-ticket.",
    personalSection: "Personal details",
    workSection: "Organisation details",
    interestSection: "Your interest",
    fullName: "Full name",
    fullNamePlaceholder: "First and last name",
    email: "Email address",
    emailPlaceholder: "name@company.com",
    phone: "Mobile number",
    phonePlaceholder: "+966 5X XXX XXXX",
    phoneHint: "Include your country code. Saudi numbers may be entered as 05… or +966.",
    country: "Country",
    countryPlaceholder: "Select country",
    city: "City",
    cityPlaceholder: "e.g. Makkah",
    company: "Company or organisation",
    companyPlaceholder: "Name as you would like it on the ticket",
    jobTitle: "Job title",
    jobTitlePlaceholder: "e.g. Operations Manager",
    organizationType: "Organisation type",
    organizationTypePlaceholder: "Select organisation type",
    interest: "Area of interest",
    interestPlaceholder: "e.g. partnerships, investment, sourcing, technology…",
    consent:
      "I agree to the privacy policy and to the processing of my data for registration and attendance management.",
    privacyLink: "Privacy policy",
    submit: "Confirm registration & get ticket",
    submitting: "Creating your registration…",
    secureNote:
      "Your data is protected. Your mobile number is used only for your ticket and attendance management.",
    requiredHint: "Fields marked * are required.",
    successTitle: "You are registered",
    successDescription:
      "Your e-ticket is ready. Keep it with you and present the QR code at the forum entrance.",
    viewTicket: "View ticket",
    emailQueued: "A copy of your ticket has been sent to your email.",
    emailDelayed:
      "Your ticket is ready below. Email delivery may be delayed — you can download the ticket now.",
    alreadyRegistered: "Already registered? Use the ticket link you received.",
    errors: {
      nameRequired: "Please enter your full name.",
      nameLength: "The name must be between 3 and 120 characters.",
      emailRequired: "Please enter your email address.",
      emailInvalid: "Please enter a valid email address.",
      phoneRequired: "Please enter your mobile number.",
      phoneInvalid:
        "Invalid mobile number. Use international format beginning with +, e.g. +966501234567.",
      countryInvalid: "Please select a valid country.",
      cityRequired: "Please enter your city.",
      companyRequired: "Please enter your company or organisation.",
      jobTitleRequired: "Please enter your job title.",
      orgTypeInvalid: "Please select an organisation type.",
      interestMax: "Area of interest must be 300 characters or fewer.",
      consentRequired: "You must agree to the privacy policy to continue.",
      duplicateEmail:
        "A registration with this email already exists. Use the ticket link you received.",
      duplicatePhone:
        "A registration with this number already exists. Use the ticket link you received.",
      rateLimited: "Too many attempts. Please try again shortly.",
      captcha: "Verification failed. Please try again.",
      system: "Registration is temporarily unavailable due to a system error. Please try again shortly.",
      generic: "Something went wrong. Please try again.",
    },
  },
  ticket: {
    pageTitle: "Attendance ticket",
    subtitle: "Makkah Food Catering & Supply Forum",
    attendee: "Attendee",
    registrationNo: "Registration no.",
    date: "Forum date",
    venue: "Venue",
    status: "Ticket status",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    entryNote:
      "This ticket is approved for entry after verification at the forum entrance.",
    issuedAt: "Issued",
    copyNumber: "Copy registration no.",
    copied: "Copied",
    print: "Print ticket",
    downloadPdf: "Download PDF",
    generatingPdf: "Preparing file…",
    pdfError: "Could not create the PDF. You can use Print or save the page instead.",
    shareWhatsApp: "Share via WhatsApp",
    viewTicket: "View ticket",
    emailNote: "A copy of this ticket is emailed to you when email delivery is enabled.",
    qrNote: "Scan the QR code at the forum entrance for verification and check-in.",
    newTicket: "Your ticket is issued",
    notFoundTitle: "Ticket not found",
    notFoundBody:
      "The link is incorrect or the ticket is no longer available. Check the link or contact the forum team.",
    cancelledTitle: "Cancelled ticket",
    cancelledBody:
      "This ticket has been cancelled and cannot be used for entry. Please contact the forum team.",
    backHome: "Back to home",
    freeAttendance: "Free attendance",
    scanHint: "Show the code on screen or on a printed copy",
    pdfFileName: "makkah-food-forum-ticket",
    shareMessage: "My ticket for Makkah Food Catering & Supply Forum",
  },
  success: {
    title: "You are registered",
    description: "Your e-ticket is ready. Save the link or download a PDF copy.",
    viewTicket: "View & download ticket",
    emailNote:
      "If the email has not arrived, you can always open your ticket from the link above.",
    registerAnother: "Register another guest",
    missingTicket: "Ticket not found. Please contact the forum team.",
  },
  about: {
    eyebrow: "Overview",
    audienceEyebrow: "Target audience",
    ctaEyebrow: "Join us",
  },
  privacy: {
    eyebrow: "Privacy & data protection",
    lastUpdated: "Last updated",
    contactTitle: "Privacy enquiries",
    contactBody:
      "You can contact the forum team about your personal data using the official contact details published on this site.",
    backHome: "Back to home",
  },
  footer: {
    explore: "Explore",
    event: "Event",
    legal: "Legal",
    contact: "Contact",
    privacy: "Privacy policy",
    rights: "All rights reserved",
    builtNote: "Registration & attendance platform",
    accessNote: "A unique e-ticket with a QR code",
    noContact: "Official contact details will be published here once approved.",
  },
  auth: {
    title: "Admin sign in",
    subtitle: "For approved organisers and reception staff.",
    email: "Email",
    password: "Password",
    signIn: "Sign in",
    signingIn: "Verifying…",
    invalid: "Invalid sign-in details.",
    rateLimited: "Too many sign-in attempts. Please try again in 15 minutes.",
    backToSite: "Back to website",
    staffNotice: "Reception staff can only access the check-in screen.",
  },
  orgTypes: {
    catering: "Catering & food supply company",
    food_beverage: "Food & beverage company",
    hotel: "Hotel or hospitality venue",
    restaurant: "Restaurant or restaurant chain",
    supply_distribution: "Supply & distribution company",
    food_manufacturing: "Food manufacturing company",
    government: "Government entity",
    investor: "Investor",
    entrepreneur: "Entrepreneur",
    consultant: "Consultant or specialist",
    other: "Other",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { ar, en };
export { ar as arabicDictionary, en as englishDictionary };
