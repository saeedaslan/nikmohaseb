export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "خانه", href: "/" },
  { label: "خدمات", href: "/services" },
  { label: "مقالات", href: "/articles" },
  { label: "بخشنامه‌ها", href: "/circulars" },
  { label: "قوانین", href: "/laws" },
  { label: "سؤالات متداول", href: "/faqs" },
  { label: "درباره ما", href: "/about" },
  { label: "تماس با ما", href: "/contact" },
];

export const companyName = "نیک محاسب سرو";
export const companyDescription =
  "همراه مطمئن شما در امور مالی و مالیاتی";

export const contactInfo = {
  address: "تهران، سعادت‌آباد، بلوار سعادت‌آباد، بالاتر از میدان کاج، برج مادر، پلاک ۱۳۳، طبقه ۱۰، واحد ۱۹",
  phones: ["۰۲۱-۸۲۸۰۹۵۱۵", "۰۲۱-۲۶۷۴۶۷۱۶"],
  email: "info@nikmohaseb.ir",
  workingHours: {
    weekdays: "شنبه تا چهارشنبه ۹:۰۰ - ۱۸:۰۰",
    thursday: "پنجشنبه ۹:۰۰ - ۱۴:۰۰",
  },
  social: {
    telegram: "https://t.me/nikmohaseb",
    instagram: "https://instagram.com/nikmohasebsarv",
  },
};
