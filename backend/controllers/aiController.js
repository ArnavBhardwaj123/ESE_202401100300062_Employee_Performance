const axios = require('axios');

const extractJSON = (text) => {
  const match = text.match(/\{[\s\S]*\}/);
  if (match) return JSON.parse(match[0]);
  throw new Error('Could not parse AI response as JSON');
};

exports.getRecommendation = async (req, res, next) => {
  try {
    const { employees } = req.body;

    if (!employees || (Array.isArray(employees) && employees.length === 0)) {
      return res.status(400).json({ message: 'Employee data is required' });
    }

    const employeeList = Array.isArray(employees) ? employees : [employees];

    const prompt = `You are an expert HR Analytics AI. Analyze the following employee data and provide comprehensive recommendations.

Employee Data:
${JSON.stringify(employeeList, null, 2)}

Performance Score Guide:
- 85-100: Excellent performer — strong promotion candidate
- 70-84: Good performer — consider for promotion with minor improvements
- 50-69: Average performer — needs targeted training
- Below 50: Underperformer — requires immediate improvement plan

IMPORTANT: You MUST respond ONLY with a valid JSON object. No markdown, no explanation, no code fences. Just pure JSON.

Required JSON format:
{
  "recommendations": [
    {
      "employeeName": "exact name from data",
      "promotionRecommendation": "Yes or No or Maybe",
      "promotionReason": "2-3 sentence explanation",
      "trainingsuggestions": ["specific suggestion 1", "specific suggestion 2", "specific suggestion 3"],
      "performanceFeedback": "detailed 2-3 sentence feedback on their performance",
      "rank": 1,
      "overallAssessment": "one sentence summary"
    }
  ],
  "summary": "2-3 sentence overall team summary with key insights"
}

Rank employees from best (1) to worst performer. Every employee in the input must appear in recommendations.`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-v4-flash:free',
        messages: [
          {
            role: 'system',
            content: 'You are an HR analytics expert. Always respond with valid JSON only. No markdown, no extra text.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 2000
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:3000',
          'X-Title': 'Employee Performance Analytics'
        }
      }
    );

    const msg = response.data.choices[0].message;
    // DeepSeek reasoning models sometimes put output in reasoning field; prefer content
    const raw = (msg.content || msg.reasoning || '').trim();

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = extractJSON(raw);
    }

    res.json(parsed);
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status || 500).json({
        message: 'AI API error',
        error: err.response.data
      });
    }
    next(err);
  }
};
