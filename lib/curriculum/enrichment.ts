import type { EnrichmentActivity, EnrichmentWeek } from './types'

/**
 * Rotating enrichment — science, art, social studies, practical life skills,
 * and a library mission for each of the 36 weeks. Family-style: one activity
 * for everyone, with a stretch for older learners in `gradeNotes`.
 * Science follows K–1 Next Generation Science Standards themes (living things,
 * weather, push/pull, light and sound, plants and animals, Earth's resources).
 *
 * Library missions name a topic to ask the librarian about rather than
 * specific titles, so the family is never sent looking for a book that the
 * library does not carry.
 */

type A = [title: string, objective: string, materials: string[], steps: string[], talk: string, prepHeavy?: boolean, older?: string]

const act = ([title, objective, materials, steps, talk, prepHeavy, older]: A): EnrichmentActivity => ({
  title,
  objective,
  materials,
  steps,
  talk,
  prepHeavy,
  gradeNotes: older ? { '1st': older } : undefined,
})

const SCIENCE: A[] = [
  ['Living and Nonliving', 'Sort things that grow, need food, and reproduce from things that don’t.', ['A basket of objects and pictures (rock, leaf, toy, apple)'], ['Ask: "Does it grow? Does it eat or drink?"', 'Sort into two piles.', 'Go outside and find 3 living things.'], 'God made living things that grow and need care.', false, 'Draw a T-chart: living / nonliving.'],
  ['My Five Senses', 'Name the five senses and the body part for each.', ['Snack, bell, cotton ball, lemon, picture book'], ['Taste, touch, smell, listen, look — one item each.', 'Name the body part we used.'], 'God gave us senses to enjoy His world.', false, 'Write one describing word for each sense.'],
  ['What Plants Need', 'Plants need water, light, air, and soil.', ['2 cups, soil, bean seeds, water'], ['Plant beans in two cups.', 'Put one in a dark cupboard, one in the window.', 'Water both; check on Fridays.'], 'God designed plants to grow with what He provides.', true, 'Predict which will grow better and record each week.'],
  ['Animal Groups', 'Sort animals into mammals, birds, fish, reptiles.', ['Animal toys or pictures'], ['Look at body coverings: fur, feathers, scales.', 'Sort animals by covering.'], 'God made animals in amazing variety.', false, 'Name one fact about each group.'],
  ['My Amazing Body', 'Name main body parts and what bones and muscles do.', ['Paper roll, crayons'], ['Trace a child’s body on paper.', 'Draw and label heart, bones, muscles, brain.'], 'We are fearfully and wonderfully made.', true, 'Count heartbeats before and after jumping.'],
  ['Day and Night', 'The Earth turns so we have day and night.', ['Flashlight, ball or globe'], ['Shine the flashlight on the globe in a dark room.', 'Turn the globe slowly: day side, night side.'], 'God made the sun to rule the day and the moon the night.', false, 'Draw what we see in the day and night sky.'],
  ['Weather Watchers', 'Observe and record daily weather.', ['Weather chart (paper)'], ['Look outside: sunny, cloudy, rainy, windy?', 'Draw the weather symbol each school day this week.'], 'God controls the wind and rain.', false, 'Use a thermometer to record temperature.'],
  ['Fall Leaves and Seasons', 'Describe the four seasons and how trees change.', ['Leaves from outside'], ['Collect leaves and sort by color or shape.', 'Talk about spring, summer, fall, winter.'], 'God made seasons (Genesis 8:22).', false, 'Make a seasons wheel.'],
  ['Science Review: Nature Journal', 'Record observations with drawings and words.', ['Notebook, crayons'], ['Sit outside for 5 minutes.', 'Draw what you see, hear, and feel.'], 'Scientists observe carefully.', false, 'Label the drawing with three words.'],
  ['Rocks and Soil', 'Sort rocks by size, color, and texture; soil is made of tiny pieces.', ['Rocks, magnifying glass, soil in a cup'], ['Look at rocks up close; sort them.', 'Look at soil: find sand, bits of leaves.'], 'God made the earth from the rocks up.', false, 'Rub two rocks together: which is harder?'],
  ['Stars in the Sky', 'Stars are suns far away; there are more than we can count.', ['Dark paper, white crayon or chalk, flashlight'], ['Draw a star picture.', 'Poke holes in paper; shine a flashlight through in the dark.'], 'God told Abram to count the stars.', false, 'Learn one constellation (Big Dipper).'],
  ['Push and Pull', 'Pushes and pulls make things move, stop, or change direction.', ['Toy car, ball, string'], ['Push a car; pull it with a string.', 'Try a soft push and a hard push.'], 'God gave us strength to move things.', false, 'Measure how far the car goes with a hard vs. soft push.'],
  ['Ramps', 'Things roll farther and faster down steeper ramps.', ['A board or book, toy car, blocks'], ['Make a ramp low, then high.', 'Which went farther?'], 'Trying it out is how we learn.', false, 'Record distances in a table.'],
  ['Sink or Float', 'Some things float and some sink.', ['Bowl of water, small objects'], ['Predict: sink or float?', 'Test and sort.'], 'Baby Moses floated safely in a basket.', true, 'Make a foil boat that holds pennies.'],
  ['Light and Shadows', 'Light travels; an object blocking light makes a shadow.', ['Flashlight, toys'], ['Make shadows on a wall.', 'Move the light closer and farther away.'], 'Jesus is the light of the world.', false, 'Trace shadows outside at morning and afternoon.'],
  ['Sound and Vibration', 'Sounds are made by vibrations.', ['Rubber band, box, pot and spoon'], ['Stretch a rubber band over a box and pluck.', 'Feel your throat hum.'], 'We use our voices to praise God.', false, 'Loud vs. soft, high vs. low.'],
  ['Fire and Heat Safety', 'The sun and fire give heat; stay safe around heat.', ['Ice cubes, two plates'], ['Put ice in the sun and the shade.', 'Which melts first?', 'Practice stop, drop, and roll.'], 'God appeared to Moses in a burning bush.', false, 'Time how long each ice cube takes to melt.'],
  ['Water: Solid, Liquid, Gas', 'Water can be ice, liquid, or steam.', ['Ice cube, cup, warm water (adult)'], ['Watch ice melt.', 'An adult shows steam from a kettle (from a distance).'], 'God parted the waters of the Red Sea.', false, 'Draw the water cycle.'],
  ['Winter Animals', 'Animals survive winter by hibernating, migrating, or adapting.', ['Animal pictures'], ['Sort animals: sleep, travel, stay and adapt.'], 'God cares for every creature.', false, 'Choose one animal and write 2 facts.'],
  ['The Night Sky and the Star of Bethlehem', 'The moon changes shape (phases) during the month.', ['Cookies or paper circles'], ['Show moon phases with cookies or paper.', 'Look at the real moon tonight.'], 'The wise men followed a star.', false, 'Keep a moon log for a week.'],
  ['How Things Grow (People and Animals)', 'Living things grow and change in a life cycle.', ['Baby photos of the children'], ['Look at baby photos vs. now.', 'Order pictures of a life cycle.'], 'Jesus grew in wisdom and stature.', false, 'Measure and compare heights.'],
  ['Fish and Water Animals', 'Fish breathe with gills and move with fins.', ['Pictures or a fish tank visit'], ['Watch fish swim; name fins, gills, scales.'], 'Jesus called fishermen.', false, 'Compare fish and whales (mammals).'],
  ['Helping Bodies Heal: Germs and Hand Washing', 'Germs spread; washing hands keeps us healthy.', ['Glitter or cinnamon, soap'], ['Put glitter on hands, shake hands, see the spread.', 'Wash with soap for 20 seconds.'], 'The Good Samaritan cared for a hurt man.', true, 'Make a hand-washing poster.'],
  ['Wind and Air', 'Air is all around us; we can feel wind move things.', ['Paper, straws, pinwheel'], ['Blow paper with a straw.', 'Make a pinwheel or paper fan.'], 'Jesus calmed the wind.', false, 'Make a simple windsock and observe wind direction.'],
  ['Food for Growing', 'Our bodies need healthy foods.', ['Food pictures or groceries'], ['Sort foods into groups.', 'Plan a healthy snack.'], 'Jesus fed 5,000 people.', false, 'Read a nutrition label together.'],
  ['Seeds Sprout', 'A seed has a tiny plant inside.', ['Bean soaked overnight, paper towel, zip bag'], ['Open a soaked bean to see the baby plant.', 'Start a bean in a wet paper towel bag on the window.'], 'A seed dies and new life grows (John 12:24).', true, 'Draw the sprout every two days.'],
  ['Spring Changes', 'Notice signs of spring in plants and animals.', ['Walk outside, journal'], ['Look for buds, birds, insects.', 'Draw 3 signs of spring.'], 'Easter reminds us of new life.', false, 'Compare to the fall journal page.'],
  ['Plant Parts', 'Roots, stem, leaves, flower — each has a job.', ['A weed or flower pulled up with roots'], ['Find each part.', 'Celery in colored water shows the stem carrying water.'], 'Abide in Jesus like a branch in the vine.', true, 'Label a plant diagram.'],
  ['Butterfly Life Cycle', 'Egg, caterpillar, chrysalis, butterfly.', ['Pasta shapes or drawings'], ['Act out the life cycle.', 'Make a life-cycle plate with pasta.'], 'God makes us new.', false, 'Write the four stages in order.'],
  ['Wind You Can’t See (Pentecost Connection)', 'Air has force even though we can’t see it.', ['Balloon, cup, paper'], ['Blow up a balloon and let it go.', 'Paper in a cup under water stays dry — air takes up space.'], 'The Spirit came like a mighty wind.', false, 'Explain why the paper stayed dry.'],
  ['Fruit and Seeds', 'Fruits hold seeds for new plants.', ['Apple, orange, other fruits, knife (adult)'], ['Cut open fruits and count seeds.', 'Compare seeds.'], 'The fruit of the Spirit grows in us.', true, 'Graph the number of seeds.'],
  ['Insects', 'Insects have 6 legs and 3 body parts.', ['Magnifying glass, outdoor hunt'], ['Find insects outside (look, don’t touch).', 'Count legs; draw one.'], 'God made even the smallest creatures.', false, 'Compare an insect and a spider.'],
  ['Birds and Nests', 'Birds build nests and care for their young.', ['Yarn, sticks, grass'], ['Look for nests outside.', 'Build a nest from natural materials.'], 'God feeds the birds (Matthew 6:26).', true, 'Identify 3 local birds.'],
  ['Caring for Creation: Recycling', 'Reduce, reuse, recycle to care for God’s world.', ['Clean recyclables'], ['Sort recyclables.', 'Make something new from a box.'], 'God asked people to care for His creation.', false, 'Track family trash for a day.'],
  ['Rainbows and Light', 'White light is made of colors.', ['Glass of water, sunny window, white paper'], ['Make a rainbow with water and sunlight.', 'Name colors in order.'], 'The rainbow reminds us of God’s promise.', false, 'Learn ROYGBIV.'],
  ['Science Celebration', 'Share favorite science discoveries from the year.', ['Nature journals'], ['Each child presents one favorite experiment.', 'Repeat a favorite.'], 'God’s world is full of wonders.', false, 'Write 3 sentences about a favorite discovery.'],
]

const ART: A[] = [
  ['Creation Collage', 'Use tearing and gluing to make a picture.', ['Magazines, construction paper, glue'], ['Tear paper into shapes.', 'Make a picture of one day of creation.'], 'God is the first Artist.'],
  ['Self-Portrait', 'Draw a face looking in a mirror.', ['Mirror, crayons'], ['Look and draw eyes, nose, mouth, hair.'], 'You are made in God’s image.'],
  ['Thumbprint Art', 'Turn fingerprints into animals.', ['Washable ink pad or paint'], ['Make prints; add legs and faces.'], 'Your fingerprints are one of a kind.'],
  ['Primary Colors', 'Red, yellow, blue are primary colors.', ['Paint in three colors'], ['Paint with only red, yellow, and blue.'], 'God made every color.', true],
  ['Family Portrait', 'Draw people with bodies, arms, and legs.', ['Paper, crayons'], ['Draw each family member.'], 'God made families.'],
  ['Line Art', 'Straight, curvy, zigzag, and dotted lines.', ['Paper, markers'], ['Fill a page with different lines.'], 'Lines make shapes and pictures.'],
  ['Ark Building with Shapes', 'Make a picture with shapes.', ['Paper shapes, glue'], ['Glue shapes into an ark with animals.'], 'Noah built exactly what God said.'],
  ['Rainbow Mixing', 'Mix primary colors to make secondary colors.', ['Paint, paper plate'], ['Mix red + yellow, yellow + blue, blue + red.'], 'The rainbow is a promise.', true],
  ['Art Show', 'Display favorite artwork and talk about it.', ['Tape, artwork'], ['Make a gallery wall; each child explains a piece.'], 'We can create because God creates.'],
  ['Star Resist Painting', 'Crayon resists watercolor.', ['White crayon, watercolor'], ['Draw stars in white crayon; paint over in dark blue.'], 'Count the stars.', true],
  ['Texture Rubbings', 'Find texture by rubbing.', ['Paper, crayons without wrappers'], ['Rub over leaves, coins, bark.'], 'God made the world full of textures.'],
  ['Clay Pots', 'Shape clay or play dough with pinch pots.', ['Play dough or air-dry clay'], ['Roll a ball, press the thumb in, pinch the sides.'], 'God is the potter, we are the clay (Isaiah 64:8).', true],
  ['Ladder Weaving', 'Over-under weaving with paper strips.', ['Paper strips'], ['Weave strips over and under.'], 'God is with us, step by step.'],
  ['Coat of Many Colors', 'Patterns with color.', ['Coat outline page, crayons'], ['Fill the coat with colorful patterns.'], 'God was with Joseph.'],
  ['Forgiveness Heart Mosaic', 'Make a mosaic from torn pieces.', ['Paper scraps, glue'], ['Fill a heart outline with pieces.'], 'Broken pieces can become beautiful.'],
  ['Basket Weaving', 'Simple paper basket weave.', ['Paper strips'], ['Weave a paper mat basket.'], 'Moses’ mother wove a basket boat.'],
  ['Fire Colors', 'Warm colors: red, orange, yellow.', ['Crayons or paint'], ['Paint a burning bush with warm colors.'], 'God spoke from the bush.'],
  ['Sea Painting', 'Cool colors: blue, green, purple.', ['Paint, sponge'], ['Sponge paint waves.'], 'God parted the sea.', true],
  ['Nativity Silhouettes', 'Dark shapes against a bright sky.', ['Black paper, colored paper'], ['Cut simple stable shapes; glue on a sunset sky.'], 'Jesus was born.'],
  ['Star Ornaments', 'Fold and decorate a paper star.', ['Paper, glitter or stickers'], ['Cut and decorate a star.'], 'The wise men followed a star.'],
  ['Dove Handprints', 'Turn a handprint into a dove.', ['White paint or paper'], ['Trace and cut a handprint dove.'], 'The Spirit came like a dove.'],
  ['Fish Printing', 'Print with a sponge or fruit stamp.', ['Sponge, paint'], ['Stamp a school of fish.'], 'Fishers of men.', true],
  ['Helping Hands Wreath', 'Cut out traced hands into a wreath.', ['Paper, scissors'], ['Trace, cut, glue into a circle.'], 'Love your neighbor.'],
  ['Storm Painting', 'Show movement with lines and color.', ['Paint, paper'], ['Paint a stormy sea, then a calm one.'], 'Peace, be still.', true],
  ['Bread Basket Still Life', 'Draw what you see.', ['Bread, basket'], ['Set up a still life; draw it.'], 'Jesus is the bread of life.'],
  ['Cross Mosaic', 'Tissue paper stained glass.', ['Tissue paper, contact paper'], ['Make a stained-glass cross.'], 'God so loved the world.', true],
  ['Empty Tomb Garden', 'Build a small scene.', ['Pot, soil, small stones, grass seed'], ['Create a resurrection garden.'], 'He is risen!', true],
  ['Praying Hands Prints', 'Trace and decorate hands.', ['Paper, markers'], ['Write prayers inside traced hands.'], 'Jesus taught us to pray.'],
  ['Wind Streamers', 'Make art that moves.', ['Ribbon, paper plate'], ['Make a streamer; run with it.'], 'The Spirit is like wind.'],
  ['Fruit Still Life', 'Draw real fruit with shapes.', ['Fruit, paper'], ['Draw circles and ovals into fruit.'], 'The fruit of the Spirit.'],
  ['Kindness Cards', 'Design cards for someone.', ['Cardstock, crayons, stickers'], ['Make and give a card.'], 'Be kind one to another.'],
  ['Armor of God Shield', 'Design a shield.', ['Cardboard, foil, markers'], ['Decorate a shield of faith.'], 'Be strong in the Lord.', true],
  ['Heart Collage', 'Collage of things we love.', ['Magazines, glue'], ['Cut pictures of people and things we love.'], 'We love because He first loved us.'],
  ['Serving Placemats', 'Decorate placemats for family dinner.', ['Paper, crayons, contact paper'], ['Design and laminate placemats.'], 'Serve one another.'],
  ['World Map Art', 'Color the continents.', ['Map printout, crayons'], ['Color each continent a different color.'], 'Go into all the world.'],
  ['Year in Art Portfolio', 'Choose favorite art and make a cover.', ['Folder, artwork'], ['Pick 5 favorites; decorate a portfolio.'], 'Thank God for creativity.'],
]

const SOCIAL: A[] = [
  ['Me and My Family Tree', 'Name family members and relationships.', ['Paper, photos'], ['Make a simple family tree.'], 'God placed us in families.'],
  ['Where I Live', 'Learn our address and town.', ['Envelope, crayons'], ['Practice saying your address; mail a letter to yourself.'], 'God knows where we live.'],
  ['Our Family Heritage', 'Learn where our family comes from and its traditions.', ['Family photos, globe'], ['Find family heritage countries on a globe; share a family tradition or food.'], 'God made every nation and language.'],
  ['Community Helpers', 'Name helpers in our community and what they do.', ['Pictures or dress-up'], ['Match helpers to their tools.'], 'We can serve like helpers do.'],
  ['Rules at Home', 'Why families and communities have rules.', ['Paper'], ['Make a family rules poster together.'], 'God’s rules are for our good.'],
  ['Maps: My Room', 'A map is a picture from above.', ['Paper, toys'], ['Draw a bird’s-eye map of your room.'], 'Maps help us find our way.'],
  ['Maps: My Neighborhood', 'Use a simple map to find places.', ['Paper, crayons'], ['Draw a map of your street.'], 'God guided Abram on a journey.'],
  ['Land and Water on a Globe', 'Blue is water, other colors are land.', ['Globe or world map'], ['Spin the globe; point land or water.'], 'God separated land and water.'],
  ['Review: All About Me Book', 'Make a book about me, family, and home.', ['Stapled paper'], ['Draw and label pages.'], 'God knows all about you.'],
  ['The Land of Israel', 'Find Israel on a map and learn about its land.', ['World map'], ['Find Israel, the Jordan River, the Sea of Galilee, Jerusalem.'], 'Abram traveled to Canaan.'],
  ['Desert and Tent Life', 'How shepherds and nomads lived.', ['Blanket for a tent'], ['Build a tent; eat a simple snack inside.'], 'Abraham lived in tents.', true],
  ['Long Ago and Today', 'Compare life long ago with today.', ['Pictures of old tools'], ['Compare a candle and a lamp, a well and a faucet.'], 'God is the same yesterday and today.'],
  ['Thanksgiving in America', 'Learn the history of Thanksgiving.', ['Picture book from the library'], ['Talk about the first harvest feast; make a thankful list.'], 'Give thanks to the Lord.'],
  ['Jobs and Work', 'People work to provide and to serve.', ['Dress-up items'], ['Role-play different jobs.'], 'Joseph worked faithfully.'],
  ['Egypt and the Nile', 'Find Egypt; learn about pyramids and the Nile.', ['Map, blocks'], ['Find Egypt; build a pyramid with blocks.'], 'Joseph and Moses lived in Egypt.'],
  ['Families Around the World', 'Families everywhere love and care for each other.', ['Library books'], ['Compare homes and foods around the world.'], 'God loves every nation.'],
  ['Freedom', 'What it means to be free.', ['Paper'], ['Talk about Israel leaving slavery; draw a picture of freedom.'], 'God set His people free.'],
  ['Celebrations and Holidays', 'How families celebrate.', ['Photos of past holidays'], ['Share favorite family celebrations.'], 'Israel celebrated God’s rescue.'],
  ['Bethlehem', 'Find Bethlehem on a map; learn what towns were like.', ['Map'], ['Find Bethlehem and Nazareth; trace Mary and Joseph’s trip.'], 'Jesus was born in Bethlehem.'],
  ['Christmas Around the World', 'How Christians in different countries celebrate Jesus’ birth.', ['Library books'], ['Learn how two countries celebrate.'], 'Good news for all people.'],
  ['Growing Up Long Ago', 'What kids did in Bible times.', ['Pictures'], ['Compare toys and chores then and now.'], 'Jesus grew up in Nazareth.'],
  ['Galilee and Fishing Villages', 'Find the Sea of Galilee; how fishermen worked.', ['Map, net or string'], ['Find Capernaum; make a string net.'], 'Jesus called fishermen.'],
  ['Neighbors and Kindness', 'Who our neighbors are and how to help.', ['Paper'], ['Make a neighbor kindness plan.'], 'Love your neighbor.'],
  ['Boats and Transportation', 'How people travel by land, water, and air.', ['Toy vehicles'], ['Sort by land, water, air.'], 'Jesus traveled by boat.'],
  ['Farms and Food', 'Where food comes from.', ['Groceries'], ['Trace bread from wheat to table.'], 'God provides daily bread.'],
  ['Choices and Honesty', 'Good citizens tell the truth.', ['Scenario cards'], ['Role-play honest choices.'], 'Jesus is the truth.'],
  ['Spring Holidays', 'Easter and Passover traditions.', ['Library books'], ['Compare Passover and Easter.'], 'Jesus is our Passover Lamb.'],
  ['Places of Worship', 'Churches and how communities worship.', ['Photos'], ['Draw our church; name who serves there.'], 'Jesus taught us to pray.'],
  ['Languages of the World', 'People speak many languages.', ['Globe'], ['Learn "hello" in 3 languages.'], 'At Pentecost many languages heard the gospel.'],
  ['Needs and Wants', 'Tell needs from wants.', ['Picture cards'], ['Sort needs and wants.'], 'God supplies our needs.'],
  ['Money and Saving', 'Earning, saving, giving.', ['Three jars'], ['Label give, save, spend jars.'], 'Cheerful giving.'],
  ['Our Country’s Symbols', 'Flag, eagle, and anthem.', ['Flag picture'], ['Color the flag; learn what it stands for.'], 'Pray for leaders (1 Timothy 2:1–2).'],
  ['Helpers Who Keep Us Safe', 'Police, firefighters, doctors.', ['Dress-up, phone'], ['Practice calling 911 (pretend phone) and learn when to call.'], 'Peacemakers are blessed.'],
  ['Serving Our Community', 'Plan a service project.', ['Supplies for project'], ['Make cards or bake for neighbors.'], 'Serve one another in love.', true],
  ['Missionaries and the World', 'Christians share good news worldwide.', ['Globe'], ['Pray for a country; find it on the globe.'], 'Go into all the world.'],
  ['My Year Timeline', 'Make a timeline of our school year.', ['Paper strip, photos'], ['Put events in order.'], 'God was faithful all year.'],
]

const LIFE: A[] = [
  ['Putting Away School Supplies', 'Return supplies to a home spot.', ['Labeled bins'], ['Show each supply’s home; practice clean-up.'], 'Taking care of things shows thankfulness.'],
  ['Washing Hands', 'Wash hands the right way.', ['Soap, sink'], ['Wet, soap, scrub 20 seconds (sing), rinse, dry.'], 'Caring for our bodies.'],
  ['Getting Dressed', 'Practice buttons, zips, and putting on shoes.', ['Clothes with buttons/zippers'], ['Practice one fastener each day.'], 'Doing things ourselves builds confidence.'],
  ['Setting the Table', 'Place fork, plate, cup, napkin.', ['Dishes'], ['Show the setting once; child sets the table.'], 'Serving our family.'],
  ['Making the Bed', 'Pull up blankets and fluff the pillow.', ['Bed'], ['Practice each morning.'], 'Small jobs done well.'],
  ['Saying Please and Thank You', 'Use kind words.', ['Role-play'], ['Practice at snack time.'], 'Thankful hearts.'],
  ['Feeding a Pet or Plant', 'Care for a living thing daily.', ['Pet food or watering can'], ['Assign a daily care job.'], 'Noah cared for the animals.'],
  ['Sorting Laundry', 'Sort lights and darks; match socks.', ['Laundry basket'], ['Sort and match.'], 'Helping the family.'],
  ['Review: My Helper Chart', 'Choose weekly helper jobs.', ['Chart'], ['Make a family helper chart.'], 'Honor parents by helping.'],
  ['Packing a Bag', 'Pack what you need for an outing.', ['Backpack'], ['Make a checklist; pack it.'], 'Abram packed for a journey.'],
  ['Wiping the Table', 'Clean up after meals.', ['Cloth, spray'], ['Wipe from top to bottom.'], 'Cheerful helpers.'],
  ['Pouring Without Spilling', 'Pour from a small pitcher.', ['Small pitcher, cups'], ['Practice pouring water or rice.'], 'Patience and care.'],
  ['Phone Number and Address', 'Know your parent’s phone number.', ['Paper'], ['Practice saying the number in a song.'], 'Staying safe.'],
  ['Sharing and Taking Turns', 'Use a timer to take turns.', ['Timer, toy'], ['Practice turn-taking.'], 'Love is not selfish.'],
  ['Saying Sorry and Forgiving', 'Practice a full apology.', ['Role-play'], ['"I’m sorry for ___. Will you forgive me?"'], 'Joseph forgave.'],
  ['Tidying a Room', 'Clean up in steps.', ['Timer'], ['Pick a category: books, toys, clothes.'], 'Order and peace.'],
  ['Kitchen Safety', 'Hot, sharp, and ask-first rules.', ['Kitchen'], ['Tour the kitchen; name safety rules.'], 'Wisdom keeps us safe.'],
  ['Preparing a Simple Snack', 'Spread, cut with a butter knife.', ['Crackers, spread, butter knife'], ['Make a snack together.'], 'Serving others food.', true],
  ['Writing a Thank-You Note', 'Thank someone in writing or drawing.', ['Card, crayons'], ['Make a card for someone who helped you.'], 'Thankfulness.'],
  ['Wrapping a Gift', 'Fold and tape paper around a box.', ['Box, paper, tape'], ['Wrap a gift for a family member.'], 'Giving like the wise men.'],
  ['Brushing Teeth Well', 'Brush two minutes, all sides.', ['Toothbrush, timer'], ['Brush with a song timer.'], 'Caring for our bodies.'],
  ['Folding Towels', 'Fold in halves and fourths.', ['Towels'], ['Fold and stack.'], 'Halves and fourths in real life!'],
  ['Helping a Neighbor', 'Notice someone who needs help.', ['None'], ['Do one helping act for a neighbor.'], 'The Good Samaritan.'],
  ['Calm-Down Plan', 'Know what helps you calm down.', ['Paper'], ['Make a calm-down choice card.'], 'Peace, be still.'],
  ['Sharing Food', 'Divide a snack fairly.', ['Snack'], ['Share equally with siblings.'], 'The boy shared his lunch.'],
  ['Telling the Truth', 'Practice honesty even when hard.', ['Scenarios'], ['Role-play honest answers.'], 'Truth matters.'],
  ['Watering the Garden', 'Care for plants.', ['Watering can'], ['Water plants weekly.'], 'New life.'],
  ['Morning Routine Chart', 'Follow a picture routine.', ['Chart'], ['Make and use a picture routine.'], 'Starting the day with God.'],
  ['Using Kind Words', 'Encourage someone.', ['Kind-word jar'], ['Say one encouraging thing to each sibling.'], 'Words that help.'],
  ['Grocery Helper', 'Find items from a picture list.', ['Grocery list'], ['Help find items at the store or pantry.'], 'God provides.'],
  ['Self-Control Games', 'Freeze, wait, and go.', ['Music'], ['Freeze dance; red light, green light.'], 'Self-control is a fruit of the Spirit.'],
  ['Packing Lunch', 'Choose a healthy lunch.', ['Lunchbox, food'], ['Pack a balanced lunch.'], 'Caring for our bodies.'],
  ['Caring for Siblings', 'Help a younger sibling with a task.', ['None'], ['Older child helps a younger one.'], 'Love one another.'],
  ['Serving at Dinner', 'Serve food and clear plates.', ['Dinner'], ['Serve and clear.'], 'Jesus served.'],
  ['Greeting Guests', 'Welcome a visitor kindly.', ['Role-play'], ['Practice greeting, offering a seat or drink.'], 'Hospitality.'],
  ['Summer Responsibility Plan', 'Choose summer helper jobs.', ['Chart'], ['Plan summer chores and reading.'], 'Keep growing.'],
]

export const ENRICHMENT: EnrichmentWeek[] = Array.from({ length: 36 }, (_, i) => {
  const science = act(SCIENCE[i])
  return {
    week: i + 1,
    science,
    art: act(ART[i]),
    socialStudies: act(SOCIAL[i]),
    lifeSkill: act(LIFE[i]),
    library: {
      mission: `Ask the librarian for a picture book about ${science.title.toLowerCase().replace(/:.*$/, '')} and one about ${SOCIAL[i][0].toLowerCase()}.`,
      readAloudIdeas: [
        `A picture book about ${science.title.toLowerCase().replace(/:.*$/, '')}`,
        `A children’s Bible storybook retelling this week’s story`,
        'A poetry collection to read at snack time',
      ],
    },
  }
})

if (SCIENCE.length !== 36 || ART.length !== 36 || SOCIAL.length !== 36 || LIFE.length !== 36) {
  throw new Error('Enrichment must have 36 weeks of each activity type')
}

export function getEnrichment(week: number): EnrichmentWeek {
  return ENRICHMENT[Math.min(Math.max(week, 1), 36) - 1]
}
