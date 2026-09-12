# 💌 Приглашение на свидание — мини веб-приложение !

Романтичное интерактивное приглашение на свидание: 5 красивых экранов с анимациями,
убегающая кнопка «Нет», конфетти, выбор даты/времени/места/еды и скрытая админ-панель
`/admin`, где видно все её ответы.

Стек: **React + Vite + Tailwind CSS + Framer Motion**. Ответы сохраняются через
**Supabase** (бесплатно, работает с любого устройства) или локально в **localStorage**,
если Supabase не подключён (удобно для быстрого теста).

---

## 1. Архитектура проекта

- Весь основной сценарий — это **wizard из 5 шагов**, состояние которого хранится в
  `localStorage` (`src/hooks/useDraft.js`), поэтому прогресс не теряется при обновлении
  страницы.
- Навигация между «страницей приглашения» и «админкой» сделана через **hash-роутинг**
  (`#/admin`) — это не требует особой настройки сервера ни на GitHub Pages, ни на Vercel.
- Все тексты, имя, варианты мест/еды и цвета вынесены в **`src/config/siteConfig.js`** —
  редактируешь один файл, и весь сайт меняется.
- Сохранение ответов абстрагировано в **`src/lib/storage.js`**: если в `.env` заданы ключи
  Supabase — данные летят в облако (и ты видишь их в `/admin` с любого устройства), если
  нет — используется `localStorage` конкретного браузера.
- Звуки сделаны через Web Audio API «на лету» (без аудиофайлов), поэтому ничего не сломается
  из-за битых ссылок.
- GIF на странице «Она сказала ДА» — опциональный: по умолчанию используется встроенная
  CSS/Framer Motion анимация, а свой GIF можно подключить одной строкой в конфиге.

## 2. Структура файлов

```
date-invite/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── src/
│   ├── main.jsx                 # точка входа
│   ├── App.jsx                  # роутинг + сборка wizard'а
│   ├── index.css                # Tailwind + глобальные стили
│   ├── config/
│   │   └── siteConfig.js        # ⭐ ВСЕ тексты, имя, места, еда, цвета
│   ├── lib/
│   │   ├── supabaseClient.js    # клиент Supabase (или null, если не настроен)
│   │   └── storage.js           # сохранение/чтение/удаление ответов
│   ├── hooks/
│   │   ├── useDraft.js          # прогресс анкеты в localStorage
│   │   └── useSound.js          # звуковые эффекты (Web Audio API)
│   ├── components/
│   │   ├── ProgressBar.jsx
│   │   ├── FloatingHearts.jsx
│   │   ├── SoundToggle.jsx
│   │   ├── RunawayButton.jsx    # убегающая кнопка «Нет»
│   │   └── ErrorBoundary.jsx
│   └── pages/
│       ├── InvitePage.jsx       # 1. Приглашение
│       ├── YesPage.jsx          # 2. Она сказала ДА
│       ├── DateTimePage.jsx     # 3. Дата и время
│       ├── PlacePage.jsx        # 4. Куда пойти / что есть
│       ├── FinalPage.jsx        # 5. Финал + отправка
│       └── AdminPage.jsx        # /admin — просмотр ответов
```

## 3. Установка и запуск локально

Нужен установленный [Node.js](https://nodejs.org/) (версия 18 или новее).

```bash
# 1. Перейди в папку проекта
cd date-invite

# 2. Установи зависимости
npm install

# 3. Запусти локальный сервер
npm run dev
```

Открой адрес, который покажет терминал (обычно `http://localhost:5173`).

Админ-панель будет доступна по адресу `http://localhost:5173/#/admin`.
Пароль по умолчанию: `change-me` (обязательно смени его, см. пункт 5).

## 4. Как открыть проект в VS Code

1. Открой VS Code.
2. `File → Open Folder…` → выбери папку `date-invite`.
3. Открой встроенный терминал (`` Ctrl+` `` или `Terminal → New Terminal`).
4. Выполни команды из раздела 3 выше.

## 5. Подключение Supabase (чтобы видеть её ответы с любого устройства)

Без этого шага сайт тоже работает, но ответы сохраняются только в браузере того, кто их
заполнял — то есть ты не увидишь их на своём устройстве. Чтобы получать её ответы на свой
телефон/компьютер, нужно подключить бесплатный Supabase.

1. Зарегистрируйся на [supabase.com](https://supabase.com) и создай новый проект.
2. В панели проекта открой **SQL Editor** и выполни:

   ```sql
   create table responses (
     id uuid primary key default gen_random_uuid(),
     agreed boolean default true,
     date date,
     time text,
     place text,
     place_custom text,
     food text[],
     food_custom text,
     submitted_at timestamptz default now()
   );

   alter table responses enable row level security;

   -- Разрешаем всем (в т.ч. анонимным пользователям сайта) вставлять и читать ответы.
   -- Это ок для такого мини-проекта, но не используй эту таблицу для чувствительных данных.
   create policy "Allow insert for everyone" on responses
     for insert to anon with check (true);

   create policy "Allow select for everyone" on responses
     for select to anon using (true);

   create policy "Allow delete for everyone" on responses
     for delete to anon using (true);
   ```

3. В настройках проекта открой **Settings → API** и скопируй:
   - `Project URL`
   - `anon public` ключ
4. В корне проекта скопируй `.env.example` в `.env`:

   ```bash
   cp .env.example .env
   ```

5. Заполни `.env`:

   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   VITE_ADMIN_PASSWORD=твой-секретный-пароль
   ```

6. Перезапусти `npm run dev` — теперь ответы будут сохраняться в Supabase, а `/admin`
   будет показывать их с любого устройства.

> ⚠️ Файл `.env` уже добавлен в `.gitignore` — никогда не коммить его и не публикуй ключи
> в открытом репозитории. При деплое (раздел 7-8) переменные добавляются через настройки
> хостинга, а не через файл в репозитории.

> Примечание про безопасность: пароль `/admin` — это простая защита на уровне клиента,
> её достаточно для личного мини-проекта, но не для чувствительных данных. Ключ Supabase
> `anon` создан специально для использования в браузере, это нормально.

## 6. Как создать GitHub-репозиторий и загрузить проект

1. Зайди на [github.com](https://github.com) → **New repository** → придумай имя,
   например `date-invite`.
2. В терминале, находясь в папке проекта:

   ```bash
   git init
   git add .
   git commit -m "Initial commit: date invite app"
   git branch -M main
   git remote add origin https://github.com/ТВОЙ-НИК/date-invite.git
   git push -u origin main
   ```

## 7. Деплой на Vercel (рекомендуется — проще всего)

1. Зайди на [vercel.com](https://vercel.com) и войди через GitHub.
2. **Add New → Project** → выбери свой репозиторий `date-invite`.
3. Vercel сам определит, что это Vite-проект (Framework Preset: Vite).
4. В разделе **Environment Variables** добавь те же переменные, что в `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_PASSWORD`
5. Нажми **Deploy**. Через минуту получишь ссылку вида `https://date-invite.vercel.app`.

## 8. Деплой на GitHub Pages (альтернатива)

1. Установи пакет для деплоя:

   ```bash
   npm install --save-dev gh-pages
   ```

2. В `package.json` добавь в `scripts`:

   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```

3. В `vite.config.js` раскомментируй и укажи имя репозитория:

   ```js
   base: '/date-invite/',
   ```

4. Так как GitHub Pages — статический хостинг без переменных окружения, **Supabase-ключи
   нужно "зашить" во время сборки**. Самый простой способ — создать `.env` локально
   (см. раздел 5) перед сборкой: значения из `.env` подставятся в собранный код при
   `npm run build`. (Помни: собранный `dist/` — это публичный код, ключ `anon` для этого
   безопасен, но никогда не клади туда секретные/service-ключи Supabase.)

5. Задеплой:

   ```bash
   npm run deploy
   ```

6. В настройках репозитория **Settings → Pages** выбери источник `gh-pages` branch
   (обычно `gh-pages` создаётся автоматически командой выше).
7. Сайт появится по адресу `https://ТВОЙ-НИК.github.io/date-invite/`.

Благодаря hash-роутингу (`#/admin`) никаких дополнительных настроек для GitHub Pages не
требуется — прямые ссылки на `/admin` без `#` работать не будут, только `.../#/admin`.

## 9. Как открыть `/admin`

Перейди по адресу твоего сайта с `#/admin` в конце, например:

```
https://date-invite.vercel.app/#/admin
```

Введи пароль (значение `VITE_ADMIN_PASSWORD`). Увидишь список всех ответов с возможностью
удаления.

## 10. Как изменить имя «Муниса» и тексты

Открой **`src/config/siteConfig.js`**. Там есть поле:

```js
girlName: 'Муниса',
```

Поменяй на любое другое имя — оно используется в заголовках. Все остальные тексты (вопросы,
подписи кнопок, финальные сообщения) лежат в объекте `texts` в этом же файле — меняй их
свободно, не трогая остальной код.

## 11. Как изменить варианты «куда пойти» и «что поесть»

Там же, в `siteConfig.js`, массивы `places` и `foods`:

```js
places: [
  { id: 'restaurant', emoji: '🍝', label: 'Ресторан' },
  // добавляй/удаляй свои варианты
],
```

`id` должен быть уникальным для каждого варианта.

## 12. Как поменять GIF/анимацию и дизайн

- **GIF:** положи файл в папку `public/` (например `public/celebration.gif`) и в
  `siteConfig.js` укажи:

  ```js
  celebrationGifUrl: '/celebration.gif',
  ```

  Если оставить `''`, останется встроенная CSS-анимация — она ничего не «сломает», если
  ссылка вдруг перестанет работать.

- **Цвета:** в `siteConfig.js` объект `colors` — задаёт градиент фона и акцентный цвет.
- **Более глубокий дизайн** (шрифты, радиусы, тени): смотри `tailwind.config.js` и
  `src/index.css`.

---

## Частые вопросы

**Можно ли обойтись совсем без Supabase?**
Да. Без него всё работает через `localStorage`, но ты увидишь ответы только в том же
браузере/устройстве, где она отвечала (например, если тестируешь сам на своём телефоне).
Для реального использования — когда она открывает ссылку на своём телефоне, а ты смотришь
ответы на своём — Supabase обязателен.

**Библиотека `canvas-confetti` — это не «тяжёлая» зависимость?**
Нет, она весит несколько килобайт и не тянет за собой других зависимостей — специально
выбрана вместо тяжёлых альтернатив.

**Как сбросить прогресс анкеты во время тестирования?**
Открой консоль разработчика на сайте и выполни `localStorage.clear()`, затем обнови
страницу.

Приятного свидания! ❤️
