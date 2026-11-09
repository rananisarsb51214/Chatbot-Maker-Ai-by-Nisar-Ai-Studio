/**
 * Chatbot Maker AI - 50 Templates Verification Test Suite
 * By Nisar AI Studio
 *
 * Verifies all 12 acceptance criteria:
 * 1. Exactly 50 templates defined and loaded
 * 2. Exactly 10 categories with 5 templates each
 * 3. Unique IDs and slugs
 * 4. Non-empty system prompts and valid schema
 * 5. Educational disclaimers on sensitive domains (Fitness, Financial, Legal)
 * 6. Search and category filtering
 * 7. One-click cloning produces independent draft bots
 * 8. Independent mutation (modifying clone does not mutate template)
 * 9. Reset to template restores original configuration safely
 * 10. User favorites / bookmarking logic
 * 11. Admin active/featured moderation and user visibility gating
 * 12. Idempotent database seeding (no duplicates on reload)
 */

import { INITIAL_TEMPLATES } from '../server/templatesData';
import { db } from '../server/db';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${testName}: ${detail || 'Condition false'}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🤖 RUNNING 50 CHATBOT TEMPLATES VERIFICATION SUITE');
  console.log('======================================================\n');

  // Test 1: Exactly 50 templates defined in seed data
  assert(
    INITIAL_TEMPLATES.length === 50,
    'Criterion 1: Exactly 50 templates loaded in INITIAL_TEMPLATES',
    `Found ${INITIAL_TEMPLATES.length} templates`
  );

  // Test 2: Exactly 10 categories with 5 templates each
  const expectedCategories = [
    'Business and Customer Support',
    'E-commerce',
    'Marketing and Sales',
    'Education',
    'AI and Technology',
    'Content Creation',
    'Professional Services',
    'Productivity',
    'Community and Communication',
    'Specialized Assistants'
  ];

  const categoryCounts = expectedCategories.reduce((acc, cat) => {
    acc[cat] = INITIAL_TEMPLATES.filter(t => t.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  const allCategoriesHave5 = expectedCategories.every(cat => categoryCounts[cat] === 5);
  assert(
    allCategoriesHave5,
    'Criterion 2: All 10 categories contain exactly 5 templates',
    JSON.stringify(categoryCounts, null, 2)
  );

  // Test 3: Unique IDs and unique slugs
  const ids = new Set(INITIAL_TEMPLATES.map(t => t.id));
  const slugs = new Set(INITIAL_TEMPLATES.map(t => t.slug));
  assert(
    ids.size === 50 && slugs.size === 50,
    'Criterion 3: All 50 IDs and slugs are globally unique',
    `Unique IDs: ${ids.size}, Unique Slugs: ${slugs.size}`
  );

  // Test 4: Non-empty system prompts, welcome messages, suggested questions, and valid configurations
  const validPrompts = INITIAL_TEMPLATES.every(
    t => t.systemPrompt && t.systemPrompt.trim().length > 30 &&
         t.welcomeMessage && t.welcomeMessage.trim().length > 0 &&
         Array.isArray(t.suggestedQuestions) && t.suggestedQuestions.length >= 2 &&
         t.configuration && t.configuration.theme?.primaryColor && t.configuration.personality
  );
  assert(
    validPrompts,
    'Criterion 4: Every template has robust system prompts, welcome messages, suggested questions, and styling configs'
  );

  // Test 5: Educational disclaimers present in Fitness (#47), Financial (#48), Legal (#49)
  const fitnessBot = INITIAL_TEMPLATES.find(t => t.slug === 'fitness-education-assistant');
  const financialBot = INITIAL_TEMPLATES.find(t => t.slug === 'financial-education-assistant');
  const legalBot = INITIAL_TEMPLATES.find(t => t.slug === 'legal-information-assistant');

  const fitnessHasDisclaimer = fitnessBot?.systemPrompt.toLowerCase().includes('disclaimer') ||
                               fitnessBot?.systemPrompt.toLowerCase().includes('medical');
  const financialHasDisclaimer = financialBot?.systemPrompt.toLowerCase().includes('disclaimer') ||
                                 financialBot?.systemPrompt.toLowerCase().includes('financial advice');
  const legalHasDisclaimer = legalBot?.systemPrompt.toLowerCase().includes('disclaimer') ||
                             legalBot?.systemPrompt.toLowerCase().includes('legal advice');

  assert(
    Boolean(fitnessHasDisclaimer && financialHasDisclaimer && legalHasDisclaimer),
    'Criterion 5: Sensitive health, financial, and legal templates include mandatory educational disclaimers'
  );

  // Test 6: DB search and category filtering
  const ecommerceTemplates = db.getTemplates({ category: 'E-commerce', activeOnly: true });
  assert(
    ecommerceTemplates.length === 5,
    'Criterion 6a: Category filter returns exact category members',
    `Expected 5 e-commerce templates, got ${ecommerceTemplates.length}`
  );

  const searchResults = db.getTemplates({ search: 'python', activeOnly: true });
  assert(
    searchResults.length > 0 && searchResults.some(t => t.name.toLowerCase().includes('programming') || t.tags.includes('python')),
    'Criterion 6b: Search matches tags and content accurately',
    `Found ${searchResults.length} matching templates for "python"`
  );

  // Test 7: One-click cloning produces independent draft bot
  const templateToClone = INITIAL_TEMPLATES[0]; // Business Customer Support Bot
  const testUserId = 'test-user-verify-123';
  const clonedBot = db.cloneTemplateToChatbot(templateToClone.id, testUserId);

  assert(
    Boolean(clonedBot && clonedBot.id !== templateToClone.id && clonedBot.templateId === templateToClone.id),
    'Criterion 7a: Template cloned with distinct ID and linked templateId reference'
  );
  assert(
    clonedBot.status === 'draft',
    'Criterion 7b: Cloned bot created in "draft" status (ready for user customization)'
  );
  assert(
    clonedBot.userId === testUserId,
    'Criterion 7c: Cloned bot assigned to the correct user owner'
  );

  // Test 8: Independent mutation (editing cloned bot doesn't mutate template or other bots)
  const originalTemplatePrompt = templateToClone.systemPrompt;
  const modifiedBot = db.updateChatbot(clonedBot.id, {
    name: 'Custom Support Bot Overridden',
    systemInstruction: 'COMPLETELY MUTATED PROMPT FOR SPECIFIC CLIENT'
  });

  const refreshedTemplate = db.getTemplateById(templateToClone.id);
  assert(
    refreshedTemplate?.systemPrompt === originalTemplatePrompt &&
    refreshedTemplate?.name === templateToClone.name,
    'Criterion 8: Mutating cloned bot does NOT alter the original global template'
  );

  // Test 9: Reset to template defaults restores original configuration
  const resetBot = db.resetChatbotToTemplate(clonedBot.id, testUserId);
  assert(
    Boolean(resetBot && resetBot.systemInstruction === originalTemplatePrompt && resetBot.name === templateToClone.name),
    'Criterion 9: Reset to Template Defaults cleanly restores template prompt and settings'
  );

  // Test 10: User favorites / bookmarking logic
  const favTemplateId = INITIAL_TEMPLATES[2].id;
  db.addFavorite(testUserId, favTemplateId);
  const favoritesAfterAdd = db.getUserFavorites(testUserId);
  assert(
    favoritesAfterAdd.includes(favTemplateId),
    'Criterion 10a: User favorite successfully recorded'
  );

  db.removeFavorite(testUserId, favTemplateId);
  const favoritesAfterRemove = db.getUserFavorites(testUserId);
  assert(
    !favoritesAfterRemove.includes(favTemplateId),
    'Criterion 10b: User favorite successfully removed'
  );

  // Test 11: Admin active/featured toggle & user visibility gating
  const adminTestTemplate = INITIAL_TEMPLATES[10];
  db.updateTemplate(adminTestTemplate.id, { isActive: false });

  const publicList = db.getTemplates({ activeOnly: true });
  const adminList = db.getTemplates({ activeOnly: false });

  assert(
    !publicList.some(t => t.id === adminTestTemplate.id) &&
    adminList.some(t => t.id === adminTestTemplate.id),
    'Criterion 11: Inactive template is hidden from public list but visible to admin moderation'
  );

  // Restore active state
  db.updateTemplate(adminTestTemplate.id, { isActive: true });

  // Test 12: Idempotent database loading (no duplicates on repeated load)
  const beforeCount = db.getTemplates({ activeOnly: false }).length;
  // Trigger db.load() again
  db.load();
  const afterCount = db.getTemplates({ activeOnly: false }).length;
  assert(
    beforeCount === afterCount,
    'Criterion 12: Idempotent seeding prevents duplicate templates on server restarts or reloads',
    `Before: ${beforeCount}, After: ${afterCount}`
  );

  // Clean up test bot
  db.deleteChatbot(clonedBot.id);

  console.log('\n======================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
