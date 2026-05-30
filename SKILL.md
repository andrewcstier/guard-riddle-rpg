# Guard Riddle RPG — Level Design Skill Guide

## Overview
This game is a pixel-art RPG built in a single React JSX file using HTML5 Canvas for rendering and Tone.js for music. Each level is a self-contained React component with its own game loop, NPCs, puzzles, and music theme. Levels are routed by a root `Game` component.

The game supports two platforms:
- **Desktop** (`Game.jsx`) — keyboard controls (arrow keys + Z to interact, C for clues, ESC to close)
- **Mobile** (`GameMobile.jsx`) — touch D-pad + A button, larger text, responsive layout

All changes must be made to BOTH files unless they are platform-specific.

---

## Architecture

### File Structure
```
src/
  Game.jsx         — Desktop version (all levels + root Game component)
  GameMobile.jsx   — Mobile version (duplicated with touch controls + larger text)
  App.jsx          — Loads Game
  AppMobile.jsx    — Loads GameMobile
```

### Constants
```jsx
const TILE = 32;        // Tile size in pixels
const SPEED = 2.5;      // Player movement speed
const INTERACT_DIST = TILE * 2;  // Interaction range
const FONT = "'Press Start 2P', monospace";  // Pixel art font
const VERSION = "Beta Version X.XX";
```

### Level Component Pattern
Each level is a function component:
```jsx
function LevelN({ onWin, onRestart, muted, setMuted, muteBtn, startMusicForLevel, apiKey, model }) {
  // Canvas ref, player ref, keyboard/touch refs
  // State: chatOpen, talkingTo, messages, input, loading, nearEntity, etc.
  // Game loop useEffect
  // Render: canvas + UI panels
}
```

### Root Game Component
Routes between levels and handles:
- API key input / URL hash key detection
- Model selection (Opus, Sonnet, Haiku)
- Level state management
- Mute button
- Music initialization

---

## Creating a New Level

### 1. Define the Grid
```jsx
const LN_COLS = 20, LN_ROWS = 14;
const LN_W = LN_COLS * TILE, LN_H = LN_ROWS * TILE;
```
- Rows 0-1 are typically the top wall
- Row (ROWS-1) is the bottom wall
- Col 0 and Col (COLS-1) are side walls
- Playable area: cols 1 to COLS-2, rows 2 to ROWS-2

### 2. Create the Draw Function
```jsx
function drawLevelNRoom(ctx) {
  // Floor tiles
  for(let r=0; r<LN_ROWS; r++) for(let c=0; c<LN_COLS; c++) {
    ctx.fillStyle = ((r+c) % 2 === 0) ? "#color1" : "#color2";
    ctx.fillRect(c*TILE, r*TILE, TILE, TILE);
  }
  // Walls (top, bottom, left, right)
  // Doors (gaps in walls)
  // Decorations (furniture, objects, paintings)
  // Labels (room name, door labels)
}
```

### 3. Define NPCs

#### NPC Definition Array
```jsx
const LN_NPCS = [
  { key: "uniqueId", room: "roomName", x: COL*TILE, y: ROW*TILE,
    label: "DISPLAY NAME", color: "#hexcolor", draw: drawFunctionName },
];
```

#### NPC Sprite Function (32x32 pixels)
```jsx
function drawNPCName(ctx, x, y) {
  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(x+6, y+28, 20, 4);
  // Build from bottom up: shoes, legs, torso, arms, head, hair, accessories
  // Use distinct silhouette + color palette per character
}
```

#### NPC Portrait Function (96x96 pixels)
```jsx
function drawPortraitNPCName(ctx) {
  // Background fill
  // Shoulders/clothing (detailed, matches small sprite colors)
  // Neck, head (larger, more detailed)
  // Hair (matches small sprite)
  // Eyes, nose, mouth (expressive, shows personality)
  // Accessories (glasses, hat, monocle, etc. — must match small sprite)
}
```

**CRITICAL: Portraits MUST match their small sprites.** Same clothing colors, same accessories, same hair. The portrait is a zoomed-in version, not a different character.

### 4. NPC Behavior & Backstories

#### System Prompt Structure
Every NPC that uses the AI API needs a system prompt with these sections:

```
IDENTITY: Who they are (name, age, role)

BACKSTORY: 2-3 paragraphs covering:
- Personal history and motivations
- Connection to the current situation/victim/puzzle
- Secrets they're hiding

RELATIONSHIPS WITH OTHER CHARACTERS:
- Specific feelings/history with each other NPC
- Use concrete details (events, quotes, memories)
- Each relationship should feel distinct and layered

MOTIVE: (for suspects) Why they might have done it

PERSONALITY: How they speak and behave
- Speech patterns, verbal tics, mannerisms
- What they're open about vs. evasive about
- How they react to different types of questions

CORE STATEMENT: The key information they provide
- What they say and when they say it
- Whether they volunteer it or need to be pressed
- Whether it's true or a lie

Keep answers under 2-3 sentences. 8-bit RPG style speech.
```

#### NPC Behavior Types

**AI-Powered NPCs** (suspects, detectives, etc.):
- Use `callLLM()` with system prompt
- Track conversation in `messages` state
- Sanitize output with `sanitizeLLMOutput()`
- Can trigger clue discovery based on response keywords

**Hardcoded NPCs** (if needed):
- Cycle through preset responses via a counter ref
- No API calls, instant responses
- Still get portraits and greeting messages

**Wandering NPCs** (suspects):
```jsx
const wanderRef = useRef({
  npcKey: {
    x: SPAWN_X, y: SPAWN_Y,
    homeX: SPAWN_X, homeY: SPAWN_Y,
    tx: SPAWN_X, ty: SPAWN_Y,
    timer: 0, frame: 0, tick: 0, dir: "down", idle: false
  },
});
```
- Move cardinal only (never diagonal)
- Short wander range (~1.2 tiles from home)
- Pause between walks (idle phase)
- Check furniture collision before moving
- Check player collision (don't walk through player)
- Stop wandering when player is talking to them

**Static NPCs** (detectives, forensics, soothsayer):
- Stay at their defined position
- No wander logic needed

### 5. Interaction System

#### Proximity Detection
- Use `isFacingNear()` — only show interaction prompt when player faces the NPC/object
- NPCs take priority over examinable objects
- Show "Z" prompt (desktop) or "A" prompt (mobile) above interactable

#### Chat Flow
1. Press Z/A near NPC → open chat with greeting message
2. Player types question → `sendMessage()` → API call → response
3. Clue keywords in response trigger `setDiscoveredClues()`
4. "THANKS, GOODBYE" → show only farewell message → auto-close after 1.5s
5. During goodbye: hide input, hide buttons, show only farewell text

#### Examinable Objects
```jsx
const EXAMINABLES = [
  { key: "id", x: COL*TILE, y: ROW*TILE, room: "roomName",
    label: "DISPLAY NAME",
    drawCloseup: drawCloseupFunction,  // 128x128 pixel art
    description: "Text shown when examined" },
];
```
- Closeup drawn on a 128x128 canvas
- Can trigger clue discovery on examination
- Shown in a modal overlay

### 6. Clue System

```jsx
const [discoveredClues, setDiscoveredClues] = useState([]);
```

#### Adding Clues
```jsx
// On NPC greeting (immediate):
if(npc.key === "keyName") setDiscoveredClues(prev =>
  prev.includes("clue text") ? prev : [...prev, "clue text"]);

// On API response (keyword match):
if(talkingTo === "npcKey" && reply.toLowerCase().includes("keyword"))
  setDiscoveredClues(prev => prev.includes("clue") ? prev : [...prev, "clue"]);

// On examining object:
if(ex.key === "objectKey") setDiscoveredClues(prev =>
  prev.includes("clue") ? prev : [...prev, "clue"]);
```

#### Clue Display Order
Clues are sorted by category in the panel:
1. Suspect statements (contains "statement:")
2. Physical evidence (contains "thread", "Security footage")
3. Insights (contains "Soothsayer" or similar)
4. Everything else

### 7. Collision System

#### Walls
```jsx
if(tx < TILE || tx+TILE > (COLS-1)*TILE || ty < 2*TILE || ty+TILE > (ROWS-1)*TILE) return false;
```

#### Furniture
```jsx
const hitBox = (tx,ty,bx,by,bw,bh) => tx+TILE>bx && tx<bx+bw && ty+TILE>by && ty<by+bh;
if(hitBox(tx,ty, FURNITURE_X, FURNITURE_Y, FURNITURE_W, FURNITURE_H)) return false;
```

#### NPCs (tight collision)
```jsx
if(tx+TILE > np.x+4 && tx < np.x+TILE-4 && ty+TILE > np.y+8 && ty < np.y+TILE-2) return false;
```

### 8. Room Transitions (Multi-Room Levels)

```jsx
const ROOM_DOORS = {
  room1: [
    { col: 0, row: 7, label: "ROOM2", target: "room2", spawnX: 17*TILE, spawnY: 7*TILE },
  ],
  room2: [
    { col: 19, row: 7, label: "EXIT", target: "room1", spawnX: 2*TILE, spawnY: 7*TILE },
  ],
};
```
- Draw door gaps in walls at the specified row/col
- Check proximity in game loop, transition on entry
- Player spawns at opposite side of new room

### 9. Cutscenes

Use a ref with phase tracking:
```jsx
const cutsceneRef = useRef("pause");  // "pause" → "alert" → "walk" → false
const cutsceneTimerRef = useRef(48);
```

Phases:
1. **"pause"** — NPC stands still, countdown timer
2. **"alert"** — Draw "!" bubble above NPC, countdown timer
3. **"walk"** — NPC walks toward player (cardinal only)
4. **false** — Cutscene over, open chat with greeting

Block player input during all cutscene phases.

### 10. Music

Each level needs its own music theme in `initMusic()`:
```jsx
if (level === N) {
  Tone.getTransport().bpm.value = BPM;
  // Create synths: melody, bass, chime, pad, percussion
  // Define note arrays for each
  // Create Tone.Loop for each instrument
  Tone.getTransport().start();
}
```

Tips:
- Use minor keys for tension/mystery, major for triumph
- Melody: triangle or square wave, sparse phrases
- Bass: square wave, walking or pedal tones
- Chime: sine wave, high sparse notes for atmosphere
- Pad: sine wave, sustained chords
- Percussion: NoiseSynth for rhythm

### 11. Win/Lose Conditions

#### Multiple Choice Accusation (for mystery levels)
```jsx
const [accusation, setAccusation] = useState(null);
// Step through: {step:"who"} → {step:"what",who:"..."} → {step:"where",what:"..."}
// Check answer deterministically, not via LLM
```

#### Direct Win (for puzzle levels)
```jsx
// E.g., choosing the right door
if(correctChoice) onWin();
else setGamePhase("lose");
```

### 12. Mobile-Specific Considerations

- All canvas text must be ~3px larger than desktop
- Chat text: 10px (vs 8px desktop)
- NPC labels: 11px (vs 5px desktop)
- Room titles: 13px (vs 7px desktop)
- Touch controls (D-pad + A button) replace keyboard
- "A" prompt instead of "Z" on canvas
- No auto-focus on input fields (prevents keyboard popup)
- Chat panel inline below map (not overlay)
- Auto-scroll chat messages within container (not page)
- Send button: round gold circle with ▲

### 13. Checklist for New Level

- [ ] Grid size and room layout defined
- [ ] Draw function for each room (floor, walls, doors, decorations)
- [ ] All NPCs have: small sprite, portrait, position, system prompt with backstory
- [ ] All portraits match their small sprites visually
- [ ] NPC positions verified not to overlap with furniture/walls/each other
- [ ] Furniture collision boxes added to walkable check
- [ ] Wandering NPCs have collision checks for furniture
- [ ] Examinable objects with closeup art and descriptions
- [ ] Clue discovery triggers (greetings, API keywords, examinations)
- [ ] Win/lose condition implemented
- [ ] Music theme composed
- [ ] Door transitions working (if multi-room)
- [ ] Cutscene (if any) with proper phases
- [ ] All changes duplicated in GameMobile.jsx
- [ ] Mobile text sizes scaled up
- [ ] Version number incremented
- [ ] Build succeeds, tested on both desktop and mobile
