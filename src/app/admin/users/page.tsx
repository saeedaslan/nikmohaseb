import {
  listUsers,
  toggleUserActive,
  deleteUser,
} from "@/lib/actions/users";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { ToggleButton } from "@/components/admin/toggle-button";
import { RoleSelect } from "@/components/admin/role-select";
import { Input } from "@/components/ui/input";
import { toJalali } from "@/lib/jalali";

export const metadata = {
  title: "کاربران | ادمین | نیک محاسب سرو",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const users = await listUsers();

  const filtered = q
    ? users.filter(
        (u) =>
          (u.name ?? "").includes(q) ||
          (u.email ?? "").includes(q) ||
          (u.phone ?? "").includes(q),
      )
    : users;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary-navy">کاربران</h1>
        <form className="w-64">
          <Input name="q" placeholder="جستجوی کاربر..." defaultValue={q} />
        </form>
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-text-muted">کاربری یافت نشد.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border">
          <Table>
            <TableHeader>
              <tr>
                <TableHead>کاربر</TableHead>
                <TableHead>ایمیل</TableHead>
                <TableHead>موبایل</TableHead>
                <TableHead>نقش</TableHead>
                <TableHead>فعال</TableHead>
                <TableHead>عضویت</TableHead>
                <TableHead>عملیات</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <Button asChild variant="link" size="sm" className="p-0">
                      <a href={`/admin/users/${u.id}`}>{u.name ?? "-"}</a>
                    </Button>
                  </TableCell>
                  <TableCell>{u.email ?? "-"}</TableCell>
                  <TableCell>{u.phone ?? "-"}</TableCell>
                  <TableCell>
                    <RoleSelect userId={u.id} currentRole={u.role} />
                  </TableCell>
                  <TableCell>
                    <ToggleButton
                      active={u.active}
                      onToggle={toggleUserActive.bind(null, u.id, !u.active)}
                    />
                  </TableCell>
                  <TableCell className="text-xs">
                    {toJalali(u.createdAt)}
                  </TableCell>
                  <TableCell>
                    <DeleteButton
                      label={`کاربر ${u.name ?? ""}`}
                      onConfirm={deleteUser.bind(null, u.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
