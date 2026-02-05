# Football Career Manager - Mobile App Design

## Design Philosophy

**Target:** Android mobile app optimized for portrait orientation (9:16) and one-handed usage
**Style:** Clean, intuitive touch interface inspired by iOS Human Interface Guidelines
**Session Design:** Playable in 5-10 minute sessions with quick save/auto-save functionality
**Performance:** Lightweight, minimal battery drain, offline-first gameplay

---

## Screen List & Navigation Structure

### Main Navigation Hierarchy

```
App Entry
├── Main Menu (Mode Selection)
│   ├── Manager Career Mode
│   ├── Player Career Mode
│   ├── Sporting Director Mode
│   └── Create-a-Club Mode
├── Game Screens (Mode-Specific)
├── Settings & Preferences
└── Career Management (Load/Save/Delete)
```

### Core Screens by Mode

#### **Manager Career Mode Screens**
1. **Manager Dashboard** - Overview of current season, upcoming matches, key alerts
2. **Squad Management** - Player roster, stats, positions, contracts
3. **Transfer Market** - Buy/sell players, scout network, contract negotiations
4. **Match Preparation** - Formation setup, tactical instructions, player roles
5. **Match Simulation** - Live match view with in-match adjustments
6. **Post-Match Analysis** - Results, player ratings, manager feedback
7. **Youth Academy** - Develop young talent, track prospects
8. **Financial Dashboard** - Budget, wages, sponsorship, revenue
9. **Season Objectives** - Board expectations, progress tracking
10. **Career Progression** - Manager reputation, job offers, club history

#### **Player Career Mode Screens**
1. **Player Profile** - Personal stats, attributes, appearance customization
2. **Career Overview** - Current club, position, contract, goals
3. **Training Sessions** - Improve specific attributes, skill development
4. **Match Performance** - Position-specific objectives, in-match focus
5. **Post-Match Feedback** - Player rating, manager comments, form tracking
6. **Contract Negotiations** - Salary, length, bonuses, transfer requests
7. **National Team** - International call-ups, caps, achievements
8. **Awards & Achievements** - Personal milestones, trophies, records
9. **Media Interactions** - Reputation management, interview responses
10. **Career Milestones** - Debut, 100 games, 100 goals, retirement planning

#### **Sporting Director Mode Screens**
1. **Executive Dashboard** - Club overview, strategic metrics, key decisions
2. **Transfer Strategy** - Identify targets, negotiate deals, manage transfers
3. **Scouting Network** - Global scout management, player discovery, reports
4. **Staff Management** - Hire manager, coaches, scouts, medical staff
5. **Facility Upgrades** - Training ground, stadium, medical facilities
6. **Financial Planning** - Budget allocation, sponsorship deals, revenue
7. **Youth Academy Oversight** - Investment, development, recruitment strategy
8. **Manager Relations** - Requests, conflicts, performance reviews
9. **Club Vision** - 3-5 year strategy, rebuild vs win-now decisions
10. **Board Relations** - Reporting, expectations, strategic planning

#### **Create-a-Club Mode Screens**
1. **Club Creation** - Name, nickname, colors, badge/crest, stadium
2. **Starting Configuration** - League selection, budget, initial squad
3. **Role Selection** - Choose Manager, Player, or Sporting Director role
4. **Squad Building** - Assemble initial team within budget
5. **Club Development** - Stadium expansion, facilities, reputation growth
6. **Long-term Planning** - Upgrade progression, rivalry development, history

#### **Shared/System Screens**
1. **Main Menu** - Mode selection, career management, settings
2. **Career Management** - Load/save/delete career saves, backup management
3. **Settings** - Dark mode toggle, audio settings, notifications, difficulty
4. **Pause Menu** - In-game pause, quick save, resume, return to menu
5. **Match Calendar** - Upcoming fixtures, competition schedule, deadlines

---

## Primary Content & Functionality by Screen

### Manager Dashboard
- **Content:** Season overview, next match fixture, key alerts, recent results
- **Functionality:** Quick access to squad, transfers, match prep; tap to navigate
- **Layout:** Cards showing upcoming match, league position, budget status, player alerts
- **Key Actions:** Prepare for match, view squad, check transfers, manage finances

### Squad Management
- **Content:** Full roster with player cards (name, position, rating, form, injury status)
- **Functionality:** Tap player for details, compare stats, manage contracts, set training focus
- **Layout:** Scrollable list grouped by position; swipe for quick actions (train, sell, loan)
- **Key Actions:** View player details, train player, negotiate contract, list for transfer

### Transfer Market
- **Content:** Available players, asking prices, player attributes, scout reports
- **Functionality:** Search/filter by position/rating, make offers, negotiate contracts
- **Layout:** Searchable list with player cards; tap for detailed negotiation screen
- **Key Actions:** Make offer, negotiate salary, complete transfer, add to watchlist

### Match Preparation
- **Content:** Formation selector, player positions, tactical instructions, opposition preview
- **Functionality:** Drag-and-drop formation setup, set player instructions, view opposition
- **Layout:** Visual formation grid with player slots; instruction cards below
- **Key Actions:** Select formation, assign players, set instructions, view opposition

### Match Simulation
- **Content:** Live match view, current score, time, key events, substitution options
- **Functionality:** Make substitutions, change tactics, view player performance in real-time
- **Layout:** Match scoreboard at top, event log in middle, action buttons at bottom
- **Key Actions:** Make substitution, change formation, tactical adjustment, view stats

### Post-Match Analysis
- **Content:** Final score, player ratings, match statistics, manager feedback
- **Functionality:** Review player performance, identify improvements, save highlights
- **Layout:** Score summary, player rating cards, detailed stats tabs
- **Key Actions:** View player ratings, see detailed stats, return to dashboard

### Youth Academy
- **Content:** Young players, development progress, potential ratings, training plans
- **Functionality:** Assign training focus, promote to senior squad, track development
- **Layout:** Player cards showing age, current rating, potential, development status
- **Key Actions:** Promote player, assign training, view development path

### Financial Dashboard
- **Content:** Budget balance, wage structure, sponsorship revenue, expenses
- **Functionality:** View budget allocation, set wage budgets, negotiate sponsorships
- **Layout:** Balance summary, expense breakdown, revenue sources, budget allocation sliders
- **Key Actions:** Allocate budget, negotiate sponsorship, view financial forecast

### Player Profile (Player Mode)
- **Content:** Name, position, attributes (pace, shooting, passing, etc.), appearance
- **Functionality:** Customize appearance, view attribute breakdown, set development focus
- **Layout:** Player avatar, attribute bars, customization options
- **Key Actions:** Customize appearance, view attributes, set training focus

### Career Overview (Player Mode)
- **Content:** Current club, position, contract details, career goals, form
- **Functionality:** View contract, request transfer, set career goals, track progress
- **Layout:** Club info, contract card, career goals list, performance graph
- **Key Actions:** Request transfer, negotiate contract, view club info

### Training Sessions (Player Mode)
- **Content:** Available training types, attribute improvement rates, focus areas
- **Functionality:** Select training focus, complete session, track improvement
- **Layout:** Training options with improvement previews, current attribute levels
- **Key Actions:** Select training focus, complete training, view improvement

### Match Performance (Player Mode)
- **Content:** Position-specific objectives, player involvement, performance metrics
- **Functionality:** Track objectives during match, monitor performance, earn ratings
- **Layout:** Objective cards, live performance stats, match event log
- **Key Actions:** View objectives, track performance, complete match

### Executive Dashboard (SD Mode)
- **Content:** Club strategic metrics, transfer activity, staff performance, financial health
- **Functionality:** Quick access to key management areas, view strategic overview
- **Layout:** Strategic cards, key metrics, quick action buttons
- **Key Actions:** Manage transfers, staff, facilities, finances

### Transfer Strategy (SD Mode)
- **Content:** Target list, ongoing negotiations, completed transfers, market analysis
- **Functionality:** Identify targets, negotiate deals, manage multiple transfers
- **Layout:** Transfer pipeline view, negotiation cards, market analysis
- **Key Actions:** Make offer, negotiate, complete transfer, analyze market

### Club Creation (Create-a-Club)
- **Content:** Club customization form (name, colors, badge, stadium, location)
- **Functionality:** Customize all club details, preview appearance, select starting options
- **Layout:** Form fields with live preview, color picker, badge designer
- **Key Actions:** Customize club, select league, set budget, create squad

---

## Key User Flows

### Manager Career - Complete Match Day Flow
1. **Manager Dashboard** → View upcoming match
2. **Match Preparation** → Select formation, assign players, set tactics
3. **Match Simulation** → Watch match unfold, make in-game adjustments
4. **Post-Match Analysis** → Review player performance, identify improvements
5. **Return to Dashboard** → Plan next actions (transfers, training, finances)

### Player Career - Training & Development Flow
1. **Career Overview** → Check current form and contract
2. **Training Sessions** → Select attribute to improve, complete training
3. **Match Performance** → Play match with position-specific objectives
4. **Post-Match Feedback** → Receive manager feedback, track improvement
5. **Career Progression** → Monitor overall rating growth, track milestones

### Sporting Director - Transfer Negotiation Flow
1. **Executive Dashboard** → View club needs and budget
2. **Transfer Strategy** → Identify target player, initiate negotiation
3. **Scouting Network** → Get scout report on player, assess value
4. **Negotiation Screen** → Negotiate salary, contract length, bonuses
5. **Complete Transfer** → Finalize deal, announce signing

### Create-a-Club - Foundation Building Flow
1. **Club Creation** → Customize club identity (name, colors, badge, stadium)
2. **Starting Configuration** → Select league tier, initial budget, role
3. **Squad Building** → Assemble initial team within budget constraints
4. **Club Development** → Begin gameplay, grow club through success

---

## Color Scheme & Branding

### Primary Color Palette
- **Primary Accent:** `#0a7ea4` (Professional blue - trust, authority)
- **Background:** Light: `#ffffff` | Dark: `#151718`
- **Surface:** Light: `#f5f5f5` | Dark: `#1e2022`
- **Text Primary:** Light: `#11181C` | Dark: `#ECEDEE`
- **Text Secondary:** Light: `#687076` | Dark: `#9BA1A6`
- **Border:** Light: `#E5E7EB` | Dark: `#334155`

### Semantic Colors
- **Success:** `#22C55E` (Green - positive outcomes, wins)
- **Warning:** `#F59E0B` (Amber - cautions, injuries, alerts)
- **Error:** `#EF4444` (Red - losses, critical issues)

### Game-Specific Colors
- **Formation Grid:** Subtle background with player position indicators
- **Player Form:** Green (excellent) → Yellow (average) → Red (poor)
- **Match Events:** Goal (gold), Card (red/yellow), Injury (orange), Substitution (blue)

---

## Layout Specifications

### Safe Area & Orientation
- **Orientation:** Portrait only (9:16 aspect ratio)
- **Safe Area:** Top (status bar + notch), Bottom (home indicator)
- **Tab Bar:** Fixed at bottom with 4-5 main navigation items
- **Header:** Minimal header with back button, title, and action buttons

### Component Spacing
- **Padding:** 16px standard screen padding, 12px card padding
- **Gap:** 12px between elements, 16px between sections
- **Card Radius:** 12px border radius for cards and buttons
- **Touch Target:** Minimum 44px height for interactive elements

### Typography
- **Headlines:** 24-28px, font-weight 700 (bold)
- **Subheadings:** 18-20px, font-weight 600 (semibold)
- **Body Text:** 14-16px, font-weight 400 (regular)
- **Small Text:** 12-13px, font-weight 400 (regular)
- **Line Height:** 1.4-1.6x font size for readability

### List & Card Design
- **List Items:** Full-width, 60-80px height, 16px padding
- **Cards:** Rounded corners, subtle shadow, 12px padding
- **Dividers:** 1px border with muted color
- **Empty States:** Centered icon, headline, description, action button

---

## Mobile-Specific Interactions

### Touch Feedback
- **Buttons:** Scale 0.97 on press + light haptic feedback
- **List Items:** Opacity 0.7 on press
- **Cards:** Subtle shadow increase on press
- **Swipe Actions:** Reveal quick actions (train, sell, loan) on swipe

### Navigation Patterns
- **Bottom Tab Bar:** 4-5 main sections (Dashboard, Squad, Transfers, Finances, Settings)
- **Stack Navigation:** Back button in header, swipe-back gesture on iOS
- **Modal Sheets:** Bottom sheet for forms, negotiations, quick actions
- **Deep Linking:** Support for direct links to specific career saves

### Performance Optimizations
- **Lazy Loading:** Load player lists and match data on demand
- **Pagination:** Implement for large lists (transfers, scout reports)
- **Caching:** Cache player data, club info, match results locally
- **Offline Support:** All core gameplay works offline with auto-sync when online

---

## Dark Mode Support

All colors use CSS variables that automatically switch based on system preference:
- Light mode: Bright backgrounds, dark text
- Dark mode: Dark backgrounds, light text
- Consistent contrast ratios (WCAG AA minimum)
- Smooth transition between modes

---

## Accessibility Considerations

- **Touch Targets:** Minimum 44x44px for all interactive elements
- **Text Contrast:** WCAG AA compliance (4.5:1 minimum for body text)
- **Font Sizes:** Minimum 14px for body text, scalable with system settings
- **Haptic Feedback:** Optional, can be disabled in settings
- **Clear Labels:** All buttons and inputs have descriptive labels
- **Error Messages:** Clear, actionable error messages with recovery steps

---

## Session Design & Save System

### Auto-Save Strategy
- Auto-save after every significant action (match completion, transfer, training)
- Quick save option accessible from pause menu
- Multiple career saves per mode (at least 5 slots)
- Cloud backup integration with Google Play Games (optional)

### Session Length
- **Quick Actions:** 2-5 minutes (training, squad management, finances)
- **Match Simulation:** 5-10 minutes (match prep + simulation + analysis)
- **Strategic Planning:** 10-15 minutes (transfers, facilities, long-term planning)
- **Full Session:** 20-30 minutes (complete day with multiple activities)

### Pause & Resume
- Pause button accessible from all gameplay screens
- Pause menu shows: Resume, Quick Save, Settings, Return to Menu
- Auto-pause on app background, resume on foreground
- Unsaved progress warning before exit

---

## Performance & Battery Considerations

- **App Size:** Target < 200MB for initial release
- **Battery Drain:** Optimize animations, reduce background processing
- **Memory:** Efficient data structures, lazy loading for large datasets
- **Network:** Offline-first design, minimal server calls
- **Loading Times:** < 2 seconds for screen transitions, < 5 seconds for match simulation

---

## Future Enhancements (Post-Launch)

- Multiplayer competitive leagues
- Cross-platform cloud sync
- Advanced AI opponent behavior
- Historical leagues and player databases
- Cosmetic customization (kits, badges, stadiums)
- Additional international competitions
- Detailed injury simulation system
- Advanced statistical analysis tools
