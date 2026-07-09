# Project Lumin

Project Lumin is an AI-powered skincare analysis app that helps people understand their skin, get simple personalized guidance, and track progress over time.

## What this app is

Lumin turns a phone-camera skin scan and a short questionnaire into a personalized skin snapshot. The app aims to help users answer two questions:

- What does my skin look like right now?
- What should I do next in a routine that fits my goals?

The core experience is a habit loop:

1. Scan
2. Review a skin snapshot and recommendations
3. Follow a routine
4. Track progress over time
5. Rescan and compare changes

## What it can do

Planned features include:

- A guided onboarding flow with privacy and consent screens
- A short skin profile questionnaire
- A face scan across multiple facial regions
- A skin score and sub-scores for common concerns
- Personalized product and routine recommendations
- A progress diary for tracking changes over time
- Optional premium coaching and routine planning

## How it works

The intended user flow is:

1. Landing page and privacy disclaimer
2. Skin profile questionnaire
3. Scan instructions and photo capture
4. AI analysis of the scan and questionnaire data
5. A dashboard showing a skin snapshot and recommended next steps
6. Product and routine suggestions
7. Optional diary and recurring routine support for returning users

## How we will structure it

This workspace is organized to support the app and its supporting materials:

- app/ - application source code
- notes/ - Dendron vault for project notes, research, and second-brain material
- docs/ - product, business, compliance, and technical documentation
- assets/ - images, screenshots, and visual assets

## Product direction

The most important product principle is to focus first on the experience that creates retention:

- The scan itself is useful, but the real value comes from the coaching loop
- Routine guidance and progress tracking are likely more durable than a static diagnosis screen
- The app should teach users what to do next, not only tell them what is wrong

## Business and growth approach

The initial version should be pragmatic and avoid overbuilding too early.

Recommended direction:

- Use a licensed skin-analysis engine for the MVP instead of building a full computer-vision system from scratch
- Start with a free skin-score experience to validate interest and return usage
- Add premium coaching and diary features only after the product proves repeat engagement
- Explore a practitioner-facing B2B2C channel as a lower-CAC path to revenue
- Use affiliate links for product recommendations rather than relying on a heavy brand-partnership stack at launch

## Important considerations

This product sits at the intersection of beauty, health, and biometric data. That means product design and compliance matter from day one.

Key considerations include:

- Clear consent flows for biometric data collection
- Transparent privacy and retention policies
- Separate opt-in handling for any AI-training or data-improvement use
- Careful wording around accuracy, diagnosis, and medical claims
- Clear labeling for sponsored or partner recommendations

## Roadmap

### Phase 0 - Validate
- Build a thin MVP with onboarding, scan capture, and a free skin snapshot experience
- Measure whether users return for a second scan

### Phase 1 - MVP and early traction
- Add routine coaching and progress tracking
- Start validating premium value and practitioner partnerships

### Phase 2 - Expansion
- Improve compliance architecture and data handling
- Strengthen content-led growth and partner channels

## Summary

Project Lumin is a skincare companion app built around a simple but powerful loop: scan, understand, act, track, and improve. The goal is not just to analyze skin, but to create a habit-forming experience that helps people make better skincare decisions over time.
