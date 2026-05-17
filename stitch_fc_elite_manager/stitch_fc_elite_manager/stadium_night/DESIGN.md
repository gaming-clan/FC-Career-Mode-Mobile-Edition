---
name: Stadium Night
colors:
  surface: '#051426'
  surface-dim: '#051426'
  surface-bright: '#2c3a4e'
  surface-container-lowest: '#010f21'
  surface-container-low: '#0d1c2f'
  surface-container: '#122033'
  surface-container-high: '#1c2b3e'
  surface-container-highest: '#273649'
  on-surface: '#d5e3fd'
  on-surface-variant: '#c6c6cd'
  inverse-surface: '#d5e3fd'
  inverse-on-surface: '#233144'
  outline: '#909097'
  outline-variant: '#45464d'
  surface-tint: '#bec6e0'
  primary: '#bec6e0'
  on-primary: '#283044'
  primary-container: '#0f172a'
  on-primary-container: '#798098'
  inverse-primary: '#565e74'
  secondary: '#a4d64c'
  on-secondary: '#233600'
  secondary-container: '#719e13'
  on-secondary-container: '#1e2f00'
  tertiary: '#7bd0ff'
  on-tertiary: '#00354a'
  tertiary-container: '#001a27'
  on-tertiary-container: '#008abb'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#bff365'
  secondary-fixed-dim: '#a4d64c'
  on-secondary-fixed: '#131f00'
  on-secondary-fixed-variant: '#354e00'
  tertiary-fixed: '#c4e7ff'
  tertiary-fixed-dim: '#7bd0ff'
  on-tertiary-fixed: '#001e2c'
  on-tertiary-fixed-variant: '#004c69'
  background: '#051426'
  on-background: '#d5e3fd'
  surface-variant: '#273649'
typography:
  display-lg:
    fontFamily: Archivo Narrow
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Archivo Narrow
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Archivo Narrow
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  stats-xl:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 24px
  stats-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 16px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 12px
  margin-mobile: 16px
---

## Brand & Style

The design system is engineered for a high-stakes, premium mobile football management experience. It captures the electric atmosphere of a stadium under floodlights, blending professional sports data visualization with high-energy digital aesthetics. The target audience expects a deep, analytical experience that feels fast-paced and rewarding.

The visual style is a hybrid of **Modern Corporate** and **Glassmorphism**. It utilizes deep, atmospheric backgrounds to provide a sense of prestige, while interactive elements leverage vibrant neon accents and translucent layering to suggest cutting-edge performance tech. The emotional response is one of authority, precision, and adrenaline.

## Colors

The palette is built on a "Stadium Night" foundation. The core background uses **Deep Navy** to create a sophisticated, low-distraction environment for data-heavy screens. 

**Electric Lime** serves as the high-energy primary accent, reserved strictly for calls-to-action, critical highlights, and positive performance indicators. **Cyan** (Tertiary) is used for secondary data points and interactive toggles to provide a digital, "HUD" feel. Surfaces and containers use **Slate Gray** with varying opacities to establish depth without breaking the dark-mode immersion. Feedback colors (Success, Warning, Alert) are saturated and vibrant to ensure immediate recognition against the dark backdrop.

## Typography

This design system utilizes a three-tier typographic strategy to balance sporting energy with data clarity. 

1.  **Headlines (Archivo Narrow):** A condensed, bold sans-serif that mimics the impact of stadium scoreboards and sports journalism. It is used for page titles and major section headers.
2.  **Body (Inter):** A systematic, highly legible sans-serif used for all long-form text, descriptions, and standard UI labels to ensure effortless reading during extended play sessions.
3.  **Data/Stats (JetBrains Mono):** A monospaced font used for player statistics, clock timers, and financial figures. The fixed character width ensures that numbers remain aligned and easy to scan in dense tables.

All display headings should use sentence case or all-caps depending on the hierarchy, while labels always utilize all-caps with increased letter spacing for a technical look.

## Layout & Spacing

The layout is optimized for a high-density mobile environment. It follows a **Fluid Grid** model with a focus on vertical scrolling and horizontal "card-swiping" for quick navigation between stats.

A strict 4px baseline grid ensures alignment across various data points. For mobile, a 16px side margin is mandatory. Gutters are kept tight (12px) to maximize screen real estate for player lists and tactical boards. Information density should be high but organized through the use of distinct container grouping.

## Elevation & Depth

Depth in the design system is achieved through **Glassmorphism** and **Tonal Layering** rather than traditional shadows. 

- **Level 0 (Background):** Solid Deep Navy (#0F172A).
- **Level 1 (Cards/Containers):** Slate Gray (#334155) at 40-60% opacity with a subtle 1px inner border (white at 10% opacity) and a backdrop blur of 12px.
- **Level 2 (Modals/Overlays):** Darker Slate Gray at 80% opacity with a 20px backdrop blur to create focus.
- **Interactivity:** Elements at the highest level of hierarchy (like the active player card or primary CTA) feature a subtle outer glow using a low-opacity version of the Electric Lime accent color to simulate light emission.

## Shapes

The shape language is "Technical-Sharp." We use a **Soft (1)** roundedness setting (0.25rem / 4px) to maintain a professional, high-performance aesthetic. This avoids the "toy-like" feel of large radii while providing enough softness to feel modern.

- **Standard Buttons/Inputs:** 4px radius.
- **Tactical Cards/Player Profile Containers:** 8px radius (`rounded-lg`).
- **Data Tags/Chips:** Full pill-shape (only exception to the sharp rule) to distinguish them as discrete metadata units.

## Components

### Buttons
- **Primary:** Solid Electric Lime background with Deep Navy text. Bold, all-caps typography. No shadow, but a 4px "glow" on hover/active states.
- **Secondary:** Transparent background with a 1px Electric Lime border and Electric Lime text.
- **Ghost:** Transparent background with Slate Gray text, used for low-priority actions.

### Player Cards & Stats
- **Cards:** Utilize the Level 1 Glassmorphism style. Backgrounds should have a subtle diagonal gradient (10% opacity) to add movement. 
- **Stat Bars:** Use a dark track with a vibrant fill (Lime for positive, Red for negative).

### Inputs & Selection
- **Input Fields:** Dark, recessed backgrounds with a 1px Slate Gray border that glows Cyan when focused.
- **Checkboxes/Radios:** Custom square designs (4px radius) using Electric Lime for the checked state.

### Navigation
- **Bottom Tab Bar:** Deep Navy with a 1px top border. Active icons utilize the Electric Lime color with a small dot indicator below.
- **Quick-Action FAB:** A circular button using the Tertiary Cyan color, used for "Next Match" or "Confirm Tactics."

### Progress Indicators
- Circular charts and linear bars should use high-contrast neon colors against the dark background to ensure they are readable at a glance during simulated matches.