# 🚀 سناریوی دیپلوی و راه‌اندازی روی گیت‌هاب

<div dir="rtl">

## سناریو ۱ — ساده: یک ریپو برای سایت + داده (۵ دقیقه)

### ۱) ساخت ریپو و پوش

```bash
cd "/Users/atom/Documents/ریحانه"
gh auth login
gh repo create reyhane-diary --public --source=. --remote=origin --push
```

(اگر `gh` ندارید: روی github.com یک ریپوی خالی به نام `reyhane-diary` بسازید و بعد:)

```bash
git remote add origin https://github.com/<USERNAME>/reyhane-diary.git
git push -u origin main
```

### ۲) روشن کردن GitHub Pages

در ریپو: **Settings → Pages → Build and deployment → Source: «GitHub Actions»**.
ورک‌فلو `deploy.yml` خودش با هر پوش روی `main` سایت را منتشر می‌کند. بعد از ۱–۲ دقیقه آدرس سایت:

```
https://<USERNAME>.github.io/reyhane-diary/
```

(در تب **Actions** می‌توانید اجرای «Deploy to GitHub Pages» را ببینید.)

### ۳) ساخت توکن برای همگام‌سازی (دیتابیس گیت‌هاب)

1. GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**
2. Token name: `reyhane-diary`، Expiration: مثلاً ۱ سال
3. Repository access: **Only select repositories → reyhane-diary**
4. Permissions → Repository permissions → **Contents: Read and write**
5. Generate و توکن را کپی کنید (فقط یک‌بار نشان داده می‌شود).

### ۴) تنظیم اپ

در سایت → **تنظیمات → GitHub sync**:

| فیلد | مقدار |
|---|---|
| Owner | نام کاربری گیت‌هاب |
| Repository | `reyhane-diary` |
| Branch | `main` |
| File path | `data/diary.json` |
| Token | توکنی که ساختید |

«ذخیره‌ی تنظیمات» → «ارسال به گیت‌هاب». حالا فایل `data/diary.json` در ریپو به‌روز می‌شود و یک کپی تاریخ‌دار هم در `data/backups/` می‌افتد. تیک «ارسال خودکار بعد از هر ذخیره» را بزنید تا دیگر لازم نباشد دستی بفرستید.

### چرخه‌ی کامل

```
نوشتن خاطره → localStorage (فوری)
            → (autosync) PUT data/diary.json + data/backups/diary-YYYY-MM-DD.json
            → push روی main → Actions:
                 • backup.yml  → backups/diary-YYYY-MM-DD.json + backups/README.md
                 • deploy.yml  → سایت دوباره منتشر می‌شود (پوشه‌ی backups نادیده گرفته می‌شود)
دستگاه جدید → باز کردن سایت → پیشنهاد بازیابی از data/diary.json (یا «دریافت از گیت‌هاب»)
```

> ⚠️ در این سناریو ریپو عمومی است، پس `data/diary.json` (خاطرات) هم برای همه قابل خواندن است. اگر این را نمی‌خواهید، سناریوی ۲.

## سناریو ۲ — خصوصی: سایت عمومی، داده در ریپوی خصوصی

1. ریپوی `reyhane-diary` (عمومی) را مثل بالا برای سایت دیپلوی کنید، ولی `data/diary.json` را خالی نگه دارید (`"entries": []`).
2. یک ریپوی **خصوصی** بسازید: `reyhane-diary-data` (می‌تواند کاملاً خالی باشد، فقط یک README).
3. توکن fine-grained را فقط روی `reyhane-diary-data` با `Contents: Read and write` بسازید.
4. در اپ، Repository را `reyhane-diary-data` بگذارید. بقیه مثل قبل. اپ خودش فایل و پوشه‌ی backups را می‌سازد.
5. (اختیاری) فایل `.github/workflows/backup.yml` را هم در ریپوی داده کپی کنید تا کپی‌های هفتگی داشته باشد.

## سناریو ۳ — چند دستگاه (گوشی + لپ‌تاپ)

- روی هر دستگاه یک‌بار توکن را وارد کنید و «دریافت از گیت‌هاب» بزنید.
- ادغام بر اساس شناسه‌ی هر خاطره است و نسخه‌ی جدیدتر برنده می‌شود؛ پس روی هر دو دستگاه autosync روشن باشد و قبل از نوشتن یک «دریافت» بزنید.

## نصب به‌عنوان اپ (PWA)

- iPhone/iPad: Safari → Share → **Add to Home Screen**
- Android: Chrome → منو → **Install app**

## بازیابی اضطراری

| اتفاق | راه حل |
|---|---|
| مرورگر پاک شد | تنظیمات → «دریافت از گیت‌هاب» یا «بازیابی از فایل» |
| اشتباهی حذف شد | تا ۷ ثانیه دکمه‌ی «بازگردانی» در پایین صفحه؛ بعد از آن: تنظیمات → پشتیبان‌های خودکار → بازگردانی |
| فایل گیت‌هاب خراب شد | از `backups/diary-<تاریخ>.json` در ریپو دانلود و «بازیابی از فایل» |

## اجرای لوکال برای تست

```bash
cd "/Users/atom/Documents/ریحانه" && python3 -m http.server 8080
```

</div>
