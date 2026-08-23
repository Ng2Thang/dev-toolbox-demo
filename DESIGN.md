---
name: Dev Toolbox
colors:
  surface: '#12131a'
  surface-dim: '#12131a'
  surface-bright: '#383941'
  surface-container-lowest: '#0d0e15'
  surface-container-low: '#1a1b22'
  surface-container: '#1e1f26'
  surface-container-high: '#292931'
  surface-container-highest: '#33343c'
  on-surface: '#e3e1ec'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e3e1ec'
  inverse-on-surface: '#2f3038'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#c0c1ff'
  on-secondary: '#1000a9'
  secondary-container: '#3131c0'
  on-secondary-container: '#b0b2ff'
  tertiary: '#ffb786'
  on-tertiary: '#502400'
  tertiary-container: '#df7412'
  on-tertiary-container: '#461f00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  background: '#12131a'
  on-background: '#e3e1ec'
  surface-variant: '#33343c'
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '600'
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
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 16px
  margin: 24px
---

## Brand & Style

The design system is engineered for professional developers who value speed, precision, and a high signal-to-noise ratio. The brand personality is technical, reliable, and unobtrusive, acting as a high-performance tool rather than a lifestyle brand.

The aesthetic follows a **Corporate / Modern** approach with heavy influences from **Minimalism** and **Geist-inspired** utility. It focuses on functional density, using subtle borders and intentional depth to organize complex information without overwhelming the user. The primary emotional response should be one of "competence"—the UI should feel like a well-configured terminal or a high-end IDE.

## Colors

This design system defaults to **Dark Mode** to reduce eye strain during long development sessions. 

- **Primary**: A vibrant 'Electric Blue' (#3b82f6) used sparingly for active states, primary actions, and focus rings.
- **Surfaces**: A tiered hierarchy of Slates. The foundation is `#09090b`. Elevated containers or cards use `#18181b`.
- **Borders**: All structural separation is handled by low-contrast borders (`#27272a`). Avoid using solid blacks; maintain a slight gray tint to ensure depth is visible on OLED and standard IPS panels.
- **Accents**: Use success (green), warning (amber), and error (red) sparingly, keeping saturation high but area small (e.g., small status dots or thin borders).

## Typography

The typography system relies on two high-performance fonts: **Geist** for the interface and **JetBrains Mono** for technical data and code.

- **Interface**: Geist is used for all navigation, labels, and headings. It provides a geometric yet legible structure that scales well at small sizes.
- **Technical**: JetBrains Mono is strictly for "Input/Output" areas—anywhere the user types code, views JSON, or reads terminal logs.
- **Scalability**: Headlines use a tighter letter-spacing to maintain a "technical" look. For mobile viewports, `headline-lg` should scale down to 24px to prevent excessive wrapping in dense tool interfaces.

## Layout & Spacing

The layout uses a **Fluid Grid** model based on a 4px baseline. This ensures high information density.

- **Grid**: A 12-column layout for desktop with 16px gutters. For utility-heavy views, use a sidebar-main-aside structure where the sidebar is fixed at 240px and the main content area remains fluid.
- **Rhythm**: Use `8px` (sm) for internal component padding and `16px` (md) for spacing between logical sections or cards.
- **Mobile**: On devices under 768px, sidebars must collapse into a bottom drawer or a full-screen overlay to prioritize the tool's workspace.

## Elevation & Depth

This design system avoids traditional drop shadows in favor of **Tonal Layers** and **Subtle Outlines**.

- **Level 0**: Base background (`#09090b`).
- **Level 1**: Primary UI containers and cards (`#18181b`) with a 1px solid border (`#27272a`).
- **Level 2**: Popovers, tooltips, and context menus. Use a slightly lighter surface (`#27272a`) and a very subtle, sharp shadow (0px 4px 12px rgba(0,0,0,0.5)) to distinguish from the level below.
- **Active State**: Use a primary-colored glow (low-spread shadow) only for focused inputs or high-priority buttons to indicate the "Input" focus.

## Shapes

The shape language is **Soft** but leans towards precision. 

- **Components**: Standard buttons, inputs, and cards use a 4px (`0.25rem`) corner radius. This creates a professional, sharp look that feels more modern than 0px "brutalist" corners but more serious than "pill-shaped" consumer apps.
- **Selection**: Highlights (like sidebar hover states) should use the same 4px radius. 
- **Icons**: Use a consistent stroke-based icon set (e.g., Lucide) with a 2px stroke width to match the weight of the Geist typeface.

## Components

- **Collapsible Sidebar**: Group tools by category (e.g., "Formatters", "Encoders"). Use `label-caps` for category headers and `body-sm` for nav items.
- **Tool Cards**: The primary container for a utility. Should include a header with the tool name and an optional "favorite" toggle.
- **Editor Textarea**: Use JetBrains Mono. Include a 32px wide gutter for line numbers. The background should be slightly darker than the card surface to create an "inset" feel.
- **Segmented Controls**: Used for toggling modes (e.g., JSON vs YAML). These should be flat, with the active state indicated by a slightly lighter background and primary colored text.
- **Buttons**:
    - *Primary*: Solid Blue with White text.
    - *Secondary/Ghost*: Transparent with a 1px border.
- **Toasts**: Small, bottom-right aligned notifications. Use a "Dark" theme with a subtle primary border. Content should be brief (e.g., "Copied to clipboard").
- **Inputs**: High-contrast focus states using a 1px primary border and a subtle outer glow.