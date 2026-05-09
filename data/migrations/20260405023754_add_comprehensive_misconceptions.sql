/*
  # Comprehensive Misconceptions Database
  
  1. Changes
    - Add detailed misconceptions for ALL world religions
    - Cover multiple common misunderstandings per tradition
    - Include nuanced explanations and context
    - Add category field for filtering
  
  2. Categories
    - practices: Misconceptions about religious practices
    - beliefs: Misconceptions about core beliefs and theology
    - history: Historical misunderstandings
    - culture: Cultural vs religious confusion
    - violence: Misunderstandings about peace/violence
    - women: Misconceptions about gender roles
    - general: General stereotypes
*/

-- Add category column to misconceptions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'misconceptions' AND column_name = 'category'
  ) THEN
    ALTER TABLE misconceptions ADD COLUMN category text DEFAULT 'general';
  END IF;
END $$;

-- Update existing misconceptions with categories
UPDATE misconceptions SET category = 'beliefs' WHERE misconception LIKE '%religion%' OR misconception LIKE '%god%';
UPDATE misconceptions SET category = 'violence' WHERE misconception LIKE '%violence%' OR misconception LIKE '%intolerance%';
UPDATE misconceptions SET category = 'practices' WHERE misconception LIKE '%worship%' OR misconception LIKE '%ritual%';

-- Insert comprehensive misconceptions for all traditions

-- ISLAM
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Islam'),
    'Women are oppressed in Islam',
    'Islam granted women rights to property, education, and divorce 1400 years ago - revolutionary for its time. Many restrictions attributed to Islam actually stem from cultural practices, not religious teachings. The Quran emphasizes the spiritual equality of men and women, and many Muslim women are educated professionals who choose their level of religious observance.',
    'women'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Islam'),
    'Muslims don''t believe in Jesus',
    'Muslims deeply revere Jesus (Isa in Arabic) as one of the greatest prophets and messengers of God. The Quran mentions Mary (Maryam) more than the Bible does, and a chapter is named after her. Muslims believe in Jesus''s miraculous birth, his miracles, and his return before the Day of Judgment.',
    'beliefs'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Islam'),
    'Jihad means holy war',
    'Jihad literally means "struggle" or "effort." The greater jihad is the internal spiritual struggle against one''s own ego and desires. The lesser jihad refers to defending one''s faith or community, but even this has strict rules prohibiting harm to civilians, destruction of property, or forced conversion.',
    'practices'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Islam'),
    'Sharia law is barbaric and medieval',
    'Sharia is a broad ethical and moral framework covering all aspects of life, not just punishments. It includes principles of justice, charity, family life, business ethics, and worship. Most Muslims apply Sharia to personal spiritual practice. Extreme interpretations by some governments don''t represent mainstream Islamic law.',
    'beliefs'
  );

-- CHRISTIANITY
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Christianity'),
    'All Christians are anti-science',
    'Many groundbreaking scientists have been devout Christians, including Isaac Newton, Gregor Mendel (father of genetics), and Georges Lemaître (proposed the Big Bang theory). Many Christians see science as discovering how God''s creation works. Only a minority reject scientific consensus.',
    'beliefs'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Christianity'),
    'Christians worship three gods (Trinity)',
    'Christians believe in one God who exists in three persons - Father, Son, and Holy Spirit. This is monotheism, not polytheism. The Trinity is understood as one divine essence expressed in three distinct persons, a mystery that has been central to Christian theology for centuries.',
    'beliefs'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Christianity'),
    'The Bible was written in English',
    'The Bible was originally written in Hebrew, Aramaic, and Greek over many centuries. English translations came much later. Understanding this helps explain why different translations exist and why studying original languages and historical context enriches understanding.',
    'history'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Christianity'),
    'Christianity is only for Westerners',
    'Christianity began in the Middle East and spread to Africa and Asia before reaching Europe. Today, most Christians live in the Global South. Ethiopia has practiced Christianity since the 4th century, and vibrant Christian communities exist across Asia, Africa, and Latin America.',
    'culture'
  );

-- JUDAISM
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Judaism'),
    'Judaism is just the Old Testament',
    'Judaism is a living tradition that includes the Torah, Talmud (rabbinic discussions), centuries of legal interpretation, philosophy, mysticism, and evolving practices. Jewish life involves ongoing study, questioning, and application of ancient wisdom to contemporary life.',
    'beliefs'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Judaism'),
    'All Jews keep kosher and observe Sabbath the same way',
    'Judaism has diverse expressions from Orthodox to Reform to Reconstructionist. Jews practice their faith in varied ways, with different levels of observance of dietary laws, Sabbath, and other traditions. This diversity is a strength, not a weakness.',
    'practices'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Judaism'),
    'Jews don''t believe in an afterlife',
    'While Judaism focuses more on this life than the afterlife, Jewish tradition includes various conceptions of the world to come (Olam Ha-Ba), resurrection, and the soul''s journey. Different Jewish movements have different emphases on afterlife teachings.',
    'beliefs'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Judaism'),
    'Judaism is an ethnicity, not a religion',
    'Judaism is both a religion and an ethno-cultural identity. People can convert to Judaism from any background. While many Jews share ethnic heritage, Judaism welcomes sincere converts who choose to join the Jewish people through study and commitment.',
    'general'
  );

-- HINDUISM
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Hinduism'),
    'Hindus worship cows',
    'Hindus don''t worship cows but revere them as symbols of life, motherhood, and non-violence. The cow represents giving without taking - providing milk, labor, and fertilizer while asking little. This reverence reflects deeper values of compassion and respect for all life.',
    'practices'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Hinduism'),
    'The caste system is required by Hinduism',
    'The caste system is a social structure that became rigid over time, not a core religious teaching. Many Hindu reformers and scriptures condemn caste discrimination. Modern Hindus increasingly reject caste-based discrimination, recognizing it contradicts Hindu principles of equality and dharma.',
    'culture'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Hinduism'),
    'Karma means fatalism',
    'Karma means action and its consequences - every action has results. It''s not fatalistic; rather it emphasizes personal responsibility and the power to shape one''s future through present choices. Karma teaches that we can always change our trajectory through righteous action.',
    'beliefs'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Hinduism'),
    'Yoga is just exercise',
    'While yoga includes physical postures, it''s a comprehensive spiritual discipline including ethical principles, meditation, breath control, and philosophy aimed at union with the Divine. Physical yoga (asana) is just one of eight limbs described by sage Patanjali.',
    'practices'
  );

-- BUDDHISM
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Buddhism'),
    'Buddhists worship Buddha as a god',
    'Buddha (Siddhartha Gautama) was a human teacher who achieved enlightenment. Buddhists don''t worship him as a deity but honor him as a guide who showed the path to liberation. Buddhism is non-theistic - it doesn''t center on belief in a creator god.',
    'beliefs'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Buddhism'),
    'Buddhism teaches you should never feel anything',
    'Buddhism teaches mindful awareness of all feelings, not suppression. The goal is to neither cling to pleasant experiences nor push away unpleasant ones. Through mindfulness, we observe emotions without being controlled by them, finding freedom and peace.',
    'practices'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Buddhism'),
    'Buddhists must be vegetarian',
    'While many Buddhists choose vegetarianism out of compassion, it''s not universally required. Different Buddhist traditions have varying views. The emphasis is on intention and minimizing harm. Historical Buddha ate what was offered, including meat in some cases.',
    'practices'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Buddhism'),
    'Buddhism is passive and escapist',
    'Buddhism teaches engaged compassion and active effort to reduce suffering. Many Buddhists work actively for social justice, peace, and environmental protection. The Dalai Lama and Thich Nhat Hanh exemplify engaged Buddhism that addresses real-world suffering.',
    'general'
  );

-- SIKHISM
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Sikhism'),
    'All Sikh men are named Singh and women Kaur',
    'Singh (lion) and Kaur (princess) are spiritual surnames adopted to reject caste discrimination and affirm equality. While common, they''re not mandatory. They represent the Sikh ideal of spiritual sovereignty and equality before God.',
    'practices'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Sikhism'),
    'Sikhs carry weapons because they''re violent',
    'The kirpan (ceremonial sword) symbolizes dignity, self-respect, and the duty to protect the defenseless. Sikhs are committed to defending the oppressed and standing against injustice. The kirpan represents moral courage and responsibility, not aggression.',
    'practices'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Sikhism'),
    'Sikhism is just a mix of Hinduism and Islam',
    'Sikhism is a distinct revelation with its own scripture (Guru Granth Sahib), theology, and practices. While it emerged in a context with Hindu and Muslim influences, Guru Nanak brought a unique message emphasizing one God, equality, service, and rejection of empty rituals.',
    'history'
  );

-- JAINISM
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Jainism'),
    'Jains are extreme and impractical',
    'While Jain commitment to non-violence is uncompromising, it reflects deep ethical consistency. Jain principles have influenced environmental ethics, animal rights, and peaceful living. Jain practitioners include successful professionals who apply ahimsa (non-violence) pragmatically.',
    'practices'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Jainism'),
    'Jains don''t contribute to society because they avoid certain professions',
    'Jains avoid professions involving harm to life, but they''re prominent in business, education, medicine, law, and philanthropy. Jain communities are known for generous charitable work, building hospitals, schools, and animal shelters.',
    'general'
  );

-- BAHÁ''Í FAITH
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Bahá''í Faith'),
    'Bahá''ís think all religions are exactly the same',
    'Bahá''ís believe all major religions come from the same divine source but were revealed at different times for different contexts. Each brought new teachings appropriate to humanity''s evolving capacity. They honor unique contributions while recognizing underlying unity.',
    'beliefs'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Bahá''í Faith'),
    'Bahá''í Faith is a cult',
    'The Bahá''í Faith has over 5 million followers worldwide, operates democratically without clergy, emphasizes education and reason, and has been recognized by the UN. It teaches independent investigation of truth and doesn''t use manipulation or coercion.',
    'general'
  );

-- INDIGENOUS TRADITIONS
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Indigenous Spirituality'),
    'Indigenous spirituality is primitive paganism',
    'Indigenous traditions embody sophisticated ecological knowledge, complex philosophical systems, and profound spiritual wisdom developed over millennia. They offer insights into sustainable living, community, and relationship with nature that modern society desperately needs.',
    'general'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Native American Spirituality'),
    'All Native American tribes have the same beliefs',
    'There are hundreds of distinct Native American nations, each with unique languages, cultures, and spiritual traditions. While some themes recur (respect for nature, ancestral reverence), the diversity is immense and each tradition deserves recognition on its own terms.',
    'culture'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'African Traditional Religions'),
    'African traditional religions involve witchcraft and black magic',
    'African spiritual traditions are sophisticated systems honoring ancestors, maintaining cosmic balance, and connecting with the divine. Western terms like "witchcraft" often misrepresent healing practices, divination, and spiritual leadership that serve communities positively.',
    'general'
  );

-- EASTERN TRADITIONS
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Taoism'),
    'Taoism teaches doing nothing',
    'Wu wei (non-action) doesn''t mean doing nothing - it means acting in harmony with the natural flow rather than forcing. It''s about effortless action, working with circumstances rather than against them. This produces more effective, sustainable results.',
    'beliefs'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Confucianism'),
    'Confucianism is outdated authoritarianism',
    'Confucianism emphasizes reciprocal relationships, moral leadership, and social harmony. True Confucian governance requires rulers to be virtuous and serve the people. It balances individual cultivation with social responsibility, offering insights for modern ethics.',
    'general'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Shinto'),
    'Shinto caused Japanese militarism',
    'State Shinto was a modern political construction that manipulated traditional beliefs for nationalist purposes. Traditional Shinto is a peaceful nature-based spirituality emphasizing gratitude, purity, and harmony. Post-WWII, Shinto returned to its spiritual roots.',
    'history'
  );

-- MODERN TRADITIONS
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Wicca'),
    'Wiccans cast evil spells on people',
    'The Wiccan Rede states "An it harm none, do what ye will" - meaning Wiccans are ethically bound not to harm others. Wiccan practice focuses on nature reverence, personal growth, and positive intention. "Magic" refers to focused intention and natural energy work.',
    'practices'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Rastafari'),
    'Rastafari is not a real religion',
    'Rastafari is a genuine Abrahamic faith with deep theological roots, sacred texts, moral principles, and millions of adherents. It emerged from African resistance to oppression and offers a unique perspective on spirituality, identity, and liberation.',
    'general'
  );

-- ANCIENT TRADITIONS
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Zoroastrianism'),
    'Zoroastrianism is dualistic with two equal gods',
    'Zoroastrianism is monotheistic with one supreme God (Ahura Mazda). The conflict between good and evil is not between equal deities but between God and destructive forces. Good ultimately triumphs. This influenced later monotheistic concepts of good vs evil.',
    'beliefs'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Yazidism'),
    'Yazidis are devil worshippers',
    'This dangerous misconception has led to persecution and genocide. Yazidis worship one God and honor the Peacock Angel (Melek Taus) as God''s chief angel, not as Satan. This reflects fundamental misunderstanding of Yazidi theology and has caused immense suffering.',
    'beliefs'
  );
