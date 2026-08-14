# ZeCoat Website Maintenance Guide

This is the guide for keeping the ZeCoat website running. It is written for
people who do **not** work on websites every day. It explains where everything
is, how to do common tasks, and what to do when something breaks.

**The website:** https://zecoat.com

---

## Quick Facts

| Thing | What it is |
|---|---|
| Live website | https://zecoat.com |
| Where the site is hosted | Netlify (project name: `mellifluous-dieffenbachia-98917d`) |
| Where the code lives | GitHub: `zecoateng/ZeCoat-Website` |
| Database | Netlify Database (built into Netlify — stores announcements and quote requests) |
| Email sending | Resend (sends the contact form and quote request emails) |
| What it is built with | Astro + React (JavaScript frameworks) |

The most important idea in this whole document: **the website updates itself
automatically whenever code is pushed to GitHub.** Nobody ever needs to
"upload" the website anywhere. Push code → Netlify rebuilds the site → the
live site updates about a minute later.

---

## The Most Common Task: Posting an Announcement

Announcements appear on the homepage in the "Announcements" section.
You do NOT need to touch any code to post one.

1. Go to **https://zecoat.com/admindashboard**
2. Scroll to the **"Post an Announcement"** form
3. Fill in the Title, Date, and Description
4. Click **Post Announcement**
5. Open the homepage — your announcement appears in the Announcements section

Notes:
- The homepage shows the **3 newest** announcements.
- ⚠️ **Important:** the admin dashboard page is currently NOT password
  protected. Anyone who knows the address can see it (including customer
  quote requests). Do not share the `/admindashboard` link publicly.
  Adding a password to this page is on the to-do list at the bottom.

---

## Where Customer Messages Go

There are two forms customers can use:

**The Contact form** (zecoat.com/contact) and **the Order form**
(zecoat.com/order — the mirror configurator).

When a customer submits either one, two things happen:

1. **An email arrives** at the inbox set up to receive them
   (currently `aquijada@zecoat.com` — see "Changing who receives emails" below).
2. **Quote requests are also saved to the database** and appear as cards on
   **zecoat.com/admindashboard**, so there is a permanent record even if the
   email is lost.

To browse the raw saved data: log in to Netlify → open the site → click the
**Database** tab. The tables are `announcements`, `quotes`, and `submissions`.

---

## Editing Text and Images on the Site

Each page of the website is one file in the code. To change words on a page,
edit that file, then push to GitHub (see "Making a code change" below).

| Page | File to edit |
|---|---|
| Homepage | `src/pages/index.astro` |
| About Us | `src/pages/about.astro` |
| Coatings | `src/pages/coatings.astro` |
| Quality Assurance | `src/pages/quality.astro` |
| Contact page text | `src/components/ContactForm.jsx` |
| R&D / Technologies list | `src/pages/technologies/index.astro` |
| Individual technology pages | `src/pages/technologies/` (one file each) |
| Header menu / Footer | `src/components/Header.astro` and `Footer.astro` |

### Coating cards (the flip cards)

The cards on the Coatings page live in a list at the top of
`src/pages/coatings.astro`. Each card looks like this in the code:

```
{
  title: "Protected Silver",
  image: "/MirrorImage.webp",
  description: "Text shown on the FRONT of the card.",
  back: "Text shown on the BACK of the card (it flips when clicked)."
},
```

The back text uses a simple trick: any line written as `Label: value`
(for example `Reflectance: Avg. R 96%`) is displayed with the label in bold,
like a spec sheet. Separate lines with `\n` inside the quotes.

### Images

- All images live in the `public/` folder. An image saved as
  `public/MyPhoto.webp` is used in code as `/MyPhoto.webp`.
- Use the **WebP** format (much smaller files = faster site). The free tool
  https://squoosh.app converts any image to WebP in the browser.
- Recommended sizes when exporting new images:

| Where the image goes | Export size |
|---|---|
| Coating cards | 1200 × 600 (keep the subject centered — edges get cropped) |
| R&D / technology list | 800 × 640 |
| Headshots on About page | 1000 × 800 |

---

## Making a Code Change (the full loop)

This is what a developer does to change anything in the code.

### One-time setup on a new computer

1. Install **Git**: https://git-scm.com
2. Install **Node.js** (version 22 or newer): https://nodejs.org
3. Install the **Netlify CLI**: open a terminal and run
   `npm install -g netlify-cli`
4. Get the code:
   `git clone https://github.com/zecoateng/ZeCoat-Website.git`
   (you need access to the `zecoateng` GitHub account)
5. Inside the project folder, run `npm install` (downloads all the libraries —
   takes a minute)
6. Connect to Netlify: `netlify login` (log in as the company account),
   then `netlify link` and pick the ZeCoat project
7. Create a file named `.env` in the project folder containing:

   ```
   SMTP_PASS=(the Resend API key — get it from the Resend dashboard)
   MAIL_FROM=(the sending address — see the Email section)
   ```

   ⚠️ **Never** put real keys/passwords into Git, chat messages, or code
   files. The `.env` file stays on your computer only — it is deliberately
   ignored by Git.

### Day-to-day loop

1. In the project folder, run: `netlify dev`
2. Open **http://localhost:8888** in a browser — this is your private copy
   of the site. Edit code, save, and the page updates instantly.
3. Note: local development uses its **own empty practice database**. Test
   announcements and test quotes you create locally will NOT appear on the
   real site, and real data will not appear locally. This is on purpose —
   you can't break the real site from here.
4. When happy, publish it:

   ```
   git add .
   git commit -m "Short description of what you changed"
   git push
   ```

5. Netlify notices the push and rebuilds the live site automatically.
   Watch it at Netlify → Deploys. Green = live. Red = something failed
   (click the deploy to read the error).

---

## Environment Variables (the site's secrets)

"Environment variables" are secret values the site needs (like the email
key). They live in **two separate places**, and this is the #1 source of
"it works on my computer but not on the real site" confusion:

- **Your computer:** the `.env` file (used only by `netlify dev`)
- **The live site:** Netlify → Site configuration → **Environment variables**

If you change or add a secret, set it in **both** places. After changing one
on Netlify, you must **trigger a new deploy** (Deploys → Trigger deploy)
before it takes effect — the running site does not pick up changes by itself.

Current variables:

| Name | What it is |
|---|---|
| `SMTP_PASS` | The Resend API key (lets the site send email) |
| `MAIL_FROM` | The address emails are sent "from" |
| `ADMIN_PASSWORD` | The password for the /admindashboard page (username is `admin`) |

The database needs **no** variable — it connects automatically through
Netlify.

---

## The Email System (Resend)

The site sends email through **Resend** (resend.com). The key it uses can
ONLY send email — it cannot read anyone's inbox, so it is safe by design.

**Current state / remaining setup:** until the `zecoat.com` domain is
verified inside the Resend dashboard, emails must be sent from
`onboarding@resend.dev` and can only be delivered to the email address that
owns the Resend account. To finish the setup:

1. In Resend → Domains → add `zecoat.com`
2. Resend shows 2–3 DNS records → whoever manages the zecoat.com domain
   adds them
3. When Resend shows "Verified", change `MAIL_FROM` to something like
   `quotes@zecoat.com` (in BOTH the Netlify variables and local `.env`),
   then trigger a deploy

**Changing who receives the emails:** the destination address is written in
`src/pages/api/contact.js` — search for `to:` (it appears twice, once for
quote requests and once for general inquiries).

**If the key is ever exposed** (pasted somewhere public, committed to Git):
log in to Resend → API Keys → delete it → create a new one → update it in
both places → redeploy. Takes five minutes and fully fixes the problem.

---

## The Database

- **What's in it:** `announcements` (homepage announcements), `quotes`
  (order-form submissions), `submissions` (reserved for contact messages).
- **Where to look at it:** Netlify → the site → **Database** tab → browse
  tables and rows.
- **Local vs real:** running `netlify dev` uses a separate practice
  database. The real data only lives in production.
- **Changing the database structure** (adding tables/columns): the folder
  `netlify/database/migrations/` holds the setup scripts.
  ⚠️ **NEVER edit a migration file that has already been applied** — the
  deploy will fail with "migration has been modified after being applied."
  Always create a NEW migration file for any change
  (`netlify database migrations new --description "what it does"`).

---

## Changing the Order Form (mirror configurator)

- **Materials and coating options** are simple lists at the top of
  `src/components/OrderForm/ConfigureForm.jsx` — edit the `MATERIALS` and
  `COATINGS` arrays.
- **Shapes are special.** Each shape has its own dimension fields, and that
  information is duplicated in **four files**. If you add or rename a shape,
  you must update `DIMENSION_FIELDS` in ALL of these, or dimensions will
  silently stop showing somewhere:
  1. `src/components/OrderForm/ConfigureForm.jsx`
  2. `src/components/OrderForm/ReviewQuote.jsx`
  3. `src/components/OrderForm/SummaryComponent.jsx`
  4. `src/pages/api/contact.js` (the email)

  (If the new shape uses a brand-new dimension name, also add it to the
  dimension list in `src/pages/admindashboard.astro`.)

---

## When Something Breaks (troubleshooting)

**Golden rule: read the logs — the real error is always written there.**
Netlify → the site → **Logs → Functions** shows live errors from the forms
and database. **Deploys → (click the deploy)** shows build errors.

| Symptom | Most likely cause and fix |
|---|---|
| Works on localhost but not on the live site | An environment variable is missing on Netlify, or you forgot to trigger a deploy after changing one |
| Contact/order form says it failed | Check Logs → Functions while submitting; the error names itself (usually email key or database) |
| Emails not arriving | Check the spam folder; check the Resend dashboard → Logs (shows every send attempt); confirm `MAIL_FROM` rules above |
| Deploy failed: "migration has been modified" | Someone edited an already-applied migration file — put it back exactly as it was and make a NEW migration instead |
| Announcements section empty | Open zecoat.com/api/announcements directly — `[]` means the database is fine but empty; an error means check Function logs |
| Site looks broken after a deploy | Netlify → Deploys → open the previous good deploy → "Publish deploy" instantly rolls the site back while you investigate |

---

## To-Do List (known loose ends)

- [ ] Verify `zecoat.com` in Resend and switch `MAIL_FROM` to a real
      company address (needs DNS access)
- [x] Password-protect `/admindashboard` — DONE (username `admin`; the
      password is the `ADMIN_PASSWORD` environment variable)
- [ ] Delete `src/pages/api/quotes.js` — nothing uses it anymore, and it
      publicly exposes the quote list at zecoat.com/api/quotes
- [ ] Fill in the card backs for "Enhanced Protected Silver" and
      "Radiation Hardened Protected Silver" on the Coatings page
      (they still say placeholder text)
- [ ] Replace the team photo placeholder and "The Team" text on the About
      page with a real photo and description
- [ ] Make sure the Netlify, GitHub (`zecoateng`), and Resend accounts are
      all owned by company logins with credentials stored somewhere safe
