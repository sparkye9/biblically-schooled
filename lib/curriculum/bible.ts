import type { BibleWeek, MemoryVerse, Unit } from './types'

/**
 * Bible curriculum — 36 weeks in four 9-week units.
 *
 * Memory verses use the King James Version (public domain) so they can be
 * printed freely. `short` is always an exact, contiguous piece of `text`
 * (enforced by tests) so little ones memorize real Scripture, never a
 * paraphrase presented as a quotation. Parents can read the passage from any
 * translation the family uses.
 */

export const UNITS: Unit[] = [
  {
    number: 1,
    title: 'God, Creation, and Identity',
    weeks: [1, 9],
    bigIdea: 'God made everything, He is good, and He made me on purpose in His image.',
  },
  {
    number: 2,
    title: "Faith, Covenant, and God's Promises",
    weeks: [10, 18],
    bigIdea: 'God makes promises and always keeps them — we can trust Him.',
  },
  {
    number: 3,
    title: 'Jesus Christ and Salvation',
    weeks: [19, 27],
    bigIdea: 'Jesus is God’s promised Savior who lived, died, and rose again for us.',
  },
  {
    number: 4,
    title: 'Christian Living and Spiritual Growth',
    weeks: [28, 36],
    bigIdea: 'God’s Spirit helps us pray, love, and serve as we grow.',
  },
]

export function unitForWeek(week: number): Unit {
  return UNITS.find((u) => week >= u.weeks[0] && week <= u.weeks[1]) ?? UNITS[UNITS.length - 1]
}

const v = (ref: string, text: string, short?: string): MemoryVerse => ({
  ref,
  text,
  short: short ?? text,
})

export const BIBLE_WEEKS: BibleWeek[] = [
  // ───────────────────────── Unit 1: God, Creation, and Identity ─────────────────────────
  {
    week: 1,
    title: 'God Creates the World',
    passage: 'Genesis 1:1–25',
    shortReading: 'Genesis 1:1–5',
    character: 'God is the Creator',
    objective: 'Children can say that God made everything, and name some things He made on different days.',
    parentExplanation:
      'Genesis 1 shows God creating by His word, in order, and calling His work good. The focus for young children is who God is (the powerful, good Creator), not debating how long the days were.',
    childExplanation:
      'Before anything was here, God was here. God spoke, and light, sky, land, plants, sun, moon, stars, fish, birds and animals came to be. Everything God made was good!',
    questions: [
      'Who made the world?',
      'What is your favorite thing God made?',
      'How did God make things? (He spoke!)',
    ],
    verse: v('Genesis 1:1', 'In the beginning God created the heaven and the earth.'),
    activity: 'Creation walk: go outside or look out a window and name five things God made.',
    prayer: 'Thank You, God, for making the world. Everything You made is good. Amen.',
    days: [
      'Read Genesis 1:1–13 (days 1–3). Introduce the memory verse.',
      'Read Genesis 1:14–25 (days 4–6, animals). Say the verse together.',
      'Retell creation with seven fingers/drawings. Do the creation walk.',
      'Review: "Who made the ___?" game. Say the verse from memory.',
    ],
  },
  {
    week: 2,
    title: 'Made in God’s Image',
    passage: 'Genesis 1:26–31',
    shortReading: 'Genesis 1:26–28',
    character: 'Every person has worth',
    objective: 'Children can explain that God made people special, in His image, and that every person matters.',
    parentExplanation:
      'Being made in God’s image means every person — every sibling, every neighbor, every ability — carries dignity and worth. This is the foundation for kindness and for how we treat differences in our family.',
    childExplanation:
      'God made people last, and He made us special. We are made in God’s image. That means we can love, think, create and talk with God. Every person is valuable to God — you, your brothers and sisters, everyone!',
    questions: [
      'What did God say after He made people? (Very good!)',
      'If everyone is made by God, how should we treat each other?',
      'What is one thing you can do that shows you were made to love?',
    ],
    verse: v(
      'Genesis 1:27',
      'So God created man in his own image, in the image of God created he him; male and female created he them.',
      'So God created man in his own image',
    ),
    activity: 'Mirror talk: each child looks in a mirror and says, "God made me, and I am valuable."',
    prayer: 'God, thank You for making me and my family. Help me treat everyone as valuable. Amen.',
    days: [
      'Read Genesis 1:26–28. Introduce the verse.',
      'Read Genesis 1:29–31. Talk about "very good."',
      'Mirror talk activity. Name one good thing about each family member.',
      'Review weeks 1–2: What did God make? Who is special to God?',
    ],
  },
  {
    week: 3,
    title: 'Fearfully and Wonderfully Made',
    passage: 'Psalm 139:1–16',
    shortReading: 'Psalm 139:13–16',
    character: 'God knows me',
    objective: 'Children can say that God knows them completely and made each of them uniquely.',
    parentExplanation:
      'David praises God for knowing him fully and forming him before birth. Children who learn and feel differently are not mistakes — God knit each one together on purpose. This week sets up later family conversations about how brains work differently.',
    childExplanation:
      'God knows everything about you — when you sit, when you stand, what you think. God made you before you were born, and He made you just the way He planned. You are wonderfully made!',
    questions: [
      'What does God know about you?',
      'Is anyone made exactly like you?',
      'How can we thank God for how He made us?',
    ],
    verse: v(
      'Psalm 139:14',
      'I will praise thee; for I am fearfully and wonderfully made: marvellous are thy works; and that my soul knoweth right well.',
      'I am fearfully and wonderfully made',
    ),
    activity: 'Thumbprint art: press thumbprints on paper and compare — no two are the same.',
    prayer: 'Thank You, God, that You know me and made me wonderfully. Amen.',
    days: [
      'Read Psalm 139:1–6. God knows me. Introduce the verse.',
      'Read Psalm 139:7–12. God is always with me.',
      'Read Psalm 139:13–16. Thumbprint art.',
      'Review: say the verse; each child names one way they are unique.',
    ],
  },
  {
    week: 4,
    title: 'God Is Good and Faithful',
    passage: 'Psalm 100',
    shortReading: 'Psalm 100:1–5',
    character: 'God’s character',
    objective: 'Children can name three things that are true about God: He is good, loving (merciful), and faithful.',
    parentExplanation:
      'Psalm 100 is a call to worship grounded in God’s character: He is good, His mercy (steadfast love) lasts forever, and His faithfulness continues to every generation — including ours.',
    childExplanation:
      'This song in the Bible tells us to shout for joy to God! Why? Because God is good. His love never runs out. He keeps His promises to grown-ups, kids, and grandkids — forever.',
    questions: [
      'What is God like?',
      'How long does God’s love last?',
      'How can we worship God with gladness today?',
    ],
    verse: v(
      'Psalm 100:5',
      'For the LORD is good; his mercy is everlasting; and his truth endureth to all generations.',
      'For the LORD is good',
    ),
    activity: 'Make a "God is…" poster: draw or write good, loving, faithful, strong.',
    prayer: 'God, You are good, Your love lasts forever, and You are faithful. We praise You! Amen.',
    days: [
      'Read Psalm 100. Introduce "God is good."',
      'Re-read Psalm 100 with motions (shout, sing, come in, give thanks).',
      'Make the "God is…" poster.',
      'Review: sing a favorite worship song; say the verse.',
    ],
  },
  {
    week: 5,
    title: 'God Made Families',
    passage: 'Genesis 2:7–9, 15–24',
    shortReading: 'Genesis 2:18–22',
    character: 'Belonging to a family',
    objective: 'Children can tell how God made Adam and Eve and placed people in families to love and help one another.',
    parentExplanation:
      'Genesis 2 zooms in on day six: God forms Adam, plants a garden, gives meaningful work, and makes Eve so that Adam is not alone. Families — of every shape — are part of God’s good design for belonging and helping.',
    childExplanation:
      'God made the first man, Adam, from the dust and breathed life into him. God gave Adam a beautiful garden to care for. God said it was not good for Adam to be alone, so God made Eve. God gives us families so we can love and help each other.',
    questions: [
      'What job did God give Adam in the garden?',
      'Why did God make Eve?',
      'How can you help your family this week?',
    ],
    verse: v(
      'Joshua 24:15',
      'And if it seem evil unto you to serve the LORD, choose you this day whom ye will serve; whether the gods which your fathers served that were on the other side of the flood, or the gods of the Amorites, in whose land ye dwell: but as for me and my house, we will serve the LORD.',
      'as for me and my house, we will serve the LORD',
    ),
    activity: 'Draw a family portrait and label everyone. Talk about one way each person helps.',
    prayer: 'Thank You, God, for my family. Help us love and serve You together. Amen.',
    days: [
      'Read Genesis 2:7–9, 15. God gives Adam work.',
      'Read Genesis 2:18–24. God makes Eve. Introduce the verse.',
      'Family portrait activity; choose a family helping job.',
      'Review: family helper check-in; say the verse.',
    ],
  },
  {
    week: 6,
    title: 'Sin, Sadness, and God’s Promise',
    passage: 'Genesis 3:1–24',
    shortReading: 'Genesis 3:8–15',
    character: 'Honesty and forgiveness',
    objective: 'Children can explain that disobeying God is called sin, and that God still loved Adam and Eve and promised a rescue.',
    parentExplanation:
      'Genesis 3 explains why the world is broken. Note the hope: God comes looking for Adam and Eve, clothes them, and promises that one day the serpent will be defeated (Genesis 3:15) — the first hint of Jesus. Keep the tone hopeful, not frightening.',
    childExplanation:
      'God gave Adam and Eve one rule. A sneaky serpent tricked them, and they disobeyed. That is called sin, and it made things sad and broken. But God still loved them. God made them clothes and promised that one day He would send a Rescuer. (That Rescuer is Jesus!)',
    questions: [
      'What rule did God give Adam and Eve?',
      'What did God do even after they disobeyed?',
      'What should we do when we do something wrong?',
    ],
    verse: v(
      '1 John 1:9',
      'If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.',
      'he is faithful and just to forgive us our sins',
    ),
    activity: 'Practice "I’m sorry / I forgive you" role-plays with stuffed animals.',
    prayer: 'God, I am sorry for the wrong things I do. Thank You for forgiving me. Amen.',
    traditionNote:
      'The Bible says "fruit," not "apple." The apple is an art tradition.',
    days: [
      'Read Genesis 3:1–7. The serpent and the choice.',
      'Read Genesis 3:8–15. God comes looking; the promise. Introduce the verse.',
      'Forgiveness role-plays.',
      'Review: what is sin? what does God do when we confess?',
    ],
  },
  {
    week: 7,
    title: 'Noah Obeys God',
    passage: 'Genesis 6:9–22; 7:1–5',
    shortReading: 'Genesis 6:13–22',
    character: 'Obedience',
    objective: 'Children can retell how Noah obeyed God fully, even when others did not.',
    parentExplanation:
      'Noah is described as walking with God. When God gave detailed instructions for the ark, Noah did all of it. Obedience here is trust in action — doing what God says because we trust Him.',
    childExplanation:
      'People everywhere were choosing wrong, but Noah loved God. God told Noah to build a giant boat called an ark. It was a big job! Noah did everything God told him to do.',
    questions: [
      'What did God ask Noah to build?',
      'Did Noah obey a little or all the way?',
      'What is something God asks us to do?',
    ],
    verse: v('Genesis 6:22', 'Thus did Noah; according to all that God commanded him, so did he.'),
    activity: 'Build an ark from blocks or a box and load pairs of toy animals.',
    prayer: 'God, help me obey You all the way, like Noah. Amen.',
    days: [
      'Read Genesis 6:9–14. Noah walks with God. Introduce the verse.',
      'Read Genesis 6:15–22. Building the ark.',
      'Ark-building activity; "obey all the way" game (Simon Says).',
      'Read Genesis 7:1–5. Review the verse.',
    ],
  },
  {
    week: 8,
    title: 'God’s Rainbow Promise: Giving Thanks',
    passage: 'Genesis 8:1–22; 9:8–17',
    shortReading: 'Genesis 9:12–16',
    character: 'Gratitude',
    objective: 'Children can tell what God promised with the rainbow and practice thanking God.',
    parentExplanation:
      'After the flood, Noah’s first act is worship. God makes a covenant never again to destroy the earth by a flood, and gives the rainbow as its sign. Gratitude is a response to God’s faithfulness.',
    childExplanation:
      'God kept Noah’s family and the animals safe. When the water went down, Noah said thank you to God first. God put a rainbow in the sky as a promise. Every rainbow reminds us that God keeps His promises!',
    questions: [
      'What did Noah do first when he left the ark?',
      'What does the rainbow remind us of?',
      'What are you thankful for today?',
    ],
    verse: v(
      'Psalm 107:1',
      'O give thanks unto the LORD, for he is good: for his mercy endureth for ever.',
      'O give thanks unto the LORD, for he is good',
    ),
    activity: 'Rainbow thank-you chain: one paper strip per color, write or draw something you’re thankful for.',
    prayer: 'Thank You, God, for keeping Your promises. Thank You for ___. Amen.',
    days: [
      'Read Genesis 8:1–12. The dove and the waiting.',
      'Read Genesis 8:13–22. Noah gives thanks. Introduce the verse.',
      'Read Genesis 9:8–17. Rainbow thank-you chain.',
      'Review: name God’s promise; add to the thank-you chain.',
    ],
  },
  {
    week: 9,
    title: 'Unit 1 Review: Honor and Obey in My Family',
    passage: 'Exodus 20:12; Ephesians 6:1–3',
    shortReading: 'Ephesians 6:1–4',
    character: 'Honor',
    objective: 'Children can review Unit 1 (Creator, image of God, sin and promise) and explain what it means to honor parents.',
    parentExplanation:
      'Paul quotes the fifth commandment to children and balances it with a word to fathers (6:4). Honor is respect shown in words, tone, and actions. Review the unit storyline: God made everything good → people in His image → sin → God’s promise.',
    childExplanation:
      'God gives families a special rule: children, obey your parents, because it is right. Honor means showing respect with our words, our faces, and our actions. It is one way we obey God.',
    questions: [
      'What does "honor" mean?',
      'What is one way to honor Mom or Dad today?',
      'Can you tell the Unit 1 story: God made… people… sin… promise?',
    ],
    verse: v('Ephesians 6:1', 'Children, obey your parents in the Lord: for this is right.'),
    activity: 'Honor coupons: children draw "I will help by…" coupons to give to a parent.',
    prayer: 'God, help me honor my parents and obey You. Amen.',
    days: [
      'Read Ephesians 6:1–3. Introduce the verse.',
      'Read Exodus 20:12. Make honor coupons.',
      'Unit 1 story retell with pictures from weeks 1–8.',
      'Celebrate: recite unit memory verses (any they remember!).',
    ],
  },

  // ───────────────────────── Unit 2: Faith, Covenant, and God's Promises ─────────────────────────
  {
    week: 10,
    title: 'God Calls Abram',
    passage: 'Genesis 12:1–9',
    shortReading: 'Genesis 12:1–5',
    character: 'Trust',
    objective: 'Children can retell how Abram trusted God and moved to a new land without knowing every detail.',
    parentExplanation:
      'God’s call to Abram begins the story of His covenant people. God promises land, a great nation, and blessing for all families of the earth (12:3) — a promise ultimately fulfilled in Jesus.',
    childExplanation:
      'God told Abram, "Leave your home and go to a land I will show you." Abram did not know the way, but he trusted God and went. God promised to bless Abram and make his family huge!',
    questions: [
      'What did God ask Abram to do?',
      'Did Abram know exactly where he was going?',
      'When is it hard to trust God?',
    ],
    verse: v(
      'Proverbs 3:5',
      'Trust in the LORD with all thine heart; and lean not unto thine own understanding.',
      'Trust in the LORD with all thine heart',
    ),
    activity: 'Trust walk: a blindfolded child follows a parent’s voice across the room.',
    prayer: 'God, I trust You even when I don’t know what’s next. Amen.',
    culturalNote:
      'Abram lived in tents and traveled with flocks — like many herders in the Middle East did for thousands of years.',
    days: [
      'Read Genesis 12:1–3. God’s call and promise. Introduce the verse.',
      'Read Genesis 12:4–9. The journey. Find Ur and Canaan on a map.',
      'Trust walk activity.',
      'Review: retell Abram’s journey; say the verse.',
    ],
  },
  {
    week: 11,
    title: 'Count the Stars: God’s Covenant',
    passage: 'Genesis 15:1–6',
    shortReading: 'Genesis 15:1–6',
    character: 'Faith',
    objective: 'Children can explain that a covenant is a serious promise and that Abram believed God’s promise.',
    parentExplanation:
      'Abram is old and childless, yet God promises descendants as many as the stars. Abram believes, and God counts it as righteousness — a key verse Paul later uses to explain faith (Romans 4).',
    childExplanation:
      'Abram was old and had no children. God took him outside and said, "Look at the stars. Can you count them? Your family will be like that!" Abram believed God. Believing God is called faith.',
    questions: [
      'What did God tell Abram to count?',
      'What does it mean to believe God?',
      'What has God promised us?',
    ],
    verse: v(
      'Genesis 15:6',
      'And he believed in the LORD; and he counted it to him for righteousness.',
      'And he believed in the LORD',
    ),
    activity: 'Star counting: put star stickers or draw stars on dark paper; try to count them all.',
    prayer: 'God, You always keep Your promises. Help me believe You. Amen.',
    culturalNote:
      'A covenant was a solemn, binding agreement. God’s covenant with Abram is the background for the rest of the Old Testament.',
    days: [
      'Read Genesis 15:1–6. Introduce "covenant" and the verse.',
      'Re-read Genesis 15:5 at night or with a star picture.',
      'Star counting activity.',
      'Review: what is faith? say the verse.',
    ],
  },
  {
    week: 12,
    title: 'Isaac: Nothing Is Too Hard for God',
    passage: 'Genesis 18:1–14; 21:1–7',
    shortReading: 'Genesis 21:1–7',
    character: 'God’s power',
    objective: 'Children can retell how God kept His promise by giving Abraham and Sarah a son, Isaac, in their old age.',
    parentExplanation:
      'Sarah laughed in disbelief; God asked, "Is any thing too hard for the LORD?" A year later Isaac ("he laughs") is born. God keeps promises on His timing and by His power.',
    childExplanation:
      'Abraham and Sarah were very, very old — too old to have a baby. Sarah laughed when she heard God’s promise. But God said nothing is too hard for Him! Baby Isaac was born, and Sarah laughed happy laughs.',
    questions: [
      'Why did Sarah laugh the first time?',
      'What does the name Isaac mean?',
      'What is something that seems hard that we can pray about?',
    ],
    verse: v(
      'Genesis 18:14',
      'Is any thing too hard for the LORD? At the time appointed I will return unto thee, according to the time of life, and Sarah shall have a son.',
      'Is any thing too hard for the LORD?',
    ),
    activity: '"Too hard for me, not for God" list: kids name hard things; pray over the list.',
    prayer: 'God, nothing is too hard for You. Help us trust You with hard things. Amen.',
    culturalNote: 'Hebrew names carry meaning. Isaac (Yitzhak) comes from the word for "laugh."',
    days: [
      'Read Genesis 18:1–10. Visitors and the promise.',
      'Read Genesis 18:11–14. Sarah laughs. Introduce the verse.',
      'Read Genesis 21:1–7. Isaac is born. Make the prayer list.',
      'Review weeks 10–12: Abraham’s story in order.',
    ],
  },
  {
    week: 13,
    title: 'Jacob’s Ladder: God Is With Me',
    passage: 'Genesis 28:10–22',
    shortReading: 'Genesis 28:12–16',
    character: 'God’s presence',
    objective: 'Children can tell what Jacob saw in his dream and what God promised him.',
    parentExplanation:
      'Jacob is running from trouble he caused, yet God meets him with grace and repeats the covenant promise. Jesus later refers to this ladder in John 1:51. God’s presence is a gift, not a reward for good behavior.',
    childExplanation:
      'Jacob was far from home, sleeping outside with a rock for a pillow. He dreamed of a stairway to heaven with angels on it. God said, "I am with you, and I will keep you wherever you go." Jacob woke up and said, "God was here!"',
    questions: [
      'What did Jacob see in his dream?',
      'What did God promise Jacob?',
      'Where is God with you?',
    ],
    verse: v(
      'Genesis 28:15',
      'And, behold, I am with thee, and will keep thee in all places whither thou goest, and will bring thee again into this land; for I will not leave thee, until I have done that which I have spoken to thee of.',
      'I am with thee, and will keep thee in all places whither thou goest',
    ),
    activity: 'Build a ladder from craft sticks or blocks; name places where God is with you.',
    prayer: 'Thank You, God, that You are with me everywhere I go. Amen.',
    days: [
      'Read Genesis 28:10–12. The dream.',
      'Read Genesis 28:13–17. God’s promise. Introduce the verse.',
      'Ladder activity.',
      'Read Genesis 28:18–22. Review the verse.',
    ],
  },
  {
    week: 14,
    title: 'Joseph: God Is With Us in Hard Times',
    passage: 'Genesis 37; 39:1–6, 20–23',
    shortReading: 'Genesis 39:1–6',
    character: 'Faithfulness in hard times',
    objective: 'Children can retell how Joseph was treated unfairly yet God was with him.',
    parentExplanation:
      'Jealousy leads Joseph’s brothers to sell him. In Egypt, both in Potiphar’s house and in prison, the text repeats: "the LORD was with Joseph." Hard circumstances are not proof that God is absent.',
    childExplanation:
      'Joseph’s brothers were jealous of him and his colorful coat. They did a very mean thing and sold him far away to Egypt. Joseph had many hard days — but God was with Joseph the whole time!',
    questions: [
      'Why were Joseph’s brothers jealous?',
      'Was God with Joseph in the hard times?',
      'What can you do when you feel jealous?',
    ],
    verse: v(
      'Genesis 39:2',
      'And the LORD was with Joseph, and he was a prosperous man; and he was in the house of his master the Egyptian.',
      'And the LORD was with Joseph',
    ),
    activity: 'Color a "coat of many colors" and write "God was with Joseph" on it.',
    prayer: 'God, be with me on hard days too. Help me not to be jealous. Amen.',
    traditionNote:
      'The KJV says "coat of many colours." The Hebrew phrase may mean a long-sleeved or ornate robe; either way it showed special favor.',
    days: [
      'Read Genesis 37:1–11. Dreams and jealousy.',
      'Read Genesis 37:12–28. Sold to Egypt (keep it gentle). Introduce the verse.',
      'Read Genesis 39:1–6, 20–23. Color the coat.',
      'Review: name a hard time and how God was with Joseph.',
    ],
  },
  {
    week: 15,
    title: 'Joseph Forgives',
    passage: 'Genesis 45:1–15; 50:15–21',
    shortReading: 'Genesis 45:3–8',
    character: 'Forgiveness',
    objective: 'Children can explain how Joseph forgave his brothers and how God turned bad into good.',
    parentExplanation:
      'Joseph’s forgiveness is grounded in trust that God was working all along (50:20). Forgiveness does not pretend wrong was okay; it releases revenge to God.',
    childExplanation:
      'Years later, Joseph was a great leader in Egypt. His brothers came for food and did not know him. Joseph could have been mean to them, but he forgave them and hugged them! He said God turned the bad thing into something good.',
    questions: [
      'What could Joseph have done to his brothers?',
      'What did he choose to do?',
      'Is there someone you need to forgive?',
    ],
    verse: v(
      'Genesis 50:20',
      'But as for you, ye thought evil against me; but God meant it unto good, to bring to pass, as it is this day, to save much people alive.',
      'but God meant it unto good',
    ),
    activity: 'Forgiveness hearts: cut a paper heart, tape a "torn" piece back together while saying "I forgive you."',
    prayer: 'God, help me forgive like Joseph did, and like You forgive me. Amen.',
    days: [
      'Read Genesis 42:1–8. The brothers come to Egypt.',
      'Read Genesis 45:1–8. Joseph reveals himself. Introduce the verse.',
      'Read Genesis 45:9–15. Forgiveness hearts activity.',
      'Read Genesis 50:19–21. Review the Joseph story in order.',
    ],
  },
  {
    week: 16,
    title: 'Baby Moses: God Protects',
    passage: 'Exodus 1:8–14; 2:1–10',
    shortReading: 'Exodus 2:1–10',
    character: 'Courage',
    objective: 'Children can retell how God protected baby Moses through his mother, sister Miriam, and Pharaoh’s daughter.',
    parentExplanation:
      'A new Pharaoh enslaves Israel and threatens their baby boys. God protects Moses through the brave choices of women: his mother Jochebed, his sister Miriam, and Pharaoh’s daughter.',
    childExplanation:
      'A mean king in Egypt made God’s people slaves. Moses’ mom hid baby Moses in a basket boat on the river. His big sister Miriam watched. A princess found him and kept him safe — and Moses’ own mom got to take care of him!',
    questions: [
      'Where did Moses’ mom hide him?',
      'How was Miriam brave?',
      'How does God protect our family?',
    ],
    verse: v('Psalm 46:1', 'God is our refuge and strength, a very present help in trouble.'),
    activity: 'Make a basket boat from a small container; test if it floats in the sink.',
    prayer: 'Thank You, God, that You protect us. You are our help. Amen.',
    culturalNote: 'The Nile River was the center of life in Egypt — water, food, and travel all depended on it.',
    days: [
      'Read Exodus 1:8–14. God’s people are slaves.',
      'Read Exodus 2:1–4. The basket boat. Introduce the verse.',
      'Read Exodus 2:5–10. Float-the-boat activity.',
      'Review: who helped protect Moses?',
    ],
  },
  {
    week: 17,
    title: 'The Burning Bush and the First Passover',
    passage: 'Exodus 3:1–15; 12:1–14, 21–28',
    shortReading: 'Exodus 3:1–6',
    character: 'God’s holiness',
    objective: 'Children can tell how God called Moses at the burning bush and what happened at the first Passover.',
    parentExplanation:
      'God reveals His name ("I AM") and promises to rescue Israel. At the Passover, the lamb’s blood on the doorposts marked the houses God "passed over." Christians see Jesus as the fulfillment (1 Corinthians 5:7).',
    childExplanation:
      'God spoke to Moses from a bush that was on fire but did not burn up! God said, "I will be with you. Go and tell Pharaoh to let My people go." Later, God told His people to put a lamb’s blood on their doors, and He passed over those houses and kept them safe. Then God set His people free!',
    questions: [
      'What was strange about the bush?',
      'What did God promise Moses?',
       'Why do you think God’s people remembered Passover every year?',
    ],
    verse: v(
      'Exodus 3:12',
      'And he said, Certainly I will be with thee; and this shall be a token unto thee, that I have sent thee: When thou hast brought forth the people out of Egypt, ye shall serve God upon this mountain.',
      'Certainly I will be with thee',
    ),
    activity: 'Taste of Passover (optional): flat bread (matzah or a cracker) and talk about leaving Egypt in a hurry.',
    prayer: 'God, You are holy and You rescue Your people. Thank You for being with us. Amen.',
    culturalNote:
      'Passover (Pesach) is still celebrated by Jewish families each spring with a meal called a Seder. Exodus 12 commands the lamb, unleavened bread, and bitter herbs; many Seder customs (like the Seder plate and four cups) developed later in Jewish tradition.',
    days: [
      'Read Exodus 3:1–6. The burning bush. Introduce the verse.',
      'Read Exodus 3:7–15. God’s name and promise.',
      'Read Exodus 12:1–14 (summarize the plagues gently). Passover activity.',
      'Read Exodus 12:21–28. Review the verse.',
    ],
  },
  {
    week: 18,
    title: 'Unit 2 Review: Through the Red Sea',
    passage: 'Exodus 14:10–31; 15:1–2',
    shortReading: 'Exodus 14:21–22, 29–31',
    character: 'God’s faithfulness',
    objective: 'Children can retell the Red Sea crossing and review how God kept His promises from Abraham to Moses.',
    parentExplanation:
      'Trapped between the sea and Pharaoh’s army, Israel watches God make a way. Their response is a song (Exodus 15). Use this week to review the Unit 2 storyline: Abraham → Isaac → Jacob → Joseph → Moses — God keeps His covenant.',
    childExplanation:
      'God’s people were stuck: the sea in front, the army behind! Moses said, "Don’t be afraid. Watch God save you." God split the sea, and they walked through on dry ground! Then they sang a happy song to God.',
    questions: [
      'Why were the people afraid?',
      'What did God do?',
      'Can you name God’s promise-keepers in order: Abraham, Isaac, Jacob, Joseph, Moses?',
    ],
    verse: v(
      'Exodus 15:2',
      "The LORD is my strength and song, and he is become my salvation: he is my God, and I will prepare him an habitation; my father's God, and I will exalt him.",
      'The LORD is my strength and song',
    ),
    activity: 'Act it out: two blankets for the walls of water; walk through and sing.',
    prayer: 'God, You are our strength and our song. You keep every promise. Amen.',
    culturalNote:
      'Later, in the wilderness, God gave Israel the Feast of Booths (Sukkot; Leviticus 23:42–43), when families lived in shelters for a week to remember how God cared for them on the journey.',
    days: [
      'Read Exodus 14:10–14. Trapped! Introduce the verse.',
      'Read Exodus 14:21–31. The sea opens. Act it out.',
      'Read Exodus 15:1–2. Sing a song of praise.',
      'Unit 2 timeline review: Abraham to Moses.',
    ],
  },

  // ───────────────────────── Unit 3: Jesus Christ and Salvation ─────────────────────────
  {
    week: 19,
    title: 'Jesus Is Born',
    passage: 'Luke 2:1–20',
    shortReading: 'Luke 2:8–14',
    character: 'Joy',
    objective: 'Children can retell the birth of Jesus and say why the angels called it good news.',
    parentExplanation:
      'Luke anchors the birth in real history (Caesar Augustus) and announces it first to shepherds — ordinary, overlooked people. Jesus is the promised Savior from Genesis 3:15 and the son of David.',
    childExplanation:
      'Mary and Joseph traveled to Bethlehem. There was no room for them, so baby Jesus was born and laid in a manger. Angels told shepherds, "Good news! A Savior is born!" The shepherds hurried to see Jesus and told everyone.',
    questions: [
      'Where was Jesus born?',
      'Who did the angels tell first?',
      'Why is Jesus’ birth good news?',
    ],
    verse: v(
      'Luke 2:11',
      'For unto you is born this day in the city of David a Saviour, which is Christ the Lord.',
    ),
    activity: 'Set up a simple nativity with toys; children retell the story with it.',
    prayer: 'Thank You, God, for sending Jesus to be our Savior. Amen.',
    traditionNote:
      'Scripture does not give the date of Jesus’ birth; December 25 is a church tradition. Luke mentions a manger but does not mention an innkeeper or a stable building.',
    days: [
      'Read Luke 2:1–7. The trip to Bethlehem.',
      'Read Luke 2:8–14. The angels. Introduce the verse.',
      'Read Luke 2:15–20. Nativity retell.',
      'Review: why is Jesus’ birth good news?',
    ],
  },
  {
    week: 20,
    title: 'Wise Men Worship Jesus',
    passage: 'Matthew 2:1–12',
    shortReading: 'Matthew 2:9–11',
    character: 'Worship',
    objective: 'Children can tell how the wise men followed a star to find and worship Jesus.',
    parentExplanation:
      'Matthew shows Gentile scholars from the east worshipping Jesus as King — a sign that the Savior is for all nations, as promised to Abraham.',
    childExplanation:
      'Wise men from far away saw a special star. They followed it a long way to find the new King, Jesus. When they found Him, they bowed down, worshipped Him, and gave Him gifts: gold, frankincense, and myrrh.',
    questions: [
      'What did the wise men follow?',
      'What did they do when they found Jesus?',
      'What gift can we give Jesus?',
    ],
    verse: v(
      'Matthew 2:2',
      'Saying, Where is he that is born King of the Jews? for we have seen his star in the east, and are come to worship him.',
      'we have seen his star in the east, and are come to worship him',
    ),
    activity: 'Make a paper star; on its points write gifts we can give Jesus (love, obedience, kindness, praise, time).',
    prayer: 'Jesus, You are the King. We worship You. Amen.',
    traditionNote:
      'The Bible names three gifts but does not say how many wise men there were, and they visited a "house" (Matthew 2:11) — likely some time after the birth, not at the manger.',
    days: [
      'Read Matthew 2:1–2. The star. Introduce the verse.',
      'Read Matthew 2:3–8. King Herod.',
      'Read Matthew 2:9–12. Paper star activity.',
      'Review Christmas: shepherds and wise men — who came, and what did they do?',
    ],
  },
  {
    week: 21,
    title: 'Jesus Grows Up and Is Baptized',
    passage: 'Luke 2:41–52; Matthew 3:13–17',
    shortReading: 'Matthew 3:13–17',
    character: 'Growing in wisdom',
    objective: 'Children can tell one thing about Jesus as a boy and what happened at His baptism.',
    parentExplanation:
      'Luke 2:52 shows Jesus growing in every way. At His baptism, the Father speaks and the Spirit descends — a picture of the Trinity at the start of Jesus’ ministry.',
    childExplanation:
      'Jesus grew up just like you do — taller and wiser! When He was twelve, He listened and asked questions at God’s house. When Jesus was a grown-up, John baptized Him in the river. God the Father said from heaven, "This is my beloved Son," and the Holy Spirit came down like a dove.',
    questions: [
      'What was Jesus doing at God’s house when He was twelve?',
      'What did God say at Jesus’ baptism?',
      'How are you growing this year?',
    ],
    verse: v('Luke 2:52', 'And Jesus increased in wisdom and stature, and in favour with God and man.'),
    activity: 'Measure and mark each child’s height; name one way each is growing in wisdom.',
    prayer: 'God, help me grow like Jesus did — in wisdom and in love. Amen.',
    days: [
      'Read Luke 2:41–47. Jesus at twelve.',
      'Read Luke 2:48–52. Introduce the verse. Height chart.',
      'Read Matthew 3:13–17. The baptism.',
      'Review: Father, Son, and Spirit at the baptism.',
    ],
  },
  {
    week: 22,
    title: 'Jesus Calls His Disciples',
    passage: 'Matthew 4:18–22; Luke 5:1–11',
    shortReading: 'Matthew 4:18–22',
    character: 'Following Jesus',
    objective: 'Children can name the first disciples and explain what it means to follow Jesus.',
    parentExplanation:
      'Jesus calls ordinary fishermen. They leave their nets immediately. Following Jesus means learning from Him and living His way.',
    childExplanation:
      'Jesus walked by the sea and saw fishermen: Peter, Andrew, James, and John. Jesus said, "Follow Me!" Right away they left their nets and followed Jesus. Jesus wants us to follow Him too.',
    questions: [
      'What were Peter and Andrew doing when Jesus called them?',
      'What did they leave behind?',
      'What does it mean for a kid to follow Jesus?',
    ],
    verse: v(
      'Matthew 4:19',
      'And he saith unto them, Follow me, and I will make you fishers of men.',
      'Follow me, and I will make you fishers of men',
    ),
    activity: 'Follow-the-leader game, then talk about following Jesus’ example.',
    prayer: 'Jesus, I want to follow You. Help me listen and obey. Amen.',
    culturalNote: 'The Sea of Galilee is a freshwater lake in northern Israel; fishing was a major trade there.',
    days: [
      'Read Matthew 4:18–20. Introduce the verse.',
      'Read Matthew 4:21–22. Follow-the-leader.',
      'Read Luke 5:1–11. The big catch.',
      'Review: name the four fishermen.',
    ],
  },
  {
    week: 23,
    title: 'Jesus Teaches: The Good Samaritan',
    passage: 'Luke 10:25–37',
    shortReading: 'Luke 10:30–37',
    character: 'Loving our neighbor',
    objective: 'Children can retell the parable and explain that our neighbor is anyone who needs help.',
    parentExplanation:
      'Jesus answers "Who is my neighbor?" with a story where the hero is a Samaritan, someone Jesus’ listeners looked down on. Love crosses lines of difference.',
    childExplanation:
      'Jesus told a story. A man was hurt on the road. Two important people walked right past him! Then a Samaritan — someone people didn’t like — stopped, cleaned his hurts, and paid for his care. Jesus said, "Go and do the same."',
    questions: [
      'Who walked past the hurt man?',
      'Who stopped to help?',
      'Who is a neighbor you can help this week?',
    ],
    verse: v(
      'John 13:34',
      'A new commandment I give unto you, That ye love one another; as I have loved you, that ye also love one another.',
      'A new commandment I give unto you, That ye love one another',
    ),
    activity: 'Bandage practice: care for a stuffed animal "on the road"; plan one real helping act.',
    prayer: 'Jesus, help me see people who need help, and help me love them. Amen.',
    culturalNote: 'Samaritans and Jews of Jesus’ day had a long history of conflict and avoided one another.',
    days: [
      'Read Luke 10:25–29. The question.',
      'Read Luke 10:30–37. The story. Introduce the verse.',
      'Bandage practice activity.',
      'Review: do the helping act; share how it went.',
    ],
  },
  {
    week: 24,
    title: 'Jesus Calms the Storm',
    passage: 'Mark 4:35–41',
    shortReading: 'Mark 4:35–41',
    character: 'Peace when afraid',
    objective: 'Children can retell how Jesus calmed the storm and say what to do when they feel afraid.',
    parentExplanation:
      'The miracle reveals Jesus’ authority over creation and asks, "Who is this?" It also models bringing our fear to Jesus.',
    childExplanation:
      'Jesus and His friends were in a boat when a huge storm came. Waves crashed in! Jesus was asleep. The friends woke Him up: "Don’t You care?" Jesus stood up and said, "Peace, be still." The wind stopped. Everything was calm!',
    questions: [
      'What was Jesus doing during the storm?',
      'What did Jesus say to the wind and waves?',
      'What can you do when you feel scared?',
    ],
    verse: v(
      'Mark 4:39',
      'And he arose, and rebuked the wind, and said unto the sea, Peace, be still. And the wind ceased, and there was a great calm.',
      'Peace, be still',
    ),
    activity: 'Calm-down practice: storm sounds (pat legs, stomp), then "Peace, be still" and a slow breath.',
    prayer: 'Jesus, when I feel scared, help me remember You are with me and You are strong. Amen.',
    days: [
      'Read Mark 4:35–38. The storm. Introduce the verse.',
      'Read Mark 4:39–41. "Peace, be still."',
      'Calm-down practice and make a calm-down card.',
      'Review: retell with motions.',
    ],
  },
  {
    week: 25,
    title: 'Jesus Feeds the Five Thousand',
    passage: 'John 6:1–14, 35',
    shortReading: 'John 6:8–13',
    character: 'Generosity',
    objective: 'Children can retell the miracle and explain that Jesus is the "bread of life."',
    parentExplanation:
      'A boy offers five loaves and two fish; Jesus multiplies it. The next day Jesus explains the sign: He Himself is what our souls need (John 6:35).',
    childExplanation:
      'A huge crowd was hungry. A boy shared his lunch: five little loaves of bread and two fish. Jesus thanked God and passed it out — and everyone ate until they were full! There were twelve baskets left over. Jesus said, "I am the bread of life."',
    questions: [
      'What did the boy share?',
      'How many baskets were left over?',
      'What does Jesus mean, "I am the bread of life"?',
    ],
    verse: v(
      'John 6:35',
      'And Jesus said unto them, I am the bread of life: he that cometh to me shall never hunger; and he that believeth on me shall never thirst.',
      'I am the bread of life',
    ),
    activity: 'Count it out: 5 crackers and 2 fish crackers; then share a snack with the family.',
    prayer: 'Jesus, You are the bread of life. Help me share what I have. Amen.',
    days: [
      'Read John 6:1–7. A hungry crowd.',
      'Read John 6:8–14. The miracle. Introduce the verse.',
      'Count-and-share snack.',
      'Read John 6:35. Review Jesus’ miracles so far (storm, food).',
    ],
  },
  {
    week: 26,
    title: 'The Cross: God So Loved the World',
    passage: 'Luke 23:32–49',
    shortReading: 'Luke 23:44–47',
    character: 'God’s love',
    objective: 'Children can say that Jesus died on the cross because of our sin and because God loves us.',
    parentExplanation:
      'Keep the account truthful but gentle: Jesus chose to give His life; He forgave those who hurt Him (23:34); the thief was promised paradise (23:43). Connect to Genesis 3: the promised Rescuer.',
    childExplanation:
      'Some people did not believe Jesus and had Him put on a cross. It was a very sad day. But Jesus chose to give His life to take away our sin, because God loves us so much. Even on the cross, Jesus forgave people. And the story isn’t over…',
    questions: [
      'Why did Jesus die on the cross?',
      'Who did Jesus forgive?',
      'How much does God love you?',
    ],
    verse: v(
      'John 3:16',
      'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
      'For God so loved the world',
    ),
    activity: 'Make a simple paper cross and write "God so loved" on it.',
    prayer: 'Thank You, Jesus, for loving me and giving Your life for me. Amen.',
    days: [
      'Read Luke 23:32–38. Introduce the verse.',
      'Read Luke 23:39–43. The thief on the cross.',
      'Read Luke 23:44–49. Paper cross activity.',
      'Review John 3:16. Talk about questions children have.',
    ],
  },
  {
    week: 27,
    title: 'He Is Risen! The Gift of Salvation',
    passage: 'Luke 24:1–12; Romans 10:9',
    shortReading: 'Luke 24:1–8',
    character: 'Hope',
    objective: 'Children can tell that Jesus rose from the dead and explain salvation simply: believe in Jesus and trust Him.',
    parentExplanation:
      'The resurrection is the center of the gospel. Salvation is a gift received by faith (Ephesians 2:8–9). Invite, never pressure: answer questions and let children respond in their own time.',
    childExplanation:
      'On Sunday morning, women went to Jesus’ tomb. The big stone was rolled away and the tomb was empty! Angels said, "He is not here — He is risen!" Jesus is alive! Because Jesus died and rose again, anyone who believes in Him can be forgiven and live with God forever.',
    questions: [
      'What did the women find at the tomb?',
      'What did the angels say?',
      'Why is "He is risen!" the best news?',
    ],
    verse: v(
      'Matthew 28:6',
      'He is not here: for he is risen, as he said. Come, see the place where the Lord lay.',
      'He is not here: for he is risen, as he said.',
    ),
    activity: 'Empty-tomb surprise: hide a cup or box with nothing inside; "open the tomb" and shout "He is risen!"',
    prayer: 'Jesus, You are alive! Thank You for the gift of being forgiven. Amen.',
    days: [
      'Read Luke 24:1–8. The empty tomb. Introduce the verse.',
      'Read Luke 24:9–12. Running to tell.',
      'Empty-tomb surprise. Read Romans 10:9.',
      'Unit 3 review: Jesus’ birth, life, death, and resurrection.',
    ],
  },

  // ───────────────────────── Unit 4: Christian Living and Spiritual Growth ─────────────────────────
  {
    week: 28,
    title: 'Jesus Teaches Us to Pray',
    passage: 'Matthew 6:5–13',
    shortReading: 'Matthew 6:9–13',
    character: 'Prayer',
    objective: 'Children can say the first line of the Lord’s Prayer and name four kinds of prayer (praise, sorry, thanks, asking).',
    parentExplanation:
      'Jesus warns against showy prayer and gives a pattern: honor God, seek His kingdom, ask for daily needs, ask forgiveness and forgive, ask for protection.',
    childExplanation:
      'Jesus’ friends asked Him how to pray. Jesus said we can talk to God like a loving Father. We can tell God He is great, say sorry, say thank you, and ask for help. God always listens!',
    questions: [
      'Who can we talk to when we pray?',
      'What are some things we can say to God?',
      'When can we pray?',
    ],
    verse: v(
      'Matthew 6:9',
      'After this manner therefore pray ye: Our Father which art in heaven, Hallowed be thy name.',
      'Our Father which art in heaven, Hallowed be thy name.',
    ),
    activity: 'Prayer hand: trace a hand; label fingers praise, sorry, thanks, ask, others.',
    prayer: 'Use the prayer hand together, one finger each child.',
    days: [
      'Read Matthew 6:5–8. Introduce the verse.',
      'Read Matthew 6:9–13. Prayer hand.',
      'Pray through the prayer hand together.',
      'Review: start a family prayer list.',
    ],
  },
  {
    week: 29,
    title: 'The Holy Spirit Comes',
    passage: 'Acts 1:8; 2:1–12, 41–47',
    shortReading: 'Acts 2:1–6',
    character: 'God’s helper',
    objective: 'Children can say who the Holy Spirit is and what happened on the day of Pentecost.',
    parentExplanation:
      'Jesus promised the Spirit would give power to be His witnesses. At Pentecost, the Spirit came with wind and fire, and the good news crossed languages. The church grew in sharing, prayer, and praise.',
    childExplanation:
      'Jesus went back to heaven and promised to send a Helper: the Holy Spirit. Jesus’ friends were praying together when a sound like a big wind filled the house! The Holy Spirit helped them tell people about Jesus in many languages. That day, the church began to grow!',
    questions: [
      'Who did Jesus promise to send?',
      'What did people hear and see at Pentecost?',
      'How does the Holy Spirit help us?',
    ],
    verse: v(
      'Acts 1:8',
      'But ye shall receive power, after that the Holy Ghost is come upon you: and ye shall be witnesses unto me both in Jerusalem, and in all Judaea, and in Samaria, and unto the uttermost part of the earth.',
      'ye shall be witnesses unto me',
    ),
    activity: 'Wind experiment: blow through a straw to move a paper; we can’t see wind, but we see what it does.',
    prayer: 'Holy Spirit, help me know Jesus and tell others about Him. Amen.',
    culturalNote:
      'Pentecost was the Jewish harvest festival Shavuot (Feast of Weeks), fifty days after Passover — which is why visitors from many nations were in Jerusalem (Acts 2:5).',
    days: [
      'Read Acts 1:6–11. Jesus’ promise. Introduce the verse.',
      'Read Acts 2:1–6. Pentecost. Wind experiment.',
      'Read Acts 2:7–12. Say "Jesus loves you" in another language.',
      'Read Acts 2:41–47. How the church lived together.',
    ],
  },
  {
    week: 30,
    title: 'Fruit of the Spirit: Love, Joy, Peace',
    passage: 'Galatians 5:22–23; John 15:1–5',
    shortReading: 'John 15:1–5',
    character: 'Love, joy, peace',
    objective: 'Children can name the fruit of the Spirit and explain that it grows as we stay close to Jesus.',
    parentExplanation:
      'The fruit is singular — one character growing in nine ways — and it grows by abiding in Christ (John 15), not by trying harder alone.',
    childExplanation:
      'Apples grow on apple trees. When we stay close to Jesus, good "fruit" grows in our hearts: love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control. This week: love, joy, and peace!',
    questions: [
      'How does fruit grow?',
      'What is one way to show love today?',
      'What helps you feel peace?',
    ],
    verse: v(
      'Galatians 5:22–23',
      'But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, Meekness, temperance: against such there is no law.',
      'the fruit of the Spirit is love, joy, peace',
    ),
    activity: 'Fruit basket: draw nine fruits, label each with one fruit of the Spirit.',
    prayer: 'Holy Spirit, grow love, joy, and peace in me. Amen.',
    traditionNote:
      'KJV words: "longsuffering" = patience, "meekness" = gentleness, "temperance" = self-control, "faith" = faithfulness.',
    days: [
      'Read John 15:1–5. Introduce the verse.',
      'Read Galatians 5:22–23. Fruit basket.',
      'Love, joy, peace role-plays.',
      'Review: name all nine fruits.',
    ],
  },
  {
    week: 31,
    title: 'Fruit of the Spirit: Patience, Kindness, Self-Control',
    passage: 'Ephesians 4:29–32; Proverbs 15:1',
    shortReading: 'Ephesians 4:29–32',
    character: 'Kindness and self-control',
    objective: 'Children can practice kind words and two self-control strategies.',
    parentExplanation:
      'Paul applies the Spirit’s fruit to speech: words that build up, and forgiveness modeled on God’s forgiveness. Teach concrete strategies (pause, breathe, ask for help) as tools, not as a test of spirituality.',
    childExplanation:
      'God wants our words to help people, not hurt them. When we feel angry or want something right now, the Holy Spirit can help us wait, be kind, and stop to think. Kind words are like gifts!',
    questions: [
      'What is a kind word you can say?',
      'What can you do when you feel angry?',
      'How did God show kindness to us?',
    ],
    verse: v(
      'Ephesians 4:32',
      "And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ's sake hath forgiven you.",
      'And be ye kind one to another',
    ),
    activity: 'Kind-word jar: write kind things family members say this week and read them Friday.',
    prayer: 'Holy Spirit, help me be patient and kind, and help me stop and think. Amen.',
    days: [
      'Read Ephesians 4:29–32. Introduce the verse.',
      'Read Proverbs 15:1. Soft answer practice. Start the kind-word jar.',
      'Practice self-control: freeze game; "stop, breathe, choose."',
      'Review: read the kind-word jar.',
    ],
  },
  {
    week: 32,
    title: 'The Armor of God',
    passage: 'Ephesians 6:10–18',
    shortReading: 'Ephesians 6:13–17',
    character: 'Standing strong',
    objective: 'Children can name the pieces of the armor of God and what each stands for.',
    parentExplanation:
      'Paul uses a Roman soldier’s gear to picture spiritual resources: truth, righteousness, the gospel of peace, faith, salvation, God’s Word, and prayer.',
    childExplanation:
      'A soldier wears armor to stay safe. God gives us armor too! The belt of truth, the breastplate of righteousness, shoes of peace, the shield of faith, the helmet of salvation, and the sword of the Spirit — God’s Word. And we pray!',
    questions: [
      'What is the sword of the Spirit?',
      'What does the shield of faith protect us from?',
      'Which piece of armor do you need today?',
    ],
    verse: v(
      'Ephesians 6:10',
      'Finally, my brethren, be strong in the Lord, and in the power of his might.',
      'be strong in the Lord, and in the power of his might',
    ),
    activity: 'Dress-up armor: kitchen pot helmet, cardboard shield; name each piece as you put it on.',
    prayer: 'God, help me be strong in You. Thank You for Your armor. Amen.',
    culturalNote: 'Roman soldiers were a common sight in Paul’s day; he wrote Ephesians while under Roman guard.',
    days: [
      'Read Ephesians 6:10–13. Introduce the verse.',
      'Read Ephesians 6:14–15. Belt, breastplate, shoes.',
      'Read Ephesians 6:16–18. Shield, helmet, sword, prayer. Dress-up.',
      'Review: name the armor in order.',
    ],
  },
  {
    week: 33,
    title: 'Loving Others',
    passage: '1 Corinthians 13:4–7; 1 John 4:7–11, 19',
    shortReading: '1 Corinthians 13:4–7',
    character: 'Love',
    objective: 'Children can describe what love looks like in actions, especially toward siblings.',
    parentExplanation:
      'Love is defined by actions: patient, kind, not envious, not self-seeking. We love because God first loved us. This pairs naturally with the Family Learning module on understanding each other’s needs.',
    childExplanation:
      'The Bible tells us what love is like: love is patient (it waits). Love is kind. Love doesn’t brag or push to be first. We can love others because God loved us first!',
    questions: [
      'What does patient love look like with a brother or sister?',
      'How did God love us first?',
      'Who can you show love to today?',
    ],
    verse: v('1 John 4:19', 'We love him, because he first loved us.'),
    activity: 'Secret sibling helper: each child secretly does one loving act for a sibling.',
    prayer: 'God, thank You for loving me first. Help me love my family well. Amen.',
    traditionNote: 'Where the KJV says "charity" in 1 Corinthians 13, it means self-giving love.',
    days: [
      'Read 1 Corinthians 13:4–5. Introduce the verse.',
      'Read 1 Corinthians 13:6–7. Secret sibling helper.',
      'Read 1 John 4:7–11. Love comes from God.',
      'Review: share secret-helper acts.',
    ],
  },
  {
    week: 34,
    title: 'Serving God: Jesus Washes Feet',
    passage: 'John 13:1–17',
    shortReading: 'John 13:3–9',
    character: 'Humble service',
    objective: 'Children can retell how Jesus served His disciples and plan a way to serve.',
    parentExplanation:
      'Washing feet was a servant’s job. Jesus, the Teacher and Lord, does it to model humble love and says, "ye also ought to wash one another’s feet."',
    childExplanation:
      'Roads were dusty, and feet got dirty. Washing feet was a job for servants. But Jesus, the King, got down and washed His friends’ feet! He said, "Do what I did. Serve each other."',
    questions: [
      'Why was it surprising that Jesus washed feet?',
      'What did Jesus want His friends to learn?',
      'How can you serve someone today?',
    ],
    verse: v(
      'Galatians 5:13',
      'For, brethren, ye have been called unto liberty; only use not liberty for an occasion to the flesh, but by love serve one another.',
      'by love serve one another',
    ),
    activity: 'Serving station: kids serve snack or wash a family member’s hands with a warm cloth.',
    prayer: 'Jesus, help me serve others the way You served. Amen.',
    culturalNote: 'People walked dusty roads in sandals, so a host offered water for guests’ feet.',
    days: [
      'Read John 13:1–5. Introduce the verse.',
      'Read John 13:6–11. Peter’s reaction.',
      'Read John 13:12–17. Serving station.',
      'Review: plan a family service project for a neighbor.',
    ],
  },
  {
    week: 35,
    title: 'Go and Tell: The Great Commission',
    passage: 'Matthew 28:16–20',
    shortReading: 'Matthew 28:16–20',
    character: 'Sharing good news',
    objective: 'Children can say what Jesus told His followers to do and practice telling the gospel simply.',
    parentExplanation:
      'Jesus’ final command rests on His authority and ends with His promise of presence. Children can share simply: God made us, we sinned, Jesus died and rose, we can trust Him.',
    childExplanation:
      'Before Jesus went back to heaven, He told His friends, "Go everywhere and help people follow Me. And remember, I am with you always." We can tell others about Jesus too!',
    questions: [
      'What job did Jesus give His followers?',
      'What did Jesus promise at the end?',
      'Who could you tell about Jesus?',
    ],
    verse: v(
      'Matthew 28:20',
      'Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you alway, even unto the end of the world. Amen.',
      'lo, I am with you alway, even unto the end of the world',
    ),
    activity: 'Good-news bracelet or color strip: black (sin), red (Jesus’ love), white (forgiven), green (growing), gold (heaven).',
    prayer: 'Jesus, help me be brave and kind as I tell others about You. Amen.',
    traditionNote: '"Alway" is the KJV spelling of "always."',
    days: [
      'Read Matthew 28:16–18. Introduce the verse.',
      'Read Matthew 28:19–20. Good-news colors.',
      'Practice telling the good news to a stuffed animal or grandparent.',
      'Review: where in the world are Christians today? (globe)',
    ],
  },
  {
    week: 36,
    title: 'Year Review: Growing in Grace',
    passage: 'Psalm 136:1–9, 26; 2 Peter 3:18',
    shortReading: 'Psalm 136:1–5',
    character: 'Thankfulness and growth',
    objective: 'Children can retell the big story of the year (Creation → promises → Jesus → growing in Him) and celebrate growth.',
    parentExplanation:
      'Psalm 136 retells Israel’s history with the refrain "his mercy endureth for ever." Do the same with your year: retell God’s story and your family’s story with thanks.',
    childExplanation:
      'This year we learned God’s big story! God made the world. God made promises to Abraham, Isaac, Jacob, Joseph, and Moses. God sent Jesus to save us. God’s Spirit helps us grow. Let’s thank God for everything we learned!',
    questions: [
      'What was your favorite Bible story this year?',
      'What memory verse do you remember best?',
      'How did you grow this year?',
    ],
    verse: v(
      '2 Peter 3:18',
      'But grow in grace, and in the knowledge of our Lord and Saviour Jesus Christ. To him be glory both now and for ever. Amen.',
      'But grow in grace',
    ),
    activity: 'Big Story timeline: lay drawings from the year in order on the floor and walk through it.',
    prayer: 'Thank You, God, for this school year and for all we learned about You. Amen.',
    days: [
      'Read Psalm 136:1–9. Units 1–2 review.',
      'Read Psalm 136:10–26 (selected). Units 3–4 review. Introduce the verse.',
      'Big Story timeline.',
      'Celebration: recite favorite verses; pray thanks.',
    ],
  },
]

/** Seasonal swaps — offered automatically when the date falls in the season. */
export interface SeasonalLesson {
  id: 'thanksgiving' | 'advent' | 'easter'
  title: string
  passage: string
  shortReading: string
  childExplanation: string
  questions: string[]
  verse: MemoryVerse
  activity: string
  traditionNote: string
}

export const SEASONAL_LESSONS: SeasonalLesson[] = [
  {
    id: 'thanksgiving',
    title: 'Thanksgiving: The One Who Said Thank You',
    passage: 'Luke 17:11–19',
    shortReading: 'Luke 17:12–16',
    childExplanation:
      'Jesus healed ten sick men. Only one came back to say thank you! Jesus was glad he remembered. We can remember to thank God every day.',
    questions: ['How many men did Jesus heal?', 'How many said thank you?', 'What are you thankful for?'],
    verse: v(
      '1 Thessalonians 5:18',
      'In every thing give thanks: for this is the will of God in Christ Jesus concerning you.',
      'In every thing give thanks',
    ),
    activity: 'Thankful tablecloth: each person writes or draws thanks on paper at the table.',
    traditionNote: 'Thanksgiving Day is a national holiday, not a biblical feast, but giving thanks is commanded throughout Scripture.',
  },
  {
    id: 'advent',
    title: 'Advent: Waiting for the Promised King',
    passage: 'Isaiah 9:2, 6–7; Luke 1:26–38',
    shortReading: 'Luke 1:26–33',
    childExplanation:
      'Long before Jesus was born, God promised through Isaiah that a special child would come. Then the angel Gabriel told Mary she would have a baby named Jesus. Advent means "coming" — we get ready to celebrate Jesus coming!',
    questions: [
      'Who told Mary about Jesus?',
      'What names did Isaiah give the promised child?',
      'How can our family get ready to celebrate Jesus?',
    ],
    verse: v(
      'Isaiah 9:6',
      'For unto us a child is born, unto us a son is given: and the government shall be upon his shoulder: and his name shall be called Wonderful, Counsellor, The mighty God, The everlasting Father, The Prince of Peace.',
      'For unto us a child is born, unto us a son is given',
    ),
    activity: 'Paper chain countdown to Christmas with one promise of God on each link.',
    traditionNote:
      'Advent wreaths and candles are a church tradition (not commanded in Scripture) that many families use to count the four Sundays before Christmas.',
  },
  {
    id: 'easter',
    title: 'Holy Week: Hosanna to the King',
    passage: 'Matthew 21:1–11; 28:1–10',
    shortReading: 'Matthew 21:6–9',
    childExplanation:
      'Jesus rode into Jerusalem on a donkey. People waved palm branches and shouted "Hosanna!" That same week Jesus died on the cross — and on Sunday He rose again! That is why we celebrate Easter.',
    questions: ['What did people wave?', 'What does "Hosanna" mean? (Save us!)', 'What happened on Easter morning?'],
    verse: v(
      'John 11:25',
      'Jesus said unto her, I am the resurrection, and the life: he that believeth in me, though he were dead, yet shall he live:',
      'I am the resurrection, and the life',
    ),
    activity: 'Palm parade with paper leaves, then an empty-tomb snack or craft on Friday.',
    traditionNote:
      'Holy Week names (Palm Sunday, Good Friday) and Easter eggs are church and cultural traditions; the events of the week are recorded in all four Gospels.',
  },
]

export function getBibleWeek(week: number): BibleWeek {
  return BIBLE_WEEKS.find((b) => b.week === week) ?? BIBLE_WEEKS[0]
}

// ---- Season detection (computed, not hard-coded per year) --------------------

/** Western (Gregorian) Easter Sunday — Anonymous Gregorian algorithm. */
export function easterSunday(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

/** US Thanksgiving: fourth Thursday of November. */
export function thanksgivingDay(year: number): Date {
  const first = new Date(year, 10, 1)
  const offset = (4 - first.getDay() + 7) % 7
  return new Date(year, 10, 1 + offset + 21)
}

const DAY = 86_400_000
const atMidnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

export function seasonFor(date: Date): SeasonalLesson | null {
  const t = atMidnight(date).getTime()
  const y = date.getFullYear()
  const tg = thanksgivingDay(y).getTime()
  if (t >= tg - 3 * DAY && t <= tg + 1 * DAY) return SEASONAL_LESSONS[0]
  const advStart = new Date(y, 11, 1).getTime()
  const xmas = new Date(y, 11, 24).getTime()
  if (t >= advStart && t <= xmas) return SEASONAL_LESSONS[1]
  const easter = easterSunday(y).getTime()
  if (t >= easter - 7 * DAY && t <= easter + 1 * DAY) return SEASONAL_LESSONS[2]
  return null
}
