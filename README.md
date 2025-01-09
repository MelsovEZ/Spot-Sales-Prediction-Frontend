# I&apos;M&apos;s Prediction Dashboard

This is a frontend dashboard for visualizing restaurant order predictions. It
provides analytics and insights into demand forecasts.

## Features

- Interactive dashboard with animations.
- View demand predictions for different areas and time ranges.
- Charts for category totals, order types, and daily demand.
- Authentication with credentials; only approved users can access the dashboard.
- First register, then approve it with prisma studio and voilà.

## Requirements

- Node.js 18+
- Libraries: `react`, `next.js`, `framer-motion`, `recharts`, `next-auth`

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/MelsovEZ/Spot-Sales-Prediction-Frontend.git
   cd Spot-Sales-Prediction-Frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the environment: Create a `.env` file and add:

   ```
   DATABASE_URL=
   NEXTAUTH_SECRET=
   ```

4. Run the application:

   ```bash
   npm run dev
   ```

5. Access the app at `http://localhost:3000`.

## Usage

- Select a time range (e.g., 1 day, 1 week).
- Browse data for different areas via tabs.
- View charts for categories and order types.
