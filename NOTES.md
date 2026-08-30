# LuxeStay: Hotel Operations & Guest Sync — Project Notes & Reference

This document serves as the comprehensive reference and technical guide for the **LuxeStay Mobile Web Application**, built from the Google Stitch project **"Remix of Hotel Operations & Guest Sync"**.

---

## 📖 1. Overview & Concept

**LuxeStay** is a dual-perspective luxury hospitality application that synchronizes the **Guest Experience** with **Hotel Operations & Staff Dispatch**. It bridges the gap between high-end guest self-service (in-room dining, scheduling, privacy modes) and behind-the-scenes staff workflows (room grid, task queue, building telemetry, par inventory, shift handovers).

- **Brand Aesthetic**: "Modern Heritage" Luxury — Deep Navy (`#041627`), Rich Accents (`#1a2b3c`), Soft Champagne Gold (`#fed65b` / `#d4af37`), and Clean Off-White canvas (`#f9f9f9`).
- **Typography**: Editorial Serif (**Playfair Display**) for greetings and titles paired with clean geometric Sans-Serif (**Inter**) for data and operational controls.
- **Icons**: Google Material Symbols Outlined.
- **Form Factor**: Mobile-first responsive app with an integrated device frame toggle for desktop testing and fluid mobile responsiveness.

---

## 🏗️ 2. Project Architecture & File Structure

```
HTM/
├── index.html                  # HTML container with Google Fonts & meta configuration
├── package.json                # Dependencies (Vite, Canvas-Confetti)
├── .gitignore                  # Excluded directories (node_modules, dist)
├── README.md                   # Quickstart documentation
├── NOTES.md                    # Detailed architectural notes (this file)
└── src/
    ├── main.js                 # App router, viewport frame controls & lifecycle bootstrap
    ├── state/
    │   └── store.js            # Central reactive state engine & localStorage persistence
    ├── styles/
    │   └── main.css            # LuxeStay luxury design tokens, animations & components
    ├── components/
    │   ├── Header.js           # 3-column top header with mode switcher (Guest ⇄ Staff)
    │   ├── BottomNav.js        # Dynamic bottom navigation bar tailored per active role
    │   ├── ModalSheet.js       # Glassmorphic bottom sheets (room actions, dish customization)
    │   └── Toast.js            # Ambient toast feedback system
    └── views/
        ├── guest/
        │   ├── GuestHomeView.js        # Suite 402 home, DND toggle, active orders & bento tiles
        │   ├── DiningMenuView.js       # Filterable gastronomy menu & floating cart
        │   ├── CheckoutView.js         # Itemized cart, room charge & gratuity calculator
        │   ├── OrderTrackingView.js    # 4-stage live butler delivery timeline & contact card
        │   ├── ScheduleServiceView.js  # Housekeeping, turndown & valet time-slot booking
        │   ├── ReportIssueView.js      # Maintenance ticketing with simulated photo upload
        │   └── GuestRequestsView.js    # Consolidated view of active & historical requests
        └── staff/
            ├── SupervisorRoomGridView.js # Multi-floor room status grid & quick turnover actions
            ├── TaskQueueView.js          # Operations task queue with priority filters
            ├── MaintenanceView.js        # Facility telemetry & repair work orders
            ├── InventoryView.js          # Par stock inventory monitor & adjustment steppers
            └── ShiftScheduleView.js      # On-duty roster, staff KPIs & shift handover logs
```

---

## 🛎️ 3. Guest Experience Module

### 3.1 Suite 402 Home (`GuestHomeView.js`)
- **Guest Identity**: Tailored for **Mr. James Harrison** (Platinum Elite VIP).
- **Privacy Mode (Do Not Disturb)**:
  - Interactive toggle switch.
  - Toggling ON changes door lock state and turns Room 402 orange/DND on the supervisor's grid in real time.
- **Active Service Overview**: Shows upcoming suite refresh at 11:00 AM with reschedule options.
- **Bento Quick Actions**: Direct entry points to In-Room Dining, Housekeeping, and Valet Laundry.
- **Dedicated Butler Hotline**: One-tap action to contact Head Butler Pierre Dubois.

### 3.2 In-Room Dining & Cart (`DiningMenuView.js`, `CheckoutView.js`)
- **Categories**: *Breakfast, Mains, Desserts, Cellar Beverages*.
- **Features**: Real-time calorie counts, preparation time estimates, signature dish tags.
- **Customization**: Bottom modal sheet to enter dietary requests (e.g. dressing on the side, gluten-free) and quantity steppers.
- **Sticky Cart Bar**: Displays total items and subtotal when cart is active.
- **Room Charge Checkout**:
  - Gratuity options: $5, $10, $15, $20.
  - 18% hospitality service fee calculation.
  - Direct billing to Suite 402 with confetti animation.

### 3.3 Live Butler Order Tracking (`OrderTrackingView.js`)
- **4-Stage Stepper**:
  1. *Order Received* (timestamped)
  2. *Chef Preparation* (cloche cover heating)
  3. *Butler En Route* (elevator transit)
  4. *Delivered & Served* (in-suite table presentation)
- **Simulation Controls**: "Simulate Next Step" button to advance pipeline.
- **Server Card**: Butler profile with call and message simulation.

### 3.4 Service Booking & Issue Reporting (`ScheduleServiceView.js`, `ReportIssueView.js`)
- **Concierge Scheduling**: Daily suite refresh, evening turndown, plush Egyptian cotton towels, valet pressing, luggage assistance.
- **Engineering Dispatch**: Air conditioning/climate, plumbing, smart TV/Wi-Fi, lighting, and spot cleaning with urgency tags (*Urgent, High, Normal*) and photo attachment.

---

## 🛠️ 4. Staff Operations Command Center

### 4.1 Supervisor Room Grid (`SupervisorRoomGridView.js`)
- **Multi-Floor Coverage**: Floors 2, 3, 4, and Penthouse Floor 5.
- **Status Pills**:
  - `Clean` (Forest green `#1b5e20`)
  - `Inspected` (Navy blue `#0d47a1`)
  - `Dirty` (Crimson `#c62828`)
  - `DND` (Amber orange `#e65100`)
  - `In Progress` (Purple `#6a1b9a`)
  - `VIP` (Gold badge `#795548`)
- **Interactive Sheet**: Tap any room card to open the inspection sheet, reassign housekeepers, or update room status.

### 4.2 Task Dispatch Queue (`TaskQueueView.js`)
- **Priority Categorization**: Urgent, High, Normal.
- **One-Tap Workflow**: `Start Task` → `In Progress` → `✓ Complete & Sign Off`.
- **Automatic Task Injection**: Ordering food as a guest automatically injects an urgent dining delivery task into the staff task queue.

### 4.3 Maintenance Telemetry (`MaintenanceView.js`)
- **Live Diagnostics**:
  - Chiller & HVAC loop (21.4°C / 48% RH)
  - Domestic water pumps (5.2 Bar Flow)
  - Wi-Fi Access Points (64/64 Online)
  - Smart Lock battery telemetry

### 4.4 Par Stock Inventory Control (`InventoryView.js`)
- **Stock Categories**: Linens (Egyptian Cotton 800 GSM towels, goose feather pillows), Amenities (Acqua Di Parma shower gels, Diptyque soaps, lavender mist), Minibar (San Pellegrino).
- **Automated Thresholds**: *Optimal*, *Low Stock*, *Critical*, *Out of Stock*.
- **Quick Adjustment**: `-5`, `-1`, `+1`, `+10` adjustment steppers.
- **PO Generation**: Simulated reorder generation for supplies.

### 4.5 Team Roster, KPIs & Handover (`ShiftScheduleView.js`)
- **Leaderboards**: Staff turnaround speed (24 min avg), 5-star quality score (99.2% pass rate), active room counts.
- **Shift Briefings**: Morning/evening handover log archive with supervisor notes.

---

## 👔 5. Executive General Manager & Admin Portal

The **Manager Portal** provides executive-level oversight and administrative control over hotel operations:

### 5.1 Overview & Intelligent Auto-Assign Engine
- **Executive KPIs**:
  - Real-time occupancy rate (e.g. 94%, 17/18 active suites).
  - In-Room Gastronomy daily revenue ($3,420.50).
  - Turnover queue counter (dirty departure rooms awaiting assignment).
  - Open service escalation tickets.
- **Intelligent Auto-Assign Algorithm**:
  - One-click engine distributes all unassigned dirty departure rooms evenly across on-duty housekeepers based on floor proximity, VIP prioritization, and current workload capacity.
  - Automatically generates turnover tasks in the staff task queue and updates room status to *In Progress*.

### 5.2 Staff Allocation & Workload Monitor
- **Roster Overview**: Tracks active rooms vs maximum capacity for each on-duty housekeeper and butler.
- **Visual Workload Bars**: Colored indicators (*Green: Available, Amber: Approaching Par, Red: At Capacity*).
- **Manual Assignment**: One-click staff reassignment per zone and floor.

### 5.3 Menu & Gastronomy Editor
- **Live Menu Management**:
  - Add new gourmet dishes with prices, categories, and signature tags.
  - Quick toggle between **In Stock** and **Sold Out** status.
  - Real-time price and description editor synced with the guest in-room dining portal.

### 5.4 Guest Complaints & Escalations Center
- **Grievance Triage**: Categorized by severity (*High, Moderate, Low*) across all suites.
- **Direct Guest Contact**: One-tap executive concierge line dialing.
- **Resolution & Compensation Perk Assigner**:
  - Mark issues as resolved with official manager log notes.
  - Grant apology perks (e.g. *Complimentary Champagne Setup, $50 Dining Credit, Late Checkout, Spa Vouchers*).

---

## 🔄 6. State Management & Synchronization

The app uses a unified reactive pub/sub store (`src/state/store.js`):
1. **LocalStorage Persistence**: Maintains state across page reloads under `luxestay_hotel_sync_state_v1`.
2. **Cross-Role Reactivity**:
   - Toggling **Privacy Mode (DND)** in the Guest View instantly updates **Room 402** on the Supervisor Room Grid.
   - Placing an **In-Room Dining Order** in the Guest View creates an active ticket in the **Staff Task Queue**.
   - Completing a task in Staff Ops immediately syncs with the guest's active request status.

---

## 🚀 6. Developer Commands

| Command | Description |
|---|---|
| `npm install` | Installs project dependencies (`vite`, `canvas-confetti`) |
| `npm run dev` | Launches local development server on `http://localhost:5173/` |
| `npm run build` | Compiles optimized production bundle into `/dist` |
| `npm run preview` | Previews the production build locally |

---

## 📱 7. Responsive Preview Controls

A floating top pill in the workspace header allows switching between:
- **Mobile Frame**: iPhone-style viewport with status bar and notch.
- **Fluid View**: Fullscreen edge-to-edge layout for mobile device testing.
