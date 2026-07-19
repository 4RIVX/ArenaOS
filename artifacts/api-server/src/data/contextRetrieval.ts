/**
 * Structured Context Retrieval (no RAG, no embeddings)
 *
 * Filters stadium mock data based on keywords detected in the user's message
 * and the active ArenaOS feature. Only the relevant subset is injected into the
 * Gemini system prompt — never the full dataset.
 *
 * DEMO NOTE: Each retrieval call logs which subset was selected with
 * [ArenaOS Context Retrieval] so it's easy to explain during demos.
 */
import {
  gates,
  foodCourts,
  transportOptions,
  accessibilityFeatures,
  emergencyPoints,
  sustainabilityPoints,
  stadium,
} from "./stadiumData.js";

export type RetrievedContext = {
  label: string;
  data: string;
};

function hasKeyword(message: string, keywords: string[]): boolean {
  const lower = message.toLowerCase();
  return keywords.some((k) => lower.includes(k.toLowerCase()));
}

function featureIs(feature: string | undefined, ...names: string[]): boolean {
  if (!feature) return false;
  const f = feature.toLowerCase();
  return names.some((n) => f.includes(n.toLowerCase()));
}

export function retrieveContext(userMessage: string, feature: string | undefined): RetrievedContext[] {
  const contexts: RetrievedContext[] = [];

  // ── EMERGENCY ──────────────────────────────────────────────────────────────
  const isEmergency = featureIs(feature, 'emergency');
  const mentionsEmergency = hasKeyword(userMessage, [
    'emergency', 'medical', 'hurt', 'injured', 'fire', 'smoke', 'lost child',
    'suspicious', 'threat', 'danger', 'ambulance', 'help', 'cardiac', 'faint',
    'bleeding', 'attack', 'evacuate', 'evacuation',
  ]);

  if (isEmergency || mentionsEmergency) {
    const label = `Emergency points (all) + gates — feature=${feature ?? 'none'}, emergency keywords=${mentionsEmergency}`;

    contexts.push({
      label,
      data: `EMERGENCY & SAFETY POINTS:\n${emergencyPoints
        .map((e) => `- ${e.name} [${e.type.toUpperCase()}]: ${e.location}${e.staffed ? ' (staffed)' : ''}`)
        .join('\n')}`,
    });
    contexts.push({
      label: 'Gate status for evacuation routing',
      data: `GATE CROWD LEVELS (for safe routing):\n${gates
        .map((g) => `- ${g.name} (${g.position}): crowd=${g.crowdLevel}, open=${g.openStatus}`)
        .join('\n')}`,
    });
  }

  // ── ACCESSIBILITY ───────────────────────────────────────────────────────────
  const isAccessibility = featureIs(feature, 'accessibility');
  const mentionsAccess = hasKeyword(userMessage, [
    'wheelchair', 'accessible', 'accessibility', 'elevator', 'lift',
    'disabled', 'mobility', 'assistance', 'ramp', 'visual', 'hearing',
  ]);

  if (isAccessibility || mentionsAccess) {
    const operational = accessibilityFeatures.filter((a) => a.isOperational);
    const label = `Accessibility features (operational: ${operational.length}/${accessibilityFeatures.length}) — feature=${feature ?? 'none'}`;

    contexts.push({
      label,
      data: `ACCESSIBILITY FEATURES:\n${accessibilityFeatures
        .map((a) => `- ${a.name} [${a.type}]: ${a.location}, operational=${a.isOperational}`)
        .join('\n')}`,
    });
  }

  // ── NAVIGATION ──────────────────────────────────────────────────────────────
  const isNavigation = featureIs(feature, 'navigation');
  const mentionsNav = hasKeyword(userMessage, [
    'gate', 'entrance', 'exit', 'seat', 'section', 'route', 'navigate',
    'go to', 'find', 'where', 'direction', 'concourse', 'way to',
  ]);

  if (isNavigation || mentionsNav) {
    const label = `Gates (all ${gates.length}) + stadium layout — navigation feature=${isNavigation}`;

    contexts.push({
      label,
      data: `STADIUM GATES (current crowd levels):\n${gates
        .map((g) => `- ${g.name} (${g.position}): crowd=${g.crowdLevel}, open=${g.openStatus}`)
        .join('\n')}\n\nSTADIUM: ${stadium.name}, Capacity: ${stadium.capacity.toLocaleString()}\nGate layout: ${stadium.gates.join(', ')}`,
    });
  }

  // ── CROWD INTELLIGENCE ──────────────────────────────────────────────────────
  const isCrowd = featureIs(feature, 'crowd');
  const mentionsCrowd = hasKeyword(userMessage, [
    'crowd', 'busy', 'congestion', 'queue', 'full', 'empty',
    'density', 'packed', 'quiet', 'shortest', 'least crowded',
  ]);

  if (isCrowd || mentionsCrowd) {
    const label = `All gates for crowd analysis — crowd feature=${isCrowd}`;

    contexts.push({
      label,
      data: `CROWD INTELLIGENCE — LIVE GATE STATUS:\n${gates
        .map((g) => `- ${g.name} (${g.position}): crowd=${g.crowdLevel.toUpperCase()}, open=${g.openStatus ? 'YES' : 'NO'}`)
        .join('\n')}\n\nLogic: low=best option, medium=moderate wait, high=avoid, closed=do not use.`,
    });
  }

  // ── TRANSPORTATION ───────────────────────────────────────────────────────────
  const isTransport = featureIs(feature, 'transport');
  const mentionsTransport = hasKeyword(userMessage, [
    'metro', 'bus', 'taxi', 'transport', 'train', 'shuttle',
    'leave', 'travel', 'ride', 'station', 'airport', 'city center',
  ]);

  if (isTransport || mentionsTransport) {
    const label = `Transport options (all ${transportOptions.length}) — transport feature=${isTransport}`;

    contexts.push({
      label,
      data: `TRANSPORT OPTIONS (simulated live data):\n${transportOptions
        .map((t) => `- ${t.name} [${t.type}]: wait=${t.waitTime} min, destination=${t.destination}, status=${t.status.toUpperCase()}`)
        .join('\n')}`,
    });
  }

  // ── SUSTAINABILITY ───────────────────────────────────────────────────────────
  const isSustain = featureIs(feature, 'sustain', 'sustainability');
  const mentionsSustain = hasKeyword(userMessage, [
    'recycle', 'recycling', 'refill', 'water', 'green', 'eco',
    'environment', 'carbon', 'waste', 'compost', 'plastic', 'sustainable',
  ]);

  if (isSustain || mentionsSustain) {
    const operational = sustainabilityPoints.filter((s) => s.isOperational !== false);
    const label = `Sustainability points (active: ${operational.length}/${sustainabilityPoints.length}) — sustain feature=${isSustain}`;

    contexts.push({
      label,
      data: `SUSTAINABILITY INFRASTRUCTURE:\n${sustainabilityPoints
        .map((s) => {
          const extra = (s as { co2SavedKg?: number }).co2SavedKg
            ? `, CO₂ saved: ${(s as { co2SavedKg?: number }).co2SavedKg}kg vs car`
            : '';
          const cats = (s as { categories?: string[] }).categories
            ? ` [accepts: ${(s as { categories?: string[] }).categories!.join(', ')}]`
            : '';
          return `- ${s.name} [${s.type}]: ${s.location}${cats}${extra}`;
        })
        .join('\n')}`,
    });
  }

  // ── FOOD ────────────────────────────────────────────────────────────────────
  const isFood = featureIs(feature, 'food');
  const mentionsFood = hasKeyword(userMessage, [
    'food', 'eat', 'drink', 'hungry', 'restaurant', 'coffee', 'snack',
    'halal', 'vegan', 'vegetarian', 'gluten', 'queue', 'menu',
  ]);

  if (isFood || mentionsFood) {
    // Apply dietary preference filter if keywords present
    const lowerMsg = userMessage.toLowerCase();
    let filtered = foodCourts.filter((f) => f.isOpen);
    if (lowerMsg.includes('halal')) filtered = filtered.filter((f) => f.dietaryTags.includes('Halal'));
    else if (lowerMsg.includes('vegan')) filtered = filtered.filter((f) => f.dietaryTags.some((t) => t.toLowerCase().includes('vegan')));
    else if (lowerMsg.includes('vegetarian') || lowerMsg.includes('veg')) filtered = filtered.filter((f) => f.dietaryTags.some((t) => t.toLowerCase().includes('vegetarian')));
    else if (lowerMsg.includes('gluten')) filtered = filtered.filter((f) => f.dietaryTags.some((t) => t.toLowerCase().includes('gluten')));

    const label = `Food courts (filtered: ${filtered.length} open, dietary filter applied) — food feature=${isFood}`;

    contexts.push({
      label,
      data: `FOOD COURTS (open, sorted by queue time):\n${filtered
        .sort((a, b) => a.queueTime - b.queueTime)
        .map((f) => `- ${f.name} (${f.section}): ${f.cuisineType}, tags=[${f.dietaryTags.join(', ')}], queue=${f.queueTime} min`)
        .join('\n')}`,
    });
  }

  // ── LOST & FOUND ────────────────────────────────────────────────────────────
  const isLost = featureIs(feature, 'lost');
  const mentionsLost = hasKeyword(userMessage, [
    'lost', 'missing', 'found', 'backpack', 'bag', 'phone', 'wallet',
    'passport', 'child', 'item', 'left behind',
  ]);

  if (isLost || mentionsLost) {
    const lostPoint = emergencyPoints.find((e) => e.type === 'lost-child');
    const label = `Lost & Found point + gate layout — lost feature=${isLost}`;

    contexts.push({
      label,
      data: `LOST & FOUND:\n- ${lostPoint?.name}: ${lostPoint?.location} (staffed)\n\nGATE REFERENCE:\n${gates
        .map((g) => `- ${g.name}: ${g.position} side`)
        .join('\n')}`,
    });
  }

  // ── ANNOUNCEMENTS ────────────────────────────────────────────────────────────
  const isAnnounce = featureIs(feature, 'announce', 'announcement');
  if (isAnnounce) {
    const label = `Stadium info + gate status for announcement context`;

    contexts.push({
      label,
      data: `STADIUM: ${stadium.name}, Event: ${stadium.currentEvent}, Capacity: ${stadium.capacity.toLocaleString()}\nGate status: ${gates.map((g) => `${g.name}=${g.crowdLevel}`).join(', ')}`,
    });
  }

  // ── STADIUM INFO / TRANSLATE / FALLBACK ─────────────────────────────────────
  if (contexts.length === 0) {

    contexts.push({
      label: 'Fallback: brief stadium summary',
      data: `STADIUM: ${stadium.name}, Event: ${stadium.currentEvent}, Capacity: ${stadium.capacity.toLocaleString()}\nGates: ${gates.map((g) => `${g.name}=${g.crowdLevel}`).join(', ')}`,
    });
  }

  return contexts;
}
