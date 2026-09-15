"use client";

import { useState } from "react";
import Link from "next/link";

const platformOptions = ["TikTok", "Instagram", "Facebook"];

type Identity = {
  creatorCode: string;
  phone: string;
  name: string;
  email: string;
};

export default function CreatorSubmitVideoPage() {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [code, setCode] = useState("");
  const [phoneIn, setPhoneIn] = useState("");
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState("");

  const [platform, setPlatform] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [publishedUrl, setPublishedUrl] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const verify = async () => {
    if (!code.trim() || !phoneIn.trim()) {
      setCheckError("Enter your Creator Code and registered phone number.");
      return;
    }
    setChecking(true);
    setCheckError("");
    try {
      const res = await fetch("/api/creator-videos/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatorCode: code, phone: phoneIn }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Verification failed");
      setIdentity({ creatorCode: code.trim().toUpperCase(), phone: phoneIn.trim(), name: j.name, email: j.email });
    } catch (err) {
      setCheckError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async () => {
    if (!platform) {
      setError("Select the platform your video was created for.");
      return;
    }
    if (!videoTitle.trim()) {
      setError("Enter a video title.");
      return;
    }
    if (!videoLink.trim() && !file) {
      setError("Upload your video or paste a video link.");
      return;
    }
    if (!identity) return;

    const form = new FormData();
    form.set("creatorCode", identity.creatorCode);
    form.set("phone", identity.phone);
    form.set("platform", platform);
    form.set("videoTitle", videoTitle.trim());
    if (videoLink.trim()) form.set("videoLink", videoLink.trim());
    if (file) form.set("file", file);
    if (caption.trim()) form.set("caption", caption.trim());
    if (publishedUrl.trim()) form.set("publishedUrl", publishedUrl.trim());
    if (publishedDate) form.set("publishedDate", publishedDate);
    if (note.trim()) form.set("note", note.trim());

    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/creator-videos", { method: "POST", body: form });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Something went wrong");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <section className="bg-paper pt-[120px] pb-16 md:pt-[140px] md:pb-24">
        <div className="container-wz mx-auto max-w-[620px]">
          <div className="rounded-[20px] border border-navy/10 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-wazambi-gold">
              <svg className="h-10 w-10 text-navy" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="mt-6 headline text-[26px] text-navy">Video submitted.</h1>
            <p className="mx-auto mt-3 max-w-[480px] text-[15px] font-light text-ink/70">
              Thank you. Our team will review your video and update you through the Wazambi Creator
              program. You can submit another video, or a revised version if changes are requested.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button onClick={() => { setDone(false); setVideoTitle(""); setVideoLink(""); setFile(null); setCaption(""); setPublishedUrl(""); setPublishedDate(""); setNote(""); setPlatform(""); }} className="btn-primary">
                Submit Another Video
              </button>
              <Link href="/" className="btn-secondary">
                Back to Homepage
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-paper pt-[110px] pb-16 md:pt-[130px] md:pb-24">
      <div className="container-wz mx-auto max-w-[640px]">
        <div className="rounded-[20px] border border-navy/10 bg-white p-6 shadow-sm md:p-10">
          <p className="eyebrow">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-wazambi-gold align-middle" />
            Approved Creators Only
          </p>
          <h1 className="mt-3 headline text-[26px] text-navy md:text-[32px]">
            Submit a Video for Review
          </h1>
          <p className="mt-2 text-[14px] font-light text-ink/65">
            This form is only available to approved Wazambi Creators. Your video will be reviewed by
            the Wazambi team.
          </p>

          {!identity ? (
            <div className="mt-8 space-y-4">
              <p className="rounded-lg bg-paper p-4 text-[13px] font-light text-ink/70">
                Enter the Creator Code issued to you after approval, and the phone number you
                registered with.
              </p>
              <Field label="Creator Code * (e.g. WZC-XXXXXX)">
                <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className={inputCls} placeholder="WZC-XXXXXX" />
              </Field>
              <Field label="Registered phone number *">
                <input type="tel" value={phoneIn} onChange={(e) => setPhoneIn(e.target.value)} className={inputCls} placeholder="+260…" />
              </Field>
              {checkError && (
                <div className="flex items-start gap-2.5 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-[13px] text-red-800">
                  <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-4.75a.75.75 0 001.5 0v-4.5a.75.75 0 00-1.5 0v4.5zM10 7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  {checkError}
                </div>
              )}
              <button type="button" onClick={verify} disabled={checking} className="btn-primary w-full text-[14px] disabled:opacity-60">
                {checking ? "Checking…" : "Continue to the Form"}
              </button>
            </div>
          ) : (
            <div className="mt-8 space-y-5">
              <div className="flex flex-wrap items-center gap-3 rounded-lg bg-paper p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] text-ink/50">Approved creator</p>
                  <p className="text-[15px] font-semibold text-navy">{identity.name}</p>
                </div>
                <div className="rounded-full bg-wazambi-gold px-3 py-1 font-mono text-[12px] font-bold text-navy">
                  {identity.creatorCode}
                </div>
              </div>

              <div>
                <p className="mb-2 text-[15px] font-medium text-ink/80">Platform *</p>
                <div className="flex flex-wrap gap-2">
                  {platformOptions.map((p) => (
                    <button key={p} type="button" onClick={() => setPlatform(p)} aria-pressed={platform === p} className={`rounded-lg border px-5 py-2.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wazambi-gold focus-visible:ring-offset-2 ${platform === p ? "border-wazambi-gold bg-wazambi-gold text-navy shadow-md" : "border-navy/15 bg-white text-ink/70 hover:border-electric-blue"}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <Field label="Video title *">
                <input type="text" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} className={inputCls} />
              </Field>

              <div>
                <p className="mb-2 text-[15px] font-medium text-ink/80">Video *</p>
                <div className="space-y-3">
                  <Field label="Upload video">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      className="block w-full text-[13px] text-ink/70 file:mr-3 file:rounded-lg file:border-0 file:bg-navy file:px-4 file:py-2 file:text-[12px] file:font-semibold file:text-white"
                    />
                  </Field>
                  <div className="flex items-center gap-3 text-[12px] font-medium uppercase tracking-wide text-ink/40">
                    <span className="h-px flex-1 bg-navy/10" /> or <span className="h-px flex-1 bg-navy/10" />
                  </div>
                  <Field label="Paste a video link">
                    <input type="url" value={videoLink} onChange={(e) => setVideoLink(e.target.value)} className={inputCls} placeholder="Link to a hosted/private video" />
                  </Field>
                </div>
              </div>

              <Field label="Caption">
                <textarea rows={3} value={caption} onChange={(e) => setCaption(e.target.value)} className={inputCls} placeholder="The caption that will accompany the video" />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Published-post link (if already published)">
                  <input type="url" value={publishedUrl} onChange={(e) => setPublishedUrl(e.target.value)} className={inputCls} placeholder="https://…/post" />
                </Field>
                <Field label="Date published (if applicable)">
                  <input type="date" value={publishedDate} onChange={(e) => setPublishedDate(e.target.value)} className={inputCls} />
                </Field>
              </div>

              <Field label="Additional note">
                <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} className={inputCls} placeholder="Anything the review team should know" />
              </Field>

              {error && (
                <div className="flex items-start gap-2.5 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-[13px] text-red-800">
                  <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-4.75a.75.75 0 001.5 0v-4.5a.75.75 0 00-1.5 0v4.5zM10 7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <button type="button" onClick={handleSubmit} disabled={sending} className="btn-primary w-full text-[13px] uppercase tracking-wide disabled:opacity-60">
                {sending ? "Submitting…" : "Submit Video for Review"}
              </button>
              <button type="button" onClick={() => setIdentity(null)} className="w-full text-center text-[12px] font-medium text-ink/50 hover:text-navy">
                ← Switch account
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const inputCls =
  "mt-1.5 block w-full rounded-lg border border-navy/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-electric-blue";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-[14px] font-medium text-ink/75">
      {label}
      {children}
    </label>
  );
}