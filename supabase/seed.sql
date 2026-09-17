-- ==============================================================================
-- JODC — Repo of the Week Seed Data
-- ==============================================================================
-- Run this in Supabase SQL Editor after running schema.sql to populate initial repos.

INSERT INTO public.repos (
    id, rank, name, full_name, tagline, description, highlights,
    stars, forks, open_issues, license, version, week, date_range, growth,
    languages, tags, github_url, demo_url, curator_review, curator_author,
    builder, status, is_active_spotlight
) VALUES
(
    'superset',
    1,
    'superset',
    'superset-sh/superset',
    'Agentic IDE orchestrating 100+ coding agents in parallel with bring-your-own-subscription.',
    'Superset is an open-source agentic IDE built to orchestrate and run 100+ autonomous coding agents concurrently across isolated git worktrees. Compatible with Claude Code, Cursor Agent, OpenCode, and Codex models, allowing developers to scale engineering output exponentially with total local control.',
    '["Parallel agent orchestration running 100+ autonomous coding sessions concurrently", "Isolated git worktree sandboxing preventing branch collisions and merge conflicts", "Native bring-your-own-subscription (BYOS) support across Claude, OpenAI, and custom LLMs", "Integrated terminal multiplexing and diff visualizer for multi-agent pull requests"]'::jsonb,
    14117,
    1262,
    682,
    'Apache-2.0',
    'v0.4.2',
    'Week 07',
    'Sept 07 — Sept 14, 2026',
    '+2,140 stars this week',
    '[{"name": "TypeScript", "percent": 87.2, "color": "#3178c6"}, {"name": "HTML", "percent": 9.1, "color": "#e34c26"}, {"name": "Swift", "percent": 2.1, "color": "#f05138"}, {"name": "Shell", "percent": 1.6, "color": "#89e051"}]'::jsonb,
    '["Agentic-AI", "IDE", "Parallel-Agents", "DevTools", "TypeScript"]'::jsonb,
    'https://github.com/superset-sh/superset',
    'https://superset.sh',
    'Superset represents the next paradigm of software engineering: an IDE architected from the ground up for agent swarms rather than single-line autocompletion.',
    'JODC Technical Board',
    '{
        "name": "Superset Core Team",
        "handle": "superset-sh",
        "role": "Agentic Architecture & Core Maintainers",
        "campus": "Superset Community (YC W24)",
        "avatarText": "SS",
        "bio": "Engineering high-concurrency developer environments, parallel agent runtimes, and next-generation workspaces that multiply software engineering velocity.",
        "quote": "The future of programming isn''t writing one line at a time — it''s orchestrating a team of intelligent agents building in parallel.",
        "status": "Orchestrating agentic runtimes",
        "github": "https://github.com/superset-sh",
        "twitter": "https://x.com/superset_sh",
        "linkedin": "https://linkedin.com/company/superset-sh",
        "portfolio": "https://superset.sh",
        "badges": ["Active Spotlight", "Agentic Systems", "Trending #1", "Y Combinator W24"],
        "metrics": {
            "commits": "2,230+",
            "totalStars": "14.1k+",
            "mergedPRs": "380+",
            "activeYears": "2+ years"
        },
        "skills": ["TypeScript", "Swift", "Git Worktrees", "Agent Orchestration", "Rust", "Electron"],
        "otherProjects": [
            {
                "name": "agent-runner",
                "stars": 840,
                "description": "Headless execution harness for local LLM agent swarms.",
                "language": "TypeScript",
                "link": "https://github.com/superset-sh/superset"
            }
        ]
    }'::jsonb,
    'approved',
    true
),
(
    'mem0',
    2,
    'mem0',
    'mem0ai/mem0',
    'The universal memory layer for AI agents, assistants, and personalized LLM applications.',
    'Mem0 is a production-grade memory infrastructure layer for AI agents and LLM applications. It provides persistent, adaptive, graph-augmented context that continuously learns from user interactions, remembering preferences and state across sessions, tools, and model providers.',
    '["Continuous self-improving memory graph that extracts and updates user entities over time", "Drop-in SDK integrations for LangChain, LlamaIndex, OpenAI, and Claude agents", "Hybrid vector + graph retrieval for deterministic sub-millisecond memory recall", "Multi-tenant privacy safeguards and adaptive memory decay policies"]'::jsonb,
    65178,
    7630,
    742,
    'Apache-2.0',
    'v0.3.0',
    'Week 06',
    'Aug 31 — Sept 07, 2026',
    '+3,420 stars this week',
    '[{"name": "Python", "percent": 57.1, "color": "#3572a5"}, {"name": "TypeScript", "percent": 42.4, "color": "#3178c6"}, {"name": "Shell", "percent": 0.5, "color": "#89e051"}]'::jsonb,
    '["AI-Memory", "Agents", "Long-Term-Memory", "Python", "RAG"]'::jsonb,
    'https://github.com/mem0ai/mem0',
    'https://mem0.ai',
    'Mem0 solves the quintessential missing puzzle piece in generative AI: contextual permanence. Agents without persistent memory are just chatbots; Mem0 turns them into lifelong digital partners.',
    'JODC AI SIG',
    '{
        "name": "Taranjeet Singh & Deshraj Yadav",
        "handle": "mem0ai",
        "role": "Founders & AI Infrastructure Architects",
        "campus": "Mem0 Engineering Collective",
        "avatarText": "M0",
        "bio": "Pioneering self-improving long-term memory systems, persistent agent states, and scalable graph embeddings for artificial intelligence.",
        "quote": "Context windows are fleeting; real intelligence requires enduring memory that grows richer with every conversation.",
        "status": "Scaling memory graphs for AI",
        "github": "https://github.com/mem0ai",
        "twitter": "https://x.com/mem0ai",
        "linkedin": "https://linkedin.com/company/mem0",
        "portfolio": "https://mem0.ai",
        "badges": ["Featured Contributor", "AI Architecture", "65k+ Stars Club", "Production OSS"],
        "metrics": {
            "commits": "1,890+",
            "totalStars": "65.1k+",
            "mergedPRs": "640+",
            "activeYears": "3+ years"
        },
        "skills": ["Python", "TypeScript", "Vector Databases", "Knowledge Graphs", "RAG", "FastAPI"],
        "otherProjects": [
            {
                "name": "embedchain",
                "stars": 18500,
                "description": "Open-source RAG framework to personalize LLM responses on any dataset.",
                "language": "Python",
                "link": "https://github.com/mem0ai/embedchain"
            }
        ]
    }'::jsonb,
    'approved',
    false
),
(
    'awesome',
    3,
    'awesome',
    'sindresorhus/awesome',
    'The iconic, community-curated directory of awesome lists for everything in tech.',
    'The open-source phenomenon that defined curation on GitHub. With over 500,000 stars, the Awesome project acts as the definitive index of peer-reviewed software libraries, tools, frameworks, and learning resources across every computer science domain.',
    '["Gold-standard community curation guidelines maintaining strict quality and maintenance bars", "Over 750+ specialized topic directories spanning ML, systems, DevOps, and web development", "Automated CI link validation ensuring zero dead links or abandoned mirrors", "The 2nd most starred repository in GitHub history"]'::jsonb,
    505358,
    36841,
    106,
    'CC0-1.0',
    'v1.0.0',
    'Week 05',
    'Aug 24 — Aug 31, 2026',
    '+1,820 stars this week',
    '[{"name": "Markdown", "percent": 95.0, "color": "#083fa1"}, {"name": "Shell", "percent": 5.0, "color": "#89e051"}]'::jsonb,
    '["Awesome", "Curation", "Community", "Open-Source", "Resources"]'::jsonb,
    'https://github.com/sindresorhus/awesome',
    'https://awesomelists.top',
    'Sindre''s awesome project is more than a list; it is the cultural backbone of open-source discovery that has guided multiple generations of software developers.',
    'JODC Dev Council',
    '{
        "name": "Sindre Sorhus",
        "handle": "sindresorhus",
        "role": "Prolific Open Source Engineer & Maintainer",
        "campus": "Independent OSS Creator",
        "avatarText": "SS",
        "bio": "Full-time open source creator behind over 1,000 packages downloaded billions of times each month across the developer universe.",
        "quote": "High curation standards and community discipline can transform simple markdown files into essential digital infrastructure.",
        "status": "Building software that matters",
        "github": "https://github.com/sindresorhus",
        "twitter": "https://x.com/sindresorhus",
        "linkedin": "https://linkedin.com/in/sindresorhus",
        "portfolio": "https://sindresorhus.com",
        "badges": ["Legendary Maintainer", "500k+ Stars Club", "Open Source Pioneer", "GitHub Hall of Fame"],
        "metrics": {
            "commits": "15,000+",
            "totalStars": "750k+",
            "mergedPRs": "4,200+",
            "activeYears": "12+ years"
        },
        "skills": ["JavaScript", "TypeScript", "Swift", "Node.js", "Open Source Stewardship"],
        "otherProjects": [
            {
                "name": "pure",
                "stars": 12800,
                "description": "Pretty, minimal and fast ZSH prompt for astronauts.",
                "language": "Shell",
                "link": "https://github.com/sindresorhus/pure"
            }
        ]
    }'::jsonb,
    'approved',
    false
),
(
    'skillspector',
    4,
    'SkillSpector',
    'NVIDIA/SkillSpector',
    'Security scanner and static audit engine for AI agent skills and MCP servers.',
    'SkillSpector is a specialized security analysis and threat modeling framework designed by NVIDIA for AI agent skills and Model Context Protocol (MCP) servers. It detects prompt injection payloads, arbitrary code execution, supply-chain backdoors, and data exfiltration vulnerabilities before agent tools are mounted.',
    '["Static AST and dynamic bytecode scanning targeting MCP and agentic tool implementations", "YARA rule definitions specialized in discovering covert prompt injection and evasion techniques", "Supply-chain provenance verification for npm and PyPI tool dependencies", "Direct CLI and CI/CD integration blocking insecure agent skill deployments"]'::jsonb,
    17015,
    1452,
    129,
    'Apache-2.0',
    'v2.11.2',
    'Week 04',
    'Aug 17 — Aug 24, 2026',
    '+1,150 stars this week',
    '[{"name": "Python", "percent": 98.8, "color": "#3572a5"}, {"name": "YARA", "percent": 0.6, "color": "#22ff88"}, {"name": "TypeScript", "percent": 0.4, "color": "#3178c6"}, {"name": "Shell", "percent": 0.2, "color": "#89e051"}]'::jsonb,
    '["Security", "AI-Agents", "MCP", "Vulnerability-Scanner", "Python"]'::jsonb,
    'https://github.com/NVIDIA/SkillSpector',
    'https://docs.nvidia.com/skills/scanning-agent-skills',
    'As autonomous agents gain file system and shell execution permissions, SkillSpector provides the critical defensive moat needed to keep developer environments secure.',
    'JODC Security SIG',
    '{
        "name": "NVIDIA Agent Security Team",
        "handle": "NVIDIA",
        "role": "AI Trust, Safety & Systems Security",
        "campus": "NVIDIA AI Research",
        "avatarText": "NV",
        "bio": "Engineering bulletproof security guarantees, sandboxed runtimes, and vulnerability auditing tools for next-generation agentic artificial intelligence.",
        "quote": "Giving an AI agent execution privileges without static sandboxing is like leaving root passwords in a public repo. Guardrails must be rigorous.",
        "status": "Hardening agent runtimes",
        "github": "https://github.com/NVIDIA",
        "twitter": "https://x.com/nvidia",
        "linkedin": "https://linkedin.com/company/nvidia",
        "portfolio": "https://nvidia.com",
        "badges": ["Featured Spotlight", "Security Vanguard", "Enterprise Open Source", "AI Defense"],
        "metrics": {
            "commits": "3,400+",
            "totalStars": "17.0k+",
            "mergedPRs": "520+",
            "activeYears": "5+ years"
        },
        "skills": ["Python", "YARA", "Agent Security", "MCP Protocols", "AST Analysis", "Linux Sandboxing"],
        "otherProjects": [
            {
                "name": "NeMo-Guardrails",
                "stars": 4100,
                "description": "Open-source toolkit for adding programmable guardrails to LLM-based conversational systems.",
                "language": "Python",
                "link": "https://github.com/NVIDIA/NeMo-Guardrails"
            }
        ]
    }'::jsonb,
    'approved',
    false
),
(
    'omniroute',
    5,
    'OmniRoute',
    'diegosouzapw/OmniRoute',
    'Free MIT AI gateway: one endpoint, 350+ providers, and 15-95% token savings.',
    'OmniRoute is a lightning-fast universal AI gateway and token compression proxy. It unifies 350+ model providers behind a single OpenAI-compatible endpoint with quota-aware automated fallback, real-time token compression (RTK + Caveman), and direct compatibility with Claude Code, Cursor, OpenCode, and Copilot.',
    '["Unified routing across 350+ providers (150+ free tiers) and 1,200+ frontier & open models", "RTK + Caveman token compression reducing prompt payload size by 15% to 95%", "Quota-aware auto-fallback immediately rerouting when upstream rate limits or outages occur", "Zero-overhead native MCP (Model Context Protocol) and Agent-to-Agent (A2A) proxying"]'::jsonb,
    65147,
    9111,
    592,
    'MIT',
    'v3.8.51',
    'Week 03',
    'Aug 10 — Aug 17, 2026',
    '+4,260 stars this week',
    '[{"name": "TypeScript", "percent": 95.1, "color": "#3178c6"}, {"name": "JavaScript", "percent": 4.7, "color": "#f1e05a"}, {"name": "Shell", "percent": 0.2, "color": "#89e051"}]'::jsonb,
    '["AI-Gateway", "LLM-Router", "Token-Saver", "MCP", "TypeScript"]'::jsonb,
    'https://github.com/diegosouzapw/OmniRoute',
    'https://omniroute.online',
    'Diego built the swiss-army knife of modern AI infrastructure. OmniRoute''s token compression and automated provider fallback make cutting-edge coding assistants dramatically more accessible.',
    'JODC Infrastructure SIG',
    '{
        "name": "Diego Souza & 550+ Contributors",
        "handle": "diegosouzapw",
        "role": "Founder & Lead Infrastructure Maintainer",
        "campus": "OmniRoute Open Source Community",
        "avatarText": "DS",
        "bio": "Focused on high-performance API proxies, LLM caching algorithms, token compression heuristics, and democratization of AI infrastructure.",
        "quote": "Developers shouldn''t be locked into brittle vendor endpoints or bankrupt by token bills. One smart router can solve both problems.",
        "status": "Optimizing sub-millisecond AI proxies",
        "github": "https://github.com/diegosouzapw",
        "twitter": "https://x.com/diegosouzapw",
        "linkedin": "https://linkedin.com/in/diegosouzapw",
        "portfolio": "https://omniroute.online",
        "badges": ["Featured Contributor", "Community Leader", "65k+ Stars Club", "High-Performance Proxy"],
        "metrics": {
            "commits": "4,700+",
            "totalStars": "65.1k+",
            "mergedPRs": "780+",
            "activeYears": "3+ years"
        },
        "skills": ["TypeScript", "Node.js", "Reverse Proxies", "Token Compression", "MCP", "Docker"],
        "otherProjects": [
            {
                "name": "omni-cli",
                "stars": 1250,
                "description": "Terminal CLI interface to test, benchmark, and route LLM prompts across providers.",
                "language": "TypeScript",
                "link": "https://github.com/diegosouzapw/OmniRoute"
            }
        ]
    }'::jsonb,
    'approved',
    false
),
(
    'documenso',
    6,
    'documenso',
    'documenso/documenso',
    'The open-source DocuSign alternative for cryptographic, self-hosted document signing.',
    'Documenso is the world''s premier open-source digital document signing infrastructure. Built as an open, transparent, and auditable alternative to DocuSign, Documenso offers cryptographic PAdES digital signatures, customizable team signing flows, self-hosted Docker deployments, and robust API primitives.',
    '["Cryptographically verified PAdES standard digital signatures compatible with global eIDAS laws", "Self-hostable with single-command Docker compose or enterprise cluster scaling", "Developer-friendly REST API & webhooks for embedding e-signature workflows into any web app", "Modern Next.js, Prisma, and PostgreSQL architecture with fine-grained access control"]'::jsonb,
    14998,
    3203,
    237,
    'AGPL-3.0',
    'v2.18.0',
    'Week 02',
    'Aug 03 — Aug 10, 2026',
    '+840 stars this week',
    '[{"name": "TypeScript", "percent": 92.1, "color": "#3178c6"}, {"name": "MDX", "percent": 7.6, "color": "#fcb32c"}, {"name": "Shell", "percent": 0.2, "color": "#89e051"}, {"name": "CSS", "percent": 0.1, "color": "#563d7c"}]'::jsonb,
    '["E-Signature", "DocuSign-Alternative", "NextJS", "Prisma", "PostgreSQL"]'::jsonb,
    'https://github.com/documenso/documenso',
    'https://documenso.com',
    'Documenso is the quintessential example of commercial open-source excellence: taking a proprietary monopoly and replacing it with transparent, cryptographic infrastructure.',
    'JODC Review Council',
    '{
        "name": "Timur Ercan & Lucas Vogel",
        "handle": "documenso",
        "role": "Co-Founders & Core Maintainers",
        "campus": "Documenso Open Source",
        "avatarText": "DC",
        "bio": "Engineering trust and cryptographic verification for modern software agreements, open source governance, and web-scale signing APIs.",
        "quote": "Signing a document is the ultimate act of agreement in human commerce. The tools we use to sign should belong to everyone, not a closed black box.",
        "status": "Advancing digital trust infrastructure",
        "github": "https://github.com/documenso",
        "twitter": "https://x.com/documenso",
        "linkedin": "https://linkedin.com/company/documenso",
        "portfolio": "https://documenso.com",
        "badges": ["Featured Contributor", "Open Source Alternative", "DocuSign Challenger", "Security Audited"],
        "metrics": {
            "commits": "3,800+",
            "totalStars": "15.0k+",
            "mergedPRs": "690+",
            "activeYears": "3+ years"
        },
        "skills": ["TypeScript", "Next.js", "Prisma", "PostgreSQL", "Cryptography", "PDF Standards"],
        "otherProjects": [
            {
                "name": "documenso-sdk",
                "stars": 410,
                "description": "Official TypeScript and Node.js client SDK for Documenso document generation and signing.",
                "language": "TypeScript",
                "link": "https://github.com/documenso/documenso"
            }
        ]
    }'::jsonb,
    'approved',
    false
),
(
    'python-telegram-bot',
    7,
    'python-telegram-bot',
    'python-telegram-bot/python-telegram-bot',
    'The gold-standard asynchronous Python framework for the Telegram Bot API.',
    'python-telegram-bot is the definitive, pure Python asynchronous framework for building robust Telegram bots. Featuring 100% API coverage, native asyncio concurrency, advanced conversation state handlers, and seamless webhook integration, it powers millions of production chat automations worldwide.',
    '["Fully asynchronous architecture powered by Python asyncio for high-throughput concurrency", "Complete 100% adherence and rapid zero-day updates for the official Telegram Bot API", "High-level extensible conversation and command dispatching handler system", "Battle-tested in production over nearly a decade by tens of thousands of organizations"]'::jsonb,
    29461,
    6147,
    42,
    'LGPL-3.0',
    'v22.8',
    'Week 01',
    'July 27 — Aug 03, 2026',
    '+560 stars this week',
    '[{"name": "Python", "percent": 99.9, "color": "#3572a5"}, {"name": "Shell", "percent": 0.1, "color": "#89e051"}]'::jsonb,
    '["Telegram", "Chatbot", "Python", "AsyncIO", "Framework"]'::jsonb,
    'https://github.com/python-telegram-bot/python-telegram-bot',
    'https://python-telegram-bot.org',
    'The Python Telegram Bot library is a foundational masterclass in API design: clean, strictly typed, wonderfully documented, and exceptionally reliable.',
    'JODC Review Council',
    '{
        "name": "Leandro Toledo & PTB Maintainers",
        "handle": "python-telegram-bot",
        "role": "Core Maintainers & Python Guild",
        "campus": "Python Telegram Bot Organization",
        "avatarText": "PT",
        "bio": "Dedicated open-source maintainers providing the foundational asynchronous Python tooling for the global Telegram developer ecosystem.",
        "quote": "We made you a wrapper you can''t refuse. Good libraries disappear beneath your hands so you can focus on building.",
        "status": "Maintaining Python''s premier bot framework",
        "github": "https://github.com/python-telegram-bot",
        "twitter": "https://x.com/PythonTelegram",
        "linkedin": "https://linkedin.com/company/python-telegram-bot",
        "portfolio": "https://python-telegram-bot.org",
        "badges": ["Inaugural Spotlight", "Foundation Project", "Python Specialist", "29k+ Stars Club"],
        "metrics": {
            "commits": "4,600+",
            "totalStars": "29.5k+",
            "mergedPRs": "1,200+",
            "activeYears": "9+ years"
        },
        "skills": ["Python", "AsyncIO", "Telegram API", "WebSockets", "Typing", "HTTP/2"],
        "otherProjects": [
            {
                "name": "ptbcontrib",
                "stars": 320,
                "description": "Community extensions and reusable conversation handlers for python-telegram-bot.",
                "language": "Python",
                "link": "https://github.com/python-telegram-bot/ptbcontrib"
            }
        ]
    }'::jsonb,
    'approved',
    false
)
ON CONFLICT (id) DO UPDATE SET
    rank = EXCLUDED.rank,
    stars = EXCLUDED.stars,
    forks = EXCLUDED.forks,
    open_issues = EXCLUDED.open_issues,
    version = EXCLUDED.version,
    updated_at = NOW();

-- Insert Spotlights History
INSERT INTO public.spotlights (id, repo_id, week, date_range, growth, is_current) VALUES
('week-07', 'superset', 'Week 07', 'Sept 07 — Sept 14, 2026', '+2,140 stars this week', true),
('week-06', 'mem0', 'Week 06', 'Aug 31 — Sept 07, 2026', '+3,420 stars this week', false),
('week-05', 'awesome', 'Week 05', 'Aug 24 — Aug 31, 2026', '+1,820 stars this week', false),
('week-04', 'skillspector', 'Week 04', 'Aug 17 — Aug 24, 2026', '+1,150 stars this week', false),
('week-03', 'omniroute', 'Week 03', 'Aug 10 — Aug 17, 2026', '+4,260 stars this week', false),
('week-02', 'documenso', 'Week 02', 'Aug 03 — Aug 10, 2026', '+840 stars this week', false),
('week-01', 'python-telegram-bot', 'Week 01', 'July 27 — Aug 03, 2026', '+560 stars this week', false)
ON CONFLICT (id) DO NOTHING;
