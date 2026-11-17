import { redirect } from "next/navigation";
import { isStudioAuthed } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isStudioAuthed()) redirect("/studio");
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="st-card w-full max-w-[420px] p-8 md:p-10">
        <div className="grid h-12 w-12 place-items-center rounded-full text-white" style={{ background: "#1d1d1f" }} aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4.5" y="10.5" width="15" height="10" rx="3" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></svg>
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight" style={{ letterSpacing: "-0.04em" }}>Studio</h1>
        <p className="mt-2 text-[15px]" style={{ color: "#6e6e73" }}>Sign in to edit case studies, copy and press. Changes publish to the live site instantly.</p>
        <LoginForm />
      </div>
    </main>
  );
}
