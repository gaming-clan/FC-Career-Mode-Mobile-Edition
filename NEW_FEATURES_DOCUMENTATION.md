# FC Career Mode - New Features Documentation

This document details all five major new features implemented in the latest update.

## 1. Tactical Depth System

### Overview
The tactical system provides deep, realistic match simulation with multiple advanced tactical philosophies. Managers can now choose from basic tactics or implement sophisticated systems that require specific player attributes and formations.

### Features

#### Basic Tactics
- **Balanced**: Standard approach with equal focus on attack and defense
- **Attacking**: Push forward with more players in attacking positions
- **Defensive**: Prioritize defensive solidity and counter-attacks
- **Counter Attack**: Absorb pressure and exploit spaces on the break
- **Possession**: Control the game through ball possession and passing
- **High Press**: Aggressively press opponents high up the pitch
- **Park the Bus**: Extreme defensive setup with minimal attacking intent
- **Long Ball**: Bypass midfield with direct long passes

#### Advanced Tactical Systems

##### Gegenpressing
**Description**: High-intensity pressing system where players immediately pressure the ball after losing possession.

**Requirements**:
- Pace: 78+
- Passing: 75+
- Defense: 76+
- Stamina: 85+

**Effects**:
- Possession: -15%
- Pressure Intensity: 95
- Ball Recovery Rate: 78%
- Injury Risk: 0.08

**Best For**: Teams with athletic, coordinated squads who want to dominate possession through pressure.

##### Tiki-Taka
**Description**: Possession-dominant system based on short, quick passes and ball retention.

**Requirements**:
- Passing: 88+
- Dribbling: 82+
- Pace: 72+
- Defense: 70+

**Effects**:
- Possession: +25%
- Pass Completion: 88%
- Build-up Speed: 45
- Injury Risk: 0.02

**Best For**: Technically gifted squads with excellent passing and positioning.

##### False Nine
**Description**: Striker drops deep to midfield, creating space for wingers to attack.

**Requirements**:
- Dribbling: 85+
- Passing: 80+
- Pace: 75+

**Effects**:
- Possession: +15%
- Creative Opportunities: High
- Winger Effectiveness: +20%

**Best For**: Teams with technical strikers and explosive wingers.

##### Inverted Fullbacks
**Description**: Fullbacks tuck inside to midfield, creating numerical advantages in the center.

**Requirements**:
- Dribbling: 80+
- Passing: 78+
- Pace: 80+

**Effects**:
- Midfield Control: +20%
- Width Vulnerability: Increased
- Passing Options: +15%

**Best For**: Teams with technical fullbacks and creative midfielders.

##### Wing Backs
**Description**: Attacking fullbacks who push high up the pitch to provide width and attacking support.

**Requirements**:
- Pace: 85+
- Stamina: 88+
- Dribbling: 78+

**Effects**:
- Attacking Width: +30%
- Defensive Vulnerability: -20%
- Stamina Drain: 95%

**Best For**: 5-at-the-back formations with athletic fullbacks.

### Implementation

**Files**:
- `lib/tactical-system.ts` - Basic tactical adjustments
- `lib/advanced-tactics.ts` - Advanced tactical philosophies
- `app/modes/tactics-manager.tsx` - UI for managing tactics

**Key Functions**:
- `getTacticalAdjustmentImpact()` - Calculate tactic effects
- `calculateTacticalEffectiveness()` - Determine tactic success rate
- `isSquadSuitableForTactic()` - Check squad compatibility
- `getTacticRecommendations()` - Recommend tactics based on squad

---

## 2. Financial Dashboard

### Overview
A comprehensive financial management system that tracks revenue streams, expenses, and budgeting. Managers must balance player wages, staff costs, and facility maintenance while maximizing revenue.

### Revenue Streams

#### Ticket Sales
- Based on stadium capacity and attendance percentage
- Affected by league position and team performance
- Average: £4.5M per month

#### Sponsorship Deals
- Negotiable multi-year contracts
- Performance bonuses for top 4 finishes
- Average: £5M per month

#### Merchandise Sales
- Based on fan base size and team performance
- Increases with higher league positions
- Average: £1.5M per month

#### Television Rights
- Fixed or negotiable deals
- Varies by league and popularity
- Average: £1M per month

### Expense Categories

#### Player Wages
- Calculated per player based on rating, age, and contract
- Typically 50-65% of total budget
- Young players (< 25): Premium multiplier
- Aging players (> 30): Discount multiplier

#### Staff Salaries
- Manager, coaches, medical staff
- Based on experience and effectiveness
- Typically 8-12% of budget

#### Facility Maintenance
- Stadium, training ground, medical facilities, academy
- Affects player development and injury recovery
- Typically 5-10% of budget

#### Medical Expenses
- Injury treatment and recovery
- Affected by injury frequency
- Typically 2-5% of budget

### Financial Health Indicators

| Status | Months of Funding | Description |
| :--- | :--- | :--- |
| Excellent | > 24 months | Strong financial position |
| Good | 12-24 months | Healthy finances |
| Stable | 6-12 months | Manageable situation |
| Struggling | 2-6 months | Financial pressure |
| Critical | < 2 months | Severe financial crisis |

### Implementation

**Files**:
- `lib/financial-system.ts` - Financial calculations and management
- `app/modes/financial-dashboard.tsx` - Financial UI screen

**Key Functions**:
- `calculateTicketRevenue()` - Compute ticket income
- `calculateMerchandiseRevenue()` - Compute merchandise income
- `calculateTotalPlayerWages()` - Calculate total wage bill
- `applyPerformanceFinancials()` - Apply prize money and bonuses
- `simulateFinancialMonth()` - Simulate monthly cash flow

---

## 3. Scouting Network

### Overview
A dynamic scouting system that allows managers to discover new talent, send scouts on missions, and build a youth academy. Scouts have different effectiveness levels and specializations.

### Scout Types

#### Junior Scout
- Effectiveness: 40-60
- Salary: £30k/year
- Best for: Budget scouting, youth players
- Experience bonus: +2% per year

#### Senior Scout
- Effectiveness: 70-90
- Salary: £60k/year
- Best for: Balanced scouting, established players
- Experience bonus: +2% per year

#### Elite Scout
- Effectiveness: 90-100
- Salary: £120k/year
- Best for: Top-tier talent discovery
- Experience bonus: +2% per year

### Scouting Missions

Missions can be customized by:
- **Region**: Domestic, Europe, South America, Africa, Asia
- **Player Type**: Striker, Winger, Midfielder, Defender, Goalkeeper, Any
- **Minimum Rating**: 70-95
- **Maximum Age**: 18-35
- **Budget**: Affects number of players found
- **Duration**: 2-12 weeks

### Mission Success Factors

Success rate is determined by:
- Scout effectiveness (base factor)
- Regional familiarity (+15% if scout's region matches mission region)
- Mission difficulty (harder targets = lower success rate)
- Budget allocation (higher budget = better results)

### Implementation

**Files**:
- `lib/scouting-system.ts` - Scouting logic and player generation
- `app/modes/scouting-network.tsx` - UI for scouting (to be created)

**Key Functions**:
- `hireScout()` - Hire a new scout
- `createScoutingMission()` - Create a scouting mission
- `generateScoutedPlayers()` - Generate players from mission
- `completeMission()` - Resolve mission outcome
- `getScoutingRecommendations()` - Recommend scouting targets

---

## 4. Press & Media System

### Overview
A comprehensive media management system where managers conduct press conferences, give post-match interviews, and manage their reputation. Media interactions affect player morale, board confidence, and fan satisfaction.

### Press Conferences

Pre-match press conferences include:
- **Tactics Question**: How will you approach the match?
- **Performance Question**: Assessment of recent form
- **Injuries Question**: How will you handle injuries?
- **Transfers Question**: Comments on transfer rumors
- **Future Question**: Your ambitions for the season

### Response Types

#### Confident
- Boosts morale and fan satisfaction
- Risky if team is underperforming
- +15 public opinion, +20 fan satisfaction

#### Cautious
- Safe, neutral approach
- Minimal impact on morale
- +5 public opinion, +5 fan satisfaction

#### Critical
- Self-critical, acknowledges problems
- Can damage reputation if overused
- -20 public opinion, -15 fan satisfaction

#### Diplomatic
- Balanced, professional approach
- Generally positive reception
- +10 public opinion, +10 fan satisfaction

#### Aggressive
- Confrontational, bold statements
- Polarizes opinion
- -10 public opinion, +15 player morale

### Manager Reputation

Reputation is affected by:
- Press conference responses
- Match results and performance
- Controversies (outbursts, player conflicts)
- Media handling skill

**Reputation Factors**:
- Overall Rating (0-100)
- Tactical Acumen
- Man Management
- Media Handling
- Success Rate

### Controversies

Controversies can be:
- **Outburst**: Manager loses temper
- **Poor Result**: Unexpected defeat
- **Player Conflict**: Disputes with players
- **Media Criticism**: Harsh media coverage

**Severity Levels**:
- Minor: -5 reputation, 2 weeks to resolve
- Moderate: -15 reputation, 4 weeks to resolve
- Major: -30 reputation, 8 weeks to resolve

### Implementation

**Files**:
- `lib/press-media-system.ts` - Press and media logic
- `app/modes/press-conference.tsx` - UI for press conferences (to be created)

**Key Functions**:
- `generatePressConferenceQuestions()` - Generate questions
- `calculateMediaReaction()` - Determine media response
- `processPressConference()` - Process entire conference
- `updateManagerReputation()` - Update reputation based on results
- `addControversy()` - Add controversy to record

---

## 5. Staff Management

### Overview
A comprehensive staff management system where managers hire, develop, and manage coaching and medical staff. Different staff members provide bonuses to player development, injury recovery, and tactical effectiveness.

### Staff Roles

#### Coaching Staff
- **Manager**: Overall team management and tactics
- **Assistant Coach**: General support and player development
- **Attacking Coach**: Improves attacking player development (+20% attacking bonus)
- **Defensive Coach**: Improves defensive player development (+20% defending bonus)
- **Fitness Coach**: Improves physical development and reduces injuries
- **Goalkeeper Coach**: Specialized goalkeeper development

#### Medical Staff
- **Head Physio**: Manages injury recovery and prevention
- **Assistant Physio**: Supports head physio
- **Sports Psychologist**: Improves player morale and mental resilience

### Staff Effectiveness

Each staff member has:
- **Effectiveness Rating** (0-100): How good they are at their job
- **Experience**: Years in the role
- **Salary**: Annual cost
- **Specializations**: Areas of expertise

### Player Development Bonuses

Staff provide bonuses to player development in:
- **Attacking**: Shooting, dribbling, positioning
- **Defending**: Positioning, tackling, marking
- **Physical**: Pace, stamina, strength
- **Technical**: Passing, ball control, awareness
- **Mental**: Morale, confidence, concentration

Bonuses vary by:
- Staff effectiveness
- Player position
- Player age (younger players develop faster)
- Player potential

### Medical Staff Effects

Medical staff effectiveness affects:
- **Injury Recovery Rate**: How quickly players recover (0-100%)
- **Injury Prevention Rate**: How often injuries are prevented (0-100%)
- **Overall Effectiveness**: Combined medical team quality

### Staff Recommendations

The system recommends hiring based on:
- Current staff gaps
- Squad needs
- Budget availability
- Priority level (Critical, High, Medium, Low)

### Implementation

**Files**:
- `lib/staff-management.ts` - Staff management logic
- `app/modes/staff-management.tsx` - UI for staff management

**Key Functions**:
- `hireStaffMember()` - Hire a new staff member
- `calculateCoachingEffects()` - Calculate coaching bonuses
- `calculatePlayerDevelopmentBonus()` - Calculate development bonus per player
- `calculateMedicalEffectiveness()` - Calculate medical team effectiveness
- `getStaffRecommendations()` - Recommend staff hires
- `renewStaffContract()` - Renew staff contracts

---

## Integration with Game Engine

All new features integrate seamlessly with the existing game engine:

### Match Simulation
- Tactics affect match outcome through `simulateUnifiedMatch()`
- Staff effectiveness modifies player attributes during matches
- Financial status affects player morale

### Season Progression
- Financial calculations happen monthly
- Staff development affects player growth
- Scouting missions complete over weeks
- Press conferences happen before/after matches

### Player Development
- Staff coaching bonuses apply to player development
- Medical staff affects injury recovery
- Tactical system affects player form

---

## Usage Examples

### Setting Up Gegenpressing

```typescript
import { GEGENPRESSING, isSquadSuitableForTactic } from "@/lib/advanced-tactics";

const suitable = isSquadSuitableForTactic(squad, GEGENPRESSING);
if (suitable.suitable) {
  applyTactic(GEGENPRESSING);
} else {
  console.log("Missing attributes:", suitable.missingAttributes);
}
```

### Managing Finances

```typescript
import { simulateFinancialMonth, getFinancialWarnings } from "@/lib/financial-system";

const newFinances = simulateFinancialMonth(
  currentFinances,
  monthlyRevenue,
  monthlyExpenses
);

const warnings = getFinancialWarnings(newFinances);
warnings.forEach(w => console.log(w));
```

### Scouting Players

```typescript
import { createScoutingMission, completeMission } from "@/lib/scouting-system";

const mission = createScoutingMission(
  scoutId,
  "south_america",
  "striker",
  80,
  25,
  5000000,
  8,
  currentWeek
);

// After 8 weeks...
const completed = completeMission(mission, scout);
console.log("Players found:", completed.playersFound.length);
```

### Press Conference

```typescript
import { processPressConference, updateManagerReputation } from "@/lib/press-media-system";

const conference = processPressConference(
  questions,
  managerResponses,
  managerReputation,
  currentPlayerMorale
);

const updatedReputation = updateManagerReputation(
  managerReputation,
  conference,
  matchResult
);
```

### Staff Development

```typescript
import { calculatePlayerDevelopmentBonus } from "@/lib/staff-management";

const bonus = calculatePlayerDevelopmentBonus(
  playerPosition,
  coachingEffects,
  playerAge,
  playerPotential
);

player.overallRating += bonus.attacking;
```

---

## Conclusion

These five features significantly expand the depth and realism of FC Career Mode. Managers now have complete control over tactics, finances, staff, media relations, and player development. Each system is interconnected, creating a complex, engaging management experience that rewards strategic thinking and planning.
