# 🌸 レイハーネの日記 — دفترچه‌ی ریحانه

<div dir="rtl">

یک وب‌اپ کوچک، خوشگل و دخترانه با تم ژاپنی (کائوایی + کلی‌مورفیسم) تا ریحانه خاطرات روزانه‌اش را **به زبان ژاپنی** بنویسد؛ مثل یک وبلاگ شخصی. بدون سرور، بدون لاگین، همه چیز روی خودِ دستگاه ذخیره می‌شود و با یک کلیک به گیت‌هاب پشتیبان‌گیری می‌شود.

## ✨ امکانات

- **خانه:** سلامِ روز، تاریخ ژاپنی، آمار (روزهای پیاپی، تعداد خاطرات، حروف نوشته‌شده، واژه‌ها)، «موضوع امروز» برای ایده گرفتن، درختِ شکوفه که با هر خاطره رشد می‌کند، نشان‌ها (badge).
- **نوشتن:** تاریخ، عنوان، حال و هوا (۷ صورتک)، آب‌وهوا، برچسب، متن با شمارنده‌ی حروف، **پنل کمکی** با جدول هیراگانا/کاتاکانا، جمله‌های آماده، کائوموجی و استیکرهای ژاپنی. پیش‌نویس خودکار ذخیره می‌شود.
- **خاطرات:** نمای فهرست یا **تقویم**، جستجو، فیلتر مورد علاقه، خواندن با مُهر (判子) به اسم ریحانه، ویرایش، حذف با امکان «بازگردانی».
- **دفتر واژه‌ها:** واژه + تلفظ + معنی، و حالت **فلش‌کارت** برای تمرین.
- **تنظیمات:** نام، زبان رابط (日本語 / فارسی / English)، ۴ تم (ساکورا، ماچا، سورا، یوزورا/شب)، گلبرگ‌های در حال ریزش، پشتیبان‌گیری، همگام‌سازی گیت‌هاب.
- **PWA:** قابل نصب روی گوشی/تبلت، آفلاین هم کار می‌کند.
- دسترس‌پذیری: کنتراست مناسب، ناوبری با کیبورد، تاچ‌تارگت ≥۴۴px، احترام به `prefers-reduced-motion`.

## 💾 داده‌ها کجا ذخیره می‌شوند؟

سه لایه:

1. **localStorage مرورگر** (اصلی): کلید `reyhane.diary.v1`. هر روز قبل از اولین تغییر، یک **اسنپ‌شات خودکار** گرفته می‌شود (۵ تای آخر نگه داشته می‌شود) و از تنظیمات قابل بازگردانی است.
2. **فایل JSON:** از تنظیمات → «ذخیره در فایل». همان فایل با «بازیابی از فایل» برمی‌گردد (ادغام هوشمند؛ نسخه‌ی جدیدتر هر خاطره می‌ماند).
3. **گیت‌هاب به‌عنوان دیتابیس:** اپ با GitHub Contents API فایل `data/diary.json` را در ریپو می‌نویسد و هر بار یک کپی تاریخ‌دار هم در `data/backups/` می‌گذارد. ورک‌فلو `backup.yml` هم خودش هر بار که `data/diary.json` تغییر کند (و هر یکشنبه) یک کپی در پوشه‌ی `backups/` می‌سازد. گزینه‌ی «ارسال خودکار بعد از هر ذخیره» هم هست.

## 🚀 اجرا

- لوکال: کافی است `index.html` را باز کنید، یا بهتر:

```bash
python3 -m http.server 8080
```

و به `http://localhost:8080` بروید.

- آنلاین: راهنمای کامل در [DEPLOY.md](DEPLOY.md).

## 🗂 ساختار

```
index.html            صفحه‌ی اصلی (SPA با hash routing)
css/style.css         دیزاین‌سیستم کلی‌مورفیسم + ۴ تم
js/i18n.js            دیکشنری ۳ زبانه
js/icons.js           آیکون‌ها، صورتک‌ها، استیکرها، ماسکوت، درخت شکوفه (همه SVG)
js/store.js           لایه‌ی ذخیره‌سازی (localStorage، اسنپ‌شات، ایمپورت/اکسپورت/ادغام)
js/github.js          همگام‌سازی با GitHub Contents API
js/app.js             رابط کاربری و منطق صفحه‌ها
data/diary.json       «دیتابیس» در ریپو (اپ آن را می‌خواند و می‌نویسد)
backups/              کپی‌های تاریخ‌دار (توسط Actions)
.github/workflows/    deploy.yml (GitHub Pages) و backup.yml
manifest.webmanifest, sw.js, assets/   PWA
```

## 🔐 نکته‌ی امنیتی

توکن گیت‌هاب در localStorage همان مرورگر ذخیره می‌شود. از **Fine-grained token** فقط با دسترسی `Contents: Read and write` روی همان یک ریپو استفاده کنید و تاریخ انقضا بگذارید. اگر ریپو عمومی است، خاطرات هم عمومی می‌شوند؛ در [DEPLOY.md](DEPLOY.md) سناریوی «ریپوی خصوصی برای داده» توضیح داده شده.

</div>

---

## English

A kawaii, claymorphism-styled personal diary web app for Reyhane (age 11–12) to write her daily life **in Japanese**. No backend: everything lives in the browser's localStorage, with JSON export/import, daily auto-snapshots, and optional sync to a GitHub repository used as the database (with dated backup copies and a backup workflow). Installable PWA, works offline, UI in Japanese / Persian / English, four themes, accessible (contrast, keyboard, 44px targets, reduced-motion).

Run locally with `python3 -m http.server 8080`, deploy via GitHub Pages — see [DEPLOY.md](DEPLOY.md).
