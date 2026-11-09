# Chatbot Maker AI by Nisar AI Studio

A production-ready platform that empowers developers, creators, and businesses to build, customize, test, deploy, and manage AI chatbots with custom knowledge bases (RAG), multi-channel embeds, and robust security.

---

## 🌟 Key Features

1. **Chatbot Builder & Persona Customizer**
   - Configure identity, avatars, system prompts, greeting messages, response lengths (concise, balanced, detailed), and temperature controls.
   - Suggested starter prompt chips to guide visitor queries.
   - Custom widget styling (brand primary color, border radii, launcher placement).

2. **Server-Side AI Provider Integration**
   - Zero-key-exposure architecture: all completions run securely on the server via `@google/genai` using Gemini 3.8 Flash (`gemini-3.8-flash`).
   - Adaptive fallback engine handling transient rate limits or quota boundaries.
   - Per-conversation token tracking, response latency measurement, and estimated AI cost calculations.

3. **Knowledge Base & Retrieval-Augmented Generation (RAG)**
   - Upload Markdown (`.md`), Plain Text (`.txt`), or JSON files.
   - Built-in safe URL crawler with Server-Side Request Forgery (SSRF) protection against private subnets (RFC 1918) and cloud metadata services (`169.254.169.254`).
   - Overlapping paragraph chunking (600 chars, 100 overlap) and keyword/semantic matching.
   - Transparent source citations displayed with assistant responses.

4. **Multi-Channel Deployment & Integrations**
   - **Hosted Webpage**: Unique public link (`/share/:id`) with distraction-free UI.
   - **Script Widget**: One-line `<script src="/widget.js" data-bot-id="..."></script>` for floating chat bubbles on external websites.
   - **Responsive Iframe**: Seamless embed tag for web apps, blogs, or internal portals.
   - **REST API Endpoint**: Programmatic `POST /api/chat` with JSON payloads.
   - **Configuration Export**: Download complete portable JSON snapshots of bot settings.

5. **Version History & 1-Click Rollback**
   - Automatic immutable snapshot generation on every configuration change.
   - Visual timeline of past revisions with 1-click restore.

6. **Analytics & Usage Telemetry**
   - Real-time conversation metrics, message volumes, token consumption, and cost calculations.
   - 7-day interaction visualizer and chatbot popularity leaderboard.
   - Downloadable CSV and JSON reports.

7. **50 Reusable Chatbot Templates Library**
   - 50 original pre-engineered templates organized into 10 categories (5 in each):
     - **Business & Customer Support**: Business Customer Support, FAQ Assistant, Order Tracking, Returns & Refunds, Appointment Booking.
     - **E-commerce**: Online Store Shopping, Product Recommendation, Product Information, Cart Recovery, Marketplace Seller Support.
     - **Marketing & Sales**: Lead Generation, Sales Qualification, Digital Marketing, Social Media Content, Campaign Planning.
     - **Education**: Student Learning, Math Tutor, English Learning, Programming Tutor, Quiz & Exam Preparation.
     - **AI & Technology**: General AI, Coding Assistant, Debugging Assistant, Technical Documentation, IT Helpdesk.
     - **Content Creation**: Blog Writing, YouTube Script, YouTube Shorts Story, SEO Content, Product Description.
     - **Professional Services**: Business Consulting, Project Management, HR Information, Customer Onboarding, Real Estate Information.
     - **Productivity**: Personal Productivity, Meeting Notes, Research Assistant, Document Summarization, Email Writing.
     - **Community & Communication**: Community Moderator, Event Information, Travel Planning, Multilingual Translation, Feedback Collection.
     - **Specialized Assistants**: Restaurant Information & Menu, Fitness Education (w/ disclaimer), Financial Education (w/ disclaimer), Legal Information (w/ disclaimer), Small Business Startup.
   - **1-Click Deep Clone**: Instantly forks any template into an independent draft bot assigned to the user.
   - **Reset to Template Defaults**: One-click restore in the Chatbot Editor to roll back custom prompts to template defaults without losing the bot ID.
   - **Template Moderation**: Admin center controls for active/inactive toggles, featured curation, prompt editing, and new global template creation.
   - **Favorites & Bookmarks**: Save preferred templates for rapid access.

8. **Admin Panel & Moderation**
   - User account management with role promotion (`admin` / `user`) and account suspension.
   - Global chatbot template manager: toggle active/inactive status, feature flags, inline prompt editing, and new global template creation.
   - Community abuse report review queue.
   - System audit trail with action logs and diagnostic health checks.

9. **Security & Production Hardening**
   - Production `firestore.rules` enforcing role-based access control (RBAC), document ownership, and template catalog rules.
   - Complete `firebase-blueprint.json` defining schemas for all 13 collections including `chatbotTemplates` and `userFavorites`.
   - Rate limiting on public chat endpoints.
   - Mandatory educational disclaimers embedded in Fitness, Financial, and Legal templates.

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- NPM

### Installation & Development
```bash
# Install dependencies
npm install

# Start the full-stack server on port 3000
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Run Automated Verification Suite
```bash
npx tsx tests/templates.test.ts
```

---

## 🔐 Environment Variables

Configure in `.env`:
```env
# Gemini API Key (Injected automatically in AI Studio)
GEMINI_API_KEY="your_api_key_here"

# App URL for embeds and callbacks
APP_URL="http://localhost:3000"
```

---

## 📂 Project Structure

```
├── firestore.rules          # Production Firestore security rules
├── firebase-blueprint.json  # Comprehensive schema blueprint
├── server.ts                # Express server mounting Vite & API routes
├── server/
│   ├── db.ts                # Persistent database store & seed data
│   ├── ai.ts                # Server-side @google/genai Gemini adapter
│   ├── rag.ts               # SSRF-safe URL crawler & RAG chunking engine
│   └── routes/              # Auth, Chatbots, Knowledge, Chat, Analytics, Admin
├── src/
│   ├── types.ts             # TypeScript interfaces
│   ├── services/api.ts      # Frontend API client
│   ├── context/             # AuthContext & ThemeContext
│   ├── components/          # Navbar, Sidebar, ChatPlayground, Modals
│   └── views/               # Dashboard, Editor, Analytics, Admin, Settings, Hosted
```

---

## 🛡️ Security Verification Checklist

- [x] Gemini API key never exposed in browser bundles or client network requests.
- [x] SSRF crawler blocks `localhost`, `127.0.0.1`, `10.0.0.0/8`, `192.168.0.0/16`, `172.16.0.0/12`, and `169.254.169.254`.
- [x] Rate limiting active on public `/api/chat/public/:id` widget endpoints.
- [x] Administrative capabilities require verified server-side checks.
- [x] Document ownership strictly enforced on bot updates and deletions.
- [x] Automatic rollback snapshots allow safe recovery from accidental modifications.
