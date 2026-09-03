# Manage my refills — clickable prototype

A linked HTML prototype of the refill request flow, built for user testing. No build step — plain HTML/CSS/JS.

**Quick preview:** `preview.html` is a single self-contained file — CSS, JS, and the illustration are all inlined, and it navigates between screens in-page (no separate URLs). Open it directly in a browser, or drop it into a chat preview pane, and the whole flow works standalone. It's for quick look/sanity-checking only — it's not what you deploy.

For real user testing, use the multi-page version below (`index.html` + the other pages) hosted on GitHub Pages, since it has a real separate URL per screen and is the actual deliverable.

## Screens

1. **index.html** — Manage my refills (overview). Also renders the "request submitted" state automatically once someone completes the flow.
2. **request-pharmacy.html** — Confirm pharmacy (saved pharmacy list, select or add).
3. **add-pharmacy.html** — Search pharmacies. Type any pharmacy name (e.g. "CVS", "Costco", "Main Street Pharmacy") and it generates a matching retail + mail-order result, filterable by the All / Retail / Mail-order chips.
4. **add-pharmacy-manual.html** — Add pharmacy manually. Reached via the "Add Manually" link on the search screen. A blank form (name, address, ZIP, city, state, phone, mail-order checkbox); saving adds it to the saved pharmacy list, selected, same as a search result would.
5. **confirm-request.html** — Confirm refill request (what happens next).

Selections carry between screens via `localStorage`, so the flow feels stateful during testing. Each screen has a **Reset prototype** link (on the overview screen) to clear state and start over.

## Publish with GitHub Pages

1. Create a new GitHub repo and add all these files to the root (keep `assets/` as a folder).
2. Push to GitHub.
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment," set **Source** to "Deploy from a branch," pick your default branch and `/ (root)`, then **Save**.
5. GitHub gives you a URL like `https://yourusername.github.io/your-repo-name/` — that's the link to send to testers. It can take a minute or two to go live after the first push.

## Notes on typography

Headings use Substrate's serif display face, **Neuton** — confirmed against the source Figma file. It's a real Google Font (an earlier pass had it down as "Neutron," which doesn't exist as a typeface — that's now corrected). It's loaded directly from Google Fonts in each page's `<head>`, so no self-hosting or extra setup needed.

## Notes on the mock pharmacy search

`mock-data.js` recognizes common chains (CVS, Walgreens, Walmart, Costco, Rite Aid, Kroger, Safeway, Publix, Target, Express Scripts, Optum, Sam's Club) and names results the way that chain actually would. Any other typed name falls back to "`<Name>` Pharmacy" (retail) and "`<Name>` Online Pharmacy" (mail-order). Addresses/phone numbers are deterministic per search term, so the same search always returns the same-looking results during a test session — no live data or API calls involved.

If you want to extend the chain list or change the fallback naming, that logic lives in `CHAIN_PATTERNS` near the top of `mock-data.js`.
