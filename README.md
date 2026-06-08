# 7solutions Frontend Assignment

## Project Overview

โปรเจคนี้ประกอบด้วย 2 ส่วน:

1. **Auto Delete Todo List** — React + TypeScript web application
2. **Department Summary API** — Express + TypeScript backend service

---

## Assignment 1: Auto Delete Todo List

### Tech Stack
- React 19 + TypeScript
- Vite (build tool)
- Vanilla CSS (design system with CSS custom properties)

### How to Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Features
- คลิก item ใน Main List → ย้ายไปยัง column ของ type (Fruit / Vegetable)
- Item จะอยู่ใน column 5 วินาที แล้ว auto กลับไป Main List
- คลิก item ใน column ขวา → กลับไป Main List ทันที
- Responsive design (mobile / tablet / desktop)

### Architecture
- **`useTodoList` hook** — จัดการ state ด้วย `useReducer` + timer management ด้วย `useRef`
- **Component structure** — แยก concerns ชัดเจน: `MainList`, `TypeColumn`, `ItemButton`
- **Immutable state** — ใช้ spread operator, ไม่ mutate state โดยตรง

---

## Assignment 2: Department Summary API

### Tech Stack
- Node.js + Express + TypeScript
- Vitest (testing)
- ESM modules

### How to Run

```bash
cd api

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

### API Endpoint

```
GET /api/users/department-summary
```

Response: Users grouped by department with male/female count, age range, hair color summary, and address mapping.

### Performance Optimizations
- **Single-pass O(n)** — transform ด้วย `reduce` loop เดียว
- **In-memory cache (TTL 5 min)** — ลด external API calls
- **Selective fields** — ใช้ `select` parameter ดึงเฉพาะ fields ที่จำเป็น

### Testing

```bash
cd api && npm test
```

8 unit tests ครอบคลุม:
- Empty input
- Single user
- Gender counting
- Age range calculation
- Hair color aggregation
- Address mapping
- Multi-department grouping
- Performance benchmark (1000 users < 50ms)
# 7-solutions-test-fe
