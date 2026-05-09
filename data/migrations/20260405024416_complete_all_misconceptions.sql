/*
  # Complete Misconceptions for All Traditions
  
  1. Changes
    - Add detailed misconceptions for traditions with 0 entries
    - Expand misconceptions for traditions with only 1-2 entries
    - Ensure every tradition has at least 4-5 comprehensive misconceptions
    - Cover all category types for each tradition
  
  2. Traditions Being Completed
    - Cao Dai (0 → 5)
    - Druze (0 → 5)
    - Shamanism (0 → 5)
    - Tenrikyo (0 → 5)
    - Unitarian Universalism (0 → 5)
    - Confucianism (1 → 5)
    - Native American Spirituality (1 → 5)
    - Sufism (1 → 5)
    - Yazidism (1 → 5)
    - African Traditional Religions (2 → 5)
    - Indigenous Spirituality (2 → 5)
    - Rastafari (2 → 5)
    - Shinto (2 → 5)
    - Taoism (2 → 5)
    - Wicca (2 → 5)
    - Zoroastrianism (2 → 5)
*/

-- CAO DAI (Vietnamese syncretic faith)
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Cao Dai'),
    'Cao Dai is a cult mixing random religions',
    'Cao Dai is a legitimate faith with 6-9 million adherents, recognized internationally. Founded in 1926, it synthesizes Buddhism, Taoism, Confucianism, Christianity, and Islam, teaching that all religions share the same divine source. Its elaborate temples and structured hierarchy reflect sophisticated theological development.',
    'general'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Cao Dai'),
    'Cao Dai worships famous historical figures as gods',
    'Cao Dai honors enlightened souls - including Victor Hugo, Joan of Arc, and Sun Yat-sen - as spirit guides who achieved spiritual perfection, not as deities. The Supreme Being (Cao Dai) is the one God. These figures are venerated teachers in the cosmic spiritual hierarchy.',
    'beliefs'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Cao Dai'),
    'The elaborate temples show Cao Dai is superficial',
    'The ornate Cao Dai temples symbolize the beauty of divine unity and religious harmony. Every color, symbol, and architectural element has deep theological meaning. The Divine Eye represents God watching over creation, while dragons, phoenixes, and other symbols represent spiritual truths.',
    'practices'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Cao Dai'),
    'Cao Dai is just Vietnamese folk religion',
    'While Cao Dai emerged in Vietnam and incorporates cultural elements, it''s a distinct revelation with its own scripture (revealed through séances), organized clergy, moral code, and universal message. It aims to unite all religions and has spread beyond Vietnam to diaspora communities worldwide.',
    'culture'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Cao Dai'),
    'Spirit communication in Cao Dai is occult practice',
    'Spiritual mediumship in Cao Dai is a sacred practice through which divine messages were received during the religion''s formation. This is analogous to prophetic revelation in other faiths. Today it''s practiced reverently under strict spiritual discipline, not as entertainment or manipulation.',
    'practices'
  );

-- DRUZE
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Druze'),
    'Druze are a Muslim sect',
    'The Druze faith is a distinct monotheistic religion that emerged from Ismaili Islam but developed unique theology. Druze don''t consider themselves Muslims and aren''t considered Muslim by Islamic authorities. They have their own scriptures, beliefs about reincarnation, and esoteric teachings.',
    'beliefs'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Druze'),
    'Druze are secretive and hide evil practices',
    'Druze maintain religious privacy to protect their community from persecution (they''ve faced centuries of oppression). Their theology has esoteric and exoteric levels, with deeper teachings reserved for initiates called ''Uqqal. This reflects wisdom tradition, not sinister secrets.',
    'general'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Druze'),
    'Anyone can convert to Druze faith',
    'Druze do not accept converts and don''t proselytize. One must be born into the faith. This isn''t elitism but protection of their small community and recognition that Druze souls are believed to reincarnate only within the Druze community. They respect all sincere faiths.',
    'practices'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Druze'),
    'Druze women are oppressed',
    'Druze women have significant religious and social equality. They can become religious initiates (''Uqqal) equal to men, divorce their husbands, own property, and participate in community decisions. Many Druze communities are progressive in gender equality compared to regional norms.',
    'women'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Druze'),
    'Druze believe in multiple gods',
    'Druze are strictly monotheistic, believing in one transcendent God beyond human comprehension. They reject anthropomorphism and believe in divine unity (Tawhid). Their theology emphasizes God''s absolute oneness and incorporates Neoplatonic philosophy with Islamic mysticism.',
    'beliefs'
  );

-- SHAMANISM
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Shamanism'),
    'Shamanism is primitive superstition',
    'Shamanism represents humanity''s oldest spiritual technology, refined over 40,000+ years. Shamanic practices involve sophisticated techniques for healing, divination, and spiritual insight. Modern research validates many shamanic understandings of consciousness, ecology, and psychospiritual healing.',
    'general'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Shamanism'),
    'All shamans use drugs to achieve trances',
    'While some shamanic traditions use plant medicines as sacraments, many achieve altered states through drumming, dancing, fasting, sensory deprivation, or meditation. The goal is spiritual connection and healing, not intoxication. Plant medicines are used reverently with deep cultural knowledge.',
    'practices'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Shamanism'),
    'Anyone can become a shaman after a weekend workshop',
    'Authentic shamans undergo years of rigorous training, often initiated by spontaneous spiritual crisis or hereditary calling. They master cultural knowledge, healing techniques, and spiritual protocols. "Shamanic tourism" and cultural appropriation disrespect indigenous wisdom and harm vulnerable seekers.',
    'culture'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Shamanism'),
    'Shamans are witches who curse people',
    'Shamans are community healers, counselors, and spiritual intermediaries who restore balance and wellness. While some may have capabilities for harmful magic, traditional shamanic ethics emphasize healing and harmony. The shaman''s role is to serve the community''s wellbeing.',
    'practices'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Shamanism'),
    'Shamanism died out in the modern world',
    'Shamanic traditions continue strong in Siberia, Mongolia, Korea, parts of Africa, and the Americas. Indigenous peoples maintain living traditions while adapting to modern contexts. There''s also revival of shamanic wisdom as people seek ecological spirituality and holistic healing.',
    'history'
  );

-- TENRIKYO
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Tenrikyo'),
    'Tenrikyo is just another Japanese new religion',
    'Tenrikyo, founded in 1838, is one of Japan''s largest and oldest new religions with 1.2+ million followers worldwide. It has sophisticated theology centered on "Joyous Life," institutional maturity with schools and hospitals, and official recognition. It offers a distinct path emphasizing service and gratitude.',
    'general'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Tenrikyo'),
    'Tenrikyo is nationalist or militaristic',
    'Tenrikyo teaches universal brotherhood and world peace. During WWII, it was actually suppressed by Japanese authorities for refusing to conform to State Shinto. Post-war, it has emphasized international fellowship, humanitarian service, and the belief that all humanity is one family.',
    'history'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Tenrikyo'),
    'The body is the thing lent by God" teaching devalues human life',
    'This teaching means our bodies are precious gifts from God (Tenri-O-no-Mikoto), creating gratitude and responsibility to care for ourselves and others. It emphasizes that we don''t own our bodies arrogantly but steward them gratefully, promoting health, healing, and interconnectedness.',
    'beliefs'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Tenrikyo'),
    'Tenrikyo faith healing rejects medical science',
    'While Tenrikyo teaches spiritual approaches to wellness, it operates hospitals and medical facilities and doesn''t reject modern medicine. "Sazuke" (healing prayer) complements medical treatment. The focus is on addressing spiritual dimensions of illness while embracing comprehensive care.',
    'practices'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Tenrikyo'),
    'Tenrikyo is polytheistic because of kami references',
    'Tenrikyo is monotheistic, centered on one God (Tenri-O-no-Mikoto/God the Parent). References to kami reflect Japanese cultural language for divine aspects or natural forces, not separate deities. The theology emphasizes God as loving parent of all humanity.',
    'beliefs'
  );

-- UNITARIAN UNIVERSALISM
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Unitarian Universalism'),
    'Unitarian Universalists don''t believe in anything',
    'UUs affirm seven principles including inherent worth of all people, justice and compassion, spiritual growth, and respect for Earth''s web of life. They draw from multiple sources - direct experience, world religions, science, and more. They believe deeply while rejecting dogmatic certainty.',
    'beliefs'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Unitarian Universalism'),
    'UU is not a real religion, just a social club',
    'UU congregations engage in worship, ritual, spiritual practice, theological reflection, and religious education. They address life''s ultimate questions, celebrate rites of passage, and provide spiritual community. The lack of required creed doesn''t negate genuine religious life.',
    'general'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Unitarian Universalism'),
    'UUs are all politically liberal atheists',
    'While many UUs are progressive and some are atheist/agnostic, the movement includes theists, Christians, pagans, Buddhists, humanists, and others across political spectrums. UU churches welcome theological diversity united by shared values, not uniform beliefs or politics.',
    'culture'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Unitarian Universalism'),
    'UU churches don''t teach children anything religious',
    'UU religious education exposes children to world religions, ethical reasoning, social justice, and spiritual practices. Rather than indoctrinating one truth, it teaches critical thinking and encourages each person''s theological journey. Many programs are rigorous and comprehensive.',
    'practices'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Unitarian Universalism'),
    'If you can believe anything, UU has no standards',
    'UU has strong ethical standards rooted in its principles. Members covenant to support one another in spiritual growth and ethical living. Freedom of belief doesn''t mean "anything goes" - it means responsible theological exploration within a community of accountability.',
    'beliefs'
  );

-- CONFUCIANISM (expand from 1 to 5)
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Confucianism'),
    'Confucianism oppresses women',
    'Historical Confucian societies developed patriarchal practices, but Confucius himself taught that virtue transcends gender. Contemporary Confucian scholars recognize that yin-yang complementarity doesn''t require hierarchy. Many advocate for gender equality grounded in Confucian ethics of reciprocity and respect.',
    'women'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Confucianism'),
    'Filial piety means blind obedience to parents',
    'Filial piety (xiao) involves respect and care for parents, but Confucian texts also discuss remonstrating with parents who act wrongly. It''s about reciprocal love and duty, not absolute submission. Children should guide parents gently away from error while maintaining respect.',
    'beliefs'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Confucianism'),
    'Confucianism is just cultural tradition, not religion',
    'While Confucianism has cultural dimensions, it addresses ultimate concerns, cultivates virtue, includes ritual and contemplative practices, and orients life toward transcendent ideals. Many practice it religiously. The secular/religious dichotomy doesn''t fit East Asian traditions neatly.',
    'general'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Confucianism'),
    'Confucius claimed to be divine or infallible',
    'Confucius saw himself as a transmitter of ancient wisdom, not its creator or a divine being. He emphasized continuous learning and acknowledged his own limitations. He encouraged questioning and independent thinking within the framework of virtue and tradition.',
    'history'
  );

-- NATIVE AMERICAN SPIRITUALITY (expand from 1 to 5)
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Native American Spirituality'),
    'Native Americans worship nature',
    'Native peoples don''t worship nature but recognize the sacred in all creation. Everything - animals, plants, stones, waters - is imbued with spirit and deserving of respect. This is profound theology about interconnection and sacred relationship, not primitive nature worship.',
    'beliefs'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Native American Spirituality'),
    'Vision quests and sweat lodges are available to anyone',
    'Sacred ceremonies belong to specific nations and shouldn''t be commodified or appropriated. Participating requires genuine relationship, cultural knowledge, and invitation from tradition-keepers. "Plastic medicine men" selling ceremonies exploit both seekers and Native peoples while disrespecting sacred practices.',
    'culture'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Native American Spirituality'),
    'Native American spirituality is ancient and unchanging',
    'While rooted in ancient wisdom, Native spiritual traditions are living and adaptive. Contemporary Native peoples integrate traditional knowledge with modern contexts, addressing current challenges while maintaining core values. This vitality shows resilience, not inauthenticity.',
    'history'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Native American Spirituality'),
    'The "noble savage" lived in perfect harmony with nature',
    'This romanticization denies Native peoples'' full humanity and sophisticated societies. While many Native cultures developed sustainable relationships with land, they were complex civilizations with agriculture, trade, political systems, and, yes, ecological impacts. Respect their real achievements, not fantasies.',
    'general'
  );

-- SUFISM (expand from 1 to 5)
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Sufism'),
    'Sufism is separate from Islam',
    'Sufism is the mystical dimension of Islam, not a separate religion. Sufis follow Islamic law while seeking direct experience of divine love and presence. All major Sufi masters were observant Muslims. Sufism represents Islam''s spiritual depth, integrating outer practice with inner transformation.',
    'beliefs'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Sufism'),
    'Whirling dervishes are just performing dance',
    'The Sema ceremony of whirling dervishes (Mevlevi Order) is profound spiritual practice representing the soul''s journey to God. Every gesture has meaning - the right hand raised to receive from heaven, left hand lowered to earth, spinning like planets around the sun of divine truth.',
    'practices'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Sufism'),
    'Sufis are heretics who reject Islamic law',
    'Most Sufis strictly observe Islamic practices while emphasizing the spiritual essence behind forms. They see outer law (Sharia) and inner path (Tariqa) as complementary. Some Sufis have been controversial, but mainstream Sufism is deeply rooted in Islamic orthodoxy and scholarship.',
    'general'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Sufism'),
    'Sufi poetry is just romantic love songs',
    'Sufi poetry uses romantic imagery to express spiritual longing for divine union. When Rumi writes of the "Beloved," he means God. This sacred metaphor conveys the passionate intensity of divine love. The poetry works on multiple levels - aesthetic, emotional, and mystical.',
    'culture'
  );

-- YAZIDISM (expand from 1 to 5)
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Yazidism'),
    'Yazidis practice an ancient form of Zoroastrianism',
    'While Yazidism has ancient roots possibly including Zoroastrian influences, it''s a distinct tradition with unique theology, scriptures (oral traditions), and practices. It incorporates elements from various ancient religions but is its own syncretic faith centered on Melek Taus and one God.',
    'history'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Yazidism'),
    'Yazidis can convert people to their faith',
    'Yazidis don''t accept converts and don''t proselytize. One must be born Yazidi. Intermarriage traditionally means leaving the community. This protects their small, persecuted population and reflects beliefs about Yazidi souls. They respect other faiths without seeking to expand.',
    'practices'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Yazidism'),
    'Yazidi beliefs are coherent and unified',
    'Yazidism has diverse oral traditions passed through generations, with variations between communities. This oral nature means flexibility and some contradictions. Rather than weakness, this reflects living tradition adapted to communities while maintaining core identity and values.',
    'general'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Yazidism'),
    'ISIS persecution proves Yazidis are devil worshippers',
    'ISIS persecution was based on complete theological ignorance and genocidal intent. It proves only the evil of fundamentalist extremism, not anything about Yazidi beliefs. Yazidis are monotheists with profound ethical teachings. This genocide demands remembrance and justice.',
    'violence'
  );

-- AFRICAN TRADITIONAL RELIGIONS (expand from 2 to 5)
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'African Traditional Religions'),
    'African religions are polytheistic paganism',
    'Most African traditions are monotheistic with one supreme Creator (known by various names) and lesser spirits/ancestors who serve as intermediaries - similar to angels or saints in other traditions. The theology is sophisticated, addressing cosmology, ethics, and ultimate reality.',
    'beliefs'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'African Traditional Religions'),
    'Animal sacrifice makes African religions primitive',
    'Ritual sacrifice exists in many world religions (Judaism, Islam, Hinduism historically). In African traditions, it''s performed reverently to honor spirits, mark occasions, and share communal meals. Western squeamishness about visible sacrifice doesn''t make industrial meat production more ethical.',
    'practices'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'African Traditional Religions'),
    'African religions have no ethics or morality',
    'African spiritual traditions have comprehensive ethical systems governing honesty, hospitality, respect for elders, community responsibility, and environmental stewardship. Ubuntu philosophy ("I am because we are") offers profound ethical wisdom about interconnection and human dignity.',
    'general'
  );

-- INDIGENOUS SPIRITUALITY (expand from 2 to 5)
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Indigenous Spirituality'),
    'Indigenous peoples are stuck in the past',
    'Indigenous peoples are contemporary communities navigating modernity while maintaining cultural identity. Many blend traditional wisdom with technology, education, and global engagement. Honoring ancestors and land doesn''t mean rejecting progress - it means defining progress differently.',
    'culture'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Indigenous Spirituality'),
    'Indigenous spirituality is anti-Christian',
    'Many Indigenous people practice Christianity alongside traditional ways, creating unique syncretic expressions. Others maintain pre-contact traditions. The relationship varies by community and history. Forced conversion caused harm, but many Indigenous Christians integrate both identities authentically.',
    'general'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Indigenous Spirituality'),
    'Traditional ecological knowledge is just folklore',
    'Indigenous ecological knowledge represents millennia of careful observation, experimentation, and refinement. Scientific research increasingly validates traditional practices in agriculture, medicine, conservation, and climate adaptation. This knowledge is sophisticated science, orally transmitted.',
    'practices'
  );

-- RASTAFARI (expand from 2 to 5)
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Rastafari'),
    'Rastafari is all about marijuana',
    'While cannabis (ganja) is used sacramentally by some Rastas for meditation and reasoning, the faith centers on African liberation, repatriation, biblical interpretation, and spiritual living. Core beliefs include Haile Selassie''s divinity, Babylon''s corruption, and Zion''s redemption.',
    'practices'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Rastafari'),
    'All Rastafarians have dreadlocks',
    'While many Rastas grow locks based on Nazarite vows (Numbers 6), it''s not universal. Dreadlocks symbolize covenant with Jah and natural living, but spiritual commitment matters more than outward appearance. Not all people with locks are Rasta.',
    'culture'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Rastafari'),
    'Rastafari worships a human emperor as God',
    'Rastas see Haile Selassie I as the returned Christ, God incarnate, and Africa''s redeemer. This reflects Black liberation theology responding to white European Christianity. While controversial, it parallels Christian incarnational theology and addresses colonial religious oppression.',
    'beliefs'
  );

-- SHINTO (expand from 2 to 5)
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Shinto'),
    'Shinto is polytheistic worship of many gods',
    'Shinto venerates kami - spirits or sacred essences in nature, ancestors, and heroes. Kami aren''t gods in the Western sense but manifestations of sacred power and beauty. Shinto is better understood as animistic or pantheistic than polytheistic, seeing divinity throughout creation.',
    'beliefs'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Shinto'),
    'Shinto has no ethics or teachings',
    'Shinto emphasizes purity (physical and spiritual), gratitude, harmony with nature, and respect for ancestors. While lacking written commandments, it teaches through ritual, story, and cultural values like sincerity (makoto) and harmony (wa). Ethics are embodied rather than codified.',
    'practices'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Shinto'),
    'Shinto and Buddhism are incompatible',
    'For over 1,000 years, most Japanese practiced both Shinto and Buddhism complementarily. Shinto addresses life celebrations and nature connection; Buddhism handles death rites and philosophical questions. This religious pluralism shows sophisticated integration of different spiritual dimensions.',
    'culture'
  );

-- TAOISM (expand from 2 to 5)
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Taoism'),
    'Taoism is passive and withdraws from the world',
    'While Taoism values simplicity and naturalness, it doesn''t mean passivity. Taoist sages engaged in politics, medicine, art, and science. Wu wei means effortless action aligned with Tao, not inaction. Taoist martial arts show dynamic engagement from centered stillness.',
    'general'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Taoism'),
    'Taoism has no moral standards',
    'Taoism teaches compassion, humility, and moderation. The Tao Te Ching offers ethical wisdom about leadership, warfare, and living. Rather than rigid rules, Taoist ethics emphasize naturalness, spontaneity aligned with Tao, and not forcing outcomes - a sophisticated moral framework.',
    'beliefs'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Taoism'),
    'Religious Taoism is corrupted philosophy',
    'Philosophical and religious Taoism developed together from ancient Chinese spirituality. Religious Taoism''s rituals, deities, and practices reflect different expressions of Taoist principles, not corruption. Both forms offer valid paths to understanding and living the Tao.',
    'practices'
  );

-- WICCA (expand from 2 to 5)
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Wicca'),
    'Wicca is ancient Celtic religion',
    'Wicca was founded in mid-20th century by Gerald Gardner, drawing on folklore, ceremonial magic, and romantic ideas about pre-Christian paganism. While inspired by ancient traditions, it''s a modern reconstruction. This doesn''t diminish its validity as a genuine spiritual path.',
    'history'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Wicca'),
    'All witches are Wiccan',
    'Witchcraft is a practice; Wicca is a religion. Many witches aren''t Wiccan (practicing folk magic, chaos magic, or other traditions). Many Wiccans don''t identify as witches. The terms overlap but aren''t synonymous. Wicca specifically refers to initiatory traditions honoring Goddess and God.',
    'general'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Wicca'),
    'Wiccans worship Satan',
    'Wiccans don''t believe in Satan, which is a Christian concept. Wicca pre-dates and exists outside Christianity''s theological framework. Wiccans typically honor a Goddess and God representing nature''s feminine and masculine aspects, celebrating seasonal cycles and natural magic.',
    'beliefs'
  );

-- ZOROASTRIANISM (expand from 2 to 5)
INSERT INTO misconceptions (tradition_id, misconception, truth, category) VALUES
  (
    (SELECT id FROM traditions WHERE name = 'Zoroastrianism'),
    'Zoroastrians worship fire',
    'Fire is sacred in Zoroastrianism as a symbol of God''s light and purity, not a deity itself. Keeping eternal flames in temples represents the eternal light of truth (Asha). Fire ceremonies honor Ahura Mazda, the one God, through this pure element.',
    'practices'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Zoroastrianism'),
    'Zoroastrianism is extinct or dying',
    'While small (100,000-200,000 adherents), Zoroastrian communities remain vibrant in Iran, India (Parsis), and diaspora. They maintain ancient practices while engaging modernity, contributing to society as professionals, philanthropists, and cultural leaders. Small doesn''t mean dying.',
    'general'
  ),
  (
    (SELECT id FROM traditions WHERE name = 'Zoroastrianism'),
    'Zoroastrianism influenced all later religions',
    'While Zoroastrianism influenced Judaism, Christianity, and Islam (concepts of heaven/hell, angels/demons, messiah, final judgment), claiming it as the source of all these ideas is oversimplified. Religious ideas develop through complex interactions, and each tradition has unique revelations.',
    'history'
  );
