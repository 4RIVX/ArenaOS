/**
 * Tests for the structured context retrieval module.
 *
 * These are pure-function tests — no DB, no Gemini, no network.
 * Retrieval selects which mock data to inject into the Gemini prompt based on
 * the active feature name and keywords in the user's message.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Silence the console.log calls inside retrieveContext during tests
beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

import { retrieveContext } from '../data/contextRetrieval.js';

// ─── NAVIGATION ──────────────────────────────────────────────────────────────
describe('Navigation feature', () => {
  it('returns gate data when feature is "navigation"', () => {
    const result = retrieveContext('How do I get to my seat?', 'navigation');
    const labels = result.map((r) => r.label);
    expect(labels.some((l) => l.includes('Gates'))).toBe(true);
    expect(result[0].data).toContain('Gate A');
    expect(result[0].data).toContain('Gate B');
  });

  it('returns stadium layout info alongside gate data', () => {
    const result = retrieveContext('Where is section 201?', 'navigation');
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('Lusail International Stadium');
  });

  it('triggers on navigation keywords without feature set', () => {
    const result = retrieveContext('Which direction is the gate?', undefined);
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('Gate');
  });

  it('triggers on "find" keyword', () => {
    const result = retrieveContext('Can you find the nearest exit for me?', undefined);
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('Gate');
  });
});

// ─── CROWD INTELLIGENCE ──────────────────────────────────────────────────────
describe('Crowd Intelligence feature', () => {
  it('returns crowd status data for all gates when feature is "crowd"', () => {
    const result = retrieveContext('What is the crowd situation?', 'crowd');
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('CROWD INTELLIGENCE');
    expect(data).toContain('LOW');
    expect(data).toContain('HIGH');
  });

  it('triggers on "congestion" keyword', () => {
    const result = retrieveContext('Is there congestion near Gate C?', undefined);
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('crowd');
  });

  it('includes recommendation logic text', () => {
    const result = retrieveContext('Which gate is least crowded?', 'crowd');
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('Logic:');
  });
});

// ─── EMERGENCY ───────────────────────────────────────────────────────────────
describe('Emergency feature', () => {
  it('returns emergency points when feature is "emergency"', () => {
    const result = retrieveContext('I need help', 'emergency');
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('EMERGENCY & SAFETY POINTS');
    expect(data).toContain('MEDICAL');
  });

  it('returns gate status alongside emergency points for safe routing', () => {
    const result = retrieveContext('Medical emergency at Section 201', 'emergency');
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('GATE CROWD LEVELS');
  });

  it('triggers on "medical" keyword without feature set', () => {
    const result = retrieveContext('Someone is injured near Gate B', undefined);
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('EMERGENCY');
  });

  it('triggers on "fire" keyword', () => {
    const result = retrieveContext('I smell smoke near the food court', undefined);
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('EMERGENCY');
  });

  it('triggers on "evacuate" keyword', () => {
    const result = retrieveContext('We need to evacuate this section', undefined);
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('EMERGENCY');
  });

  it('includes lost-child reunification point for child emergencies', () => {
    const result = retrieveContext('I cannot find my child near Gate A', undefined);
    const data = result.map((r) => r.data).join('\n');
    // Either emergency or lost & found context should be present
    expect(data.toLowerCase()).toMatch(/emergency|lost.*found/i);
  });
});

// ─── ACCESSIBILITY ───────────────────────────────────────────────────────────
describe('Accessibility feature', () => {
  it('returns all accessibility features when feature is "accessibility"', () => {
    const result = retrieveContext('I need accessible facilities', 'accessibility');
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('ACCESSIBILITY FEATURES');
    expect(data).toContain('elevator');
    expect(data).toContain('wheelchair-route');
  });

  it('includes non-operational status in accessibility data', () => {
    const result = retrieveContext('Is the elevator working?', 'accessibility');
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('operational=false');
  });

  it('triggers on "wheelchair" keyword', () => {
    const result = retrieveContext('I use a wheelchair, how do I get in?', undefined);
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('ACCESSIBILITY');
  });

  it('triggers on "elevator" keyword', () => {
    const result = retrieveContext('Where is the elevator?', undefined);
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('ACCESSIBILITY');
  });
});

// ─── TRANSPORTATION ───────────────────────────────────────────────────────────
describe('Transportation feature', () => {
  it('returns all transport options when feature is "transport"', () => {
    const result = retrieveContext('How do I leave the stadium?', 'transport');
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('TRANSPORT OPTIONS');
    expect(data).toContain('metro');
    expect(data).toContain('bus');
    expect(data).toContain('taxi');
  });

  it('includes status information (delayed / on-time / cancelled)', () => {
    const result = retrieveContext('What are my transport options?', 'transport');
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('DELAYED');
    expect(data).toContain('CANCELLED');
    expect(data).toContain('ON-TIME');
  });

  it('includes wait times in the data', () => {
    const result = retrieveContext('What is the wait time for the metro?', 'transport');
    const data = result.map((r) => r.data).join('\n');
    expect(data).toMatch(/wait=\d+ min/);
  });

  it('triggers on "metro" keyword', () => {
    const result = retrieveContext('Is the metro running?', undefined);
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('TRANSPORT');
  });

  it('triggers on "airport" keyword', () => {
    const result = retrieveContext('I need to get to the airport after the match', undefined);
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('TRANSPORT');
  });
});

// ─── SUSTAINABILITY ───────────────────────────────────────────────────────────
describe('Sustainability feature', () => {
  it('returns sustainability infrastructure when feature is "sustain"', () => {
    const result = retrieveContext('How can I be eco-friendly?', 'sustain');
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('SUSTAINABILITY INFRASTRUCTURE');
    expect(data).toContain('water-refill');
    expect(data).toContain('recycling');
    expect(data).toContain('green-exit');
  });

  it('includes CO₂ savings data for green exits', () => {
    const result = retrieveContext('Green transport options', 'sustain');
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('CO₂ saved');
  });

  it('includes recycling categories', () => {
    const result = retrieveContext('Where do I recycle?', 'sustain');
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('accepts:');
    expect(data).toContain('Plastic');
  });

  it('triggers on "recycling" keyword', () => {
    const result = retrieveContext('Where is the nearest recycling bin?', undefined);
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('SUSTAINABILITY');
  });

  it('triggers on "refill" keyword', () => {
    const result = retrieveContext('Can I refill my water bottle?', undefined);
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('SUSTAINABILITY');
  });
});

// ─── FOOD FINDER ─────────────────────────────────────────────────────────────
describe('Food Finder feature', () => {
  it('returns open food courts when feature is "food"', () => {
    const result = retrieveContext('I want to eat something', 'food');
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('FOOD COURTS');
    // All returned courts should be open (isOpen=true)
    // Spicy Route is closed — should not appear in output
    expect(data).not.toContain('Spicy Route');
  });

  it('filters to halal-only courts when "halal" keyword present', () => {
    const result = retrieveContext('I need halal food', 'food');
    const data = result.map((r) => r.data).join('\n');
    // Green Bowl (vegan/gf only) should not appear after halal filter
    expect(data).not.toContain('Green Bowl');
    // Al-Majlis (halal) should appear
    expect(data).toContain('Al-Majlis');
  });

  it('filters to vegan courts when "vegan" keyword present', () => {
    const result = retrieveContext('I am vegan, what can I eat?', 'food');
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('Green Bowl');
    // Stadium Bites (not vegan) should not appear
    expect(data).not.toContain('Stadium Bites');
  });

  it('sorts by queue time (shortest first)', () => {
    const result = retrieveContext('Which food court has the shortest queue?', 'food');
    const data = result.map((r) => r.data).join('\n');
    // Cafe Express has queue=3min (shortest) — should appear first in output
    const cafeIdx = data.indexOf('Cafe Express');
    const stadiumBitesIdx = data.indexOf('Stadium Bites'); // queue=25min
    expect(cafeIdx).toBeLessThan(stadiumBitesIdx);
  });

  it('triggers on "hungry" keyword', () => {
    const result = retrieveContext('I am hungry', undefined);
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('FOOD COURTS');
  });

  it('triggers on "queue" keyword', () => {
    const result = retrieveContext('Which queue is shortest?', undefined);
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('FOOD COURTS');
  });
});

// ─── LOST & FOUND ─────────────────────────────────────────────────────────────
describe('Lost & Found feature', () => {
  it('returns lost & found point when feature is "lost"', () => {
    const result = retrieveContext('I lost something', 'lost');
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('LOST & FOUND');
    expect(data).toContain('Gate A');
  });

  it('includes gate reference for location context', () => {
    const result = retrieveContext('I lost my bag near the south entrance', 'lost');
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('GATE REFERENCE');
  });

  it('triggers on "lost" keyword', () => {
    const result = retrieveContext('I lost my phone near the food court', undefined);
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('LOST & FOUND');
  });

  it('triggers on "backpack" keyword', () => {
    const result = retrieveContext('My blue backpack is missing', undefined);
    const data = result.map((r) => r.data).join('\n');
    expect(data).toContain('LOST & FOUND');
  });
});

// ─── FALLBACK ─────────────────────────────────────────────────────────────────
describe('Fallback behaviour', () => {
  it('returns a brief stadium summary when no feature or keyword matches', () => {
    const result = retrieveContext('Hello there', undefined);
    expect(result).toHaveLength(1);
    expect(result[0].label).toContain('Fallback');
    expect(result[0].data).toContain('Lusail International Stadium');
  });

  it('never returns an empty context array', () => {
    const result = retrieveContext('', undefined);
    expect(result.length).toBeGreaterThan(0);
  });
});

// ─── MULTI-FEATURE COMBINATIONS ───────────────────────────────────────────────
describe('Multi-keyword combinations', () => {
  it('can return multiple context types for a complex query', () => {
    const result = retrieveContext('I need food near an accessible route', undefined);
    const labels = result.map((r) => r.label).join(' ');
    // Should match both food and accessibility
    expect(labels.toLowerCase()).toContain('food');
    expect(labels.toLowerCase()).toContain('accessibility');
  });

  it('emergency feature also returns gate crowd data', () => {
    const result = retrieveContext('Emergency near Gate C', 'emergency');
    const labels = result.map((r) => r.label);
    const hasEmergency = labels.some((l) => l.toLowerCase().includes('emergency'));
    const hasGates = labels.some((l) => l.toLowerCase().includes('gate'));
    expect(hasEmergency).toBe(true);
    expect(hasGates).toBe(true);
  });
});
