import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary-navy">403</h1>
        <p className="my-2 text-text-muted">دسترسی شما به این صفحه غیرمجاز است.</p>
        <Button asChild variant="primary">
          <Link href="/">بازگشت به خانه</Link>
        </Button>
      </div>
    </div>
  );
}

export default Unauthorized;
