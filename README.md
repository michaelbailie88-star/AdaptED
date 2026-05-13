# AdaptED + CampED + TeenagED — Unified Activity Vault (v7)

**One product. One dashboard. Toggle between three brands: AdaptED (school & home), CampED (camp & summer), TeenagED (life-prep for ages 11–15).**

---

## 🆕 What's new in v7

- **TeenagED** — third brand module focused on adolescent life-prep. 10 categories: Chores & Home, Cooking & Meals, Health & Hygiene, Communication, Money & Jobs, Time Management, Social Skills, Volunteering, High School Prep, Transit & Driving. ~50 hand-curated activities (Laundry 101, Scrambled Eggs, First Resume, Saying No Politely, Pomodoro Study, etc.) bulked to 411 total. Ages 11-13 / 13-15 / 11-15 mixed.
- **3-position brand toggle** in the header — AdaptED · CampED · TeenagED. Sliding indicator animates between the 3. Each brand has its own theme: navy multi-color rainbow / forest green / deep purple-teal.
- **💬 Conversation Starters** — every activity now has an age- and brand-appropriate conversation prompt. Teen prompts pull on reflection ("What's something adults expect you to know but never explained?"), kid prompts are concrete ("What was tricky? What did you do?"), camp prompts focus on community ("Who really stepped up today?"). Visible in the activity modal as an italic Fraunces serif quote between Goal and Materials. Included in print view too.
- **"Mentor tip"** — TeenagED activities replace "Educator tip" / "Counselor tip" with brand-appropriate framing.

## 📊 Numbers

- **2,515 total activities** (1,085 AdaptED · 1,019 CampED · 411 TeenagED)
- **73 categories**, all healthy (10+ activities each, all ages covered)
- **~170 hand-curated** seeds, the rest bulk-generated with appropriate variants

## 📁 Files

```
adapted-camped-unified-v7/
├── index.html             ← single-file dashboard
├── _headers               ← Netlify cache control
├── api/verify.js          ← Gumroad license verification
├── vercel.json
├── package.json
└── resources/
    ├── scaffolding-extended.pdf
    ├── playlearn-detailed.pdf
    └── play-to-learn.pdf
```

## 🚀 Deploy

1. Drag the `adapted-camped-unified-v7` folder onto **app.netlify.com/drop**
2. Wait ~10 seconds for the random URL
3. Open on iPhone — buttons work, all 3 brand toggles work

For real Gumroad license verification, deploy `api/verify.js` separately to Vercel and update the `API_URL` constant in `index.html` (~line 432).

## 🎯 Tier model unchanged

| Tier | Price | Activities visible |
|---|---|---|
| Starter | $27 | 250 (mix of all 3 brands) |
| Pro | $97 | 750 |
| Elite | $197 | 1,500+ |
| School | $497 | All 2,500+ + 10 seats |

Demo keys: `DEMO-STR`, `DEMO-PRO`, `DEMO-ELT`, `DEMO-SCH`. Or tap the colored demo buttons. Or press 1/2/3/4 on keyboard. Or visit URL `?tier=pro`. Five redundant unlock paths.
