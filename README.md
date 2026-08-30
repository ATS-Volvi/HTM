# LuxeStay — Hotel Operations & Guest Sync

A mobile web application for luxury hospitality, connecting the **Guest Experience Portal** and **Staff Operations Hub** with real-time state synchronization.

Based on the Google Stitch design project: **"Remix of Hotel Operations & Guest Sync"**.

---

## ✨ Features

### 🛎️ Guest Suite Portal (Suite 402)
- **Privacy Mode (DND)**: Real-time Do Not Disturb toggle synced with the hotel floor grid.
- **In-Room Dining**: Filterable luxury menu, dish customization, itemized room charge, and butler gratuity.
- **Live Butler Tracker**: 4-stage delivery tracking pipeline (*Received → Kitchen → Butler En Route → Delivered*).
- **Service Scheduler**: Daily room refresh, evening turndown, valet laundry, and luggage service.
- **Issue Reporting**: Rapid engineering dispatch with urgency tags and simulated photo attachments.

### 🛠️ Staff Operations Hub
- **Supervisor Room Grid**: Multi-floor room management (Floors 2, 3, 4, Penthouse 5) with status indicators (*Clean, Dirty, Inspected, DND, In Progress, VIP*).
- **Task Dispatch Queue**: Priority task queue with one-tap status advancement.
- **Maintenance Hub**: Real-time facility telemetry and repair sign-off.
- **Par Inventory Controller**: Real-time stock monitor with adjustment steppers and reorder alerts.
- **Team & Shifts**: Shift schedules, staff leaderboards, turnaround KPIs, and handover logs.

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev

# 3. Build for production
npm run build
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

---

## 📚 Detailed Documentation
For comprehensive notes on architecture, component design, state synchronization, and screen details, please read [NOTES.md](file:///c:/Users/swast/OneDrive/Desktop/HTM/HTM/NOTES.md).
