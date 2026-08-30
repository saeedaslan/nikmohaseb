import { getServerSession, type AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { prisma, Role } from "@/lib/prisma";
import { comparePasswords } from "@/lib/password";
import { redirect } from "next/navigation";

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        identifier: {
          label: "ایمیل یا شماره موبایل",
          type: "text",
          placeholder: "example@nikmohaseb.ir یا 09123456789",
        },
        password: { label: "رمز عبور", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: String(credentials.identifier) },
              { phone: String(credentials.identifier) },
            ],
          },
        });
        if (!user || !user.password) return null;
        const isValid = await comparePasswords(
          String(credentials.password),
          user.password,
        );
        if (!isValid) return null;
        return {
          id: user.id,
          name: user.name ?? undefined,
          email: user.email ?? undefined,
          image: user.image ?? undefined,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id?: string }).id;
        token.role = (user as { role?: Role }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string | undefined;
        session.user.role = token.role as Role | undefined;
      }
      return session;
    },
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

export interface CurrentUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: Role;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  return {
    id: session.user.id as string,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role as Role,
  };
}

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== Role.ADMIN) redirect("/unauthorized");
  return user;
}

export async function requireAdminOrSupport(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== Role.ADMIN && user.role !== Role.SUPPORT) redirect("/unauthorized");
  return user;
}
