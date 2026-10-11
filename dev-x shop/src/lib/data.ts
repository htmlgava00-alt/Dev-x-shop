// Dev-X Online Store Catalog & Initial Configuration

import { Branch, CategoryKey, PaymentMethodConfig, Product } from './types';

export const BRANCHES: Branch[] = [
  {
    id: "al-baragil",
    code: "BR-01",
    nameAr: "البراجيل",
    nameEn: "Al-Baragil",
    addressAr: "فرع البراجيل، الجيزة",
    addressEn: "Al-Baragil Branch, Giza",
    phone: "01507410800",
    workingHoursAr: "السبت - الخميس: 10 ص - 10 م",
    workingHoursEn: "Sat - Thu: 10 AM - 10 PM",
    googleMapsUrl: "https://maps.google.com/?q=Al-Baragil+Giza",
    pickupEligible: true,
    isActive: true
  },
  {
    id: "maadi",
    code: "BR-02",
    nameAr: "المعادي",
    nameEn: "Maadi",
    addressAr: "المعادي، القاهرة",
    addressEn: "Maadi, Cairo",
    phone: "01507410800",
    workingHoursAr: "السبت - الخميس: 10 ص - 10 م",
    workingHoursEn: "Sat - Thu: 10 AM - 10 PM",
    googleMapsUrl: "https://maps.google.com/?q=Maadi+Cairo",
    pickupEligible: true,
    isActive: true
  },
  {
    id: "al-warraq",
    code: "BR-03",
    nameAr: "الوراق",
    nameEn: "Al-Warraq",
    addressAr: "الوراق، الجيزة",
    addressEn: "Al-Warraq, Giza",
    phone: "01507410800",
    workingHoursAr: "السبت - الخميس: 10 ص - 10 م",
    workingHoursEn: "Sat - Thu: 10 AM - 10 PM",
    googleMapsUrl: "https://maps.google.com/?q=Al-Warraq+Giza",
    pickupEligible: true,
    isActive: true
  },
  {
    id: "rod-el-farag",
    code: "BR-04",
    nameAr: "روض الفرج",
    nameEn: "Rod El-Farag",
    addressAr: "روض الفرج، شبرا، القاهرة",
    addressEn: "Rod El-Farag, Shubra, Cairo",
    phone: "01507410800",
    workingHoursAr: "السبت - الخميس: 10 ص - 10 م",
    workingHoursEn: "Sat - Thu: 10 AM - 10 PM",
    googleMapsUrl: "https://maps.google.com/?q=Rod+El-Farag+Cairo",
    pickupEligible: true,
    isActive: true
  },
  {
    id: "dokki",
    code: "BR-05",
    nameAr: "الدقي",
    nameEn: "Dokki",
    addressAr: "الدقي، الجيزة",
    addressEn: "Dokki, Giza",
    phone: "01507410800",
    workingHoursAr: "السبت - الخميس: 10 ص - 10 م",
    workingHoursEn: "Sat - Thu: 10 AM - 10 PM",
    googleMapsUrl: "https://maps.google.com/?q=Dokki+Giza",
    pickupEligible: true,
    isActive: true
  },
  {
    id: "6-october",
    code: "BR-06",
    nameAr: "6 أكتوبر",
    nameEn: "6th of October",
    addressAr: "مدينة 6 أكتوبر، الجيزة",
    addressEn: "6th of October City, Giza",
    phone: "01507410800",
    workingHoursAr: "السبت - الخميس: 10 ص - 10 م",
    workingHoursEn: "Sat - Thu: 10 AM - 10 PM",
    googleMapsUrl: "https://maps.google.com/?q=6th+of+October+Giza",
    pickupEligible: true,
    isActive: true
  },
  {
    id: "imbaba",
    code: "BR-07",
    nameAr: "إمبابة",
    nameEn: "Imbaba",
    addressAr: "إمبابة، الجيزة",
    addressEn: "Imbaba, Giza",
    phone: "01507410800",
    workingHoursAr: "السبت - الخميس: 10 ص - 10 م",
    workingHoursEn: "Sat - Thu: 10 AM - 10 PM",
    googleMapsUrl: "https://maps.google.com/?q=Imbaba+Giza",
    pickupEligible: true,
    isActive: true
  },
  {
    id: "ard-el-liwa",
    code: "BR-08",
    nameAr: "أرض اللواء",
    nameEn: "Ard El-Liwa",
    addressAr: "أرض اللواء، الجيزة",
    addressEn: "Ard El-Liwa, Giza",
    phone: "01507410800",
    workingHoursAr: "السبت - الخميس: 10 ص - 10 م",
    workingHoursEn: "Sat - Thu: 10 AM - 10 PM",
    googleMapsUrl: "https://maps.google.com/?q=Ard+El-Liwa+Giza",
    pickupEligible: true,
    isActive: true
  }
];

export const PAYMENT_METHODS: PaymentMethodConfig[] = [
  { id: 'fawry', ar: 'فوري', en: 'Fawry', icon: 'receipt', status: 'fully_integrated' },
  { id: 'instapay', ar: 'إنستاباي', en: 'InstaPay', icon: 'bolt', status: 'manual_workflow' },
  { id: 'vodafone', ar: 'فودافون كاش', en: 'Vodafone Cash', icon: 'phone', status: 'fully_integrated' },
  { id: 'etisalat', ar: 'اتصالات كاش', en: 'Etisalat Cash', icon: 'phone', status: 'fully_integrated' },
  { id: 'card', ar: 'فيزا وماستركارد', en: 'Visa & Mastercard', icon: 'credit-card', status: 'awaiting_credentials' },
  { id: 'bank', ar: 'تحويل بنكي', en: 'Bank Transfer', icon: 'landmark', status: 'manual_workflow' },
  { id: 'cod', ar: 'الدفع عند الاستلام', en: 'Cash on Delivery', icon: 'truck', status: 'fully_integrated' }
];

export const PRODUCTS: Product[] = [
  // Books (Paper)
  {
    id: "17111",
    sku: "BK-PROG-FUND",
    cat: "books",
    t: "Programming Fundamentals",
    d: "أساسيات البرمجة، التفكير المنطقي وهياكل البيانات الأساسية",
    bg: "كتاب ورقي",
    price: 150,
    skillLevel: "Beginner",
    bookCategory: "Fundamentals",
    isBestSeller: true
  },
  {
    id: "17135",
    sku: "BK-PY-01",
    cat: "books",
    t: "Python Programming (غلاف 1)",
    d: "تعلم لغة بايثون من الصفر حتى بناء المشاريع والتطبيقات",
    bg: "كتاب ورقي",
    price: 220,
    skillLevel: "Beginner",
    bookCategory: "Language Specific"
  },
  {
    id: "17120",
    sku: "BK-PY-02",
    cat: "books",
    t: "Python Programming (غلاف 2)",
    d: "إصدار متقدم في بايثون للمطورين وعلوم البيانات والأتمتة",
    bg: "كتاب ورقي",
    price: 220,
    skillLevel: "Intermediate",
    bookCategory: "Language Specific"
  },
  {
    id: "17132",
    sku: "BK-PY-03",
    cat: "books",
    t: "Python Programming (غلاف 3)",
    d: "دليل بايثون الشامل للتطبيقات الحديثة وحل المشكلات البرمجية",
    bg: "كتاب ورقي",
    price: 220,
    skillLevel: "Intermediate",
    bookCategory: "Language Specific"
  },
  {
    id: "17117",
    sku: "BK-WEB-DEV",
    cat: "books",
    t: "Web Development & Modern Frontend",
    d: "تطوير واجهات الويب الحديثة، HTML5, CSS3, JavaScript وبناء التطبيقات",
    bg: "كتاب ورقي",
    price: 175,
    skillLevel: "Intermediate",
    bookCategory: "UI/UX & Frontend",
    isNew: true
  },
  {
    id: "17126",
    sku: "BK-DATA-SCI",
    cat: "books",
    t: "Advanced Data Science",
    d: "علم البيانات المتقدم، تحليل واستخراج الرؤى ونماذج التعلم الآلي",
    bg: "كتاب ورقي",
    price: 250,
    skillLevel: "Advanced",
    bookCategory: "Specialized"
  },
  {
    id: "17123",
    sku: "BK-SPEC-TOPICS",
    cat: "books",
    t: "Specialized Topics in Software Engineering",
    d: "موضوعات تخصصية متقدمة في هندسة البرمجيات وتصميم النظم",
    bg: "كتاب ورقي",
    price: 195,
    skillLevel: "Advanced",
    bookCategory: "Specialized"
  },

  // E-Books
  {
    id: "17065",
    sku: "EB-CLOUD-DEVOPS",
    cat: "ebooks",
    t: "Advanced Cloud & DevOps",
    d: "البنية السحابية وهندسة ديف أوبس الحديثة والتشغيل الآلي",
    bg: "إصدار إلكتروني",
    price: 450,
    skillLevel: "Advanced",
    bookCategory: "Specialized"
  },
  {
    id: "17085",
    sku: "EB-DESIGN-PATTERNS",
    cat: "ebooks",
    t: "Design Patterns & Architectures",
    d: "أنماط التصميم البرمجية، المشاريع وتطبيقات الهندسة المتقدمة",
    bg: "إصدار إلكتروني",
    price: 350,
    skillLevel: "Advanced",
    bookCategory: "Projects & Patterns"
  },
  {
    id: "17075",
    sku: "EB-ADV-TS",
    cat: "ebooks",
    t: "Advanced TypeScript",
    d: "التعمق في تايب سكريبت والأنماط المعمارية للواجهات والخوادم",
    bg: "إصدار إلكتروني",
    price: 300,
    skillLevel: "Intermediate",
    bookCategory: "Language Specific"
  },
  {
    id: "17070",
    sku: "EB-UIUX-DESIGN",
    cat: "ebooks",
    t: "UI/UX & Frontend Design Systems",
    d: "هندسة نظم التصميم وتجربة المستخدم للتطبيقات الكبرى",
    bg: "إصدار إلكتروني",
    price: 250,
    skillLevel: "Intermediate",
    bookCategory: "UI/UX & Frontend"
  },
  {
    id: "17080",
    sku: "EB-CLEAN-CODE",
    cat: "ebooks",
    t: "Clean Code & Software Principles",
    d: "أساسيات الكود النظيف ومبادئ SOLID ومعايير البرمجة الاحترافية",
    bg: "إصدار إلكتروني",
    price: 150,
    skillLevel: "Beginner",
    bookCategory: "Fundamentals"
  },

  // T-Shirts (Sizes S, M, L, XL, XXL)
  {
    id: "17138",
    sku: "TS-STUDENTS-NAVY",
    cat: "tees",
    t: "Dev-X Students T-Shirt",
    d: "كحلي فاخر مع شعار Dev-X وطباعة الظهر للطلاب",
    bg: "تيشيرت طلاب Dev-X",
    price: 320,
    sz: 1,
    sizes: ["S", "M", "L", "XL", "XXL"],
    isBestSeller: true
  },
  {
    id: "17108",
    sku: "TS-BACC-PINK",
    cat: "tees",
    t: "Dev-X Baccalaureate T-Shirt",
    d: "بينك أنيق مع نجوم وكتابة سوداء لطلاب البكالوريا",
    bg: "تيشيرت البكالوريا",
    price: 275,
    sz: 1,
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "17141",
    sku: "TS-GRAD-NAVY",
    cat: "tees",
    t: "Dev-X Graduates T-Shirt",
    d: "كحلي وبرتقالي مع عبارة Build The Future للخريجين",
    bg: "تيشيرت الخريجين",
    price: 350,
    sz: 1,
    sizes: ["S", "M", "L", "XL", "XXL"],
    isNew: true
  },
  {
    id: "17114",
    sku: "TS-JUNIOR-WHITE",
    cat: "tees",
    t: "Dev-X Junior T-Shirt",
    d: "أبيض ناصع مع عبارة Learn · Grow · Achieve",
    bg: "تيشيرت أبيض",
    price: 260,
    sz: 1,
    sizes: ["S", "M", "L", "XL", "XXL"]
  },

  // Bags
  {
    id: "17056",
    sku: "BG-TOTE",
    cat: "bags",
    sub: "tote",
    t: "حقيبة توت Dev-X القماشية",
    d: "حقيبة قماشية قوية مريحة بتصميم Dev-X للكتب واللابتوب",
    bg: "شنطة قماش",
    price: 250
  },
  {
    id: "17077",
    sku: "BG-LAPTOP-01",
    cat: "bags",
    sub: "laptop",
    t: "حقيبة لابتوب Dev-X بحزام كتف (تصميم 1)",
    d: "حماية ممتازة للابتوب مع مساحات للشواحن والإكسسوارات",
    bg: "شنطة لابتوب",
    price: 450
  },
  {
    id: "17072",
    sku: "BG-LAPTOP-02",
    cat: "bags",
    sub: "laptop",
    t: "حقيبة لابتوب Dev-X بحزام كتف (تصميم 2)",
    d: "تصميم عصري متين ومبطن لحماية اللابتوب في التنقل",
    bg: "شنطة لابتوب",
    price: 450
  },
  {
    id: "17087",
    sku: "BG-BACKPACK",
    cat: "bags",
    sub: "backpack",
    t: "حقيبة ظهر Dev-X الاحترافية",
    d: "حقيبة ظهر متعددة الجيوب Learn · Build · Grow للجامعة والعمل",
    bg: "شنطة ظهر",
    price: 600,
    isBestSeller: true
  },

  // Notebooks
  {
    id: "17050",
    sku: "NB-WIRE-01",
    cat: "notebooks",
    t: "كراسة Dev-X سلك (تصميم 1)",
    d: "كراسة سلك مسطرة عالية الجودة لتدوين الملاحظات والكود",
    bg: "كراسة",
    price: 80
  },
  {
    id: "17053",
    sku: "NB-WIRE-02",
    cat: "notebooks",
    t: "كراسة Dev-X سلك (تصميم 2)",
    d: "كراسة ذات غلاف سميك وأوراق فاخرة للمبرمجين والطلاب",
    bg: "كراسة",
    price: 120
  },

  // Stickers
  {
    id: "17067",
    sku: "STK-PACK-01",
    cat: "stickers",
    t: "مجموعة استيكرات Dev-X (باك 1)",
    d: "مجموعة ملصقات مقاومة للماء والخدش للابتوب والهاتف",
    bg: "استيكرات",
    price: 50
  },
  {
    id: "17059",
    sku: "STK-PACK-02",
    cat: "stickers",
    t: "مجموعة استيكرات Dev-X (باك 2)",
    d: "تصاميم شعارات Dev-X وعبارات تقنية ملهمة عالية الجودة",
    bg: "استيكرات",
    price: 60
  }
];
