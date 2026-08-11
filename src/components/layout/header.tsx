import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { HeaderClient } from "./header-client";

export default async function Header() {
  const user = await getCurrentUser();
  const sessionUser = user
    ? { name: user.name, email: user.email, image: user.image, role: user.role }
    : null;
  return <HeaderClient user={sessionUser} />;
}
