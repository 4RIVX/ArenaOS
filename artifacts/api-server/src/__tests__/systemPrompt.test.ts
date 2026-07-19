/**
 * Tests for the role-aware, feature-aware, multilingual system prompt builder.
 * Pure function tests — no DB or network calls.
 */
import { describe, it, expect } from 'vitest';
import { buildSystemPrompt } from '../routes/gemini/systemPrompt.js';

// ─── ROLE-BASED INSTRUCTIONS ──────────────────────────────────────────────────
describe('Role-based instructions', () => {
  it('includes fan role instructions by default (undefined role)', () => {
    const prompt = buildSystemPrompt(undefined, []);
    expect(prompt).toContain('MATCH ATTENDEE');
  });

  it('includes fan role instructions for "fan" role', () => {
    const prompt = buildSystemPrompt('fan', []);
    expect(prompt).toContain('MATCH ATTENDEE');
  });

  it('includes volunteer role instructions', () => {
    const prompt = buildSystemPrompt('volunteer', []);
    expect(prompt).toContain('VOLUNTEER');
    expect(prompt).toContain('crowd levels');
  });

  it('includes staff role instructions', () => {
    const prompt = buildSystemPrompt('staff', []);
    expect(prompt).toContain('STADIUM STAFF MEMBER');
  });

  it('includes organizer role instructions', () => {
    const prompt = buildSystemPrompt('organizer', []);
    expect(prompt).toContain('EVENT ORGANIZER');
    expect(prompt).toContain('command level');
  });

  it('falls back to fan for unknown role', () => {
    const prompt = buildSystemPrompt('alien', []);
    expect(prompt).toContain('MATCH ATTENDEE');
  });

  it('is case-insensitive for role names', () => {
    const prompt = buildSystemPrompt('FAN', []);
    expect(prompt).toContain('MATCH ATTENDEE');
  });
});

// ─── FEATURE-SPECIFIC INSTRUCTIONS ───────────────────────────────────────────
describe('Feature-specific instructions', () => {
  it('adds EMERGENCY ASSISTANT instructions for emergency feature', () => {
    const prompt = buildSystemPrompt('fan', [], 'emergency');
    expect(prompt).toContain('EMERGENCY ASSISTANT');
    expect(prompt).toContain('life-threatening');
    expect(prompt).toContain('999');
  });

  it('adds ACCESSIBILITY ASSISTANT instructions', () => {
    const prompt = buildSystemPrompt('fan', [], 'accessibility');
    expect(prompt).toContain('ACCESSIBILITY ASSISTANT');
    expect(prompt).toContain('barrier-free');
  });

  it('adds FOOD FINDER instructions', () => {
    const prompt = buildSystemPrompt('fan', [], 'food');
    expect(prompt).toContain('FOOD FINDER');
    expect(prompt).toContain('dietary');
  });

  it('adds TRANSPORTATION ADVISOR instructions', () => {
    const prompt = buildSystemPrompt('fan', [], 'transport');
    expect(prompt).toContain('TRANSPORTATION ADVISOR');
    expect(prompt).toContain('wait time');
  });

  it('adds LOST & FOUND instructions with incident report format', () => {
    const prompt = buildSystemPrompt('fan', [], 'lost');
    expect(prompt).toContain('LOST & FOUND');
    expect(prompt).toContain('INCIDENT REPORT');
  });

  it('adds SUSTAINABILITY COACH instructions', () => {
    const prompt = buildSystemPrompt('fan', [], 'sustain');
    expect(prompt).toContain('SUSTAINABILITY COACH');
    expect(prompt).toContain('CO₂');
  });

  it('adds ANNOUNCEMENT GENERATOR instructions', () => {
    const prompt = buildSystemPrompt('organizer', [], 'announce');
    expect(prompt).toContain('ANNOUNCEMENT GENERATOR');
    expect(prompt).toContain('100 words');
  });

  it('adds no feature section when feature is undefined', () => {
    const prompt = buildSystemPrompt('fan', []);
    expect(prompt).not.toContain('FEATURE:');
  });

  it('adds no feature section for navigation (uses general role prompt)', () => {
    const prompt = buildSystemPrompt('fan', [], 'navigation');
    // Navigation uses general role instructions, no separate feature block
    expect(prompt).toContain('MATCH ATTENDEE');
  });
});

// ─── MULTILINGUAL SUPPORT ─────────────────────────────────────────────────────
describe('Multilingual support', () => {
  it('adds no language instruction when selectedLanguage is English', () => {
    const prompt = buildSystemPrompt('fan', [], undefined, 'English');
    expect(prompt).not.toContain('LANGUAGE INSTRUCTION');
  });

  it('adds no language instruction when selectedLanguage is undefined', () => {
    const prompt = buildSystemPrompt('fan', [], undefined, undefined);
    expect(prompt).not.toContain('LANGUAGE INSTRUCTION');
  });

  it('adds Spanish language instruction', () => {
    const prompt = buildSystemPrompt('fan', [], undefined, 'Spanish');
    expect(prompt).toContain('LANGUAGE INSTRUCTION');
    expect(prompt).toContain('Spanish (Español)');
    expect(prompt).toContain('Respond ENTIRELY in');
  });

  it('adds French language instruction', () => {
    const prompt = buildSystemPrompt('fan', [], undefined, 'French');
    expect(prompt).toContain('French (Français)');
  });

  it('adds Arabic language instruction', () => {
    const prompt = buildSystemPrompt('fan', [], undefined, 'Arabic');
    expect(prompt).toContain('Arabic (العربية)');
  });

  it('adds Hindi language instruction', () => {
    const prompt = buildSystemPrompt('fan', [], undefined, 'Hindi');
    expect(prompt).toContain('Hindi (हिन्दी)');
  });

  it('adds Tamil language instruction', () => {
    const prompt = buildSystemPrompt('fan', [], undefined, 'Tamil');
    expect(prompt).toContain('Tamil (தமிழ்)');
  });

  it('handles unknown language by using the raw string', () => {
    const prompt = buildSystemPrompt('fan', [], undefined, 'Klingon');
    expect(prompt).toContain('LANGUAGE INSTRUCTION');
    expect(prompt).toContain('Klingon');
  });
});

// ─── CONTEXT INJECTION ────────────────────────────────────────────────────────
describe('Context block injection', () => {
  it('injects context blocks into the prompt', () => {
    const blocks = [
      'GATE DATA:\n- Gate A: crowd=low',
      'FOOD COURTS:\n- Cafe Express: queue=3min',
    ];
    const prompt = buildSystemPrompt('fan', blocks);
    expect(prompt).toContain('RELEVANT STADIUM DATA');
    expect(prompt).toContain('Gate A: crowd=low');
    expect(prompt).toContain('Cafe Express: queue=3min');
  });

  it('omits the data section when context blocks are empty', () => {
    const prompt = buildSystemPrompt('fan', []);
    expect(prompt).not.toContain('RELEVANT STADIUM DATA');
  });

  it('includes "never invent facts" rule', () => {
    const prompt = buildSystemPrompt('fan', ['some context']);
    expect(prompt).toContain('never invent facts');
  });
});

// ─── CORE RULES ───────────────────────────────────────────────────────────────
describe('Core safety rules', () => {
  it('always includes the ArenaOS identity header', () => {
    const prompt = buildSystemPrompt('fan', []);
    expect(prompt).toContain('ArenaOS');
    expect(prompt).toContain('FIFA World Cup 2026');
  });

  it('always includes the simulation data disclaimer', () => {
    const prompt = buildSystemPrompt('fan', []);
    expect(prompt).toContain('simulated');
  });

  it('always includes the no-emoji rule', () => {
    const prompt = buildSystemPrompt('fan', []);
    expect(prompt).toContain('Do not use emojis');
  });

  it('combines all layers correctly (role + feature + language + context)', () => {
    const prompt = buildSystemPrompt('organizer', ['GATE DATA: Gate C=high'], 'emergency', 'Spanish');
    expect(prompt).toContain('EVENT ORGANIZER');
    expect(prompt).toContain('EMERGENCY ASSISTANT');
    expect(prompt).toContain('Spanish (Español)');
    expect(prompt).toContain('Gate C=high');
  });
});
