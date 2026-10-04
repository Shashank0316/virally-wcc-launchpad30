# Virally

Virally is a multi agent audience simulation engine for early market validation. A founder or marketer submits a business idea plus a marketing script or creative context. The backend dispatches the same scenario to 18 synthetic audience personas, each with explicit personality traits, habits, interests and trust thresholds. The agents estimate likely actions such as Like, Comment, Share, Save, Skip and Purchase Intent. Current trend layers then adjust receptivity before the results are aggregated into a directional Virality Index, projected reach, engagement, intent and recommendations.

## Why Agentic AI

The primary WCC Launchpad 30 track is **Agentic AI**. The product demonstrates an orchestrated, multi agent workflow where specialized agents reason from the same task through different preference profiles, then an aggregator turns the resulting signals into one decision support output. A human remains responsible for deciding whether to launch, iterate or validate with real users.

## Run locally

Requires Node.js 18+.

```bash
npm start
```

Open `http://localhost:3000`.

The application uses zero third party runtime packages so the demo can run offline. The backend is a Node.js HTTP server and persists simulation history to `data/history.json`.

## API

`GET /api/health` — health check  
`GET /api/agents` — persona definitions  
`GET /api/trends` — current demo trend layers  
`GET /api/history` — recent simulation history  
`POST /api/analyze` — run a new simulation

Example request:

```json
{
  "idea": "A 10 minute AI meal planner for college students",
  "creative": "Show a student opening the fridge, then generate a weekly plan under a fixed budget in seconds.",
  "audience": "College students in India",
  "channel": "short form social"
}
```

## Important demo note

The current version intentionally uses a transparent local simulation model rather than pretending to have real user data. This keeps the hackathon demo deterministic, inspectable and runnable without an API key. The architecture is designed so an LLM provider can be added later for agent reasoning, while the explicit persona scorer and trend layer remain the evaluation backbone.

## Product flow

Landing page → Simulator → Multi agent run → Reaction distribution → Persona inspection → Trend context → Product Research → Methodology.

## Product research evidence

The repository includes a visible Product Research section and a `research/` folder. The research artifact documents the WCC judging requirement around user insight and problem evidence, a secondary research method, an adjacent competitor scan, product decisions derived from the findings, limitations of synthetic audience simulation, and five questions for collecting primary validation. The project deliberately does not fabricate interviews, surveys or customer testimonials.

The landing page includes scroll reveal and parallax motion. The simulator is fully functional and the charts are generated from the backend response.

## Submission support files

`FORM_ANSWERS.txt` contains copy ready responses for the WCC submission form, including Product / Research.

`DEMO_SCRIPT.txt` contains a concise demo flow that explicitly shows the product research evidence.

`JUDGE_QA.md` contains likely questions and honest answers about the agentic architecture, research, limitations and next steps.

`HACKATHON_CHECKLIST.md` is the final submission checklist.
