# Customer reviews: form → sheet → website

One-time setup, ~10 minutes. No code involved — the site already reads the sheet.

## 1. Build the form

forms.google.com → blank form. Title it **Unity Motors — Your Review**.

Four questions, in this order. Only two need typing and one is optional — a
customer standing at the counter is done in about 25 seconds.

The site finds its columns by a keyword in the question text (shown in
**bold**), not by position, so you can reword around the keyword and reorder
the questions freely.

| # | Question | Type | Required |
|---|----------|------|----------|
| 1 | **Rating** out of 5 | Linear scale, 1–5 | yes |
| 2 | Your **review** | Paragraph | yes |
| 3 | Your **name** | Short answer | yes |
| 4 | Which **car or service** did we work on? | Dropdown | **no** |

Rating goes first on purpose: it is one tap, and someone who has tapped
something is far likelier to finish.

Question 4 is a **dropdown, not short answer** — tapping an option is faster
than typing, and it keeps the labels under the reviews on the website
consistent instead of twelve spellings of "ceramic". Options:

```
Detailing, wash or coating
Denting & painting
Engine work or ECU remap
Wrap, hydrodip or paint change
Suspension or exhaust
Bought a car from you
Something else
```

### Settings that decide whether people actually finish

Settings tab:

- **Collect email addresses: OFF.** This is the big one — leaving it on forces
  a Google login before they can type a word, and most people stop there.
- **Limit to 1 response: OFF.** Same problem, same reason.
- **Make questions required by default: OFF**, so question 4 stays optional.
- One page, no sections, no "shuffle question order".

Presentation tab → confirmation message: keep it one line, e.g.
*"Thank you — it means a lot to the team."*

Do not add questions you would not publish. Names and reviews go on the public
website; phone numbers and addresses must not.

## 2. Send responses to a sheet

Responses tab → the green Sheets icon → **Create a new spreadsheet**.

## 3. Add the Approved column

In that sheet, in the **first empty column to the right** of the last
question, type the header `Approved`.

Nothing appears on the website until you type `Yes` in this column for that
row. This is the moderation switch — the form is public, so anyone can submit
anything. **If this column is missing, no reviews are shown at all.**

Leave the cell blank to hide a review. Change `Yes` back to blank to pull one
down later.

## 4. Publish the sheet as CSV

In the sheet: **File → Share → Publish to web**.

- Left dropdown: the **Form Responses 1** tab (not "Entire document")
- Right dropdown: **Comma-separated values (.csv)**
- Publish → copy the URL it gives you

That URL ends in `output=csv`. It exposes only that tab, read-only. Customer
names and reviews are on it — they are going on the public website anyway, so
do not add any question you would not publish (no phone numbers, no addresses).

## 5. Point the site at it

In `.env.local` (and in the host's environment variables for production):

```
REVIEWS_CSV_URL=https://docs.google.com/spreadsheets/d/e/.../pub?gid=0&single=true&output=csv
NEXT_PUBLIC_REVIEW_FORM_URL=https://forms.gle/xxxxxxxx
```

The second one is the form's own share link. It puts a "Leave your review"
link under the section, and it is what the QR code points at.

Redeploy. New approved reviews appear within 5 minutes without a redeploy.

## 6. The QR code

Form → Send → the link icon → **Shorten URL** → copy.

Paste that link into any QR generator (qr-code-generator.com, or Chrome's
address-bar "Create QR Code"). Download as **PNG at 1000px or larger** so it
survives being printed. Print it on the handover card or stick it at the
counter.

Test it with a phone before printing a hundred of them.

## If reviews are not showing

1. Is `Approved` spelled exactly that, with `Yes` in the row?
2. Open `REVIEWS_CSV_URL` in a private browser window — it must download a
   CSV without asking you to log in. If it asks, step 4 did not take.
3. Wait 5 minutes, or redeploy.
