# ONIT — Customer Interest Survey

A production-ready, responsive customer research survey web application built for **ONIT** ([onitservices.in](https://www.onitservices.in/home)). Designed to collect structured customer insights about home service requirements, current booking behaviour, pain points, and interest in ONIT.

---

## 🎨 Brand Identity & Design System

The application strictly adopts ONIT's brand identity:
- **Primary Brand Navy:** `#14143A`
- **Secondary Accent Indigo:** `#6E76E0`
- **Hover & Active States:** `#2E3180` / `#5C64D4`
- **Surface & Light Tints:** `#F8FAFC` (page background), `#F2F3FC` (selection highlight & badges), `#FFFFFF` (card surfaces)
- **Borders & Dividers:** `#E5E7EB` / `border-neutral-200`
- **Typography:** **Montserrat** for brand headings and titles; **Inter** for UI, forms, and body text.
- **Logo:** Exact vector SVG asset from the official website (`/onit-logo.svg`).

---

## 🚀 Tech Stack

- **Framework:** React 18 with TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS with custom ONIT brand configuration
- **Icons:** Lucide React
- **Backend / Database:** Supabase (PostgreSQL with Row Level Security)

---

## 📋 Survey Structure

### Section 01 — About You
- **Q1. What is your name?** (Text input, Required)
- **Q2. What is your age?** (Number input, Optional, Validated for range 13–100)
- **Q3. Where are you located?** (Text input with placeholder: *Enter your city / locality*, Optional)
- **Q4. What is your occupation?** (Text input, Required)

### Section 02 — Home Service Requirements
- **Q5. Do you currently use home services?** (Yes / No / Sometimes, Required)
- **Q6. Which home services do you use or require?** (Plumbing, Electrical, House cleaning, AC service, Appliance repair, Painting, Pest control, Gardening, Carpenter, Laundry, Other with conditional text input, Required)
- **Q7. How frequently do you require home services?** (Weekly, Monthly, Once every 3–6 months, Only when required, Required)

### Section 03 — Current Booking Behaviour
- **Q8. How do you usually find home service providers?** (Google Search, Friends and Family, Local service providers, Social media, Online platforms / apps, Other with conditional text input, Required)
- **Q9. Would you be interested in using an online platform to book trusted home services?** (Yes / Maybe / No, Required)

### Section 04 — Customer Challenges
- **Q10. What is your biggest challenge when booking home services?** (Multi-select: Finding trusted professionals, High service charges, Poor service quality, Lack of availability, Delayed responses, No transparent pricing, Required)

### Section 05 — Service Expectations
- **Q11. Rating Matrix:** How important are the following when choosing a service provider?
  - Verified and trusted professionals
  - Affordable pricing
  - Transparent pricing
  - Quality of service
  - Quick availability
  - On-time service
  - Customer support
  - *Rating scale:* Not Important | Slightly Important | Important | Very Important | Extremely Important
  - *Responsive UX:* Rendered as a structured comparison matrix on desktop and transformed into mobile-friendly stacked criteria cards on handheld screens.

### Section 06 — Platform Adoption
- **Q12. Will you use our platform if all of the above criteria are met?** (Yes / No, Required)
- **Q13. Who can you recommend us to?** (Text input, Required, Placeholder: *Enter the person's name*)

---

## 🔒 Supabase Integration & Security

### 1. Database Schema (`customer_interest_surveys`)
Located in `supabase/migrations/create_customer_interest_surveys.sql`:
```sql
CREATE TABLE IF NOT EXISTS public.customer_interest_surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    age INTEGER,
    location TEXT,
    occupation TEXT NOT NULL,
    currently_uses_services TEXT,
    required_services JSONB DEFAULT '[]'::jsonb,
    other_service TEXT,
    service_frequency TEXT,
    provider_discovery_methods JSONB DEFAULT '[]'::jsonb,
    other_discovery_method TEXT,
    interested_in_online_platform TEXT,
    booking_challenges JSONB DEFAULT '[]'::jsonb,
    service_provider_criteria JSONB DEFAULT '{}'::jsonb,
    would_use_onit TEXT,
    referral_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

### 2. Row Level Security (RLS)
- Anonymous users (`anon`) and authenticated users are permitted to **INSERT** records only (`WITH CHECK (true)`).
- Public `SELECT`, `UPDATE`, and `DELETE` queries are denied, protecting all collected customer research data from scraping or exposure.
- Hidden honeypot field (`_website_url_hp`) catches automated spam bots without hindering human respondents.

### 3. Environment Variables
Configure your Supabase credentials in `.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🛠️ Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run Supabase migration in your Supabase SQL editor
# (File: supabase/migrations/create_customer_interest_surveys.sql)

# 3. Add your Supabase keys to .env
cp .env.example .env

# 4. Start local development server
npm run dev

# 5. Build for production
npm run build
```
