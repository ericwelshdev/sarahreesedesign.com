import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap" style={{ paddingBlock: "clamp(120px, 20vw, 240px)" }}>
      <p className="eyebrow">404</p>
      <h1 className="display mt-4">
        That page <em className="serif" style={{ color: "var(--accent)" }}>wandered off.</em>
      </h1>
      <p className="lede mt-6 max-w-[40ch]">The project may have been unpublished or the link has changed.</p>
      <Link href="/#work" className="btn btn-primary mt-8">Back to all work</Link>
    </div>
  );
}
