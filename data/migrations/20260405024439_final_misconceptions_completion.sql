/*
  # Final Misconceptions Completion
  
  1. Changes
    - Complete Jainism (3 → 5)
    - Complete Bahá'í Faith (3 → 5)
    - Complete Sikhism (4 → 5)
    - Ensure comprehensive coverage across all categories
*/

-- JAINISM (expand from 3 to 5)
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Jainism'),
    'Jain monks wear masks because they''re afraid of germs',
    'Jain monks wear mouth coverings to avoid accidentally inhaling and killing tiny insects, reflecting profound commitment to ahimsa (non-violence). This isn''t fear but compassion extended to the smallest beings. It demonstrates taking non-violence to its logical conclusion.',
    'practices'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Jainism'),
    'Jainism''s extreme asceticism is life-denying',
    'Jain asceticism aims at liberation from attachment and karmic bondage, not denying life''s value. The path includes laypeople living ethical, moderate lives and monks/nuns pursuing intensive spiritual practice. Both paths affirm life''s preciousness by minimizing harm and cultivating wisdom.',
    'beliefs'
  );

-- BAHÁ'Í FAITH (expand from 3 to 5)
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Bahá''í Faith'),
    'Bahá''ís are universalists who don''t take their faith seriously',
    'Bahá''ís have specific beliefs, practices, and scripture. They observe daily obligatory prayers, fast annually, avoid alcohol and drugs, and follow ethical teachings. Recognizing truth in other religions doesn''t mean lacking commitment - it means seeing God''s progressive revelation throughout history.',
    'practices'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Bahá''í Faith'),
    'Bahá''í Faith is just Persian culture',
    'While founded in 19th century Persia, Bahá''í Faith has spread worldwide with adherents from every background. It transcends cultural origins with universal principles of equality, education, and world peace. The largest Bahá''í community is actually in India, not Iran.',
    'culture'
  );

-- SIKHISM (expand from 4 to 5)
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Sikhism'),
    'The Golden Temple is only for Sikhs',
    'Harmandir Sahib (Golden Temple) welcomes all people regardless of religion, caste, race, or gender. Its four doors symbolize openness to all directions. The langar (community kitchen) serves free meals to 100,000+ people daily - embodying Sikh values of equality and service to all.',
    'practices'
  );
