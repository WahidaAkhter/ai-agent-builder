# 🤖 AI Agent Builder — Submission PR

> **Candidate:** Wahida Akhter  
> **University:** University of Dhaka (Master's Student)  
> **CV:** [`public/wahida_akhter_cv.pdf`](./public/wahida_akhter_cv.pdf) — also presented interactively in the app (click **"Wahida — Lead Architect"** in the Saved Agents section)

---

**DESIGN LINK** = `<public_url_here>`

> *While I didn't produce a formal Figma file, I followed a deliberate design process: I first audited the existing UX for pain points (hidden state, confusing multi-select dropdowns), then sketched a mental model around professional builder tools like Figma and n8n — "Armory on the left, Canvas in the center, Config on the right." All design decisions are documented in this PR.*

---

## 🐛 Bug Fixes

### Bug 1 — Direct State Mutation (Critical)
**File:** `App.tsx`, `handleLayerSelect`

```tsx
// ❌ BEFORE — mutates state directly, React never detects a change
selectedLayers.push(layerId)
setSelectedLayers(selectedLayers) // same reference → no re-render

// ✅ AFTER — creates a new array, React detects the change correctly
setSelectedLayers([...selectedLayers, layerId])
```

**Impact:** Layers added by the user would silently fail to appear on screen. No error — just invisible state.

---

### Bug 2 — Stale Closure in setInterval (Critical)
**File:** `App.tsx`, analytics `useEffect`

```tsx
// ❌ BEFORE — agentName is permanently captured as '' at mount time
useEffect(() => {
  setInterval(() => console.log(agentName), 8000) // always logs ''
}, [])

// ✅ AFTER — useRef keeps a live reference without restarting the interval
const agentNameRef = useRef(agentName)
useEffect(() => { agentNameRef.current = agentName }, [agentName])

useEffect(() => {
  setInterval(() => console.log(agentNameRef.current), 8000)
}, [])
```

**Impact:** The analytics heartbeat would always report an "unnamed draft" regardless of what the user typed.

---

### Bug 3 — Unnecessary API Re-fetches on Every Selection
**File:** `App.tsx`, `handleSkillSelect`, `handleLayerSelect`, Profile `onChange`

```tsx
// ❌ BEFORE — triggers a 1–3 second simulated network delay on every dropdown change
const handleSkillSelect = (e) => {
  setSelectedSkills([...selectedSkills, skillId])
  fetchAPI() // ← completely unnecessary, data is already loaded
}

// ✅ AFTER — removed all fetchAPI() calls from selection handlers
const handleSkillSelect = (e) => {
  setSelectedSkills([...selectedSkills, skillId])
}
```

**Impact:** Every time a user clicked a dropdown, the entire UI would freeze with a "Fetching..." banner for up to 3 seconds. Extremely disruptive.

---

### Bug 4 — Uncontrolled DOM Mutation to Reset Forms
**File:** `App.tsx`

```tsx
// ❌ BEFORE — bypasses React and mutates the DOM directly
e.target.value = ""

// ✅ AFTER — controlled components with value="" reset naturally
<select value="" onChange={handleSkillSelect}>
```

**Impact:** React's virtual DOM and the real DOM fell out of sync. This can cause unpredictable rendering behaviour on re-mounts.

---

## 🎨 UI/UX Overhaul

### Architecture

The single 411-line `App.tsx` was broken into focused, reusable components:

```
src/
├── store/
│   └── agentStore.ts        # Zustand store (replaces 8+ useState hooks)
└── components/
    ├── Sidebar.tsx           # Left "Armory" — draggable skills & layers
    ├── DraggableItem.tsx     # Individual draggable card (React.memo)
    ├── Canvas.tsx            # Drop zone with live visual feedback
    ├── ModuleCard.tsx        # Added module on canvas (React.memo)
    ├── AgentConfigPanel.tsx  # Right sidebar — profile, provider, save
    ├── SavedAgentsPanel.tsx  # Bottom panel — saved agent cards
    └── WahidaAgentModal.tsx  # Creative CV drawer
```

### Drag-and-Drop (dnd-kit)

Replaced all `<select>` menus with a true drag-and-drop interface:
- **`useDraggable`** on each sidebar skill/layer card
- **`useDroppable`** on the canvas
- **`DragOverlay`** renders a visual ghost of the item being dragged
- **Activation constraint** of 6px prevents accidental drags on click
- Already-added items are **dimmed and non-draggable** in the sidebar

### Animations (Framer Motion)

- Module cards **slide in from left** when dropped onto the canvas
- Module cards **shrink and fade out** when removed
- CV drawer sections **stagger-animate** on open
- Skill tags in the CV **scale up** on hover

### State Management (Zustand)

Replaced 8 coupled `useState` hooks with a single Zustand store:
- Centralized, predictable state mutations
- Persists saved agents to `localStorage`
- `initSavedAgents()` called once on mount to rehydrate from storage
- The "Wahida — Lead Architect" special agent is always injected first and cannot be deleted

### Performance

| Optimization | Implementation |
|---|---|
| `React.memo` | `DraggableItem`, `ModuleCard` — prevent re-renders when parent updates |
| `useCallback` | `handleRemoveSkill`, `handleRemoveLayer` in `Canvas.tsx` |
| State co-location | Each component reads only the slice of Zustand store it needs |
| Stale closure fix | `useRef` pattern for analytics interval |
| No unnecessary fetches | `fetchAPI` only on mount and manual "Reload" button |

### Design System

- **Dark mode** using AntD's `theme.darkAlgorithm` + custom CSS tokens
- **Google Font:** Inter (300–800 weights)
- **Color palette:** Indigo (`#6366f1`) + Purple (`#8b5cf6`) + Cyan (`#06b6d4`)
- **Micro-details:** pulsing dot on the canvas header, glow shadows on hover, custom scrollbar, backdrop-blur sticky header

---

## 🪪 Creative CV Integration

Clicking **"Wahida — Lead Architect"** in the Saved Agents panel opens a full-height AntD Drawer styled as an interactive portfolio:

- **Avatar** with gradient + glow
- **About**, **Education**, **Technical Skills**, **Featured Projects** sections
- Skills tags animate on hover
- Project cards with per-project accent colours
- **"Download Full CV (PDF)"** button → `public/wahida_akhter_cv.pdf`
- Social links: GitHub, LinkedIn, Email

---

## 🤖 AI Tools Used

This project was built with the assistance of the following AI tools:

| Tool | How it was used |
|---|---|
| **Antigravity (Google DeepMind)** | Primary coding assistant — used for planning, component architecture, bug identification, and implementation |
| **ChatGPT** | Used for exploring dnd-kit API options and brainstorming UX patterns for builder interfaces |
| **Gemini** | Used to cross-check Zustand state shape design and TypeScript interface decisions |
| **Claude** | Used for reviewing component structure and refining the Framer Motion animation sequences |

All AI suggestions were reviewed, understood, and intentionally applied — no code was blindly accepted without verification.

---

## ✅ Checklist

- [x] Forked repository
- [x] Fixed all 4 intentional bugs with clear explanations
- [x] Implemented drag-and-drop with `dnd-kit`
- [x] Modern, dark-mode responsive UI with AntD + Framer Motion
- [x] CV PDF in `public/wahida_akhter_cv.pdf`
- [x] CV presented creatively in the frontend
- [x] PR description explains all decisions
- [x] AI tools section included
