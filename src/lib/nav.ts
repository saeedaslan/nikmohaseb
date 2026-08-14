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
  { label: "درباره ما", href: "/about" },
  { label: "تماس با ما", href: "/contact" },
];

export const companyName = "نیک محاسب سرو";
export const companyDescription =
  "همراه مطمئن شما در امور مالی و مالیاتی";
