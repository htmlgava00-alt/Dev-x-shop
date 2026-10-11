-- ====================================================================
-- Dev-X Online Store — Comprehensive Initial Seed Data
-- 8 Branches, 7 Categories, 28 Official Products, and Baseline Stock
-- ====================================================================

-- 1. Insert Categories
INSERT INTO public.categories (id, name_ar, name_en, badge_label_ar, sort_order) VALUES
('books', 'كتب ورقية', 'Paper Books', 'كتاب ورقي', 1),
('ebooks', 'كتب إلكترونية', 'E-Books', 'إصدار إلكتروني', 2),
('tees', 'تيشيرتات Dev-X', 'T-Shirts', 'تيشيرت', 3),
('bags', 'شنط وحقائب', 'Bags', 'شنطة', 4),
('notebooks', 'كراسات ونوت بوك', 'Notebooks', 'كراسة', 5),
('stickers', 'استيكرات', 'Stickers', 'استيكرات', 6),
('bundles', 'بكجات تعليمية', 'Bundles', 'عرض خاص', 7)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert The 8 Official Branches
INSERT INTO public.branches (id, code, name_ar, name_en, address_ar, address_en, phone, working_hours_ar, working_hours_en, google_maps_url, pickup_eligible, is_active) VALUES
('al-baragil', 'BR-01', 'البراجيل', 'Al-Baragil', 'فرع البراجيل، الجيزة', 'Al-Baragil Branch, Giza', '01507410800', 'السبت - الخميس: 10 ص - 10 م', 'Sat - Thu: 10 AM - 10 PM', 'https://maps.google.com/?q=Al-Baragil+Giza', TRUE, TRUE),
('maadi', 'BR-02', 'المعادي', 'Maadi', 'المعادي، القاهرة', 'Maadi, Cairo', '01507410800', 'السبت - الخميس: 10 ص - 10 م', 'Sat - Thu: 10 AM - 10 PM', 'https://maps.google.com/?q=Maadi+Cairo', TRUE, TRUE),
('al-warraq', 'BR-03', 'الوراق', 'Al-Warraq', 'الوراق، الجيزة', 'Al-Warraq, Giza', '01507410800', 'السبت - الخميس: 10 ص - 10 م', 'Sat - Thu: 10 AM - 10 PM', 'https://maps.google.com/?q=Al-Warraq+Giza', TRUE, TRUE),
('rod-el-farag', 'BR-04', 'روض الفرج', 'Rod El-Farag', 'روض الفرج، شبرا، القاهرة', 'Rod El-Farag, Shubra, Cairo', '01507410800', 'السبت - الخميس: 10 ص - 10 م', 'Sat - Thu: 10 AM - 10 PM', 'https://maps.google.com/?q=Rod+El-Farag+Cairo', TRUE, TRUE),
('dokki', 'BR-05', 'الدقي', 'Dokki', 'الدقي، الجيزة', 'Dokki, Giza', '01507410800', 'السبت - الخميس: 10 ص - 10 م', 'Sat - Thu: 10 AM - 10 PM', 'https://maps.google.com/?q=Dokki+Giza', TRUE, TRUE),
('6-october', 'BR-06', '6 أكتوبر', '6th of October', 'مدينة 6 أكتوبر، الجيزة', '6th of October City, Giza', '01507410800', 'السبت - الخميس: 10 ص - 10 م', 'Sat - Thu: 10 AM - 10 PM', 'https://maps.google.com/?q=6th+of+October+Giza', TRUE, TRUE),
('imbaba', 'BR-07', 'إمبابة', 'Imbaba', 'إمبابة، الجيزة', 'Imbaba, Giza', '01507410800', 'السبت - الخميس: 10 ص - 10 م', 'Sat - Thu: 10 AM - 10 PM', 'https://maps.google.com/?q=Imbaba+Giza', TRUE, TRUE),
('ard-el-liwa', 'BR-08', 'أرض اللواء', 'Ard El-Liwa', 'أرض اللواء، الجيزة', 'Ard El-Liwa, Giza', '01507410800', 'السبت - الخميس: 10 ص - 10 م', 'Sat - Thu: 10 AM - 10 PM', 'https://maps.google.com/?q=Ard+El-Liwa+Giza', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Products (28 SKUs)
INSERT INTO public.products (id, sku, category_id, subcategory, title_ar, title_en, description_ar, description_en, badge_ar, badge_en, base_price, requires_size, available_sizes, skill_level, book_category, is_best_seller, is_new) VALUES
-- Books
('17111', 'BK-PROG-FUND', 'books', NULL, 'Programming Fundamentals', 'Programming Fundamentals', 'أساسيات البرمجة والتفكير المنطقي وهياكل البيانات', 'Core fundamentals of logical programming and data structures', 'كتاب ورقي', 'Paper Book', 150.00, FALSE, ARRAY[]::TEXT[], 'Beginner', 'Fundamentals', TRUE, FALSE),
('17135', 'BK-PY-01', 'books', NULL, 'Python Programming (غلاف 1)', 'Python Programming (Cover 1)', 'دليل بايثون للمبتدئين وبناء المشاريع الأولى', 'Beginner Python guide to building practical software projects', 'كتاب ورقي', 'Paper Book', 220.00, FALSE, ARRAY[]::TEXT[], 'Beginner', 'Language Specific', FALSE, FALSE),
('17120', 'BK-PY-02', 'books', NULL, 'Python Programming (غلاف 2)', 'Python Programming (Cover 2)', 'إصدار بايثون المتقدم لعلوم البيانات وهندسة النظم', 'Advanced Python for data science and system engineering', 'كتاب ورقي', 'Paper Book', 220.00, FALSE, ARRAY[]::TEXT[], 'Intermediate', 'Language Specific', FALSE, FALSE),
('17132', 'BK-PY-03', 'books', NULL, 'Python Programming (غلاف 3)', 'Python Programming (Cover 3)', 'الدليل التطبيقي لحل المسائل والمشاريع الشاملة', 'Applied guide for comprehensive problem solving and apps', 'كتاب ورقي', 'Paper Book', 220.00, FALSE, ARRAY[]::TEXT[], 'Intermediate', 'Language Specific', FALSE, FALSE),
('17117', 'BK-WEB-DEV', 'books', NULL, 'Web Development & Modern Frontend', 'Web Development & Modern Frontend', 'تطوير واجهات الويب الحديثة، HTML5, CSS3 و JavaScript', 'Modern frontend engineering with HTML5, CSS3 and JavaScript', 'كتاب ورقي', 'Paper Book', 175.00, FALSE, ARRAY[]::TEXT[], 'Intermediate', 'UI/UX & Frontend', FALSE, TRUE),
('17126', 'BK-DATA-SCI', 'books', NULL, 'Advanced Data Science', 'Advanced Data Science', 'علم البيانات المتقدم ونماذج التحليل والتعلم الآلي', 'Advanced data science, predictive analysis and machine learning', 'كتاب ورقي', 'Paper Book', 250.00, FALSE, ARRAY[]::TEXT[], 'Advanced', 'Specialized', FALSE, FALSE),
('17123', 'BK-SPEC-TOPICS', 'books', NULL, 'Specialized Topics', 'Specialized Topics', 'موضوعات تخصصية معمقة في هندسة البرمجيات وتصميم النظم', 'In-depth specialized topics in software architectures', 'كتاب ورقي', 'Paper Book', 195.00, FALSE, ARRAY[]::TEXT[], 'Advanced', 'Specialized', FALSE, FALSE),

-- E-Books
('17065', 'EB-CLOUD-DEVOPS', 'ebooks', NULL, 'Advanced Cloud & DevOps', 'Advanced Cloud & DevOps', 'البنية السحابية والأتمتة الحديثة للمطورين', 'Cloud architectures and modern automation for developers', 'إصدار إلكتروني', 'E-Book', 450.00, FALSE, ARRAY[]::TEXT[], 'Advanced', 'Specialized', FALSE, FALSE),
('17085', 'EB-DESIGN-PATTERNS', 'ebooks', NULL, 'Design Patterns & Architectures', 'Design Patterns & Architectures', 'أنماط التصميم البرمجية وتطبيقات المشاريع الكبرى', 'Software design patterns and scalable architecture paradigms', 'إصدار إلكتروني', 'E-Book', 350.00, FALSE, ARRAY[]::TEXT[], 'Advanced', 'Projects & Patterns', FALSE, FALSE),
('17075', 'EB-ADV-TS', 'ebooks', NULL, 'Advanced TypeScript', 'Advanced TypeScript', 'الأنماط المعمارية للتايب سكريبت في الويب والخوادم', 'Architectural TypeScript patterns for web and backend services', 'إصدار إلكتروني', 'E-Book', 300.00, FALSE, ARRAY[]::TEXT[], 'Intermediate', 'Language Specific', FALSE, FALSE),
('17070', 'EB-UIUX-DESIGN', 'ebooks', NULL, 'UI/UX & Frontend Design Systems', 'UI/UX & Frontend Design Systems', 'تصميم وهندسة نظم الواجهات الكبرى وتجربة المستخدم', 'Design systems and UX architecture for large-scale applications', 'إصدار إلكتروني', 'E-Book', 250.00, FALSE, ARRAY[]::TEXT[], 'Intermediate', 'UI/UX & Frontend', FALSE, FALSE),
('17080', 'EB-CLEAN-CODE', 'ebooks', NULL, 'Clean Code Principles', 'Clean Code Principles', 'مبادئ الكود النظيف ومعايير الجودة وهندسة النظم', 'Clean code principles, refactoring and clean architecture', 'إصدار إلكتروني', 'E-Book', 150.00, FALSE, ARRAY[]::TEXT[], 'Beginner', 'Fundamentals', FALSE, FALSE),

-- T-Shirts (Sizes S, M, L, XL, XXL)
('17138', 'TS-STUDENTS-NAVY', 'tees', NULL, 'Dev-X Students T-Shirt', 'Dev-X Students T-Shirt', 'كحلي فاخر مع شعار Dev-X وطباعة الظهر للطلاب', 'Premium navy t-shirt with official Dev-X student design', 'تيشيرت طلاب Dev-X', 'Dev-X Students', 320.00, TRUE, ARRAY['S','M','L','XL','XXL']::TEXT[], NULL, NULL, TRUE, FALSE),
('17108', 'TS-BACC-PINK', 'tees', NULL, 'Dev-X Baccalaureate T-Shirt', 'Dev-X Baccalaureate T-Shirt', 'بينك أنيق لطلاب البكالوريا مع تصميم نجوم وكتابة سوداء', 'Elegant pink t-shirt with stars and black branding', 'تيشيرت البكالوريا', 'Baccalaureate', 275.00, TRUE, ARRAY['S','M','L','XL','XXL']::TEXT[], NULL, NULL, FALSE, FALSE),
('17141', 'TS-GRAD-NAVY', 'tees', NULL, 'Dev-X Graduates T-Shirt', 'Dev-X Graduates T-Shirt', 'كحلي وبرتقالي مميز مع عبارة Build The Future للخريجين', 'Navy and orange premium merchandise for graduates', 'تيشيرت الخريجين', 'Graduates', 350.00, TRUE, ARRAY['S','M','L','XL','XXL']::TEXT[], NULL, NULL, FALSE, TRUE),
('17114', 'TS-JUNIOR-WHITE', 'tees', NULL, 'Dev-X Junior T-Shirt', 'Dev-X Junior T-Shirt', 'أبيض ناصع مع عبارة Learn · Grow · Achieve', 'Clean white t-shirt featuring the Learn · Grow · Achieve motto', 'تيشيرت أبيض', 'Junior T-Shirt', 260.00, TRUE, ARRAY['S','M','L','XL','XXL']::TEXT[], NULL, NULL, FALSE, FALSE),

-- Bags
('17056', 'BG-TOTE', 'bags', 'tote', 'حقيبة توت Dev-X القماشية', 'Dev-X Canvas Tote Bag', 'حقيبة قماشية قوية مريحة للكتب واللابتوب', 'Durable canvas tote bag for books and everyday gear', 'شنطة قماش', 'Tote Bag', 250.00, FALSE, ARRAY[]::TEXT[], NULL, NULL, FALSE, FALSE),
('17077', 'BG-LAPTOP-01', 'bags', 'laptop', 'حقيبة لابتوب Dev-X بحزام كتف (تصميم 1)', 'Dev-X Laptop Bag Design 1', 'حماية ممتازة للابتوب مع مساحات للشواحن والإكسسوارات', 'Padded laptop messenger bag with multiple compartments', 'شنطة لابتوب', 'Laptop Bag', 450.00, FALSE, ARRAY[]::TEXT[], NULL, NULL, FALSE, FALSE),
('17072', 'BG-LAPTOP-02', 'bags', 'laptop', 'حقيبة لابتوب Dev-X بحزام كتف (تصميم 2)', 'Dev-X Laptop Bag Design 2', 'تصميم عصري متين ومبطن لحماية اللابتوب في التنقل', 'Modern padded laptop protection with shoulder strap', 'شنطة لابتوب', 'Laptop Bag', 450.00, FALSE, ARRAY[]::TEXT[], NULL, NULL, FALSE, FALSE),
('17087', 'BG-BACKPACK', 'bags', 'backpack', 'حقيبة ظهر Dev-X الاحترافية', 'Dev-X Professional Backpack', 'حقيبة ظهر متعددة الجيوب Learn · Build · Grow', 'Multi-pocket professional backpack for campus and work', 'شنطة ظهر', 'Backpack', 600.00, FALSE, ARRAY[]::TEXT[], NULL, NULL, TRUE, FALSE),

-- Notebooks
('17050', 'NB-WIRE-01', 'notebooks', NULL, 'كراسة Dev-X سلك (تصميم 1)', 'Dev-X Wire Notebook 1', 'كراسة سلك مسطرة عالية الجودة لتدوين الملاحظات والكود', 'High quality wire-bound ruled notebook for code notes', 'كراسة', 'Notebook', 80.00, FALSE, ARRAY[]::TEXT[], NULL, NULL, FALSE, FALSE),
('17053', 'NB-WIRE-02', 'notebooks', NULL, 'كراسة Dev-X سلك (تصميم 2)', 'Dev-X Wire Notebook 2', 'كراسة ذات غلاف سميك وأوراق فاخرة للمبرمجين والطلاب', 'Thick cover notebook with premium sheets for developers', 'كراسة', 'Notebook', 120.00, FALSE, ARRAY[]::TEXT[], NULL, NULL, FALSE, FALSE),

-- Stickers
('17067', 'STK-PACK-01', 'stickers', NULL, 'مجموعة استيكرات Dev-X (باك 1)', 'Dev-X Sticker Pack 1', 'مجموعة ملصقات مقاومة للماء والخدش للابتوب والهاتف', 'Waterproof premium vinyl stickers for laptops and phones', 'استيكرات', 'Stickers', 50.00, FALSE, ARRAY[]::TEXT[], NULL, NULL, FALSE, FALSE),
('17059', 'STK-PACK-02', 'stickers', NULL, 'مجموعة استيكرات Dev-X (باك 2)', 'Dev-X Sticker Pack 2', 'تصاميم شعارات Dev-X وعبارات تقنية ملهمة عالية الجودة', 'Inspirational developer quotes and official Dev-X emblems', 'استيكرات', 'Stickers', 60.00, FALSE, ARRAY[]::TEXT[], NULL, NULL, FALSE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Baseline Stock (15 items per variant, 25 items per non-sized item) across all 8 branches
INSERT INTO public.branch_inventory (branch_id, product_id, size_variant, stock_quantity, reorder_threshold)
SELECT 
    b.id AS branch_id,
    p.id AS product_id,
    'default' AS size_variant,
    25 AS stock_quantity,
    5 AS reorder_threshold
FROM public.branches b
CROSS JOIN public.products p
WHERE p.requires_size = FALSE
ON CONFLICT (branch_id, product_id, size_variant) DO NOTHING;

-- T-Shirt variants stock
INSERT INTO public.branch_inventory (branch_id, product_id, size_variant, stock_quantity, reorder_threshold)
SELECT 
    b.id AS branch_id,
    p.id AS product_id,
    sz AS size_variant,
    15 AS stock_quantity,
    3 AS reorder_threshold
FROM public.branches b
CROSS JOIN public.products p
CROSS JOIN UNNEST(ARRAY['S', 'M', 'L', 'XL', 'XXL']) AS sz
WHERE p.requires_size = TRUE
ON CONFLICT (branch_id, product_id, size_variant) DO NOTHING;
