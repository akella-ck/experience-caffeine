"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useState, type ReactNode } from "react";

export function CorporateInquiryForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex min-h-[28rem] flex-col items-center justify-center rounded-[1.5rem] border border-emerald-300/12 bg-emerald-300/[0.035] p-8 text-center" role="status">
        <span className="grid h-14 w-14 place-items-center rounded-full border border-emerald-300/15 bg-emerald-300/[0.06]"><CheckCircle2 className="h-6 w-6 text-emerald-200/75" aria-hidden="true" /></span>
        <h3 className="mt-6 text-2xl font-medium tracking-[-0.035em] text-[#f0e4d2]">Inquiry prepared</h3>
        <p className="mt-4 max-w-md text-sm leading-7 text-[#9c9185]">This foundational form does not transmit data. Your submission was held only in this page session so the flow can be evaluated safely.</p>
        <button type="button" onClick={() => setSubmitted(false)} className="button-secondary mt-7">Prepare another inquiry</button>
      </div>
    );
  }

  return (
    <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }} className="grid gap-5" aria-describedby="inquiry-disclosure">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="business-name" label="Name"><input id="business-name" name="name" required autoComplete="name" className="form-control" placeholder="Your name" /></FormField>
        <FormField id="business-email" label="Work email"><input id="business-email" name="email" required type="email" autoComplete="email" className="form-control" placeholder="name@company.com" /></FormField>
        <FormField id="business-organization" label="Organization"><input id="business-organization" name="organization" required autoComplete="organization" className="form-control" placeholder="Company or coffee group" /></FormField>
        <FormField id="business-role" label="Role"><input id="business-role" name="role" required autoComplete="organization-title" className="form-control" placeholder="Quality lead, café owner…" /></FormField>
        <FormField id="business-locations" label="Locations">
          <select id="business-locations" name="locations" required className="form-control">
            <option value="">Select range</option><option>1 location</option><option>2–5 locations</option><option>6–20 locations</option><option>21+ locations</option><option>Roastery / production only</option>
          </select>
        </FormField>
        <FormField id="business-priority" label="Primary priority">
          <select id="business-priority" name="priority" required className="form-control">
            <option value="">Choose a focus</option><option>Learning and onboarding</option><option>Recipe consistency</option><option>Roast and quality standards</option><option>Multi-location visibility</option><option>Equipment and integrations</option>
          </select>
        </FormField>
      </div>
      <FormField id="business-message" label="What would you like to make more repeatable?">
        <textarea id="business-message" name="message" rows={5} className="form-control resize-y" placeholder="Tell us about your current workflow, team, or quality challenge." />
      </FormField>
      <label className="flex items-start gap-3 text-xs leading-5 text-[#918579]"><input type="checkbox" required className="mt-1 h-4 w-4 accent-amber-400" /><span>I understand this is a product-preview inquiry and that this foundational form does not send information to a sales system.</span></label>
      <button type="submit" className="button-primary w-full sm:w-auto sm:justify-self-start">Send inquiry <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
      <p id="inquiry-disclosure" className="text-[0.65rem] leading-5 text-[#6e645b]">Placeholder inquiry form: no network request, email, CRM record, or account is created.</p>
    </form>
  );
}

function FormField({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return <div><label htmlFor={id} className="mb-2 block text-xs font-medium text-[#ddd0bd]">{label}</label>{children}</div>;
}
