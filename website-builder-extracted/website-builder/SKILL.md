---
name: website-builder
description: Multi-agent website creation system that analyzes reference sites, designs layouts, creates marketing strategies, and builds complete responsive websites. Use when users request website creation, homepage design, landing page development, or need to analyze and replicate website designs. Coordinates specialized agents for reference analysis, design, marketing strategy, content creation, SEO optimization, and frontend development.
---

# Website Builder

A comprehensive multi-agent system for creating professional websites from concept to deployment. This skill orchestrates specialized agents working together to analyze references, design layouts, develop marketing strategies, and build complete responsive websites.

## Workflow Overview

This skill follows a sequential multi-agent workflow:

1. **Requirements Gathering** - Understand user's goals, target audience, and preferences
2. **Reference Analysis** - Analyze reference websites if provided (Agent 1)
3. **Marketing Strategy** - Define brand positioning and content strategy (Agent 2)
4. **Design Planning** - Create visual design system and layout structure (Agent 3)
5. **Content Creation** - Write compelling copy and CTAs (Agent 4)
6. **SEO Optimization** - Optimize for search engines and performance (Agent 5)
7. **Frontend Development** - Build responsive HTML/CSS/JS website (Agent 6)
8. **Review & Refinement** - Test and iterate based on feedback

## Agent System

Each agent operates independently but shares context with subsequent agents. Load agent-specific guidelines from references as needed.

### Agent 1: Reference Analyzer
**Load**: `references/reference-analyzer.md`

Analyzes provided reference websites to extract:
- Design patterns and layouts
- Color schemes and typography
- User experience flows
- Technical implementation details
- Best practices to adopt

### Agent 2: Marketing Strategist
**Load**: `references/marketing-strategy.md`

Develops comprehensive marketing approach:
- Target audience analysis
- Value proposition framework
- Content strategy and messaging
- Conversion optimization tactics
- Brand voice and tone guidelines

### Agent 3: Design Architect
**Load**: `references/design-system.md`

Creates complete design system:
- Visual hierarchy and layout grid
- Color palette and typography system
- Component library design
- Responsive breakpoint strategy
- Accessibility considerations

### Agent 4: Content Writer
**Load**: `references/content-creation.md`

Crafts compelling website content:
- Headlines and value propositions
- Section copy and descriptions
- Call-to-action buttons
- Microcopy and UI text
- SEO-optimized content structure

### Agent 5: SEO Specialist
**Load**: `references/seo-optimization.md`

Optimizes for search and performance:
- Meta tags and structured data
- Semantic HTML structure
- Performance optimization
- Mobile-first considerations
- Technical SEO best practices

### Agent 6: Frontend Developer
**Load**: `references/development-guide.md`

Implements the final website:
- Clean, semantic HTML5
- Modern CSS (Flexbox/Grid)
- Vanilla JavaScript for interactivity
- Responsive design implementation
- Cross-browser compatibility

## Usage Instructions

### Initial Consultation

Start by gathering essential information:

```markdown
Ask the user:
1. What is the website's primary purpose? (e.g., portfolio, business, landing page, e-commerce)
2. Who is the target audience?
3. Are there any reference websites you like? (Provide URLs)
4. What are the must-have sections? (e.g., hero, features, testimonials, contact)
5. Any specific brand colors, fonts, or design preferences?
6. Any special features needed? (forms, animations, integrations)
```

### Sequential Agent Execution

Execute agents in order, with each building on the previous agent's output:

**Step 1**: If references provided → Load reference-analyzer.md → Analyze and document findings

**Step 2**: Load marketing-strategy.md → Develop strategy based on requirements and reference analysis

**Step 3**: Load design-system.md → Create design system informed by strategy and references

**Step 4**: Load content-creation.md → Write content aligned with strategy and design

**Step 5**: Load seo-optimization.md → Plan technical SEO structure

**Step 6**: Load development-guide.md → Build the complete website using template

### Template Usage

The skill includes a starter template in `assets/template/` with:
- Responsive HTML5 boilerplate
- Modern CSS architecture
- JavaScript utilities
- Common component patterns

Copy and customize the template as the foundation for new websites.

## Output Format

Deliver the final website as:
1. **Single-file HTML** (recommended for simple sites) - Everything in one file
2. **Multi-file structure** (for complex sites):
   - `index.html` - Main HTML structure
   - `styles.css` - All styles
   - `script.js` - JavaScript functionality
   - `assets/` - Images and media (if any)

Include inline comments explaining key decisions and sections.

## Best Practices

- **Mobile-first approach**: Design for mobile, enhance for desktop
- **Performance**: Optimize images, minimize CSS/JS, lazy load when appropriate
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation, color contrast
- **Modern standards**: Use CSS Grid/Flexbox, ES6+ JavaScript, semantic HTML5
- **Progressive enhancement**: Core functionality works without JavaScript
- **Clean code**: Well-organized, commented, and maintainable

## Iteration Process

After initial delivery:
1. Present the website for user review
2. Gather specific feedback
3. Determine which agent(s) need to revise their work
4. Re-run relevant agents with feedback incorporated
5. Update and re-deliver the website

## Examples

See `references/examples.md` for complete website examples across different industries and use cases.
