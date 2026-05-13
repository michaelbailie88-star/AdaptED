# Complete Setup Guide
## AdaptED + CampED + TeenagED — From Zero to Live

Follow these steps IN ORDER. Takes about 30 minutes total.

---

## STEP 1 — Create your 4 Gumroad products

Go to gumroad.com → Login → Products → New Product

Create each product below. For EACH one, you must enable license keys.

---

### Product 1: AdaptED Starter

| Field | Value |
|---|---|
| Name | AdaptED Activity Vault — Starter |
| Price | $27 |
| Product type | Digital product |
| Description | 250 activities across AdaptED, CampED & TeenagED. Goal on every card. Conversation starters. Group-size adaptations. One-time payment. |

**CRITICAL — Enable license keys:**
1. In the product editor → "Content" tab
2. Scroll to "License key" section
3. Toggle ON: "Generate a unique license key per sale"
4. Save

After saving, note your **Product Permalink** (bottom of the page).
It looks like: `gumroad.com/l/xxxxxx`
The part after `/l/` is your **slug** — write it down.

Also note the **Product ID** — it's in the URL when you're editing the product:
`gumroad.com/products/XXXXXXXX` — that `XXXXXXXX` is your Product ID.

---

### Product 2: AdaptED Pro

| Field | Value |
|---|---|
| Name | AdaptED Activity Vault — Pro |
| Price | $97 |
| Product type | Digital product |
| Description | 750 activities. All 3 brands. Printable cards. Conversation starters. Goal on every card. One-time payment, lifetime access. |

Enable license keys (same steps as above). Note slug + Product ID.

---

### Product 3: AdaptED Elite

| Field | Value |
|---|---|
| Name | AdaptED Activity Vault — Elite |
| Price | $197 |
| Product type | Digital product |
| Description | 1,500+ activities. All 3 brands. Printable cards. UnboxED (575 material ideas). Resource PDFs. Conversation starters. One-time payment. |

Enable license keys. Note slug + Product ID.

---

### Product 4: AdaptED School

| Field | Value |
|---|---|
| Name | AdaptED Activity Vault — School |
| Price | $497 |
| Product type | Digital product |
| Description | All 2,515 activities. All 3 brands. Everything included. 10 educator seats. One-time payment, lifetime access. |

Enable license keys. Note slug + Product ID.

---

### After creating all 4 products, you should have:

Fill this in as you go:

```
STARTER slug:      _______________    STARTER product ID:  _______________
PRO slug:          _______________    PRO product ID:      _______________
ELITE slug:        _______________    ELITE product ID:    _______________
SCHOOL slug:       _______________    SCHOOL product ID:   _______________
```

You also need your **Gumroad API key** for license verification:
1. gumroad.com → Settings → Advanced → Applications
2. "Generate API key" → copy it → write it here:

```
GUMROAD API KEY: _______________________________________________
```

---

## STEP 2 — Deploy the license verification API on Vercel

The API is in `api/verify.js`. This handles: user enters license key → dashboard calls Vercel → Vercel calls Gumroad → returns success/tier.

### 2a. Install Vercel CLI (if not installed)

Open Terminal on your computer and run:
```
npm install -g vercel
```

### 2b. Deploy

In Terminal, navigate to your project folder:
```
cd path/to/adapted-camped-unified-v8
vercel
```

Follow the prompts:
- Set up and deploy? → Y
- Which scope? → your personal account
- Link to existing project? → N
- Project name? → adapted-activity-vault (or whatever)
- Directory? → ./ (just press Enter)
- Override settings? → N

It will deploy. Copy the URL it gives you — looks like:
`https://adapted-activity-vault-xxxx.vercel.app`

Write it here:
```
VERCEL URL: _______________________________________________
```

### 2c. Add your environment variables

In Terminal (or at vercel.com → your project → Settings → Environment Variables):

```bash
vercel env add GR_API_KEY
# paste your Gumroad API key when prompted

vercel env add GR_ID_STARTER
# paste your STARTER product ID when prompted

vercel env add GR_ID_PRO
# paste your PRO product ID when prompted

vercel env add GR_ID_ELITE
# paste your ELITE product ID when prompted

vercel env add GR_ID_SCHOOL
# paste your SCHOOL product ID when prompted
```

Then redeploy to apply the env vars:
```
vercel --prod
```

### 2d. Test your API

Open your browser and visit:
```
https://YOUR-VERCEL-URL.vercel.app/api/verify
```

You should see: `{"error":"Method not allowed"}` — that means it's live and working.

---

## STEP 3 — Update the dashboard

Open `index.html` in any text editor. Find line ~10 (near the very top of the `<script>` tag):

```javascript
const API_URL = 'PASTE_YOUR_VERCEL_URL_HERE/api/verify';
```

Replace `PASTE_YOUR_VERCEL_URL_HERE` with your actual Vercel URL.

Example result:
```javascript
const API_URL = 'https://adapted-activity-vault-xxxx.vercel.app/api/verify';
```

Save the file.

---

## STEP 4 — Update the landing page

Open `landing.html` in any text editor. Find the config block near the top of the `<script>` tag:

```javascript
const GUMROAD = {
  starter: 'PASTE_STARTER_SLUG',
  pro:     'PASTE_PRO_SLUG',
  elite:   'PASTE_ELITE_SLUG',
  school:  'PASTE_SCHOOL_SLUG',
};
```

Replace each `PASTE_X_SLUG` with the actual slugs from Step 1.

Also search for `hello@adapted.example` and replace with your real contact email.

---

## STEP 5 — Deploy everything to Netlify

1. Go to app.netlify.com/drop
2. Drag your entire `adapted-camped-unified-v8` folder onto the page
3. Wait ~15 seconds for the URL
4. Open the URL on your iPhone — demo buttons work, all 3 brands work
5. Open the URL on desktop — landing page is at `/landing.html`

Copy your Netlify URL — this is what you put in your Gumroad product "Content" section:
```
NETLIFY URL: _______________________________________________
```

---

## STEP 6 — Wire up the Gumroad "Thank You" flow

For each of your 4 Gumroad products:

1. Edit the product → "Content" tab
2. In the content/download section, add a button or link pointing to your dashboard:
   `Your dashboard: https://YOUR-NETLIFY-URL.netlify.app`
3. The license key Gumroad emails the buyer is what they paste into the dashboard to unlock

---

## STEP 7 — Verify the full purchase flow end to end

Test it yourself:
1. Go to your landing page `/landing.html`
2. Click "Buy Starter" → should open Gumroad checkout
3. Complete purchase with a test card (Gumroad supports test mode)
4. Get the license key from the confirmation email
5. Go to your dashboard
6. Enter the license key → should unlock Starter tier

If it unlocks: you're live. Ship it.
If it doesn't: check the browser console for the error and send it to Claude.

---

## Checklist summary

```
[ ] 4 Gumroad products created with license keys enabled
[ ] All 4 product IDs noted
[ ] All 4 product slugs noted
[ ] Gumroad API key generated
[ ] Vercel CLI installed
[ ] api/verify.js deployed to Vercel
[ ] 5 environment variables set on Vercel
[ ] Vercel URL noted and pasted into dashboard index.html
[ ] Gumroad slugs pasted into landing page config block
[ ] Contact email updated in landing page
[ ] Both files redeployed to Netlify
[ ] Full purchase flow tested end to end
```
