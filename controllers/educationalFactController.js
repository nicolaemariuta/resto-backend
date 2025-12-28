import EducationalFact from "../models/EducationalFact.js";

// POST /api/facts
export async function createEducationalFact(req, res) {
  try {
    const fact = await EducationalFact.create(req.body);
    res.status(201).json(fact);
  } catch (err) {
    console.error("Error creating fact:", err);
    res.status(400).json({ error: "Failed to create educational fact" });
  }
}

// GET /api/facts
// For now: return all active facts. Later: filter by user location & settings.
export async function getEducationalFacts(req, res) {
  try {
    const facts = await EducationalFact.find({ isActive: true }).lean();
    res.json(facts);
  } catch (err) {
    console.error("Error fetching facts:", err);
    res.status(500).json({ error: "Failed to fetch educational facts" });
  }
}


function computeMatchScore(fact, prefs) {
  const diffs = [
    Math.abs((fact.sustainability ?? 3) - prefs.sustainability),
    Math.abs((fact.mentalHealth ?? 3) - prefs.mentalHealth),
    Math.abs((fact.fitness ?? 3) - prefs.fitness),
    Math.abs((fact.community ?? 3) - prefs.community)
  ];

  const maxDiffPerAxis = 5;
  const maxTotalDiff = maxDiffPerAxis * diffs.length; // 20
  const totalDiff = diffs.reduce((sum, d) => sum + d, 0);

  const similarity = 1 - totalDiff / maxTotalDiff; // 0..1
  return similarity;
}

// GET /api/facts/recommend?sustainability=4&mentalHealth=5&fitness=2&community=3&count=5
export async function getRecommendedEducationalFacts(req, res) {
  try {
    // Parse preferences from query, default to 3 if missing
    const prefs = {
      sustainability: Number(req.query.sustainability ?? 3),
      mentalHealth: Number(req.query.mentalHealth ?? 3),
      fitness: Number(req.query.fitness ?? 3),
      community: Number(req.query.community ?? 3)
    };

    // How many facts to return. You called it "page", I'll support both "count" and "page" as "how many".
    const countRaw = req.query.count ?? req.query.page ?? 5;
    const count = Math.max(1, Math.min(Number(countRaw) || 5, 20)); // between 1 and 20

    // Fetch all facts (fine for now since you have ~32)
    const facts = await EducationalFact.find({}).lean();

    // Score and sort by match
    const scored = facts.map((fact) => {
      const score = computeMatchScore(fact, prefs);
      const jitter = Math.random() * 0.05; // small randomness for variety
      return {
        ...fact,
        matchScore: score + jitter
      };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);

    const selected = scored.slice(0, count);

    // If you don't want to expose matchScore, strip it out
    const responseFacts = selected.map(({ matchScore, ...rest }) => rest);

    res.json(responseFacts);
  } catch (err) {
    console.error("Error fetching recommended educational facts:", err);
    res.status(500).json({ error: "Failed to fetch recommended educational facts" });
  }
}
