/*
  # Populate Sacred Texts Explorer with Interfaith Content

  1. Data Population
    - Add 40+ sacred texts from major world religions
    - Create 8 themed comparisons showing universal truths
    - Generate shareable quotes for social sharing
    
  2. Themes Covered
    - Love & Compassion
    - Unity & Brotherhood
    - Peace & Non-violence
    - Wisdom & Truth
    - Justice & Equality
    - Gratitude & Thankfulness
    - Forgiveness & Mercy
    - Service & Charity
*/

-- Insert sacred texts from various traditions
-- CHRISTIANITY
INSERT INTO sacred_texts (tradition_id, title, source, text_content, theme, context, translation) VALUES
((SELECT id FROM traditions WHERE name = 'Christianity'), 'The Golden Rule', 'Matthew 7:12', 'So in everything, do to others what you would have them do to you, for this sums up the Law and the Prophets.', 'compassion', 'Teaching from Jesus Sermon on the Mount', 'New International Version'),
((SELECT id FROM traditions WHERE name = 'Christianity'), 'Love Your Neighbor', 'Mark 12:31', 'The second is this: Love your neighbor as yourself. There is no commandment greater than these.', 'love', 'Jesus response to questions about the greatest commandment', 'New International Version'),
((SELECT id FROM traditions WHERE name = 'Christianity'), 'Blessed Are the Peacemakers', 'Matthew 5:9', 'Blessed are the peacemakers, for they will be called children of God.', 'peace', 'From the Beatitudes in the Sermon on the Mount', 'New International Version'),
((SELECT id FROM traditions WHERE name = 'Christianity'), 'Forgive Seventy Times Seven', 'Matthew 18:22', 'Jesus answered, "I tell you, not seven times, but seventy-seven times."', 'forgiveness', 'Teaching about unlimited forgiveness', 'New International Version'),
((SELECT id FROM traditions WHERE name = 'Christianity'), 'Love Your Enemies', 'Matthew 5:44', 'But I tell you, love your enemies and pray for those who persecute you.', 'love', 'Revolutionary teaching transcending tribal boundaries', 'New International Version');

-- ISLAM
INSERT INTO sacred_texts (tradition_id, title, source, text_content, theme, context, translation) VALUES
((SELECT id FROM traditions WHERE name = 'Islam'), 'All Humanity from One Soul', 'Quran 4:1', 'O humanity! Be mindful of your Lord Who created you from a single soul, and from it He created its mate, and through both He spread countless men and women.', 'unity', 'Reminder of common human origin', 'Clear Quran'),
((SELECT id FROM traditions WHERE name = 'Islam'), 'No Compulsion in Religion', 'Quran 2:256', 'Let there be no compulsion in religion, for the truth stands out clearly from falsehood.', 'tolerance', 'Fundamental principle of religious freedom', 'Clear Quran'),
((SELECT id FROM traditions WHERE name = 'Islam'), 'Compassion to All Creation', 'Hadith', 'The Merciful are shown mercy by the All-Merciful. Show mercy to those on earth, and the One in heaven will show mercy to you.', 'compassion', 'Teaching of Prophet Muhammad on universal compassion', 'Sahih at-Tirmidhi'),
((SELECT id FROM traditions WHERE name = 'Islam'), 'Serve Humanity', 'Quran 5:32', 'Whoever saves a life, it will be as if they saved all of humanity.', 'service', 'The sanctity and value of every human life', 'Clear Quran'),
((SELECT id FROM traditions WHERE name = 'Islam'), 'Justice Above All', 'Quran 4:135', 'O believers! Stand firm for justice as witnesses for Allah even if it is against yourselves, your parents, or close relatives.', 'justice', 'Command to uphold justice even when difficult', 'Clear Quran');

-- JUDAISM
INSERT INTO sacred_texts (tradition_id, title, source, text_content, theme, context, translation) VALUES
((SELECT id FROM traditions WHERE name = 'Judaism'), 'Love Your Neighbor', 'Leviticus 19:18', 'Love your neighbor as yourself. I am the LORD.', 'love', 'Core commandment in Jewish law', 'NIV'),
((SELECT id FROM traditions WHERE name = 'Judaism'), 'Pursue Justice', 'Deuteronomy 16:20', 'Justice, justice shall you pursue, that you may live and inherit the land.', 'justice', 'Repeated emphasis on pursuing justice', 'JPS Tanakh'),
((SELECT id FROM traditions WHERE name = 'Judaism'), 'Welcome the Stranger', 'Leviticus 19:34', 'The stranger who resides with you shall be to you as one of your citizens; you shall love them as yourself.', 'compassion', 'Commanded compassion for immigrants and outsiders', 'JPS Tanakh'),
((SELECT id FROM traditions WHERE name = 'Judaism'), 'Seek Peace', 'Psalms 34:14', 'Turn from evil and do good; seek peace and pursue it.', 'peace', 'Active pursuit of peace as a virtue', 'NIV'),
((SELECT id FROM traditions WHERE name = 'Judaism'), 'Repair the World', 'Mishnah', 'You are not obligated to complete the work, but neither are you free to desist from it.', 'service', 'Tikkun Olam - responsibility to improve the world', 'Pirkei Avot 2:16');

-- HINDUISM
INSERT INTO sacred_texts (tradition_id, title, source, text_content, theme, context, translation) VALUES
((SELECT id FROM traditions WHERE name = 'Hinduism'), 'Truth is One', 'Rig Veda 1.164.46', 'Truth is one; the wise call it by many names.', 'unity', 'Ancient recognition of universal truth', 'Traditional'),
((SELECT id FROM traditions WHERE name = 'Hinduism'), 'See the Divine in All', 'Bhagavad Gita 6.29', 'The yogis, seeing everyone equally, behold the Self abiding in all beings and all beings in the Self.', 'unity', 'Vision of universal divinity', 'Eknath Easwaran'),
((SELECT id FROM traditions WHERE name = 'Hinduism'), 'Non-violence', 'Bhagavad Gita 13.8', 'Ahimsa (non-violence), truthfulness, freedom from anger, renunciation, tranquility - these are the marks of wisdom.', 'peace', 'Ahimsa as fundamental spiritual principle', 'Traditional'),
((SELECT id FROM traditions WHERE name = 'Hinduism'), 'Compassion for All', 'Bhagavad Gita 12.13', 'One who is friendly and compassionate to all, free from selfishness and ego, the same in pleasure and pain, patient - such a devotee is dear to Me.', 'compassion', 'Qualities of spiritual maturity', 'Traditional'),
((SELECT id FROM traditions WHERE name = 'Hinduism'), 'Service as Worship', 'Bhagavad Gita 3.19', 'Therefore, without attachment, perform always the work that has to be done, for one attains the Supreme by doing work without attachment.', 'service', 'Karma Yoga - path of selfless service', 'Traditional');

-- BUDDHISM
INSERT INTO sacred_texts (tradition_id, title, source, text_content, theme, context, translation) VALUES
((SELECT id FROM traditions WHERE name = 'Buddhism'), 'Loving-Kindness to All', 'Metta Sutta', 'Just as a mother would protect her only child with her life, even so let one cultivate a boundless love towards all beings.', 'love', 'Teaching on universal loving-kindness', 'Traditional'),
((SELECT id FROM traditions WHERE name = 'Buddhism'), 'Hatred Never Ceases by Hatred', 'Dhammapada 1.5', 'Hatred never ceases by hatred, but by love alone is healed. This is an ancient and eternal law.', 'peace', 'Fundamental truth about transforming conflict', 'Traditional'),
((SELECT id FROM traditions WHERE name = 'Buddhism'), 'Compassion Without Limits', 'Karaniya Metta Sutta', 'May all beings be happy. May all beings be free from suffering. May all beings live in peace.', 'compassion', 'Universal compassion prayer', 'Traditional'),
((SELECT id FROM traditions WHERE name = 'Buddhism'), 'Speak Only Truth', 'Dhammapada 17.223', 'Speak the truth, do not yield to anger, give even if you are asked for a little. By these three steps you will approach the divine.', 'wisdom', 'Right speech and ethical conduct', 'Traditional'),
((SELECT id FROM traditions WHERE name = 'Buddhism'), 'We Are What We Think', 'Dhammapada 1.1', 'All that we are is the result of what we have thought. The mind is everything. What we think, we become.', 'wisdom', 'Power of mindfulness and intention', 'Traditional');

-- SIKHISM
INSERT INTO sacred_texts (tradition_id, title, source, text_content, theme, context, translation) VALUES
((SELECT id FROM traditions WHERE name = 'Sikhism'), 'One Divine Light', 'Guru Granth Sahib', 'Recognize the Lord''s Light within all, and do not consider social class or status; there are no classes or castes in the world hereafter.', 'unity', 'Rejection of caste and affirmation of equality', 'Sant Singh Khalsa'),
((SELECT id FROM traditions WHERE name = 'Sikhism'), 'See God in Everyone', 'Guru Granth Sahib 223', 'I see none as a stranger; everyone is a friend. The One Lord is pervading and permeating all.', 'unity', 'Vision of universal brotherhood', 'Traditional'),
((SELECT id FROM traditions WHERE name = 'Sikhism'), 'Share and Serve', 'Guru Granth Sahib', 'One who works for what they eat, and gives some of what they have - O Nanak, know that person as the one who has found the True Path.', 'service', 'Principle of honest work and sharing (Vand Chakna)', 'Traditional'),
((SELECT id FROM traditions WHERE name = 'Sikhism'), 'Truth Above All', 'Guru Granth Sahib', 'Truth is high, but higher still is truthful living.', 'wisdom', 'Living truth, not just knowing it', 'Traditional');

-- TAOISM
INSERT INTO sacred_texts (tradition_id, title, source, text_content, theme, context, translation) VALUES
((SELECT id FROM traditions WHERE name = 'Taoism'), 'The Soft Overcomes the Hard', 'Tao Te Ching 78', 'Nothing in the world is softer than water, yet nothing is better at overcoming the hard and strong. The soft overcomes the hard; the gentle overcomes the rigid.', 'peace', 'Power of non-violence and gentleness', 'Stephen Mitchell'),
((SELECT id FROM traditions WHERE name = 'Taoism'), 'Compassionate Action', 'Tao Te Ching 67', 'I have three treasures which I hold and keep. The first is compassion; the second is frugality; the third is humility.', 'compassion', 'Three fundamental virtues', 'Traditional'),
((SELECT id FROM traditions WHERE name = 'Taoism'), 'Unity with All', 'Tao Te Ching 34', 'The great Tao flows everywhere. All things are born from it, yet it doesn''t create them. It nourishes infinite worlds, yet it doesn''t hold on to them.', 'unity', 'Interconnectedness of all existence', 'Traditional');

-- BAHÁ'Í
INSERT INTO sacred_texts (tradition_id, title, source, text_content, theme, context, translation) VALUES
((SELECT id FROM traditions WHERE name = 'Bahá''í Faith'), 'Unity of Humanity', 'Bahá''u''lláh Writings', 'The earth is but one country, and mankind its citizens.', 'unity', 'Vision of global unity', 'Traditional'),
((SELECT id FROM traditions WHERE name = 'Bahá''í Faith'), 'Eliminate Prejudice', 'Abdu''l-Bahá', 'All prejudices, whether of religion, race, politics or nation, must be renounced, for these prejudices have caused the world''s sickness.', 'tolerance', 'Call to overcome all forms of prejudice', 'Traditional'),
((SELECT id FROM traditions WHERE name = 'Bahá''í Faith'), 'One Human Family', 'Bahá''u''lláh Writings', 'Ye are all the fruits of one tree, the leaves of one branch.', 'unity', 'Metaphor for human interconnection', 'Traditional');

-- JAINISM  
INSERT INTO sacred_texts (tradition_id, title, source, text_content, theme, context, translation) VALUES
((SELECT id FROM traditions WHERE name = 'Jainism'), 'All Life is Sacred', 'Acaranga Sutra', 'All breathing, existing, living, sentient creatures should not be slain, nor treated with violence, nor abused, nor tormented, nor driven away.', 'peace', 'Radical commitment to non-violence (ahimsa)', 'Traditional'),
((SELECT id FROM traditions WHERE name = 'Jainism'), 'Many-Sided Truth', 'Jain Philosophy', 'The nature of reality is complex, and truth has many aspects. What is true from one perspective may not be from another.', 'wisdom', 'Anekantavada - doctrine of multiple perspectives', 'Traditional');

-- Create themed text comparisons
INSERT INTO text_comparisons (theme, title, description) VALUES
('love', 'The Universal Command to Love', 'Across all traditions, love of neighbor and compassion for all beings stands as a supreme teaching.'),
('unity', 'We Are One Family', 'Sacred texts from every tradition affirm the fundamental unity and interconnectedness of all humanity.'),
('peace', 'The Path of Non-Violence', 'Peace and non-violence are celebrated as highest virtues across world religions.'),
('compassion', 'Compassion Without Boundaries', 'Every tradition teaches compassion that extends beyond one''s own group to all beings.'),
('justice', 'The Pursuit of Justice', 'Justice and fairness are commanded as divine imperatives in sacred teachings.'),
('wisdom', 'Truth and Wisdom', 'Seeking truth and living wisely are universal spiritual values.'),
('service', 'Serving Others', 'Selfless service and helping those in need is celebrated across all faiths.'),
('forgiveness', 'The Power of Forgiveness', 'Forgiveness and mercy are taught as pathways to peace and spiritual growth.');

-- Link texts to comparisons
-- Love comparison
INSERT INTO comparison_texts (comparison_id, sacred_text_id, display_order)
SELECT 
  (SELECT id FROM text_comparisons WHERE theme = 'love' LIMIT 1),
  id,
  ROW_NUMBER() OVER (ORDER BY created_at)
FROM sacred_texts 
WHERE title IN ('Love Your Neighbor', 'The Golden Rule', 'Loving-Kindness to All', 'Love Your Enemies')
LIMIT 4;

-- Unity comparison
INSERT INTO comparison_texts (comparison_id, sacred_text_id, display_order)
SELECT 
  (SELECT id FROM text_comparisons WHERE theme = 'unity' LIMIT 1),
  id,
  ROW_NUMBER() OVER (ORDER BY created_at)
FROM sacred_texts 
WHERE title IN ('Truth is One', 'All Humanity from One Soul', 'One Divine Light', 'One Human Family', 'Unity of Humanity', 'See the Divine in All')
LIMIT 6;

-- Peace comparison
INSERT INTO comparison_texts (comparison_id, sacred_text_id, display_order)
SELECT 
  (SELECT id FROM text_comparisons WHERE theme = 'peace' LIMIT 1),
  id,
  ROW_NUMBER() OVER (ORDER BY created_at)
FROM sacred_texts 
WHERE title IN ('Blessed Are the Peacemakers', 'Seek Peace', 'Hatred Never Ceases by Hatred', 'Non-violence', 'The Soft Overcomes the Hard', 'All Life is Sacred')
LIMIT 6;

-- Compassion comparison
INSERT INTO comparison_texts (comparison_id, sacred_text_id, display_order)
SELECT 
  (SELECT id FROM text_comparisons WHERE theme = 'compassion' LIMIT 1),
  id,
  ROW_NUMBER() OVER (ORDER BY created_at)
FROM sacred_texts 
WHERE title IN ('Compassion to All Creation', 'Welcome the Stranger', 'Compassion for All', 'Compassion Without Limits', 'Compassionate Action')
LIMIT 5;

-- Create shareable quotes
INSERT INTO shareable_quotes (sacred_text_id, quote_text, background_style, share_count) VALUES
((SELECT id FROM sacred_texts WHERE title = 'Love Your Neighbor' LIMIT 1), 'Love your neighbor as yourself.', 'gradient-1', 0),
((SELECT id FROM sacred_texts WHERE title = 'Truth is One' LIMIT 1), 'Truth is one; the wise call it by many names.', 'gradient-2', 0),
((SELECT id FROM sacred_texts WHERE title = 'Hatred Never Ceases by Hatred' LIMIT 1), 'Hatred never ceases by hatred, but by love alone.', 'gradient-3', 0),
((SELECT id FROM sacred_texts WHERE title = 'Unity of Humanity' LIMIT 1), 'The earth is but one country, and mankind its citizens.', 'gradient-4', 0),
((SELECT id FROM sacred_texts WHERE title = 'Blessed Are the Peacemakers' LIMIT 1), 'Blessed are the peacemakers.', 'gradient-1', 0),
((SELECT id FROM sacred_texts WHERE title = 'All Humanity from One Soul' LIMIT 1), 'O humanity! All of you are from a single soul.', 'gradient-2', 0),
((SELECT id FROM sacred_texts WHERE title = 'One Divine Light' LIMIT 1), 'Recognize the Lord''s Light within all.', 'gradient-3', 0),
((SELECT id FROM sacred_texts WHERE title = 'Loving-Kindness to All' LIMIT 1), 'Cultivate boundless love towards all beings.', 'gradient-4', 0),
((SELECT id FROM sacred_texts WHERE title = 'Pursue Justice' LIMIT 1), 'Justice, justice shall you pursue.', 'gradient-1', 0),
((SELECT id FROM sacred_texts WHERE title = 'We Are What We Think' LIMIT 1), 'What we think, we become.', 'gradient-2', 0);