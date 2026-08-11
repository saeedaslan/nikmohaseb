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

  // Clean sample data
  await prisma.ticket.deleteMany({});
  await prisma.ticketMessage.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.circular.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.banner.deleteMany({});

  await prisma.banner.create({
    data: {
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
    {
      title: "حسابداری شرکتی",
      summary: "ثبت حساب‌های شرکت و تهیه صورت‌جلسات، فاکتور و گزارش مالی دقیق",
      icon: "📊",
    },
    {
      title: "مشاوره مالیاتی",
      summary: "برنامه‌ریزی مالیاتی بهینه و ارائه راهکارهای صدوررساندن مالیات",
      icon: "📋",
    },
    {
      title: "مدیریت ارزش افزوده",
      summary: "ثبت و پیگیری خروجی‌های ارزش افزوده و اظهارنامه‌های مرتبط",
      icon: "🧮",
    },
    {
      title: "حسابداری روزانه",
      summary: "ثبت حساب‌های روزانه، حساب بانکی و اسناد حسابداری با دقت بالا",
      icon: "📅",
    },
    {
      title: "تهیه صورت‌های مالی",
      summary: "تهیه صورت شغل، صورت حساب و گزارش‌های مالی مطابق استانداردها",
      icon: "📑",
    },
    {
      title: "مشاوره مالی و برنامه‌ریزی",
      summary: "برنامه‌ریزی مالی شخصی و کسب‌وکار، تحلیل سرمایه‌گذاری و ریسک",
      icon: "💼",
    },
    {
      title: "خدمات حسابرسی",
      summary: "بررسی صحت حساب‌ها و گزارش‌های مالی توسط حسابرس مستقل",
      icon: "🔍",
    },
    {
      title: "ثبت شرکت و برند",
      summary: "ثبت شرکت، برند و ثبت اختراع و مالکیت فکری",
      icon: "🏢",
    },
    {
      title: "مالیات بر درآمد",
      summary: "محاسبه و پرداخت مالیات بر درآمد افراد و شرکت‌ها",
      icon: "💰",
    },
    {
      title: "مالیات بر ارزش افزوده",
      summary: "محاسبه، ثبت و پرداخت مالیات بر ارزش افزوده بهینه",
      icon: "🧾",
    },
    {
      title: "مشاوره حقوق و دستمزد",
      summary: "مشاوره در زمینه قوانین کار، حقوق و مزایا و سایر مزایا",
      icon: "👥",
    },
  ];
  for (const s of services) {
    await prisma.service.create({
      data: {
        title: s.title,
        slug: slugify(s.title),
        summary: s.summary,
        icon: s.icon,
        order: 0,
        published: true,
        categoryId: cat?.id,
        content: sanitizeHtml(`<h3>${s.title}</h3><p>${s.summary}</p>`),
      },
    });
  }

  const artCat = await prisma.category.findFirst({ where: { type: CategoryType.ARTICLE } });
  await prisma.article.create({
    data: {
      title: "راهنمای مالیات بر درآمد شغلی",
      slug: "راهنمای-مالیات-بر-درآمد-شغلی",
      summary: "نکات کلیدی مالیات بر درآمد افراد شاغل و شرکت‌های متوسط.",
      image: "https://images.unsplash.com/photo-1581091001857-7bc5d5b2a9af",
      content: sanitizeHtml(
        "<h2>مقدمه</h2><p>مالیات بر درآمد شغلی یکی از مهم‌ترین مالیات‌های کسب‌وکارهای کوچک و بزرگ است.</p><ul><li>نکته ۱</li><li>نکته ۲</li></ul>",
      ),
      published: true,
      publishedAt: new Date(),
      seoTitle: "راهنمای مالیات بر درآمد شغلی",
      seoDescription: "نکات کلیدی مالیات بر درآمد افراد شاغل.",
      authorId: admin.id,
      categoryId: artCat?.id,
    },
  });

  const circCat = await prisma.category.findFirst({
    where: { type: CategoryType.CIRCULAR },
  });
  await prisma.circular.create({
    data: {
      title: "بخشنامه شماره ۱۲۳/۱۴۰۳",
      slug: "بخشنامه-۱۲۳-۱۴۰۳",
      number: "۱۲۳/۱۴۰۳",
      date: new Date("2025-01-15T00:00:00Z"),
      issuer: "سازمان امور مالیاتی",
      summary: "اصلاحات نرخ مالیات بر ارزش افزوده",
      content: sanitizeHtml("<p>درجه‌بندی جدید مالیات بر ارزش افزوده...</p>"),
      published: true,
      publishedAt: new Date(),
      categoryId: circCat?.id,
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

  console.log("Admin:", admin.email);
  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
