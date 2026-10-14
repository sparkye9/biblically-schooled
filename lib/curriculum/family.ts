/**
 * Family Learning: Understanding Each Other — an optional, affirming module
 * that helps siblings understand autism and neurodiversity.
 *
 * Principles: autistic children are not problems to be fixed; every child's
 * feelings, boundaries, and needs matter; fairness means everyone gets what
 * they need, not the same thing. Stories are original and use invented
 * children so no one in the family is singled out.
 */

export interface FamilyLesson {
  id: string
  title: string
  bigIdea: string
  scripture?: { ref: string; text: string }
  story: string
  discuss: string[]
  activity: string
  empathy: string
  /** Prompts for the printable feelings worksheet. */
  feelings: string[]
  parentNote: string
}

export const FAMILY_LESSONS: FamilyLesson[] = [
  {
    id: 'fl-1',
    title: 'What Is Autism?',
    bigIdea: 'Autism is one way a brain can work. Autistic people experience the world in their own way, and they are wonderfully made by God.',
    scripture: { ref: 'Psalm 139:14', text: 'I will praise thee; for I am fearfully and wonderfully made: marvellous are thy works; and that my soul knoweth right well.' },
    story:
      'Mia loves trains. She knows every train color and the sound each one makes. Sometimes Mia talks a lot about trains, and sometimes she likes quiet time alone. Mia’s brother Sam asked Mom, “Why is Mia different?” Mom said, “Mia is autistic. Her brain works in its own way. It helps her notice details many people miss. Some things are harder for her, like loud places. Everyone has things that are easy and things that are hard.”',
    discuss: ['What is something that is easy for you? Something hard?', 'What does Mia notice that others might miss?', 'How did God make each person in our family special?'],
    activity: 'Make an “Easy for me / Hard for me” chart for every family member — grown-ups too.',
    empathy: 'Each person shares one thing that is hard for them, and the family says one way they could help.',
    feelings: ['Something that is easy for me is…', 'Something that is hard for me is…'],
    parentNote: 'Use the word “autistic” or “autism” simply and calmly. Many autistic adults prefer identity-first language (“autistic person”); follow your own child’s preference as they grow.',
  },
  {
    id: 'fl-2',
    title: 'Brains Work Differently',
    bigIdea: 'Every brain is different. Different is not better or worse — it’s how God made a world full of variety.',
    scripture: { ref: '1 Corinthians 12:12', text: 'For as the body is one, and hath many members, and all the members of that one body, being many, are one body: so also is Christ.' },
    story:
      'Ben and Leah were building a tower. Ben liked to plan every block first. Leah liked to try things fast. At first they argued. Then Ben made the plan and Leah tested it. Their tower was the tallest ever! Their different brains made a great team.',
    discuss: ['How do you like to learn new things?', 'How can two different ways be a good team?', 'How is our family like the body in 1 Corinthians 12?'],
    activity: 'Team tower: two people build together, one planning and one trying.',
    empathy: 'Say “I like how your brain works because…” to each sibling.',
    feelings: ['I learn best when…', 'I like how my sibling’s brain works because…'],
    parentNote: 'Highlight strengths in each child. Avoid comparing children’s speed or abilities in front of each other.',
  },
  {
    id: 'fl-3',
    title: 'Senses: Too Loud, Too Bright, Just Right',
    bigIdea: 'Some people feel sounds, lights, clothes, or tastes much more strongly. Their bodies are telling them something real.',
    story:
      'At the birthday party, Noah covered his ears and hid under the table. His sister Grace was confused — she loved the music. Later Noah said, “The music felt like it was inside my head.” Grace brought him his headphones next time, and Noah stayed at the party longer.',
    discuss: ['Is there a sound, light, or feeling that bothers you?', 'What helped Noah?', 'What helps you feel calm?'],
    activity: 'Senses explorer: try soft vs. scratchy fabric, quiet vs. loud music, dim vs. bright light. Rate each “too much,” “just right,” or “too little.”',
    empathy: 'Make a “calm kit” together (headphones, soft toy, fidget, a book) that anyone can use.',
    feelings: ['A sound that bothers me is…', 'Something that helps me feel calm is…'],
    parentNote: 'Sensory differences are common in autism. Treat sensory needs as real needs, not as misbehavior.',
  },
  {
    id: 'fl-4',
    title: 'Many Ways to Communicate',
    bigIdea: 'People talk in many ways: words, pictures, signs, devices, writing, and actions. Every way counts.',
    story:
      'Caleb doesn’t always use many words. He shows what he wants by bringing pictures or pointing. When his sister Anna learned to wait and watch, she understood him much better. Caleb smiled and handed her the picture of the park — he wanted to play with her!',
    discuss: ['What are some ways we can say “I love you” without words?', 'Why is waiting and watching helpful?', 'How do you like people to talk to you when you’re upset?'],
    activity: 'Silent conversation: communicate a message with only pictures and gestures for 3 minutes.',
    empathy: 'Practice asking, waiting 5 seconds, and noticing — without rushing.',
    feelings: ['One way I can show love without words is…', 'When I’m upset, I want people to…'],
    parentNote: 'Some autistic children echo phrases, script from shows, or avoid eye contact. These are ways of communicating and processing, not rudeness.',
  },
  {
    id: 'fl-5',
    title: 'Big Feelings and Calming Down',
    bigIdea: 'Everyone has big feelings. A meltdown is not the same as being naughty — it means someone’s body is overwhelmed.',
    scripture: { ref: 'Psalm 46:1', text: 'God is our refuge and strength, a very present help in trouble.' },
    story:
      'When the plan changed suddenly, Eli cried and couldn’t stop. His sister Hannah felt scared. Dad said, “Eli’s body is overwhelmed. We keep him safe and give him quiet.” Later, when Eli felt better, he and Hannah made a picture schedule so changes wouldn’t be such a surprise.',
    discuss: ['What does your body feel like when you’re very upset?', 'What can a sibling do during a meltdown? (Give space, stay safe, get a grown-up.)', 'How can we tell someone about a change ahead of time?'],
    activity: 'Make a family calm-down plan with pictures: breathe, hug or no hug, quiet place, ask for help.',
    empathy: 'Practice “space and safety”: one person pretends to be overwhelmed; others practice giving space and getting a grown-up.',
    feelings: ['When I have big feelings my body feels…', 'Something that helps me calm down is…'],
    parentNote: 'Siblings may feel frightened, embarrassed, or angry during meltdowns. Name those feelings and debrief afterward — their feelings matter too.',
  },
  {
    id: 'fl-6',
    title: 'Learning in Different Ways',
    bigIdea: 'Some people learn by seeing, some by doing, some by hearing. Using the way that works best is smart, not cheating.',
    story:
      'Lydia learns spelling by writing words in sand. Isaac learns by singing them. Their mom gives each one a different tool. Isaac said, “No fair, Lydia gets sand!” Lydia said, “You get to sing!” They both learned their words.',
    discuss: ['How do you like to learn best?', 'Is it fair that Lydia and Isaac use different tools?', 'How can we help each other learn?'],
    activity: 'Learn one Bible verse three ways: sing it, act it, and draw it. Vote for your favorite way.',
    empathy: 'Teach a sibling something you’re good at, in the way that works for them.',
    feelings: ['I learn best by…', 'I can help my sibling learn by…'],
    parentNote: 'Learning supports are about access, not lower expectations. Autistic children can meet high expectations with the right supports.',
  },
  {
    id: 'fl-7',
    title: 'Respecting Boundaries',
    bigIdea: 'Everyone has a right to say “stop,” “no thank you,” or “I need space” — and everyone’s boundaries matter.',
    story:
      'Sam liked big hugs. His brother Jonah did not — hugs felt too tight. Jonah said, “No hugs, but high fives are okay!” Sam felt a little sad at first. Then they made up a secret high-five handshake that was just theirs.',
    discuss: ['What are ways to show love besides hugs?', 'What should we do when someone says “stop”?', 'What is a boundary you have?'],
    activity: 'Invent a special greeting with each sibling (high five, wave, elbow bump, wiggle).',
    empathy: 'Practice: “Can I…?” → listen → respect the answer, every time.',
    feelings: ['A boundary I have is…', 'A way I like to show love is…'],
    parentNote: 'Make sure boundaries go both ways: the autistic child’s needs and the neurotypical sibling’s needs (e.g., their room, their toys) are both protected.',
  },
  {
    id: 'fl-8',
    title: 'Being a Sibling: Your Feelings Matter Too',
    bigIdea: 'It’s okay to feel happy, proud, frustrated, jealous, or confused about your sibling. All feelings are welcome, and you can always talk about them.',
    scripture: { ref: '1 Peter 5:7', text: 'Casting all your care upon him; for he careth for you.' },
    story:
      'Ruth loved her brother, but sometimes she felt left out when Mom spent extra time helping him. One night she told Mom. Mom hugged her and said, “Thank you for telling me.” Every Thursday became Ruth-and-Mom time — just the two of them.',
    discuss: ['What do you love about your sibling?', 'What is hard about being a sibling sometimes?', 'Who can you talk to when you feel left out?'],
    activity: 'Plan one-on-one time: each child picks a 15-minute activity with a parent this week.',
    empathy: 'Write or draw a thank-you card for a sibling.',
    feelings: ['Something I love about my sibling is…', 'Sometimes I feel… and I can tell…'],
    parentNote: 'Neurotypical siblings sometimes carry worry or try to be “the easy one.” Give them protected one-on-one time and permission to have hard feelings.',
  },
  {
    id: 'fl-9',
    title: 'Fair Doesn’t Always Mean the Same',
    bigIdea: 'Fair means everyone gets what they need — not that everyone gets the same thing.',
    scripture: { ref: 'Galatians 6:2', text: "Bear ye one another's burdens, and so fulfil the law of Christ." },
    story:
      'At dinner, Anna needed glasses to see, Ben needed a booster seat to reach, and Grace needed headphones because the kitchen was loud. Ben asked, “Should everyone get glasses so it’s fair?” Everyone laughed. “No!” said Anna. “Fair is when everyone gets what helps THEM.”',
    discuss: ['Would it help you to wear someone else’s glasses?', 'What does each person in our family need to do their best?', 'How does Jesus care for each person differently?'],
    activity: 'Bandage game: everyone has a pretend “hurt” in a different place; does everyone need the bandage on their knee? Talk about fairness.',
    empathy: 'Name one thing each family member needs, and one way to help them get it.',
    feelings: ['Something I need to do my best is…', 'Something my sibling needs is…'],
    parentNote: 'This is the key idea for siblings. Return to it whenever “that’s not fair!” comes up.',
  },
]

export interface FamilyResource {
  name: string
  url: string
  who: string
  /** ISO date the link was last confirmed to load, or null if not yet checked. */
  checked: string | null
}

/**
 * Reputable organizations (homepages, which change least often). Links could
 * not be checked from the build environment (no internet access), so
 * `checked` is null until `npm run check:links` is run where internet is
 * available. The app shows this status to the parent.
 */
export const FAMILY_RESOURCES: FamilyResource[] = [
  { name: 'CDC — Autism Spectrum Disorder', url: 'https://www.cdc.gov/autism/', who: 'Parents: plain-language facts from the U.S. Centers for Disease Control and Prevention', checked: null },
  { name: 'Autistic Self Advocacy Network', url: 'https://autisticadvocacy.org/', who: 'Parents: perspectives from autistic people themselves', checked: null },
  { name: 'National Autistic Society (UK)', url: 'https://www.autism.org.uk/', who: 'Parents and siblings: guides on sensory differences, communication, and family life', checked: null },
  { name: 'KidsHealth (Nemours)', url: 'https://kidshealth.org/', who: 'Kids and parents: child-friendly health explanations (search “autism”)', checked: null },
]
