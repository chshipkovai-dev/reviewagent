# ReviewAgent (#003) — Чеклист

> AI агент отвечает на Google/Yelp отзывы для локального бизнеса (рестораны, салоны, фитнес)

**Цена:** $49/мес | **Аудитория:** локальный бизнес | **Build:** 2 недели
**MVP сайт:** https://reviewagent.vercel.app ✅ ЖИВОЙ
**GitHub:** https://github.com/chshipkovai-dev/reviewagent ✅

---

## Стратегия

**Боль:** 73% клиентов ожидают ответ на отзыв. Большинство владельцев никогда не отвечают → теряют рейтинг и клиентов. Агентства берут $200-500/мес за то же самое.

**Почему платят $49/мес:**
- Один новый клиент из-за хорошего рейтинга = $50-500 для ресторана
- Агентства берут в 4-10x дороже
- Владелец тратит 0 времени — агент делает всё сам

**MVP (без API):**
- Вводишь название бизнеса + тон (дружелюбный/профессиональный/формальный)
- Вставляешь отзывы → получаешь готовые ответы → копируешь в Google

**V2 (с API):**
- Подключаешь Google Business → агент мониторит и отвечает автоматически

---

## Фазы

### Фаза 1 — Валидация (до строительства)
- [ ] Найти 10 владельцев ресторанов/салонов в Facebook группах
- [ ] Спросить: "Отвечаете на Google отзывы? Сколько времени тратите?"
- [ ] Предложить бесплатный тест: они присылают отзывы, мы генерируем ответы вручную
- [ ] Если 3+ говорят "да, нужно" → строим MVP

### Фаза 2 — MVP ✅ ГОТОВО (16.03.2026)
- [x] Создать GitHub репо `reviewagent` → https://github.com/chshipkovai-dev/reviewagent
- [x] Скопировать структуру InvoicePilot (Next.js + Supabase Auth + Stripe)
- [x] Форма: название бизнеса, тип бизнеса, тон ответов (3 варианта)
- [x] Поле для вставки отзывов (до N штук за раз, динамически)
- [x] Claude Haiku → генерирует персонализированные ответы
- [x] Копировать ответы кнопкой
- [x] Stripe $49/мес + webhook
- [x] Деплой Vercel → https://reviewagent.vercel.app
- [x] Лендинг для неавторизованных (главная страница)
- [x] Login/Signup страница в стиле ReviewAgent (убрали InvoicePilot)
- [x] Upgrade страница ReviewAgent
- [ ] Добавить Stripe env vars в Vercel (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET)
- [ ] Настроить Stripe webhook endpoint
- [x] Добавить 7-дневный бесплатный триал — кнопка "Start free 7-day trial" + "Then $49/month"

### Фаза 2.5 — Дизайн Редизайн ✅ ГОТОВО (17.03.2026)
- [x] **globals.css** — переключить цветовую схему с золотой (InvoicePilot) на зелёную (ReviewAgent)
  - bg: #050C08, accent: #10B981, поверхности: #07100B / #0C1A11
  - удалены все золотые переменные (#F59E0B, rgba(245,158,11,...))
  - исправлены: .bg-glow, .card box-shadow, .tabs box-shadow, .tab.active, ::selection, .ring-card-ring
- [x] **login/page.tsx** — полный редизайн
  - Сплит-скрин: левая панель (55%) с живым демо, правая (45%) с формой
  - Левая: dot grid, ambient green glow, анимированные карточки отзывов (cycling: review → AI typing → response → "Replied ✓")
  - Правая: Sign In / Sign Up табы, email+password форма, централизована
  - Переключатель языков EN/RU/CS (localStorage `ra_lang`)
  - Переведён весь UI на 3 языка (заголовки, лейблы, кнопки, ошибки, статистика)
  - 👁 Show/hide пароль в полях
  - 🔒 Индикатор силы пароля при Sign Up (Weak/Fair/Strong)
  - email.trim().toLowerCase() перед отправкой в Supabase
  - Статистика внизу: 73% / 8 sec / $49 vs агентства
- [x] **reset-password/page.tsx** — исправлен брендинг
  - Был: InvoicePilot (✈ золото) → стал: ReviewAgent (⭐ зелёный)
  - Добавлен show/hide пароль + live проверка совпадения + индикатор силы
- [x] **page.tsx (лендинг)** — полноценный landing page
  - Nav: фиксированный хедер logo + Sign in
  - Hero: заголовок + product mockup (Google review → AI response → Copy button)
  - Stats strip: 4 числа (73% / 4.8× / $49 / 8 sec)
  - How it works: 3 шага
  - Testimonials: 3 отзыва владельцев бизнеса
  - Pricing: Pro план $49/мес, список фичей, гарантия
  - CTA banner + footer
  - Мобильная адаптация (breakpoint 900px)
- [x] **Auth flows** — все работают и протестированы
  - Sign Up → email verification (Supabase Confirm email включён)
  - Sign In → email + password
  - Forgot password → reset email → /reset-password
  - Session: при повторном заходе не нужно заново входить
- [x] **upgrade/page.tsx** — премиум редизайн (17.03.2026)
  - Заголовок: "Respond to every review. Keep every customer."
  - Pricing card: $49/мес + 7-day free trial badge
  - 6 фич с иконками
  - 3 testimonials от владельцев бизнеса
  - Trust badges: No charge for 7 days / Stripe / Cancel anytime

### Фаза 2.6 — Финальный полиш дизайна ✅ ГОТОВО (17.03.2026)
- [x] **globals.css** — убраны оставшиеся золотые rgba: .bg-glow, .card, .tabs, .tab.active, ::selection, .ring-card-ring
- [x] **page.tsx (лендинг)** — CTA кнопки "Start free today" → "Start free 7-day trial" (все 3 места)
- [x] **Nav** — убрана ссылка "How it works" (есть в hero), добавлен разделитель Pricing | Sign in
- [x] **page.tsx (приложение залогинен)** — полный premium редизайн (17.03.2026)
  - Layout: sticky header + sidebar 240px + main panel (max-width 1060px)
  - Header: логотип + счётчик "X responses generated" + кнопка Upgrade + Sign out
  - Sidebar: настройки бизнеса с авто-сохранением (blur/change), без кнопки "Save settings"
    + tone picker — вертикальные pill-кнопки с иконкой, названием и описанием
    + "✓ Saved" мигает 1.4 сек при каждом сохранении
    + Stats (total responses) появляется после первой генерации
  - Review slots: нумерованные (1-10), зелёная левая граница при фокусе, × удалить
  - Generate button: 50px, shimmer анимация, cycling текст во время генерации
    ("Reading your reviews…" → "Writing responses…" → "Almost done…")
  - Response cards: полоска "↩ Responding to" с превью отзыва + AI текст + ⎘ Copy + "Mark as replied" checkbox
  - Staggered entrance animation (каждая карточка с задержкой 90ms)
  - Empty state: dashed-border карточка с подсказкой
  - Responsive: single-column на мобильном < 768px

### Фаза 3 — Первые клиенты
- [ ] Facebook группы: "Restaurant Owners", "Salon Owners"
- [ ] Reddit: r/restaurantowners, r/smallbusiness
- [ ] Написать пост-историю (не рекламу)
- [ ] Цель: 5 платящих клиентов = $245 MRR

### Фаза 4 — Автоматизация (V2)
- [ ] Google Business Profile API интеграция
- [ ] Автоматический мониторинг новых отзывов
- [ ] Автоответы (или уведомление на апрув)
- [ ] Yelp API (опционально)

---

## Технический стек

| Компонент | Технология |
|-----------|-----------|
| Frontend | Next.js 15 + TypeScript (копия InvoicePilot) |
| Auth | Supabase email+password (magic link заменён 17.03.2026) |
| БД | Supabase (бизнесы, отзывы, настройки) |
| AI | Claude Haiku (генерация ответов) |
| Оплата | Stripe $49/мес |
| Хостинг | Vercel |

---

## Целевые метрики

| Метрика | Цель |
|---------|------|
| Клиентов для $1k MRR | 21 |
| Клиентов для $5k MRR | 102 |
| Недель до первых денег | 3-4 |
| Конверсия лендинг→платёж | 5% |

---

## Конкуренты

| Конкурент | Цена | Слабость |
|-----------|------|---------|
| Агентства репутации | $200-500/мес | Дорого, медленно |
| Birdeye | $299+/мес | Enterprise, дорого |
| Grade.us | $110+/мес | Нет AI-генерации |
| ChatGPT (ручной) | $20/мес | Нет автоматизации, нужно копировать |

**Наше преимущество:** AI + автоматизация + $49/мес

---

---

## Флоу после логина (что видит пользователь)

```
Лендинг (/) → Кнопка "Get started" → /login → Sign up/Sign in
    ↓
Главная страница (/) — авторизованный пользователь:
    1. "Your Business" — вводит название, тип (ресторан/салон/etc), тон
    2. "Paste your reviews" — вставляет 1-10 отзывов
    3. Нажимает "Generate responses"
    4. Claude Haiku → за 5-10 сек генерирует ответ на каждый отзыв
    5. Копирует ответ кнопкой "Copy" → вставляет в Google
    6. Save settings — сохраняет настройки бизнеса в localStorage
```

**Без Stripe ключей:** кнопка "Upgrade" есть, но Stripe не работает. Все фичи доступны.

---

## Где продавать (Фаза 3)

### Приоритет 1 — Reddit (бесплатно, высокая конверсия)
- r/restaurantowners — "How I stopped losing customers to unanswered reviews"
- r/smallbusiness — история про автоматизацию
- r/Entrepreneur — show HN стиль пост
- r/socialmediamarketing — про ответы на отзывы

### Приоритет 2 — Facebook группы (прямой контакт)
- "Restaurant Owners Network" (500k+)
- "Salon Suite Owners & Stylists" (300k+)
- "Small Business Owners Group"

### Приоритет 3 — Cold outreach (Google Maps)
- Найти рестораны/салоны с низким % ответов на отзывы
- Email: "Я заметил вы не отвечаете на отзывы — вот бесплатный тест"

### Формат поста (не реклама — история):
> "I built a tool that writes Google review responses in 10 seconds.
> Paste your review → get a ready-to-post reply → copy it to Google.
> It's $49/mo but saves you from losing customers to unanswered reviews."

---

## Что сделано в последних сессиях (17.03.2026)

**Сессия 1:**
- Ценовая стратегия: один план $49/мес, 7-дневный бесплатный триал (без тиров)
- globals.css: исправлена золотая тема → зелёная (#050C08 bg, #10B981 accent)
- upgrade/page.tsx: полный редизайн — заголовок + pricing card + триал + testimonials
- page.tsx (лендинг): полноценный 7-секционный лендинг + FAQ + Privacy/Terms страницы
- Удалены старые страницы: /login-b, /login-b2, /login-b3, /login-b4, /login-c, /dashboard
- Деплой: https://reviewagent.vercel.app ✅

**Сессия 2:**
- globals.css: убраны все оставшиеся золотые rgba (6 мест)
- Все CTA кнопки: "Start free today" → "Start free 7-day trial"
- Nav: убрана ссылка "How it works", добавлен разделитель перед Sign in
- page.tsx (залогинен): полный premium редизайн — sidebar layout, auto-save, cycling gen text, response cards с контекстом, Mark as replied, empty state
- Деплой: https://reviewagent.vercel.app ✅

## Что осталось сделать

- [x] FAQ секция на лендинге
- [x] /privacy и /terms страницы
- [x] Footer: Privacy / Terms / FAQ ссылки
- [x] App (залогинен): premium redesign — sidebar, auto-save, response cards
- [ ] **Купить домен** `reviewagent.app` или `getreviewagent.com` (~$10-15/год)
      → Обновить emails в `/privacy` и `/terms` (сейчас заглушки privacy@reviewagent.app)
      → Обновить NEXT_PUBLIC_APP_URL в Vercel
- [ ] Добавить Stripe env vars в Vercel (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_APP_URL)
- [ ] Настроить Stripe webhook endpoint → https://reviewagent.vercel.app/api/stripe/webhook
- [ ] Фаза 3: Reddit посты + Facebook группы (план в MARKETING.md)
- [ ] Создать аккаунты @reviewagent в Instagram + TikTok + YouTube
- [ ] Снять первые 3 образовательных видео (Loom + CapCut, без камеры)

*Создан: 16.03.2026 | Обновлён: 17.03.2026 | Статус: Дизайн ✅ Деплой ✅ → Следующее: Stripe + Фаза 3 продвижение*
