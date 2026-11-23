import { prisma } from "@/lib/db";
import type { EventSettingsView, Locale, SiteContent } from "@/lib/types";

export { EventSettingsView };

/**
 * Official, editable site content.
 *
 * This is the seed/default copy supplied for the forum. It contains no
 * invented statistics, speakers or claims; the admin panel can replace every
 * string, image and link. If the database is temporarily unreachable the
 * public marketing pages still render from these defaults — registration and
 * all attendee data always require the database.
 */

export const EVENT_DATE_FALLBACK = new Date("2027-01-10T00:00:00+03:00");
export const EVENT_TIMEZONE = "Asia/Riyadh";

export const DEFAULT_MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=Hilton+Makkah+Convention+Hall";

export const DEFAULT_CONTENT: SiteContent = {
  brand: {
    name: {
      ar: "منتدى مكة الغذائي للإعاشة والتموين",
      en: "Makkah Food Catering & Supply Forum",
    },
    shortName: {
      ar: "منتدى مكة الغذائي",
      en: "Makkah Food Forum",
    },
    tagline: {
      ar: "الإعاشة · التموين · الضيافة",
      en: "Catering · Supply · Hospitality",
    },
  },
  hero: {
    eyebrow: {
      ar: "لقاء متخصص في قلب مكة المكرمة",
      en: "A specialised gathering in the heart of Makkah",
    },
    titleBefore: { ar: "منتدى مكة", en: "Makkah" },
    titleHighlight: { ar: "الغذائي", en: "Food Catering" },
    titleAfter: { ar: "للإعاشة والتموين", en: "& Supply Forum" },
    description: {
      ar: "لقاء يجمع الجهات والشركات والمستثمرين والمهتمين بقطاع الإعاشة والتموين والضيافة، لتبادل الخبرات وبناء الشراكات واستكشاف فرص الأعمال في قلب مكة المكرمة.",
      en: "A gathering for organisations, companies, investors and professionals across catering, food supply and hospitality — sharing expertise, building partnerships and exploring business opportunities in the heart of Makkah.",
    },
    primaryCta: { ar: "التسجيل المجاني", en: "Register free" },
    secondaryCta: { ar: "معلومات الفعالية", en: "Event details" },
  },
  about: {
    title: { ar: "عن المنتدى", en: "About the forum" },
    lead: {
      ar: "منتدى مكة الغذائي للإعاشة والتموين منصة متخصصة تجمع أطراف قطاع الإعاشة والتموين والضيافة في مكان واحد، بما يخدم بيئة الأعمال ويسهّل الوصول إلى الفرص والشراكات.",
      en: "Makkah Food Catering & Supply Forum is a specialised platform bringing the catering, supply and hospitality ecosystem together in one place — supporting the business environment and making opportunities and partnerships easier to reach.",
    },
    paragraphs: {
      ar: [
        "يمثّل قطاع الإعاشة والتموين ركيزة أساسية في منظومة الضيافة والخدمات، خصوصًا في مكة المكرمة التي تستقبل أعدادًا كبيرة من الزوار على مدار العام. ومن هنا تأتي أهمية منصة تجمع العاملين في القطاع لمناقشة احتياجاته وفرص تطويره.",
        "يجمع المنتدى الشركات والمستثمرين ورواد الأعمال والمختصين والجهات الحكومية ذات العلاقة، في مساحة مخصصة للتواصل وتبادل المعرفة وعرض الحلول وبناء علاقات عمل مستدامة.",
      ],
      en: [
        "The catering and supply sector is a cornerstone of the hospitality and services ecosystem — especially in Makkah, which receives large numbers of visitors throughout the year. A dedicated platform for the people who work in this sector matters.",
        "The forum brings together companies, investors, entrepreneurs, specialists and relevant government entities in a space designed for networking, knowledge exchange, showcasing solutions and building lasting business relationships.",
      ],
    },
    points: [
      {
        icon: "partnership",
        title: { ar: "قطاعات مترابطة", en: "Connected sectors" },
        body: {
          ar: "الإعاشة والتموين والضيافة والتصنيع والتوريد في منصة واحدة.",
          en: "Catering, supply, hospitality, manufacturing and distribution in one platform.",
        },
      },
      {
        icon: "opportunity",
        title: { ar: "شراكات وفرص", en: "Partnerships & opportunity" },
        body: {
          ar: "مساحة للتواصل بين الشركات والمستثمرين والمختصين وبناء علاقات أعمال.",
          en: "A space for companies, investors and specialists to connect and build business relationships.",
        },
      },
      {
        icon: "expertise",
        title: { ar: "تسجيل وتذكرة فورية", en: "Instant ticket" },
        body: {
          ar: "تسجيل مجاني مفتوح، وتذكرة إلكترونية فورية مع رمز QR للدخول.",
          en: "Free open registration with an instant QR-coded entry ticket.",
        },
      },
    ],
  },
  event: {
    title: { ar: "معلومات الفعالية", en: "Event information" },
    dateNote: {
      ar: "الموعد المعلن للفعالية",
      en: "Announced event date",
    },
    venueName: {
      ar: "قاعة هيلتون للمؤتمرات",
      en: "Hilton Conference Hall",
    },
    venueAddress: {
      ar: "المنطقة المركزية بجوار الحرم المكي، مكة المكرمة، المملكة العربية السعودية",
      en: "Central area next to the Grand Mosque, Makkah, Saudi Arabia",
    },
    participationLabel: { ar: "نوع المشاركة", en: "Participation" },
    participationValue: { ar: "حضور مجاني", en: "Free attendance" },
    mapCta: { ar: "فتح الموقع على الخريطة", en: "Open in Google Maps" },
    note: {
      ar: "يرجى إبراز تذكرة الحضور الإلكترونية ورمز QR عند بوابة المنتدى.",
      en: "Please present your e-ticket and QR code at the forum entrance.",
    },
  },
  audience: {
    title: { ar: "الفئات المستهدفة", en: "Who it is for" },
    description: {
      ar: "يستهدف المنتدى الجهات والكوادر العاملة في منظومة الإعاشة والتموين والضيافة.",
      en: "The forum is designed for organisations and professionals across the catering, supply and hospitality ecosystem.",
    },
    items: [
      {
        icon: "catering",
        title: { ar: "شركات الإعاشة والتموين", en: "Catering companies" },
        body: {
          ar: "مشغلو خدمات الإعاشة والتموين للمنشآت والفعاليات.",
          en: "Providers of catering and supply services for venues and events.",
        },
      },
      {
        icon: "beverage",
        title: { ar: "شركات الأغذية والمشروبات", en: "Food & beverage" },
        body: {
          ar: "العلامات والشركات العاملة في الأغذية والمشروبات.",
          en: "Brands and companies working across food and beverages.",
        },
      },
      {
        icon: "hotel",
        title: { ar: "الفنادق ومنشآت الضيافة", en: "Hotels & hospitality" },
        body: {
          ar: "الفنادق والمنشآت التي تقدم خدمات الضيافة والإقامة.",
          en: "Hotels and venues providing hospitality and accommodation services.",
        },
      },
      {
        icon: "restaurant",
        title: { ar: "المطاعم وسلاسل المطاعم", en: "Restaurants & chains" },
        body: {
          ar: "المطاعم المستقلة وسلاسل المطاعم ومشغلو الخدمات الغذائية.",
          en: "Independent restaurants, chains and food service operators.",
        },
      },
      {
        icon: "logistics",
        title: { ar: "التوريد والتوزيع", en: "Supply & distribution" },
        body: {
          ar: "شركات التوريد والنقل والتوزيع والخدمات اللوجستية.",
          en: "Supply, transport, distribution and logistics companies.",
        },
      },
      {
        icon: "factory",
        title: { ar: "التصنيع الغذائي", en: "Food manufacturing" },
        body: {
          ar: "المصانع وشركات التصنيع والتعبئة والتغليف الغذائي.",
          en: "Factories and companies in food manufacturing and packaging.",
        },
      },
      {
        icon: "government",
        title: { ar: "الجهات الحكومية", en: "Government entities" },
        body: {
          ar: "الجهات والهيئات ذات العلاقة بتنظيم وخدمات القطاع.",
          en: "Entities and authorities involved in regulating and supporting the sector.",
        },
      },
      {
        icon: "investment",
        title: { ar: "المستثمرون ورواد الأعمال", en: "Investors & founders" },
        body: {
          ar: "المستثمرون ورواد الأعمال المهتمون بفرص القطاع.",
          en: "Investors and founders interested in sector opportunities.",
        },
      },
      {
        icon: "expertise",
        title: { ar: "المستشارون والمتخصصون", en: "Consultants & specialists" },
        body: {
          ar: "الخبراء والمستشارون والكوادر المتخصصة في القطاع.",
          en: "Experts, consultants and specialised professionals.",
        },
      },
    ],
  },
  cta: {
    title: {
      ar: "سجّل الآن واحجز مقعدك في المنتدى",
      en: "Register now and reserve your seat",
    },
    description: {
      ar: "التسجيل مجاني ومفتوح للجميع، وتصدر تذكرة الحضور الإلكترونية فور إتمام النموذج.",
      en: "Registration is free and open to everyone. Your e-ticket is issued instantly once the form is complete.",
    },
    button: { ar: "التسجيل المجاني", en: "Free registration" },
  },
  privacy: {
    title: { ar: "سياسة الخصوصية", en: "Privacy policy" },
    intro: {
      ar: "نلتزم في منصة منتدى مكة الغذائي للإعاشة والتموين بحماية بياناتك الشخصية ومعالجتها بشفافية، وفق ما ينطبق من أحكام نظام حماية البيانات الشخصية في المملكة العربية السعودية (PDPL).",
      en: "The Makkah Food Catering & Supply Forum platform is committed to protecting your personal data and processing it transparently, in line with the applicable provisions of Saudi Arabia's Personal Data Protection Law (PDPL).",
    },
    sections: [
      {
        title: { ar: "البيانات التي نجمعها", en: "Data we collect" },
        body: {
          ar: [
            "بيانات التسجيل: الاسم الكامل، البريد الإلكتروني، رقم الجوال، الدولة، المدينة، جهة العمل، المسمى الوظيفي، نوع الجهة، ومجال الاهتمام.",
            "بيانات تقنية محدودة: لغة التسجيل، وقت الموافقة، وعنوان IP مخزّن بصيغة مجزأة (Hash) لأغراض الأمان ومنع إساءة الاستخدام، إضافةً إلى سجل عمليات إدارية.",
          ],
          en: [
            "Registration data: full name, email, mobile number, country, city, company, job title, organisation type and area of interest.",
            "Limited technical data: registration language, consent time, a hashed IP address for security and abuse prevention, and an administrative audit trail.",
          ],
        },
      },
      {
        title: { ar: "أغراض المعالجة", en: "How we use it" },
        body: {
          ar: [
            "إنشاء سجل التسجيل وإصدار التذكرة الإلكترونية ورمز QR الخاص بها.",
            "إدارة الحضور والتحقق من التذكرة عند بوابة المنتدى، وإرسال التذكرة وتحديثات الفعالية عبر البريد أو واتساب عند تفعيلهما.",
            "إعداد إحصاءات وتقارير مجمعة لتنظيم الفعالية، دون استخدام بياناتك في تسويق غير مرتبط بالمنتدى.",
          ],
          en: [
            "Creating your registration, issuing your e-ticket and its unique QR code.",
            "Managing attendance and verifying tickets at the entrance, and sending your ticket and event updates by email or WhatsApp when enabled.",
            "Producing aggregated statistics and reports for event operations. Your data is not used for marketing unrelated to the forum.",
          ],
        },
      },
      {
        title: { ar: "الأساس النظامي", en: "Lawful basis" },
        body: {
          ar: [
            "نعالج بياناتك بناءً على موافقتك الصريحة التي تقدمها عند إرسال نموذج التسجيل، ولأغراض إدارة الفعالية والأمان. يمكنك سحب موافقتك في أي وقت، مع العلم أن ذلك قد يمنع استمرار تسجيلك.",
          ],
          en: [
            "We process your data on the basis of the explicit consent you provide when submitting the registration form, and for event administration and security. You may withdraw consent at any time; this may prevent your registration from continuing.",
          ],
        },
      },
      {
        title: { ar: "مشاركة البيانات", en: "Data sharing" },
        body: {
          ar: [
            "لا نبيع بياناتك. قد تُشارك الحد الأدنى من البيانات مع مزودي الخدمات التقنية اللازمين لتشغيل المنصة، مثل مزود البريد الإلكتروني (Resend) عند تفعيله وواتساب للأعمال عند تفعيله، ووفق ضوابط تعاقدية مناسبة.",
            "قد تُفصح البيانات عند وجود التزام نظامي أو طلب رسمي من جهة مختصة.",
          ],
          en: [
            "We do not sell your data. Minimal data may be shared with technical providers required to operate the platform, such as the email provider (Resend) when enabled and WhatsApp Business when enabled, under appropriate contractual controls.",
            "Data may be disclosed where required by law or by a formal request from a competent authority.",
          ],
        },
      },
      {
        title: { ar: "مدة الاحتفاظ", en: "Retention" },
        body: {
          ar: [
            "يُحتفظ ببيانات التسجيل للمدة اللازمة لإدارة الفعالية والوفاء بالالتزامات النظامية المرتبطة بها، ثم تُحذف أو تُخفى هويتها بطريقة آمنة.",
            "بيانات الجلسات الإدارية ومحاولات الاستخدام المؤقتة تُحذف دوريًا.",
          ],
          en: [
            "Registration data is retained for as long as needed to administer the event and meet related legal obligations, after which it is securely deleted or anonymised.",
            "Administrative session data and temporary rate-limit records are pruned periodically.",
          ],
        },
      },
      {
        title: { ar: "حقوقك", en: "Your rights" },
        body: {
          ar: [
            "وفقًا للأنظمة المعمول بها، يحق لك طلب الوصول إلى بياناتك أو تصحيحها أو حذفها أو سحب موافقتك، وطلب معلومات عن كيفية معالجتها. يمكنك تقديم الطلب عبر بيانات التواصل الرسمية المنشورة في الموقع.",
          ],
          en: [
            "Subject to applicable law, you may request access to, correction or deletion of your data, withdraw your consent, or ask how your data is processed. Requests can be made through the official contact details published on this site.",
          ],
        },
      },
      {
        title: { ar: "الأمان", en: "Security" },
        body: {
          ar: [
            "نستخدم اتصالات مشفرة، وتخزين رموز التذاكر بصيغة مجزأة مع تشفير الرمز اللازم لإعادة الإرسال، وصلاحيات وصول حسب الدور، وسجلات تدقيق للعمليات الإدارية الحساسة. الوصول إلى البيانات محصور في الأنظمة الخادمة ولا يُتاح للمتصفح مباشرة.",
          ],
          en: [
            "We use encrypted transport, store ticket lookup tokens as hashes with encryption for the re-sendable token, enforce role-based access, and keep audit logs for sensitive administrative actions. Data access is confined to server-side systems and is not exposed directly to the browser.",
          ],
        },
      },
      {
        title: { ar: "ملفات الارتباط", en: "Cookies" },
        body: {
          ar: [
            "تستخدم المنصة ملفات ارتباط ضرورية فقط: ملف اللغة المختارة وملف جلسة الدخول الإداري. لا نستخدم ملفات تتبع إعلانية.",
          ],
          en: [
            "The platform uses only essential cookies: your selected language and the administrative session. No advertising tracking cookies are used.",
          ],
        },
      },
    ],
  },
  footer: {
    note: {
      ar: "منصة التسجيل الرسمية لمنتدى مكة الغذائي للإعاشة والتموين.",
      en: "The official registration platform for Makkah Food Catering & Supply Forum.",
    },
    accessNote: {
      ar: "تذكرة إلكترونية فريدة مع رمز QR تُتحقق عند بوابة المنتدى.",
      en: "A unique e-ticket with a QR code verified at the forum entrance.",
    },
  },
  seo: {
    title: {
      ar: "منتدى مكة الغذائي للإعاشة والتموين | 10 يناير 2027",
      en: "Makkah Food Catering & Supply Forum | 10 January 2027",
    },
    description: {
      ar: "سجّل مجانًا لحضور منتدى مكة الغذائي للإعاشة والتموين في قاعة هيلتون للمؤتمرات، مكة المكرمة، 10 يناير 2027. تذكرة إلكترونية فورية مع رمز QR.",
      en: "Register free for Makkah Food Catering & Supply Forum at Hilton Conference Hall, Makkah, on 10 January 2027. Instant e-ticket with a QR code.",
    },
  },
};

export const DEFAULT_SETTINGS: EventSettingsView = {
  id: "main",
  eventDate: EVENT_DATE_FALLBACK,
  logoUrl: "/brand/logo-mark.svg",
  heroImageUrl: "/images/hero.jpg",
  aboutImageUrl: "/images/about.jpg",
  venueImageUrl: "/images/venue.jpg",
  mapUrl: DEFAULT_MAP_URL,
  contactEmail: "",
  contactPhone: "",
  whatsappNumber: "",
  socialX: "",
  socialInstagram: "",
  socialLinkedin: "",
  socialYoutube: "",
  whatsappEnabled: false,
  emailEnabled: true,
  content: DEFAULT_CONTENT,
  updatedAt: null,
};

/** Recursively keeps only shapes that match the defaults. */
export function mergeValue<T>(fallback: T, value: unknown): T {
  if (typeof fallback === "string") {
    return (typeof value === "string" ? value : fallback) as T;
  }
  if (typeof fallback === "boolean") {
    return (typeof value === "boolean" ? value : fallback) as T;
  }
  if (typeof fallback === "number") {
    return (typeof value === "number" && Number.isFinite(value) ? value : fallback) as T;
  }
  if (Array.isArray(fallback)) {
    if (!Array.isArray(value)) return fallback;
    if (fallback.length === 0) return value as T;
    if (typeof fallback[0] === "string") {
      return value.filter((item): item is string => typeof item === "string") as T;
    }
    return value.map((item, index) =>
      mergeValue(fallback[index] ?? fallback[0], item),
    ) as T;
  }
  if (fallback && typeof fallback === "object") {
    const record = (value ?? {}) as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(fallback).map(([key, fallbackValue]) => [
        key,
        mergeValue(fallbackValue, record[key]),
      ]),
    ) as T;
  }
  return fallback;
}

export function parseSiteContent(raw: unknown): SiteContent {
  return mergeValue(DEFAULT_CONTENT, raw);
}

export async function getEventSettings(): Promise<EventSettingsView> {
  try {
    const row = await prisma.eventSettings.findUnique({ where: { id: "main" } });
    if (!row) return DEFAULT_SETTINGS;
    return {
      id: row.id,
      eventDate: row.eventDate,
      logoUrl: row.logoUrl,
      heroImageUrl: row.heroImageUrl,
      aboutImageUrl: row.aboutImageUrl,
      venueImageUrl: row.venueImageUrl,
      mapUrl: row.mapUrl,
      contactEmail: row.contactEmail,
      contactPhone: row.contactPhone,
      whatsappNumber: row.whatsappNumber,
      socialX: row.socialX,
      socialInstagram: row.socialInstagram,
      socialLinkedin: row.socialLinkedin,
      socialYoutube: row.socialYoutube,
      whatsappEnabled: row.whatsappEnabled,
      emailEnabled: row.emailEnabled,
      content: parseSiteContent(row.content),
      updatedAt: row.updatedAt,
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[settings] Database unavailable — serving default marketing content.",
        error instanceof Error ? error.message : error,
      );
    }
    return DEFAULT_SETTINGS;
  }
}

export function formatEventDate(locale: Locale, date: Date = EVENT_DATE_FALLBACK): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: EVENT_TIMEZONE,
  }).format(date);
}

export function formatEventDateCompact(
  locale: Locale,
  date: Date = EVENT_DATE_FALLBACK,
): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: EVENT_TIMEZONE,
  }).format(date);
}
