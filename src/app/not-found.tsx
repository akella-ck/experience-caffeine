import { ArrowLeft, FlaskConical } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-shell grid min-h-[78vh] place-items-center pb-20 pt-32 text-center">
      <div>
        <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-[#d99a4e]/20 bg-[#d99a4e]/[0.07] text-[#d99a4e]">
          <FlaskConical size={22} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <p className="eyebrow mt-7">404 · No result</p>
        <h1 className="mt-5 text-4xl font-medium tracking-[-0.05em] sm:text-6xl">This experiment isn&apos;t in the lab.</h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#a99d8d]">
          The guide may have moved, or the address may be incomplete. Return to the main laboratory to keep exploring.
        </p>
        <Link href="/" className="button-primary mt-8">
          <ArrowLeft size={15} aria-hidden="true" /> Back to the lab
        </Link>
      </div>
    </section>
  );
}
