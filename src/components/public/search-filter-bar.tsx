import { Search } from "lucide-react";

type SearchFilterCategory = {
  id: string;
  name: string;
};

type Props = {
  basePath: string;
  searchValue?: string;
  categoryValue?: string;
  categories?: SearchFilterCategory[];
  placeholder: string;
  accent?: "yellow" | "green" | "purple";
};

const accentMap = {
  yellow: {
    focusBorder: "focus:border-accent-yellow focus:ring-accent-yellow/20",
    iconHover: "hover:text-accent-yellow",
    button: "bg-accent-yellow hover:bg-accent-yellow/90",
  },
  green: {
    focusBorder: "focus:border-accent-green focus:ring-accent-green/20",
    iconHover: "hover:text-accent-green",
    button: "bg-accent-green hover:bg-accent-green/90",
  },
  purple: {
    focusBorder: "focus:border-purple-500 focus:ring-purple-500/20",
    iconHover: "hover:text-purple-600",
    button: "bg-purple-600 hover:bg-purple-700",
  },
};

export function SearchFilterBar({
  basePath,
  searchValue,
  categoryValue,
  categories,
  placeholder,
  accent = "yellow",
}: Props) {
  const colors = accentMap[accent];

  return (
    <div className="pb-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-lg">
          <div className="flex flex-col gap-4 sm:flex-row">
            <form className="flex-1" method="get" action={basePath}>
              <div className="relative">
                <input
                  type="text"
                  name="q"
                  defaultValue={searchValue ?? ""}
                  placeholder={placeholder}
                  className={`w-full rounded-xl border border-border bg-surface-card py-3 pl-4 pr-12 text-sm text-text focus:outline-none focus:ring-2 ${colors.focusBorder}`}
                />
                <button
                  type="submit"
                  className={`absolute left-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors ${colors.iconHover}`}
                  aria-label="search"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
              {categoryValue && (
                <input type="hidden" name="category" value={categoryValue} />
              )}
            </form>

            {categories && (
              <form method="get" action={basePath}>
                <div className="flex items-center gap-2">
                  <select
                    name="category"
                    defaultValue={categoryValue ?? ""}
                    className={`rounded-xl border border-border bg-surface-card px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 ${colors.focusBorder}`}
                  >
                    <option value="">همه دسته‌ها</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className={`rounded-xl px-6 py-3 text-sm font-medium text-white transition-colors ${colors.button}`}
                  >
                    فیلتر
                  </button>
                </div>
                {searchValue && (
                  <input type="hidden" name="q" value={searchValue} />
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
