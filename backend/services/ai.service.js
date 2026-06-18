const groq = require("../config/ai");
const eventService = require("./event.service");

const EXTRACTION_MODEL = "llama-3.1-8b-instant";
const RESPONSE_MODEL = "llama-3.3-70b-versatile";

function buildExtractionPrompt(userQuery) {
  return [
    {
      role: "system",
      content:
        "You extract event search filters from user queries. " +
        "Return ONLY valid JSON with these keys (all string or null):\n" +
        "- category: one of Hackathon, Seminar, Fest, Workshop, Other, or null\n" +
        "- search: college/university name if mentioned, or null\n" +
        "- keywords: key search terms for event title/description, or null\n" +
        "- dateFrom: ISO date (YYYY-MM-DD) for the start of a date range, or null\n" +
        "- dateTo: ISO date (YYYY-MM-DD) for the end of a date range, or null\n" +
        'If unsure about any field, set it to null.\n' +
        'Respond with JSON only, no other text.',
    },
    { role: "user", content: userQuery },
  ];
}

function buildResponsePrompt(userQuery, events) {
  const eventsJson = events.map((e) => ({
    _id: e._id,
    title: e.title,
    category: e.category,
    eventDate: e.eventDate,
    college: e.collegeId?.name || "Unknown",
    description: e.description?.slice(0, 200),
    externalLink: e.externalLink,
  }));

  return [
    {
      role: "system",
      content:
        "You are a campus event assistant for CollegeConnect. " +
        "Answer the user's question based ONLY on the events provided below. " +
        "Be concise, friendly, and helpful. " +
        "If no events match the query, say so clearly — never invent events. " +
        "When events exist, briefly summarize them and highlight key details " +
        "(dates, colleges, categories).\n\n" +
        "Available events:\n" +
        (eventsJson.length > 0
          ? JSON.stringify(eventsJson, null, 2)
          : "No events found."),
    },
    { role: "user", content: userQuery },
  ];
}

async function extractFilters(userQuery) {
  try {
    const completion = await groq.chat.completions.create({
      messages: buildExtractionPrompt(userQuery),
      model: EXTRACTION_MODEL,
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const filters = JSON.parse(raw);

    return {
      category: filters.category || null,
      search: filters.search || null,
      keywords: filters.keywords || null,
      dateFrom: filters.dateFrom || null,
      dateTo: filters.dateTo || null,
    };
  } catch {
    return {
      category: null,
      search: null,
      keywords: userQuery,
      dateFrom: null,
      dateTo: null,
    };
  }
}

module.exports.processQuery = async (userQuery) => {
  const filters = await extractFilters(userQuery);

  const eventOptions = {
    limit: 10,
    category: filters.category,
    search: filters.search,
    q: filters.keywords,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  };

  if (!filters.keywords && !filters.category && !filters.search) {
    eventOptions.q = userQuery;
  }

  const { events } = await eventService.getAllEvents(eventOptions);

  const completion = await groq.chat.completions.create({
    messages: buildResponsePrompt(userQuery, events),
    model: RESPONSE_MODEL,
    temperature: 0.3,
    max_tokens: 500,
  });

  const answer =
    completion.choices[0]?.message?.content ||
    "Sorry, I could not generate a response.";

  return { answer, events };
};
