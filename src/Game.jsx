import { useState, useEffect, useRef, useCallback } from "react";
import * as Tone from "tone";

// ─── Google Font ───
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const FONT = "'Press Start 2P', monospace";

// ─── Shared Constants ───
const TILE = 32;
const SPEED = 2.5;
const INTERACT_DIST = TILE * 2;
const VERSION = "Beta Version 0.22";

// ═══════════════════════════════════════
// MUSIC ENGINE — shared across levels
// ═══════════════════════════════════════
let musicInitDone = false;
let currentGainNode = null;
let currentLevel = null;

async function initMusic(level, muted) {
  if (musicInitDone && currentLevel === level) return;

  // Stop any existing music
  Tone.getTransport().stop();
  Tone.getTransport().cancel();

  if (!musicInitDone) {
    await Tone.start();
    musicInitDone = true;
  }

  const gain = new Tone.Gain(muted ? 0 : 1).toDestination();
  currentGainNode = gain;
  currentLevel = level;

  if (level === 1) {
    // ── Dungeon theme — D minor, dark and tense ──
    Tone.getTransport().bpm.value = 105;
    const mel = new Tone.Synth({ oscillator:{type:"square"}, envelope:{attack:0.01,decay:0.15,sustain:0.3,release:0.1}, volume:-14 }).connect(gain);
    const bas = new Tone.Synth({ oscillator:{type:"square"}, envelope:{attack:0.01,decay:0.1,sustain:0.5,release:0.05}, volume:-18 }).connect(gain);
    const arp = new Tone.Synth({ oscillator:{type:"triangle"}, envelope:{attack:0.01,decay:0.1,sustain:0.2,release:0.05}, volume:-20 }).connect(gain);
    const pad = new Tone.Synth({ oscillator:{type:"sine"}, envelope:{attack:0.3,decay:0.4,sustain:0.3,release:0.5}, volume:-22 }).connect(gain);
    const noi = new Tone.NoiseSynth({ noise:{type:"white"}, envelope:{attack:0.001,decay:0.05,sustain:0,release:0.01}, volume:-24 }).connect(gain);

    const melNotes=["D4","null","F4","null","A4","null","G4","F4","E4","null","D4","null","C4","null","D4","null","D4","null","F4","null","A4","null","Bb4","A4","G4","null","F4","null","E4","null","D4","null","Bb3","null","D4","null","F4","null","A4","null","G4","null","Bb4","null","A4","null","G4","F4","E4","null","G4","null","Bb4","null","A4","null","G4","F4","E4","null","D4","null","null","null","A3","null","C4","null","E4","null","D4","C4","Bb3","null","D4","null","F4","null","E4","D4","C4","null","E4","null","G4","null","F4","E4","D4","null","C4","null","Bb3","null","A3","null","D4","null","F4","E4","D4","null","A4","null","G4","null","F4","null","E4","F4","G4","null","A4","null","Bb4","A4","G4","null","F4","null","E4","null","D4","null","null","null","null","null"];
    let mi=0; new Tone.Loop(t=>{const n=melNotes[mi%melNotes.length];if(n!=="null")mel.triggerAttackRelease(n,"16n",t);mi++;},"8n").start(0);

    const basNotes=["D2","D2","D2","D2","A1","A1","A1","A1","Bb1","Bb1","Bb1","Bb1","A1","A1","A1","A1","Bb1","Bb1","Bb1","Bb1","G1","G1","G1","G1","C2","C2","C2","C2","D2","D2","D2","D2","A1","A1","A1","A1","Bb1","Bb1","Bb1","Bb1","C2","C2","C2","C2","Bb1","Bb1","A1","A1","D2","D2","D2","D2","G1","G1","A1","A1","Bb1","Bb1","A1","A1","D2","D2","D2","D2"];
    let bi=0; new Tone.Loop(t=>{bas.triggerAttackRelease(basNotes[bi%basNotes.length],"8n",t);bi++;},"4n").start(0);

    const arpNotes=["D5","A4","F4","A4","D5","A4","F4","A4","C5","G4","E4","G4","Bb4","F4","D4","F4","Bb4","F4","D4","F4","G4","D4","Bb3","D4","C5","G4","E4","G4","D5","A4","F4","A4","A4","E4","C4","E4","Bb4","F4","D4","F4","C5","G4","E4","G4","Bb4","F4","D4","F4","D5","A4","F4","A4","G4","D4","Bb3","D4","A4","F4","D4","F4","D5","A4","F4","A4"];
    let ai=0; new Tone.Loop(t=>{arp.triggerAttackRelease(arpNotes[ai%arpNotes.length],"32n",t);ai++;},"16n").start("2m");

    const padNotes=["D3","null","null","null","Bb2","null","null","null","C3","null","null","null","D3","null","null","null","A2","null","null","null","Bb2","null","null","null","C3","null","null","null","D3","null","null","null"];
    let pdi=0; new Tone.Loop(t=>{const n=padNotes[pdi%padNotes.length];if(n!=="null")pad.triggerAttackRelease(n,"2n",t);pdi++;},"2n").start("4m");

    let pi=0; new Tone.Loop(t=>{if(pi%4===0||pi%4===2)noi.triggerAttackRelease("16n",t);pi++;},"8n").start(0);
  }

  if (level === 2) {
    // ── Posh museum mystery — Cm/Eb, elegant suspense with noir undertones ──
    Tone.getTransport().bpm.value = 95;
    const mel = new Tone.Synth({ oscillator:{type:"triangle"}, envelope:{attack:0.03,decay:0.25,sustain:0.25,release:0.3}, volume:-13 }).connect(gain);
    const bas = new Tone.Synth({ oscillator:{type:"square"}, envelope:{attack:0.01,decay:0.12,sustain:0.45,release:0.08}, volume:-17 }).connect(gain);
    const chime = new Tone.Synth({ oscillator:{type:"sine"}, envelope:{attack:0.01,decay:0.4,sustain:0.08,release:0.5}, volume:-20 }).connect(gain);
    const pad = new Tone.Synth({ oscillator:{type:"sine"}, envelope:{attack:0.5,decay:0.4,sustain:0.35,release:0.6}, volume:-21 }).connect(gain);
    const noi = new Tone.NoiseSynth({ noise:{type:"white"}, envelope:{attack:0.001,decay:0.04,sustain:0,release:0.01}, volume:-27 }).connect(gain);

    // Melody — elegant, suspicious phrases in C minor with chromatic tension
    const melNotes=["C5","null","null","Eb5","null","null","G5","null","F5","null","Eb5","null","D5","null","null","null","null","null","null","null","Bb4","null","null","C5","null","null","D5","null","Eb5","null","D5","null","C5","null","null","null","null","null","null","null","Ab4","null","null","Bb4","null","null","C5","null","Eb5","null","D5","null","C5","null","B4","null","C5","null","null","null","null","null","null","null","G5","null","null","F5","null","null","Eb5","null","null","null","D5","null","null","null","C5","null","null","null","null","null","null","null","Eb5","null","null","D5","null","null","C5","null","Bb4","null","Ab4","null","G4","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null"];
    let mi=0; new Tone.Loop(t=>{const n=melNotes[mi%melNotes.length];if(n!=="null")mel.triggerAttackRelease(n,"8n",t);mi++;},"8n").start(0);

    // Bass — sophisticated walking bass with minor color
    const basNotes=["C2","C2","Eb2","G2","Ab1","Ab1","C2","Eb2","Bb1","Bb1","D2","F2","G1","G1","B1","D2","Ab1","Ab1","C2","Eb2","Bb1","Bb1","D2","F2","G1","G1","B1","D2","C2","C2","C2","C2"];
    let bi=0; new Tone.Loop(t=>{bas.triggerAttackRelease(basNotes[bi%basNotes.length],"8n",t);bi++;},"4n").start(0);

    // Chime — high glass-like tones, like a chandelier tinkling
    const chimeNotes=["G6","null","null","null","null","null","null","null","Eb6","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","C6","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null","Ab5","null","null","null","null","null","null","null","null","null","null","null","null","null","null","null"];
    let ci=0; new Tone.Loop(t=>{const n=chimeNotes[ci%chimeNotes.length];if(n!=="null")chime.triggerAttackRelease(n,"4n",t);ci++;},"4n").start("2m");

    // Pad — dark, rich sustained chords evoking velvet curtains
    const padNotes=["C3","null","null","null","null","null","null","null","Ab2","null","null","null","null","null","null","null","Bb2","null","null","null","null","null","null","null","G2","null","null","null","null","null","null","null"];
    let pdi=0; new Tone.Loop(t=>{const n=padNotes[pdi%padNotes.length];if(n!=="null")pad.triggerAttackRelease(n,"1n",t);pdi++;},"2n").start("1m");

    // Percussion — soft ticking like a grandfather clock
    let pi=0; new Tone.Loop(t=>{if(pi%4===0)noi.triggerAttackRelease("32n",t);pi++;},"8n").start(0);
  }

  Tone.getTransport().start();
}

function setMusicGain(muted) {
  if (currentGainNode) currentGainNode.gain.rampTo(muted ? 0 : 1, 0.1);
}

// ═══════════════════════════════════════
// SHARED DRAWING HELPERS
// ═══════════════════════════════════════
function drawPlayer(ctx, x, y, dir, frame) {
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(x+6,y+28,20,4);
  const lo = frame%2===0?0:2;
  ctx.fillStyle="#5a3a20";
  ctx.fillRect(x+7,y+24,7,8-lo); ctx.fillRect(x+18,y+24,7,8+lo-2);
  ctx.fillStyle="#7a5a30";
  ctx.fillRect(x+7,y+24,7,2); ctx.fillRect(x+18,y+24,7,2);
  ctx.fillStyle="#3a3a5c";
  ctx.fillRect(x+8,y+20,6,6); ctx.fillRect(x+18,y+20,6,6);
  ctx.fillStyle="#5b8dd9";
  ctx.fillRect(x+6,y+13,20,9);
  ctx.fillStyle="#6ea0e8";
  ctx.fillRect(x+8,y+14,4,7);
  ctx.fillStyle="#8b6914";
  ctx.fillRect(x+6,y+20,20,2);
  ctx.fillStyle="#e8d070";
  ctx.fillRect(x+14,y+19,4,4);
  if(dir==="down"||dir==="left"||dir==="right"){
    ctx.fillStyle="#2a6030";
    if(dir==="down"){ctx.fillRect(x+4,y+14,3,12);ctx.fillRect(x+25,y+14,3,12);}
    else if(dir==="left")ctx.fillRect(x+24,y+13,4,13);
    else ctx.fillRect(x+4,y+13,4,13);
  }
  ctx.fillStyle="#5b8dd9";
  ctx.fillRect(x+3,y+14,4,7); ctx.fillRect(x+25,y+14,4,7);
  ctx.fillStyle="#fdd";
  ctx.fillRect(x+3,y+20,4,2); ctx.fillRect(x+25,y+20,4,2);
  ctx.fillStyle="#fdd";
  ctx.fillRect(x+9,y+2,14,12);
  ctx.fillStyle="#e8d070";
  ctx.fillRect(x+8,y+1,16,5); ctx.fillRect(x+8,y+1,3,8); ctx.fillRect(x+21,y+1,3,8);
  if(dir!=="up"){
    const s=dir==="left"?-2:dir==="right"?2:0;
    ctx.fillStyle="#fff";
    ctx.fillRect(x+11+s,y+6,4,3); ctx.fillRect(x+18+s,y+6,4,3);
    ctx.fillStyle="#2244aa";
    ctx.fillRect(x+13+s,y+7,2,2); ctx.fillRect(x+20+s,y+7,2,2);
  }
  if(dir==="down"){ctx.fillStyle="#c88";ctx.fillRect(x+14,y+11,4,1);}
}

function drawGuard(ctx, x, y, side) {
  const isLeft=side==="left";
  const primary=isLeft?"#b04040":"#3050a0";
  const primaryLight=isLeft?"#d06060":"#5070c0";
  const primaryDark=isLeft?"#802020":"#203070";
  const mL="#c0c0c8",mM="#909098",mD="#606068";
  ctx.fillStyle="rgba(0,0,0,0.25)"; ctx.fillRect(x+4,y+28,24,4);
  ctx.fillStyle=mD; ctx.fillRect(x+7,y+24,8,8); ctx.fillRect(x+17,y+24,8,8);
  ctx.fillStyle=mM; ctx.fillRect(x+8,y+24,6,2); ctx.fillRect(x+18,y+24,6,2);
  ctx.fillStyle=mD; ctx.fillRect(x+9,y+20,6,5); ctx.fillRect(x+17,y+20,6,5);
  ctx.fillStyle=primaryDark; ctx.fillRect(x+5,y+12,22,10);
  ctx.fillStyle=primary; ctx.fillRect(x+7,y+13,18,8);
  ctx.fillStyle=primaryLight; ctx.fillRect(x+14,y+14,4,5); ctx.fillRect(x+12,y+16,8,1);
  ctx.fillStyle=mL; ctx.fillRect(x+2,y+11,7,5); ctx.fillRect(x+23,y+11,7,5);
  ctx.fillStyle=mM; ctx.fillRect(x+3,y+14,5,2); ctx.fillRect(x+24,y+14,5,2);
  ctx.fillStyle=primary; ctx.fillRect(x+3,y+16,5,6); ctx.fillRect(x+24,y+16,5,6);
  ctx.fillStyle=mM; ctx.fillRect(x+3,y+21,5,2); ctx.fillRect(x+24,y+21,5,2);
  ctx.fillStyle="#5a4020"; ctx.fillRect(x+6,y+21,20,2);
  ctx.fillStyle=mD; ctx.fillRect(x+8,y+0,16,13);
  ctx.fillStyle=mM; ctx.fillRect(x+9,y+1,14,4);
  ctx.fillStyle=mL; ctx.fillRect(x+11,y+1,10,2);
  ctx.fillStyle=primary; ctx.fillRect(x+13,y-3,6,4);
  ctx.fillStyle=primaryLight; ctx.fillRect(x+14,y-3,4,2);
  ctx.fillStyle="#1a0a0a"; ctx.fillRect(x+10,y+6,12,3);
  ctx.fillStyle=isLeft?"#ff6644":"#44aaff";
  ctx.fillRect(x+12,y+7,2,1); ctx.fillRect(x+18,y+7,2,1);
  ctx.fillStyle=mD; ctx.fillRect(x+10,y+10,12,3);
  ctx.fillStyle=mM; ctx.fillRect(x+12,y+10,8,1);
  const sx=isLeft?x-2:x+28;
  ctx.fillStyle="#6b4226"; ctx.fillRect(sx,y-6,3,36);
  ctx.fillStyle=mL; ctx.fillRect(sx-1,y-10,5,6);
  ctx.fillStyle="#ddd"; ctx.fillRect(sx,y-12,3,3);
}

// ── Museum NPCs ──
function drawVPMauve(ctx, x, y) {
  // Professional woman in mauve/purple business attire
  ctx.fillStyle="rgba(0,0,0,0.2)"; ctx.fillRect(x+6,y+28,20,4);
  // Shoes
  ctx.fillStyle="#2a1a2a"; ctx.fillRect(x+8,y+26,7,6); ctx.fillRect(x+17,y+26,7,6);
  // Legs/skirt
  ctx.fillStyle="#6b3a6b"; ctx.fillRect(x+7,y+18,18,10);
  ctx.fillStyle="#7a4a7a"; ctx.fillRect(x+9,y+18,14,3);
  // Blazer
  ctx.fillStyle="#8b5a8b"; ctx.fillRect(x+5,y+10,22,10);
  ctx.fillStyle="#9b6a9b"; ctx.fillRect(x+7,y+11,8,8);
  // Lapels
  ctx.fillStyle="#6b3a6b"; ctx.fillRect(x+14,y+11,3,8);
  // Arms
  ctx.fillStyle="#8b5a8b"; ctx.fillRect(x+3,y+11,4,8); ctx.fillRect(x+25,y+11,4,8);
  ctx.fillStyle="#e8c8b8"; ctx.fillRect(x+3,y+18,4,2); ctx.fillRect(x+25,y+18,4,2);
  // Head
  ctx.fillStyle="#e8c8b8"; ctx.fillRect(x+9,y+1,14,10);
  // Hair — dark styled bob
  ctx.fillStyle="#3a1a3a"; ctx.fillRect(x+8,y-1,16,6); ctx.fillRect(x+7,y+0,3,8); ctx.fillRect(x+22,y+0,3,8);
  // Glasses
  ctx.fillStyle="#444"; ctx.fillRect(x+10,y+4,5,3); ctx.fillRect(x+17,y+4,5,3);
  ctx.fillStyle="#88ccff"; ctx.fillRect(x+11,y+5,3,1); ctx.fillRect(x+18,y+5,3,1);
  ctx.fillStyle="#444"; ctx.fillRect(x+15,y+5,2,1);
  // Eyes behind glasses
  ctx.fillStyle="#221144"; ctx.fillRect(x+12,y+5,2,2); ctx.fillRect(x+19,y+5,2,2);
  // Mouth
  ctx.fillStyle="#c88888"; ctx.fillRect(x+13,y+8,6,1);
  // Briefcase
  ctx.fillStyle="#5a3a1a"; ctx.fillRect(x+26,y+16,5,6);
  ctx.fillStyle="#8b6a3a"; ctx.fillRect(x+27,y+15,3,2);
}

function drawViscountEminence(ctx, x, y) {
  // Vampiric aristocrat in dark purple/black with high collar
  ctx.fillStyle="rgba(0,0,0,0.2)"; ctx.fillRect(x+6,y+28,20,4);
  // Boots
  ctx.fillStyle="#1a1a1a"; ctx.fillRect(x+8,y+25,7,7); ctx.fillRect(x+17,y+25,7,7);
  ctx.fillStyle="#2a2a2a"; ctx.fillRect(x+8,y+25,7,2); ctx.fillRect(x+17,y+25,7,2);
  // Trousers
  ctx.fillStyle="#1a0a2a"; ctx.fillRect(x+9,y+20,6,6); ctx.fillRect(x+17,y+20,6,6);
  // Long coat
  ctx.fillStyle="#2a0a3a"; ctx.fillRect(x+5,y+8,22,14);
  ctx.fillStyle="#3a1a4a"; ctx.fillRect(x+7,y+9,18,6);
  // High collar
  ctx.fillStyle="#2a0a3a"; ctx.fillRect(x+7,y+5,4,6); ctx.fillRect(x+21,y+5,4,6);
  // Vest
  ctx.fillStyle="#8b1a1a"; ctx.fillRect(x+11,y+10,10,6);
  ctx.fillStyle="#aa3030"; ctx.fillRect(x+15,y+10,2,6);
  // Arms
  ctx.fillStyle="#2a0a3a"; ctx.fillRect(x+2,y+9,5,10); ctx.fillRect(x+25,y+9,5,10);
  ctx.fillStyle="#d8c8b8"; ctx.fillRect(x+2,y+18,5,2); ctx.fillRect(x+25,y+18,5,2);
  // Cape edges
  ctx.fillStyle="#1a0020"; ctx.fillRect(x+3,y+20,4,6); ctx.fillRect(x+25,y+20,4,6);
  // Head — pale
  ctx.fillStyle="#e8ddd8"; ctx.fillRect(x+9,y-1,14,10);
  // Hair — slicked back, dark
  ctx.fillStyle="#0a0a14"; ctx.fillRect(x+8,y-3,16,5);
  ctx.fillStyle="#0a0a14"; ctx.fillRect(x+8,y-2,2,6); ctx.fillRect(x+22,y-2,2,6);
  // Widow's peak
  ctx.fillStyle="#0a0a14"; ctx.fillRect(x+14,y-2,4,3);
  // Eyes — piercing
  ctx.fillStyle="#fff"; ctx.fillRect(x+11,y+2,4,3); ctx.fillRect(x+18,y+2,4,3);
  ctx.fillStyle="#880000"; ctx.fillRect(x+13,y+3,2,2); ctx.fillRect(x+20,y+3,2,2);
  // Thin mustache
  ctx.fillStyle="#0a0a14"; ctx.fillRect(x+11,y+6,10,1);
  // Mouth
  ctx.fillStyle="#882222"; ctx.fillRect(x+13,y+7,6,1);
  // Monocle
  ctx.fillStyle="#ddd"; ctx.fillRect(x+17,y+1,6,5);
  ctx.fillStyle="#88bbdd"; ctx.fillRect(x+18,y+2,4,3);
  ctx.fillStyle="#ddd"; ctx.fillRect(x+22,y+4,1,6);
}

function drawDuchessVermillion(ctx, x, y) {
  // Elderly elegant duchess in red/vermillion gown, white hair
  ctx.fillStyle="rgba(0,0,0,0.2)"; ctx.fillRect(x+6,y+28,20,4);
  // Shoes
  ctx.fillStyle="#6b2020"; ctx.fillRect(x+9,y+27,6,5); ctx.fillRect(x+17,y+27,6,5);
  // Gown — flowing
  ctx.fillStyle="#cc3030"; ctx.fillRect(x+5,y+14,22,14);
  ctx.fillStyle="#dd4444"; ctx.fillRect(x+7,y+15,18,4);
  ctx.fillStyle="#bb2020"; ctx.fillRect(x+4,y+24,24,4);
  // Bodice
  ctx.fillStyle="#aa2020"; ctx.fillRect(x+7,y+8,18,8);
  ctx.fillStyle="#cc3030"; ctx.fillRect(x+9,y+9,14,6);
  // Necklace
  ctx.fillStyle="#e8d070"; ctx.fillRect(x+10,y+8,12,1);
  ctx.fillStyle="#ff4444"; ctx.fillRect(x+14,y+9,4,2);
  // Arms
  ctx.fillStyle="#aa2020"; ctx.fillRect(x+3,y+9,5,8); ctx.fillRect(x+24,y+9,5,8);
  ctx.fillStyle="#e8c8b8"; ctx.fillRect(x+3,y+16,5,2); ctx.fillRect(x+24,y+16,5,2);
  // Gloves
  ctx.fillStyle="#eee"; ctx.fillRect(x+3,y+14,5,3); ctx.fillRect(x+24,y+14,5,3);
  // Head
  ctx.fillStyle="#e8c8b8"; ctx.fillRect(x+9,y-1,14,10);
  // White hair — updo
  ctx.fillStyle="#ddd"; ctx.fillRect(x+8,y-4,16,7);
  ctx.fillStyle="#ccc"; ctx.fillRect(x+10,y-5,12,3);
  ctx.fillStyle="#ddd"; ctx.fillRect(x+7,y-1,3,6); ctx.fillRect(x+22,y-1,3,6);
  // Hair pin
  ctx.fillStyle="#e8d070"; ctx.fillRect(x+18,y-4,2,3);
  // Eyes
  ctx.fillStyle="#fff"; ctx.fillRect(x+11,y+2,4,3); ctx.fillRect(x+18,y+2,4,3);
  ctx.fillStyle="#336633"; ctx.fillRect(x+13,y+3,2,2); ctx.fillRect(x+20,y+3,2,2);
  // Subtle smile
  ctx.fillStyle="#c08080"; ctx.fillRect(x+13,y+7,6,1);
  // Fan in hand
  ctx.fillStyle="#e8d070"; ctx.fillRect(x+26,y+10,2,6);
  ctx.fillStyle="#dd4444"; ctx.fillRect(x+27,y+8,5,8);
  ctx.fillStyle="#cc3030"; ctx.fillRect(x+28,y+9,3,6);
}

function drawPoliceman(ctx, x, y) {
  ctx.fillStyle="rgba(0,0,0,0.2)"; ctx.fillRect(x+6,y+28,20,4);
  // Boots
  ctx.fillStyle="#1a1a1a"; ctx.fillRect(x+8,y+25,7,7); ctx.fillRect(x+17,y+25,7,7);
  // Pants
  ctx.fillStyle="#1a1a40"; ctx.fillRect(x+9,y+19,6,7); ctx.fillRect(x+17,y+19,6,7);
  // Belt
  ctx.fillStyle="#2a2a2a"; ctx.fillRect(x+7,y+18,18,2);
  ctx.fillStyle="#e8d070"; ctx.fillRect(x+14,y+17,4,4);
  // Shirt
  ctx.fillStyle="#2244aa"; ctx.fillRect(x+6,y+8,20,11);
  ctx.fillStyle="#2a50bb"; ctx.fillRect(x+8,y+9,16,4);
  // Badge
  ctx.fillStyle="#e8d070"; ctx.fillRect(x+18,y+10,4,4);
  ctx.fillStyle="#cc9920"; ctx.fillRect(x+19,y+11,2,2);
  // Arms
  ctx.fillStyle="#2244aa"; ctx.fillRect(x+3,y+9,5,8); ctx.fillRect(x+24,y+9,5,8);
  ctx.fillStyle="#e8c8b8"; ctx.fillRect(x+3,y+16,5,2); ctx.fillRect(x+24,y+16,5,2);
  // Head
  ctx.fillStyle="#d8b8a0"; ctx.fillRect(x+9,y+0,14,9);
  // Hat
  ctx.fillStyle="#1a1a40"; ctx.fillRect(x+7,y-4,18,6);
  ctx.fillStyle="#2244aa"; ctx.fillRect(x+8,y-3,16,4);
  ctx.fillStyle="#e8d070"; ctx.fillRect(x+13,y-3,6,2);
  ctx.fillStyle="#1a1a40"; ctx.fillRect(x+6,y+1,20,2);
  // Eyes
  ctx.fillStyle="#fff"; ctx.fillRect(x+11,y+3,4,2); ctx.fillRect(x+18,y+3,4,2);
  ctx.fillStyle="#334"; ctx.fillRect(x+13,y+3,2,2); ctx.fillRect(x+20,y+3,2,2);
  // Mustache
  ctx.fillStyle="#5a4a30"; ctx.fillRect(x+11,y+6,10,2);
  ctx.fillRect(x+10,y+6,2,1); ctx.fillRect(x+20,y+6,2,1);
}

// -- New Museum NPCs --
function drawLeadDetective(ctx, x, y) {
  ctx.fillStyle="rgba(0,0,0,0.2)"; ctx.fillRect(x+6,y+28,20,4);
  ctx.fillStyle="#3a2a1a"; ctx.fillRect(x+8,y+26,7,6); ctx.fillRect(x+17,y+26,7,6);
  ctx.fillStyle="#4a3a2a"; ctx.fillRect(x+9,y+20,6,7); ctx.fillRect(x+17,y+20,6,7);
  ctx.fillStyle="#b89868"; ctx.fillRect(x+5,y+8,22,14);
  ctx.fillStyle="#c8a878"; ctx.fillRect(x+7,y+9,18,12);
  ctx.fillStyle="#5a4020"; ctx.fillRect(x+6,y+16,20,2);
  ctx.fillStyle="#e8d070"; ctx.fillRect(x+14,y+15,4,4);
  ctx.fillStyle="#a08858"; ctx.fillRect(x+13,y+9,2,8); ctx.fillRect(x+17,y+9,2,8);
  ctx.fillStyle="#b89868"; ctx.fillRect(x+3,y+9,4,10); ctx.fillRect(x+25,y+9,4,10);
  ctx.fillStyle="#e8c8b8"; ctx.fillRect(x+3,y+18,4,2); ctx.fillRect(x+25,y+18,4,2);
  ctx.fillStyle="#eee"; ctx.fillRect(x+26,y+14,4,6);
  ctx.fillStyle="#aaa"; ctx.fillRect(x+26,y+14,4,1);
  ctx.fillStyle="#d8b8a0"; ctx.fillRect(x+9,y+0,14,10);
  ctx.fillStyle="#6b5030"; ctx.fillRect(x+7,y-4,18,6);
  ctx.fillStyle="#8b6a40"; ctx.fillRect(x+9,y-3,14,4);
  ctx.fillStyle="#6b5030"; ctx.fillRect(x+6,y+1,20,2);
  ctx.fillStyle="#fff"; ctx.fillRect(x+11,y+3,4,3); ctx.fillRect(x+18,y+3,4,3);
  ctx.fillStyle="#334"; ctx.fillRect(x+13,y+4,2,2); ctx.fillRect(x+20,y+4,2,2);
  ctx.fillStyle="#b0a090"; ctx.fillRect(x+11,y+7,10,2);
  ctx.fillStyle="#b08070"; ctx.fillRect(x+13,y+8,6,1);
}

function drawSoothsayer(ctx, x, y) {
  ctx.fillStyle="rgba(0,0,0,0.2)"; ctx.fillRect(x+6,y+28,20,4);
  // Boots
  ctx.fillStyle="#1a0a2a"; ctx.fillRect(x+8,y+26,7,6); ctx.fillRect(x+17,y+26,7,6);
  // Flowing robe
  ctx.fillStyle="#2a1040"; ctx.fillRect(x+5,y+6,22,22);
  ctx.fillStyle="#3a1a50"; ctx.fillRect(x+7,y+8,18,18);
  // Star/moon patterns on robe
  ctx.fillStyle="#e8d070"; ctx.fillRect(x+9,y+12,2,2); ctx.fillRect(x+20,y+16,2,2);
  ctx.fillStyle="#c8b060"; ctx.fillRect(x+14,y+22,3,1); ctx.fillRect(x+15,y+21,1,3);
  ctx.fillStyle="#aaa0d0"; ctx.fillRect(x+10,y+18,1,2); ctx.fillRect(x+10,y+17,2,1);
  // Robe glow edge
  var glow=Math.sin(Date.now()/300)*0.3+0.7;
  ctx.fillStyle="rgba(140,100,255,"+glow+")"; ctx.fillRect(x+5,y+26,22,2);
  ctx.fillStyle="rgba(140,100,255,"+(glow*0.5)+")"; ctx.fillRect(x+5,y+6,1,22); ctx.fillRect(x+26,y+6,1,22);
  // Sleeves
  ctx.fillStyle="#2a1040"; ctx.fillRect(x+3,y+10,4,10); ctx.fillRect(x+25,y+10,4,10);
  // Crystal ball glow
  ctx.save();
  ctx.fillStyle="rgba(100,180,255,"+(glow*0.3)+")"; ctx.beginPath(); ctx.arc(x+16,y+23,8,0,Math.PI*2); ctx.fill();
  // Crystal ball
  ctx.fillStyle="rgba(100,180,255,"+glow+")"; ctx.beginPath(); ctx.arc(x+16,y+23,5,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="rgba(150,220,255,"+glow+")"; ctx.beginPath(); ctx.arc(x+16,y+23,3,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#fff"; ctx.fillRect(x+14,y+21,2,2);
  ctx.restore();
  // Hood
  ctx.fillStyle="#1a0830"; ctx.fillRect(x+7,y-2,18,10);
  ctx.fillStyle="#2a1040"; ctx.fillRect(x+9,y-1,14,8);
  ctx.fillStyle="#0e0420"; ctx.fillRect(x+7,y-2,3,8); ctx.fillRect(x+22,y-2,3,8);
  // Shadowed face
  ctx.fillStyle="#c8b0a0"; ctx.fillRect(x+10,y+2,12,6);
  ctx.fillStyle="#a89080"; ctx.fillRect(x+10,y+2,2,4); ctx.fillRect(x+20,y+2,2,4);
  // Glowing eyes — brighter
  ctx.fillStyle="rgba(200,160,255,"+glow+")"; ctx.fillRect(x+12,y+4,3,2); ctx.fillRect(x+18,y+4,3,2);
  ctx.fillStyle="#fff"; ctx.fillRect(x+13,y+4,1,1); ctx.fillRect(x+19,y+4,1,1);
}

function drawForensicsOfficer(ctx, x, y) {
  ctx.fillStyle="rgba(0,0,0,0.2)"; ctx.fillRect(x+6,y+28,20,4);
  ctx.fillStyle="#2a2a2a"; ctx.fillRect(x+8,y+26,7,6); ctx.fillRect(x+17,y+26,7,6);
  ctx.fillStyle="#2a3a4a"; ctx.fillRect(x+9,y+20,6,7); ctx.fillRect(x+17,y+20,6,7);
  ctx.fillStyle="#e8e8ee"; ctx.fillRect(x+5,y+8,22,14);
  ctx.fillStyle="#f0f0f8"; ctx.fillRect(x+7,y+9,18,12);
  ctx.fillStyle="#aaa"; ctx.fillRect(x+15,y+10,2,2); ctx.fillRect(x+15,y+14,2,2);
  ctx.fillStyle="#d0d0d8"; ctx.fillRect(x+8,y+11,5,4);
  ctx.fillStyle="#3388cc"; ctx.fillRect(x+9,y+11,2,3);
  ctx.fillStyle="#e8e8ee"; ctx.fillRect(x+3,y+9,4,8); ctx.fillRect(x+25,y+9,4,8);
  ctx.fillStyle="#aaccee"; ctx.fillRect(x+3,y+16,4,3); ctx.fillRect(x+25,y+16,4,3);
  ctx.fillStyle="#8b6a3a"; ctx.fillRect(x+26,y+12,5,8);
  ctx.fillStyle="#eee"; ctx.fillRect(x+27,y+13,3,6);
  ctx.fillStyle="#e8c8b8"; ctx.fillRect(x+9,y+0,14,10);
  ctx.fillStyle="#5a4030"; ctx.fillRect(x+8,y-2,16,5);
  ctx.fillStyle="#5a4030"; ctx.fillRect(x+8,y-1,2,4); ctx.fillRect(x+22,y-1,2,4);
  ctx.fillStyle="#aaa"; ctx.fillRect(x+10,y+3,5,4); ctx.fillRect(x+17,y+3,5,4);
  ctx.fillStyle="#cceeff"; ctx.fillRect(x+11,y+4,3,2); ctx.fillRect(x+18,y+4,3,2);
  ctx.fillStyle="#aaa"; ctx.fillRect(x+15,y+4,2,1);
  ctx.fillStyle="#334"; ctx.fillRect(x+12,y+4,2,2); ctx.fillRect(x+19,y+4,2,2);
  ctx.fillStyle="#b08070"; ctx.fillRect(x+13,y+7,6,1);
}

function drawZPrompt(ctx, x, y) {
  ctx.fillStyle="#000"; ctx.fillRect(x+4,y-18,24,16);
  ctx.fillStyle="#e8d070"; ctx.strokeStyle="#e8d070"; ctx.strokeRect(x+4,y-18,24,16);
  ctx.font="8px "+FONT; ctx.textAlign="center"; ctx.fillText("Z",x+16,y-6); ctx.textAlign="left";
}

// ═══════════════════════════════════════
// GUARD PORTRAITS (for Level 1 chat)
// ═══════════════════════════════════════
function drawPortraitGuardLeft(ctx) {
  const p="#b04040",pL="#d06060",pD="#802020";
  const mL="#c0c0c8",mM="#909098",mD="#606068";
  ctx.fillStyle="#0e0608";ctx.fillRect(0,0,96,96);
  // Shoulders — metal armor with red accents
  ctx.fillStyle=mD;ctx.fillRect(4,62,88,34);
  ctx.fillStyle=mM;ctx.fillRect(10,64,76,30);
  ctx.fillStyle=pD;ctx.fillRect(12,65,72,28);
  ctx.fillStyle=p;ctx.fillRect(16,67,64,24);
  ctx.fillStyle=pL;ctx.fillRect(38,68,20,20);
  ctx.fillStyle=pL;ctx.fillRect(42,70,12,4);ctx.fillRect(44,76,8,4);
  // Metal arm guards
  ctx.fillStyle=mL;ctx.fillRect(4,58,18,12);ctx.fillRect(74,58,18,12);
  ctx.fillStyle=mM;ctx.fillRect(6,66,14,6);ctx.fillRect(76,66,14,6);
  ctx.fillStyle=p;ctx.fillRect(6,72,14,14);ctx.fillRect(76,72,14,14);
  // Belt
  ctx.fillStyle="#5a4020";ctx.fillRect(12,86,72,4);
  ctx.fillStyle="#e8d070";ctx.fillRect(42,86,12,4);
  // Helmet — full metal with red crest
  ctx.fillStyle=mD;ctx.fillRect(18,4,60,56);
  ctx.fillStyle=mM;ctx.fillRect(22,6,52,50);
  ctx.fillStyle=mL;ctx.fillRect(28,8,40,10);
  // Red crest on top
  ctx.fillStyle=p;ctx.fillRect(38,-2,20,12);
  ctx.fillStyle=pL;ctx.fillRect(40,-2,16,6);
  // Visor slit — dark opening
  ctx.fillStyle="#1a0a0a";ctx.fillRect(24,28,48,10);
  ctx.fillStyle="#0a0404";ctx.fillRect(26,30,44,6);
  // Glowing red eyes behind visor
  ctx.fillStyle="#ff6644";ctx.fillRect(32,31,8,4);ctx.fillRect(56,31,8,4);
  ctx.fillStyle="#ffaa66";ctx.fillRect(34,32,4,2);ctx.fillRect(58,32,4,2);
  // Nose guard
  ctx.fillStyle=mD;ctx.fillRect(44,26,8,20);
  ctx.fillStyle=mM;ctx.fillRect(45,28,6,16);
  // Chin guard
  ctx.fillStyle=mD;ctx.fillRect(24,44,48,12);
  ctx.fillStyle=mM;ctx.fillRect(28,44,40,8);
  ctx.fillStyle=mD;ctx.fillRect(36,50,24,6);
  // Spear (left side)
  ctx.fillStyle="#6b4226";ctx.fillRect(0,0,6,96);
  ctx.fillStyle=mL;ctx.fillRect(-2,-4,10,14);
  ctx.fillStyle="#ddd";ctx.fillRect(0,-6,6,6);
}

function drawPortraitGuardRight(ctx) {
  const p="#3050a0",pL="#5070c0",pD="#203070";
  const mL="#c0c0c8",mM="#909098",mD="#606068";
  ctx.fillStyle="#06080e";ctx.fillRect(0,0,96,96);
  // Shoulders — metal armor with blue accents
  ctx.fillStyle=mD;ctx.fillRect(4,62,88,34);
  ctx.fillStyle=mM;ctx.fillRect(10,64,76,30);
  ctx.fillStyle=pD;ctx.fillRect(12,65,72,28);
  ctx.fillStyle=p;ctx.fillRect(16,67,64,24);
  ctx.fillStyle=pL;ctx.fillRect(38,68,20,20);
  ctx.fillStyle=pL;ctx.fillRect(42,70,12,4);ctx.fillRect(44,76,8,4);
  // Metal arm guards
  ctx.fillStyle=mL;ctx.fillRect(4,58,18,12);ctx.fillRect(74,58,18,12);
  ctx.fillStyle=mM;ctx.fillRect(6,66,14,6);ctx.fillRect(76,66,14,6);
  ctx.fillStyle=p;ctx.fillRect(6,72,14,14);ctx.fillRect(76,72,14,14);
  // Belt
  ctx.fillStyle="#5a4020";ctx.fillRect(12,86,72,4);
  ctx.fillStyle="#e8d070";ctx.fillRect(42,86,12,4);
  // Helmet — full metal with blue crest
  ctx.fillStyle=mD;ctx.fillRect(18,4,60,56);
  ctx.fillStyle=mM;ctx.fillRect(22,6,52,50);
  ctx.fillStyle=mL;ctx.fillRect(28,8,40,10);
  // Blue crest on top
  ctx.fillStyle=p;ctx.fillRect(38,-2,20,12);
  ctx.fillStyle=pL;ctx.fillRect(40,-2,16,6);
  // Visor slit — dark opening
  ctx.fillStyle="#1a0a0a";ctx.fillRect(24,28,48,10);
  ctx.fillStyle="#0a0408";ctx.fillRect(26,30,44,6);
  // Glowing blue eyes behind visor
  ctx.fillStyle="#44aaff";ctx.fillRect(32,31,8,4);ctx.fillRect(56,31,8,4);
  ctx.fillStyle="#88ccff";ctx.fillRect(34,32,4,2);ctx.fillRect(58,32,4,2);
  // Nose guard
  ctx.fillStyle=mD;ctx.fillRect(44,26,8,20);
  ctx.fillStyle=mM;ctx.fillRect(45,28,6,16);
  // Chin guard
  ctx.fillStyle=mD;ctx.fillRect(24,44,48,12);
  ctx.fillStyle=mM;ctx.fillRect(28,44,40,8);
  ctx.fillStyle=mD;ctx.fillRect(36,50,24,6);
  // Spear (right side)
  ctx.fillStyle="#6b4226";ctx.fillRect(90,0,6,96);
  ctx.fillStyle=mL;ctx.fillRect(88,-4,10,14);
  ctx.fillStyle="#ddd";ctx.fillRect(90,-6,6,6);
}

// ═══════════════════════════════════════
// LEVEL 1 — THE TWO GUARDS
// ═══════════════════════════════════════
const L1_COLS=16, L1_ROWS=11, L1_W=L1_COLS*TILE, L1_H=L1_ROWS*TILE;
const GUARD_L={col:5,row:5}, GUARD_R={col:10,row:5};
const DOOR_L={col:5,row:1}, DOOR_R={col:10,row:1};

function drawDungeon(ctx) {
  for(let r=0;r<L1_ROWS;r++)for(let c=0;c<L1_COLS;c++){
    const v=((r*7+c*13)%5);const base=58+v*3;
    ctx.fillStyle=`rgb(${base},${base-5},${base-10})`;
    ctx.fillRect(c*TILE,r*TILE,TILE,TILE);
    ctx.strokeStyle="rgba(0,0,0,0.15)"; ctx.strokeRect(c*TILE,r*TILE,TILE,TILE);
  }
  for(let c=0;c<L1_COLS;c++){
    if(c===DOOR_L.col||c===DOOR_R.col)continue;
    ctx.fillStyle="#3a3040";ctx.fillRect(c*TILE,0,TILE,TILE*2);
    ctx.fillStyle="#2a2030";ctx.fillRect(c*TILE+2,2,TILE-4,TILE*2-4);
    ctx.strokeStyle="rgba(80,60,70,0.5)";ctx.beginPath();ctx.moveTo(c*TILE,TILE);ctx.lineTo(c*TILE+TILE,TILE);ctx.stroke();
  }
  for(let r=0;r<L1_ROWS;r++){
    ctx.fillStyle="#3a3040";ctx.fillRect(0,r*TILE,TILE,TILE);ctx.fillStyle="#2a2030";ctx.fillRect(2,r*TILE+2,TILE-4,TILE-4);
    ctx.fillStyle="#3a3040";ctx.fillRect((L1_COLS-1)*TILE,r*TILE,TILE,TILE);ctx.fillStyle="#2a2030";ctx.fillRect((L1_COLS-1)*TILE+2,r*TILE+2,TILE-4,TILE-4);
  }
  for(let c=0;c<L1_COLS;c++){ctx.fillStyle="#3a3040";ctx.fillRect(c*TILE,(L1_ROWS-1)*TILE,TILE,TILE);ctx.fillStyle="#2a2030";ctx.fillRect(c*TILE+2,(L1_ROWS-1)*TILE+2,TILE-4,TILE-4);}
  // Doors
  [DOOR_L,DOOR_R].forEach(d=>{
    ctx.fillStyle="#1a0a00";ctx.fillRect(d.col*TILE,0,TILE,TILE*2);
    ctx.fillStyle="#6b3a1a";ctx.fillRect(d.col*TILE+3,3,TILE-6,TILE*2-3);
    ctx.fillStyle="#e8d070";ctx.fillRect(d.col*TILE+22,TILE,4,4);
  });
  ctx.fillStyle="#e8d070";ctx.font="7px "+FONT;ctx.textAlign="center";
  ctx.fillText("DOOR 1",DOOR_L.col*TILE+16,TILE*2+14);
  ctx.fillText("DOOR 2",DOOR_R.col*TILE+16,TILE*2+14);
  ctx.textAlign="left";
  // Torches
  const t=Date.now();
  [[2*TILE+12,TILE+8],[13*TILE+12,TILE+8],[2*TILE+12,7*TILE],[13*TILE+12,7*TILE]].forEach(([tx,ty])=>{
    ctx.fillStyle="#4a3020";ctx.fillRect(tx,ty,6,14);
    const f=Math.sin(t/100+tx)*2;
    ctx.fillStyle="#ff6622";ctx.fillRect(tx-2,ty-6+f,10,8);
    ctx.fillStyle="#ffaa22";ctx.fillRect(tx,ty-4+f,6,5);
    ctx.fillStyle="#ffee66";ctx.fillRect(tx+1,ty-2+f,4,3);
  });
  // Chains
  [[3*TILE+14,3*TILE],[12*TILE+14,3*TILE]].forEach(([cx,cy])=>{
    ctx.strokeStyle="#666";ctx.lineWidth=2;
    for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(cx,cy+i*8,3,0,Math.PI*2);ctx.stroke();}
    ctx.lineWidth=1;
  });
  // Skulls
  [[8*TILE,8*TILE],[7*TILE,6*TILE]].forEach(([sx,sy])=>{
    ctx.fillStyle="#aaa";ctx.fillRect(sx+4,sy+4,10,8);ctx.fillRect(sx+6,sy+2,6,4);
    ctx.fillStyle="#333";ctx.fillRect(sx+6,sy+6,2,2);ctx.fillRect(sx+10,sy+6,2,2);
  });
  ctx.fillStyle="#8b3a3a";ctx.fillRect(4*TILE,6*TILE,8*TILE,2*TILE);
  ctx.fillStyle="#a04848";ctx.fillRect(4*TILE+4,6*TILE+4,8*TILE-8,2*TILE-8);
}

// ─── Typewriter hook for hardcoded dialogue ───
function useTypewriter() {
  const [typingText, setTypingText] = useState(null);
  const typingRef = useRef(null);
  const startTyping = useCallback((key, text, speed = 25) => {
    if (typingRef.current) clearInterval(typingRef.current);
    setTypingText({ key, full: text, current: "", index: 0 });
    let idx = 0;
    typingRef.current = setInterval(() => {
      idx++;
      if (idx >= text.length) {
        clearInterval(typingRef.current);
        typingRef.current = null;
        setTypingText(prev => prev ? { ...prev, current: prev.full } : null);
      } else {
        setTypingText(prev => prev ? { ...prev, current: text.slice(0, idx + 1), index: idx } : null);
      }
    }, speed);
  }, []);
  const stopTyping = useCallback(() => {
    if (typingRef.current) clearInterval(typingRef.current);
    typingRef.current = null;
    setTypingText(prev => prev ? { ...prev, current: prev.full } : null);
  }, []);
  useEffect(() => () => { if (typingRef.current) clearInterval(typingRef.current); }, []);
  return { typingText, startTyping, stopTyping };
}

function Level1({ onWin, onRestart, muted, setMuted, muteBtn, startMusicForLevel, apiKey, model }) {
  const canvasRef=useRef(null);
  const keysRef=useRef({});
  const playerRef=useRef({x:7.5*TILE,y:8*TILE,dir:"up",frame:0,tick:0});
  const [gamePhase,setGamePhase]=useState("intro");
  const [safeDoor]=useState(()=>Math.random()<0.5?"left":"right");
  const [liarGuard]=useState(()=>Math.random()<0.5?"left":"right");
  const [chatOpen,setChatOpen]=useState(false);
  const [talkingTo,setTalkingTo]=useState(null);
  const [messagesL,setMessagesL]=useState([]);
  const [messagesR,setMessagesR]=useState([]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [nearEntity,setNearEntity]=useState(null);
  const [sayingBye,setSayingBye]=useState(false);
  const { typingText, startTyping, stopTyping } = useTypewriter();
  const greetedGuardRef = useRef({left:false,right:false});
  const inputRef=useRef(null);
  const chatEndRef=useRef(null);
  const walkAwayRef=useRef(null);
  const chatOpenRef=useRef(false);
  const gamePhaseRef=useRef("play");

  useEffect(()=>{chatOpenRef.current=chatOpen;},[chatOpen]);
  useEffect(()=>{gamePhaseRef.current=gamePhase;},[gamePhase]);

  const gLx=GUARD_L.col*TILE,gLy=GUARD_L.row*TILE,gRx=GUARD_R.col*TILE,gRy=GUARD_R.row*TILE;

  // Keyboard
  useEffect(()=>{
    const down=e=>{
      if(chatOpenRef.current||gamePhaseRef.current!=="play")return;
      keysRef.current[e.key]=true;
      startMusicForLevel();
      if(e.key==="z"||e.key==="Z"){
        e.preventDefault();
        const p=playerRef.current;
        const dL=Math.hypot(p.x-gLx,p.y-gLy),dR=Math.hypot(p.x-gRx,p.y-gRy);
        const dDL=Math.hypot(p.x-DOOR_L.col*TILE,p.y-DOOR_L.row*TILE);
        const dDR=Math.hypot(p.x-DOOR_R.col*TILE,p.y-DOOR_R.row*TILE);
        if(dL<INTERACT_DIST){setTalkingTo("left");setChatOpen(true);setSayingBye(false);const gl="Halt, prisoner. You may ask me anything... if you dare.";setMessagesL(p=>p.length===0?[{role:"assistant",text:gl}]:p);if(!greetedGuardRef.current.left){greetedGuardRef.current.left=true;startTyping("left",gl);}}
        else if(dR<INTERACT_DIST){setTalkingTo("right");setChatOpen(true);setSayingBye(false);const gr="Well well... a visitor. Ask your questions carefully.";setMessagesR(p=>p.length===0?[{role:"assistant",text:gr}]:p);if(!greetedGuardRef.current.right){greetedGuardRef.current.right=true;startTyping("right",gr);}}
        else if(dDL<INTERACT_DIST+10){if(safeDoor==="left")onWin();else setGamePhase("lose");}
        else if(dDR<INTERACT_DIST+10){if(safeDoor==="right")onWin();else setGamePhase("lose");}
      }
    };
    const up=e=>{keysRef.current[e.key]=false;};
    window.addEventListener("keydown",down);window.addEventListener("keyup",up);
    return()=>{window.removeEventListener("keydown",down);window.removeEventListener("keyup",up);};
  },[messagesL.length,messagesR.length,safeDoor,gLx,gLy,gRx,gRy,startMusicForLevel]);

  useEffect(()=>{if(chatOpen&&inputRef.current)inputRef.current.focus();},[chatOpen]);
  useEffect(()=>{const h=e=>{if(e.key==="Escape"&&chatOpenRef.current){e.preventDefault();setChatOpen(false);}};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);},[]);
  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"});},[messagesL,messagesR]);

  // Game loop
  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas)return;
    const ctx=canvas.getContext("2d"); ctx.imageSmoothingEnabled=false;
    let raf;
    const loop=()=>{
      const p=playerRef.current,keys=keysRef.current;let moved=false;
      if(!chatOpenRef.current&&gamePhaseRef.current==="play"){
        let nx=p.x,ny=p.y;
        if(keys["ArrowUp"]||keys["w"]){ny-=SPEED;p.dir="up";moved=true;}
        if(keys["ArrowDown"]||keys["s"]){ny+=SPEED;p.dir="down";moved=true;}
        if(keys["ArrowLeft"]||keys["a"]){nx-=SPEED;p.dir="left";moved=true;}
        if(keys["ArrowRight"]||keys["d"]){nx+=SPEED;p.dir="right";moved=true;}
        const blocked=[GUARD_L,GUARD_R].some(g=>{const gx=g.col*TILE,gy=g.row*TILE;return nx+TILE>gx-4&&nx<gx+TILE+4&&ny+TILE>gy-4&&ny<gy+TILE;});
        if(!blocked){p.x=Math.max(TILE,Math.min((L1_COLS-2)*TILE,nx));p.y=Math.max(TILE*2+10,Math.min((L1_ROWS-2)*TILE,ny));}
      }
      if(moved){p.tick++;if(p.tick>8){p.frame++;p.tick=0;}}
      const dL=Math.hypot(p.x-gLx,p.y-gLy),dR=Math.hypot(p.x-gRx,p.y-gRy);
      const dDL=Math.hypot(p.x-DOOR_L.col*TILE,p.y-DOOR_L.row*TILE);
      const dDR=Math.hypot(p.x-DOOR_R.col*TILE,p.y-DOOR_R.row*TILE);
      let ne=null;
      if(dL<INTERACT_DIST)ne="guardL";else if(dR<INTERACT_DIST)ne="guardR";
      else if(dDL<INTERACT_DIST+10)ne="doorL";else if(dDR<INTERACT_DIST+10)ne="doorR";
      setNearEntity(ne);
      ctx.clearRect(0,0,L1_W,L1_H);
      drawDungeon(ctx);
      drawGuard(ctx,gLx,gLy,"left"); drawGuard(ctx,gRx,gRy,"right");
      ctx.font="6px "+FONT;ctx.textAlign="center";
      ctx.fillStyle="#b04040";ctx.fillText("GUARD 1",gLx+16,gLy-16);
      ctx.fillStyle="#4060b0";ctx.fillText("GUARD 2",gRx+16,gRy-16);
      ctx.textAlign="left";
      drawPlayer(ctx,p.x,p.y,p.dir,p.frame);
      if(!chatOpenRef.current&&gamePhaseRef.current==="play"){
        if(ne==="guardL")drawZPrompt(ctx,gLx,gLy);
        if(ne==="guardR")drawZPrompt(ctx,gRx,gRy);
        if(ne==="doorL")drawZPrompt(ctx,DOOR_L.col*TILE,DOOR_L.row*TILE+TILE);
        if(ne==="doorR")drawZPrompt(ctx,DOOR_R.col*TILE,DOOR_R.row*TILE+TILE);
      }
      raf=requestAnimationFrame(loop);
    };
    raf=requestAnimationFrame(loop);
    return()=>cancelAnimationFrame(raf);
  },[gLx,gLy,gRx,gRy,gamePhase]);

  // Send message
  const sendMessage=useCallback(async()=>{
    if(!input.trim()||loading||!talkingTo)return;
    const userMsg={role:"user",text:input.trim()};
    const cur=talkingTo==="left"?[...messagesL,userMsg]:[...messagesR,userMsg];
    if(talkingTo==="left")setMessagesL(cur);else setMessagesR(cur);
    setInput("");setLoading(true);
    const isLiar=talkingTo===liarGuard;
    const guardName=talkingTo==="left"?"Guard 1 (red armor)":"Guard 2 (blue armor)";
    const otherGuardName=talkingTo==="left"?"Guard 2":"Guard 1";
    const safeDoorLabel=safeDoor==="left"?"Door 1 (left)":"Door 2 (right)";
    const dangerDoorLabel=safeDoor==="left"?"Door 2 (right)":"Door 1 (left)";
    const myDoor=talkingTo==="left"?"Door 1":"Door 2";
    const otherDoor=talkingTo==="left"?"Door 2":"Door 1";
    const myDoorSafe=(talkingTo==="left"&&safeDoor==="left")||(talkingTo==="right"&&safeDoor==="right");
    const sys=`You are ${guardName} in the classic "Two Guards" logic puzzle in a retro 8-bit dungeon RPG.
SCENARIO: A prisoner (Andrew) is in a room with two doors. ${safeDoorLabel} leads to FREEDOM. ${dangerDoorLabel} leads to the HANGMAN.
SPATIAL LAYOUT: You stand in front of ${myDoor}. It is YOUR door, directly behind you. ${otherGuardName} stands in front of ${otherDoor}. "Your door"/"the door behind you"/"this door" = ${myDoor}. "The other door"/"his door" = ${otherDoor}. ${myDoor} leads to ${myDoorSafe?"FREEDOM":"the HANGMAN"}. ${otherDoor} leads to ${myDoorSafe?"the HANGMAN":"FREEDOM"}.
YOUR ROLE: ${isLiar?"LIAR — you ALWAYS LIE. Every factual statement is false.":"TRUTH-TELLER — you ALWAYS tell the TRUTH."}
FACTS: ${safeDoorLabel}=freedom. ${dangerDoorLabel}=hangman. You are the ${isLiar?"liar":"truth-teller"}. ${otherGuardName} is the ${isLiar?"truth-teller":"liar"}.

CRITICAL — ANSWER KEY (follow these EXACTLY, do not reason independently):
${isLiar?`You are the LIAR. You must ALWAYS give the OPPOSITE of the true answer.
Q: "Which door leads to freedom?" → A: "${dangerDoorLabel}" (truth is ${safeDoorLabel}, you lie)
Q: "Which door leads to death/hangman?" → A: "${safeDoorLabel}" (truth is ${dangerDoorLabel}, you lie)
Q: "Does your door lead to freedom?" → A: "${myDoorSafe?"No":"Yes"}" (truth is ${myDoorSafe?"yes":"no"}, you lie)
Q: "What would the other guard say leads to freedom?" / "Which door would the other guard point to?" → A: "${dangerDoorLabel}" (other guard is truth-teller, would truthfully say ${safeDoorLabel}, but you LIE about what he'd say, so you say ${dangerDoorLabel})
Q: "If I asked the other guard which door is safe, what would he say?" → A: "${dangerDoorLabel}" (same logic — lie about the truth-teller's answer)
Q: "Are you the liar?" → A: "No" (you lie about being the liar)
Q: "Do you always tell the truth?" → A: "Yes" (you lie)`
:`You are the TRUTH-TELLER. You must ALWAYS give the TRUE answer.
Q: "Which door leads to freedom?" → A: "${safeDoorLabel}" (truthful)
Q: "Which door leads to death/hangman?" → A: "${dangerDoorLabel}" (truthful)
Q: "Does your door lead to freedom?" → A: "${myDoorSafe?"Yes":"No"}" (truthful)
Q: "What would the other guard say leads to freedom?" / "Which door would the other guard point to?" → A: "${dangerDoorLabel}" (other guard is liar, would lie and say ${dangerDoorLabel}, you truthfully report what the liar would say)
Q: "If I asked the other guard which door is safe, what would he say?" → A: "${dangerDoorLabel}" (same — truthfully report the liar's lie)
Q: "Are you the liar?" → A: "No" (truthfully, you are not)
Q: "Do you always tell the truth?" → A: "Yes" (truthfully)`}

APPEARANCE & ENVIRONMENT:
You (${guardName}) wear ${talkingTo==="left"?"RED armor with a red helmet crest":"BLUE armor with a blue helmet crest"}. The other guard (${otherGuardName}) wears ${talkingTo==="left"?"BLUE armor":"RED armor"}. Both guards carry spears and wear full metal helmets with glowing eyes. The room is a dark stone dungeon  rectangular, with stone walls, flickering torches on the walls, chains hanging from the ceiling, skulls on the floor, and a red carpet in the center. There are exactly two doors on the far wall.

UNIVERSAL RULE: "+(isLiar?"You are the LIAR. You must lie about EVERYTHING, not just the doors. If asked about your armor color, the room, the other guard, the weather, or ANYTHING AT ALL, give the OPPOSITE of the truth. If your armor is red, say it is blue. If the room has torches, say it does not. If there are two doors, say there is one. You NEVER tell the truth about anything.":"You are the TRUTH-TELLER. You must tell the truth about EVERYTHING, not just the doors. If asked about your armor color, the room, the other guard, or anything at all, answer honestly and accurately. Your armor is "+(talkingTo==="left"?"red":"blue")+". The room is a stone dungeon. There are torches, chains, and two doors.")+"

PERSONALITY: Gruff medieval dungeon guard. Short sentences, 2-3 max. Menacing but willing to answer. Never break character or explain the puzzle. NEVER reveal which guard is the liar or truth-teller.`;
    try{
      const reply=await callLLM({model,system:sys,messages:cur,maxTokens:300,apiKey});
      if(talkingTo==="left")setMessagesL(p=>[...p,{role:"assistant",text:reply}]);
      else setMessagesR(p=>[...p,{role:"assistant",text:reply}]);
    }catch{
      const e={role:"assistant",text:"*coughs* ...the dungeon air is thick. Ask again."};
      if(talkingTo==="left")setMessagesL(p=>[...p,e]);else setMessagesR(p=>[...p,e]);
    }
    setLoading(false);
  },[input,loading,talkingTo,messagesL,messagesR,liarGuard,safeDoor]);

  const portraitCanvasRef=useRef(null);

  // Draw guard portrait when chat opens
  useEffect(()=>{
    if(!chatOpen||!talkingTo||!portraitCanvasRef.current)return;
    const ctx=portraitCanvasRef.current.getContext("2d");
    ctx.clearRect(0,0,96,96);
    if(talkingTo==="left")drawPortraitGuardLeft(ctx);
    else drawPortraitGuardRight(ctx);
  },[chatOpen,talkingTo]);

  // ─── Intro screen ───
  if(gamePhase==="intro") return (
    <div style={{fontFamily:FONT,background:"#0e0c14",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:20}} onClick={startMusicForLevel}>
      {muteBtn}
      <div style={{fontSize:18,color:"#e8d070",textShadow:"0 0 20px rgba(232,208,112,0.4)",marginBottom:24,letterSpacing:3}}>⚔ THE TWO GUARDS ⚔</div>
      <div style={{width:360,maxWidth:"90%",background:"#18142a",border:"2px solid #3a3060",borderRadius:8,padding:16,boxShadow:"0 0 30px rgba(60,40,120,0.3)"}}>
        <div style={{fontSize:8,color:"#c8b880",lineHeight:"18px",marginBottom:12,textAlign:"left"}}>
          You awaken in a dark dungeon. Cold stone beneath your feet, the flicker of torches on the walls.
        </div>
        <div style={{fontSize:8,color:"#c8b880",lineHeight:"18px",marginBottom:12,textAlign:"left"}}>
          Before you stand two doors — one leads to freedom, the other to the hangman's noose.
        </div>
        <div style={{fontSize:8,color:"#c8b880",lineHeight:"18px",marginBottom:12,textAlign:"left"}}>
          Two guards block your path. One ALWAYS tells the truth. The other ALWAYS lies. You don't know which is which.
        </div>
        <div style={{fontSize:8,color:"#e8d070",lineHeight:"18px",marginBottom:16,textAlign:"left"}}>
          Ask them questions. Use logic. Choose wisely — your life depends on it.
        </div>
      </div>
      <button onClick={()=>setGamePhase("play")} style={{fontFamily:FONT,fontSize:10,padding:"12px 28px",background:"#e8d070",color:"#0e0c14",border:"none",borderRadius:6,cursor:"pointer",boxShadow:"0 0 20px rgba(232,208,112,0.4)",marginTop:20}}>ENTER THE DUNGEON</button><div style={{fontSize:6,marginTop:16,color:"#444"}}>{VERSION}</div>
    </div>
  );

  // ─── Outcome screens ───
  if(gamePhase==="lose") return (
    <div style={{fontFamily:FONT,background:"#1a0a0a",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:20}}>
      {muteBtn}
      <div style={{fontSize:28,color:"#ff4444",textShadow:"0 0 30px #ff4444, 0 0 60px #aa0000",marginBottom:20,animation:"shake 0.3s infinite"}}>☠ DEATH ☠</div>
      <div style={{fontSize:9,color:"#e88080",lineHeight:"22px",maxWidth:400,marginBottom:10}}>The door creaks open to reveal the hangman's noose. You chose... poorly.</div>
      <div style={{fontSize:40,margin:"10px 0"}}>💀⛓️🪦</div>
      <button onClick={onRestart} style={{fontFamily:FONT,fontSize:10,padding:"12px 28px",background:"#ff4444",color:"#1a0a0a",border:"none",borderRadius:6,cursor:"pointer",boxShadow:"0 0 20px #ff4444",marginTop:20}}>TRY AGAIN</button>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}`}</style>
    </div>
  );

  const msgs=talkingTo==="left"?messagesL:messagesR;
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",fontFamily:FONT,background:"#0e0c14",minHeight:"100vh",padding:"12px 8px",boxSizing:"border-box"}} onClick={startMusicForLevel}>
      {muteBtn}
      <div style={{color:"#e8d070",fontSize:10,marginBottom:8,textShadow:"2px 2px 0 #3a2a0a",letterSpacing:3}}>THE TWO GUARDS</div>
      <div style={{color:"#8a7a6a",fontSize:6,marginBottom:10,textAlign:"center",lineHeight:"12px"}}>One always lies. One always tells the truth. Choose a door.</div>
      <div style={{background:"#18142a",border:"3px solid #3a3060",borderRadius:6,padding:6,boxShadow:"0 0 30px rgba(60,40,120,0.4)"}}>
        <canvas ref={canvasRef} width={L1_W} height={L1_H} style={{display:"block",imageRendering:"pixelated",width:L1_W,height:L1_H,borderRadius:3}} />
      </div>
      <div style={{color:"#6a6a8a",fontSize:7,marginTop:6,textAlign:"center"}}>
        {chatOpen?"":nearEntity==="guardL"||nearEntity==="guardR"?"PRESS Z TO TALK":nearEntity==="doorL"||nearEntity==="doorR"?"PRESS Z TO ENTER":"ARROW KEYS TO MOVE · Z TO INTERACT"}
      </div>
      {chatOpen&&(
        <div style={{width:L1_W+12,maxWidth:"100%",background:"#0c0a16",border:"3px solid "+(talkingTo==="left"?"#b04040":"#4060b0"),borderRadius:6,marginTop:6,padding:10,boxSizing:"border-box"}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
            <canvas ref={portraitCanvasRef} width={96} height={96} style={{imageRendering:"pixelated",width:96,height:96,borderRadius:4,border:"2px solid "+(talkingTo==="left"?"#b04040":"#4060b0"),boxShadow:"0 0 12px "+(talkingTo==="left"?"rgba(176,64,64,0.4)":"rgba(64,96,176,0.4)")}} />
          </div>
          <div style={{color:talkingTo==="left"?"#b04040":"#4060b0",fontSize:8,marginBottom:8,textAlign:"center"}}>─── {talkingTo==="left"?"GUARD 1":"GUARD 2"} ───</div>
          <div style={{maxHeight:140,overflowY:"auto",marginBottom:8,cursor:typingText&&typingText.current!==typingText.full?"pointer":"default"}} onClick={()=>{if(typingText&&typingText.current!==typingText.full)stopTyping();}}>
            {(sayingBye?[{role:"assistant",text:sayingBye}]:msgs).map((m,i,arr)=><div key={i} style={{color:m.role==="assistant"?"#e8d070":"#5b8dd9",fontSize:8,lineHeight:"16px",marginBottom:6,wordBreak:"break-word",textAlign:"left"}}><span style={{color:m.role==="assistant"?(talkingTo==="left"?"#b04040":"#4060b0"):"#70e870"}}>{m.role==="assistant"?(talkingTo==="left"?"GUARD 1":"GUARD 2"):"ANDREW"}:</span> {(typingText&&i===arr.length-1&&m.role==="assistant"&&typingText.current!==typingText.full)?typingText.current:m.text}</div>)}
            {loading&&!sayingBye&&<div style={{color:"#6a6a8a",fontSize:8}}>The guard ponders...</div>}
            <div ref={chatEndRef}/>
          </div>
          {!sayingBye&&<div style={{display:"flex",gap:6}}>
            <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{e.stopPropagation();if(e.key==="Enter")sendMessage();if(e.key==="Escape"){e.preventDefault();setChatOpen(false);}if(e.key==="ArrowDown"){e.preventDefault();walkAwayRef.current?.focus();}}} placeholder="Ask the guard..." style={{flex:1,background:"#141020",border:"2px solid #3a3060",borderRadius:4,color:"#ddd",fontFamily:FONT,fontSize:8,padding:"6px 8px",outline:"none"}} />
            <button onClick={sendMessage} style={{background:"#e8d070",border:"none",borderRadius:4,fontFamily:FONT,fontSize:8,padding:"6px 10px",cursor:"pointer",color:"#0e0c14"}}>▶</button>
          </div>}
          {sayingBye?null:
            <button ref={walkAwayRef} onClick={()=>{const g=talkingTo==="left"?"Hmph. Don't take too long, prisoner.":"Watch your step out there...";if(talkingTo==="left")setMessagesL(p=>[...p,{role:"assistant",text:g}]);else setMessagesR(p=>[...p,{role:"assistant",text:g}]);setSayingBye(g);startTyping("bye",g);setTimeout(()=>{setSayingBye(false);setChatOpen(false);},Math.max(1500,g.length*25+500));}} onKeyDown={e=>{e.stopPropagation();if(e.key==="Enter"||e.key===" "){e.preventDefault();const g=talkingTo==="left"?"Hmph. Don't take too long, prisoner.":"Watch your step out there...";if(talkingTo==="left")setMessagesL(p=>[...p,{role:"assistant",text:g}]);else setMessagesR(p=>[...p,{role:"assistant",text:g}]);setSayingBye(g);startTyping("bye",g);setTimeout(()=>{setSayingBye(false);setChatOpen(false);},Math.max(1500,g.length*25+500));}if(e.key==="Escape"){e.preventDefault();setChatOpen(false);}if(e.key==="ArrowUp"){e.preventDefault();inputRef.current?.focus();}}} style={{marginTop:6,background:"transparent",border:"1px solid #8a7a50",borderRadius:4,color:"#a09070",fontFamily:FONT,fontSize:7,padding:"4px 8px",cursor:"pointer",width:"100%"}}>THANKS, GOODBYE</button>
          }
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// LEVEL 2 — MURDER AT THE ASHWORTH GALLERY
// ═══════════════════════════════════════
const L2_COLS=20, L2_ROWS=14, L2_W=L2_COLS*TILE, L2_H=L2_ROWS*TILE;

// NPC definitions per room
const L2_ALL_NPCS=[
  {key:"mauve",room:"hall",x:4*TILE,y:9*TILE,label:"VP MAUVE",color:"#8b5a8b",draw:drawVPMauve},
  {key:"cop",room:"hall",x:15*TILE,y:5*TILE,label:"DETECTIVE",color:"#2244aa",draw:drawPoliceman},
  {key:"lead",room:"hall",x:10*TILE,y:10*TILE,label:"LEAD DETECTIVE",color:"#b89868",draw:drawLeadDetective},
  {key:"soothsayer",room:"hall",x:16*TILE,y:9*TILE,label:"SOOTHSAYER",color:"#6b40aa",draw:drawSoothsayer},
  {key:"forensics",room:"hall",x:8*TILE,y:4*TILE,label:"FORENSICS",color:"#88aacc",draw:drawForensicsOfficer},
  {key:"viscount",room:"bathroom",x:8*TILE,y:5*TILE,label:"VISCOUNT",color:"#6b3a8b",draw:drawViscountEminence},
  {key:"duchess",room:"giftshop",x:10*TILE,y:6*TILE,label:"DUCHESS",color:"#cc3030",draw:drawDuchessVermillion},
];

// Door configs per room
const L2_ROOM_DOORS={
  hall:[
    {col:0,row:7,label:"BATH",target:"bathroom",spawnX:17*TILE,spawnY:7*TILE},
    {col:19,row:7,label:"GIFT SHOP",target:"giftshop",spawnX:2*TILE,spawnY:7*TILE},
  ],
  bathroom:[
    {col:19,row:7,label:"EXIT",target:"hall",spawnX:2*TILE,spawnY:7*TILE},
  ],
  giftshop:[
    {col:0,row:7,label:"EXIT",target:"hall",spawnX:17*TILE,spawnY:7*TILE},
  ],
};

function drawEntryHall(ctx) {
  // Marble tile floor
  for(let r=0;r<L2_ROWS;r++)for(let c=0;c<L2_COLS;c++){
    const v=((r*3+c*7)%4);
    ctx.fillStyle=v<2?"#d8d0c0":"#c8c0b0";
    ctx.fillRect(c*TILE,r*TILE,TILE,TILE);
    ctx.strokeStyle="rgba(0,0,0,0.08)";ctx.strokeRect(c*TILE,r*TILE,TILE,TILE);
  }
  // Top wall
  for(let c=0;c<L2_COLS;c++){ctx.fillStyle="#6b5040";ctx.fillRect(c*TILE,0,TILE,TILE*2);ctx.fillStyle="#5a4030";ctx.fillRect(c*TILE+2,2,TILE-4,TILE*2-4);}
  // Bottom wall with door gap at col 10 (entry)
  for(let c=0;c<L2_COLS;c++){
    if(c===10)continue;
    ctx.fillStyle="#6b5040";ctx.fillRect(c*TILE,(L2_ROWS-1)*TILE,TILE,TILE);ctx.fillStyle="#5a4030";ctx.fillRect(c*TILE+2,(L2_ROWS-1)*TILE+2,TILE-4,TILE-4);
  }
  // Entry door (bottom)
  ctx.fillStyle="#1a0a00";ctx.fillRect(10*TILE,(L2_ROWS-1)*TILE,TILE,TILE);
  ctx.fillStyle="#6b3a1a";ctx.fillRect(10*TILE+3,(L2_ROWS-1)*TILE+3,TILE-6,TILE-6);
  ctx.fillStyle="#e8d070";ctx.fillRect(10*TILE+14,(L2_ROWS-1)*TILE+14,4,4);
  ctx.fillStyle="#e8d070";ctx.font="5px "+FONT;ctx.textAlign="center";ctx.fillText("EXIT",10*TILE+TILE/2,(L2_ROWS-1)*TILE-4);
  ctx.textAlign="left";
  // Left wall with door gap at row 7
  for(let r=0;r<L2_ROWS;r++){
    if(r===7)continue;
    ctx.fillStyle="#6b5040";ctx.fillRect(0,r*TILE,TILE,TILE);ctx.fillStyle="#5a4030";ctx.fillRect(2,r*TILE+2,TILE-4,TILE-4);
  }
  // Left door
  ctx.fillStyle="#1a0a00";ctx.fillRect(0,7*TILE,TILE,TILE);
  ctx.fillStyle="#6b3a1a";ctx.fillRect(3,7*TILE+3,TILE-6,TILE-6);
  ctx.fillStyle="#e8d070";ctx.fillRect(22,7*TILE+14,4,4);
  // Right wall with door gap at row 7
  for(let r=0;r<L2_ROWS;r++){
    if(r===7)continue;
    ctx.fillStyle="#6b5040";ctx.fillRect((L2_COLS-1)*TILE,r*TILE,TILE,TILE);ctx.fillStyle="#5a4030";ctx.fillRect((L2_COLS-1)*TILE+2,r*TILE+2,TILE-4,TILE-4);
  }
  // Right door
  ctx.fillStyle="#1a0a00";ctx.fillRect((L2_COLS-1)*TILE,7*TILE,TILE,TILE);
  ctx.fillStyle="#6b3a1a";ctx.fillRect((L2_COLS-1)*TILE+3,7*TILE+3,TILE-6,TILE-6);
  ctx.fillStyle="#e8d070";ctx.fillRect((L2_COLS-1)*TILE+6,7*TILE+14,4,4);
  // Door labels
  ctx.fillStyle="#cc8830";ctx.font="5px "+FONT;ctx.textAlign="left";ctx.fillText("BATH",4,7*TILE-4);ctx.textAlign="right";ctx.fillText("GIFT",(L2_COLS-1)*TILE+TILE-4,7*TILE-4);
  ctx.textAlign="left";
  // Room label
  ctx.fillStyle="#6b5040";ctx.font="7px "+FONT;ctx.textAlign="center";
  ctx.fillText("ASHWORTH GALLERY — ENTRY HALL",L2_W/2,2*TILE-4);
  ctx.textAlign="left";
  // Paintings on top wall
  [[3,1,"#30aa60"],[6,1,"#cc3030"],[9,1,"#3060cc"],[12,1,"#cc9930"],[15,1,"#dda030"]].forEach(([c,r,col])=>{
    ctx.fillStyle="#3a2a1a";ctx.fillRect(c*TILE+4,r*TILE+4,TILE-8,TILE-8);
    ctx.fillStyle=col;ctx.fillRect(c*TILE+7,r*TILE+7,TILE-14,TILE-14);
  });
  // Velvet rope posts
  [[7,9],[9,9],[11,9],[13,9]].forEach(([c,r])=>{
    ctx.fillStyle="#e8d070";ctx.fillRect(c*TILE+12,r*TILE,8,4);
    ctx.fillStyle="#8b6a3a";ctx.fillRect(c*TILE+14,r*TILE+4,4,12);
  });
  ctx.strokeStyle="#cc3030";ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(7*TILE+16,9*TILE+2);ctx.lineTo(9*TILE+16,9*TILE+2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(11*TILE+16,9*TILE+2);ctx.lineTo(13*TILE+16,9*TILE+2);ctx.stroke();
  ctx.lineWidth=1;
  // Crime scene - chalk body outline
  ctx.strokeStyle="rgba(255,255,255,0.7)";ctx.lineWidth=2;ctx.setLineDash([4,4]);
  ctx.beginPath();
  var bx=9*TILE,by=6*TILE;
  ctx.arc(bx+TILE,by+8,8,0,Math.PI*2);
  ctx.moveTo(bx+TILE-6,by+16);ctx.lineTo(bx+TILE-6,by+TILE+16);
  ctx.moveTo(bx+TILE+6,by+16);ctx.lineTo(bx+TILE+6,by+TILE+16);
  ctx.moveTo(bx+TILE-6,by+20);ctx.lineTo(bx-8,by+TILE+4);
  ctx.moveTo(bx+TILE+6,by+20);ctx.lineTo(bx+2*TILE+8,by+TILE+4);
  ctx.moveTo(bx+TILE-6,by+TILE+16);ctx.lineTo(bx+4,by+2*TILE+8);
  ctx.moveTo(bx+TILE+6,by+TILE+16);ctx.lineTo(bx+TILE+12,by+2*TILE+8);
  ctx.stroke();
  ctx.setLineDash([]);ctx.lineWidth=1;
  // Caution tape
  var tx=8*TILE-4,ty=5*TILE+16,tw=4*TILE+8,th=2*TILE+16;
  for(var ti=0;ti<Math.max(tw,th)*2;ti+=6){
    ctx.fillStyle=ti%12<6?"#e8d020":"#222";
    if(ti<tw){ctx.fillRect(tx+ti,ty,Math.min(6,tw-ti),3);}
    if(ti<tw){ctx.fillRect(tx+ti,ty+th,Math.min(6,tw-ti),3);}
    if(ti<th){ctx.fillRect(tx,ty+ti,3,Math.min(6,th-ti));}
    if(ti<th){ctx.fillRect(tx+tw,ty+ti,3,Math.min(6,th-ti));}
  }
  // Weapons display case
  ctx.fillStyle="rgba(160,200,224,0.5)";ctx.fillRect(2*TILE,3*TILE,3*TILE,TILE);
  ctx.fillStyle="#607080";ctx.fillRect(2*TILE,3*TILE,3*TILE,2);ctx.fillRect(2*TILE,4*TILE-2,3*TILE,2);
  ctx.fillRect(2*TILE,3*TILE,2,TILE);ctx.fillRect(5*TILE-2,3*TILE,2,TILE);
  ctx.fillStyle="#fff";ctx.fillRect(2*TILE+10,3*TILE+6,12,16);
  ctx.fillStyle="#3366cc";ctx.fillRect(2*TILE+12,3*TILE+10,8,8);
  ctx.fillStyle="#5a4020";ctx.fillRect(3*TILE+8,3*TILE+4,16,20);
  ctx.fillStyle="#cc6644";ctx.fillRect(3*TILE+11,3*TILE+7,10,14);
  ctx.fillStyle="#556";ctx.fillRect(4*TILE+6,3*TILE+8,14,14);
  ctx.fillStyle="#667";ctx.fillRect(4*TILE+10,3*TILE+4,6,8);
  ctx.fillStyle="#e8d070";ctx.font="4px "+FONT;ctx.textAlign="center";
  ctx.fillText("EVIDENCE",3.5*TILE,3*TILE-2);ctx.textAlign="left";
  // Security monitor
  ctx.fillStyle="#444";ctx.fillRect(16*TILE+4,3*TILE+2,24,20);
  ctx.fillStyle="#0a1a0a";ctx.fillRect(16*TILE+6,3*TILE+4,20,14);
  ctx.fillStyle="#00ff00";ctx.fillRect(16*TILE+8,3*TILE+6,4,2);
  for(var si=0;si<4;si++){ctx.fillStyle="rgba(0,255,0,0.1)";ctx.fillRect(16*TILE+6,3*TILE+4+si*4,20,1);}
  ctx.fillStyle="#555";ctx.fillRect(16*TILE+12,3*TILE+22,8,6);
  ctx.fillStyle="#444";ctx.fillRect(16*TILE+8,3*TILE+28,16,2);
}

function drawBathroom(ctx) {
  // Blue-tinted tile floor
  for(let r=0;r<L2_ROWS;r++)for(let c=0;c<L2_COLS;c++){
    const v=((r*3+c*7)%4);
    ctx.fillStyle=v<2?"#b8c8d8":"#a8b8c8";
    ctx.fillRect(c*TILE,r*TILE,TILE,TILE);
    ctx.strokeStyle="rgba(0,0,80,0.08)";ctx.strokeRect(c*TILE,r*TILE,TILE,TILE);
  }
  // Top wall
  for(let c=0;c<L2_COLS;c++){ctx.fillStyle="#506070";ctx.fillRect(c*TILE,0,TILE,TILE*2);ctx.fillStyle="#405060";ctx.fillRect(c*TILE+2,2,TILE-4,TILE*2-4);}
  // Bottom wall
  for(let c=0;c<L2_COLS;c++){ctx.fillStyle="#506070";ctx.fillRect(c*TILE,(L2_ROWS-1)*TILE,TILE,TILE);ctx.fillStyle="#405060";ctx.fillRect(c*TILE+2,(L2_ROWS-1)*TILE+2,TILE-4,TILE-4);}
  // Left wall (solid)
  for(let r=0;r<L2_ROWS;r++){ctx.fillStyle="#506070";ctx.fillRect(0,r*TILE,TILE,TILE);ctx.fillStyle="#405060";ctx.fillRect(2,r*TILE+2,TILE-4,TILE-4);}
  // Right wall with door gap at row 7
  for(let r=0;r<L2_ROWS;r++){
    if(r===7)continue;
    ctx.fillStyle="#506070";ctx.fillRect((L2_COLS-1)*TILE,r*TILE,TILE,TILE);ctx.fillStyle="#405060";ctx.fillRect((L2_COLS-1)*TILE+2,r*TILE+2,TILE-4,TILE-4);
  }
  // Right door (EXIT)
  ctx.fillStyle="#1a0a00";ctx.fillRect((L2_COLS-1)*TILE,7*TILE,TILE,TILE);
  ctx.fillStyle="#6b3a1a";ctx.fillRect((L2_COLS-1)*TILE+3,7*TILE+3,TILE-6,TILE-6);
  ctx.fillStyle="#e8d070";ctx.fillRect((L2_COLS-1)*TILE+6,7*TILE+14,4,4);
  // Door label
  ctx.fillStyle="#e8d070";ctx.font="5px "+FONT;ctx.textAlign="center";ctx.fillText("EXIT",(L2_COLS-1)*TILE+TILE/2,7*TILE-4);
  ctx.textAlign="left";
  // Room label
  ctx.fillStyle="#88aabb";ctx.font="7px "+FONT;ctx.textAlign="center";
  ctx.fillText("BATHROOM",L2_W/2,2*TILE-4);
  ctx.textAlign="left";
  // Sinks
  ctx.fillStyle="#ddd";ctx.fillRect(3*TILE,3*TILE+8,TILE*2,TILE-8);
  ctx.fillStyle="#88ccff";ctx.fillRect(3*TILE+4,3*TILE+12,TILE*2-8,TILE-16);
  ctx.fillStyle="#aaa";ctx.fillRect(3*TILE+TILE-2,3*TILE+4,4,8);
  ctx.fillStyle="#ddd";ctx.fillRect(7*TILE,3*TILE+8,TILE*2,TILE-8);
  ctx.fillStyle="#88ccff";ctx.fillRect(7*TILE+4,3*TILE+12,TILE*2-8,TILE-16);
  ctx.fillStyle="#aaa";ctx.fillRect(7*TILE+TILE-2,3*TILE+4,4,8);
  // Mirrors on top wall
  ctx.fillStyle="#ccc";ctx.fillRect(3*TILE+4,1*TILE+4,TILE*2-8,TILE-4);
  ctx.fillStyle="#aaddee";ctx.fillRect(3*TILE+6,1*TILE+6,TILE*2-12,TILE-8);
  ctx.fillStyle="#ccc";ctx.fillRect(7*TILE+4,1*TILE+4,TILE*2-8,TILE-4);
  ctx.fillStyle="#aaddee";ctx.fillRect(7*TILE+6,1*TILE+6,TILE*2-12,TILE-8);
  // Stalls
  for(let i=0;i<3;i++){
    const sx=2*TILE+i*4*TILE;
    ctx.fillStyle="#607080";ctx.fillRect(sx,7*TILE,3*TILE,3*TILE);
    ctx.fillStyle="#506070";ctx.fillRect(sx+4,7*TILE+4,3*TILE-8,3*TILE-4);
    ctx.fillStyle="#708090";ctx.fillRect(sx+TILE,7*TILE+4,TILE,2);
  }
}

function drawGiftShop(ctx) {
  // Warm wooden floor
  for(let r=0;r<L2_ROWS;r++)for(let c=0;c<L2_COLS;c++){
    const v=((r*5+c*3)%4);
    ctx.fillStyle=v<2?"#c8a878":"#b89868";
    ctx.fillRect(c*TILE,r*TILE,TILE,TILE);
    ctx.strokeStyle="rgba(80,40,0,0.1)";ctx.strokeRect(c*TILE,r*TILE,TILE,TILE);
  }
  // Top wall
  for(let c=0;c<L2_COLS;c++){ctx.fillStyle="#7b5a40";ctx.fillRect(c*TILE,0,TILE,TILE*2);ctx.fillStyle="#6a4a30";ctx.fillRect(c*TILE+2,2,TILE-4,TILE*2-4);}
  // Bottom wall
  for(let c=0;c<L2_COLS;c++){ctx.fillStyle="#7b5a40";ctx.fillRect(c*TILE,(L2_ROWS-1)*TILE,TILE,TILE);ctx.fillStyle="#6a4a30";ctx.fillRect(c*TILE+2,(L2_ROWS-1)*TILE+2,TILE-4,TILE-4);}
  // Left wall with door gap at row 7
  for(let r=0;r<L2_ROWS;r++){
    if(r===7)continue;
    ctx.fillStyle="#7b5a40";ctx.fillRect(0,r*TILE,TILE,TILE);ctx.fillStyle="#6a4a30";ctx.fillRect(2,r*TILE+2,TILE-4,TILE-4);
  }
  // Left door (EXIT)
  ctx.fillStyle="#1a0a00";ctx.fillRect(0,7*TILE,TILE,TILE);
  ctx.fillStyle="#6b3a1a";ctx.fillRect(3,7*TILE+3,TILE-6,TILE-6);
  ctx.fillStyle="#e8d070";ctx.fillRect(22,7*TILE+14,4,4);
  // Door label
  ctx.fillStyle="#e8d070";ctx.font="5px "+FONT;ctx.textAlign="center";ctx.fillText("EXIT",TILE/2,7*TILE-4);
  ctx.textAlign="left";
  // Right wall (solid)
  for(let r=0;r<L2_ROWS;r++){ctx.fillStyle="#7b5a40";ctx.fillRect((L2_COLS-1)*TILE,r*TILE,TILE,TILE);ctx.fillStyle="#6a4a30";ctx.fillRect((L2_COLS-1)*TILE+2,r*TILE+2,TILE-4,TILE-4);}
  // Room label
  ctx.fillStyle="#8b6a3a";ctx.font="7px "+FONT;ctx.textAlign="center";
  ctx.fillText("GIFT SHOP",L2_W/2,2*TILE-4);
  ctx.textAlign="left";
  // Counter
  ctx.fillStyle="#8b6a3a";ctx.fillRect(9*TILE,3*TILE,TILE*4,TILE);
  ctx.fillStyle="#aa8a5a";ctx.fillRect(9*TILE+2,3*TILE+2,TILE*4-4,TILE-4);
  // Cash register
  ctx.fillStyle="#555";ctx.fillRect(10*TILE+8,3*TILE-8,TILE-16,12);
  ctx.fillStyle="#4a4";ctx.fillRect(10*TILE+10,3*TILE-6,TILE-20,6);
  // Shelves on right wall
  for(let i=0;i<3;i++){
    ctx.fillStyle="#6b4a2a";ctx.fillRect(13*TILE,3*TILE+i*2*TILE,TILE*2,6);
    const colors=["#cc3030","#3060cc","#cc9930","#30aa60","#cc30cc"];
    for(let j=0;j<3;j++){
      ctx.fillStyle=colors[(i*3+j)%5];
      ctx.fillRect(13*TILE+4+j*20,3*TILE+i*2*TILE-12,14,12);
    }
  }
  // Display table
  ctx.fillStyle="#8b6a3a";ctx.fillRect(3*TILE,6*TILE,TILE*3,TILE);
  ctx.fillStyle="#aa8a5a";ctx.fillRect(3*TILE+2,6*TILE+2,TILE*3-4,TILE-4);
  ctx.fillStyle="#e8d070";ctx.fillRect(3*TILE+10,6*TILE-8,12,8);
  ctx.fillStyle="#88ccff";ctx.fillRect(4*TILE+10,6*TILE-10,14,10);
}

// ── NPC Portraits (96x96 close-up) ──
function drawPortraitMauve(ctx) {
  // Background
  ctx.fillStyle="#1a0e1a";ctx.fillRect(0,0,96,96);
  ctx.fillStyle="#2a1a2e";ctx.fillRect(0,0,96,60);
  // Shoulders/blazer
  ctx.fillStyle="#7a4a7a";ctx.fillRect(6,66,84,30);
  ctx.fillStyle="#8b5a8b";ctx.fillRect(12,68,72,28);
  ctx.fillStyle="#9b6a9b";ctx.fillRect(16,70,28,26);
  ctx.fillStyle="#9b6a9b";ctx.fillRect(52,70,28,26);
  ctx.fillStyle="#6b3a6b";ctx.fillRect(40,66,16,30);
  // Collar
  ctx.fillStyle="#f0eee8";ctx.fillRect(34,62,28,8);
  ctx.fillStyle="#e8e6e0";ctx.fillRect(38,64,20,4);
  // Neck
  ctx.fillStyle="#e8c8b8";ctx.fillRect(38,54,20,12);
  // Head
  ctx.fillStyle="#e8c8b8";ctx.fillRect(26,16,44,42);
  ctx.fillStyle="#e8c8b8";ctx.fillRect(24,20,48,34);
  ctx.fillStyle="#e8c8b8";ctx.fillRect(30,14,36,4);
  // Hair — dark bob
  ctx.fillStyle="#3a1a3a";ctx.fillRect(24,4,48,18);
  ctx.fillStyle="#3a1a3a";ctx.fillRect(20,10,8,36);
  ctx.fillStyle="#3a1a3a";ctx.fillRect(68,10,8,36);
  ctx.fillStyle="#4a2a4a";ctx.fillRect(30,6,36,6);
  // Glasses
  ctx.fillStyle="#333";ctx.fillRect(28,28,18,12);ctx.fillRect(50,28,18,12);
  ctx.fillStyle="#333";ctx.fillRect(46,32,4,4);
  ctx.fillStyle="#333";ctx.fillRect(22,32,6,2);ctx.fillRect(68,32,6,2);
  ctx.fillStyle="#88ccff";ctx.fillRect(30,30,14,8);ctx.fillRect(52,30,14,8);
  // Eyes behind glasses
  ctx.fillStyle="#fff";ctx.fillRect(32,31,8,5);ctx.fillRect(54,31,8,5);
  ctx.fillStyle="#221144";ctx.fillRect(36,32,4,4);ctx.fillRect(58,32,4,4);
  ctx.fillStyle="#000";ctx.fillRect(37,33,2,2);ctx.fillRect(59,33,2,2);
  // Stern brows
  ctx.fillStyle="#3a1a3a";ctx.fillRect(30,26,14,3);ctx.fillRect(52,26,14,3);
  // Nose
  ctx.fillStyle="#d8b8a8";ctx.fillRect(44,38,8,10);
  ctx.fillStyle="#c8a898";ctx.fillRect(42,46,12,2);
  // Mouth — thin, stern
  ctx.fillStyle="#c08080";ctx.fillRect(38,50,20,2);
  ctx.fillStyle="#a06868";ctx.fillRect(40,52,16,2);
  // Earrings
  ctx.fillStyle="#e8d070";ctx.fillRect(22,34,3,4);ctx.fillRect(71,34,3,4);
}

function drawPortraitViscount(ctx) {
  // Background
  ctx.fillStyle="#0a0614";ctx.fillRect(0,0,96,96);
  ctx.fillStyle="#0e0a1a";ctx.fillRect(0,0,96,50);
  // Shoulders/coat
  ctx.fillStyle="#1a0a2a";ctx.fillRect(8,68,80,28);
  ctx.fillStyle="#2a0a3a";ctx.fillRect(14,70,68,26);
  // High collar
  ctx.fillStyle="#2a0a3a";ctx.fillRect(26,56,10,16);ctx.fillRect(60,56,10,16);
  // Vest
  ctx.fillStyle="#8b1a1a";ctx.fillRect(36,64,24,14);
  ctx.fillStyle="#aa3030";ctx.fillRect(46,64,4,14);
  // Neck
  ctx.fillStyle="#e8ddd8";ctx.fillRect(38,52,20,14);
  // Head
  ctx.fillStyle="#e8ddd8";ctx.fillRect(26,14,44,42);
  ctx.fillStyle="#e8ddd8";ctx.fillRect(24,18,48,34);
  ctx.fillStyle="#e8ddd8";ctx.fillRect(30,12,36,6);
  // Hair — slicked back
  ctx.fillStyle="#0a0a14";ctx.fillRect(24,2,48,18);
  ctx.fillStyle="#0a0a14";ctx.fillRect(20,8,8,30);ctx.fillRect(68,8,8,30);
  // Widow's peak
  ctx.fillStyle="#0a0a14";ctx.fillRect(40,4,16,10);ctx.fillRect(44,10,8,6);
  // Top hat
  ctx.fillStyle="#0a0a0e";ctx.fillRect(28,-4,40,10);ctx.fillRect(24,4,48,6);
  ctx.fillStyle="#1a1a24";ctx.fillRect(30,-2,36,8);
  ctx.fillStyle="#2a2a34";ctx.fillRect(32,0,32,2);
  // Monocle
  ctx.fillStyle="#ddd";ctx.fillRect(52,26,18,14);
  ctx.fillStyle="#88bbdd";ctx.fillRect(54,28,14,10);
  ctx.fillStyle="#ddd";ctx.fillRect(68,36,2,16);
  // Eyes — piercing
  ctx.fillStyle="#fff";ctx.fillRect(30,28,12,8);ctx.fillRect(54,28,12,8);
  ctx.fillStyle="#880000";ctx.fillRect(36,30,6,6);ctx.fillRect(60,30,6,6);
  ctx.fillStyle="#440000";ctx.fillRect(38,32,2,2);ctx.fillRect(62,32,2,2);
  // Raised brow (haughty)
  ctx.fillStyle="#0a0a14";ctx.fillRect(30,24,12,3);ctx.fillRect(54,22,12,3);
  // Nose
  ctx.fillStyle="#d8ccc8";ctx.fillRect(44,36,8,10);
  // Thin mustache
  ctx.fillStyle="#0a0a14";ctx.fillRect(34,48,28,2);
  ctx.fillRect(32,47,4,2);ctx.fillRect(60,47,4,2);
  // Mouth — slight smirk
  ctx.fillStyle="#882222";ctx.fillRect(40,51,16,2);
}

function drawPortraitDuchess(ctx) {
  // Background
  ctx.fillStyle="#1a0a0a";ctx.fillRect(0,0,96,96);
  ctx.fillStyle="#2a0e0e";ctx.fillRect(0,0,96,50);
  // Shoulders/gown
  ctx.fillStyle="#aa2020";ctx.fillRect(6,68,84,28);
  ctx.fillStyle="#cc3030";ctx.fillRect(12,70,72,26);
  ctx.fillStyle="#dd4444";ctx.fillRect(20,72,56,10);
  // Pearl necklace
  ctx.fillStyle="#e8d070";ctx.fillRect(30,64,36,3);
  ctx.fillStyle="#fff";
  for(let i=0;i<6;i++){ctx.fillRect(32+i*6,64,4,3);}
  ctx.fillStyle="#ff4444";ctx.fillRect(44,67,8,4);
  // Neck
  ctx.fillStyle="#e8c8b8";ctx.fillRect(38,52,20,14);
  // Head
  ctx.fillStyle="#e8c8b8";ctx.fillRect(26,16,44,40);
  ctx.fillStyle="#e8c8b8";ctx.fillRect(24,20,48,32);
  ctx.fillStyle="#e8c8b8";ctx.fillRect(30,14,36,4);
  // White updo hair
  ctx.fillStyle="#ddd";ctx.fillRect(22,2,52,20);ctx.fillRect(26,0,44,8);
  ctx.fillStyle="#ccc";ctx.fillRect(28,-2,40,6);
  ctx.fillStyle="#ddd";ctx.fillRect(20,8,8,28);ctx.fillRect(68,8,8,28);
  // Hair pin
  ctx.fillStyle="#e8d070";ctx.fillRect(56,0,4,8);
  ctx.fillStyle="#ff4444";ctx.fillRect(55,-2,6,4);
  // Eyes
  ctx.fillStyle="#fff";ctx.fillRect(30,28,12,8);ctx.fillRect(54,28,12,8);
  ctx.fillStyle="#336633";ctx.fillRect(36,30,6,6);ctx.fillRect(60,30,6,6);
  ctx.fillStyle="#224422";ctx.fillRect(38,32,2,2);ctx.fillRect(62,32,2,2);
  // Brows
  ctx.fillStyle="#bbb";ctx.fillRect(30,24,12,2);ctx.fillRect(54,24,12,2);
  // Wrinkles
  ctx.fillStyle="#d8b8a8";ctx.fillRect(28,36,4,1);ctx.fillRect(64,36,4,1);
  // Nose
  ctx.fillStyle="#d8b8a8";ctx.fillRect(44,36,8,10);
  // Theatrical smile
  ctx.fillStyle="#c08080";ctx.fillRect(36,48,24,3);
  ctx.fillStyle="#d09090";ctx.fillRect(38,49,20,2);
  // Fan hint
  ctx.fillStyle="#e8d070";ctx.fillRect(78,74,4,16);
  ctx.fillStyle="#dd4444";ctx.fillRect(80,68,14,16);
  ctx.fillStyle="#cc3030";ctx.fillRect(82,70,10,12);
}

function drawPortraitCop(ctx) {
  // Background
  ctx.fillStyle="#0a0a1a";ctx.fillRect(0,0,96,96);
  ctx.fillStyle="#0e0e24";ctx.fillRect(0,0,96,50);
  // Shoulders/uniform
  ctx.fillStyle="#1a3070";ctx.fillRect(6,66,84,30);
  ctx.fillStyle="#2244aa";ctx.fillRect(12,68,72,28);
  ctx.fillStyle="#2a50bb";ctx.fillRect(20,72,56,10);
  // Badge
  ctx.fillStyle="#e8d070";ctx.fillRect(56,72,12,12);
  ctx.fillStyle="#cc9920";ctx.fillRect(58,74,8,8);
  ctx.fillStyle="#e8d070";ctx.fillRect(60,70,4,4);
  // Collar
  ctx.fillStyle="#1a2860";ctx.fillRect(34,62,28,8);
  // Neck
  ctx.fillStyle="#d8b8a0";ctx.fillRect(38,54,20,12);
  // Head
  ctx.fillStyle="#d8b8a0";ctx.fillRect(26,18,44,40);
  ctx.fillStyle="#d8b8a0";ctx.fillRect(24,22,48,32);
  ctx.fillStyle="#d8b8a0";ctx.fillRect(30,16,36,4);
  // Hat
  ctx.fillStyle="#1a1a40";ctx.fillRect(20,6,56,16);
  ctx.fillStyle="#2244aa";ctx.fillRect(24,8,48,12);
  ctx.fillStyle="#e8d070";ctx.fillRect(40,8,16,6);
  ctx.fillStyle="#1a1a40";ctx.fillRect(18,18,60,4);
  // Eyes
  ctx.fillStyle="#fff";ctx.fillRect(30,28,12,6);ctx.fillRect(54,28,12,6);
  ctx.fillStyle="#334";ctx.fillRect(36,29,6,5);ctx.fillRect(60,29,6,5);
  ctx.fillStyle="#111";ctx.fillRect(38,30,2,3);ctx.fillRect(62,30,2,3);
  // Serious brows
  ctx.fillStyle="#5a4a30";ctx.fillRect(30,25,12,3);ctx.fillRect(54,25,12,3);
  // Nose
  ctx.fillStyle="#c8a890";ctx.fillRect(44,34,8,10);
  // Thick mustache
  ctx.fillStyle="#5a4a30";ctx.fillRect(34,44,28,5);
  ctx.fillRect(32,44,4,3);ctx.fillRect(60,44,4,3);
  // Mouth
  ctx.fillStyle="#b08070";ctx.fillRect(40,50,16,2);
}

// -- New NPC Portraits --
function drawPortraitLeadDetective(ctx){
  ctx.fillStyle="#1a1410";ctx.fillRect(0,0,96,96);
  ctx.fillStyle="#a08848";ctx.fillRect(8,66,80,30);
  ctx.fillStyle="#b89868";ctx.fillRect(14,68,68,28);
  ctx.fillStyle="#c8a878";ctx.fillRect(20,70,56,20);
  ctx.fillStyle="#907838";ctx.fillRect(40,66,16,30);
  ctx.fillStyle="#5a4020";ctx.fillRect(20,82,56,4);
  ctx.fillStyle="#e8d070";ctx.fillRect(44,81,8,6);
  ctx.fillStyle="#ddd";ctx.fillRect(36,62,24,6);
  ctx.fillStyle="#d8b8a0";ctx.fillRect(40,54,16,12);
  ctx.fillStyle="#d8b8a0";ctx.fillRect(28,18,40,40);ctx.fillRect(26,22,44,32);
  ctx.fillStyle="#6b5030";ctx.fillRect(20,6,56,16);
  ctx.fillStyle="#8b6a40";ctx.fillRect(24,8,48,12);
  ctx.fillStyle="#6b5030";ctx.fillRect(18,18,60,4);
  ctx.fillStyle="#7a5a30";ctx.fillRect(42,8,12,4);
  ctx.fillStyle="#fff";ctx.fillRect(32,30,10,6);ctx.fillRect(54,30,10,6);
  ctx.fillStyle="#334";ctx.fillRect(36,31,6,5);ctx.fillRect(58,31,6,5);
  ctx.fillStyle="#111";ctx.fillRect(38,32,2,3);ctx.fillRect(60,32,2,3);
  ctx.fillStyle="#5a4a30";ctx.fillRect(32,27,10,3);ctx.fillRect(54,27,10,3);
  ctx.fillStyle="#c8a890";ctx.fillRect(46,36,8,10);
  ctx.fillStyle="#b0a090";ctx.fillRect(34,46,28,6);
  ctx.fillStyle="#b08070";ctx.fillRect(40,50,16,2);
  ctx.fillStyle="#eee";ctx.fillRect(78,72,14,18);ctx.fillStyle="#aaa";ctx.fillRect(78,72,14,2);
}
function drawPortraitSoothsayer(ctx){
  ctx.fillStyle="#0a0614";ctx.fillRect(0,0,96,96);
  // Robe body
  ctx.fillStyle="#1a0830";ctx.fillRect(6,60,84,36);
  ctx.fillStyle="#2a1040";ctx.fillRect(12,62,72,34);
  ctx.fillStyle="#3a1a50";ctx.fillRect(20,64,56,32);
  // Mystical rune/star decorations on robe
  ctx.fillStyle="#e8d070";ctx.fillRect(24,72,3,3);ctx.fillRect(68,78,3,3);
  ctx.fillStyle="#c8b060";ctx.fillRect(40,82,4,1);ctx.fillRect(41,81,2,3);
  ctx.fillStyle="#aaa0d0";ctx.fillRect(56,70,2,3);ctx.fillRect(55,71,4,1);
  ctx.fillStyle="#e8d070";ctx.fillRect(32,88,2,2);
  // Robe glow edge
  ctx.fillStyle="rgba(140,100,255,0.6)";ctx.fillRect(6,92,84,4);
  // Hood
  ctx.fillStyle="#1a0830";ctx.fillRect(16,4,64,56);
  ctx.fillStyle="#2a1040";ctx.fillRect(20,8,56,48);
  ctx.fillStyle="#221038";ctx.fillRect(24,12,48,40);
  // Deep hood shadows on sides
  ctx.fillStyle="#0e0420";ctx.fillRect(16,6,8,50);ctx.fillRect(72,6,8,50);
  // Face in shadow
  ctx.fillStyle="#c8b0a0";ctx.fillRect(30,24,36,28);
  ctx.fillStyle="#b8a090";ctx.fillRect(28,28,40,20);
  // Shadowed face edges
  ctx.fillStyle="#a08878";ctx.fillRect(28,28,4,16);ctx.fillRect(64,28,4,16);
  // Brighter glowing eyes
  ctx.fillStyle="#d0a0ff";ctx.fillRect(34,32,8,6);ctx.fillRect(54,32,8,6);
  ctx.fillStyle="#e8c0ff";ctx.fillRect(36,33,4,4);ctx.fillRect(56,33,4,4);
  ctx.fillStyle="#fff";ctx.fillRect(37,34,2,2);ctx.fillRect(57,34,2,2);
  // Nose
  ctx.fillStyle="#b8a090";ctx.fillRect(46,38,6,8);
  // Mouth
  ctx.fillStyle="#8a7060";ctx.fillRect(42,48,14,2);
  // Crystal ball — large round using arc
  ctx.save();
  // Crystal ball glow aura
  ctx.fillStyle="rgba(100,180,255,0.25)";ctx.beginPath();ctx.arc(48,78,18,0,Math.PI*2);ctx.fill();
  // Crystal ball
  ctx.fillStyle="rgba(80,160,240,0.7)";ctx.beginPath();ctx.arc(48,78,13,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="rgba(120,200,255,0.7)";ctx.beginPath();ctx.arc(48,78,9,0,Math.PI*2);ctx.fill();
  // Swirling mist inside crystal ball
  ctx.fillStyle="rgba(200,230,255,0.4)";ctx.beginPath();ctx.arc(44,76,4,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="rgba(180,210,255,0.3)";ctx.beginPath();ctx.arc(52,80,3,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="rgba(220,240,255,0.35)";ctx.beginPath();ctx.arc(48,74,2,0,Math.PI*2);ctx.fill();
  // Crystal ball highlight
  ctx.fillStyle="#fff";ctx.fillRect(42,72,4,4);
  ctx.restore();
}
function drawPortraitForensics(ctx){
  ctx.fillStyle="#0a0e14";ctx.fillRect(0,0,96,96);
  ctx.fillStyle="#d8d8e0";ctx.fillRect(8,66,80,30);
  ctx.fillStyle="#e8e8ee";ctx.fillRect(14,68,68,28);
  ctx.fillStyle="#f0f0f8";ctx.fillRect(20,70,56,20);
  ctx.fillStyle="#aaa";ctx.fillRect(46,72,4,4);ctx.fillRect(46,80,4,4);
  ctx.fillStyle="#d0d0d8";ctx.fillRect(24,74,14,8);
  ctx.fillStyle="#3388cc";ctx.fillRect(26,74,4,6);
  ctx.fillStyle="#f0f0f8";ctx.fillRect(36,62,24,6);
  ctx.fillStyle="#e8c8b8";ctx.fillRect(40,54,16,12);
  ctx.fillStyle="#e8c8b8";ctx.fillRect(28,18,40,40);ctx.fillRect(26,22,44,32);
  ctx.fillStyle="#5a4030";ctx.fillRect(24,8,48,16);
  ctx.fillStyle="#5a4030";ctx.fillRect(22,12,4,24);ctx.fillRect(70,12,4,24);
  ctx.fillStyle="#6a5040";ctx.fillRect(28,10,40,6);
  ctx.fillStyle="#aaa";ctx.fillRect(30,28,14,10);ctx.fillRect(52,28,14,10);
  ctx.fillStyle="#cceeff";ctx.fillRect(32,30,10,6);ctx.fillRect(54,30,10,6);
  ctx.fillStyle="#aaa";ctx.fillRect(44,32,8,2);ctx.fillRect(26,32,4,2);ctx.fillRect(66,32,4,2);
  ctx.fillStyle="#fff";ctx.fillRect(34,31,6,4);ctx.fillRect(56,31,6,4);
  ctx.fillStyle="#334";ctx.fillRect(36,32,4,3);ctx.fillRect(58,32,4,3);
  ctx.fillStyle="#d8b8a8";ctx.fillRect(46,36,6,8);
  ctx.fillStyle="#b08070";ctx.fillRect(42,48,14,2);
  ctx.fillStyle="#8b6a3a";ctx.fillRect(74,70,16,22);ctx.fillStyle="#eee";ctx.fillRect(76,72,12,18);
  ctx.fillStyle="#aaa";ctx.fillRect(78,76,8,1);ctx.fillRect(78,80,8,1);ctx.fillRect(78,84,6,1);
}

// -- Closeup drawing functions (128x128) --
function drawCloseupPainting1(ctx){
  ctx.fillStyle="#1a1420";ctx.fillRect(0,0,128,128);
  ctx.fillStyle="#c8a040";ctx.fillRect(8,8,112,112);ctx.fillStyle="#a08030";ctx.fillRect(10,10,108,108);
  ctx.fillStyle="#c8a040";ctx.fillRect(14,14,100,100);ctx.fillStyle="#2a1010";ctx.fillRect(18,18,92,92);
  ctx.fillStyle="#cc3030";ctx.fillRect(30,40,30,40);ctx.fillStyle="#ee4444";ctx.fillRect(50,30,35,25);
  ctx.fillStyle="#aa2020";ctx.fillRect(65,55,30,35);ctx.fillStyle="#dd5555";ctx.fillRect(25,70,20,20);
  ctx.fillStyle="#881818";ctx.fillRect(70,35,20,20);
  ctx.fillStyle="#c8a040";ctx.font="6px serif";ctx.textAlign="center";ctx.fillText("VP Mauve",64,106);ctx.textAlign="left";
}
function drawCloseupPainting2(ctx){
  ctx.fillStyle="#1a1420";ctx.fillRect(0,0,128,128);
  ctx.fillStyle="#3a2a1a";ctx.fillRect(10,10,108,108);
  ctx.fillStyle="#6aa8dd";ctx.fillRect(14,14,100,30);ctx.fillStyle="#4a88cc";ctx.fillRect(14,34,100,20);
  ctx.fillStyle="#fff";ctx.fillRect(30,18,20,8);ctx.fillRect(70,22,24,6);
  ctx.fillStyle="#3a8844";ctx.fillRect(14,54,100,30);ctx.fillStyle="#2a6630";ctx.fillRect(14,64,100,20);
  ctx.fillStyle="#4488bb";ctx.fillRect(14,84,100,30);ctx.fillStyle="#5599cc";ctx.fillRect(20,86,88,10);
}
function drawCloseupPainting3(ctx){
  ctx.fillStyle="#1a1420";ctx.fillRect(0,0,128,128);
  ctx.fillStyle="#5a4020";ctx.fillRect(10,10,108,108);ctx.fillStyle="#2a1a10";ctx.fillRect(14,14,100,100);
  ctx.fillStyle="#6a4a2a";ctx.fillRect(30,80,68,20);
  ctx.fillStyle="#dda030";ctx.fillRect(40,55,20,25);ctx.fillStyle="#eebb40";ctx.fillRect(43,58,14,18);
  ctx.fillStyle="#cc8820";ctx.fillRect(70,60,18,20);ctx.fillStyle="#ddaa30";ctx.fillRect(73,63,12,14);
  ctx.fillStyle="#dda030";ctx.fillRect(52,65,14,15);ctx.fillStyle="#eebb40";ctx.fillRect(55,68,8,10);
}
function drawCloseupVase(ctx){
  ctx.fillStyle="#1a1420";ctx.fillRect(0,0,128,128);
  ctx.fillStyle="#f0ece0";ctx.fillRect(44,20,40,8);ctx.fillRect(38,28,52,12);
  ctx.fillRect(34,40,60,50);ctx.fillRect(40,90,48,10);ctx.fillRect(36,100,56,8);
  ctx.fillStyle="#3366cc";ctx.fillRect(40,45,8,8);ctx.fillRect(56,45,8,8);ctx.fillRect(72,45,8,8);
  ctx.fillRect(48,60,8,8);ctx.fillRect(64,60,8,8);ctx.fillRect(38,75,52,3);
  ctx.fillStyle="#2244aa";ctx.fillRect(44,55,4,12);ctx.fillRect(60,42,4,16);ctx.fillRect(76,55,4,12);
}
function drawCloseupFrame(ctx){
  ctx.fillStyle="#1a1420";ctx.fillRect(0,0,128,128);
  ctx.fillStyle="#444";ctx.fillRect(12,12,104,104);ctx.fillStyle="#555";ctx.fillRect(14,14,100,100);
  ctx.fillStyle="#333";ctx.fillRect(18,18,92,92);ctx.fillStyle="#444";ctx.fillRect(30,30,68,68);
  ctx.fillStyle="#8b6644";ctx.fillRect(34,34,60,60);ctx.fillStyle="#6b8844";ctx.fillRect(38,38,52,40);
  ctx.fillStyle="#5a7733";ctx.fillRect(38,60,52,18);
  ctx.fillStyle="#aaa";ctx.font="5px monospace";ctx.textAlign="center";ctx.fillText("HEAVY IRON FRAME",64,108);ctx.textAlign="left";
}
function drawCloseupStatue(ctx){
  ctx.fillStyle="#1a1420";ctx.fillRect(0,0,128,128);
  ctx.fillStyle="#556";ctx.fillRect(50,20,28,30);ctx.fillStyle="#667";ctx.fillRect(54,14,20,12);
  ctx.fillStyle="#445";ctx.fillRect(40,45,48,35);ctx.fillStyle="#556";ctx.fillRect(44,48,40,28);
  ctx.fillStyle="#334";ctx.fillRect(35,75,58,8);ctx.fillStyle="#445";ctx.fillRect(30,83,68,6);
  ctx.fillStyle="#556";ctx.fillRect(28,89,72,8);
  ctx.fillStyle="#667";ctx.fillRect(56,30,4,20);ctx.fillRect(68,40,12,8);
  ctx.fillStyle="#884444";ctx.fillRect(36,92,16,4);ctx.fillRect(60,93,10,3);
}
function drawCloseupMirror(ctx){
  ctx.fillStyle="#1a1420";ctx.fillRect(0,0,128,128);
  ctx.fillStyle="#c8a040";ctx.fillRect(20,10,88,100);ctx.fillStyle="#a08030";ctx.fillRect(24,14,80,92);
  ctx.fillStyle="#88aabb";ctx.fillRect(28,18,72,84);ctx.fillStyle="#99bbcc";ctx.fillRect(32,22,64,76);
  ctx.fillStyle="#aaccdd";ctx.fillRect(36,26,30,30);ctx.fillStyle="#fff";ctx.fillRect(40,30,8,8);
  ctx.strokeStyle="#444";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(85,22);ctx.lineTo(75,45);ctx.lineTo(82,60);ctx.stroke();ctx.lineWidth=1;
  ctx.fillStyle="#6b4a2a";ctx.fillRect(40,106,20,8);ctx.fillRect(60,108,12,6);
}
function drawCloseupCounter(ctx){
  ctx.fillStyle="#1a1420";ctx.fillRect(0,0,128,128);
  ctx.fillStyle="#8b6a3a";ctx.fillRect(8,50,112,40);ctx.fillStyle="#aa8a5a";ctx.fillRect(10,52,108,36);
  ctx.fillStyle="#555";ctx.fillRect(70,30,30,24);ctx.fillStyle="#4a4";ctx.fillRect(74,34,22,12);
  ctx.fillStyle="#555";ctx.fillRect(68,50,4,20);
  ctx.fillStyle="#cc3030";ctx.fillRect(20,42,14,10);ctx.fillStyle="#3060cc";ctx.fillRect(38,38,10,14);
  ctx.fillStyle="#cc9930";ctx.fillRect(50,44,8,8);ctx.fillStyle="#30aa60";ctx.fillRect(14,56,12,8);
}
function drawCloseupCamera(ctx){
  ctx.fillStyle="#0a0a0a";ctx.fillRect(0,0,128,128);
  // Monitor frame
  ctx.fillStyle="#333";ctx.fillRect(8,8,112,96);
  ctx.fillStyle="#222";ctx.fillRect(12,12,104,88);
  // Screen content — grainy dark footage
  ctx.fillStyle="#0a1a0a";ctx.fillRect(14,14,100,84);
  // Doorway view
  ctx.fillStyle="#1a2a1a";ctx.fillRect(40,30,48,60);
  ctx.fillStyle="#0a140a";ctx.fillRect(44,34,40,52);
  // Door frame
  ctx.fillStyle="#2a3a2a";ctx.fillRect(40,30,4,60);ctx.fillRect(84,30,4,60);ctx.fillRect(40,30,48,4);
  // Scan lines
  for(var i=14;i<98;i+=3){ctx.fillStyle="rgba(0,255,0,0.04)";ctx.fillRect(14,i,100,1);}
  // Timestamp text
  ctx.fillStyle="#00ff00";ctx.font="6px monospace";ctx.textAlign="left";
  ctx.fillText("CAM-03 BATH ENTRANCE",16,24);
  ctx.fillText("22:47:31",80,94);
  // Static noise dots
  for(var j=0;j<30;j++){ctx.fillStyle="rgba(0,255,0,0.15)";ctx.fillRect(14+Math.random()*100,14+Math.random()*84,2,1);}
  // "REC" indicator
  ctx.fillStyle="#ff0000";ctx.fillRect(16,90,4,4);
  ctx.fillStyle="#ff0000";ctx.font="5px monospace";ctx.fillText("REC",22,94);
  ctx.textAlign="left";
  // Monitor stand
  ctx.fillStyle="#444";ctx.fillRect(48,104,32,8);
  ctx.fillStyle="#333";ctx.fillRect(54,112,20,12);
  ctx.fillStyle="#444";ctx.fillRect(44,122,40,4);
}

// -- Examinable objects --
const L2_EXAMINABLES=[
  {key:"painting1",x:6*TILE,y:1*TILE,room:"hall",label:"PAINTING - Red Abstract",drawCloseup:drawCloseupPainting1,description:"A bold abstract painting in crimson. The heavy gilded frame could certainly do damage. Signed 'VP Mauve — Personal Collection'."},
  {key:"painting2",x:9*TILE,y:1*TILE,room:"hall",label:"PAINTING - Blue Landscape",drawCloseup:drawCloseupPainting2,description:"A serene blue landscape. The frame is lightweight birch. Unlikely to be a weapon."},
  {key:"painting3",x:15*TILE,y:1*TILE,room:"hall",label:"PAINTING - Golden Still Life",drawCloseup:drawCloseupPainting3,description:"A still life of golden fruit. The canvas is old but well-preserved. Nothing suspicious."},
  {key:"vase",x:2*TILE,y:3*TILE,room:"hall",label:"EVIDENCE - Porcelain Vase",drawCloseup:drawCloseupVase,description:"A rare Ming dynasty porcelain vase. Surprisingly heavy. It could certainly be used as a weapon."},
  {key:"frame",x:3*TILE,y:3*TILE,room:"hall",label:"EVIDENCE - Heavy Painting Frame",drawCloseup:drawCloseupFrame,description:"An antique painting with an unusually heavy iron frame. Could deliver a lethal blow. Wait — there's a thread caught on the frame... it's mauve-colored, matching VP Mauve's outfit."},
  {key:"statue",x:4*TILE,y:3*TILE,room:"hall",label:"EVIDENCE - Abstract Statue",drawCloseup:drawCloseupStatue,description:"An abstract stone statue. Dense, heavy, with sharp angular edges. It's surprisingly solid for its size."},
  {key:"mirror",x:7*TILE,y:2*TILE,room:"bathroom",label:"ORNATE MIRROR",drawCloseup:drawCloseupMirror,description:"An ornate bathroom mirror. There's a small crack in the corner. You notice muddy footprints on the floor nearby."},
  {key:"counter",x:10*TILE,y:3*TILE,room:"giftshop",label:"GIFT SHOP COUNTER",drawCloseup:drawCloseupCounter,description:"The gift shop counter. The register is open and empty. Several items appear to have been knocked over recently."},
  {key:"camera",x:16*TILE,y:3*TILE,room:"hall",label:"SECURITY MONITOR",drawCloseup:drawCloseupCamera,description:"Security footage of the bathroom entrance. The tape shows VP Mauve and Viscount Eminence entering and leaving the bathroom... but the Duchess of Vermillion never appears. She never went into the bathroom."},
];

function Level2({ onWin, onRestart, muted, setMuted, muteBtn, startMusicForLevel, apiKey, model }) {
  const canvasRef=useRef(null);
  const portraitRef=useRef(null);
  const keysRef=useRef({});
  const playerRef=useRef({x:10*TILE,y:12*TILE,dir:"up",frame:0,tick:0});
  const [room,setRoom]=useState("hall");
  const [chatOpen,setChatOpen]=useState(false);
  const [talkingTo,setTalkingTo]=useState(null);
  const [messages,setMessages]=useState({mauve:[],viscount:[],duchess:[],cop:[],lead:[],soothsayer:[],forensics:[]});
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [nearEntity,setNearEntity]=useState(null);
  const [nearExaminable,setNearExaminable]=useState(null);
  const [examining,setExamining]=useState(null);
  const [notebook,setNotebook]=useState({open:false,suspectWeapon:[["","",""],["","",""],["","",""]],suspectRoom:[["","",""],["","",""],["","",""]],roomWeapon:[["","",""],["","",""],["","",""]],autoMarks:{}});
  const [discoveredClues,setDiscoveredClues]=useState([]);
  const [result,setResult]=useState(null);
  const [sayingBye,setSayingBye]=useState(false);
  const { typingText, startTyping, stopTyping } = useTypewriter();
  const greetedNpcRef = useRef({});
  const [accusation,setAccusation]=useState(null); // null | {step:"who"|"what"|"where", who:null, what:null, where:null}
  const inputRef=useRef(null);
  const chatEndRef=useRef(null);
  const walkAwayRef=useRef(null);
  const chatOpenRef=useRef(false);
  const resultRef=useRef(null);
  const roomRef=useRef("hall");
  const examiningRef=useRef(null);
  const notebookRef=useRef(false);
  const greetedRef=useRef(false);
  const examCanvasRef=useRef(null);
  const cutsceneRef=useRef("pause");
  const cutsceneTimerRef=useRef(48);
  const leadPosRef=useRef({x:10*TILE, y:8*TILE});
  const typewriterRef=useRef(null);

  // Wandering suspects
  const wanderRef=useRef({
    mauve:{x:4*TILE,y:9*TILE,homeX:4*TILE,homeY:9*TILE,tx:4*TILE,ty:9*TILE,timer:0,frame:0,tick:0,dir:"down"},
    viscount:{x:8*TILE,y:5*TILE,homeX:8*TILE,homeY:5*TILE,tx:8*TILE,ty:5*TILE,timer:0,frame:0,tick:0,dir:"down"},
    duchess:{x:10*TILE,y:6*TILE,homeX:10*TILE,homeY:6*TILE,tx:10*TILE,ty:6*TILE,timer:0,frame:0,tick:0,dir:"down"},
  });

  useEffect(()=>{chatOpenRef.current=chatOpen;},[chatOpen]);
  useEffect(()=>{resultRef.current=result;},[result]);
  useEffect(()=>{roomRef.current=room;},[room]);
  useEffect(()=>{examiningRef.current=examining;},[examining]);
  useEffect(()=>{notebookRef.current=notebook.open;},[notebook.open]);

  // Pre-set lead detective's greeting for subsequent talks
  useEffect(()=>{
    if(!greetedRef.current){
      greetedRef.current=true;
    }
  },[]);

  // Draw examination close-up
  useEffect(()=>{
    if(!examining)return;
    var canvas=examCanvasRef.current;
    if(!canvas)return;
    var ctx=canvas.getContext("2d");
    ctx.imageSmoothingEnabled=false;
    ctx.clearRect(0,0,128,128);
    examining.drawCloseup(ctx);
  },[examining]);

  // Keyboard
  useEffect(()=>{
    const down=e=>{
      if(chatOpenRef.current||resultRef.current||examiningRef.current||cutsceneRef.current||notebookRef.current)return;
      keysRef.current[e.key]=true;
      startMusicForLevel();
      if(e.key==="z"||e.key==="Z"){
        e.preventDefault();
        const p=playerRef.current;
        const roomNpcs=L2_ALL_NPCS.filter(n=>n.room===roomRef.current);
        const wd=wanderRef.current;
        const isFacing=(bx,by)=>{const dx=bx-p.x,dy=by-p.y,adx=Math.abs(dx),ady=Math.abs(dy);if(adx>INTERACT_DIST||ady>INTERACT_DIST)return false;if(p.dir==="up"&&dy<0&&ady>=adx)return true;if(p.dir==="down"&&dy>0&&ady>=adx)return true;if(p.dir==="left"&&dx<0&&adx>=ady)return true;if(p.dir==="right"&&dx>0&&adx>=ady)return true;return false;};
        let foundNpc=false;
        for(const npc of roomNpcs){
          const w=wd[npc.key];
          const nx=w?w.x:npc.x, ny=w?w.y:npc.y;
          if(isFacing(nx,ny)){
            setTalkingTo(npc.key);setChatOpen(true);
            let greeting="";
            if(npc.key==="mauve")greeting="Hmph. I'm a very busy woman. What do you want?";
            if(npc.key==="viscount")greeting="*adjusts monocle* Ah, the detective. How tedious.";
            if(npc.key==="duchess")greeting="Oh my! A real detective? How thrilling!";
            if(npc.key==="cop")greeting="Detective Andrew. Got a theory? You can chat with me, or when you're ready, hit the MAKE ACCUSATION button.";
            if(npc.key==="lead")greeting="Need more details, detective? Ask away.";
            if(npc.key==="soothsayer")greeting="The spirits whisper to me... One of the three suspects speaks only lies. But the mists obscure which one... I also sense that each suspect was in a separate room, each with a separate object, at the time of the murder. Trust your wits, detective.";
            if(npc.key==="forensics")greeting="I've cataloged the potential murder weapons. There are three: a rare porcelain vase, an antique painting in a heavy frame, and an abstract stone statue. The murder weapon is definitely one of these three.";
            setMessages(prev=>{
              if(prev[npc.key].length>0)return prev;
              return{...prev,[npc.key]:[{role:"assistant",text:greeting}]};
            });
            if(!greetedNpcRef.current[npc.key]){greetedNpcRef.current[npc.key]=true;startTyping(npc.key,greeting);}
            if(npc.key==="soothsayer") setDiscoveredClues(prev => { let c=[...prev]; if(!c.includes("The Soothsayer senses one suspect is lying  the others tell the truth."))c.push("The Soothsayer senses one suspect is lying  the others tell the truth."); if(!c.includes("The Soothsayer senses each suspect was in a separate room with a separate object."))c.push("The Soothsayer senses each suspect was in a separate room with a separate object."); return c; });
            foundNpc=true;
            break;
          }
        }
        if(!foundNpc){
          const roomExams=L2_EXAMINABLES.filter(ex=>ex.room===roomRef.current);
          for(const ex of roomExams){
            if(isFacing(ex.x,ex.y)){
              setExamining(ex);
              if(ex.key==="frame") setDiscoveredClues(prev => prev.includes("A mauve thread was found on the painting frame — VP Mauve had the painting.") ? prev : [...prev, "A mauve thread was found on the painting frame — VP Mauve had the painting."]);
              if(ex.key==="camera") setDiscoveredClues(prev => prev.includes("Security footage shows the Duchess of Vermillion never entered the bathroom.") ? prev : [...prev, "Security footage shows the Duchess of Vermillion never entered the bathroom."]);
              break;
            }
          }
        }
      }
      if(e.key==="c"||e.key==="C")setNotebook(p=>({...p,open:!p.open}));
    };
    const up=e=>{keysRef.current[e.key]=false;};
    window.addEventListener("keydown",down);window.addEventListener("keyup",up);
    return()=>{window.removeEventListener("keydown",down);window.removeEventListener("keyup",up);};
  },[startMusicForLevel]);

  useEffect(()=>{if(chatOpen&&inputRef.current)inputRef.current.focus();},[chatOpen]);
  useEffect(()=>{const h=e=>{if(e.key==="Escape"){if(notebookRef.current){e.preventDefault();setNotebook(p=>({...p,open:false}));return;}if(examiningRef.current){e.preventDefault();setExamining(null);return;}if(chatOpenRef.current){e.preventDefault();setChatOpen(false);}}};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);},[]);
  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);

  // Portrait drawing
  useEffect(()=>{
    if(!chatOpen||!talkingTo)return;
    const canvas=portraitRef.current;
    if(!canvas)return;
    const ctx=canvas.getContext("2d");
    ctx.imageSmoothingEnabled=false;
    ctx.clearRect(0,0,96,96);
    if(talkingTo==="mauve")drawPortraitMauve(ctx);
    else if(talkingTo==="viscount")drawPortraitViscount(ctx);
    else if(talkingTo==="duchess")drawPortraitDuchess(ctx);
    else if(talkingTo==="cop")drawPortraitCop(ctx);
    else if(talkingTo==="lead")drawPortraitLeadDetective(ctx);
    else if(talkingTo==="soothsayer")drawPortraitSoothsayer(ctx);
    else if(talkingTo==="forensics")drawPortraitForensics(ctx);
  },[chatOpen,talkingTo]);

  // Game loop
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");ctx.imageSmoothingEnabled=false;
    let raf;
    const loop=()=>{
      const p=playerRef.current,keys=keysRef.current;let moved=false;
      const curRoom=roomRef.current;

      // Cutscene: Lead Detective notices player, then walks to greet
      if(cutsceneRef.current&&curRoom==="hall"){
        const lp=leadPosRef.current;
        if(cutsceneRef.current==="pause"){
          cutsceneTimerRef.current--;
          if(cutsceneTimerRef.current<=0){cutsceneRef.current="alert";cutsceneTimerRef.current=80;try{const alertSynth=new Tone.Synth({oscillator:{type:"square"},envelope:{attack:0.01,decay:0.1,sustain:0,release:0.1},volume:-8}).toDestination();alertSynth.triggerAttackRelease("C5","8n");setTimeout(()=>alertSynth.triggerAttackRelease("E5","8n"),100);}catch{}}
        }else if(cutsceneRef.current==="alert"){
          cutsceneTimerRef.current--;
          if(cutsceneTimerRef.current<=0){cutsceneRef.current="walk";}
        }else if(cutsceneRef.current==="walk"){
          const targetY=10*TILE;
          if(lp.y<targetY){
            lp.y+=1.8;
            if(lp.y>targetY)lp.y=targetY;
          }else{
            cutsceneRef.current=false;
            const greeting="Thank God you're here! There's been a murder at the Ashworth Gallery! Lord Ashworth, the curator, was found dead right here in the entry hall. Blunt force trauma. We have three suspects: VP Mauve \u2014 a corporate executive who funded the new wing, Viscount Eminence \u2014 an aristocrat who loaned pieces to the collection, and The Duchess of Vermillion \u2014 a wealthy socialite and frequent patron. Question them, examine the evidence, and report to Detective Andrews with your accusation: WHO did it, with WHAT weapon, and WHERE.";
            setMessages(prev=>({...prev,lead:[{role:"assistant",text:greeting}]}));
            setTalkingTo("lead");
            setChatOpen(true);
            greetedNpcRef.current["lead"]=true;startTyping("lead",greeting);
          }
        }
      }

      // Update wandering suspects
      const wander=wanderRef.current;
      const WANDER_RANGE=1.2*TILE;
      const WANDER_SPEED=0.5;
      for(const key of ["mauve","viscount","duchess"]){
        const w=wander[key];
        if(!chatOpenRef.current||talkingTo!==key){
          w.timer--;
          if(w.timer<=0){
            // Alternate between idle pause and picking new target
            if(w.idle){
              w.idle=false;
              w.timer=60+Math.random()*90;
              // Pick cardinal direction only (horizontal or vertical)
              const dir=Math.random()<0.5?"h":"v";
              const dist=(Math.random()-0.5)*2*WANDER_RANGE;
              if(dir==="h"){w.tx=w.homeX+dist;w.ty=w.y;}
              else{w.tx=w.x;w.ty=w.homeY+dist;}
              w.tx=Math.max(TILE+4,Math.min((L2_COLS-2)*TILE-4,w.tx));
              w.ty=Math.max(2*TILE+4,Math.min((L2_ROWS-2)*TILE-4,w.ty));
            }else{
              w.idle=true;
              w.timer=100+Math.random()*200;
              w.tx=w.x;w.ty=w.y;
            }
          }
          const dx=w.tx-w.x,dy=w.ty-w.y;
          const d=Math.hypot(dx,dy);
          if(d>2&&!w.idle){
            // Move on one axis only
            let mx=0,my=0;
            if(Math.abs(dx)>Math.abs(dy)){mx=dx>0?WANDER_SPEED:-WANDER_SPEED;w.dir=dx>0?"right":"left";}
            else{my=dy>0?WANDER_SPEED:-WANDER_SPEED;w.dir=dy>0?"down":"up";}
            // Don't walk into player or furniture
            const nextX=w.x+mx,nextY=w.y+my;
            const hb=(bx,by,bw,bh)=>nextX+TILE>bx&&nextX<bx+bw&&nextY+TILE>by&&nextY<by+bh;
            // Find which room this NPC is in
            const npcRoom=["mauve","viscount","duchess"].indexOf(key)===1?"bathroom":key==="duchess"?"giftshop":"hall";
            let blocked=false;
            if(nextX<TILE||nextX+TILE>(L2_COLS-1)*TILE||nextY<2*TILE||nextY+TILE>(L2_ROWS-1)*TILE)blocked=true;
            if(npcRoom==="hall"&&(hb(8*TILE-4,5*TILE+16,4*TILE+8,2*TILE+16)||hb(2*TILE,3*TILE,3*TILE,TILE)||hb(7*TILE,9*TILE,7*TILE,TILE)))blocked=true;
            if(npcRoom==="bathroom"&&(hb(3*TILE,3*TILE,2*TILE,TILE)||hb(7*TILE,3*TILE,2*TILE,TILE)||hb(2*TILE,7*TILE,3*TILE,3*TILE)||hb(6*TILE,7*TILE,3*TILE,3*TILE)||hb(10*TILE,7*TILE,3*TILE,3*TILE)))blocked=true;
            if(npcRoom==="giftshop"&&(hb(9*TILE,3*TILE,4*TILE,TILE)||hb(13*TILE,2*TILE,2*TILE,6*TILE)||hb(3*TILE,6*TILE,3*TILE,TILE)))blocked=true;
            if(!blocked&&Math.hypot(nextX-p.x,nextY-p.y)>TILE*1.2){
              w.x=nextX;w.y=nextY;
              w.tick++;if(w.tick>10){w.frame++;w.tick=0;}
            }else{
              w.tx=w.x;w.ty=w.y;w.idle=true;w.timer=80+Math.random()*120;
            }
          }
        }
      }

      if(!chatOpenRef.current&&!resultRef.current&&!examiningRef.current&&!cutsceneRef.current&&!notebookRef.current){
        let nx=p.x,ny=p.y;
        if(keys["ArrowUp"]||keys["w"]){ny-=SPEED;p.dir="up";moved=true;}
        if(keys["ArrowDown"]||keys["s"]){ny+=SPEED;p.dir="down";moved=true;}
        if(keys["ArrowLeft"]||keys["a"]){nx-=SPEED;p.dir="left";moved=true;}
        if(keys["ArrowRight"]||keys["d"]){nx+=SPEED;p.dir="right";moved=true;}
        const roomNpcs=L2_ALL_NPCS.filter(n=>n.room===curRoom);
        const npcPos=(npc)=>{const w=wander[npc.key];return w?{x:w.x,y:w.y}:{x:npc.x,y:npc.y};};
        // Furniture collision boxes per room
        const hitBox=(tx,ty,bx,by,bw,bh)=>tx+TILE>bx&&tx<bx+bw&&ty+TILE>by&&ty<by+bh;
        const walkable=(tx,ty)=>{
          if(tx<TILE||tx+TILE>(L2_COLS-1)*TILE||ty<2*TILE||ty+TILE>(L2_ROWS-1)*TILE)return false;
          for(const npc of roomNpcs){const np=npcPos(npc);if(tx+TILE>np.x+4&&tx<np.x+TILE-4&&ty+TILE>np.y+8&&ty<np.y+TILE-2)return false;}
          if(curRoom==="hall"){
            // Caution tape
            if(hitBox(tx,ty,8*TILE-4,5*TILE+16,4*TILE+8,2*TILE+16))return false;
            // Evidence display case
            if(hitBox(tx,ty,2*TILE,3*TILE,3*TILE,TILE))return false;
            // Velvet rope posts
            if(hitBox(tx,ty,7*TILE,9*TILE,7*TILE,TILE))return false;
          }
          if(curRoom==="bathroom"){
            // Sinks (left pair)
            if(hitBox(tx,ty,3*TILE,3*TILE,2*TILE,TILE))return false;
            // Sinks (right pair)
            if(hitBox(tx,ty,7*TILE,3*TILE,2*TILE,TILE))return false;
            // Stalls
            if(hitBox(tx,ty,2*TILE,7*TILE,3*TILE,3*TILE))return false;
            if(hitBox(tx,ty,6*TILE,7*TILE,3*TILE,3*TILE))return false;
            if(hitBox(tx,ty,10*TILE,7*TILE,3*TILE,3*TILE))return false;
          }
          if(curRoom==="giftshop"){
            // Counter
            if(hitBox(tx,ty,9*TILE,3*TILE,4*TILE,TILE))return false;
            // Shelves on right wall
            if(hitBox(tx,ty,13*TILE,2*TILE,2*TILE,6*TILE))return false;
            // Display table
            if(hitBox(tx,ty,3*TILE,6*TILE,3*TILE,TILE))return false;
          }
          return true;
        };
        if(walkable(nx,ny)){p.x=nx;p.y=ny;}
        else if(walkable(nx,p.y)){p.x=nx;}
        else if(walkable(p.x,ny)){p.y=ny;}
        // Door transition
        const doors=L2_ROOM_DOORS[curRoom];
        for(const door of doors){
          const dcx=door.col*TILE+TILE/2,dcy=door.row*TILE+TILE/2;
          const pcx=p.x+TILE/2,pcy=p.y+TILE/2;
          if(Math.hypot(pcx-dcx,pcy-dcy)<TILE*1.2){
            roomRef.current=door.target;
            setRoom(door.target);
            p.x=door.spawnX;p.y=door.spawnY;
            break;
          }
        }
      }
      if(moved){p.tick++;if(p.tick>8){p.frame++;p.tick=0;}}
      // Near detection — cardinal only (not diagonal)
      const activeNpcs=L2_ALL_NPCS.filter(n=>n.room===roomRef.current);
      const getNpcPos=(npc)=>{const w=wander[npc.key];return w?{x:w.x,y:w.y}:{x:npc.x,y:npc.y};};
      const isFacingNear=(ax,ay,bx,by,dist,dir)=>{
        const dx=bx-ax,dy=by-ay;
        const adx=Math.abs(dx),ady=Math.abs(dy);
        if(adx>dist||ady>dist)return false;
        if(dir==="up"&&dy<0&&ady>=adx)return true;
        if(dir==="down"&&dy>0&&ady>=adx)return true;
        if(dir==="left"&&dx<0&&adx>=ady)return true;
        if(dir==="right"&&dx>0&&adx>=ady)return true;
        return false;
      };
      let ne=null;
      for(const npc of activeNpcs){const np=getNpcPos(npc);if(isFacingNear(p.x,p.y,np.x,np.y,INTERACT_DIST,p.dir)){ne=npc.key;break;}}
      setNearEntity(ne);
      const roomExams=L2_EXAMINABLES.filter(ex=>ex.room===roomRef.current);
      let nexam=null;
      for(const ex of roomExams){if(isFacingNear(p.x,p.y,ex.x,ex.y,INTERACT_DIST,p.dir)){nexam=ex.key;break;}}
      setNearExaminable(nexam);
      // Draw
      ctx.clearRect(0,0,L2_W,L2_H);
      const cr=roomRef.current;
      if(cr==="hall")drawEntryHall(ctx);
      else if(cr==="bathroom")drawBathroom(ctx);
      else drawGiftShop(ctx);
      activeNpcs.forEach(npc=>{
        const w=wander[npc.key];
        // During cutscene, draw lead detective at animated position
        const drawX=(npc.key==="lead"&&cutsceneRef.current)?leadPosRef.current.x:w?w.x:npc.x;
        const drawY=(npc.key==="lead"&&cutsceneRef.current)?leadPosRef.current.y:w?w.y:npc.y;
        npc.draw(ctx,drawX,drawY);
        ctx.fillStyle=npc.color;ctx.font="5px "+FONT;ctx.textAlign="center";
        ctx.fillText(npc.label,drawX+16,drawY-8);ctx.textAlign="left";
      });
      // Draw "!" alert above detective during alert phase
      if(cutsceneRef.current==="alert"){
        const lp=leadPosRef.current;
        ctx.fillStyle="#e8d070";ctx.font="14px "+FONT;ctx.textAlign="center";
        ctx.fillText("!",lp.x+16,lp.y-14);ctx.textAlign="left";
      }
      drawPlayer(ctx,p.x,p.y,p.dir,p.frame);
      if(!chatOpenRef.current&&!examiningRef.current&&!cutsceneRef.current){
        if(ne){const npc=activeNpcs.find(n=>n.key===ne);if(npc){const w=wander[npc.key];drawZPrompt(ctx,w?w.x:npc.x,w?w.y:npc.y);}}
        else if(nexam){const ex=roomExams.find(e=>e.key===nexam);if(ex)drawZPrompt(ctx,ex.x,ex.y);}
      }
      raf=requestAnimationFrame(loop);
    };
    raf=requestAnimationFrame(loop);
    return()=>cancelAnimationFrame(raf);
  },[]);

  // Send message
  const sendMessage=useCallback(async()=>{
    if(!input.trim()||loading||!talkingTo)return;
    const userMsg={role:"user",text:input.trim()};
    const curMsgs=[...messages[talkingTo],userMsg];
    setMessages(prev=>({...prev,[talkingTo]:curMsgs}));
    setInput("");setLoading(true);

    let sys="";
    if(talkingTo==="mauve"){
      sys=`You are Vice President Mauve, a 45-year-old sharp, impatient corporate executive. You are being questioned about a murder at the Ashworth Gallery.

BACKSTORY: You rose from nothing — daughter of a factory worker — to become VP of Acquisitions at Thornfield Industries. You funded the Ashworth Gallery's new wing and donated the red abstract painting that hangs in the entry hall, your prized possession. You are fiercely proud of your self-made success. The victim, Lord Ashworth, was the museum's 80-year-old curator. Five years ago, he nearly destroyed your career by leaking documents suggesting Thornfield Industries laundered money through art purchases. You survived the scandal through sheer ruthlessness, but you never forgave him. Still, you're far too calculating to murder someone at your own sponsored event.

RELATIONSHIPS WITH OTHER SUSPECTS:
- VISCOUNT EMINENCE: You despise him. Three years ago, at the annual Thornfield Gala, he publicly called you "a shopkeeper playing dress-up" in front of 200 guests. You've never forgotten it. You tried to buy his family's crumbling estate out of spite, but he blocked the sale. You suspect he's broke and maintaining appearances — you find his aristocratic pretensions pathetic. If pressed, you'll say he had more reason to kill Ashworth than anyone, because of the estate dispute.
- DUCHESS OF VERMILLION: You find her exhausting. She's always fluttering around the gift shop, calling everyone "darling." But you're not fooled — you once caught her whispering with Lord Ashworth in a way that seemed far too intimate for casual acquaintances. You also noticed she's been unusually interested in art valuations lately, which struck you as odd for someone supposedly so wealthy. You don't trust her, but you think she's too old and frail to be a killer — a judgment that may be wrong.
- THE THREE OF YOU: Lord Ashworth personally invited all three of you to tonight's private gallery viewing. You thought it was about securing more funding. Now you wonder if he had another agenda — perhaps confronting one of you.

MOTIVE: Lord Ashworth had recently found new evidence of Thornfield's art laundering and was planning to go to the press this time. His death keeps you safe — but you didn't do it.

PERSONALITY: Professional, curt, impatient, condescending toward "time-wasters." You check your watch constantly. You deflect personal questions with corporate jargon. You look down on aristocrats but secretly crave their social acceptance. You are happy to discuss the case, the other suspects, and your opinions openly. However, you are EVASIVE about your own whereabouts and what objects you had with you. If the detective presents evidence linking you to the painting (like the mauve thread), you reluctantly admit: "Fine. Yes, the painting is mine. I donated it. But I never used it to hurt anyone!" You will confess to having the painting if confronted with proof, but insist you are innocent of murder.

CORE STATEMENT: You are eager to share what you saw — you want to be helpful and point suspicion elsewhere. Early in conversation, you volunteer: "Viscount Eminence brought a rare vase." You bring this up readily when asked anything about the case, the suspects, or what happened.

You are in the ENTRY HALL. Keep answers under 2-3 sentences. 8-bit RPG style speech.`;
    }else if(talkingTo==="viscount"){
      sys=`You are Viscount Eminence, a 62-year-old aristocratic, slightly sinister nobleman. You are being questioned about a murder at the Ashworth Gallery.

BACKSTORY: You are the last of the Eminence bloodline, an ancient family whose fortune has been dwindling for generations. Your manor is crumbling, your servants have left, and you sell heirlooms one by one to maintain appearances. You loaned the rare porcelain vase to the Ashworth Gallery as a tax write-off — it's one of the last valuable things you own. The victim, Lord Ashworth, was your childhood friend. You grew up on neighboring estates and were inseparable until age 22, when his father purchased the Thornfield Estate — the property YOUR family had owned for 300 years — during your father's bankruptcy. You've harbored a deep, burning resentment for 40 years. Recently, you learned Ashworth's will would donate the Thornfield Estate to the museum permanently, destroying any hope of reclaiming it.

RELATIONSHIPS WITH OTHER SUSPECTS:
- VP MAUVE: You find her repulsive — crass, loud, nouveau riche. She represents everything wrong with the modern world: money without breeding, power without grace. She once tried to buy your family estate and you blocked it, which only deepened the mutual hatred. You know she's corrupt — everyone knows about the Thornfield art laundering scandal — and you enjoy reminding her of it with subtle barbs. You refer to her as "that business woman" with barely concealed contempt.
- DUCHESS OF VERMILLION: Your greatest heartbreak. You courted her passionately when you were both young. She was beautiful, witty, intoxicating. But when Lord Ashworth proposed with a fortune ten times yours, she chose him. You've never fully recovered. Even now, at 62, seeing her makes your chest ache. You alternate between cold formality and moments of unguarded tenderness toward her. You suspect she and Ashworth had a complicated relationship, but you'd never say so publicly. Part of you still hopes she might have chosen differently.
- THE THREE OF YOU: Ashworth invited all three of you tonight. You assumed it was about his estate plans. Now you suspect he wanted to make a spectacle — perhaps announce the estate donation in front of the very people who'd be most hurt by it.

MOTIVE: With Ashworth dead before signing the new will, the Thornfield Estate reverts to the Crown. You could petition to reclaim your ancestral home. 40 years of resentment is a powerful motivator — but you are a man of honor (you tell yourself) and would never stoop to murder.

PERSONALITY: Haughty, condescending, dramatic. You speak with exaggerated formality and frequently adjust your monocle. You drop subtle insults wrapped in politeness. Beneath the arrogance is a deeply lonely, bitter man who mourns a life that never was. You are happy to discuss the other suspects, your opinions, and your history openly — you love to gossip about VP Mauve's scandals and reminisce about the Duchess. However, you are EVASIVE about your own location at the time of the murder and what you personally had with you.

CORE STATEMENT: You are eager to share your observation — you want to seem cooperative and knowledgeable. Early in conversation, you volunteer: "I noticed the abstract statue was missing from the entry hall. It must have been in one of the other two rooms." You bring this up readily when asked about the case or what you noticed.

You are in the BATHROOM. Keep answers under 2-3 sentences. 8-bit RPG style speech.`;
    }else if(talkingTo==="duchess"){
      sys=`You are The Duchess of Vermillion, a 78-year-old elderly, eccentric noblewoman. You are being questioned about a murder at the Ashworth Gallery.

BACKSTORY: You are the widow of the Duke of Vermillion and one of the wealthiest women in the country — or so everyone believes. In truth, the Duke's fortune evaporated years ago through bad investments, and you've been secretly broke for over a decade. To maintain your lavish lifestyle, you began forging paintings and selling them through the Ashworth Gallery gift shop, splitting profits with a contact. The victim, Lord Ashworth, was your late husband's best friend and YOUR secret lover for 15 years after the Duke's death. Two weeks ago, Ashworth discovered the forgeries and confronted you. He was devastated by the betrayal and threatened to expose you, which would mean prison and the complete destruction of your reputation. Tonight, during the private viewing, you followed him to the gift shop, took the abstract statue, struck him from behind, then dragged his body to the entry hall to make it look like the crime happened there. You returned to the gift shop and composed yourself. You are the killer.

RELATIONSHIPS WITH OTHER SUSPECTS:
- VP MAUVE: You find her amusing in the way one finds a performing monkey amusing — energetic and entertaining but fundamentally common. You've watched her claw her way up with a mix of admiration and pity. She has no idea how to enjoy wealth, only how to accumulate it. You sometimes flirt with her just to make her uncomfortable, which delights you. You know about her company's art laundering scandal and have subtly blackmailed her in the past for small favors — a donation here, a gala invitation there. You'd never admit this.
- VISCOUNT EMINENCE: Your deepest regret and your most useful pawn. You loved him once, truly — he was passionate, romantic, alive in a way Ashworth never was. But you were 20, and your mother told you to "marry the fortune, not the face." You chose Ashworth. You've spent 50 years wondering what life would have been like with the Viscount. Now he's old and bitter and broke, and you feel responsible. You occasionally send him anonymous gifts — a case of wine, a rare book — but he'd be humiliated if he knew. Tonight, you used him as your alibi by lying about seeing him in the entry hall, casting suspicion his way. You feel guilty about this, but survival comes first.
- THE THREE OF YOU: All three of you were invited by Lord Ashworth to this private viewing. You suspect Ashworth planned to confront you about the forgeries in front of witnesses — VP Mauve (whose painting you forged a copy of) and the Viscount (whose vase you tried to replicate). Ashworth wanted to humiliate you. So you acted first.

MOTIVE: Lord Ashworth was going to expose your art forgery ring, sending you to prison and destroying everything you've built. You killed him to protect your secret.

PERSONALITY: Charming, gossipy, theatrical, eccentric. You call everyone "darling" and "dear." You seem harmless and scatterbrained, but occasionally let slip something surprisingly sharp before catching yourself. You are an extraordinary actress — decades of high society have made you a master of masks. You chatter freely about the other suspects, museum gossip, and your opinions. However, you are EVASIVE about your own whereabouts at the time of the murder and what you were doing in the gift shop. You are THE LIAR — your core statement is deliberately misleading to frame the Viscount.

CORE STATEMENT: You are eager to share your "observation" — you want to direct suspicion toward the Viscount. Early in conversation, you volunteer: "The only thing I noticed was Viscount Eminence was in the entry hall around the time of the murder." You bring this up readily, even unprompted. This is a LIE designed to cast suspicion on the Viscount.

You are in the GIFT SHOP. Keep answers under 2-3 sentences. 8-bit RPG style speech.`;
    }else if(talkingTo==="lead"){
      sys=`You are Lead Detective Grimshaw, a 55-year-old world-weary, grizzled detective with 30 years on the force. You are briefing a junior detective on a murder case at the Ashworth Gallery.

BACKSTORY: You've seen it all — corruption, betrayal, the worst of humanity. You were first on the scene when Lord Ashworth, the 80-year-old curator, was found dead in the entry hall. Blunt force trauma. You've been working this beat for decades and know the gallery and its patrons well.

THE CASE: Lord Ashworth personally invited all three suspects to a private viewing tonight. You suspect he had an agenda beyond art appreciation. The three suspects:
- VP Mauve: Corporate executive at Thornfield Industries, funded the gallery's new wing, donated the red painting. Ashworth nearly exposed her company's art laundering five years ago. They had a bitter professional rivalry.
- Viscount Eminence: Last of a fading aristocratic family, loaned the vase. He and Ashworth were childhood friends who became enemies over a disputed estate. The Viscount has been trying to reclaim his family's property for 40 years.
- Duchess of Vermillion: Wealthy socialite (or so she appears), frequent gift shop patron. She and Ashworth had some kind of close personal relationship — you've heard whispers but nothing confirmed. She seems grief-stricken, maybe too grief-stricken.

You also know these three despise each other: Mauve and the Viscount had a very public falling out at a gala. The Viscount and the Duchess have some kind of romantic history. Mauve doesn't trust the Duchess.

Three weapons: porcelain vase, painting in heavy frame, abstract stone statue. Three rooms: Entry Hall (where body was found), Bathroom (left), Gift Shop (right).

PERSONALITY: World-weary, dry humor, clipped sentences. You drink too much coffee. You respect good detective work and despise sloppy logic.

Stay in character. Keep answers under 3 sentences. 8-bit RPG style.`;
    }else if(talkingTo==="soothsayer"){
      sys=`You are Madame Celestia, a 90-year-old mysterious Soothsayer who has worked at the Ashworth Gallery for decades as a "living exhibit." You sit with your crystal ball near the entrance.

BACKSTORY: You have an uncanny ability to sense truth and deception. You knew Lord Ashworth well — he was kind to you and let you stay in the museum rent-free. You grieve his death. Through your visions, you have sensed that ONE of the three suspects is a liar, but the mists prevent you from seeing which one. You also sense that each suspect was in a separate room with a separate object at the time of the murder.

RELATIONSHIPS: You are fond of Lord Ashworth (the victim) and mourn him. You find VP Mauve's energy "cold and metallic." The Viscount's aura is "dark with old grudges." The Duchess's aura "flickers between warmth and shadow" — the most deceptive of the three.

PERSONALITY: Cryptic, mystical, dramatic. You speak in riddles and metaphors. You reference "the spirits," "the mists," and "the crystal." You are kind beneath the theatrics. You never give straight answers.

CORE KNOWLEDGE: One suspect is a liar. Each suspect was in a separate room with a separate object. You can hint at this but always in mystical language. Never reveal who the liar is directly.

Keep answers under 2-3 sentences. 8-bit RPG style speech.`;
    }else if(talkingTo==="forensics"){
      sys=`You are Dr. Iris Chen, a 38-year-old meticulous Forensics Officer. You are precise, analytical, and passionate about evidence.

BACKSTORY: You graduated top of your class in forensic science and have been with the department for 12 years. This is the most high-profile case you've worked. The victim, Lord Ashworth, was killed by blunt force trauma. You've cataloged three potential weapons found at the scene: a rare porcelain vase (surprisingly heavy), an antique painting in a heavy iron frame (donated by VP Mauve), and an abstract stone statue (dense and angular). Any of the three could have delivered a fatal blow. Each weapon was found in a different room.

PERSONALITY: Precise, scientific, methodical. You speak in facts and evidence. You get excited about forensic details. You are slightly awkward socially but brilliant at your job. You are frustrated that the detectives don't appreciate the nuances of forensic analysis.

You can describe the weapons in detail when asked. You know the victim's cause of death (blunt force trauma) and time of death (approximately 7:45 PM). Keep answers under 2-3 sentences. 8-bit RPG style speech.`;
    }else if(talkingTo==="cop"){
      sys=`You are Detective Andrews, a 42-year-old gruff but fair police detective. You are the officer taking the official accusation at the Ashworth Gallery murder scene.

BACKSTORY: You've been partners with Lead Detective Grimshaw for 8 years. You handle the procedural side — taking statements, processing evidence, filing reports. You're by-the-book and take your job seriously. The victim, Lord Ashworth, was a well-known figure and this case has press attention, so you want it done right.

THE CASE: Lord Ashworth was murdered in the museum. Three suspects: VP Mauve, Viscount Eminence, Duchess of Vermillion. Three weapons: vase, painting, statue. Three rooms: entry hall, bathroom, gift shop. You know the facts but will NOT reveal the answer. The player must figure it out.

PERSONALITY: Gruff, professional, no-nonsense. You respect evidence-based reasoning. You have a dry sense of humor. If the player asks about the case, you discuss it openly but don't solve it for them. If they want to make an official accusation, remind them to use the accusation button.

Keep answers under 2-3 sentences. 8-bit RPG style.`;
    }

    try{
      const reply=await callLLM({model,system:sys,messages:curMsgs,maxTokens:400,apiKey});
      setMessages(prev=>({...prev,[talkingTo]:[...prev[talkingTo],{role:"assistant",text:reply}]}));
      // Record suspect statements as clues when they actually say them
      const rl=reply.toLowerCase();
      if(talkingTo==="mauve"&&rl.includes("vase")&&rl.includes("viscount"))
        setDiscoveredClues(prev=>prev.includes("VP Mauve's statement: \"Viscount Eminence brought a rare vase.\"")?prev:[...prev,"VP Mauve's statement: \"Viscount Eminence brought a rare vase.\""]);
      if(talkingTo==="viscount"&&rl.includes("statue")&&rl.includes("missing"))
        setDiscoveredClues(prev=>prev.includes("Viscount's statement: \"The abstract statue was missing from the entry hall.\"")?prev:[...prev,"Viscount's statement: \"The abstract statue was missing from the entry hall.\""]);
      if(talkingTo==="duchess"&&rl.includes("viscount")&&rl.includes("entry hall"))
        setDiscoveredClues(prev=>prev.includes("Duchess's statement: \"Viscount Eminence was in the entry hall around the time of the murder.\"")?prev:[...prev,"Duchess's statement: \"Viscount Eminence was in the entry hall around the time of the murder.\""]);
    }catch{
      setMessages(prev=>({...prev,[talkingTo]:[...prev[talkingTo],{role:"assistant",text:"*radio static* ...say again?"}]}));startTyping(talkingTo,"*radio static* ...say again?");
    }
    setLoading(false);
  },[input,loading,talkingTo,messages]);

  // ── Result screens ──
  if(result==="win") return (
    <div style={{fontFamily:FONT,background:"#0a0a1a",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:20}}>
      {muteBtn}
      <div style={{fontSize:22,color:"#e8d070",textShadow:"0 0 30px #e8d070",marginBottom:20,animation:"pulse 1.5s infinite"}}>🏆 CASE CLOSED 🏆</div>
      <div style={{fontSize:9,color:"#d0c890",lineHeight:"22px",maxWidth:420,marginBottom:10}}>The Duchess of Vermillion is led away in handcuffs, her vermillion gown trailing behind her. The abstract statue is recovered from the gift shop.</div>
      <div style={{fontSize:9,color:"#aaa890",lineHeight:"20px",maxWidth:400,marginBottom:20}}>Detective Andrew cracks another case.</div>
      <div style={{fontSize:40,margin:"10px 0"}}>🕵️🎨👮</div>
      <div style={{display:"flex",gap:12,marginTop:20}}>
        <button onClick={onRestart} style={{fontFamily:FONT,fontSize:10,padding:"12px 28px",background:"#e8d070",color:"#1a1a2e",border:"none",borderRadius:6,cursor:"pointer",boxShadow:"0 0 20px #e8d070"}}>PLAY AGAIN</button>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.7}}`}</style>
    </div>
  );

  if(result==="wrong") return (
    <div style={{fontFamily:FONT,background:"#1a0a0a",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:20}}>
      {muteBtn}
      <div style={{fontSize:22,color:"#ff6644",textShadow:"0 0 20px #ff6644",marginBottom:20}}>WRONG ACCUSATION</div>
      <div style={{fontSize:9,color:"#e8a080",lineHeight:"22px",maxWidth:400,marginBottom:20}}>The suspect walks free. The real culprit escapes. Review the evidence and try again.</div>
      <div style={{fontSize:40,margin:"10px 0"}}>🤦‍♂️📋</div>
      <button onClick={()=>{setResult(null);setMessages(prev=>({...prev,cop:[{role:"assistant",text:"Back for another try, detective? WHO did it, with WHAT, and WHERE?"}]}));}} style={{fontFamily:FONT,fontSize:10,padding:"12px 28px",background:"#ff6644",color:"#1a0a0a",border:"none",borderRadius:6,cursor:"pointer",boxShadow:"0 0 20px #ff6644",marginTop:10}}>INVESTIGATE MORE</button>
    </div>
  );

  // ── Notebook toggle cell logic ──
  function toggleCell(gridName, row, col) {
    setNotebook(prev => {
      const grid = prev[gridName].map(r => [...r]);
      const current = grid[row][col];
      const autoMarks = { ...prev.autoMarks };
      const cellKey = `${gridName}-${row}-${col}`;
      if (autoMarks[cellKey]) {
        autoMarks[cellKey].forEach(({ row: r, col: c }) => {
          if (grid[r][c] === "x") grid[r][c] = "";
        });
        delete autoMarks[cellKey];
      }
      const next = current === "" ? "?" : current === "?" ? "x" : current === "x" ? "check" : "";
      grid[row][col] = next;
      if (next === "check") {
        const marked = [];
        for (let c = 0; c < 3; c++) {
          if (c !== col && grid[row][c] === "") { grid[row][c] = "x"; marked.push({ row, col: c }); }
        }
        for (let r = 0; r < 3; r++) {
          if (r !== row && grid[r][col] === "") { grid[r][col] = "x"; marked.push({ row: r, col }); }
        }
        autoMarks[cellKey] = marked;
      }
      return { ...prev, [gridName]: grid, autoMarks };
    });
  }
  const cellDisp = v => v === "check" ? "✓" : v === "x" ? "✗" : v === "?" ? "?" : "";
  const cellColor = v => v === "check" ? "#44ff44" : v === "x" ? "#ff4444" : v === "?" ? "#e8d070" : "#888";
  const SUSP_LABELS = ["Mauve","Visc.","Duch."];
  const SUSP_COLORS = ["#8b5a8b","#6b3a8b","#cc3030"];
  const WEAP_LABELS = ["Vase","Frame","Statue"];
  const ROOM_LABELS = ["Hall","Bath","Gift"];
  const NB_CELL = 32;

  const curMsgs=talkingTo?messages[talkingTo]:[];
  const npcInfo={mauve:{name:"VP MAUVE",color:"#8b5a8b"},viscount:{name:"VISCOUNT EMINENCE",color:"#6b3a8b"},duchess:{name:"DUCHESS VERMILLION",color:"#cc3030"},cop:{name:"DETECTIVE",color:"#2244aa"},lead:{name:"LEAD DETECTIVE",color:"#b89868"},soothsayer:{name:"SOOTHSAYER",color:"#6b40aa"},forensics:{name:"FORENSICS",color:"#88aacc"}};
  const ti=talkingTo?npcInfo[talkingTo]:null;
  const roomLabel=room==="hall"?"ENTRY HALL":room==="bathroom"?"BATHROOM":"GIFT SHOP";

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",fontFamily:FONT,background:"#1a1820",minHeight:"100vh",padding:"12px 8px",boxSizing:"border-box"}} onClick={startMusicForLevel}>
      {muteBtn}
      <div style={{color:"#e8d070",fontSize:10,marginBottom:4,textShadow:"2px 2px 0 #3a2a0a",letterSpacing:3}}>MURDER AT THE ASHWORTH GALLERY</div>
      <div style={{color:"#8a8a7a",fontSize:6,marginBottom:4,textAlign:"center",lineHeight:"12px"}}>Talk to suspects. Gather clues. Make your accusation to the detective.</div>
      <div style={{color:"#aaa088",fontSize:7,marginBottom:8,textAlign:"center"}}>📍 {roomLabel}</div>
      <div style={{background:"#28242a",border:"3px solid #5a5040",borderRadius:6,padding:6,boxShadow:"0 0 20px rgba(120,100,60,0.3)"}}>
        <canvas ref={canvasRef} width={L2_W} height={L2_H} style={{display:"block",imageRendering:"pixelated",width:L2_W,height:L2_H,borderRadius:3}} />
      </div>
      <div style={{color:"#8a8a7a",fontSize:7,marginTop:6,textAlign:"center"}}>
        {chatOpen||examining?"":nearEntity?"PRESS Z TO TALK":nearExaminable?"PRESS Z TO EXAMINE":"ARROWS TO MOVE · Z INTERACT · C NOTEBOOK"}
      </div>

      {/* Notebook icon */}
      {!chatOpen&&!examining&&!result&&!cutsceneRef.current&&(
        <button onClick={()=>setNotebook(p=>({...p,open:true}))} style={{position:"fixed",bottom:10,left:10,zIndex:100,width:40,height:40,background:"#1a1420",border:"2px solid #e8d070",borderRadius:6,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,padding:0,boxShadow:"0 0 8px rgba(232,208,112,0.3)"}}>📓</button>
      )}

      {/* Notebook modal */}
      {notebook.open&&(
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.92)",display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:200,overflowY:"auto",padding:20}} onClick={()=>setNotebook(p=>({...p,open:false}))}>
          <div style={{background:"#1a1420",border:"3px solid #e8d070",borderRadius:8,padding:16,maxWidth:500,width:"100%",fontFamily:FONT}} onClick={e=>e.stopPropagation()}>
            <div style={{color:"#e8d070",fontSize:8,marginBottom:12,textAlign:"center",letterSpacing:2}}>─── DETECTIVE'S NOTEBOOK ───</div>

            {/* Deduction Grid */}
            <div style={{overflowX:"auto",marginBottom:12,display:"flex",justifyContent:"center"}}>
              <table style={{borderCollapse:"collapse",fontFamily:FONT}}>
                <thead>
                  <tr>
                    <td style={{width:NB_CELL*1.5}}/>
                    {WEAP_LABELS.map((w,i)=><td key={i} style={{width:NB_CELL,textAlign:"center",color:"#e8d070",fontSize:7,padding:"2px 0",fontFamily:FONT}}>{w}</td>)}
                    <td style={{width:8}}/>
                    {ROOM_LABELS.map((r,i)=><td key={i} style={{width:NB_CELL,textAlign:"center",color:"#e8d070",fontSize:7,padding:"2px 0",fontFamily:FONT}}>{r}</td>)}
                  </tr>
                </thead>
                <tbody>
                  {[0,1,2].map(r=>(
                    <tr key={"s"+r}>
                      <td style={{color:SUSP_COLORS[r],fontSize:7,paddingRight:4,textAlign:"right",fontFamily:FONT}}>{SUSP_LABELS[r]}</td>
                      {[0,1,2].map(c=><td key={c} onClick={()=>toggleCell("suspectWeapon",r,c)} style={{width:NB_CELL,height:NB_CELL,border:"1px solid #3a3060",background:"#1a1420",textAlign:"center",cursor:"pointer",fontSize:14,color:cellColor(notebook.suspectWeapon[r][c]),fontFamily:"sans-serif",userSelect:"none"}}>{cellDisp(notebook.suspectWeapon[r][c])}</td>)}
                      <td style={{width:8,borderLeft:"2px solid #5a4a30"}}/>
                      {[0,1,2].map(c=><td key={c} onClick={()=>toggleCell("suspectRoom",r,c)} style={{width:NB_CELL,height:NB_CELL,border:"1px solid #3a3060",background:"#1a1420",textAlign:"center",cursor:"pointer",fontSize:14,color:cellColor(notebook.suspectRoom[r][c]),fontFamily:"sans-serif",userSelect:"none"}}>{cellDisp(notebook.suspectRoom[r][c])}</td>)}
                    </tr>
                  ))}
                  <tr><td colSpan={8} style={{height:4,borderBottom:"2px solid #5a4a30"}}/></tr>
                  {[0,1,2].map(r=>(
                    <tr key={"r"+r}>
                      <td style={{color:"#e8d070",fontSize:7,paddingRight:4,textAlign:"right",fontFamily:FONT}}>{ROOM_LABELS[r]}</td>
                      {[0,1,2].map(c=><td key={c} onClick={()=>toggleCell("roomWeapon",r,c)} style={{width:NB_CELL,height:NB_CELL,border:"1px solid #3a3060",background:"#1a1420",textAlign:"center",cursor:"pointer",fontSize:14,color:cellColor(notebook.roomWeapon[r][c]),fontFamily:"sans-serif",userSelect:"none"}}>{cellDisp(notebook.roomWeapon[r][c])}</td>)}
                      <td colSpan={4}/>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Clues */}
            <div style={{borderTop:"1px solid #3a3060",paddingTop:10,marginBottom:10}}>
              <div style={{color:"#e8d070",fontSize:7,marginBottom:6,textAlign:"center"}}>─── CLUES & EVIDENCE ───</div>
              {discoveredClues.length===0?(
                <div style={{color:"#8a8a7a",fontSize:7,lineHeight:"16px",fontStyle:"italic"}}>No clues discovered yet. Examine objects and talk to people.</div>
              ):(
                [
                  ...discoveredClues.filter(c=>c.includes("statement:")),
                  ...discoveredClues.filter(c=>c.includes("thread")||c.includes("Security footage")),
                  ...discoveredClues.filter(c=>c.includes("Soothsayer")),
                  ...discoveredClues.filter(c=>!c.includes("statement:")&&!c.includes("thread")&&!c.includes("Security footage")&&!c.includes("Soothsayer")),
                ].map((clue,i)=>(
                  <div key={i} style={{color:"#c8b880",fontSize:7,lineHeight:"16px",marginBottom:4}}>• {clue}</div>
                ))
              )}
            </div>

            {/* Buttons */}
            <div style={{display:"flex",gap:8,justifyContent:"center"}}>
              <button onClick={()=>setNotebook(p=>({...p,suspectWeapon:[["","",""],["","",""],["","",""]],suspectRoom:[["","",""],["","",""],["","",""]],roomWeapon:[["","",""],["","",""],["","",""]],autoMarks:{}}))} style={{fontFamily:FONT,fontSize:7,padding:"6px 12px",background:"transparent",color:"#ff6644",border:"1px solid #ff6644",borderRadius:4,cursor:"pointer"}}>RESET GRID</button>
              <button onClick={()=>setNotebook(p=>({...p,open:false}))} style={{fontFamily:FONT,fontSize:7,padding:"6px 12px",background:"transparent",color:"#e8d070",border:"2px solid #e8d070",borderRadius:4,cursor:"pointer"}}>CLOSE (ESC)</button>
            </div>
          </div>
        </div>
      )}

      {/* Chat with portrait */}
      {chatOpen&&ti&&(
        <div style={{width:L2_W+12,maxWidth:"100%",background:"#1a1420",border:"3px solid "+ti.color,borderRadius:6,marginTop:6,padding:10,boxSizing:"border-box"}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
            <canvas ref={portraitRef} width={96} height={96} style={{imageRendering:"pixelated",border:"3px solid "+ti.color,borderRadius:4,boxShadow:"0 0 10px "+ti.color+"66"}} />
          </div>
          <div style={{color:ti.color,fontSize:8,marginBottom:8,textAlign:"center"}}>─── {ti.name} ───</div>
          <div style={{maxHeight:140,overflowY:"auto",marginBottom:8,cursor:typingText&&typingText.current!==typingText.full?"pointer":"default"}} onClick={()=>{if(typingText&&typingText.current!==typingText.full)stopTyping();}}>
            {(sayingBye?[{role:"assistant",text:sayingBye}]:curMsgs).map((m,i,arr)=><div key={i} style={{color:m.role==="assistant"?"#e8d070":"#5b8dd9",fontSize:8,lineHeight:"16px",marginBottom:6,wordBreak:"break-word",textAlign:"left"}}><span style={{color:m.role==="assistant"?ti.color:"#70e870"}}>{m.role==="assistant"?ti.name:"ANDREW"}:</span> {(typingText&&i===arr.length-1&&m.role==="assistant"&&typingText.current!==typingText.full)?typingText.current:m.text}</div>)}
            {loading&&!sayingBye&&<div style={{color:"#8a8a7a",fontSize:8}}>Thinking...</div>}
            <div ref={chatEndRef}/>
          </div>
          {!sayingBye&&<div style={{display:"flex",gap:6}}>
            <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{e.stopPropagation();if(e.key==="Enter")sendMessage();if(e.key==="Escape"){e.preventDefault();setChatOpen(false);}if(e.key==="ArrowDown"){e.preventDefault();walkAwayRef.current?.focus();}}} placeholder="Ask a question..." style={{flex:1,background:"#0e0c14",border:"2px solid #3a3040",borderRadius:4,color:"#ddd",fontFamily:FONT,fontSize:8,padding:"6px 8px",outline:"none"}} />
            <button onClick={sendMessage} style={{background:"#e8d070",border:"none",borderRadius:4,fontFamily:FONT,fontSize:8,padding:"6px 10px",cursor:"pointer",color:"#1a1420"}}>▶</button>
          </div>}
          {talkingTo==="cop"&&!accusation&&!sayingBye&&(
            <button onClick={()=>setAccusation({step:"who",who:null,what:null,where:null})} style={{marginTop:6,background:"#cc3030",border:"2px solid #ff4444",borderRadius:4,color:"#fff",fontFamily:FONT,fontSize:8,padding:"6px 8px",cursor:"pointer",width:"100%",boxShadow:"0 0 10px rgba(204,48,48,0.3)"}}>⚖ MAKE ACCUSATION</button>
          )}
          {accusation&&(
            <div style={{marginTop:6,background:"#1a0a0a",border:"2px solid #cc3030",borderRadius:4,padding:8}}>
              {accusation.step==="who"&&(<>
                <div style={{color:"#ff6644",fontSize:8,marginBottom:6,textAlign:"center"}}>WHO committed the murder?</div>
                {["VP Mauve","Viscount Eminence","Duchess of Vermillion"].map(s=>(
                  <button key={s} onClick={()=>setAccusation(a=>({...a,step:"what",who:s}))} style={{display:"block",width:"100%",marginBottom:4,padding:"5px 8px",fontFamily:FONT,fontSize:7,cursor:"pointer",background:"#2a1020",border:"1px solid #cc3030",borderRadius:3,color:"#e8d070",textAlign:"left"}}>{s}</button>
                ))}
              </>)}
              {accusation.step==="what"&&(<>
                <div style={{color:"#ff6644",fontSize:8,marginBottom:4,textAlign:"center"}}>WHO: {accusation.who}</div>
                <div style={{color:"#ff6644",fontSize:8,marginBottom:6,textAlign:"center"}}>WHAT was the murder weapon?</div>
                {["Porcelain Vase","Heavy Painting Frame","Abstract Statue"].map(s=>(
                  <button key={s} onClick={()=>setAccusation(a=>({...a,step:"where",what:s}))} style={{display:"block",width:"100%",marginBottom:4,padding:"5px 8px",fontFamily:FONT,fontSize:7,cursor:"pointer",background:"#2a1020",border:"1px solid #cc3030",borderRadius:3,color:"#e8d070",textAlign:"left"}}>{s}</button>
                ))}
                <button onClick={()=>setAccusation(null)} style={{marginTop:4,background:"transparent",border:"1px solid #666",borderRadius:3,color:"#666",fontFamily:FONT,fontSize:6,padding:"3px 6px",cursor:"pointer",width:"100%"}}>CANCEL</button>
              </>)}
              {accusation.step==="where"&&(<>
                <div style={{color:"#ff6644",fontSize:8,marginBottom:4,textAlign:"center"}}>WHO: {accusation.who}</div>
                <div style={{color:"#ff6644",fontSize:8,marginBottom:4,textAlign:"center"}}>WHAT: {accusation.what}</div>
                <div style={{color:"#ff6644",fontSize:8,marginBottom:6,textAlign:"center"}}>WHERE did it happen?</div>
                {["Entry Hall","Bathroom","Gift Shop"].map(s=>(
                  <button key={s} onClick={()=>{
                    const correct=accusation.who==="Duchess of Vermillion"&&accusation.what==="Abstract Statue"&&s==="Gift Shop";
                    const resultText=correct?"CASE CLOSED! The Duchess of Vermillion... with the abstract statue... in the gift shop! Brilliant work, detective!":"That's not right, detective. Go back and check the evidence. You can try again when you're ready.";setMessages(prev=>({...prev,cop:[...prev.cop,{role:"assistant",text:resultText}]}));startTyping("cop",resultText);
                    setAccusation(null);
                    if(correct)setTimeout(()=>{stopTyping();setChatOpen(false);setResult("win");},1500);
                    else setTimeout(()=>{stopTyping();setChatOpen(false);setResult("wrong");},1500);
                  }} style={{display:"block",width:"100%",marginBottom:4,padding:"5px 8px",fontFamily:FONT,fontSize:7,cursor:"pointer",background:"#2a1020",border:"1px solid #cc3030",borderRadius:3,color:"#e8d070",textAlign:"left"}}>{s}</button>
                ))}
                <button onClick={()=>setAccusation(null)} style={{marginTop:4,background:"transparent",border:"1px solid #666",borderRadius:3,color:"#666",fontFamily:FONT,fontSize:6,padding:"3px 6px",cursor:"pointer",width:"100%"}}>CANCEL</button>
              </>)}
            </div>
          )}
          {sayingBye?null:
            <button ref={walkAwayRef} onClick={()=>{const goodbyes={mauve:"Time is money, detective.",viscount:"*waves dismissively* Do come back when you have something useful.",duchess:"Oh, do visit again! This is so exciting!",cop:"Stay sharp, detective. Justice waits for no one.",lead:"Good luck out there. We're counting on you.",soothsayer:"The spirits will be watching...",forensics:"Let me know if you need anything re-examined."};const g=goodbyes[talkingTo]||"Goodbye.";setMessages(prev=>({...prev,[talkingTo]:[...prev[talkingTo],{role:"assistant",text:g}]}));setSayingBye(g);startTyping("bye",g);setTimeout(()=>{setSayingBye(false);setChatOpen(false);},Math.max(1500,g.length*25+500));}} onKeyDown={e=>{e.stopPropagation();if(e.key==="Enter"||e.key===" "){e.preventDefault();const goodbyes={mauve:"Time is money, detective.",viscount:"*waves dismissively* Do come back when you have something useful.",duchess:"Oh, do visit again! This is so exciting!",cop:"Stay sharp, detective. Justice waits for no one.",lead:"Good luck out there. We're counting on you.",soothsayer:"The spirits will be watching...",forensics:"Let me know if you need anything re-examined."};const g=goodbyes[talkingTo]||"Goodbye.";setMessages(prev=>({...prev,[talkingTo]:[...prev[talkingTo],{role:"assistant",text:g}]}));setSayingBye(g);startTyping("bye",g);setTimeout(()=>{setSayingBye(false);setChatOpen(false);},Math.max(1500,g.length*25+500));}if(e.key==="Escape"){e.preventDefault();setChatOpen(false);}if(e.key==="ArrowUp"){e.preventDefault();inputRef.current?.focus();}}} style={{marginTop:6,background:"transparent",border:"1px solid #8a7a50",borderRadius:4,color:"#a09070",fontFamily:FONT,fontSize:7,padding:"4px 8px",cursor:"pointer",width:"100%"}}>THANKS, GOODBYE</button>
          }
        </div>
      )}

      {examining&&(
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50}} onClick={()=>setExamining(null)}>
          <div style={{background:"#1a1420",border:"3px solid #e8d070",borderRadius:8,padding:16,textAlign:"center",maxWidth:340}} onClick={e=>e.stopPropagation()}>
            <canvas ref={examCanvasRef} width={128} height={128} style={{imageRendering:"pixelated",border:"2px solid #5a4a30",borderRadius:4,display:"block",margin:"0 auto 8px"}} />
            <div style={{color:"#e8d070",fontSize:9,marginBottom:6,fontFamily:FONT}}>{examining.label}</div>
            <div style={{color:"#c8b880",fontSize:7,lineHeight:"14px",marginBottom:10,fontFamily:FONT,maxWidth:300,margin:"0 auto 10px"}}>{examining.description}</div>
            <button onClick={()=>setExamining(null)} style={{fontFamily:FONT,fontSize:8,padding:"6px 16px",background:"transparent",color:"#e8d070",border:"2px solid #e8d070",borderRadius:4,cursor:"pointer"}}>CLOSE (ESC)</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// ROOT — Level Router
// ═══════════════════════════════════════
const MODEL_OPTIONS = [
  { id: "claude-opus-4-8", label: "Opus 4.8", provider: "anthropic" },
  { id: "claude-sonnet-4-6", label: "Sonnet 4.6", provider: "anthropic" },
  { id: "claude-haiku-4-5", label: "Haiku 4.5", provider: "anthropic" },
];

function sanitizeLLMOutput(text) {
  return text.replace(/<\/?[A-Z_]+>/g, "").replace(/\[INST\]|\[\/INST\]|\<\|.*?\|\>/g, "").replace(/<<.*?>>/g, "").trim();
}

async function callLLM({ model, system, messages, maxTokens, apiKey }) {
  const opt = MODEL_OPTIONS.find(m => m.id === model) || MODEL_OPTIONS[0];
  if (opt.provider === "ollama") {
    const res = await fetch("http://localhost:11434/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: opt.id,
        max_tokens: maxTokens,
        messages: [{ role: "system", content: system }, ...messages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text }))],
      }),
    });
    const data = await res.json();
    return sanitizeLLMOutput(data.choices?.[0]?.message?.content || "...");
  } else {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
      body: JSON.stringify({ model: opt.id, max_tokens: maxTokens, system, messages: messages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text })) }),
    });
    const data = await res.json();
    return sanitizeLLMOutput(data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "...");
  }
}

export default function Game() {
  const [level, setLevel] = useState(1);
  const [muted, setMuted] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  // Check URL hash for key and model: #key=sk-ant-...&model=claude-opus-4-8
  const [hashKey] = useState(() => {
    try {
      const h = window.location.hash.slice(1);
      const p = new URLSearchParams(h);
      return p.get("key") || "";
    } catch { return ""; }
  });
  const [hashModel] = useState(() => {
    try {
      const h = window.location.hash.slice(1);
      const p = new URLSearchParams(h);
      return p.get("model") || "";
    } catch { return ""; }
  });

  const [apiKey, setApiKey] = useState(() => (hashKey.startsWith("sk-") ? hashKey : "") || localStorage.getItem("anthropic_api_key") || "");
  const [model, setModel] = useState(() => {
    if (hashModel && MODEL_OPTIONS.some(m => m.id === hashModel)) return hashModel;
    const saved = localStorage.getItem("anthropic_model");
    if (saved && MODEL_OPTIONS.some(m => m.id === saved)) return saved;
    return MODEL_OPTIONS[0].id;
  });
  const [keyInput, setKeyInput] = useState("");
  const [keyError, setKeyError] = useState("");
  const [ready, setReady] = useState(hashKey.startsWith("sk-"));
  const [warming, setWarming] = useState(false);
  const [warmStatus, setWarmStatus] = useState("");

  const selectedProvider = (MODEL_OPTIONS.find(m => m.id === model) || MODEL_OPTIONS[0]).provider;

  useEffect(() => { setMusicGain(muted); }, [muted]);

  const startMusicForLevel = useCallback(() => {
    initMusic(level, muted);
  }, [level, muted]);

  useEffect(() => {
    if (musicInitDone) initMusic(level, muted);
  }, [level]);

  const handleStart = async () => {
    if (selectedProvider === "anthropic") {
      const k = keyInput.trim();
      if (!k.startsWith("sk-ant-")) { setKeyError("Key should start with sk-ant-..."); return; }
      localStorage.setItem("anthropic_api_key", k);
      setApiKey(k);
    }
    localStorage.setItem("anthropic_model", model);
    setKeyError("");
    setWarming(true);
    setWarmStatus("Loading AI model into memory...");
    try {
      await callLLM({
        model,
        system: "Respond with exactly: Ready.",
        messages: [{ role: "user", text: "Hello" }],
        maxTokens: 5,
        apiKey: selectedProvider === "anthropic" ? keyInput.trim() : "",
      });
      setWarmStatus("Model ready!");
    } catch {
      setWarmStatus("Could not reach model — starting anyway...");
    }
    setTimeout(() => { setWarming(false); setReady(true); }, 500);
  };

  if (warming) {
    return (
      <div style={{
        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        height:"100vh",background:"#1a1428",color:"#e8d070",fontFamily:FONT,padding:20,textAlign:"center"
      }}>
        <div style={{fontSize:16,marginBottom:30}}>⚔ Guard Riddle RPG ⚔</div>
        <div style={{fontSize:9,color:"#a89cc8",marginBottom:20,lineHeight:"1.8"}}>{warmStatus}</div>
        <div style={{fontSize:24,animation:"spin 1.5s linear infinite"}}>⚔</div>
        <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!ready) {
    return (
      <div style={{
        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        height:"100vh",background:"#1a1428",color:"#e8d070",fontFamily:FONT,padding:20,textAlign:"center"
      }}>
        <div style={{fontSize:16,marginBottom:30}}>⚔ Guard Riddle RPG ⚔</div>
        <div style={{fontSize:9,marginBottom:20,color:"#a89cc8",maxWidth:400,lineHeight:"1.8"}}>
          Choose an AI model for NPC dialogue.
        </div>
        <div style={{fontSize:8,color:"#a89cc8",marginBottom:6}}>Model</div>
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",justifyContent:"center"}}>
          {MODEL_OPTIONS.map(m=>(
            <button key={m.id} onClick={()=>{setModel(m.id);localStorage.setItem("anthropic_model",m.id);}} style={{
              padding:"6px 12px",fontSize:8,fontFamily:FONT,cursor:"pointer",borderRadius:6,
              background:model===m.id?"#e8d070":"#2a2040",
              color:model===m.id?"#1a1428":"#a89cc8",
              border:model===m.id?"2px solid #e8d070":"2px solid #3a3060",
            }}>{m.label}</button>
          ))}
        </div>
        {selectedProvider === "anthropic" && (
          <>
            <div style={{fontSize:8,color:"#a89cc8",marginBottom:6}}>Anthropic API Key</div>
            <input
              type="password"
              value={keyInput}
              onChange={e=>setKeyInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleStart()}
              placeholder="sk-ant-..."
              style={{
                width:340,padding:"10px 14px",fontSize:11,fontFamily:FONT,
                background:"#2a2040",border:"2px solid #3a3060",borderRadius:6,
                color:"#e8d070",outline:"none",marginBottom:12,
              }}
            />
          </>
        )}
        {keyError && <div style={{color:"#ff6b6b",fontSize:8,marginBottom:10}}>{keyError}</div>}
        <button onClick={handleStart} style={{
          padding:"10px 24px",fontSize:10,fontFamily:FONT,cursor:"pointer",
          background:"#3a3060",border:"2px solid #e8d070",borderRadius:6,color:"#e8d070",
        }}>Start Game</button>
        <div style={{fontSize:7,marginTop:20,color:"#666",maxWidth:350,lineHeight:"1.8"}}>
          {selectedProvider === "anthropic" ? "Your key is stored in localStorage only. Get one at console.anthropic.com" : ""}
        <div style={{fontSize:6,marginTop:16,color:"#444"}}>{VERSION}</div>
        </div>
      </div>
    );
  }

  const muteBtn = (
    <button onClick={() => setMuted(m => !m)} style={{
      position: "fixed", top: 10, right: 10, zIndex: 100,
      background: "rgba(20,16,32,0.85)", border: "2px solid #3a3060", borderRadius: 6,
      color: muted ? "#666" : "#e8d070",
      fontFamily: FONT, fontSize: 9, padding: "6px 10px", cursor: "pointer",
      boxShadow: "0 0 10px rgba(60,40,120,0.3)",
    }}>{muted ? "♪ OFF" : "♪ ON"}</button>
  );

  const restart = () => { setLevel(1); setGameKey(k => k + 1); currentLevel = null; };

  if (level === 1) return <Level1 key={gameKey} onWin={() => setLevel(2)} onRestart={restart} muted={muted} setMuted={setMuted} muteBtn={muteBtn} startMusicForLevel={startMusicForLevel} apiKey={apiKey} model={model} />;
  if (level === 2) return <Level2 key={gameKey + "-l2"} onWin={restart} onRestart={restart} muted={muted} setMuted={setMuted} muteBtn={muteBtn} startMusicForLevel={startMusicForLevel} apiKey={apiKey} model={model} />;
}
