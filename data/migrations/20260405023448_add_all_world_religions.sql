/*
  # Expand to Include All Major World Religions

  1. New Traditions Added
    - Sikhism - Monotheistic faith emphasizing equality, service, and devotion
    - Jainism - Ancient tradition of non-violence and spiritual liberation
    - Baha'i Faith - Unity of all religions and humanity
    - Zoroastrianism - Ancient Persian monotheism emphasizing good thoughts, words, deeds
    - Taoism - Chinese philosophy of harmony with the natural way
    - Shinto - Japanese spiritual tradition honoring nature and ancestors
    - Indigenous Spirituality - Diverse earth-based traditions worldwide
    - Confucianism - Ethical and philosophical system emphasizing harmony and virtue
    - Unitarianism - Liberal faith tradition emphasizing individual spiritual journey
    - Druze - Monotheistic faith emphasizing wisdom and ethics
    - Yazidism - Ancient Kurdish faith tradition
    - Rastafari - Abrahamic faith emphasizing spiritual consciousness
    - Cao Dai - Vietnamese syncretic religion promoting universal peace
    - Tenrikyo - Japanese monotheistic faith emphasizing joyous life
    - Wicca - Modern pagan tradition honoring nature
    - African Traditional Religions - Diverse spiritual traditions across Africa
    - Native American Spirituality - Sacred traditions of indigenous peoples
    - Shamanism - Ancient spiritual practices connecting with spirit world

  2. Additional Teachings
    - Sacred wisdom from newly added traditions
    - Universal messages of peace, love, and compassion

  3. Misconceptions
    - Common misunderstandings about each tradition
    - Educational truths to promote understanding
*/

-- Insert additional world religions
INSERT INTO traditions (name, description, core_values) VALUES
  ('Sikhism', 'Monotheistic faith founded in Punjab emphasizing equality, selfless service, and devotion to one God', ARRAY['Equality', 'Service', 'Justice', 'Honest Living', 'Remembrance of God']),
  ('Jainism', 'Ancient Indian tradition emphasizing non-violence, truth, and spiritual liberation through right conduct', ARRAY['Non-violence', 'Truth', 'Non-attachment', 'Self-discipline', 'Compassion']),
  ('Bahá''í Faith', 'Universal faith emphasizing the unity of all religions, progressive revelation, and the oneness of humanity', ARRAY['Unity', 'Justice', 'Equality', 'Education', 'Peace']),
  ('Zoroastrianism', 'Ancient Persian monotheistic religion emphasizing the eternal battle between good and evil', ARRAY['Good Thoughts', 'Good Words', 'Good Deeds', 'Truth', 'Righteousness']),
  ('Taoism', 'Chinese philosophical and spiritual tradition emphasizing living in harmony with the Tao (the Way)', ARRAY['Harmony', 'Simplicity', 'Compassion', 'Balance', 'Natural Order']),
  ('Shinto', 'Indigenous spirituality of Japan honoring kami (spirits) in nature and ancestors', ARRAY['Purity', 'Harmony', 'Respect for Nature', 'Gratitude', 'Community']),
  ('Indigenous Spirituality', 'Diverse earth-based spiritual traditions of indigenous peoples worldwide', ARRAY['Connection to Earth', 'Ancestral Wisdom', 'Community', 'Sacred Reciprocity', 'Harmony']),
  ('Confucianism', 'Chinese ethical and philosophical system emphasizing moral cultivation and social harmony', ARRAY['Benevolence', 'Righteousness', 'Propriety', 'Wisdom', 'Filial Piety']),
  ('Unitarian Universalism', 'Liberal faith tradition affirming the worth of every person and individual spiritual journey', ARRAY['Justice', 'Compassion', 'Freedom', 'Respect', 'Democratic Process']),
  ('Druze', 'Monotheistic faith tradition emphasizing wisdom, truthfulness, and ethical living', ARRAY['Truth', 'Loyalty', 'Wisdom', 'Solidarity', 'Service']),
  ('Yazidism', 'Ancient Kurdish monotheistic faith honoring one God and the Peacock Angel', ARRAY['Peace', 'Purity', 'Respect', 'Tradition', 'Community']),
  ('Rastafari', 'Abrahamic faith movement emphasizing African spirituality and consciousness', ARRAY['Unity', 'Love', 'Truth', 'Natural Living', 'Justice']),
  ('Cao Dai', 'Vietnamese syncretic religion uniting world religions and promoting universal peace', ARRAY['Peace', 'Unity', 'Love', 'Compassion', 'Universal Truth']),
  ('Tenrikyo', 'Japanese monotheistic faith teaching the joyous life through service and gratitude', ARRAY['Joy', 'Gratitude', 'Service', 'Harmony', 'Spiritual Growth']),
  ('Wicca', 'Modern pagan tradition honoring the divine in nature and promoting harm to none', ARRAY['Harm None', 'Nature Connection', 'Balance', 'Personal Responsibility', 'Reverence']),
  ('African Traditional Religions', 'Diverse indigenous spiritual systems across Africa honoring ancestors and spirits', ARRAY['Ancestral Reverence', 'Community', 'Balance', 'Wisdom', 'Sacred Rituals']),
  ('Native American Spirituality', 'Sacred traditions of indigenous peoples of the Americas honoring Great Spirit and Earth', ARRAY['Respect for Earth', 'Sacred Balance', 'Wisdom', 'Community', 'Stewardship']),
  ('Shamanism', 'Ancient spiritual practice connecting with spirit world for healing and guidance', ARRAY['Healing', 'Connection', 'Balance', 'Wisdom', 'Respect for Spirits']);

-- Insert teachings from newly added traditions
INSERT INTO teachings (title, content, source, tradition_id, category) VALUES
  (
    'The Unity of All',
    'The earth is but one country, and mankind its citizens. The purpose of religion is to unite all hearts, not to create division.',
    'Bahá''u''lláh',
    (SELECT id FROM traditions WHERE name = 'Bahá''í Faith'),
    'unity'
  ),
  (
    'Supreme Non-Violence',
    'All breathing, existing, living beings should not be slain, nor treated with violence, nor abused, nor tormented, nor driven away. This is the pure unchangeable eternal law.',
    'Jain Scripture - Acharanga Sutra',
    (SELECT id FROM traditions WHERE name = 'Jainism'),
    'compassion'
  ),
  (
    'Service to Humanity',
    'They who have love for the Lord, have love for all mankind. Recognize the whole human race as one. No one is high, no one is low.',
    'Guru Granth Sahib',
    (SELECT id FROM traditions WHERE name = 'Sikhism'),
    'love'
  ),
  (
    'Good Thoughts, Words, Deeds',
    'He who sows the ground with care and diligence acquires merit. He who cultivates good thoughts, good words, and good deeds reaps righteousness.',
    'Zoroastrian Teaching',
    (SELECT id FROM traditions WHERE name = 'Zoroastrianism'),
    'peace'
  ),
  (
    'The Gentle Way',
    'Kindness in words creates confidence. Kindness in thinking creates profoundness. Kindness in giving creates love.',
    'Tao Te Ching',
    (SELECT id FROM traditions WHERE name = 'Taoism'),
    'compassion'
  ),
  (
    'Harmony with All',
    'When you do something, you should burn yourself completely, like a good bonfire, leaving no trace of yourself. Live in harmony with all people and nature.',
    'Shinto Teaching',
    (SELECT id FROM traditions WHERE name = 'Shinto'),
    'peace'
  ),
  (
    'We Are All Related',
    'All things are connected. Whatever befalls the Earth befalls the children of the Earth. We are all related - all beings, all nations.',
    'Native American Wisdom',
    (SELECT id FROM traditions WHERE name = 'Native American Spirituality'),
    'unity'
  ),
  (
    'Cultivate Benevolence',
    'The benevolent person, wishing to establish themselves, also establishes others. Wishing to be successful, they help others to be successful.',
    'Confucius',
    (SELECT id FROM traditions WHERE name = 'Confucianism'),
    'compassion'
  ),
  (
    'One Love',
    'The power of love can overcome all evil. Through righteousness and love, we find truth and unity with the Divine.',
    'Rastafari Teaching',
    (SELECT id FROM traditions WHERE name = 'Rastafari'),
    'love'
  ),
  (
    'The Joyous Life',
    'God desires that all people live the Joyous Life. Through mutual help and service to others, we manifest divine intention.',
    'Tenrikyo Scripture',
    (SELECT id FROM traditions WHERE name = 'Tenrikyo'),
    'peace'
  );

-- Insert misconceptions for new traditions
INSERT INTO misconceptions (tradition_id, misconception, truth) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Sikhism'),
    'Sikhs are Muslims or Hindus',
    'Sikhism is a distinct monotheistic religion founded by Guru Nanak in the 15th century. While it emerged in a context influenced by Hinduism and Islam, it has its own unique scripture (Guru Granth Sahib), practices, and theology emphasizing one God and equality.'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Jainism'),
    'Jains worship multiple gods',
    'Jainism does not worship gods in the traditional sense. Jains revere the Tirthankaras (spiritual teachers who achieved liberation) as role models, but the focus is on individual spiritual development through non-violence, truth, and self-discipline.'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Bahá''í Faith'),
    'Bahá''í Faith is just mixing all religions together',
    'The Bahá''í Faith teaches progressive revelation - that all major religions come from the same divine source and are chapters in humanity''s spiritual evolution. It has its own distinct revelation, teachings, and administrative structure while honoring all faiths.'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Zoroastrianism'),
    'Zoroastrianism is extinct or irrelevant',
    'Zoroastrianism is one of the world''s oldest monotheistic religions and continues to be practiced today, particularly by Parsi communities. Its concepts of good vs. evil, free will, and ethical living influenced Judaism, Christianity, and Islam.'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Taoism'),
    'Taoism is just philosophy, not religion',
    'Taoism encompasses both philosophical and religious dimensions. While philosophical Taoism focuses on living in harmony with the Tao, religious Taoism includes spiritual practices, rituals, and reverence for the divine. Both aspects offer profound wisdom.'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Shinto'),
    'Shinto is primitive nature worship',
    'Shinto is a sophisticated spiritual tradition recognizing the sacred in all of nature and life. It emphasizes gratitude, purity, and harmony with the natural and social world. This reverence for nature reflects profound ecological wisdom.'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Indigenous Spirituality'),
    'Indigenous spirituality is superstition',
    'Indigenous spiritual traditions embody sophisticated ecological knowledge, ethical systems, and deep wisdom developed over millennia. They offer profound insights into living in balance with nature and community.'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Wicca'),
    'Wicca involves devil worship',
    'Wicca does not believe in or worship the devil - that concept comes from Christianity. Wiccans honor the divine in nature, follow the Wiccan Rede ("harm none"), and practice nature-based spirituality emphasizing balance and personal responsibility.'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Rastafari'),
    'Rastafari is just about marijuana',
    'Rastafari is a genuine spiritual movement emphasizing African consciousness, social justice, natural living, and connection to the divine. While sacramental cannabis use is part of some practices, the faith centers on righteousness, truth, and spiritual consciousness.'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'African Traditional Religions'),
    'African religions are all the same',
    'African traditional religions are incredibly diverse, with each ethnic group and region having distinct beliefs, practices, and spiritual systems. They share some common themes like ancestral reverence and community, but represent rich theological diversity.'
  );
