# KursiCrypto - Real-Time Cryptocurrency Dashboard

KursiCrypto is a responsive real-time cryptocurrency dashboard built as a technical assignment for Kursi.ge.

The main goal of the project was to build a frontend-only application that consumes live market data from the Binance WebSocket API and
demonstrates real-time state management, WebSocket lifecycle handling, TypeScript, persistent user preferences, filtering/sorting, validation,
responsive UI, and reusable React components.

In addition to the required functionality, I implemented several optional bonus features, including a session price-history chart,
dark/light theme support, and an alert history log.

---

## 1. What Problem Does the Application Solve?

A cryptocurrency dashboard has to deal with data that changes continuously rather than with a static API response.

The main engineering challenge was therefore not simply displaying a price.
The application needed to:

- receive live prices without refreshing the page;
- keep the UI synchronized with incoming WebSocket messages;
- determine the direction of the latest price tick;
- remember the first price received during the current session;
- detect significant movement from that initial price;
- avoid repeatedly showing the same alert while a threshold remains
  exceeded;
- keep user preferences such as favorites and hidden currencies after
  refresh;
- provide useful search and sorting over changing data;
- handle connection, reconnection, loading and error states;
- clean up WebSocket resources correctly when the component is
  unmounted.

The implementation separates these responsibilities into dedicated hooks, components, types and configuration data rather than placing the
entire logic inside one page component.

---

# 2. Requirements Coverage

Live cryptocurrency rates Binance WebSocket ticker streams

At least 5 cryptocurrency pairs BTC/USDT, ETH/USDT, SOL/USDT, BNB/USDT, XRP/USDT

Automatic price updates React state updated from WebSocket messages

No page refresh Prices are updated directly from WebSocket events

Price direction Current tick is compared with the previous asset price

2% price alert First session price is stored and subsequent prices are compared against it

Duplicate alert prevention `useRef` tracks whether an asset has already crossed the threshold

Currency calculator Converts using the latest WebSocket prices

Currency swap Dedicated swap action

Input validation Invalid and negative values are rejected

Favorites and Hidden currencies Stored in `localStorage`

Search Name, symbol, base asset and current price

Sorting Name, price and 24h change, ascending/descending

WebSocket status Connected, Reconnecting, Disconnected and Error states

Automatic reconnect Reconnect attempt after 3 seconds

Cleanup WebSocket and reconnect timeout are cleaned up on unmount

Loading states Loading indicators before market data arrives

Empty states Empty favorites, hidden list and search results

Responsive UI Tailwind responsive layouts

TypeScript Domain types and strict null handling

Component architecture UI, hooks, data, types and page layers are separated

Error handling WebSocket parsing, connection and localStorage errors are handled

## Code quality tooling ESLint and TypeScript build checks

# 3. Bonus Features

The assignment included several optional features. I implemented:

### Session Price History Chart

The application stores a limited history of the latest WebSocket prices
for each asset and visualizes the session movement using Recharts.

The history is intentionally limited to the latest 20 ticks per asset
instead of growing indefinitely.

The chart also calculates a dynamic Y-axis range from the collected
session values so that small price movements remain visually
distinguishable.

### Dynamic Sparkline

Each asset row includes a lightweight SVG sparkline generated directly from the collected price history.

Instead of introducing another chart library for every row, the sparkline is generated
from SVG path coordinates.

### Dark / Light Theme

The application supports both light and dark themes.

The selected theme is persisted through the reusable `useLocalStorage` hook and applied to the root HTML element
using the Tailwind CSS v4 dark variant.

### Alert History

Triggered 2% alerts are also added to a notification history in the
header.

The history:

- keeps the latest 10 notifications;
- displays the percentage movement and direction;
- includes the time of the alert;
- tracks unread notifications;
- can be cleared by the user;
- opens in a responsive dropdown.

---

# 4. Architecture

The project follows a simple separation-of-concerns structure:

```text
src/
├── components/
│   ├── dashboard/
│   │   ├── AssetRow.tsx
│   │   ├── AssetsTable.tsx
│   │   ├── CurrencyCalculator.tsx
│   │   ├── MarketOverview.tsx
│   │   └── PriceAlerts.tsx
│   └── layout/
│       └── Header.tsx
├── data/
│   └── cryptoConfig.ts
├── hooks/
│   ├── useBinanceWebSocket.ts
│   └── useLocalStorage.ts
├── pages/
│   └── Home.tsx
├── types/
│   └── crypto.ts
├── App.tsx
├── index.css
└── main.tsx
```

# 5. WebSocket Architecture

The main real-time logic is isolated inside:

```text
src/hooks/useBinanceWebSocket.ts
```

The hook creates a combined Binance ticker stream for the configured assets.

The stream is constructed from the configured symbols:

```text
btcusdt@ticker
ethusdt@ticker
solusdt@ticker
bnbusdt@ticker
xrpusdt@ticker
```

This allows the application to receive live ticker information from Binance without polling.

For each message, the hook extracts:

```text
symbol
current price
24h percentage change
```

The incoming Binance values are converted into the application's `CryptoAsset` structure.

---

## Why a separate WebSocket hook?

The page should not need to know how a WebSocket is created, parsed or reconnected.

Instead:

```text
Binance WebSocket
       ↓
useBinanceWebSocket
       ↓
typed application state
       ↓
React components
```

This keeps the data source and connection lifecycle independent from the presentation layer.

---

# 6. WebSocket Lifecycle Management

The WebSocket hook explicitly handles four states:

```ts
"CONNECTED";
"RECONNECTING";
"DISCONNECTED";
"ERROR";
```

### Connection

When the hook is mounted, the WebSocket connection is created.

### Connected

`onopen` changes the state to `CONNECTED`.

### Message

Every valid message updates the corresponding asset without refreshing
the page.

### Error

`onerror` changes the connection state to `ERROR`.

### Unexpected disconnect

When `onclose` is triggered, the application marks the connection as
disconnected and schedules a new connection attempt after 3 seconds.

### Cleanup

The effect cleanup:

- prevents state updates after unmount;
- clears a pending reconnect timeout;
- closes the active WebSocket.

This is important because a real-time connection should not continue
running after the component that owns it has been removed.

---

# 7. Initial Price and 2% Alert Logic

One of the most important requirements was to compare every cryptocurrency against its
first received price after the session starts.

I store these values separately from the current prices:

```text
initialPrices
```

The first valid WebSocket price for an asset becomes its session baseline.

For every subsequent price:

```text
percentage change =
(current price - initial price) / initial price × 100
```

The absolute value is then compared with the 2% threshold.

For example:

```text
Initial BTC price: 84,000
Current BTC price: 85,680

Change:
(85,680 - 84,000) / 84,000 × 100
= +2%
```

If the absolute movement reaches 2% or more, an alert is generated.

Additionally, inside PriceAlerts.tsx you will find:

/_ UNCOMMENT THESE PARTS TO SEE HOW THESE NOTIFICATIONS WORK
Not to wait untill 2% changes, for technical interview Demo
_/

This test button was added to let you see exactly how the application tracks and displays notifications in real time,
without having to wait for an actual 2% price change.

---

## Preventing Duplicate Alerts

A cryptocurrency can remain above the 2% threshold for many WebSocket
updates.

Without additional logic, every incoming tick could generate another
notification.

To prevent this, the application uses:

```ts
useRef<Record<string, boolean>>;
```

The ref tracks whether the threshold has already been triggered for each
symbol.

The behavior is:

```text
Below threshold
      ↓
Crosses ±2%
      ↓
Create one alert
      ↓
Remain above threshold
      ↓
No duplicate alerts
      ↓
Returns below threshold
      ↓
Reset trigger
      ↓
Can trigger again later
```

This means the alert behaves as a threshold event rather than as a
notification on every WebSocket tick.

---

# 8. Currency Calculator

The calculator uses the latest prices already received from the
WebSocket.

For example, converting BTC to ETH is calculated through the common USDT
quote:

```text
amount × BTC/USDT price
-----------------------
       ETH/USDT price
```

For:

```text
0.5 BTC → ETH
```

the application first calculates the current USDT value of 0.5 BTC and
then divides it by the current ETH/USDT price.

Because the calculation reads the current asset state, the displayed
conversion updates automatically when the relevant WebSocket prices
change.

### Validation

The calculator prevents invalid values such as:

- negative numbers;
- non-numeric input;
- invalid decimal formats;
- calculations before the required market prices are available.

The component also supports swapping the source and target currencies.

---

# 9. Asset Configuration and API Data Separation

The Binance WebSocket payload provides market information such as:

```text
s → symbol
c → current price
P → 24h percentage change
```

It does not provide the complete UI information required by the
dashboard, such as:

- human-readable name;
- local icon path;
- base asset;
- quote asset.

Therefore, the application maintains a small static asset registry:

```text
src/data/cryptoConfig.ts
```

For example:

```ts
{
  symbol: "BTCUSDT",
  baseAsset: "BTC",
  quoteAsset: "USDT",
  name: "Bitcoin",
  icon: "/images/BTC.svg"
}
```

The WebSocket then enriches this configuration with live market values.

This avoids trying to derive display names or icons from symbols using
assumptions such as string slicing.

---

# 10. Search, Filtering and Sorting

`AssetsTable` contains the client-side presentation logic for the asset
collection.

The user can:

- search by cryptocurrency name;
- search by symbol;
- search by base asset;
- search by current price;
- display all visible assets;
- display favorites only;
- display hidden assets;
- sort by name;
- sort by price;
- sort by 24h change;
- switch ascending/descending order.

The resulting collection is calculated with `useMemo`.

The memoized pipeline is:

```text
Live assets
    ↓
Attach favorite/hidden state
    ↓
Apply tab filter
    ↓
Apply search filter
    ↓
Sort
    ↓
Render AssetRow components
```

This keeps the transformation logic in one place and avoids
recalculating the full filtering/sorting pipeline when unrelated
component state changes.

---

# 11. Favorites and Hidden Currencies

The application uses a reusable generic hook:

```text
useLocalStorage<T>
```

This hook:

1.  Reads an existing value from `localStorage`.
2.  Falls back to the provided initial value.
3.  Parses stored JSON.
4.  Saves changes back to `localStorage`.
5.  Handles storage errors without crashing the application.

It is used for both:

```text
crypto_favorites
crypto_hidden
```

Therefore, refreshing the page does not remove the user's favorites or
hidden currencies.

---

# 12. Real-Time Price Direction

The application distinguishes between two different concepts:

### Latest tick direction

The current price is compared against the previous received price:

```text
current > previous → up
current < previous → down
```

This drives the immediate `↑` / `↓` indicator.

### 24h market change

Binance also provides the 24-hour percentage change.

These values are intentionally kept separate because a cryptocurrency
can have a positive 24h change while its latest individual tick moves
downward.

This allows the UI to communicate both:

- short-term movement;
- broader 24-hour movement.

---

# 13. Theme System

The project uses Tailwind CSS v4 with custom theme tokens.

Brand colors are centralized in `index.css`

This keeps the main brand values in one place instead of scattering repeated values throughout components.

Dark mode is applied through the `dark` class on the root HTML element,
and the selected theme is persisted using `useLocalStorage`.

---

# 14. Notification System

The alert system has two layers.

### Immediate Toast

`PriceAlerts.tsx` displays a temporary notification in the bottom-right
corner.

The toast:

- animates into view;
- remains visible for a limited time;
- can be manually dismissed;
- automatically unmounts;
- supports positive and negative movement styling.

### Alert History

The parent application receives the alert and stores the latest 10
notifications.

The header then provides:

- unread counter;
- alert history dropdown;
- timestamps;
- clear-all action.

This separates the temporary UI notification from the
persistent-in-session notification history.

---

# 15. API Investigation with Postman

Before implementing the WebSocket integration, I used Postman to inspect and understand the Binance market-data API
and verify the structure of the available market information.
This helped establish the mapping between Binance's technical payload and the application's domain model.

---

# 16. Error Handling

The project handles errors at several levels.

### WebSocket

- connection errors are exposed through the connection status;
- invalid/unexpected messages are protected by JSON parsing and
  validation;
- disconnected sockets trigger automatic reconnection.

### Local Storage

`useLocalStorage` wraps reading and writing in `try/catch` blocks so
storage failures do not crash the application.

### UI Data

Components check for unavailable prices and assets before performing
calculations or rendering dependent data.

For example, the calculator does not perform a conversion until both
required market prices are available.

---

# 17. Project Structure

```text
crypto-exchange-dashboard/
├── public/
│   └── images/
│       ├── BNB.svg
│       ├── BTC.svg
│       ├── ETH.svg
│       ├── SOL.svg
│       ├── XRP.svg
│       └── logoIcon.svg
│
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── AssetRow.tsx
│   │   │   ├── AssetsTable.tsx
│   │   │   ├── CurrencyCalculator.tsx
│   │   │   ├── MarketOverview.tsx
│   │   │   └── PriceAlerts.tsx
│   │   └── layout/
│   │       └── Header.tsx
│   │
│   ├── data/
│   │   └── cryptoConfig.ts
│   │
│   ├── hooks/
│   │   ├── useBinanceWebSocket.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── pages/
│   │   └── Home.tsx
│   │
│   ├── types/
│   │   └── crypto.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── eslint.config.js
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# 18. Tech Stack

- **React**
- **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **Binance WebSocket API**
- **Recharts**
- **React Icons**
- **ESLint**

---

# 19. Running the Project

### Clone

```bash
git clone https://github.com/Lanssii/crypto-exchange-dashboard.git
cd crypto-exchange-dashboard
```

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

### Run ESLint

```bash
npm run lint
```

### Verify TypeScript and production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

No API key or environment variable is required for the Binance WebSocket
connection used by this project.

---

# 20. Future Improvements

Possible next steps for a larger production application would include:

- dynamic WebSocket subscription/unsubscription for user-selected pairs;
- configurable target-price alerts;
- authentication and server-side preference synchronization;
- automated unit tests with Vitest;
- broader API error/recovery handling;
- more extensive component and integration testing;
- additional market pairs loaded dynamically rather than from a static configuration.

---

Developed by **Lana Shotashvili** as a technical assignment for **Kursi.ge**.
