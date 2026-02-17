# Sealed Landing Page - Waitlist Setup

## ✅ Integration Complete

Your waitlist is now powered by a local SQLite backend.

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Open `.env.local` and set the database path (optional):

```env
WAITLIST_DB_PATH=./data/waitlist.sqlite
```

If omitted, the app defaults to `./data/waitlist.sqlite`.

### 3. Test It Out

```bash
npm run dev
```

Visit `http://localhost:3000` and submit an email. You should see:

- "Joining..." while submitting
- "🎉 You're on the list!" on success
- The email is saved in your SQLite database

## 📊 Managing Your Waitlist Data

Stored emails live in the `waitlist_subscribers` table.

Columns:

- `id`
- `email` (unique)
- `created_at`

### Export & Migrate Later:

When ready to migrate to another database:

1. Read rows from `waitlist_subscribers`
2. Export to CSV or JSON
3. Import into your destination database

## 🔥 Features Added

- ✅ Form validation
- ✅ Loading states ("Joining...")
- ✅ Success messages
- ✅ Error handling
- ✅ Disabled button during submission
- ✅ Email validation
- ✅ Ready for production

## 🚢 Deploying

When deploying:

1. Persist your SQLite file storage (or mount a volume)
2. Optionally set `WAITLIST_DB_PATH`
3. Deploy!

That's it! Your waitlist is live. 🎉
