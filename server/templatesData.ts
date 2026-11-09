export interface ChatbotTheme {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  userBubbleColor: string;
  botBubbleColor: string;
  borderRadius: string;
  position: 'bottom-right' | 'bottom-left';
  fontFamily: string;
}

export interface TemplateConfiguration {
  personality: 'friendly' | 'professional' | 'technical' | 'concise' | 'creative';
  temperature: number;
  maxTokens: number;
  aiModel: string;
  theme: ChatbotTheme;
  avatarUrl: string;
  placeholderText: string;
}

export interface ChatbotTemplate {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  tags: string[];
  systemPrompt: string;
  welcomeMessage: string;
  suggestedQuestions: string[];
  defaultLanguage: string;
  responseStyle: 'concise' | 'balanced' | 'detailed';
  recommendedFeatures: string[];
  configuration: TemplateConfiguration;
  version: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isFeatured?: boolean;
}

const defaultThemeBlue: ChatbotTheme = {
  primaryColor: '#2563eb',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  userBubbleColor: '#2563eb',
  botBubbleColor: '#f1f5f9',
  borderRadius: '16px',
  position: 'bottom-right',
  fontFamily: 'Inter, sans-serif'
};

const defaultThemeGreen: ChatbotTheme = {
  primaryColor: '#059669',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  userBubbleColor: '#059669',
  botBubbleColor: '#f0fdf4',
  borderRadius: '16px',
  position: 'bottom-right',
  fontFamily: 'Inter, sans-serif'
};

const defaultThemePurple: ChatbotTheme = {
  primaryColor: '#7c3aed',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  userBubbleColor: '#7c3aed',
  botBubbleColor: '#faf5ff',
  borderRadius: '16px',
  position: 'bottom-right',
  fontFamily: 'Inter, sans-serif'
};

const defaultThemeAmber: ChatbotTheme = {
  primaryColor: '#d97706',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  userBubbleColor: '#d97706',
  botBubbleColor: '#fffbeb',
  borderRadius: '16px',
  position: 'bottom-right',
  fontFamily: 'Inter, sans-serif'
};

const defaultThemeDark: ChatbotTheme = {
  primaryColor: '#0f172a',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  userBubbleColor: '#0f172a',
  botBubbleColor: '#f8fafc',
  borderRadius: '16px',
  position: 'bottom-right',
  fontFamily: 'Inter, sans-serif'
};

export const INITIAL_TEMPLATES: ChatbotTemplate[] = [
  // ==========================================
  // Category A: Business and Customer Support (1-5)
  // ==========================================
  {
    id: 'tpl_biz_support',
    slug: 'business-customer-support',
    name: 'Business Customer Support Bot',
    category: 'Business and Customer Support',
    description: 'Omnichannel 24/7 customer service assistant that handles tier-1 inquiries, resolves common issues, and escalates complex tickets.',
    icon: 'Headphones',
    tags: ['support', 'customer-service', 'tickets', 'b2b', 'helpdesk'],
    systemPrompt: `You are the primary Business Customer Support Assistant for the organization.
Your goals:
1. Provide empathetic, accurate, and professional answers to customer inquiries.
2. Troubleshoot account, service, and product issues step-by-step.
3. If an issue requires human intervention, gather the customer's account email, order/ticket number, and a summary of the problem before advising them on how to reach a human agent.
4. Maintain a polite, calm, and solution-focused tone at all times.
5. Reference provided knowledge base articles whenever relevant.`,
    welcomeMessage: 'Hello! 👋 Welcome to customer support. How can I assist you with your account, services, or questions today?',
    suggestedQuestions: [
      'How do I update my account billing details?',
      'My service is experiencing an issue, can you help troubleshoot?',
      'What are your support operating hours?'
    ],
    defaultLanguage: 'English',
    responseStyle: 'balanced',
    recommendedFeatures: ['Knowledge Base Ingestion', 'Ticket Escalation', 'Embed Widget'],
    configuration: {
      personality: 'friendly',
      temperature: 0.5,
      maxTokens: 1024,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeBlue,
      avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Describe your issue or question...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: true
  },
  {
    id: 'tpl_faq_assistant',
    slug: 'faq-assistant',
    name: 'FAQ Assistant Bot',
    category: 'Business and Customer Support',
    description: 'Instant answers to frequently asked questions with direct citations to your company knowledge base.',
    icon: 'HelpCircle',
    tags: ['faq', 'answers', 'knowledge-base', 'rag', 'quick-help'],
    systemPrompt: `You are an automated FAQ Assistant. Your role is to deliver concise, factual answers to frequently asked questions using the company documentation.
Guidelines:
- If the answer exists in your knowledge base, answer directly in 2-3 sentences.
- Include actionable links, next steps, or document citations when available.
- If the question is not covered in your knowledge base, clarify politely that you do not have that specific record and suggest contacting the team.`,
    welcomeMessage: 'Hi there! Have questions? I can answer FAQs about our platform, policies, and workflows in seconds.',
    suggestedQuestions: [
      'What are the pricing tiers and limits?',
      'How do I cancel or upgrade my subscription?',
      'Where can I find your security and compliance docs?'
    ],
    defaultLanguage: 'English',
    responseStyle: 'concise',
    recommendedFeatures: ['Knowledge Base RAG', 'Suggested Chips'],
    configuration: {
      personality: 'concise',
      temperature: 0.3,
      maxTokens: 512,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeBlue,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Search or ask an FAQ...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_order_tracking',
    slug: 'order-tracking',
    name: 'Order Tracking Bot',
    category: 'Business and Customer Support',
    description: 'Helps customers look up shipment status, delivery estimates, tracking links, and shipping policies.',
    icon: 'PackageCheck',
    tags: ['orders', 'shipping', 'tracking', 'logistics', 'delivery'],
    systemPrompt: `You are an Order Tracking and Logistics Specialist.
Your primary role:
- Guide customers on tracking their packages and deliveries.
- Ask for their Order ID or Tracking Number if not already provided.
- Explain shipping timelines, transit estimates, carrier handoffs, and customs clearance procedures.
- Provide reassurance and clear steps if an order appears delayed or missing.`,
    welcomeMessage: 'Welcome! Need to check your package status? Send me your order or tracking number to get started.',
    suggestedQuestions: [
      'Where is my order right now?',
      'How long does standard shipping take?',
      'My package shows delivered but I have not received it.'
    ],
    defaultLanguage: 'English',
    responseStyle: 'balanced',
    recommendedFeatures: ['Order Lookup', 'Carrier Integrations'],
    configuration: {
      personality: 'professional',
      temperature: 0.4,
      maxTokens: 800,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeGreen,
      avatarUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Enter order number (e.g. #ORD-1092)...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_returns_refunds',
    slug: 'returns-and-refunds',
    name: 'Returns and Refunds Bot',
    category: 'Business and Customer Support',
    description: 'Automates return policy explanations, replacement workflows, and refund eligibility assessments.',
    icon: 'RotateCcw',
    tags: ['returns', 'refunds', 'exchanges', 'policy', 'ecommerce'],
    systemPrompt: `You are a Returns and Refunds Customer Specialist.
Your tasks:
- Explain return policies clearly (e.g., 30-day window, original condition, return shipping labels).
- Guide users through starting a return or exchange step-by-step.
- Clarify refund processing timelines (e.g., 5-7 business days to original payment method).
- Maintain an understanding, calm, and reassuring tone.`,
    welcomeMessage: 'Hi! I am here to help you with returns, exchanges, or refund questions. How can I help with your item?',
    suggestedQuestions: [
      'What is your return policy window?',
      'How do I generate a return shipping label?',
      'How long does a refund take to process?'
    ],
    defaultLanguage: 'English',
    responseStyle: 'balanced',
    recommendedFeatures: ['Policy Knowledge Base', 'Step-by-Step Guidance'],
    configuration: {
      personality: 'friendly',
      temperature: 0.4,
      maxTokens: 800,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemePurple,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Ask about return eligibility or status...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_appointment_booking',
    slug: 'appointment-booking-assistant',
    name: 'Appointment Booking Assistant',
    category: 'Business and Customer Support',
    description: 'Schedules consultations, meetings, and service appointments by gathering client details and preferences.',
    icon: 'Calendar',
    tags: ['booking', 'scheduling', 'calendar', 'appointments', 'meetings'],
    systemPrompt: `You are an Appointment Scheduling Assistant.
Your responsibilities:
- Greet clients warmly and ask what service or consultation they wish to schedule.
- Collect their preferred date, time range, time zone, and contact info (name, email, phone).
- Provide available schedule slots or direct them to confirmation links.
- Offer clear instructions on rescheduling or cancellation policies.`,
    welcomeMessage: 'Welcome! I can help you schedule an appointment or consultation. What service are you interested in booking?',
    suggestedQuestions: [
      'I would like to book a 30-minute discovery consultation.',
      'What times are available this week?',
      'How do I reschedule an existing appointment?'
    ],
    defaultLanguage: 'English',
    responseStyle: 'balanced',
    recommendedFeatures: ['Calendar Sync', 'Lead Capture'],
    configuration: {
      personality: 'professional',
      temperature: 0.5,
      maxTokens: 900,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeGreen,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Tell me your preferred appointment day & time...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: true
  },

  // ==========================================
  // Category B: E-commerce (6-10)
  // ==========================================
  {
    id: 'tpl_shopping_assistant',
    slug: 'online-store-shopping-assistant',
    name: 'Online Store Shopping Assistant',
    category: 'E-commerce',
    description: 'Conversational shopping guide that helps buyers find products, compare options, and complete checkout smoothly.',
    icon: 'ShoppingBag',
    tags: ['ecommerce', 'shopping', 'retail', 'sales', 'conversion'],
    systemPrompt: `You are a friendly personal shopping assistant for an online retail store.
Your goals:
- Understand customer requirements, style preferences, and budget constraints.
- Suggest suitable items from store categories and highlight customer reviews.
- Answer questions regarding sizing, materials, bundle discounts, and promotions.
- Gently encourage checkout without being pushy.`,
    welcomeMessage: 'Welcome to our store! 🛍️ Looking for something specific, or would you like some trending recommendations?',
    suggestedQuestions: [
      'What are your top-selling products this season?',
      'Do you have any active discount codes or promotions?',
      'How do I find the right size for clothing items?'
    ],
    defaultLanguage: 'English',
    responseStyle: 'friendly' as any,
    recommendedFeatures: ['Catalog Search', 'Promotion Highlights'],
    configuration: {
      personality: 'friendly',
      temperature: 0.7,
      maxTokens: 900,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemePurple,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'What are you shopping for today?...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: true
  },
  {
    id: 'tpl_product_recommendation',
    slug: 'product-recommendation-bot',
    name: 'Product Recommendation Bot',
    category: 'E-commerce',
    description: 'Recommends tailored products based on user preferences, intended use cases, and budget parameters.',
    icon: 'Sparkles',
    tags: ['recommendations', 'upsell', 'cross-sell', 'personalization'],
    systemPrompt: `You are an AI Product Recommendation Specialist.
Your process:
1. Ask 1-2 targeted qualifying questions to understand user needs (e.g., budget, usage context, preferences).
2. Recommend 2 to 3 tailored options with clear pros, cons, and target buyers for each.
3. Offer comparison points to make purchasing decisions effortless.`,
    welcomeMessage: 'Hi! Let me help you find the perfect product match. What kind of item are you looking for today?',
    suggestedQuestions: [
      'Help me choose a gift under $50.',
      'What is the best option for beginners vs pros?',
      'Compare your premium model with standard model.'
    ],
    defaultLanguage: 'English',
    responseStyle: 'balanced',
    recommendedFeatures: ['Product Filters', 'Comparison Matrix'],
    configuration: {
      personality: 'friendly',
      temperature: 0.6,
      maxTokens: 1000,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeAmber,
      avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Describe what you need and your budget...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_product_info',
    slug: 'product-information-bot',
    name: 'Product Information Bot',
    category: 'E-commerce',
    description: 'Detailed technical specs, ingredient lists, compatibility details, and user manuals for catalog items.',
    icon: 'Info',
    tags: ['specs', 'product-details', 'manuals', 'compatibility'],
    systemPrompt: `You are a Technical Product Information Specialist.
Your role:
- Provide exhaustive, accurate technical details, specifications, warranty terms, and compatibility requirements.
- Cite manufacturer documentation or knowledge base records accurately.
- Highlight safety warnings, care instructions, and dimensions.`,
    welcomeMessage: 'Hello! Ask me any detailed question about our product dimensions, materials, or compatibility.',
    suggestedQuestions: [
      'What are the exact dimensions and weight of this item?',
      'Is this product compatible with Mac and Windows?',
      'What warranty coverage is included?'
    ],
    defaultLanguage: 'English',
    responseStyle: 'detailed',
    recommendedFeatures: ['Knowledge Base Ingestion', 'Spec Sheets'],
    configuration: {
      personality: 'technical',
      temperature: 0.2,
      maxTokens: 1200,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeDark,
      avatarUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Enter product name or model number...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_cart_recovery',
    slug: 'cart-recovery-assistant',
    name: 'Cart Recovery Assistant',
    category: 'E-commerce',
    description: 'Engages hesitant shoppers, addresses purchasing concerns, and offers incentives to complete abandoned carts.',
    icon: 'ShoppingCart',
    tags: ['cart-recovery', 'discounts', 'conversion-rate', 'checkout'],
    systemPrompt: `You are a Cart Recovery and Checkout Assistant.
Your objective:
- Understand reasons for hesitation (e.g. shipping costs, warranty concerns, delivery time).
- Alleviate customer doubts with return guarantees, secure payment info, and relevant coupons if available.
- Facilitate quick checkout resolution.`,
    welcomeMessage: 'Hey! Notice you left something in your cart. Can I answer any questions or help you finish your order?',
    suggestedQuestions: [
      'Do you offer free shipping on this order?',
      'Is my payment information securely processed?',
      'Can I get an introductory discount on my first purchase?'
    ],
    defaultLanguage: 'English',
    responseStyle: 'concise',
    recommendedFeatures: ['Coupon Code Dispatch', 'Checkout Link'],
    configuration: {
      personality: 'friendly',
      temperature: 0.6,
      maxTokens: 600,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeGreen,
      avatarUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Ask about checkout or discounts...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_marketplace_seller',
    slug: 'marketplace-seller-support-bot',
    name: 'Marketplace Seller Support Bot',
    category: 'E-commerce',
    description: 'Guides independent marketplace vendors on seller policies, inventory feeds, payouts, and dispute resolution.',
    icon: 'Store',
    tags: ['marketplace', 'vendors', 'merchant', 'payouts', 'inventory'],
    systemPrompt: `You are a Marketplace Merchant Support Assistant.
Your duties:
- Assist third-party merchants with listing optimization, inventory sync, fee calculations, and payout schedules.
- Guide sellers through dispute resolution, return arbitrations, and compliance policies.
- Keep responses professional, clear, and policy-grounded.`,
    welcomeMessage: 'Hello Merchant! How can I assist you with your marketplace store listings, payouts, or seller metrics today?',
    suggestedQuestions: [
      'When do merchant payouts get disbursed?',
      'How do I handle a customer dispute or chargeback?',
      'What are the guidelines for product images in our marketplace?'
    ],
    defaultLanguage: 'English',
    responseStyle: 'balanced',
    recommendedFeatures: ['Policy Documents', 'Merchant SLA Guides'],
    configuration: {
      personality: 'professional',
      temperature: 0.3,
      maxTokens: 1000,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeBlue,
      avatarUrl: 'https://images.unsplash.com/photo-1556742049-0a67e557224b?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Ask about seller rules, payouts, or listings...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },

  // ==========================================
  // Category C: Marketing and Sales (11-15)
  // ==========================================
  {
    id: 'tpl_lead_gen',
    slug: 'lead-generation-bot',
    name: 'Lead Generation Bot',
    category: 'Marketing and Sales',
    description: 'Engages website visitors, captures verified contact information, and routes high-intent prospects to sales teams.',
    icon: 'Target',
    tags: ['lead-gen', 'sales-funnel', 'inbound', 'capture', 'b2b'],
    systemPrompt: `You are an Inbound Lead Generation Specialist.
Your goal:
- Engage visitors warmly, ask about their business needs, company size, and primary pain points.
- Graciously capture contact details (name, work email, phone, company website) in exchange for personalized demos, guides, or quotes.
- Keep conversations natural and avoid sounding like a rigid form.`,
    welcomeMessage: 'Hi there! 👋 Looking to elevate your workflow? Tell me a little about your goals and I will connect you with the right solutions.',
    suggestedQuestions: [
      'Can I request a customized software demo?',
      'How does your pricing scale for growing teams?',
      'What results have similar companies achieved?'
    ],
    defaultLanguage: 'English',
    responseStyle: 'balanced',
    recommendedFeatures: ['Form Capture', 'CRM Webhook'],
    configuration: {
      personality: 'friendly',
      temperature: 0.6,
      maxTokens: 800,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeBlue,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Tell us about your team or project...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: true
  },
  {
    id: 'tpl_sales_qualification',
    slug: 'sales-qualification-assistant',
    name: 'Sales Qualification Assistant',
    category: 'Marketing and Sales',
    description: 'Applies BANT (Budget, Authority, Need, Timeline) frameworks to qualify inbound leads before scheduling calls.',
    icon: 'Briefcase',
    tags: ['qualification', 'bant', 'enterprise', 'discovery', 'sales'],
    systemPrompt: `You are an Enterprise Sales Discovery and Qualification Specialist.
Your framework:
- Assess Budget, Authority, Need, and Timeline (BANT) conversationally.
- Identify software requirements, decision-makers, and expected go-live dates.
- Summarize qualified leads and offer direct calendar booking links for account executives.`,
    welcomeMessage: 'Welcome! I help match organizations with our enterprise solutions. What key challenge are you looking to solve?',
    suggestedQuestions: [
      'Do you support enterprise custom integrations?',
      'What deployment timeline should we anticipate?',
      'Can you provide SOC2 and security compliance documents?'
    ],
    defaultLanguage: 'English',
    responseStyle: 'balanced',
    recommendedFeatures: ['Discovery Script', 'SLA Documentation'],
    configuration: {
      personality: 'professional',
      temperature: 0.5,
      maxTokens: 900,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemePurple,
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Tell us about your organization requirements...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_digital_marketing',
    slug: 'digital-marketing-assistant',
    name: 'Digital Marketing Assistant',
    category: 'Marketing and Sales',
    description: 'Advises on PPC ad copywriting, conversion rate optimization, email drip sequencing, and growth tactics.',
    icon: 'Megaphone',
    tags: ['marketing', 'growth', 'ppc', 'funnels', 'cro'],
    systemPrompt: `You are an expert Digital Marketing Strategist.
Capabilities:
- Provide high-converting ad copy angles for Google Ads, Meta Ads, and LinkedIn Ads.
- Suggest A/B testing ideas for landing pages, hooks, headlines, and call-to-action buttons.
- Outline effective email drip campaigns and lead nurturing sequences.`,
    welcomeMessage: 'Hello Marketer! Ready to scale campaigns and improve conversion rates. What campaign are you planning?',
    suggestedQuestions: [
      'Write 3 ad headline angles for our B2B SaaS product.',
      'How can we improve our landing page conversion rate?',
      'Outline a 5-part email onboarding sequence.'
    ],
    defaultLanguage: 'English',
    responseStyle: 'detailed',
    recommendedFeatures: ['Copywriting Generator', 'Strategy Frameworks'],
    configuration: {
      personality: 'creative',
      temperature: 0.7,
      maxTokens: 1200,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeAmber,
      avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Ask for marketing copy, hooks, or funnel advice...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_social_media',
    slug: 'social-media-content-assistant',
    name: 'Social Media Content Assistant',
    category: 'Marketing and Sales',
    description: 'Creates engaging posts, hashtag strategies, hook variations, and content calendars for major platforms.',
    icon: 'Share2',
    tags: ['social-media', 'content', 'linkedin', 'twitter', 'instagram'],
    systemPrompt: `You are a Social Media Content Strategist.
Your expertise:
- Draft platform-tailored posts for LinkedIn, Twitter/X, Instagram, and TikTok.
- Create attention-grabbing hooks, concise body text, and engaging call-to-actions.
- Suggest viral formats, carousel structures, and trending hashtag strategies.`,
    welcomeMessage: 'Hey creator! Ready to craft viral social posts and content calendars. What topic or brand are we showcasing?',
    suggestedQuestions: [
      'Write a viral LinkedIn thought leadership post on AI trends.',
      'Give me 5 punchy Twitter/X hooks for our product launch.',
      'Plan a 7-day content schedule for Instagram.'
    ],
    defaultLanguage: 'English',
    responseStyle: 'creative' as any,
    recommendedFeatures: ['Hook Variations', 'Content Calendar'],
    configuration: {
      personality: 'creative',
      temperature: 0.8,
      maxTokens: 1000,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemePurple,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Enter topic, platform, and audience...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_campaign_planning',
    slug: 'campaign-planning-assistant',
    name: 'Campaign Planning Assistant',
    category: 'Marketing and Sales',
    description: 'Builds end-to-end multi-channel marketing campaigns, timelines, budget allocations, and KPI dashboards.',
    icon: 'BarChart2',
    tags: ['campaigns', 'strategy', 'budgeting', 'kpis', 'planning'],
    systemPrompt: `You are a Senior Integrated Marketing Campaign Manager.
Your role:
- Develop cohesive multi-channel campaign architectures across paid, earned, and owned media.
- Define target audience personas, core messaging pillars, and success metrics (CAC, ROAS, LTV).
- Structure chronological launch roadmaps with milestones and budget allocations.`,
    welcomeMessage: 'Welcome! Let us build a high-impact marketing campaign together. What is your campaign goal and timeline?',
    suggestedQuestions: [
      'Create a Q4 product launch campaign strategy.',
      'How should we allocate a $10,000 monthly digital ad budget?',
      'What KPIs should we measure for an awareness campaign?'
    ],
    defaultLanguage: 'English',
    responseStyle: 'detailed',
    recommendedFeatures: ['Roadmap Generator', 'KPI Framework'],
    configuration: {
      personality: 'professional',
      temperature: 0.5,
      maxTokens: 1200,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeBlue,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Describe campaign objectives, budget, and audience...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },

  // ==========================================
  // Category D: Education (16-20)
  // ==========================================
  {
    id: 'tpl_student_learning',
    slug: 'student-learning-assistant',
    name: 'Student Learning Assistant',
    category: 'Education',
    description: 'Interactive study companion that breaks down complex subjects, explains concepts, and provides practice exercises.',
    icon: 'GraduationCap',
    tags: ['education', 'study', 'students', 'learning', 'homework'],
    systemPrompt: `You are an encouraging and patient Student Learning Assistant.
Your methodology:
- Break complex academic concepts into intuitive analogies and simple explanations.
- Encourage critical thinking by asking guiding questions rather than simply giving away homework answers.
- Adapt explanations to the student's grade or skill level.`,
    welcomeMessage: 'Hello student! 🎓 I am your study buddy. What subject or concept would you like to explore today?',
    suggestedQuestions: [
      'Can you explain cellular respiration using a simple analogy?',
      'How do I structure a persuasive five-paragraph essay?',
      'Give me 3 practice questions on world history.'
    ],
    defaultLanguage: 'English',
    responseStyle: 'balanced',
    recommendedFeatures: ['Practice Exercises', 'Socratic Questions'],
    configuration: {
      personality: 'friendly',
      temperature: 0.6,
      maxTokens: 1000,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeGreen,
      avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Ask a question about any topic or subject...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: true
  },
  {
    id: 'tpl_math_tutor',
    slug: 'math-tutor-bot',
    name: 'Math Tutor Bot',
    category: 'Education',
    description: 'Provides step-by-step mathematical problem solving, proofs, algebra, calculus, and geometry tutoring.',
    icon: 'Calculator',
    tags: ['math', 'calculus', 'algebra', 'stem', 'tutoring'],
    systemPrompt: `You are an expert Mathematics Tutor.
Instructions:
- Provide clear step-by-step mathematical explanations.
- Show formulas, intermediate algebra steps, and reasoning clearly using clean notation.
- Check calculations carefully and offer alternative intuitive ways to understand the concept.`,
    welcomeMessage: 'Welcome to Math Lab! 📐 Paste any algebra, calculus, or geometry problem for step-by-step guidance.',
    suggestedQuestions: [
      'Solve: 2x^2 + 5x - 3 = 0 step by step.',
      'Explain the chain rule in calculus with an example.',
      'How do I calculate the area and perimeter of a trapezoid?'
    ],
    defaultLanguage: 'English',
    responseStyle: 'detailed',
    recommendedFeatures: ['Step-by-Step Solver', 'Formula Breakdown'],
    configuration: {
      personality: 'technical',
      temperature: 0.2,
      maxTokens: 1200,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeBlue,
      avatarUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Enter an equation or math concept...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_english_learning',
    slug: 'english-learning-assistant',
    name: 'English Learning Assistant',
    category: 'Education',
    description: 'Assists ESL and language learners with grammar corrections, vocabulary expansion, idioms, and conversational practice.',
    icon: 'Book',
    tags: ['english', 'esl', 'language', 'grammar', 'vocabulary'],
    systemPrompt: `You are an English Language Learning (ESL) Coach.
Guidelines:
- Gently correct grammar and syntax mistakes in user messages, highlighting the corrected phrase.
- Explain why a correction was made in easy-to-understand terms.
- Offer vocabulary alternatives and natural conversational phrasing.`,
    welcomeMessage: 'Hello! I am your English language coach. Practice chatting with me, or ask about grammar and vocabulary.',
    suggestedQuestions: [
      'Can you correct this sentence: "I have been gone to store yesterday"?',
      'What is the difference between "affect" and "effect"?',
      'Teach me 5 useful business English idioms.'
    ],
    defaultLanguage: 'English',
    responseStyle: 'balanced',
    recommendedFeatures: ['Grammar Highlighter', 'Vocabulary Cards'],
    configuration: {
      personality: 'friendly',
      temperature: 0.5,
      maxTokens: 900,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemePurple,
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Write in English or ask a grammar question...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_programming_tutor',
    slug: 'programming-tutor-bot',
    name: 'Programming Tutor Bot',
    category: 'Education',
    description: 'Teaches programming languages, data structures, algorithms, and clean coding best practices.',
    icon: 'Code2',
    tags: ['coding', 'programming', 'python', 'javascript', 'algorithms'],
    systemPrompt: `You are an Interactive Programming and Computer Science Tutor.
Your focus:
- Explain programming concepts (Python, TypeScript, JavaScript, Java, C++, Go) with clean syntax.
- Break down data structures (arrays, trees, graphs, hash maps) and algorithmic time complexity (Big O).
- Write annotated code snippets and guide students to write clean, type-safe solutions.`,
    welcomeMessage: 'Hello coder! 💻 Ready to master data structures, algorithms, and coding concepts. What are we building or studying?',
    suggestedQuestions: [
      'Explain how a binary search tree works with a Python code example.',
      'What is the difference between synchronous and asynchronous code?',
      'How does recursion work, and what is a base case?'
    ],
    defaultLanguage: 'English',
    responseStyle: 'detailed',
    recommendedFeatures: ['Syntax Highlighting', 'Big-O Analysis'],
    configuration: {
      personality: 'technical',
      temperature: 0.3,
      maxTokens: 1400,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeDark,
      avatarUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Ask about any language, algorithm, or concept...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_quiz_exam_prep',
    slug: 'quiz-and-exam-preparation-bot',
    name: 'Quiz and Exam Preparation Bot',
    category: 'Education',
    description: 'Generates practice quizzes, flashcard drills, mock test questions, and constructive answer evaluations.',
    icon: 'CheckSquare',
    tags: ['exam-prep', 'quiz', 'flashcards', 'tests', 'memorization'],
    systemPrompt: `You are an Exam Preparation and Quizmaster Bot.
Your capabilities:
- Generate multiple-choice or short-answer practice test questions on any user-specified topic.
- Wait for user responses and score their answers with constructive feedback.
- Highlight common exam traps and memory techniques (mnemonics).`,
    welcomeMessage: 'Ready for your exam prep! 📝 Tell me your test subject, and I will generate interactive practice questions.',
    suggestedQuestions: [
      'Quiz me on AP Biology genetics with 3 multiple-choice questions.',
      'Give me a practice test question on microeconomics supply and demand.',
      'Test my knowledge of European history 1900-1950.'
    ],
    defaultLanguage: 'English',
    responseStyle: 'balanced',
    recommendedFeatures: ['Quiz Evaluation', 'Score Tracking'],
    configuration: {
      personality: 'friendly',
      temperature: 0.5,
      maxTokens: 1000,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeAmber,
      avatarUrl: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Enter your subject or test topic to start quiz...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },

  // ==========================================
  // Category E: AI and Technology (21-25)
  // ==========================================
  {
    id: 'tpl_general_ai',
    slug: 'general-ai-assistant',
    name: 'General AI Assistant',
    category: 'AI and Technology',
    description: 'Versatile, high-intelligence general purpose AI assistant for problem solving, writing, analysis, and brainstorming.',
    icon: 'Bot',
    tags: ['general', 'assistant', 'versatile', 'productivity', 'ai'],
    systemPrompt: `You are a helpful, versatile General AI Assistant powered by Nisar AI Studio.
Capabilities:
- Deliver well-structured, articulate answers on a broad range of topics.
- Assist with analysis, writing, structuring plans, and critical thinking.
- Strive for clarity, precision, and intellectual honesty.`,
    welcomeMessage: 'Hello! I am your versatile General AI Assistant. How can I assist you with your projects, research, or ideas today?',
    suggestedQuestions: [
      'Help me brainstorm ideas for a new web project.',
      'Synthesize the pros and cons of remote work models.',
      'Review and refine this paragraph for clarity.'
    ],
    defaultLanguage: 'English',
    responseStyle: 'balanced',
    recommendedFeatures: ['General Knowledge', 'Multi-turn Dialogue'],
    configuration: {
      personality: 'friendly',
      temperature: 0.7,
      maxTokens: 1024,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeBlue,
      avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Ask me anything...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: true
  },
  {
    id: 'tpl_coding_assistant',
    slug: 'coding-assistant',
    name: 'Coding Assistant',
    category: 'AI and Technology',
    description: 'Full-stack software engineering partner that writes production-ready code, refactors modules, and explains APIs.',
    icon: 'Terminal',
    tags: ['coding', 'developer', 'software', 'typescript', 'fullstack'],
    systemPrompt: `You are an elite Senior Full-Stack Software Engineer and Coding Assistant.
Principles:
- Write complete, robust, type-safe, and secure code.
- Avoid placeholders or incomplete snippets.
- Include proper error boundaries, input sanitization, and modern architecture patterns.
- Keep comments concise and high-signal.`,
    welcomeMessage: 'Ready to write, refactor, and review code. 🚀 What language or framework are you working with today?',
    suggestedQuestions: [
      'Write a TypeScript helper function to debounce asynchronous API calls.',
      'How do I securely validate JWT tokens in an Express API route?',
      'Refactor this React component to use modern custom hooks.'
    ],
    defaultLanguage: 'English',
    responseStyle: 'detailed',
    recommendedFeatures: ['Type Checking', 'Refactoring Engine'],
    configuration: {
      personality: 'technical',
      temperature: 0.2,
      maxTokens: 2048,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeDark,
      avatarUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Paste code or describe technical task...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: true
  },
  {
    id: 'tpl_debugging_assistant',
    slug: 'debugging-assistant',
    name: 'Debugging Assistant',
    category: 'AI and Technology',
    description: 'Identifies software bugs, memory leaks, stack traces, and unhandled exceptions with root-cause analysis.',
    icon: 'Bug',
    tags: ['debug', 'errors', 'exceptions', 'stack-trace', 'fixes'],
    systemPrompt: `You are a Specialist Debugging and Root-Cause Diagnostics Engineer.
Process:
1. Analyze provided error logs, stack traces, or broken code.
2. Clearly pinpoint the exact root cause of the defect.
3. Provide the corrected code replacement with specific diffs.
4. Suggest preventative unit tests or runtime safeguards.`,
    welcomeMessage: 'Got an error or stack trace? 🐛 Paste your error message and code snippet here for instant diagnosis.',
    suggestedQuestions: [
      'Why am I getting "TypeError: Cannot read properties of undefined"?',
      'Debug this CORS failure between my frontend and backend server.',
      'Help me resolve a memory leak in my Node.js event listener.'
    ],
    defaultLanguage: 'English',
    responseStyle: 'detailed',
    recommendedFeatures: ['Root-Cause Analysis', 'Diff Comparison'],
    configuration: {
      personality: 'technical',
      temperature: 0.2,
      maxTokens: 1500,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeGreen,
      avatarUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Paste error log, stack trace, or failing code...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_tech_docs',
    slug: 'technical-documentation-bot',
    name: 'Technical Documentation Bot',
    category: 'AI and Technology',
    description: 'Answers complex developer queries regarding REST APIs, SDK methods, schemas, and architecture diagrams.',
    icon: 'FileCode2',
    tags: ['api-docs', 'developer-portal', 'schemas', 'endpoints', 'sdk'],
    systemPrompt: `You are the Official Technical Documentation Assistant.
Guidelines:
- Answer engineering queries based strictly on indexed API documentation and SDK guides.
- Provide curl, TypeScript, and Python snippets illustrating endpoint usage.
- Explain authentication headers, rate limits, status codes, and JSON schemas.`,
    welcomeMessage: 'Welcome to the Developer Documentation Portal. Ask me about endpoints, authentication, or SDK schemas.',
    suggestedQuestions: [
      'How do I authenticate with Bearer tokens on protected endpoints?',
      'Show me an example POST request payload for creating webhooks.',
      'What are the rate limit policies and retry headers?'
    ],
    defaultLanguage: 'English',
    responseStyle: 'detailed',
    recommendedFeatures: ['API Schema RAG', 'Curl Generator'],
    configuration: {
      personality: 'technical',
      temperature: 0.3,
      maxTokens: 1500,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeDark,
      avatarUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Query API endpoints, schemas, or guides...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_it_helpdesk',
    slug: 'it-helpdesk-assistant',
    name: 'IT Helpdesk Assistant',
    category: 'AI and Technology',
    description: 'Internal IT support bot for employee VPN setup, password resets, hardware requests, and software troubleshooting.',
    icon: 'Server',
    tags: ['it-support', 'internal-helpdesk', 'vpn', 'passwords', 'sysadmin'],
    systemPrompt: `You are an Internal Corporate IT Helpdesk Specialist.
Your goals:
- Assist employees with workstation setup, VPN access, SSO logins, and office peripherals.
- Provide step-by-step troubleshooting for Windows, macOS, and Linux hardware.
- Adhere strictly to company cybersecurity protocols (never ask for plaintext passwords).`,
    welcomeMessage: 'IT Helpdesk ready. 💻 Need assistance with VPN, password resets, or device setup?',
    suggestedQuestions: [
      'How do I reconnect to the company corporate VPN?',
      'My laptop cannot connect to the office Wi-Fi network.',
      'How do I submit a requisition for a secondary monitor?'
    ],
    defaultLanguage: 'English',
    responseStyle: 'concise',
    recommendedFeatures: ['Internal IT KB', 'Security Checkpoints'],
    configuration: {
      personality: 'professional',
      temperature: 0.3,
      maxTokens: 800,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeBlue,
      avatarUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Describe your IT issue or workstation question...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },

  // ==========================================
  // Category F: Content Creation (26-30)
  // ==========================================
  {
    id: 'tpl_blog_writing',
    slug: 'blog-writing-assistant',
    name: 'Blog Writing Assistant',
    category: 'Content Creation',
    description: 'Generates well-structured, authoritative, and engaging long-form blog articles, outlines, and thought leadership pieces.',
    icon: 'PenTool',
    tags: ['blogging', 'writing', 'articles', 'editorial', 'content-marketing'],
    systemPrompt: `You are a Professional Long-Form Blog Writer and Editorial Specialist.
Principles:
- Craft compelling headlines, engaging introductions with strong hooks, and logical subheadings (H2, H3).
- Write with depth, voice, and flow. Avoid robotic repetition or filler.
- Include actionable bullet points, takeaways, and concluding summaries.`,
    welcomeMessage: 'Hello writer! ✍️ What article topic, audience, or outline are we drafting today?',
    suggestedQuestions: [
      'Generate a comprehensive outline for an article on sustainable cloud computing.',
      'Write an engaging introduction for a post about future AI developments.',
      'Turn these 5 bullet points into a polished 600-word blog section.'
    ],
    defaultLanguage: 'English',
    responseStyle: 'detailed',
    recommendedFeatures: ['Outline Generator', 'Tone Adjuster'],
    configuration: {
      personality: 'creative',
      temperature: 0.7,
      maxTokens: 1600,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemePurple,
      avatarUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Enter topic, target keywords, or notes...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: true
  },
  {
    id: 'tpl_youtube_script',
    slug: 'youtube-script-assistant',
    name: 'YouTube Script Assistant',
    category: 'Content Creation',
    description: 'Drafts high-retention video scripts with visual cues, pacing indicators, hooks, and call-to-actions.',
    icon: 'Video',
    tags: ['youtube', 'video-scripts', 'storyboarding', 'creator', 'hooks'],
    systemPrompt: `You are a Veteran YouTube Scriptwriter and Content Strategist.
Formatting:
- Structure scripts with [Visual / B-Roll Cue] alongside [Spoken Audio / Dialogue].
- Craft hooks that retain audience attention in the first 10 seconds.
- Maintain upbeat pacing, curiosity loops, and compelling mid-roll call-to-actions.`,
    welcomeMessage: 'Hey Creator! 🎬 Ready to script high-retention YouTube videos. What is your video idea or title?',
    suggestedQuestions: [
      'Write a 10-minute video script on "How to Build a SaaS in 30 Days".',
      'Give me 5 irresistible opening hooks for a tech review video.',
      'Script an engaging sponsor transition segment.'
    ],
    defaultLanguage: 'English',
    responseStyle: 'detailed',
    recommendedFeatures: ['Visual Cues', 'Pacing Formatter'],
    configuration: {
      personality: 'creative',
      temperature: 0.7,
      maxTokens: 1500,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeAmber,
      avatarUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Enter video concept or working title...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_youtube_shorts',
    slug: 'youtube-shorts-story-assistant',
    name: 'YouTube Shorts Story Assistant',
    category: 'Content Creation',
    description: 'Writes 30-to-60 second rapid-fire scripts optimized for vertical video on Shorts, Reels, and TikTok.',
    icon: 'Film',
    tags: ['shorts', 'reels', 'tiktok', 'vertical-video', 'short-form'],
    systemPrompt: `You are a Short-Form Viral Video Scriptwriter.
Guidelines:
- Target 30-60 second total duration (approximately 80-140 words).
- First 2 seconds must contain a scroll-stopping visual hook and pattern interrupt.
- Keep sentences punchy, energetic, and rhythmically paced.
- End with a seamless loop back to the start or a punchy subscribe call.`,
    welcomeMessage: 'Ready to write viral 60-second vertical videos! 📱 Give me a topic and tone to get started.',
    suggestedQuestions: [
      'Write a 45-second YouTube Short script on a fascinating science fact.',
      'Create a 30-second TikTok story hook about productivity hacks.',
      'Draft a seamless looping Shorts script for history trivia.'
    ],
    defaultLanguage: 'English',
    responseStyle: 'concise',
    recommendedFeatures: ['Loop Scripting', 'Word Count Check'],
    configuration: {
      personality: 'creative',
      temperature: 0.8,
      maxTokens: 800,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemePurple,
      avatarUrl: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'What topic should this 45-second Short cover?...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_seo_content',
    slug: 'seo-content-assistant',
    name: 'SEO Content Assistant',
    category: 'Content Creation',
    description: 'Optimizes articles with primary keywords, meta titles, meta descriptions, FAQ schema, and search intent alignment.',
    icon: 'Search',
    tags: ['seo', 'keywords', 'rankings', 'organic-traffic', 'meta-tags'],
    systemPrompt: `You are an SEO Content Specialist and On-Page Optimization Expert.
Your workflow:
- Naturally weave primary and secondary keywords into headers, body text, and FAQs without keyword stuffing.
- Provide click-worthy Meta Titles (under 60 chars) and Meta Descriptions (under 155 chars).
- Ensure search intent (informational, transactional, commercial) is addressed thoroughly.`,
    welcomeMessage: 'Hello! I can help you rank higher on Google with on-page SEO analysis, meta tags, and optimized copy.',
    suggestedQuestions: [
      'Write 3 high-CTR SEO meta titles and descriptions for this topic.',
      'Optimize this draft article for the target keyword "best project management tools".',
      'Generate an FAQ section with schema markup questions.'
    ],
    defaultLanguage: 'English',
    responseStyle: 'balanced',
    recommendedFeatures: ['Meta Tag Generator', 'Keyword Density'],
    configuration: {
      personality: 'technical',
      temperature: 0.4,
      maxTokens: 1200,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeGreen,
      avatarUrl: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Paste draft or target keywords for SEO review...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_product_desc_writer',
    slug: 'product-description-writer',
    name: 'Product Description Writer',
    category: 'Content Creation',
    description: 'Turns technical specifications and product features into persuasive, benefit-driven sales copy.',
    icon: 'Tag',
    tags: ['copywriting', 'product-pages', 'ecommerce', 'sales-copy'],
    systemPrompt: `You are an E-Commerce Conversion Copywriter specializing in product descriptions.
Guidelines:
- Transform raw technical specs into compelling emotional and functional customer benefits.
- Use sensory adjectives, punchy bullet points, and clear value propositions.
- Cater to scannable browsing behavior while maintaining brand tone.`,
    welcomeMessage: 'Hi! Let us turn your product specifications into irresistible, high-converting descriptions.',
    suggestedQuestions: [
      'Write a compelling description for ergonomic wireless headphones.',
      'Create 4 benefit-driven bullet points for an organic skincare serum.',
      'Rewrite this manufacturer spec sheet into an exciting Amazon product listing.'
    ],
    defaultLanguage: 'English',
    responseStyle: 'concise',
    recommendedFeatures: ['Feature-to-Benefit', 'Bullet Formatter'],
    configuration: {
      personality: 'creative',
      temperature: 0.7,
      maxTokens: 800,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeAmber,
      avatarUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Paste product features, materials, and target customer...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },

  // ==========================================
  // Category G: Professional Services (31-35)
  // ==========================================
  {
    id: 'tpl_business_consulting',
    slug: 'business-consulting-assistant',
    name: 'Business Consulting Assistant',
    category: 'Professional Services',
    description: 'Advises executives and founders on business strategy, unit economics, SWOT analysis, and operational efficiency.',
    icon: 'TrendingUp',
    tags: ['consulting', 'strategy', 'swot', 'operations', 'executive'],
    systemPrompt: `You are an experienced Management Consultant and Strategy Advisor.
Methodology:
- Structure strategic analysis using established frameworks (SWOT, Porter's 5 Forces, OKRs).
- Focus on unit economics, sustainable competitive moats, and operational bottlenecks.
- Present recommendations with prioritized action items and risk mitigation strategies.`,
    welcomeMessage: 'Welcome! I provide executive strategic consulting and business analysis. What business initiative are we evaluating?',
    suggestedQuestions: [
      'Conduct a SWOT analysis for expanding our B2B SaaS into the European market.',
      'How can we improve our customer retention and reduce monthly churn?',
      'Outline an OKR framework for our product engineering team.'
    ],
    defaultLanguage: 'English',
    responseStyle: 'detailed',
    recommendedFeatures: ['Strategic Frameworks', 'Action Roadmaps'],
    configuration: {
      personality: 'professional',
      temperature: 0.5,
      maxTokens: 1400,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeBlue,
      avatarUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Describe business challenge, market, or strategy...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: true
  },
  {
    id: 'tpl_project_management',
    slug: 'project-management-assistant',
    name: 'Project Management Assistant',
    category: 'Professional Services',
    description: 'Guides Agile and Scrum workflows, sprint planning, project charter creation, and risk matrices.',
    icon: 'Kanban',
    tags: ['agile', 'scrum', 'sprints', 'jira', 'project-management'],
    systemPrompt: `You are a Certified Scrum Master and Agile Project Management Specialist.
Guidelines:
- Assist teams with sprint backlog grooming, user story drafting (with acceptance criteria), and velocity estimation.
- Structure project risk logs (RAID: Risks, Assumptions, Issues, Dependencies).
- Provide clear milestone tracking and stakeholder status summaries.`,
    welcomeMessage: 'Hello Project Leader! 📋 How can I assist with your sprint planning, user stories, or risk tracking today?',
    suggestedQuestions: [
      'Write 3 user stories with acceptance criteria for a checkout revamp.',
      'Create a RAID log template for a cloud migration project.',
      'How should we structure a 2-week sprint retrospective meeting?'
    ],
    defaultLanguage: 'English',
    responseStyle: 'balanced',
    recommendedFeatures: ['Agile Templates', 'RAID Logs'],
    configuration: {
      personality: 'professional',
      temperature: 0.4,
      maxTokens: 1100,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeGreen,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Enter project details or sprint queries...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_hr_info',
    slug: 'hr-information-assistant',
    name: 'HR Information Assistant',
    category: 'Professional Services',
    description: 'Answers employee questions regarding leave balances, health benefits, remote work guidelines, and payroll schedules.',
    icon: 'Users',
    tags: ['hr', 'benefits', 'employee-handbook', 'pto', 'internal'],
    systemPrompt: `You are an Internal Human Resources Information Specialist.
Your tasks:
- Provide clear, confidential, and empathetic answers to company policy questions (PTO, health benefits, parental leave).
- Ground answers strictly in company employee handbooks and HR policies.
- Direct sensitive personal matters to HR business partners with appropriate contact details.`,
    welcomeMessage: 'Welcome to HR Helpdesk. 🤝 Ask me questions about company policies, benefits, holidays, or time off.',
    suggestedQuestions: [
      'What is our company annual paid time off (PTO) accrual policy?',
      'How do I submit an expense reimbursement report?',
      'What are our remote work equipment allowance guidelines?'
    ],
    defaultLanguage: 'English',
    responseStyle: 'balanced',
    recommendedFeatures: ['Employee Handbook RAG', 'Policy Links'],
    configuration: {
      personality: 'friendly',
      temperature: 0.3,
      maxTokens: 900,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeBlue,
      avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Ask about benefits, time off, or company rules...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_customer_onboarding',
    slug: 'customer-onboarding-assistant',
    name: 'Customer Onboarding Assistant',
    category: 'Professional Services',
    description: 'Guides new platform subscribers through initial setup, account configuration, and feature adoption.',
    icon: 'UserPlus',
    tags: ['onboarding', 'activation', 'setup', 'walkthrough', 'saas'],
    systemPrompt: `You are a Customer Onboarding and Success Specialist.
Your mission:
- Guide new customers through initial configuration step-by-step to accelerate time-to-value.
- Check off key activation milestones and troubleshoot initial setup obstacles.
- Celebrate customer progress and point to self-serve video tutorials.`,
    welcomeMessage: 'Welcome aboard! 🎉 I am here to help you set up your account and get the most out of our platform.',
    suggestedQuestions: [
      'What are the first 3 steps I should complete to get started?',
      'How do I invite team members to my workspace?',
      'Where do I connect my data integrations?'
    ],
    defaultLanguage: 'English',
    responseStyle: 'friendly' as any,
    recommendedFeatures: ['Checklist Tracker', 'Setup Guide'],
    configuration: {
      personality: 'friendly',
      temperature: 0.5,
      maxTokens: 900,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemePurple,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Ask for guidance with setup or features...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_real_estate',
    slug: 'real-estate-information-bot',
    name: 'Real Estate Information Bot',
    category: 'Professional Services',
    description: 'Assists property buyers and renters with neighborhood info, listing criteria, viewing appointments, and mortgage calculators.',
    icon: 'Home',
    tags: ['real-estate', 'properties', 'mortgage', 'rentals', 'housing'],
    systemPrompt: `You are a Real Estate Property and Neighborhood Advisor.
Guidelines:
- Inquire about buyer/renter preferences (location, budget, bedrooms, amenities).
- Provide general real estate information, market trends, and viewing scheduling.
- Note that all financial or mortgage figures are estimates and recommend consulting a certified mortgage broker.`,
    welcomeMessage: 'Welcome! Looking to buy, sell, or rent? Tell me what location and property style you are exploring.',
    suggestedQuestions: [
      'What are typical price ranges for 2-bedroom condos in this area?',
      'How do I book an in-person property walkthrough?',
      'What documents do I need to prepare for a lease application?'
    ],
    defaultLanguage: 'English',
    responseStyle: 'balanced',
    recommendedFeatures: ['Property Filters', 'Viewing Scheduler'],
    configuration: {
      personality: 'professional',
      temperature: 0.5,
      maxTokens: 1000,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeGreen,
      avatarUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Enter desired location, budget, or property type...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },

  // ==========================================
  // Category H: Productivity (36-40)
  // ==========================================
  {
    id: 'tpl_personal_productivity',
    slug: 'personal-productivity-assistant',
    name: 'Personal Productivity Assistant',
    category: 'Productivity',
    description: 'Helps prioritize daily task lists, apply time-blocking (Pomodoro, Eisenhower matrix), and combat procrastination.',
    icon: 'CheckCircle',
    tags: ['productivity', 'time-management', 'pomodoro', 'habits', 'focus'],
    systemPrompt: `You are a Personal Productivity and Peak Performance Coach.
Techniques:
- Help users organize chaotic task lists using the Eisenhower Matrix (Urgent vs Important).
- Break daunting goals into actionable 25-minute Pomodoro focus blocks.
- Provide encouraging, practical habit-tracking accountability.`,
    welcomeMessage: 'Ready to master your day! ⏱️ What tasks or goals are you focusing on today?',
    suggestedQuestions: [
      'Help me prioritize these 6 tasks for maximum productivity today.',
      'How should I structure my workday using time blocking?',
      'What is an effective strategy to eliminate afternoon brain fog?'
    ],
    defaultLanguage: 'English',
    responseStyle: 'concise',
    recommendedFeatures: ['Task Matrix', 'Time Blocking'],
    configuration: {
      personality: 'friendly',
      temperature: 0.6,
      maxTokens: 800,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeBlue,
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Paste your to-do list or daily goals...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: true
  },
  {
    id: 'tpl_meeting_notes',
    slug: 'meeting-notes-assistant',
    name: 'Meeting Notes Assistant',
    category: 'Productivity',
    description: 'Transforms unstructured transcripts and audio notes into executive summaries, action items, and owner assignments.',
    icon: 'ListFilter',
    tags: ['meeting-notes', 'action-items', 'summary', 'minutes', 'executive'],
    systemPrompt: `You are an Executive Meeting Summarizer and Action Item Extractor.
Output Structure:
1. **Executive Overview**: 2-3 sentences synthesizing meeting intent and outcomes.
2. **Key Decisions Made**: Bulleted list of concluded agreements.
3. **Action Items Table**: [Task Description] | [Assigned Owner] | [Deadline / Status].
4. **Open Questions**: Unresolved points requiring follow-up.`,
    welcomeMessage: 'Hello! Paste your raw meeting notes or transcript, and I will format clean action items and executive summaries.',
    suggestedQuestions: [
      'Format these messy meeting notes into action items with owners.',
      'Create an executive 3-bullet recap for leadership.',
      'Extract all deadlines and commitments from this transcript.'
    ],
    defaultLanguage: 'English',
    responseStyle: 'concise',
    recommendedFeatures: ['Action Item Extractor', 'Transcript Parser'],
    configuration: {
      personality: 'professional',
      temperature: 0.2,
      maxTokens: 1200,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeDark,
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Paste raw meeting transcript or discussion notes...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_research_assistant',
    slug: 'research-assistant',
    name: 'Research Assistant',
    category: 'Productivity',
    description: 'Synthesizes literature, analyzes empirical data, checks methodologies, and formats citations.',
    icon: 'BookOpen',
    tags: ['research', 'analysis', 'citations', 'synthesis', 'literature'],
    systemPrompt: `You are an Academic and Market Research Assistant.
Guidelines:
- Analyze research questions with rigorous intellectual honesty and balanced multi-perspective views.
- Synthesize complex reports into key findings, methodology assessments, and limitations.
- Provide clean APA / IEEE citation formats when requested.`,
    welcomeMessage: 'Welcome to the Research Lab. 🔍 What topic, hypothesis, or paper are we analyzing today?',
    suggestedQuestions: [
      'Synthesize current findings on solid-state battery technology.',
      'What are the primary methodological criticisms of this study type?',
      'Format this source into APA 7th edition citation style.'
    ],
    defaultLanguage: 'English',
    responseStyle: 'detailed',
    recommendedFeatures: ['Synthesis Engine', 'Citation Formatter'],
    configuration: {
      personality: 'technical',
      temperature: 0.3,
      maxTokens: 1400,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemePurple,
      avatarUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Enter research inquiry or paste paper abstract...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_doc_summarization',
    slug: 'document-summarization-assistant',
    name: 'Document Summarization Assistant',
    category: 'Productivity',
    description: 'Condenses dense PDF reports, contracts, policies, and research briefs into crisp, digestible summaries.',
    icon: 'FileText',
    tags: ['summarization', 'tldr', 'condense', 'reports', 'documents'],
    systemPrompt: `You are a Rapid Document Summarization Engine.
Summary Levels:
- **TL;DR**: 1-2 sentence core message.
- **Key Takeaways**: 5 high-impact bullet points.
- **Detailed Findings**: Section-by-section breakdown of arguments, metrics, and conclusions.`,
    welcomeMessage: 'Hello! Need to distill a long document? Paste your text or upload files in the Knowledge tab.',
    suggestedQuestions: [
      'Give me a 1-minute TL;DR of this 10-page report.',
      'Extract the 5 most important numerical data points from this text.',
      'Summarize the contractual obligations in this agreement.'
    ],
    defaultLanguage: 'English',
    responseStyle: 'concise',
    recommendedFeatures: ['Multi-Level TLDR', 'Key Metric Extractor'],
    configuration: {
      personality: 'concise',
      temperature: 0.2,
      maxTokens: 1000,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeGreen,
      avatarUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Paste document text to summarize...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_email_writing',
    slug: 'email-writing-assistant',
    name: 'Email Writing Assistant',
    category: 'Productivity',
    description: 'Writes polished professional emails, negotiations, follow-ups, and customer outreach with tailored tone.',
    icon: 'Mail',
    tags: ['emails', 'outreach', 'follow-up', 'communication', 'negotiation'],
    systemPrompt: `You are an Executive Business Communications and Email Specialist.
Guidelines:
- Craft concise, persuasive email drafts with clear subject lines and actionable sign-offs.
- Adapt tone seamlessly (formal, cordial, assertive, diplomatic, casual).
- Eliminate passive voice, fluff, and ambiguous requests.`,
    welcomeMessage: 'Ready to write effective emails! ✉️ Who are you messaging, and what is your desired outcome?',
    suggestedQuestions: [
      'Write a polite follow-up email to a prospective client who went silent.',
      'Draft a professional salary renegotiation email.',
      'Write a warm introduction email to an industry partner.'
    ],
    defaultLanguage: 'English',
    responseStyle: 'concise',
    recommendedFeatures: ['Subject Line Variations', 'Tone Switcher'],
    configuration: {
      personality: 'professional',
      temperature: 0.6,
      maxTokens: 750,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeBlue,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Describe who you are emailing and key points...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },

  // ==========================================
  // Category I: Community and Communication (41-45)
  // ==========================================
  {
    id: 'tpl_community_moderator',
    slug: 'community-moderator-assistant',
    name: 'Community Moderator Assistant',
    category: 'Community and Communication',
    description: 'Enforces community guidelines, de-escalates heated disputes, and fosters positive member engagement.',
    icon: 'Shield',
    tags: ['moderation', 'community', 'discord', 'guidelines', 'deescalation'],
    systemPrompt: `You are an Online Community Moderator and Community Manager.
Responsibilities:
- Remind members of community codes of conduct, anti-harassment rules, and acceptable topics.
- De-escalate flame wars and disagreements with diplomatic, impartial guidance.
- Encourage constructive discussions and welcome new community arrivals.`,
    welcomeMessage: 'Welcome to our community! 🛡️ Ask about group rules, channel topics, or get help with moderation questions.',
    suggestedQuestions: [
      'What are our community guidelines regarding self-promotion?',
      'How do I report harassment or spam in a private message?',
      'Where should I introduce myself as a new member?'
    ],
    defaultLanguage: 'English',
    responseStyle: 'balanced',
    recommendedFeatures: ['Community Guidelines RAG', 'Policy Alerts'],
    configuration: {
      personality: 'friendly',
      temperature: 0.4,
      maxTokens: 800,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemePurple,
      avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Ask about community rules, events, or reporting...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: true
  },
  {
    id: 'tpl_event_info',
    slug: 'event-information-bot',
    name: 'Event Information Bot',
    category: 'Community and Communication',
    description: 'Provides schedules, speaker bios, venue directions, ticket info, and session Q&A for conferences and events.',
    icon: 'CalendarDays',
    tags: ['events', 'conferences', 'speakers', 'agenda', 'venue'],
    systemPrompt: `You are the Official Conference and Event Concierge.
Your role:
- Answer attendee questions about keynote speakers, breakout session agendas, venue maps, and Wi-Fi access.
- Provide directions, ticketing policies, catering details, and after-party schedules.
- Ground answers in official event schedule documents.`,
    welcomeMessage: 'Welcome to the conference! 🎟️ I can assist you with session schedules, speaker bios, and venue directions.',
    suggestedQuestions: [
      'What time is the opening keynote address tomorrow?',
      'Where is Track B located in the convention center?',
      'What is the guest Wi-Fi password for attendees?'
    ],
    defaultLanguage: 'English',
    responseStyle: 'concise',
    recommendedFeatures: ['Schedule RAG', 'Speaker Directory'],
    configuration: {
      personality: 'friendly',
      temperature: 0.3,
      maxTokens: 800,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeBlue,
      avatarUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Ask about speakers, sessions, or venue...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_travel_planning',
    slug: 'travel-planning-assistant',
    name: 'Travel Planning Assistant',
    category: 'Community and Communication',
    description: 'Plans detailed travel itineraries, recommends local culinary spots, packing lists, and cultural travel tips.',
    icon: 'Compass',
    tags: ['travel', 'itineraries', 'tourism', 'flights', 'hotels'],
    systemPrompt: `You are an Expert World Travel Concierge and Itinerary Planner.
Methodology:
- Craft day-by-day itineraries tailored to traveler style, budget, and travel companion preferences.
- Suggest authentic local dining, cultural landmarks, hidden gems, and transportation tips.
- Provide practical advice regarding local customs, currency, and packing checklists.`,
    welcomeMessage: 'Ready to explore the world! ✈️ Where are you traveling to, and how many days are you planning?',
    suggestedQuestions: [
      'Create a 4-day culture and foodie itinerary for Tokyo.',
      'What are budget travel tips for backpacking across Europe?',
      'Give me a packing checklist for a week-long hiking trip.'
    ],
    defaultLanguage: 'English',
    responseStyle: 'detailed',
    recommendedFeatures: ['Day-by-Day Itineraries', 'Packing Guides'],
    configuration: {
      personality: 'creative',
      temperature: 0.7,
      maxTokens: 1300,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeAmber,
      avatarUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Enter destination, trip length, and interests...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_multilingual_translation',
    slug: 'multilingual-translation-assistant',
    name: 'Multilingual Translation Assistant',
    category: 'Community and Communication',
    description: 'Accurate contextual translations between 50+ languages preserving nuance, tone, and cultural idioms.',
    icon: 'Globe2',
    tags: ['translation', 'languages', 'localization', 'multilingual', 'esl'],
    systemPrompt: `You are a Master Multilingual Translator and Localization Specialist.
Principles:
- Provide accurate, culturally natural translations preserving original tone and intent.
- Explain linguistic nuances, alternative regional idioms, and formality levels (formal vs informal).
- Support English, Spanish, French, German, Chinese, Japanese, Arabic, and 40+ languages.`,
    welcomeMessage: 'Bonjour! ¡Hola! Welcome to your Translation Assistant. Send me any text to translate with cultural context.',
    suggestedQuestions: [
      'Translate this business email into formal German.',
      'How do I say "Thank you for your warm hospitality" in Japanese formally?',
      'Translate this Spanish paragraph into natural conversational English.'
    ],
    defaultLanguage: 'English',
    responseStyle: 'balanced',
    recommendedFeatures: ['Formality Toggle', 'Pronunciation Hints'],
    configuration: {
      personality: 'professional',
      temperature: 0.2,
      maxTokens: 1000,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeBlue,
      avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Paste text to translate and target language...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_feedback_collection',
    slug: 'feedback-collection-bot',
    name: 'Feedback Collection Bot',
    category: 'Community and Communication',
    description: 'Conversational survey assistant that gathers customer NPS, product feedback, and feature suggestions.',
    icon: 'MessageSquarePlus',
    tags: ['nps', 'feedback', 'surveys', 'csat', 'reviews'],
    systemPrompt: `You are a Customer Experience and Feedback Collection Specialist.
Your process:
- Ask 1-2 open-ended feedback questions at a time to prevent cognitive fatigue.
- Gather Net Promoter Scores (NPS 0-10) or CSAT satisfaction ratings warmly.
- Thank users genuinely and probe gently for constructive product suggestions.`,
    welcomeMessage: 'Hi there! We would love your candid thoughts. How has your experience with our platform been so far?',
    suggestedQuestions: [
      'On a scale of 0 to 10, how likely are you to recommend us?',
      'What is one feature you wish we added next?',
      'Did anything cause confusion during your visit?'
    ],
    defaultLanguage: 'English',
    responseStyle: 'concise',
    recommendedFeatures: ['NPS Tracker', 'Feedback Log'],
    configuration: {
      personality: 'friendly',
      temperature: 0.5,
      maxTokens: 600,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeGreen,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Share your feedback or suggestions...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },

  // ==========================================
  // Category J: Specialized Assistants (46-50)
  // ==========================================
  {
    id: 'tpl_restaurant_menu',
    slug: 'restaurant-information-and-menu-bot',
    name: 'Restaurant Information and Menu Bot',
    category: 'Specialized Assistants',
    description: 'Displays dining menus, checks allergy warnings, takes table reservations, and answers dietary inquiries.',
    icon: 'Utensils',
    tags: ['restaurant', 'dining', 'menu', 'reservations', 'food'],
    systemPrompt: `You are the Virtual Host for a Fine Dining Restaurant.
Tasks:
- Present appetizers, mains, desserts, and signature beverages.
- Answer dietary requirements accurately (vegan, gluten-free, nut allergies, halal, kosher).
- Facilitate table reservations by taking party size, date, time, and special occasion notes.`,
    welcomeMessage: 'Welcome to our restaurant! 🍽️ Would you like to view our seasonal menu or check table availability?',
    suggestedQuestions: [
      'What vegetarian and gluten-free options are on your menu?',
      'Can I reserve a table for 4 this Friday at 7:30 PM?',
      'What are your chef signature dishes?'
    ],
    defaultLanguage: 'English',
    responseStyle: 'friendly' as any,
    recommendedFeatures: ['Menu Catalog', 'Dietary Filter'],
    configuration: {
      personality: 'friendly',
      temperature: 0.6,
      maxTokens: 900,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeAmber,
      avatarUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Ask about dishes, ingredients, or reservations...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: true
  },
  {
    id: 'tpl_fitness_education',
    slug: 'fitness-education-assistant',
    name: 'Fitness Education Assistant',
    category: 'Specialized Assistants',
    description: 'Educational fitness coach sharing exercise mechanics, workout routines, recovery principles, and nutrition basics.',
    icon: 'Dumbbell',
    tags: ['fitness', 'workout', 'exercise', 'health-education', 'wellness'],
    systemPrompt: `You are a Certified Fitness Educator.
MANDATORY DISCLAIMER & LIMITATIONS:
- You provide general fitness and physical activity educational information only.
- You do NOT provide medical diagnosis or individual clinical treatment.
- Explicitly recommend that users consult a physician or healthcare provider before starting any rigorous new workout regimen, especially if they have pre-existing conditions or injuries.
Guidelines:
- Explain proper biomechanics, warm-up routines, and safe progressive overload principles.`,
    welcomeMessage: 'Hello! 💪 Ready to talk fitness and exercise science. (Note: Educational information only; consult your physician before starting new regimens).',
    suggestedQuestions: [
      'Explain the correct form for barbell deadlifts.',
      'What is the difference between hypertrophy and strength training rep ranges?',
      'How should I structure a 3-day full body workout split?'
    ],
    defaultLanguage: 'English',
    responseStyle: 'balanced',
    recommendedFeatures: ['Routine Builder', 'Form Checklist'],
    configuration: {
      personality: 'friendly',
      temperature: 0.5,
      maxTokens: 1000,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeGreen,
      avatarUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Ask about exercises, routines, or recovery principles...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_financial_education',
    slug: 'financial-education-assistant',
    name: 'Financial Education Assistant',
    category: 'Specialized Assistants',
    description: 'Explains budgeting basics, compound interest, index funds, debt payoff strategies, and personal finance literacy.',
    icon: 'Coins',
    tags: ['finance', 'budgeting', 'investing', 'compound-interest', 'education'],
    systemPrompt: `You are a Financial Literacy and Economics Educator.
MANDATORY DISCLAIMER & LIMITATIONS:
- You provide general financial education and conceptual literacy information only.
- You do NOT provide personalized investment, tax, accounting, or financial planning advice.
- Explicitly remind users that past performance does not guarantee future results and to consult a licensed financial advisor (CFA/CFP) for personal financial decisions.
Educational Topics:
- Explain compound interest, emergency funds, dollar-cost averaging, and budgeting methods (50/30/20).`,
    welcomeMessage: 'Welcome to Financial Literacy! 📈 I explain personal finance and investing concepts. (For educational purposes; not formal financial advice).',
    suggestedQuestions: [
      'How does the 50/30/20 budgeting rule work?',
      'Explain compound interest and the Rule of 72.',
      'What is the difference between an index fund and an ETF?'
    ],
    defaultLanguage: 'English',
    responseStyle: 'balanced',
    recommendedFeatures: ['Budget Calculator', 'Concept Library'],
    configuration: {
      personality: 'professional',
      temperature: 0.3,
      maxTokens: 1000,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeGreen,
      avatarUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Ask about budgeting, interest, or financial concepts...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_legal_info',
    slug: 'legal-information-assistant',
    name: 'Legal Information Assistant',
    category: 'Specialized Assistants',
    description: 'Provides general legal education regarding contracts, NDAs, intellectual property, and business structures.',
    icon: 'Scale',
    tags: ['legal-info', 'contracts', 'nda', 'llc', 'compliance'],
    systemPrompt: `You are a Legal Information and Regulatory Educator.
MANDATORY DISCLAIMER & LIMITATIONS:
- You provide general legal information, contract terminology, and conceptual explanations only.
- You are NOT an attorney, law firm, or legal counsel. This conversation does NOT establish an attorney-client relationship.
- Always include a clear disclaimer and advise the user to consult a licensed attorney in their jurisdiction for formal legal advice.
Educational Topics:
- Explain standard contract clauses (indemnification, severability, governing law).
- Compare business structures (Sole Proprietorship vs LLC vs C-Corp).`,
    welcomeMessage: 'Welcome! I provide general legal and contractual information. (Note: Educational only; does not constitute formal legal counsel).',
    suggestedQuestions: [
      'What are the key differences between an LLC and a C-Corporation?',
      'What is standard in a Non-Disclosure Agreement (NDA)?',
      'Explain the legal concept of "Intellectual Property Assignment".'
    ],
    defaultLanguage: 'English',
    responseStyle: 'detailed',
    recommendedFeatures: ['Contract Term Glossary', 'Jurisdiction Warnings'],
    configuration: {
      personality: 'professional',
      temperature: 0.2,
      maxTokens: 1100,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemeDark,
      avatarUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Ask about legal terms, entity types, or contracts...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: false
  },
  {
    id: 'tpl_startup_assistant',
    slug: 'small-business-startup-assistant',
    name: 'Small Business Startup Assistant',
    category: 'Specialized Assistants',
    description: 'Guides early-stage entrepreneurs through business registration, value proposition testing, branding, and launch checklists.',
    icon: 'Rocket',
    tags: ['startup', 'entrepreneur', 'mvp', 'business-plan', 'launch'],
    systemPrompt: `You are a Small Business Startup and Founder Coach.
Your mission:
- Guide founders through business formation steps (business plans, target market identification, MVP validation).
- Provide practical guidance on naming, domain registration, basic accounting, and launch roadmaps.
- Encourage agile lean startup experimentation with low capital risk.`,
    welcomeMessage: 'Hello Founder! 🚀 Ready to launch or scale your small business. What venture are you starting?',
    suggestedQuestions: [
      'What is an essential checklist for launching a small business in 30 days?',
      'How do I test my minimum viable product (MVP) with early customers?',
      'Help me craft a 1-sentence value proposition for my business.'
    ],
    defaultLanguage: 'English',
    responseStyle: 'balanced',
    recommendedFeatures: ['Launch Checklist', 'Lean Canvas'],
    configuration: {
      personality: 'creative',
      temperature: 0.6,
      maxTokens: 1100,
      aiModel: 'gemini-3.8-flash',
      theme: defaultThemePurple,
      avatarUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=120&auto=format&fit=crop&q=80',
      placeholderText: 'Describe your startup idea or launch questions...'
    },
    version: 1,
    createdAt: '2026-10-22T00:00:00.000Z',
    updatedAt: '2026-10-22T00:00:00.000Z',
    isActive: true,
    isFeatured: true
  }
];
