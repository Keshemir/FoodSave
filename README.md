# 🌱 FoodSave

Платформа для обмена едой между соседями в реальном времени. Пользователи могут публиковать объявления о еде, видеть их на карте и общаться через чат.

## Стек технологий

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, Leaflet (карта)
- **Backend**: Go (Gin), GORM, WebSocket
- **База данных**: PostgreSQL

---

## Требования

- [Go](https://go.dev/dl/) 1.21+
- [Node.js](https://nodejs.org/) 18+
- [PostgreSQL](https://www.postgresql.org/download/) 14+

---

## Настройка базы данных

Создайте пользователя и базу данных в PostgreSQL:

```sql
CREATE USER vapor_username WITH PASSWORD 'vapor_password';
CREATE DATABASE vapor_database OWNER vapor_username;
```

---

## Запуск Backend

```bash
cd backend
go mod download
go run main.go
```

Сервер запустится на `http://localhost:8080`.

### API Endpoints

| Метод | URL | Описание |
|-------|-----|----------|
| `POST` | `/users` | Создать пользователя |
| `POST` | `/offers` | Создать объявление |
| `GET` | `/offers` | Получить все объявления |
| `GET` | `/messages` | История сообщений |
| `GET` | `/ws/chat` | WebSocket чат |
| `GET` | `/health` | Проверка статуса сервера |

---

## Запуск Frontend

```bash
cd frontend
npm install
npm run dev
```

Приложение откроется на `http://localhost:3000`.

---

## Запуск всего проекта

Откройте два терминала:

**Терминал 1 — Backend:**
```bash
cd backend && go run main.go
```

**Терминал 2 — Frontend:**
```bash
cd frontend && npm install && npm run dev
```

Откройте браузер: [http://localhost:3000](http://localhost:3000)
