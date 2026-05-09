/*
  # Populate Interfaith Similarities Data
  
  1. Similarity Themes
    - Golden Rule (treat others as you wish to be treated)
    - Compassion & Mercy
    - Prayer & Meditation
    - Charity & Service
    - Love & Unity
    - Justice & Righteousness
    - Humility & Wisdom
    - Sacred Hospitality
  
  2. Teachings
    - Add representative teachings from major traditions for each theme
    - Include scriptural sources and context
*/

-- Insert Similarity Themes
INSERT INTO similarity_themes (title, description, icon, slug, order_index) VALUES
  (
    'The Golden Rule',
    'Nearly every faith tradition teaches some form of the Golden Rule: treat others as you would wish to be treated. This universal ethic forms the foundation of compassionate living.',
    'Heart',
    'golden-rule',
    1
  ),
  (
    'Compassion & Mercy',
    'Compassion for all beings and mercy toward those who struggle are central values across world religions, calling us to respond to suffering with kindness.',
    'HeartHandshake',
    'compassion-mercy',
    2
  ),
  (
    'Prayer & Meditation',
    'All major faiths practice forms of prayer, meditation, or contemplation to connect with the Divine, cultivate inner peace, and align with sacred purpose.',
    'Sparkles',
    'prayer-meditation',
    3
  ),
  (
    'Charity & Service',
    'Serving others and giving to those in need are universal religious obligations, reflecting our interconnection and shared humanity.',
    'HandHeart',
    'charity-service',
    4
  ),
  (
    'Love & Unity',
    'Love as the highest spiritual principle and recognition of fundamental human unity transcend religious boundaries.',
    'Users',
    'love-unity',
    5
  ),
  (
    'Justice & Righteousness',
    'Standing for justice, defending the oppressed, and living righteously are commanded across traditions.',
    'Scale',
    'justice-righteousness',
    6
  ),
  (
    'Humility & Wisdom',
    'Cultivating humility before the Divine and seeking wisdom over mere knowledge are universal spiritual values.',
    'BookOpen',
    'humility-wisdom',
    7
  ),
  (
    'Sacred Hospitality',
    'Welcoming strangers and showing generous hospitality reflect divine grace and human dignity in many traditions.',
    'Home',
    'sacred-hospitality',
    8
  );

-- THE GOLDEN RULE - Insert teachings
INSERT INTO similarity_teachings (theme_id, tradition_id, teaching, source, context) VALUES
  (
    (SELECT id FROM similarity_themes WHERE slug = 'golden-rule'),
    (SELECT id FROM traditions WHERE name = 'Christianity'),
    'Do to others as you would have them do to you.',
    'Luke 6:31 (Bible)',
    'Jesus teaches this as the essence of the Law and the Prophets, summarizing ethical living in one principle.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'golden-rule'),
    (SELECT id FROM traditions WHERE name = 'Islam'),
    'None of you truly believes until he loves for his brother what he loves for himself.',
    'Hadith 13, An-Nawawi''s Forty Hadith',
    'Prophet Muhammad establishes empathy and concern for others as essential to faith.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'golden-rule'),
    (SELECT id FROM traditions WHERE name = 'Judaism'),
    'What is hateful to you, do not do to your neighbor. This is the whole Torah; the rest is commentary.',
    'Talmud, Shabbat 31a',
    'Rabbi Hillel summarizes the entire Jewish law in this negative formulation of reciprocity.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'golden-rule'),
    (SELECT id FROM traditions WHERE name = 'Hinduism'),
    'One should never do something to others that one would regard as an injury to one''s own self. In brief, this is dharma. Anything else is succumbing to desire.',
    'Mahabharata 13.114.8',
    'This teaching connects ethical reciprocity to dharma (righteous duty) and self-mastery.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'golden-rule'),
    (SELECT id FROM traditions WHERE name = 'Buddhism'),
    'Hurt not others in ways that you yourself would find hurtful.',
    'Udana-Varga 5:18',
    'Buddha teaches this as part of right conduct, emphasizing the elimination of harm.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'golden-rule'),
    (SELECT id FROM traditions WHERE name = 'Confucianism'),
    'Do not impose on others what you yourself do not desire.',
    'Analects 15:23',
    'Confucius identifies reciprocity (shu) as a fundamental principle for harmonious living.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'golden-rule'),
    (SELECT id FROM traditions WHERE name = 'Sikhism'),
    'I am a stranger to no one; and no one is a stranger to me. Indeed, I am a friend to all.',
    'Guru Granth Sahib, pg. 1299',
    'Guru Nanak teaches universal kinship, seeing all people as equals deserving respect.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'golden-rule'),
    (SELECT id FROM traditions WHERE name = 'Jainism'),
    'One should treat all beings as one would like to be treated.',
    'Sutrakritanga 1.11.33',
    'This principle extends to all living beings, reflecting Jainism''s profound commitment to ahimsa.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'golden-rule'),
    (SELECT id FROM traditions WHERE name = 'Taoism'),
    'Regard your neighbor''s gain as your own gain, and your neighbor''s loss as your own loss.',
    'T''ai Shang Kan Ying P''ien',
    'Taoist teaching emphasizes empathic identification with others'' fortunes.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'golden-rule'),
    (SELECT id FROM traditions WHERE name = 'Zoroastrianism'),
    'Do not do unto others whatever is injurious to yourself.',
    'Shayast-na-Shayast 13:29',
    'This ancient teaching predates many formulations and connects to Zoroastrian ethics of truth and righteousness.'
  );

-- COMPASSION & MERCY
INSERT INTO similarity_teachings (theme_id, tradition_id, teaching, source, context) VALUES
  (
    (SELECT id FROM similarity_themes WHERE slug = 'compassion-mercy'),
    (SELECT id FROM traditions WHERE name = 'Islam'),
    'In the name of Allah, the Most Compassionate, the Most Merciful.',
    'Opening of every Quranic chapter',
    'These divine attributes begin every chapter of the Quran, emphasizing that mercy and compassion define God''s nature.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'compassion-mercy'),
    (SELECT id FROM traditions WHERE name = 'Buddhism'),
    'May all beings be happy. May all beings be free from suffering.',
    'Metta Sutta (Loving-Kindness Discourse)',
    'The practice of metta (loving-kindness) extends compassion unconditionally to all sentient beings.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'compassion-mercy'),
    (SELECT id FROM traditions WHERE name = 'Christianity'),
    'Blessed are the merciful, for they will be shown mercy.',
    'Matthew 5:7 (Bible)',
    'Jesus teaches that showing mercy to others opens us to receive divine mercy.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'compassion-mercy'),
    (SELECT id FROM traditions WHERE name = 'Judaism'),
    'The Lord is gracious and merciful, slow to anger and abounding in steadfast love.',
    'Psalm 145:8',
    'God''s mercy and compassion are celebrated throughout Jewish scripture and prayer.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'compassion-mercy'),
    (SELECT id FROM traditions WHERE name = 'Hinduism'),
    'Compassion for all living beings is the highest dharma.',
    'Various Puranas',
    'Karuna (compassion) and ahimsa (non-violence) are foundational Hindu values.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'compassion-mercy'),
    (SELECT id FROM traditions WHERE name = 'Jainism'),
    'Compassion and right conduct are the foundation of Jain teaching.',
    'Tattvartha Sutra',
    'Jainism''s radical commitment to non-violence flows from profound compassion for all life.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'compassion-mercy'),
    (SELECT id FROM traditions WHERE name = 'Sikhism'),
    'Be merciful, so that you may receive mercy. In the realm of grace, the Divine is merciful.',
    'Guru Granth Sahib',
    'Sikh teaching emphasizes divine mercy and calls adherents to embody mercy toward all.'
  );

-- PRAYER & MEDITATION
INSERT INTO similarity_teachings (theme_id, tradition_id, teaching, source, context) VALUES
  (
    (SELECT id FROM similarity_themes WHERE slug = 'prayer-meditation'),
    (SELECT id FROM traditions WHERE name = 'Islam'),
    'Prayer is the pillar of religion and the key to Paradise.',
    'Hadith collections',
    'Muslims pray five times daily, orienting their entire day toward remembrance of Allah.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'prayer-meditation'),
    (SELECT id FROM traditions WHERE name = 'Christianity'),
    'Pray without ceasing.',
    '1 Thessalonians 5:17',
    'Christians are called to maintain continuous communion with God through prayer.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'prayer-meditation'),
    (SELECT id FROM traditions WHERE name = 'Judaism'),
    'Prayer should be recited three times daily.',
    'Talmud, Berakhot',
    'Jewish tradition structures the day around morning, afternoon, and evening prayers.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'prayer-meditation'),
    (SELECT id FROM traditions WHERE name = 'Buddhism'),
    'Meditation brings wisdom; lack of meditation leaves ignorance.',
    'Dhammapada',
    'Buddhist meditation practices cultivate mindfulness, concentration, and insight into reality.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'prayer-meditation'),
    (SELECT id FROM traditions WHERE name = 'Hinduism'),
    'Yoga is the journey of the self, through the self, to the self.',
    'Bhagavad Gita',
    'Hindu practices of meditation and yoga unite the individual soul with ultimate reality.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'prayer-meditation'),
    (SELECT id FROM traditions WHERE name = 'Sikhism'),
    'Meditate on the Name of the Lord, even for a moment; nothing else will go with you.',
    'Guru Granth Sahib',
    'Naam Simran (meditation on God''s name) is central to Sikh spiritual practice.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'prayer-meditation'),
    (SELECT id FROM traditions WHERE name = 'Bahá''í Faith'),
    'The obligatory prayers are binding and have been revealed in three forms.',
    'Kitáb-i-Aqdas',
    'Bahá''ís choose among three daily obligatory prayers, maintaining regular spiritual connection.'
  );

-- CHARITY & SERVICE
INSERT INTO similarity_teachings (theme_id, tradition_id, teaching, source, context) VALUES
  (
    (SELECT id FROM similarity_themes WHERE slug = 'charity-service'),
    (SELECT id FROM traditions WHERE name = 'Islam'),
    'Those who spend their wealth in charity day and night, secretly and openly - their reward is with their Lord.',
    'Quran 2:274',
    'Zakat (charity) is a pillar of Islam, requiring 2.5% of wealth given to those in need.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'charity-service'),
    (SELECT id FROM traditions WHERE name = 'Christianity'),
    'Truly I tell you, whatever you did for one of the least of these, you did for me.',
    'Matthew 25:40',
    'Jesus identifies himself with the poor and vulnerable, making service to them sacred duty.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'charity-service'),
    (SELECT id FROM traditions WHERE name = 'Judaism'),
    'Tzedakah (charity) is equal in importance to all other commandments combined.',
    'Talmud, Baba Batra 9a',
    'Giving to those in need is not optional kindness but religious obligation in Judaism.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'charity-service'),
    (SELECT id FROM traditions WHERE name = 'Sikhism'),
    'Those who have loved, have obtained the Lord. They do seva (selfless service) and practice compassion.',
    'Guru Granth Sahib',
    'Seva (selfless service) is a cornerstone of Sikh practice, exemplified by the langar (free kitchen).'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'charity-service'),
    (SELECT id FROM traditions WHERE name = 'Buddhism'),
    'Generosity brings happiness at every stage of its expression.',
    'Buddha''s teachings',
    'Dana (generosity) is the first of the Buddhist perfections, purifying the heart and supporting others.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'charity-service'),
    (SELECT id FROM traditions WHERE name = 'Hinduism'),
    'Charity given to a worthy person simply because it is right to give, without anything expected in return, is sattvic charity.',
    'Bhagavad Gita 17:20',
    'Selfless giving without expectation of reward is the highest form of charity.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'charity-service'),
    (SELECT id FROM traditions WHERE name = 'Bahá''í Faith'),
    'It is not for him to pride himself who loveth his own country, but rather for him who loveth the whole world.',
    'Bahá''u''lláh',
    'Bahá''ís are called to universal service and working for the betterment of humanity.'
  );

-- LOVE & UNITY
INSERT INTO similarity_teachings (theme_id, tradition_id, teaching, source, context) VALUES
  (
    (SELECT id FROM similarity_themes WHERE slug = 'love-unity'),
    (SELECT id FROM traditions WHERE name = 'Christianity'),
    'God is love, and whoever abides in love abides in God.',
    '1 John 4:16',
    'Love is understood as God''s essential nature and the defining mark of Christian life.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'love-unity'),
    (SELECT id FROM traditions WHERE name = 'Islam'),
    'O mankind, indeed We have created you from male and female and made you peoples and tribes that you may know one another.',
    'Quran 49:13',
    'Human diversity is divinely intended for mutual understanding and unity, not division.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'love-unity'),
    (SELECT id FROM traditions WHERE name = 'Judaism'),
    'Love your neighbor as yourself.',
    'Leviticus 19:18',
    'This commandment is considered foundational to Jewish ethics and spiritual life.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'love-unity'),
    (SELECT id FROM traditions WHERE name = 'Hinduism'),
    'The wise see that there is One Spirit within all beings.',
    'Bhagavad Gita',
    'Recognition of divine unity within all creation leads to universal love and compassion.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'love-unity'),
    (SELECT id FROM traditions WHERE name = 'Buddhism'),
    'Hatred is never appeased by hatred. Hatred is appeased by love alone.',
    'Dhammapada 1:5',
    'Buddha teaches that only love and compassion can truly overcome enmity and division.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'love-unity'),
    (SELECT id FROM traditions WHERE name = 'Bahá''í Faith'),
    'The earth is but one country, and mankind its citizens.',
    'Bahá''u''lláh',
    'Bahá''í Faith teaches the unity of humanity and works toward global peace and cooperation.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'love-unity'),
    (SELECT id FROM traditions WHERE name = 'Sikhism'),
    'Recognize the Divine Light within all, and do not ask about caste or social class.',
    'Guru Granth Sahib',
    'All humans are equal before God, united by divine presence regardless of worldly differences.'
  );

-- JUSTICE & RIGHTEOUSNESS
INSERT INTO similarity_teachings (theme_id, tradition_id, teaching, source, context) VALUES
  (
    (SELECT id FROM similarity_themes WHERE slug = 'justice-righteousness'),
    (SELECT id FROM traditions WHERE name = 'Judaism'),
    'Justice, justice shall you pursue.',
    'Deuteronomy 16:20',
    'The repetition emphasizes that both the ends and means of justice must be just.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'justice-righteousness'),
    (SELECT id FROM traditions WHERE name = 'Islam'),
    'O you who believe! Stand out firmly for justice, as witnesses to Allah, even if it be against yourselves.',
    'Quran 4:135',
    'Muslims are commanded to uphold justice even when it contradicts self-interest.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'justice-righteousness'),
    (SELECT id FROM traditions WHERE name = 'Christianity'),
    'He has shown you what is good. And what does the Lord require of you? To act justly, love mercy, and walk humbly with your God.',
    'Micah 6:8',
    'The prophet summarizes true religion as justice, mercy, and humble relationship with God.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'justice-righteousness'),
    (SELECT id FROM traditions WHERE name = 'Hinduism'),
    'Dharma protects those who protect it.',
    'Manusmriti',
    'Upholding dharma (righteousness/duty) creates cosmic and social order that sustains all.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'justice-righteousness'),
    (SELECT id FROM traditions WHERE name = 'Buddhism'),
    'A person who practices the Dharma is protected by the Dharma.',
    'Buddhist teaching',
    'Living according to righteous principles creates protection and well-being.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'justice-righteousness'),
    (SELECT id FROM traditions WHERE name = 'Sikhism'),
    'Where there is greed, sin, and vice, righteousness does not dwell there.',
    'Guru Granth Sahib',
    'Living righteously requires rejecting greed and corruption in favor of honest conduct.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'justice-righteousness'),
    (SELECT id FROM traditions WHERE name = 'Bahá''í Faith'),
    'The best beloved of all things in My sight is Justice.',
    'Bahá''u''lláh',
    'Justice is elevated as the supreme virtue and foundation for establishing peace.'
  );

-- HUMILITY & WISDOM
INSERT INTO similarity_teachings (theme_id, tradition_id, teaching, source, context) VALUES
  (
    (SELECT id FROM similarity_themes WHERE slug = 'humility-wisdom'),
    (SELECT id FROM traditions WHERE name = 'Christianity'),
    'God opposes the proud but shows favor to the humble.',
    'James 4:6',
    'Humility opens the heart to receive divine grace and wisdom.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'humility-wisdom'),
    (SELECT id FROM traditions WHERE name = 'Taoism'),
    'Those who know do not speak; those who speak do not know.',
    'Tao Te Ching, Chapter 56',
    'True wisdom recognizes the limits of words and the value of quiet understanding.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'humility-wisdom'),
    (SELECT id FROM traditions WHERE name = 'Confucianism'),
    'Real knowledge is to know the extent of one''s ignorance.',
    'Confucius, Analects',
    'Wisdom begins with humble recognition of how much we don''t know.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'humility-wisdom'),
    (SELECT id FROM traditions WHERE name = 'Islam'),
    'The servants of the Most Merciful are those who walk upon the earth in humility.',
    'Quran 25:63',
    'Humility in conduct reflects submission to God and respect for creation.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'humility-wisdom'),
    (SELECT id FROM traditions WHERE name = 'Buddhism'),
    'If you think you know everything, you have learned nothing.',
    'Buddhist teaching',
    'The beginner''s mind, free from arrogance, remains open to wisdom and insight.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'humility-wisdom'),
    (SELECT id FROM traditions WHERE name = 'Judaism'),
    'Who is wise? One who learns from every person.',
    'Pirkei Avot 4:1',
    'Humility to learn from all people, regardless of status, characterizes true wisdom.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'humility-wisdom'),
    (SELECT id FROM traditions WHERE name = 'Hinduism'),
    'Humility is the ornament of wisdom.',
    'Tirukkural',
    'True spiritual wisdom manifests in humble, egoless conduct.'
  );

-- SACRED HOSPITALITY
INSERT INTO similarity_teachings (theme_id, tradition_id, teaching, source, context) VALUES
  (
    (SELECT id FROM similarity_themes WHERE slug = 'sacred-hospitality'),
    (SELECT id FROM traditions WHERE name = 'Christianity'),
    'Do not forget to show hospitality to strangers, for by so doing some have shown hospitality to angels without knowing it.',
    'Hebrews 13:2',
    'Welcoming strangers may be encountering the divine in disguise.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'sacred-hospitality'),
    (SELECT id FROM traditions WHERE name = 'Islam'),
    'Whoever believes in Allah and the Last Day should honor his guest.',
    'Hadith',
    'Hospitality is a mark of true faith and reflects God''s generosity to humanity.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'sacred-hospitality'),
    (SELECT id FROM traditions WHERE name = 'Judaism'),
    'Hospitality to wayfarers is greater than welcoming the Divine Presence.',
    'Talmud, Shabbat 127a',
    'Abraham''s example of interrupting prayer to welcome strangers shows hospitality''s importance.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'sacred-hospitality'),
    (SELECT id FROM traditions WHERE name = 'Hinduism'),
    'The guest is God (Atithi Devo Bhava).',
    'Taittiriya Upanishad',
    'Treating guests with honor and care is treating the divine with reverence.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'sacred-hospitality'),
    (SELECT id FROM traditions WHERE name = 'Sikhism'),
    'The Guru''s Langar feeds all who come, regardless of caste, creed, or status.',
    'Sikh tradition',
    'The free community kitchen exemplifies radical hospitality and equality before God.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'sacred-hospitality'),
    (SELECT id FROM traditions WHERE name = 'Buddhism'),
    'Welcoming all beings with kindness opens the path to enlightenment.',
    'Buddhist teaching',
    'Generosity and hospitality purify the heart and express universal compassion.'
  ),
  (
    (SELECT id FROM similarity_themes WHERE slug = 'sacred-hospitality'),
    (SELECT id FROM traditions WHERE name = 'Native American Spirituality'),
    'All who enter are family; the stranger is sacred.',
    'Various tribal teachings',
    'Many Native traditions view hospitality as sacred duty, honoring the divine in each visitor.'
  );
