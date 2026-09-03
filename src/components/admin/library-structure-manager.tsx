"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/toast";
import {
  Plus,
  ChevronDown,
  ChevronLeft,
  Trash2,
  Edit3,
  Eye,
  Link2,
  Save,
  X,
  BookOpen,
  CheckCircle2,
  Circle,
  Search,
  Layers,
  Hash,
} from "lucide-react";
import {
  createLibraryBook,
  createLibraryChapter,
  createLibraryArticle,
  updateLibraryArticle,
  deleteLibraryArticle,
  deleteLibraryChapter,
  deleteLibraryBook,
  setArticleCirculars,
} from "@/lib/actions/library";
import { cn } from "@/lib/utils";

interface Article {
  id: string;
  number: number;
  title: string | null;
  slug: string;
  content: string;
  published: boolean;
}

interface Chapter {
  id: string;
  number: number;
  title: string;
  articles: Article[];
}

interface Book {
  id: string;
  number: number;
  title: string;
  chapters: Chapter[];
}

interface CircularOption {
  id: string;
  title: string;
  number: string | null;
  slug: string;
}

interface Props {
  lawId: string;
  lawSlug: string;
  initialBooks: Book[];
  allCirculars: CircularOption[];
  initialCircularMap: Record<string, string[]>;
}

function toPersian(n: number): string {
  return String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export function LibraryStructureManager({
  lawId,
  lawSlug,
  initialBooks,
  allCirculars,
  initialCircularMap,
}: Props) {
  const router = useRouter();
  const { addToast } = useToast();
  const [pending, startTransition] = useTransition();
  const [books] = useState(initialBooks);
  const [expandedBooks, setExpandedBooks] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(initialBooks.map((b) => [b.id, true])),
  );
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
  const [addingBook, setAddingBook] = useState(false);
  const [bookForm, setBookForm] = useState({ number: 1, title: "" });
  const [chapterForms, setChapterForms] = useState<Record<string, { number: number; title: string; open: boolean }>>({});
  const [articleForms, setArticleForms] = useState<Record<string, { number: number; title: string; content: string; published: boolean; open: boolean }>>({});
  const [editingArticle, setEditingArticle] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ number: number; title: string; content: string; published: boolean }>({ number: 0, title: "", content: "", published: true });
  const [attachingCirculars, setAttachingCirculars] = useState<string | null>(null);

  const totalArticles = useMemo(
    () => books.reduce((s, b) => s + b.chapters.reduce((c, ch) => c + ch.articles.length, 0), 0),
    [books],
  );
  const totalChapters = useMemo(
    () => books.reduce((s, b) => s + b.chapters.length, 0),
    [books],
  );

  async function handleAddBook() {
    if (!bookForm.title.trim()) {
      addToast({ message: "عنوان کتاب الزامی است.", variant: "error" });
      return;
    }
    startTransition(async () => {
      const fd = new FormData();
      fd.append("title", bookForm.title);
      fd.append("number", String(bookForm.number));
      const result = await createLibraryBook(lawId, fd);
      if (result?.error) {
        addToast({ message: result.error, variant: "error" });
      } else {
        addToast({ message: "کتاب اضافه شد.", variant: "success" });
        setBookForm({ number: bookForm.number + 1, title: "" });
        setAddingBook(false);
        router.refresh();
      }
    });
  }

  async function handleAddChapter(bookId: string) {
    const form = chapterForms[bookId];
    if (!form?.title.trim()) {
      addToast({ message: "عنوان فصل الزامی است.", variant: "error" });
      return;
    }
    startTransition(async () => {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("number", String(form.number));
      const result = await createLibraryChapter(bookId, fd);
      if (result?.error) {
        addToast({ message: result.error, variant: "error" });
      } else {
        addToast({ message: "فصل اضافه شد.", variant: "success" });
        setChapterForms((p) => ({
          ...p,
          [bookId]: { number: (form.number ?? 0) + 1, title: "", open: false },
        }));
        router.refresh();
      }
    });
  }

  async function handleDeleteChapter(chapterId: string) {
    if (!confirm("حذف این فصل تمام مواد آن را نیز حذف می‌کند. مطمئن هستید؟")) return;
    startTransition(async () => {
      const result = await deleteLibraryChapter(chapterId);
      if (result?.error) {
        addToast({ message: result.error, variant: "error" });
      } else {
        addToast({ message: "فصل حذف شد.", variant: "success" });
        router.refresh();
      }
    });
  }

  async function handleDeleteBook(bookId: string) {
    if (!confirm("حذف این کتاب تمام فصل‌ها و مواد آن را نیز حذف می‌کند. مطمئن هستید؟")) return;
    startTransition(async () => {
      const result = await deleteLibraryBook(bookId);
      if (result?.error) {
        addToast({ message: result.error, variant: "error" });
      } else {
        addToast({ message: "کتاب حذف شد.", variant: "success" });
        router.refresh();
      }
    });
  }

  async function handleAddArticle(chapterId: string) {
    const form = articleForms[chapterId];
    if (!form?.content.trim()) {
      addToast({ message: "متن ماده الزامی است.", variant: "error" });
      return;
    }
    startTransition(async () => {
      const fd = new FormData();
      fd.append("number", String(form.number));
      fd.append("title", form.title);
      fd.append("content", form.content);
      fd.append("slug", `m${form.number}`);
      fd.append("published", String(form.published));
      const result = await createLibraryArticle(chapterId, fd);
      if (result?.error) {
        addToast({ message: result.error, variant: "error" });
      } else {
        addToast({ message: "ماده اضافه شد.", variant: "success" });
        setArticleForms((p) => ({
          ...p,
          [chapterId]: { number: (form.number ?? 0) + 1, title: "", content: "", published: true, open: false },
        }));
        router.refresh();
      }
    });
  }

  async function handleDeleteArticle(articleId: string) {
    if (!confirm("حذف این ماده؟")) return;
    startTransition(async () => {
      const result = await deleteLibraryArticle(articleId);
      if (result?.error) {
        addToast({ message: result.error, variant: "error" });
      } else {
        addToast({ message: "ماده حذف شد.", variant: "success" });
        router.refresh();
      }
    });
  }

  function startEditArticle(a: Article) {
    setEditingArticle(a.id);
    setEditForm({ number: a.number, title: a.title ?? "", content: a.content, published: a.published });
  }

  async function saveEditArticle() {
    if (!editingArticle) return;
    if (!editForm.content.trim()) {
      addToast({ message: "متن ماده الزامی است.", variant: "error" });
      return;
    }
    startTransition(async () => {
      const fd = new FormData();
      fd.append("number", String(editForm.number));
      fd.append("title", editForm.title);
      fd.append("content", editForm.content);
      fd.append("slug", `m${editForm.number}`);
      fd.append("published", String(editForm.published));
      const result = await updateLibraryArticle(editingArticle, fd);
      if (result?.error) {
        addToast({ message: result.error, variant: "error" });
      } else {
        addToast({ message: "ماده بروزرسانی شد.", variant: "success" });
        setEditingArticle(null);
        router.refresh();
      }
    });
  }

  async function handleSaveCirculars(articleId: string, ids: string[]) {
    startTransition(async () => {
      const result = await setArticleCirculars(articleId, ids);
      if (result?.error) {
        addToast({ message: result.error, variant: "error" });
      } else {
        addToast({ message: `${toPersian(ids.length)} بخشنامه ذخیره شد.`, variant: "success" });
        setAttachingCirculars(null);
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Summary header */}
      <div className="grid grid-cols-3 gap-3">
        <SummaryStat icon={BookOpen} label="کتاب" value={toPersian(books.length)} color="from-blue-500/10 to-blue-500/5" textColor="text-blue-600" />
        <SummaryStat icon={Layers} label="فصل" value={toPersian(totalChapters)} color="from-violet-500/10 to-violet-500/5" textColor="text-violet-600" />
        <SummaryStat icon={Hash} label="ماده" value={toPersian(totalArticles)} color="from-emerald-500/10 to-emerald-500/5" textColor="text-emerald-600" />
      </div>

      {/* Add book */}
      <div className="rounded-3xl border border-border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-primary-navy">کتاب‌ها</h3>
            <p className="mt-0.5 text-xs text-text-muted">هر قانون می‌تواند شامل چند کتاب باشد</p>
          </div>
          <Button
            variant="accent"
            size="sm"
            onClick={() => setAddingBook((v) => !v)}
          >
            <Plus className="h-4 w-4" />
            <span className="mr-1">افزودن کتاب</span>
          </Button>
        </div>
        {addingBook && (
          <div className="mt-3 grid grid-cols-1 gap-2 rounded-2xl border border-border bg-surface-background p-3 sm:grid-cols-[6rem_1fr_auto]">
            <Input
              type="number"
              placeholder="شماره"
              value={bookForm.number}
              onChange={(e) => setBookForm({ ...bookForm, number: Number(e.target.value) })}
            />
            <Input
              placeholder="عنوان کتاب"
              value={bookForm.title}
              onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
            />
            <Button onClick={handleAddBook} disabled={pending}>
              ثبت
            </Button>
          </div>
        )}
      </div>

      {/* Books tree */}
      <div className="space-y-3">
        {books.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-white p-12 text-center">
            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-background">
              <BookOpen className="h-8 w-8 text-text-muted" />
            </div>
            <h3 className="mt-4 text-base font-bold text-primary-navy">هنوز کتابی ثبت نشده</h3>
            <p className="mt-1 text-sm text-text-muted">با افزودن اولین کتاب، ساختار قانون را شروع کنید.</p>
          </div>
        ) : (
          books.map((book) => {
            const cf = chapterForms[book.id] ?? { number: 1, title: "", open: false };
            return (
              <div
                key={book.id}
                className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="border-b border-border bg-gradient-to-l from-blue-500/5 to-transparent p-4">
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedBooks((p) => ({ ...p, [book.id]: !p[book.id] }))
                      }
                      className="flex min-w-0 flex-1 items-center gap-3"
                    >
                      <div className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-black text-white shadow-md shadow-blue-500/30">
                        {toPersian(book.number)}
                      </div>
                      <div className="min-w-0 text-start">
                        <div className="text-sm font-extrabold text-primary-navy line-clamp-1">
                          {book.title}
                        </div>
                        <div className="text-[10px] text-text-muted">
                          {toPersian(book.chapters.length)} فصل · {toPersian(book.chapters.reduce((s, c) => s + c.articles.length, 0))} ماده
                        </div>
                      </div>
                      <ChevronDown
                        className={cn(
                          "ms-auto h-5 w-5 flex-shrink-0 text-text-muted transition-transform",
                          expandedBooks[book.id] && "rotate-180",
                        )}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBook(book.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                      title="حذف کتاب"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {expandedBooks[book.id] && (
                  <div className="p-4 space-y-3">
                    {/* Add chapter */}
                    <div className="rounded-2xl border border-dashed border-border bg-surface-background/50 p-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setChapterForms((p) => ({
                            ...p,
                            [book.id]: { ...cf, open: !cf.open },
                          }))
                        }
                      >
                        <Plus className="h-4 w-4" />
                        افزودن فصل
                      </Button>
                      {cf.open && (
                        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[6rem_1fr_auto]">
                          <Input
                            type="number"
                            placeholder="شماره"
                            value={cf.number}
                            onChange={(e) =>
                              setChapterForms((p) => ({
                                ...p,
                                [book.id]: { ...cf, number: Number(e.target.value) },
                              }))
                            }
                          />
                          <Input
                            placeholder="عنوان فصل"
                            value={cf.title}
                            onChange={(e) =>
                              setChapterForms((p) => ({
                                ...p,
                                [book.id]: { ...cf, title: e.target.value },
                              }))
                            }
                          />
                          <Button onClick={() => handleAddChapter(book.id)} disabled={pending}>
                            ثبت
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Chapters */}
                    {book.chapters.length === 0 ? (
                      <p className="rounded-2xl border border-dashed border-border bg-surface-background/30 p-4 text-center text-xs text-text-muted">
                        فصلی ثبت نشده است.
                      </p>
                    ) : (
                      book.chapters.map((chapter) => {
                        const af =
                          articleForms[chapter.id] ?? {
                            number: 1,
                            title: "",
                            content: "",
                            published: true,
                            open: false,
                          };
                        return (
                          <div
                            key={chapter.id}
                            className="overflow-hidden rounded-2xl border border-border bg-surface-background/40"
                          >
                            <div className="flex items-center justify-between gap-2 border-b border-border bg-white p-3">
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedChapters((p) => ({
                                    ...p,
                                    [chapter.id]: !p[chapter.id],
                                  }))
                                }
                                className="flex min-w-0 flex-1 items-center gap-2"
                              >
                                <Layers className="h-4 w-4 flex-shrink-0 text-violet-600" />
                                <span className="text-sm font-extrabold text-primary-navy">
                                  فصل {toPersian(chapter.number)}: {chapter.title}
                                </span>
                                <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold text-violet-600">
                                  {toPersian(chapter.articles.length)} ماده
                                </span>
                                <ChevronLeft
                                  className={cn(
                                    "ms-auto h-4 w-4 text-text-muted transition-transform",
                                    expandedChapters[chapter.id] && "rotate-90",
                                  )}
                                />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteChapter(chapter.id)}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                                title="حذف فصل"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            {expandedChapters[chapter.id] && (
                              <div className="space-y-2 p-3">
                                {chapter.articles.length === 0 ? (
                                  <p className="rounded-xl border border-dashed border-border bg-white p-3 text-center text-xs text-text-muted">
                                    ماده‌ای ثبت نشده است.
                                  </p>
                                ) : (
                                  chapter.articles.map((a) => {
                                    const isEditing = editingArticle === a.id;
                                    const isAttaching = attachingCirculars === a.id;
                                    const attached = initialCircularMap[a.id] ?? [];
                                    return (
                                      <div
                                        key={a.id}
                                        className={cn(
                                          "rounded-2xl border bg-white shadow-sm transition-colors",
                                          isEditing
                                            ? "border-accent-green/40 ring-2 ring-accent-green/20"
                                            : "border-border",
                                        )}
                                      >
                                        {!isEditing && (
                                          <div className="flex flex-wrap items-center gap-2 p-3">
                                            <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-black text-emerald-600">
                                              {toPersian(a.number)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                              <div className="text-sm font-bold text-primary-navy line-clamp-1">
                                                ماده {toPersian(a.number)}
                                                {a.title ? ` - ${a.title}` : ""}
                                              </div>
                                              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[10px] text-text-muted">
                                                {a.published ? (
                                                  <span className="inline-flex items-center gap-1 text-emerald-600">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    منتشر
                                                  </span>
                                                ) : (
                                                  <span className="inline-flex items-center gap-1 text-text-muted">
                                                    <Circle className="h-3 w-3" />
                                                    پیش‌نویس
                                                  </span>
                                                )}
                                                {attached.length > 0 && (
                                                  <span className="inline-flex items-center gap-1 text-amber-600">
                                                    <Link2 className="h-3 w-3" />
                                                    {toPersian(attached.length)} بخشنامه
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-1">
                                              <a
                                                href={`/library/laws/${lawSlug}/articles/${a.slug}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:border-accent-green hover:bg-accent-green/5 hover:text-accent-green"
                                                title="مشاهده"
                                              >
                                                <Eye className="h-3.5 w-3.5" />
                                              </a>
                                              <button
                                                type="button"
                                                onClick={() => setAttachingCirculars(isAttaching ? null : a.id)}
                                                className={cn(
                                                  "inline-flex h-8 items-center gap-1 rounded-lg border px-2 text-xs font-bold transition-colors",
                                                  isAttaching
                                                    ? "border-amber-500 bg-amber-500/10 text-amber-700"
                                                    : "border-border text-text-muted hover:border-amber-500 hover:bg-amber-500/5 hover:text-amber-600",
                                                )}
                                                title="بخشنامه‌های مرتبط"
                                              >
                                                <Link2 className="h-3.5 w-3.5" />
                                                {attached.length > 0 ? toPersian(attached.length) : "بخشنامه"}
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => startEditArticle(a)}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:border-accent-green hover:bg-accent-green/5 hover:text-accent-green"
                                                title="ویرایش"
                                              >
                                                <Edit3 className="h-3.5 w-3.5" />
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => handleDeleteArticle(a.id)}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                                                title="حذف"
                                              >
                                                <Trash2 className="h-3.5 w-3.5" />
                                              </button>
                                            </div>
                                          </div>
                                        )}

                                        {isEditing && (
                                          <div className="space-y-2 p-3">
                                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[6rem_1fr]">
                                              <Input
                                                type="number"
                                                placeholder="شماره"
                                                value={editForm.number}
                                                onChange={(e) => setEditForm({ ...editForm, number: Number(e.target.value) })}
                                              />
                                              <Input
                                                placeholder="عنوان (اختیاری)"
                                                value={editForm.title}
                                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                              />
                                            </div>
                                            <Textarea
                                              rows={4}
                                              value={editForm.content}
                                              onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                                              placeholder="متن ماده (HTML مجاز است)"
                                            />
                                            <div className="flex items-center justify-between">
                                              <label className="flex items-center gap-2 text-xs">
                                                <Checkbox
                                                  checked={editForm.published}
                                                  onChange={(e) => setEditForm({ ...editForm, published: e.target.checked })}
                                                />
                                                منتشر شود
                                              </label>
                                              <div className="flex items-center gap-1.5">
                                                <Button size="sm" variant="outline" onClick={() => setEditingArticle(null)} disabled={pending}>
                                                  <X className="h-3.5 w-3.5" />
                                                  انصراف
                                                </Button>
                                                <Button size="sm" onClick={saveEditArticle} disabled={pending}>
                                                  <Save className="h-3.5 w-3.5" />
                                                  ذخیره
                                                </Button>
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                        {isAttaching && !isEditing && (
                                          <CircularAttachPanel
                                            allCirculars={allCirculars}
                                            initialIds={attached}
                                            onSave={(ids) => handleSaveCirculars(a.id, ids)}
                                            onCancel={() => setAttachingCirculars(null)}
                                            pending={pending}
                                          />
                                        )}
                                      </div>
                                    );
                                  })
                                )}

                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    setArticleForms((p) => ({
                                      ...p,
                                      [chapter.id]: { ...af, open: !af.open },
                                    }))
                                  }
                                >
                                  <Plus className="h-4 w-4" />
                                  افزودن ماده
                                </Button>
                                {af.open && (
                                  <div className="space-y-2 rounded-2xl border border-dashed border-border bg-white p-3">
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[6rem_1fr]">
                                      <Input
                                        type="number"
                                        placeholder="شماره"
                                        value={af.number}
                                        onChange={(e) =>
                                          setArticleForms((p) => ({
                                            ...p,
                                            [chapter.id]: {
                                              ...af,
                                              number: Number(e.target.value),
                                            },
                                          }))
                                        }
                                      />
                                      <Input
                                        placeholder="عنوان (اختیاری)"
                                        value={af.title}
                                        onChange={(e) =>
                                          setArticleForms((p) => ({
                                            ...p,
                                            [chapter.id]: { ...af, title: e.target.value },
                                          }))
                                        }
                                      />
                                    </div>
                                    <Textarea
                                      placeholder="متن ماده (HTML مجاز است)"
                                      rows={4}
                                      value={af.content}
                                      onChange={(e) =>
                                        setArticleForms((p) => ({
                                          ...p,
                                          [chapter.id]: { ...af, content: e.target.value },
                                        }))
                                      }
                                    />
                                    <div className="flex items-center justify-between">
                                      <label className="flex items-center gap-2 text-sm">
                                        <Checkbox
                                          checked={af.published}
                                          onChange={(e) =>
                                            setArticleForms((p) => ({
                                              ...p,
                                              [chapter.id]: { ...af, published: e.target.checked },
                                            }))
                                          }
                                        />
                                        منتشر شود
                                      </label>
                                      <Button
                                        onClick={() => handleAddArticle(chapter.id)}
                                        disabled={pending}
                                        size="sm"
                                      >
                                        <Plus className="h-3.5 w-3.5" />
                                        ثبت ماده
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function SummaryStat({
  icon: Icon,
  label,
  value,
  color,
  textColor,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
  textColor: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-white p-3 shadow-sm">
      <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-50", color)} />
      <div className="relative flex items-center gap-2.5">
        <div className={cn("inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm", textColor)}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="text-base font-black text-primary-navy">{value}</div>
          <div className="text-[10px] text-text-muted">{label}</div>
        </div>
      </div>
    </div>
  );
}

function CircularAttachPanel({
  allCirculars,
  initialIds,
  onSave,
  onCancel,
  pending,
}: {
  allCirculars: CircularOption[];
  initialIds: string[];
  onSave: (ids: string[]) => void;
  onCancel: () => void;
  pending: boolean;
}) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(initialIds));
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allCirculars;
    return allCirculars.filter(
      (c) => c.title.toLowerCase().includes(q) || (c.number ?? "").toLowerCase().includes(q),
    );
  }, [allCirculars, query]);

  return (
    <div className="space-y-2 border-t border-amber-200 bg-amber-50/50 p-3">
      <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
        <Link2 className="h-3.5 w-3.5" />
        اتصال بخشنامه به این ماده
        <span className="text-amber-600/70">({toPersian(selected.size)} انتخاب)</span>
      </div>
      <div className="relative">
        <Search className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجوی بخشنامه..."
          className="w-full h-9 rounded-lg border border-amber-200 bg-white pe-9 ps-3 text-xs focus:border-amber-500 focus:outline-none"
        />
      </div>
      <div className="max-h-64 space-y-1 overflow-y-auto rounded-lg border border-amber-200 bg-white p-1.5">
        {filtered.length === 0 ? (
          <p className="p-3 text-center text-xs text-text-muted">نتیجه‌ای یافت نشد.</p>
        ) : (
          filtered.map((c) => {
            const isSelected = selected.has(c.id);
            return (
              <label
                key={c.id}
                className={cn(
                  "flex cursor-pointer items-start gap-2 rounded-md border p-2 text-xs transition-colors",
                  isSelected
                    ? "border-amber-500 bg-amber-50"
                    : "border-transparent hover:border-amber-300",
                )}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {
                    setSelected((prev) => {
                      const next = new Set(prev);
                      if (next.has(c.id)) next.delete(c.id);
                      else next.add(c.id);
                      return next;
                    });
                  }}
                  className="mt-0.5 h-3.5 w-3.5 accent-amber-500"
                />
                <div className="min-w-0 flex-1">
                  {c.number && (
                    <span className="rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                      شماره {c.number}
                    </span>
                  )}
                  <div className="mt-0.5 font-bold text-primary-navy line-clamp-2">{c.title}</div>
                </div>
              </label>
            );
          })
        )}
      </div>
      <div className="flex items-center justify-end gap-1.5">
        <Button size="sm" variant="outline" onClick={onCancel} disabled={pending}>
          انصراف
        </Button>
        <Button size="sm" onClick={() => onSave(Array.from(selected))} disabled={pending}>
          <Save className="h-3.5 w-3.5" />
          ذخیره
        </Button>
      </div>
    </div>
  );
}
