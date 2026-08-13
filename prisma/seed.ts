import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"] });

import { prisma, CategoryType } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { slugify } from "@/lib/slug";
import { sanitizeHtml } from "@/lib/sanitize";

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@nikmohaseb.ir";
  const adminPass = process.env.SEED_ADMIN_PASSWORD ?? "Admin123!";

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN", active: true },
    create: {
      name: "مدیر سیستم",
      email: adminEmail,
      password: await hashPassword(adminPass),
      role: "ADMIN",
      active: true,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@nikmohaseb.ir" },
    update: {},
    create: {
      name: "کاربر تستی",
      email: "user@nikmohaseb.ir",
      password: await hashPassword("User123!"),
      role: "USER",
    },
  });

  const categories: { name: string; type: CategoryType }[] = [
    { name: "مالیات", type: CategoryType.ARTICLE },
    { name: "حسابداری", type: CategoryType.ARTICLE },
    { name: "مالی", type: CategoryType.ARTICLE },
    { name: "خدمات", type: CategoryType.SERVICE },
    { name: "بخشنامه", type: CategoryType.CIRCULAR },
  ];
  for (const c of categories) {
    const slug = slugify(c.name);
    await prisma.category.upsert({
      where: { slug },
      update: { name: c.name, type: c.type },
      create: { name: c.name, slug, type: c.type },
    });
  }

  await prisma.banner.upsert({
    where: { id: "default-hero" },
    update: {
      title: "همراه مطمئن شما در امور مالی و مالیاتی",
      description: "خدمات تخصصی حسابداری، مالی، مالیاتی و مشاوره کسب‌وکار با نیک محاسب سرو",
      buttonText: "درخواست مشاوره",
      buttonLink: "/contact",
      active: true,
      order: 0,
    },
    create: {
      id: "default-hero",
      title: "همراه مطمئن شما در امور مالی و مالیاتی",
      description: "خدمات تخصصی حسابداری، مالی، مالیاتی و مشاوره کسب‌وکار با نیک محاسب سرو",
      buttonText: "درخواست مشاوره",
      buttonLink: "/contact",
      active: true,
      order: 0,
    },
  });

  const cat = await prisma.category.findFirst({ where: { type: CategoryType.SERVICE } });
  const services = [
    { title: "حسابداری شرکتی", summary: "ثبت حساب‌های شرکت و تهیه صورت‌جلسات، فاکتور و گزارش مالی دقیق", icon: "📊" },
    { title: "مشاوره مالیاتی", summary: "برنامه‌ریزی مالیاتی بهینه و ارائه راهکارهای صدوررساندن مالیات", icon: "📋" },
    { title: "مدیریت ارزش افزوده", summary: "ثبت و پیگیری خروجی‌های ارزش افزوده و اظهارنامه‌های مرتبط", icon: "🧮" },
    { title: "حسابداری روزانه", summary: "ثبت حساب‌های روزانه، حساب بانکی و اسناد حسابداری با دقت بالا", icon: "📅" },
    { title: "تهیه صورت‌های مالی", summary: "تهیه صورت شغل، صورت حساب و گزارش‌های مالی مطابق استانداردها", icon: "📑" },
    { title: "مشاوره مالی و برنامه‌ریزی", summary: "برنامه‌ریزی مالی شخصی و کسب‌وکار، تحلیل سرمایه‌گذاری و ریسک", icon: "💼" },
    { title: "خدمات حسابرسی", summary: "بررسی صحت حساب‌ها و گزارش‌های مالی توسط حسابرس مستقل", icon: "🔍" },
    { title: "ثبت شرکت و برند", summary: "ثبت شرکت، برند و ثبت اختراع و مالکیت فکری", icon: "🏢" },
    { title: "مالیات بر درآمد", summary: "محاسبه و پرداخت مالیات بر درآمد افراد و شرکت‌ها", icon: "💰" },
    { title: "مالیات بر ارزش افزوده", summary: "محاسبه، ثبت و پرداخت مالیات بر ارزش افزوده بهینه", icon: "🧾" },
    { title: "مشاوره حقوق و دستمزد", summary: "مشاوره در زمینه قوانین کار، حقوق و مزایا و سایر مزایا", icon: "👥" },
  ];
  for (const s of services) {
    const slug = slugify(s.title);
    await prisma.service.upsert({
      where: { slug },
      update: {
        title: s.title, summary: s.summary, icon: s.icon, order: 0,
        published: true, categoryId: cat?.id,
        content: sanitizeHtml(`<h3>${s.title}</h3><p>${s.summary}</p>`),
      },
      create: {
        title: s.title, slug, summary: s.summary, icon: s.icon, order: 0,
        published: true, categoryId: cat?.id,
        content: sanitizeHtml(`<h3>${s.title}</h3><p>${s.summary}</p>`),
      },
    });
  }

  const artCat = await prisma.category.findFirst({ where: { type: CategoryType.ARTICLE } });
  const articles = [
    {
      title: "راهنمای مالیات بر درآمد شغلی",
      slug: "راهنمای-مالیات-بر-درآمد-شغلی",
      summary: "نکات کلیدی مالیات بر درآمد افراد شاغل و شرکت‌های متوسط.",
      image: "/images/articles/tax-income.svg",
      content: sanitizeHtml(
        "<h2>مقدمه</h2><p>مالیات بر درآمد شغلی یکی از مهم‌ترین مالیات‌های کسب‌وکارهای کوچک و بزرگ است.</p><h3>شیوه‌های محاسبه مالیات</h3><p>برای افراد شاغل، مالیات بر درآمد شغلی بر اساس جدول‌های مالیاتی انجام می‌شود.</p><ul><li>کسر هزینه‌های لازمه کسب‌وکار</li><li>اعمال سهمیه شخصی مالیاتی</li><li>محاسبه مالیات بر اساس درآمد خالص</li></ul><h3>نکات کلیدی</h3><p>استفاده از ابزارهای دیجیتال و مشاوره تخصصی می‌تواند مالیات را بهینه کند.</p><ol><li>ثبت دقیق حساب‌ها</li><li>استفاده از نرم‌افزارهای حسابداری</li><li>درخواست مشاوره متخصص</li></ol>",
      ),
      seoTitle: "راهنمای مالیات بر درآمد شغلی",
      seoDescription: "نکات کلیدی مالیات بر درآمد افراد شاغل.",
    },
    {
      title: "راهنمای مالیات بر ارزش افزوده",
      slug: "راهنمای-مالیات-بر-ارزش-افزوده",
      summary: "تمامی نکات مهم مالیات بر ارزش افزوده برای کسب‌وکارها و عملیات فروش.",
      image: "/images/articles/vat.svg",
      content: sanitizeHtml(
        "<h2>مالیات بر ارزش افزوده چیست؟</h2><p>مالیات بر ارزش افزوده (VAT) یا مالیات بر افزایه ارزش، نوعی مالیات مصرفی است که بر ارزش افزوده در هر مرحلهٔ تولید و توزیع کالا و خدمات اعمال می‌شود.</p><h3>نرخ‌های مالیات بر ارزش افزوده</h3><p>در ایران، نرخ استاندارد مالیات بر ارزش افزوده ۹٪ است، اما برخی کالاها و خدمات تحت نرخ‌های ویژه قرار دارند.</p><ul><li>کالاهای اساسی: ۳٪ یا معاف</li><li>خدمات حمل‌ونقل عمومی: معاف</li><li>کالاهای لوکس: ۲۲٪</li></ul><h3>ثبت‌نام در سامانه ثبت‌شده‌ها</h3><p>تمام تجار واجب‌العقد باید در سامانه ثبت‌نام کنند و فاکتور صادر شده به‌صورت الکترونیکی ثبت شود.</p><ol><li>ثبت‌نام در سامانه</li><li>دریافت گواهی‌نامه الکترونیکی</li><li>صدور فاکتور الکترونیکی</li><li>ارائه گزارش‌های دوره‌ای</li></ol><h3>نکات مهم مالیاتی</h3><p>مراقب باشید که فاکتورهای صادره دارای کد فعالیت منطبق بر واقعیت باشد.</p>",
      ),
      seoTitle: "راهنمای مالیات بر ارزش افزوده | محاسبه و ثبت‌نام در سامانه",
      seoDescription: "راهنمای کامل مالیات بر ارزش افزوده: نرخ‌ها، ثبت‌نام در سامانه، فاکتور الکترونیکی و نکات مهم مالیاتی برای کسب‌وکارها.",
    },
    {
      title: "ثبت شرکت در ایران: گام به گام",
      slug: "ثبت-شرکت-در-ایران-گام-به-گام",
      summary: "راهنمای کامل ثبت شرکت در ایران از نوع شرکت تا اخذ مجوزها.",
      image: "/images/articles/company-register.svg",
      content: sanitizeHtml(
        "<h2>انتخاب نوع شرکت</h2><p>انتخاب نوع شرکت بر اساس اهداف، سرمایه و تعداد شرکا انجام می‌شود.</p><ul><li>شرکت با مسئولیت محدود: سرمایه‌گذاری محدود</li><li>شرکت تضام‌الوجوه: مسئولیت کلی اعضا</li><li>شرکت‌های تک‌صاحبه: ساده‌ترین فرم ثبت</li></ul><h3>مدارک مورد نیاز</h3><p>برای ثبت شرکت، مدارک زیر لازم است:</p><ol><li>فرم درخواست ثبت شرکت</li><li>اسناد هویتی اعضا</li><li>طرح توطیق یا تصمیم شرکت</li><li>مدرک مالکیت دفتر</li><li>گواهی ثبت شرکت‌های قبلی (در صورت وجود)</li></ol><h3>فرایند ثبت</h3><p>پس از ارائه مدارک، اسناد دریافت و ظرفیت صادر می‌شود. سپس باید در سازمان ثبت شرکت‌ها و افراد حقیقی ثبت‌نام کنید.</p><h3>ضروریات پس از ثبت</h3><p>پس از ثبت شرکت، وظایف زیر باید انجام شود:</p><ul><li>ثبت در بیمه تامین اجتماعی</li><li>ثبت در اداره مالیات</li><li>باز کردن حساب بانکی شرکت</li><li>صدور گواهی‌نامه تجاری</li></ul>",
      ),
      seoTitle: "ثبت شرکت در ایران | راهنمای گام به گام ثبت شرکت",
      seoDescription: "راهنمای ثبت شرکت در ایران: انتخاب نوع شرکت، مدارک مورد نیاز، فرایند ثبت و وظایف پس از ثبت.",
    },
    {
      title: "نکات حسابرسی داخلی در شرکت‌های تولیدی",
      slug: "نکات-حسابرسی-داخلی-در-شرکت‌های-تولیدی",
      summary: "نکات کلیدی حسابرسی داخلی برای بهبود فرآیندها و کاهش ریسک در شرکت‌های تولیدی.",
      image: "/images/articles/internal-audit.svg",
      content: sanitizeHtml(
        "<h2>اهمیت حسابرسی داخلی</h2><p>حسابرسی داخلی یک فرآیند نظارتی است که به منظور ارزیابی کارایی کنترل‌های داخلی و مدیریت ریسک انجام می‌شود.</p><h3>حوزه‌های کلیدی حسابرسی</h3><p>در شرکت‌های تولیدی، حوزه‌های زیر اهمیت ویژه‌ای دارند:</p><ul><li>کنترل موجودی و انبار</li><li>کنترل هزینه‌های تولید</li><li>کنترل هزینه‌های عمومی و اداری</li><li>کنترل ریسک‌های مالی و عملیاتی</li><li>کنترل رویه‌های داخلی</li></ul><h3>روش‌های بهبود حسابرسی</h3><p>با بهبود فرآیندهای حسابرسی، می‌توانید ریسک‌ها را شناسایی و مدیریت کنید.</p><ol><li>ایجاد برنامه حسابرسی سالانه</li><li>استفاده از نرم‌افزارهای حسابداری هوشمند</li><li>آموزش کارکنان در زمینه کنترل داخلی</li><li>بررسی دوره‌ای صحح اسناد حسابداری</li><li>گزارش‌دهی شفاف به مدیریت</li></ol><h3>نتیجه‌گیری</h3><p>حفظ استانداردهای حسابرسی داخلی باعث افزایش اعتبار مالی و جلوگیری از خطرات ناشی از سوءاستفاده‌های مالی می‌شود.</p>",
      ),
      seoTitle: "نکات حسابرسی داخلی در شرکت‌های تولیدی | راهنمای کامل",
      seoDescription: "نکات حسابرسی داخلی در شرکت‌های تولیدی: حوزه‌های کلیدی، روش‌های بهبود و گزارش‌دهی شفاف.",
    },
  ];
  for (const a of articles) {
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {
        title: a.title, summary: a.summary, content: a.content,
        published: true, publishedAt: new Date(),
        seoTitle: a.seoTitle, seoDescription: a.seoDescription,
        authorId: admin.id, categoryId: artCat?.id,
      },
      create: {
        title: a.title, slug: a.slug, summary: a.summary, image: a.image, content: a.content,
        published: true, publishedAt: new Date(),
        seoTitle: a.seoTitle, seoDescription: a.seoDescription,
        authorId: admin.id, categoryId: artCat?.id,
      },
    });
  }

  const circCat = await prisma.category.findFirst({
    where: { type: CategoryType.CIRCULAR },
  });
  const circulars = [
    {
      title: "بخشنامه شماره ۱۲۳/۱۴۰۳",
      slug: "بخشنامه-۱۲۳-۱۴۰۳",
      number: "۱۲۳/۱۴۰۳",
      date: new Date("2025-01-15T00:00:00Z"),
      issuer: "سازمان امور مالیاتی",
      summary: "اصلاحات نرخ مالیات بر ارزش افزوده",
      content: sanitizeHtml("<p>درجه‌بندی جدید مالیات بر ارزش افزوده...</p>"),
      file: undefined as string | undefined,
    },
    {
      title: "اصلاحیه شماره ۵۴/۱۴۰۵ مالیات بر ارزش افزوده",
      slug: "اصلاحیه-۵۴-۱۴۰۵-مالیات-بر-ارزش-افزوده",
      number: "۵۴/۱۴۰۵",
      date: new Date("2026-03-10T00:00:00Z"),
      issuer: "سازمان امور مالیاتی",
      summary: "اصلاحیه شماره ۵۴/۱۴۰۵ سازمان امور مالیاتی در خصوص ثبت الکترونیکی فاکتورهای فروشگاه‌های خرده‌فروشی.",
      content: sanitizeHtml(
        "<h2>اصلاحیه ثبت الکترونیکی فاکتور</h2><p>با عنایت به لزوم دقیق و شفاف‌سازی معاملات مالی، سازمان امور مالیاتی با انتشار اصلاحیه شماره ۵۴/۱۴۰۵، الزام ثبت الکترونیکی فاکتورهای صادره توسط فروشگاه‌های خرده‌فروشی را تا سقف ۵۰۰۰۰۰ ریال اعمال کرده است.</p><h3>موارد اعمال‌شده در این اصلاحیه</h3><ul><li>فروشگاه‌های زنجیره‌ای بزرگتر از ۵۰۰ متر</li><li>واحدهای فروش حضوری و اُنلاین</li><li>صادرکنندگان کالاهای مصرفی مردمی</li></ul><h3>زمان‌بندی اجرایی</h3><p>از تاریخ ۱۵ فروردین ۱۴۰۵، تمامی فاکتورهای صادره توسط واحدهای مشمول باید از طریق سامانه فاکتور الکترونیکی ثبت شوند.</p><ol><li>ثبت نام در سامانه الکترونیکی</li><li>اتصال کامیاب به سامانه</li><li>آزمون فاکتورهای نمونه</li><li>راه‌اندازی رسمی</li></ol><h3>جرائم ناشی از عدم رعایت</h3><p>عدم ثبت فاکتور الکترونیکی منجر به جریمه مالیاتی برابر با ۲۲ درصد ارزش فاکتور خواهد شد.</p>",
      ),
      file: undefined as string | undefined,
    },
    {
      title: "بخشنامه شماره ۱۸۷/۱۴۰۵ حسابداری و مالیات بر درآمد",
      slug: "بخشنامه-۱۸۷-۱۴۰۵-حسابداری-و-مالیات-بر-درآمد",
      number: "۱۸۷/۱۴۰۳",
      date: new Date("2026-06-05T00:00:00Z"),
      issuer: "سازمان حسابرسی و استانداردهای حسابداری",
      summary: "بخشنامه شماره ۱۸۷/۱۴۰۵ سازمان حسابرسی در خصوص استاندارد حسابداری و گزارش‌گری مالی برای شرکت‌های فعال در حوزه فناوری اطلاعات.",
      content: sanitizeHtml(
        "<h2>استانداردهای حسابداری برای واحارات فناوری اطلاعات</h2><p>بخشنامه شماره ۱۸۷/۱۴۰۵ سازمان حسابرسی و استانداردهای حسابداری با عنوان «راهنمای حسابداری برای شرکت‌های فناوری اطلاعات و استارتاپ‌ها» منتشر شده است.</p><h3>اصلاحات کلیدی</h3><ul><li>اعمال استانداردهای IFRS برای شرکت‌های فناوری</li><li>تغییرات در حسابداری هزینه‌های توسعه نرم‌افزار</li><li>اصلاحات در ارزیابی دارایی‌های فکری</li></ul><h3>تاثیر بر مالیات بر درآمد</h3><p>با اعمال این استانداردها، شرکت‌های فناوری می‌توانند هزینه‌های بیشتری را برای کسر از درآمد خالص اعمال کنند.</p><ol><li>مستندسازی هزینه‌های توسعه</li><li>جداسازی هزینه‌های لایسانس از هزینه‌های عملیاتی</li><li>استفاده از سهمیه‌های مالیاتی ویژه استارتاپ‌ها</li><li>ثبت دقیق هزینه‌های تحقیق و توسعه</li></ol>",
      ),
      file: undefined as string | undefined,
    },
    {
      title: "اطلاعیه شماره ۲۳۴/۱۴۰۵ الزامات صدور فاکتور رایانه‌ای VAT",
      slug: "اطلاعیه-۲۳۴-۱۴۰۵-الزامات-صدور-فاکتور-رایانه‌ای-vat",
      number: "۲۳۴/۱۴۰۵",
      date: new Date("2026-07-20T00:00:00Z"),
      issuer: "واحد مالیات بر ارزش افزوده سازمان امور مالیاتی",
      summary: "اطلاعیه شماره ۲۳۴/۱۴۰۵ در خصوص الزامات فنی و اطلاعاتی صدور فاکتور رایانه‌ای الکترونیکی مالیات بر ارزش افزوده.",
      content: sanitizeHtml(
        "<h2>اطلاعیه الزامات فاکتور رایانه‌ای الکترونیکی</h2><p>اطلاعیه شماره ۲۳۴/۱۴۰۵ واحد مالیات بر ارزش افزوده منتشر شده است که الزامات فنی و اطلاعاتی لازم برای صدور فاکتور الکترونیکی را تعیین می‌کند.</p><h3>فیلدهای الزامی فاکتور الکترونیکی</h3><ul><li>شماره اقتصادی ثبت‌شده در سازمان</li><li>شماره ثبت یا شناسه ملی</li><li>کد فعالیت اصلی و فرعی</li><li>جزئیات خریدار و فروشنده</li><li>شرح دقیق کالا و خدمات با واحد و قیمت</li></ul><h3>قوانین جدید ۱۴۰۵</h3><p>از ۱ شهریور ۱۴۰۵، تمام فاکتورهای الکترونیکی باید حاوی کد فعالیت دقیق باشند و مطابق با استاندارد XML تعریف‌شده در سامانه تکمیل شون.</p><h3>پیامدهای عدم رعایت</h3><p>عدم رعایت این الزامات منجر به عدم ثبت فاکتور و جریمه به میزان ۱۰۰ درصد مالیات معوق می‌شود.</p>",
      ),
      file: "https://example.com/docs/اطلاعیه-۲۳۴-۱۴۰۵.pdf",
    },
  ];
  for (const c of circulars) {
    await prisma.circular.upsert({
      where: { slug: c.slug },
      update: {
        title: c.title, number: c.number, date: c.date, issuer: c.issuer,
        summary: c.summary, content: c.content, published: true, publishedAt: new Date(),
        file: c.file, categoryId: circCat?.id,
      },
      create: {
        title: c.title, slug: c.slug, number: c.number, date: c.date, issuer: c.issuer,
        summary: c.summary, content: c.content, published: true, publishedAt: new Date(),
        file: c.file, categoryId: circCat?.id,
      },
    });
  }

  const existingTicket = await prisma.ticket.findFirst({
    where: { subject: "سوال درباره مالیات بر ارزش افزوده" },
  });
  if (!existingTicket) {
    await prisma.ticket.create({
      data: {
        subject: "سوال درباره مالیات بر ارزش افزوده",
        category: "مالیاتی",
        priority: "NORMAL",
        status: "NEW",
        userId: user.id,
        messages: {
          create: {
            content: "سوالی داشتم درباره زمان‌بندی مالیات بر ارزش افزوده.",
            userId: user.id,
          },
        },
      },
    });
  }
  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
