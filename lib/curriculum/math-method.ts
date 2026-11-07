import type { MathGen, MathTopic } from './math'
import type { Grade } from './types'

/**
 * How every math lesson is taught: conceptual understanding first, then
 * fluency and independent problem-solving.
 *
 *   Concrete  (Monday)   — real objects: counters, blocks, fingers, coins.
 *   Pictorial (Tuesday)  — drawings, ten frames, number lines, then the
 *   Abstract  (Tuesday)  — written numbers and traditional problems.
 *   Apply     (Thursday) — everyday-life story problems and a movement game.
 *   Review    (Friday)   — independent practice, spiral review, mastery check.
 *
 * Each lesson states WHAT we are doing, WHY it works, and HOW to solve it.
 * The method is derived from the topic's worksheet generator so every week —
 * including weeks added later — follows the same structure. A topic can
 * override any part with its own wording (`MathTopic.method`).
 */

export interface MathMethod {
  /** What we are doing, in words a child can hear. */
  what: string
  /** Why it works — the idea underneath the procedure. */
  why: string
  /** How to solve it, step by step. */
  how: string[]
  /** A worked example, said aloud. */
  example?: string
  concrete: string
  pictorial: string
  abstract: string
  /** Everyday-life story problems for Apply day (said aloud, no paper). */
  realLife: string[]
  /** A movement game for Apply day. */
  movement: string
}

type Base = Omit<MathMethod, 'realLife' | 'movement'> & { realLife?: string[]; movement?: string }

const pick = <T,>(list: T[], n: number) => list[((n % list.length) + list.length) % list.length]

function forGen(gen: MathGen, grade: Grade): Base {
  switch (gen.kind) {
    case 'count-circle':
    case 'count-write':
      return {
        what: `Counting groups of things up to ${gen.max} and saying how many.`,
        why: 'Each object gets exactly one number word. The last number we say tells how many are in the whole group — moving them around does not change how many.',
        how: ['Touch each object once and slide it over as you count.', 'Say one number for each touch.', 'Say "There are __" using the last number you said.'],
        example: `"1, 2, 3, 4. The last number was 4, so there are 4 apples."`,
        concrete: `Count real objects (beans, blocks, spoons) up to ${gen.max}. Move each one as it is counted.`,
        pictorial: 'Count pictures, crossing off or tapping each one so none are counted twice.',
        abstract: gen.kind === 'count-write' ? 'Write the numeral that tells how many.' : 'Circle the numeral that tells how many.',
      }
    case 'trace-numbers':
      return {
        what: `Writing the numbers ${gen.from}–${gen.to} and matching each to an amount.`,
        why: 'A numeral is a symbol for an amount. Writing it while counting that many objects connects the symbol to what it means.',
        how: ['Start at the top (the green dot).', 'Follow the arrows.', 'Count out that many objects and put them next to the number.'],
        concrete: `Build each number ${gen.from}–${gen.to} with blocks, then trace the numeral in sand or salt.`,
        pictorial: 'Draw dots to show the amount next to each number.',
        abstract: 'Trace and write the numerals; count and write how many.',
      }
    case 'shape-find':
    case 'shape-attributes':
      return {
        what: 'Naming shapes by counting their sides and corners.',
        why: 'A shape’s name comes from its sides and corners — not its color, size, or which way it is turned. A triangle is a triangle because it has 3 straight sides and 3 corners.',
        how: ['Run your finger along each side and count.', 'Touch each corner and count.', 'Use the count to name the shape.'],
        concrete: 'Build shapes with straws or craft sticks; count the sticks (sides) and the points where they meet (corners).',
        pictorial: 'Trace shapes on paper and mark each corner with a dot.',
        abstract: 'Find and name shapes on the worksheet; write the number of sides and corners.',
        realLife: ['Find 3 rectangles in the kitchen. How do you know each one is a rectangle?', 'A pizza slice is a triangle shape. Count its corners.'],
      }
    case 'pattern':
      return {
        what: 'Finding the part that repeats in a pattern and continuing it.',
        why: 'A pattern has a core — a group that repeats in the same order. Once you find the core, you can always tell what comes next.',
        how: ['Say the pattern out loud while pointing.', 'Find the part that repeats (the core) and circle it.', 'Say the core again to find what comes next.'],
        concrete: 'Build patterns with blocks or snacks; say them in a rhythm.',
        pictorial: 'Color or draw the pattern; circle the core.',
        abstract: 'Choose what comes next and label the pattern (AB, ABB…).',
        movement: 'Body patterns: clap–stomp–clap–stomp, then let the child invent one for you to copy.',
      }
    case 'compare-groups':
    case 'compare-numbers':
      return {
        what: gen.kind === 'compare-numbers' ? 'Comparing two numbers to tell which is greater.' : 'Comparing two groups to tell which has more or fewer.',
        why: 'Matching objects one-to-one shows which group has extras. The group with objects left over has more. A greater number means a bigger amount.',
        how: ['Line the two groups up side by side, one under the other.', 'Match them one-to-one.', 'The group with some left over has more.'],
        concrete: 'Make two groups with counters and line them up in two rows to compare.',
        pictorial: 'Draw lines matching pictures one-to-one; circle the extras.',
        abstract: gen.kind === 'compare-numbers' && gen.symbols ? 'Compare numbers with >, <, and =: the open side faces the bigger number.' : 'Circle the greater number or the group with more.',
        realLife: ['You have 4 grapes and I have 6. Who has more? How many more?', 'There are 5 plates and 3 cups. Do we have enough cups?'],
      }
    case 'size-compare':
    case 'measure':
      return {
        what: gen.kind === 'measure' ? 'Measuring how long something is by counting same-size units.' : 'Comparing things by size: longer, taller, heavier.',
        why: 'To measure fairly we line things up from the same starting point and use units that are all the same size, with no gaps or overlaps.',
        how: ['Line up the ends at the same starting point.', 'Lay units end to end with no gaps.', 'Count the units.'],
        concrete: 'Measure real objects with paper clips, blocks, or hand spans.',
        pictorial: 'Draw the units under the picture and count them.',
        abstract: 'Write how many units long; compare with words: longer, shorter, same.',
        realLife: ['Measure the table with spoons. Then with forks. Why are the answers different?', 'Which is heavier: a can of beans or a box of cereal? Hold one in each hand, then check.'],
      }
    case 'ten-frame':
      return {
        what: `Showing numbers up to ${gen.max} in a ten frame.`,
        why: 'A ten frame holds exactly 10. Seeing how many are filled — and how many empty — helps us know a number without counting one by one, and shows how far it is from 10.',
        how: ['Fill the top row left to right first.', 'Count the full row as 5.', 'Count on from 5 for the bottom row. Count the empty boxes to see how many more make 10.'],
        concrete: 'Fill an egg carton (cut to 10) or a drawn ten frame with counters.',
        pictorial: 'Read ten-frame pictures quickly: "5 and 2 more is 7."',
        abstract: 'Write the number shown and how many more make 10.',
      }
    case 'number-bond':
      return {
        what: `Breaking numbers up to ${gen.maxTotal} into two parts.`,
        why: 'A whole can be split into parts, and the parts put back together make the same whole. 5 is 2 and 3, and it is also 4 and 1. Knowing the parts makes adding and subtracting easy.',
        how: ['Start with the whole.', 'Split it into two groups.', 'Say: "__ and __ make __."'],
        example: '"5 is 2 and 3. 2 and 3 make 5."',
        concrete: 'Hold a stick of cubes for the whole; snap it into two parts in different ways.',
        pictorial: 'Fill in number-bond circles: whole on top, parts below.',
        abstract: 'Write the missing part or whole.',
      }
    case 'add-pictures':
    case 'sub-pictures':
      return {
        what: gen.kind === 'add-pictures' ? 'Putting two groups together to find how many in all.' : 'Taking some away to find how many are left.',
        why: gen.kind === 'add-pictures' ? 'Adding means joining groups. When we put them together, the total is the same as counting everything.' : 'Subtracting means taking away part of a group. What is left is smaller than what we started with.',
        how: gen.kind === 'add-pictures' ? ['Count the first group.', 'Count on as you add the second group.', 'Say the total.'] : ['Count the whole group.', 'Cross out (take away) the ones that leave.', 'Count what is left.'],
        concrete: gen.kind === 'add-pictures' ? 'Two plates of counters: push them together and count all.' : 'Put out counters; take some away into a cup; count what is left.',
        pictorial: gen.kind === 'add-pictures' ? 'Count pictures in two groups.' : 'Cross out pictures that go away.',
        abstract: 'Write the number sentence: __ + __ = __ or __ − __ = __.',
      }
    case 'facts': {
      const sub = gen.op === '-'
      const range = gen.min && gen.min > 10 ? `within ${gen.max}` : `within ${gen.max}`
      if (gen.makeTen && (gen.min ?? 0) >= 10) {
        return {
          what: 'Adding numbers like 8 + 5 by making a ten first.',
          why: '10 is a friendly number. 8 needs 2 more to make 10. If we break 5 into 2 and 3, we can give 2 to the 8 to make 10 — then 10 and 3 is 13. The total does not change; we only moved counters.',
          how: ['Start with the bigger number.', 'Ask: how many more to make 10?', 'Break the other number into that many and the rest.', 'Make the ten, then add the rest: 10 + __.'],
          example: '8 + 5: 8 needs 2 to make 10. 5 is 2 and 3. 8 + 2 = 10. 10 + 3 = 13. So 8 + 5 = 13.',
          concrete: 'Two ten frames with counters: slide counters from the second frame to fill the first, then read "10 and __."',
          pictorial: 'Draw ten frames or a number bond under the smaller number to show the split.',
          abstract: 'Solve make-10 facts; show the split with a number bond under the problem.',
        }
      }
      if (gen.makeTen) {
        return {
          what: 'Finding the partners that make 10.',
          why: '10 can be split into two parts in many ways: 1 and 9, 2 and 8, 3 and 7… Knowing these partners by heart makes bigger adding and subtracting much easier.',
          how: ['Look at the number you have.', 'Count the empty spaces in the ten frame — that is the partner.', 'Say: "__ and __ make 10."'],
          example: '"7 and 3 make 10, because 7 counters leave 3 empty boxes."',
          concrete: 'Ten counters on a ten frame: hide some under a cup; how many are hiding?',
          pictorial: 'Ten frames with some filled: write how many more make 10.',
          abstract: 'Write the missing partner: 6 + __ = 10.',
        }
      }
      if (gen.doubles) {
        return {
          what: 'Using doubles (6 + 6) to solve near doubles (6 + 7).',
          why: 'Doubles are two equal groups, and they are easy to remember. 6 + 7 is just one more than 6 + 6, so if 6 + 6 = 12, then 6 + 7 = 13.',
          how: ['Is it a double? Say the double fact.', 'If one number is 1 more, find the double and add 1.'],
          example: '6 + 7: 6 + 6 = 12, and 7 is one more than 6, so 6 + 7 = 13.',
          concrete: 'Build two equal towers of cubes (a double); add one cube to one tower (a near double).',
          pictorial: 'Draw dot pairs for doubles; add one more dot for near doubles.',
          abstract: 'Solve doubles and near doubles; write the double you used.',
        }
      }
      if (gen.three) {
        return {
          what: 'Adding three numbers.',
          why: 'We can add numbers in any order and the total stays the same. So we look for an easy pair first — like two numbers that make 10 — then add the third.',
          how: ['Look for a pair that makes 10 or a double.', 'Add that pair first.', 'Add the third number.'],
          example: '4 + 6 + 3: 4 and 6 make 10. 10 + 3 = 13.',
          concrete: 'Three groups of counters: push together the two groups that make 10 first.',
          pictorial: 'Circle the easy pair in the problem, then add.',
          abstract: 'Solve three-addend problems; circle the pair you added first.',
        }
      }
      if (gen.missing) {
        return {
          what: 'Finding the missing number in an equation like 8 + __ = 13.',
          why: 'The equal sign means "the same amount as." Both sides must balance. Knowing that addition and subtraction are opposites (a fact family), we can count up or subtract to find the missing part.',
          how: ['Read the problem: start, change, total.', 'Ask: what do I need to add to get from the start to the total?', 'Count up from the start, or subtract: total − start.'],
          example: '8 + __ = 13: count up from 8 — 9, 10, 11, 12, 13. That is 5. Check: 8 + 5 = 13.',
          concrete: 'Put 8 counters out and 13 in a row above; add counters until the rows match.',
          pictorial: 'Draw a number line and jump from the start to the total.',
          abstract: 'Write the missing number; check by reading the whole equation.',
        }
      }
      if (sub) {
        return {
          what: `Subtracting ${range}.`,
          why: 'Subtracting is taking away — or finding the difference between two numbers. Because addition and subtraction are a fact family, we can think addition to subtract: 13 − 5 asks "5 plus what makes 13?"',
          how: ['Start with the whole.', 'Take away the part (or count up from the part to the whole).', 'Check with addition: part + answer = whole.'],
          example: grade === 'k' ? '7 − 3: put out 7, take away 3, count what is left: 4.' : '13 − 5: think 5 + __ = 13. 5 + 5 = 10, and 3 more is 13, so the answer is 8.',
          concrete: 'Counters on ten frames: take away and count what is left.',
          pictorial: 'Cross out pictures, or jump back on a number line.',
          abstract: 'Solve the facts; check each with an addition fact.',
        }
      }
      if (gen.op === 'mixed') {
        return {
          what: `Practicing adding and subtracting ${range} until it is quick.`,
          why: 'Facts you already understand become quick with practice — like reading a word you know. Quick facts free your mind for bigger problems.',
          how: ['Read the sign first: + means join, − means take away.', 'Use a strategy you know: count on, doubles, make 10, think addition.', 'If you are stuck, prove it with counters.'],
          concrete: 'Solve with counters any fact you are unsure of.',
          pictorial: 'Use a ten frame or number line picture for tricky facts.',
          abstract: 'Solve the facts on the page — say the strategy for one of them.',
        }
      }
      return {
        what: `Adding ${range}.`,
        why: 'Adding is putting groups together. We do not have to count everything from 1 — we can start at the bigger number and count on, because those objects are already counted.',
        how: ['Put the bigger number in your head.', 'Count on the smaller number on your fingers.', 'The last number you say is the total.'],
        example: '6 + 3: start at 6, count on 3 — 7, 8, 9. So 6 + 3 = 9.',
        concrete: 'Two groups of counters: put the bigger group in a cup (say its number), then count on the others.',
        pictorial: 'Use a number line: start at the bigger number and jump.',
        abstract: 'Solve the facts; say the strategy for at least one.',
      }
    }
    case 'fact-family':
      return {
        what: 'Writing the four facts that belong to one number family.',
        why: 'Three numbers like 3, 5, and 8 are always connected: two parts make the whole. If 3 + 5 = 8, then 5 + 3 = 8, 8 − 3 = 5, and 8 − 5 = 3. Subtraction undoes addition.',
        how: ['Find the whole (the biggest number).', 'Write two addition facts: part + part = whole.', 'Write two subtraction facts: whole − part = part.'],
        example: '3, 5, 8 → 3 + 5 = 8, 5 + 3 = 8, 8 − 3 = 5, 8 − 5 = 3.',
        concrete: 'Make a cube train of 8 in two colors (3 and 5). Turn it around, then break off each color.',
        pictorial: 'Draw a number bond or fact-family house.',
        abstract: 'Write all four facts for each family.',
      }
    case 'true-false':
      return {
        what: 'Deciding whether an equation is true or false.',
        why: 'The equal sign does not mean "the answer comes next." It means both sides are the same amount, like a balanced scale. 4 + 2 = 3 + 3 is true because both sides are 6.',
        how: ['Find the amount on the left side.', 'Find the amount on the right side.', 'Same amount? True. Different? False.'],
        concrete: 'Use a balance or two plates: build each side with counters and compare.',
        pictorial: 'Draw dots under each side and compare.',
        abstract: 'Write T or F; fix one false equation so it is true.',
      }
    case 'word-problems':
      return {
        what: 'Solving story problems from everyday life.',
        why: 'Story problems are math in real life. Picturing the story tells us whether things are joining (add), leaving (subtract), or being compared (find the difference).',
        how: ['Listen to (or read) the story twice.', 'Act it out or draw it.', 'Decide: joining, taking away, or comparing?', 'Write the number sentence and answer with a full sentence: "There are __."'],
        concrete: 'Act out each story with toys or snacks.',
        pictorial: 'Draw a quick picture: circles for things, cross out for taking away.',
        abstract: 'Write the number sentence and the answer with a label.',
      }
    case 'number-line':
      return {
        what: `${gen.op === '+' ? 'Adding' : 'Subtracting'} by jumping on a number line.`,
        why: 'Numbers sit in order on a line, each one more than the last. Adding moves forward (bigger); subtracting moves back (smaller). Each jump is one.',
        how: ['Put your finger on the starting number.', gen.op === '+' ? 'Jump forward one space for each number you add.' : 'Jump back one space for each number you take away.', 'Where you land is the answer.'],
        concrete: 'Make a number line with tape on the floor and hop the jumps.',
        pictorial: 'Draw the jumps as hops above the number line.',
        abstract: 'Write the number sentence for each set of jumps.',
        movement: `Floor number line 0–${gen.max}: the child hops the jumps for problems you call out.`,
      }
    case 'place-value':
    case 'ten-more-less':
      return {
        what: gen.kind === 'ten-more-less' ? 'Finding 10 more and 10 less than a number.' : 'Reading numbers as tens and ones.',
        why: 'In our number system, 10 ones can be bundled into 1 ten. In 34, the 3 means 3 tens (30) and the 4 means 4 ones. Adding 10 changes only the tens digit — one more bundle.',
        how: gen.kind === 'ten-more-less' ? ['Find the tens digit.', '10 more: the tens digit goes up by 1.', '10 less: the tens digit goes down by 1. The ones stay the same.'] : ['Count the bundles of ten.', 'Count the loose ones.', 'Write tens in the left place and ones in the right place.'],
        example: gen.kind === 'ten-more-less' ? '10 more than 34 is 44: one more bundle of ten; the 4 ones stay.' : '34 is 3 tens and 4 ones: 30 + 4.',
        concrete: 'Bundle straws or craft sticks into tens with rubber bands; build numbers with bundles and loose sticks.',
        pictorial: 'Draw quick tens (lines) and ones (dots).',
        abstract: 'Write the number from tens and ones, and in expanded form: 30 + 4.',
        realLife: ['You have 3 dimes and 4 pennies. How many cents? (Dimes are tens; pennies are ones.)', 'An egg carton of 10 plus 2 more eggs — how many eggs?'],
      }
    case 'two-digit':
      return {
        what: 'Adding and subtracting with two-digit numbers by thinking in tens and ones.',
        why: 'We add tens to tens and ones to ones because they are different sizes — like adding dimes with dimes and pennies with pennies. 40 + 30 is 4 tens + 3 tens = 7 tens = 70.',
        how: ['Split each number into tens and ones.', 'Add (or subtract) the tens.', 'Add (or subtract) the ones.', 'Put them together.'],
        concrete: 'Build both numbers with ten-bundles and singles; combine the bundles, then the singles.',
        pictorial: 'Draw quick tens and ones for each number.',
        abstract: 'Solve; write how many tens and ones in the answer.',
      }
    case 'vertical': {
      const sub = gen.op === '-'
      if (sub) {
        return {
          what: gen.regroup ? 'Subtracting in columns, borrowing (trading) a ten when there are not enough ones.' : 'Subtracting in columns: ones first, then tens.',
          why: gen.regroup
            ? 'In 32 − 5 there are only 2 ones — not enough to take away 5. We trade one ten for ten ones, so 3 tens and 2 ones becomes 2 tens and 12 ones. The number is still 32; it is just regrouped. Now 12 − 5 = 7, and 2 tens are left: 27.'
            : 'Writing numbers in columns lines up ones under ones and tens under tens, so we take away the same kind of thing.',
          how: gen.regroup
            ? ['Line up ones under ones, tens under tens.', 'Start with the ones. Can you take away? If not, borrow: cross out the tens digit, make it one less, and put a 1 in front of the ones (10 more ones).', 'Subtract the ones.', 'Subtract the tens.']
            : ['Line up ones under ones, tens under tens.', 'Subtract the ones.', 'Subtract the tens.'],
          example: gen.regroup ? '32 − 5: 2 − 5? Not enough. Trade 1 ten: 2 tens, 12 ones. 12 − 5 = 7. 2 tens − 0 = 2. Answer: 27.' : '47 − 3: 7 − 3 = 4 ones; 4 tens stay. Answer: 44.',
          concrete: 'Build the top number with bundles and singles on a tens/ones mat. Unbundle a ten into 10 singles when you need more ones.',
          pictorial: 'Draw quick tens and ones; when borrowing, draw a ten as 10 dots.',
          abstract: 'Solve column problems; show the borrowed ten with a small mark above.',
        }
      }
      return {
        what: gen.regroup ? 'Adding in columns, carrying a new ten when the ones make 10 or more.' : 'Adding in columns: ones first, then tens.',
        why: gen.regroup
          ? 'Only 9 ones fit in the ones place. In 36 + 7, the ones make 6 + 7 = 13 — that is 1 ten and 3 ones. We bundle the 10 ones into a new ten and carry it to the tens column. 3 tens + 1 ten = 4 tens, so 36 + 7 = 43.'
          : 'Writing numbers in columns lines up ones under ones and tens under tens, so we add the same kind of thing together.',
        how: gen.regroup
          ? ['Line up ones under ones, tens under tens.', 'Add the ones first.', 'If the ones make 10 or more, write the ones digit and carry the new ten: write a small 1 above the tens.', 'Add the tens, including the carried ten.']
          : ['Line up ones under ones, tens under tens.', 'Add the ones.', 'Add the tens.'],
        example: gen.regroup ? '36 + 7: 6 + 7 = 13. Write 3, carry 1 ten. 3 tens + 1 ten = 4 tens. Answer: 43.' : '42 + 5: 2 + 5 = 7 ones. 4 tens. Answer: 47.',
        concrete: 'Build both numbers with ten-bundles and singles on a tens/ones mat. When 10 singles collect, rubber-band them into a ten and move it to the tens side.',
        pictorial: 'Draw quick tens and ones; circle 10 ones to make a new ten.',
        abstract: 'Solve column problems; write the carried 1 in the carry box.',
      }
    }
    case 'hundred-chart':
      return {
        what: `Finding patterns on a number chart up to ${gen.to}.`,
        why: 'Each row on the chart is a new ten. Moving right adds 1; moving down adds 10. The patterns show how our number system is built.',
        how: ['Find a number you know.', 'Count right to add 1, down to add 10.', 'Fill in the missing numbers using the patterns.'],
        concrete: 'Lay out number cards in rows of ten on the floor.',
        pictorial: 'Color the column of numbers ending in 5; what do you notice?',
        abstract: 'Fill in missing numbers on the chart.',
        movement: 'Hundred-chart hop: call "add 10" or "add 1" and the child moves on a floor chart or taps the chart.',
      }
    case 'skip-count':
      return {
        what: `Counting by ${gen.by}s.`,
        why: `Skip counting is counting equal groups. Counting by ${gen.by}s is faster than counting by ones because each count adds a whole group of ${gen.by}. It is the beginning of multiplication.`,
        how: [`Make groups of ${gen.by}.`, `Count one number for each group: ${[1, 2, 3, 4].map((n) => n * gen.by).join(', ')}…`, 'The last number tells how many in all.'],
        concrete: `Group real things by ${gen.by}s — ${gen.by === 2 ? 'socks or shoes in pairs' : gen.by === 5 ? 'fingers on hands' : 'dimes or bundles of 10 straws'} — and count the groups.`,
        pictorial: 'Circle groups on a hundred chart or draw groups of dots.',
        abstract: 'Fill in missing numbers in skip-counting rows.',
        movement: `Jump and count by ${gen.by}s: one jump for each group.`,
      }
    case 'equal-groups':
      return {
        what: 'Making equal groups and counting them — the beginning of multiplication.',
        why: 'When every group has the same number, we do not have to count one by one. 3 groups of 4 is 4 + 4 + 4 = 12. Skip counting 4, 8, 12 is a fast way to add equal groups.',
        how: ['Check that every group has the same number.', 'Count the groups.', 'Skip count (or add) the same number for each group.', 'Say: "__ groups of __ is __."'],
        example: '3 plates with 4 crackers each: 4, 8, 12. 3 groups of 4 is 12. 4 + 4 + 4 = 12.',
        concrete: 'Put the same number of counters on several plates; count the plates, then skip count the counters.',
        pictorial: 'Draw circles for groups and dots inside; write the repeated addition.',
        abstract: 'Write "__ groups of __ = __" and the repeated addition sentence.',
        realLife: ['There are 4 people and each gets 2 pancakes. How many pancakes do we need?', 'Each bike has 2 wheels. How many wheels on 3 bikes?', 'A pack has 5 juice boxes. How many in 2 packs?'],
        movement: 'Equal-group freeze: call "groups of 2!" and family members run into pairs; count the groups and the people.',
      }
    case 'share':
      return {
        what: 'Sharing things fairly into equal groups — the beginning of division.',
        why: 'Sharing fairly means everyone gets the same amount. Dividing 12 crackers among 3 plates gives 4 each because 3 groups of 4 is 12. Division is the opposite of making equal groups.',
        how: ['Count how many things there are.', 'Count how many groups (plates) there are.', 'Deal them out one at a time, like cards, until they are gone.', 'Count how many are on one plate. Check: groups × each = total.'],
        example: '12 crackers on 3 plates: deal 1, 1, 1… Each plate gets 4. Check: 4 + 4 + 4 = 12.',
        concrete: 'Deal real snacks or blocks onto plates, one at a time, until they are all shared.',
        pictorial: 'Draw plates and deal dots into them.',
        abstract: 'Write how many each group gets; check with repeated addition.',
        realLife: ['We have 10 grapes for 2 children. How many does each child get?', 'Share 8 crayons fairly between 4 children.', 'Can we share 7 cookies fairly between 2 people? What happens to the extra one?'],
        movement: 'Delivery game: the child "delivers" equal numbers of beanbags to baskets across the room, one trip per item.',
      }
    case 'clock':
      return {
        what: gen.half ? 'Telling time to the half hour.' : 'Telling time to the hour.',
        why: 'The short hand shows the hour; the long hand shows the minutes. When the long hand points to 12, a new hour starts (o’clock). Halfway around — on the 6 — is half past, 30 minutes.',
        how: ['Find the short hand: what number is it on (or just past)?', 'Find the long hand: on 12 means o’clock; on 6 means :30.', 'Say the time.'],
        concrete: 'Move the hands on a paper-plate clock while saying the times of your day (breakfast, lunch, bed).',
        pictorial: 'Draw hands on clock faces.',
        abstract: 'Write times in digital form: 3:00, 3:30.',
        realLife: ['Lunch is at 12:00. Show it on the clock.', 'We leave for co-op at 8:30. Where are the hands?'],
      }
    case 'coins':
      return {
        what: 'Naming coins and counting money.',
        why: 'Coins are worth different amounts no matter their size: a dime is small but worth 10¢. Counting the biggest coins first and counting on is fastest — like counting tens before ones.',
        how: ['Sort the coins by kind.', 'Start with the coin worth the most.', 'Count on: 25, 35, 40, 41…'],
        concrete: 'Sort and count real coins; play store with price tags.',
        pictorial: 'Write the value under each coin picture, then count on.',
        abstract: 'Write the total with the ¢ sign.',
        realLife: ['A pencil costs 15¢. Show it with a dime and a nickel.', 'You have 3 dimes. Can you buy an eraser for 25¢? How much is left?'],
      }
    case 'graph':
      return {
        what: 'Sorting information into a graph and answering questions about it.',
        why: 'A graph shows counts as pictures or bars so we can compare them at a glance. The tallest column has the most.',
        how: ['Count each group.', 'Make one mark or picture for each thing.', 'Compare: most, fewest, how many more?'],
        concrete: 'Sort real objects (toy cars by color) into rows, then count each row.',
        pictorial: 'Draw a picture graph from the sorted objects.',
        abstract: 'Answer questions: Which has the most? How many more?',
        realLife: ['Survey the family: favorite fruit. Which fruit won? By how many?'],
      }
    case 'fractions':
      return {
        what: 'Splitting shapes into equal parts: halves and fourths.',
        why: 'Fair shares must be the SAME size. 2 equal parts are halves; 4 equal parts are fourths. More parts means each part is smaller.',
        how: ['Count the parts.', 'Check: are all the parts the same size?', 'Name them: 2 equal parts = halves, 4 equal parts = fourths.'],
        concrete: 'Fold paper circles and squares; cut a sandwich or tortilla into halves and fourths.',
        pictorial: 'Draw lines to split shapes into equal parts; shade one part.',
        abstract: 'Circle shapes that show equal parts; label halves and fourths.',
        realLife: ['Cut an apple in half. Are the halves equal? Now cut it into fourths.'],
      }
    case 'sort':
      return {
        what: `Sorting objects into groups by ${gen.by === 'kind' ? 'what they are' : gen.by}.`,
        why: 'Sorting means putting things that are the same in some way together. Choosing a rule (color, size, kind) and sticking to it is how we organize and later count and compare.',
        how: ['Choose one rule.', 'Look at each object and ask: which group does it belong in?', 'Count each group.'],
        concrete: 'Sort real objects (laundry, toys, buttons) into bowls.',
        pictorial: 'Draw lines from pictures to the right group.',
        abstract: 'Count each group and write the number.',
        realLife: ['Sort the clean silverware: forks, spoons, knives. Which pile has the most?'],
      }
    case 'ordinal':
      return {
        what: 'Using position words: first, second, third, next, last.',
        why: 'Ordinal numbers tell position in a line, not how many. The first child is at the front; "third" means there are two before it.',
        how: ['Find the front of the line.', 'Count positions from the front: first, second, third…'],
        concrete: 'Line up toys and name their positions.',
        pictorial: 'Color the third picture, circle the last…',
        abstract: 'Write the position number.',
        movement: 'Line up the family; call "second person, hop!" and "last person, clap!"',
      }
    case 'one-more':
      return {
        what: gen.less ? 'Finding one less than a number.' : 'Finding one more than a number.',
        why: gen.less ? 'Taking one away makes a group one smaller — the number just before it when we count.' : 'Adding one makes a group one bigger — the very next number when we count.',
        how: ['Count the group.', gen.less ? 'Take one away.' : 'Add one more.', gen.less ? 'Say the number that comes just before.' : 'Say the number that comes next.'],
        concrete: 'Build a tower; add or remove one block and count again.',
        pictorial: 'Draw one more picture (or cross one out).',
        abstract: 'Write the new number.',
      }
  }
}

/** Everyday contexts used for Apply-day story problems when a template has none. */
function defaultRealLife(t: MathTopic): string[] {
  const g = t.gen
  const max = 'max' in g && typeof g.max === 'number' ? g.max : 10
  const n = (k: number) => Math.max(1, Math.min(max, k))
  if (g.kind === 'facts' || g.kind === 'add-pictures' || g.kind === 'sub-pictures' || g.kind === 'number-bond' || g.kind === 'fact-family' || g.kind === 'word-problems' || g.kind === 'number-line') {
    const a = n(Math.ceil(max * 0.6))
    const b = n(Math.max(1, Math.floor(max * 0.3)))
    return [
      `Cooking: we need ${a} eggs and we have ${b}. How many more do we need?`,
      `Setting the table: ${b} plates are out and ${Math.max(1, a - b)} more people are coming. How many plates in all?`,
      `Laundry: count ${a} socks, then pair them. Are there any left over?`,
    ]
  }
  return [`Find ${t.title.toLowerCase()} in real life around the house and talk about it.`]
}

function defaultMovement(t: MathTopic, grade: Grade): string {
  const g = t.gen
  if (g.kind.startsWith('count') || g.kind === 'trace-numbers' || g.kind === 'one-more' || g.kind === 'ten-frame') {
    return `Number hopscotch: chalk or tape numbers ${grade === 'pre-k' ? '1–10' : '1–20'}; call a number and the child hops to it, then jumps that many times.`
  }
  if (g.kind === 'facts' || g.kind === 'number-bond' || g.kind === 'fact-family' || g.kind === 'true-false' || g.kind === 'two-digit' || g.kind === 'vertical') {
    return 'Answer hop: tape answer cards on the floor; call a problem and the child hops to the answer and explains how they know.'
  }
  if (g.kind === 'place-value' || g.kind === 'ten-more-less') {
    return 'Tens and ones relay: the child runs to collect bundles (tens) and single sticks (ones) to build the number you call.'
  }
  return 'Math scavenger hunt: hide 5 cards around the room, each with a quick question about this week’s skill.'
}

export function mathMethod(t: MathTopic): MathMethod {
  const base = forGen(t.gen, t.grade)
  const merged: MathMethod = {
    ...base,
    realLife: base.realLife ?? defaultRealLife(t),
    movement: base.movement ?? defaultMovement(t, t.grade),
    ...(t.method ?? {}),
  }
  return merged
}

/**
 * Mental-math warm-up for a lesson day (1–2 minutes, out loud, no paper).
 * Draws on what was already taught so every week builds on earlier weeks.
 */
export function mentalMathWarmUp(grade: Grade, week: number, day: number): string {
  const seed = week * 4 + day
  if (grade === 'pre-k') {
    const to = Math.min(5 + Math.floor(week / 3), 20)
    const options = [
      `Count out loud to ${to} together, clapping each number.`,
      `Show me ${Math.min(1 + (seed % 5), 5)} fingers. Now one more. How many now?`,
      week >= 10 ? `Count backward from ${Math.min(5 + Math.floor(week / 9), 10)} like a rocket: … 3, 2, 1, blast off!` : 'Count 3 jumps, then 4 claps.',
      `Number of the day: ${1 + (seed % Math.min(10, 3 + Math.floor(week / 3)))}. Hold up that many fingers and stomp that many times.`,
    ]
    return pick(options, seed)
  }
  if (grade === 'k') {
    const start = 1 + (seed % Math.min(15, 3 + week))
    const options = [
      `Count forward from ${start} (not from 1) to ${Math.min(start + 8, week >= 22 ? 100 : 20)}.`,
      `Count backward from ${week >= 12 ? 20 : 10} to 0.`,
      week >= 12 ? `Partners of 5: I say a number, you say its partner to make 5 (${seed % 6} → ${5 - (seed % 6)}).` : `What is one more than ${start}? One less?`,
      week >= 16 ? `Partners of 10 with fingers: show ${seed % 11}; how many fingers are down?` : `Show ${start % 10} on a ten frame in your mind: how many more make 10?`,
      week >= 22 ? 'Count by 10s to 100.' : `Say the number after ${start}, then the number before ${start + 1}.`,
    ]
    return pick(options, seed)
  }
  const n = 20 + ((seed * 7) % 70)
  const options = [
    `Count forward from ${n} to ${n + 12}; then backward from ${n + 5} to ${n - 5}.`,
    `Make 10: I say a number, you say its partner (${seed % 10} → ${10 - (seed % 10)}). Do five of them.`,
    `Doubles: ${1 + (seed % 9)} + ${1 + (seed % 9)}? Now one more than that double?`,
    week >= 17 ? `10 more and 10 less than ${n}?` : 'Count by 2s to 20, then by 5s to 50.',
    week >= 14 ? `How many tens and ones in ${n}?` : `What is 1 more and 1 less than ${n}?`,
    week >= 24 ? 'Skip count by 2s, 5s, and 10s — one minute each, with jumps.' : `Count by 10s from ${seed % 10}: ${seed % 10}, ${(seed % 10) + 10}, ${(seed % 10) + 20}…`,
  ]
  return pick(options, seed)
}
