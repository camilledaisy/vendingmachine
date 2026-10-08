// Everything the machine can dispense lives here.
// To add an object: append to ITEMS, give it a unique `id` and `inv`, and add
// a matching drawing under the same id in src/art/art.ts.

export type CatId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export interface Category {
  id: CatId
  code: string // the label on the button
  label: string
  quip: string // what the display says when selected
  art: string // which object is shown in the compartment
}

export interface Item {
  id: string
  name: string
  cat: CatId
  message: string
  description: string
  inv: string // unique inventory number
  image?: string // optional photo/meme in public/memes/, shown instead of the drawing
}

export const CATEGORIES: Category[] = [
  { id: 'A', code: 'A01', label: 'A little reassurance', quip: 'Checking inventory of small comforts.', art: 'jar' },
  { id: 'B', code: 'B02', label: 'Something to laugh at', quip: 'Humour is stocked on the second shelf.', art: 'frog' },
  { id: 'C', code: 'C03', label: 'A reason to look forward to tomorrow', quip: 'Tomorrow has been notified.', art: 'ticket' },
  { id: 'D', code: 'D04', label: 'To feel understood', quip: 'I will do my best. I am a vending machine.', art: 'receipt' },
  { id: 'E', code: 'E05', label: 'A distraction', quip: 'Excellent. Something else to look at.', art: 'marble' },
  { id: 'F', code: 'F06', label: "I don't know, actually", quip: 'Unfortunately, we are unable to dispense certainty.', art: 'egg' },
]

export const ITEMS: Item[] = [
  // A — reassurance
  { id: 'star', cat: 'A', inv: '0417', name: 'Tiny Paper Star', message: "You don't have to be extraordinary every day.", description: 'Folded from a single sheet that had other plans. Fits in a coat pocket, a book, or a bad mood.' },
  { id: 'umbrella', cat: 'A', inv: '0642', name: 'A Very Small Umbrella', message: 'For problems that feel bigger than the weather forecast.', description: 'Keeps off approximately one raindrop. Morally, it covers much more.' },
  { id: 'jar', cat: 'A', inv: '0233', name: 'Jar of Borrowed Patience', message: "Contents may be insufficient, but it's a start.", description: 'On loan. Return whenever you have some to spare. Nobody is keeping track.' },
  { id: 'nightlight', cat: 'A', inv: '0871', name: 'Plug-In Night Light', message: 'Not a solution. Just something that stays on while you work it out.', description: 'Warm amber glow. Has never once asked how you are doing.' },
  { id: 'sock', cat: 'A', inv: '0159', name: 'One Warm Sock', message: 'Missing its pair, still doing its job. Take notes.', description: 'Lightly darned. Smells faintly of toast. Fits whichever foot needs it.' },
  { id: 'bandage', cat: 'A', inv: '0905', name: 'Emotional Plaster', message: "Doesn't fix anything. Does let everyone know you're working on it.", description: 'Extra sticky. Pattern: tiny dots, discreet but sincere.' },

  // B — laugh
  { id: 'frog', cat: 'B', inv: '0318', name: 'Miniature Ceramic Frog', message: 'I have reviewed the situation. You may proceed.', description: 'Glazed, serious, and wearing a monocle for reasons of its own.' },
  { id: 'complaint', cat: 'B', inv: '0764', name: 'Pre-Filled Complaint Form', message: 'Dear universe: this was not what I ordered. Sincerely, everyone.', description: 'Already signed. Please submit to any available cosmic department.' },
  { id: 'trophy', cat: 'B', inv: '0526', name: 'Trophy for Attending', message: 'That meeting could have been an email. You were there anyway. Honour.', description: 'Gold-ish. Engraved with the word "present", and nothing else.' },
  { id: 'spoon', cat: 'B', inv: '0092', name: 'Slightly Haunted Spoon', message: "It's friendly. It just stirs things at odd hours.", description: 'Found in a drawer that wasn\'t there yesterday. Excellent with soup.' },
  { id: 'duck', cat: 'B', inv: '0687', name: 'Rubber Duck, Consulting', message: 'Explain the problem to the duck. The duck has seen worse.', description: 'Available for debugging, overthinking and light bath-time advice.' },
  { id: 'coupon', cat: 'B', inv: '0413', name: 'Expired Coupon for Free Advice', message: 'Expired in 1997. The advice remains valid: drink some water.', description: 'Not redeemable. The advice, however, is on the house.' },

  // B — photographs
  { id: 'sundress', cat: 'B', inv: '1001', name: 'Small Figure in a Sundress', message: 'Resigned. Presentable. Ready for whatever you are about to say.', description: 'Standing very still on a ledge, hoping this goes quickly.', image: '/memes/sundress-monkey.jpg' },
  { id: 'suspenders', cat: 'B', inv: '1002', name: 'Small Employee, Suspenders', message: 'Has reviewed your situation. Not impressed, but willing to help.', description: 'Has been on the same call since nine, and it shows.', image: '/memes/suspender-monkey.jpg' },
  { id: 'ladybug', cat: 'B', inv: '1003', name: 'Ladybug, Allegedly', message: 'Sometimes you pick a costume and commit.', description: 'Has been given a spot on the leaf. Is not questioning it.', image: '/memes/ladybug-pug.jpg' },
  { id: 'bigsmile', cat: 'B', inv: '1004', name: 'Large Calm, Small Dog', message: 'One very big feeling and one very small problem. Both are in the picture.', description: 'The large one is serene. The small one has doubts. They coexist.', image: '/memes/big-smile-small-dog.jpg' },
  { id: 'dumpling', cat: 'B', inv: '1005', name: 'Dumpling, Having a Day', message: 'Cry, then eat something warm. Both count as steps.', description: 'Curled up and tear-streaked, but still soft at heart.', image: '/memes/sad-dumpling.jpg' },

  { id: 'happymonkey', cat: 'B', inv: '1006', name: 'Very Happy Drawing', message: 'Nobody told it to calm down, and it is better for it.', description: 'Drawn at some point, by someone, with total commitment.', image: '/memes/happy-monkey.jpg' },
  { id: 'snailmonkey', cat: 'B', inv: '1007', name: 'Sponge-Adjacent Neighbour', message: 'Do not ask. Just wave back.', description: 'Appeared from the background with feelers and no explanation.', image: '/memes/snail-monkey.jpg' },
  { id: 'heartbear', cat: 'B', inv: '1008', name: 'Bear with a Heart', message: 'Is giving you the heart. Is also judging you a little.', description: 'Soft, sincere, and watching how you take it.', image: '/memes/heart-bear.jpg' },

  // C — tomorrow
  { id: 'key', cat: 'C', inv: '0750', name: 'Spare Key', message: "For doors you haven't discovered yet.", description: 'Fits no lock you currently own. Keep it somewhere you will find it.' },
  { id: 'ticket', cat: 'C', inv: '0288', name: 'Ticket to Tomorrow', message: 'Valid for one more chance to experience something unexpectedly nice.', description: 'Non-transferable, non-refundable, and surprisingly easy to use.' },
  { id: 'seed', cat: 'C', inv: '0934', name: 'A Single Seed', message: "Nobody knows what it'll be. That's the whole appeal.", description: 'Comes in a packet far larger than necessary. Water occasionally.' },
  { id: 'postcard', cat: 'C', inv: '0571', name: 'Postcard from Next Thursday', message: 'Weather: fine. Wish you were here. (You will be.)', description: 'Postmarked slightly in the future. The handwriting is oddly familiar.' },
  { id: 'boat', cat: 'C', inv: '0126', name: 'Folded Paper Boat', message: 'Not seaworthy. Tomorrow is mostly a short trip anyway.', description: 'Sails well on puddles and in the margins of notebooks.' },
  { id: 'bakery', cat: 'C', inv: '0809', name: 'Unopened Bakery Bag', message: "Something warm is in there. You'll find out in the morning.", description: 'Still slightly warm. Contents: unspecified, but promising.' },

  // D — understood
  { id: 'receipt', cat: 'D', inv: '0365', name: 'Receipt for Trying', message: 'One ordinary day survived. Payment received in effort.', description: 'Itemised. Total due: nothing. Thank you for your custom.' },
  { id: 'teacup', cat: 'D', inv: '0698', name: 'Mended Teacup', message: 'The crack is part of its history. The tea is still hot.', description: 'Repaired with a gold seam. Holds exactly as much as it used to.' },
  { id: 'letter', cat: 'D', inv: '0044', name: 'Unsent Letter', message: 'You wrote it. That counts, even if it stays in the envelope.', description: 'Sealed. No stamp. Entirely sincere.' },
  { id: 'cloud', cat: 'D', inv: '0957', name: 'Pocket-Sized Rain Cloud', message: 'Honest about the weather. Slightly clingy. Means well.', description: 'Follows you around, drizzles a little, never pretends to be sunny.' },
  { id: 'chair', cat: 'D', inv: '0472', name: 'A Second Chair', message: "Someone saved you a seat. It's this one. Sit anywhere.", description: 'Dolls-house scale. Real-life comfort rating: surprisingly high.' },
  { id: 'sticky', cat: 'D', inv: '0831', name: 'Sticky Note That Says "Same"', message: 'Same. Genuinely. Carry on.', description: 'One word, handwritten. Adhesive wearing off, sentiment is not.' },

  // E — distraction
  { id: 'maze', cat: 'E', inv: '0207', name: 'Tiny Maze', message: 'Entrance on the left. The exit is mostly a rumour. Enjoy the wandering.', description: 'Fits on a thumbnail. Has at least one dead end of real character.' },
  { id: 'buttons', cat: 'E', inv: '0593', name: 'Bag of Mystery Buttons', message: "None of them match. All of them are interesting. Sort them, or don't.", description: 'Collected from coats that no longer exist.' },
  { id: 'moon', cat: 'E', inv: '0719', name: 'Pocket Moon', message: "Look at it for a minute. It's been looking at you for years.", description: 'Portable. Slightly fewer craters than the original.' },
  { id: 'fortune', cat: 'E', inv: '0380', name: 'Paper Fortune Teller', message: "Pick a number. Pick a colour. The answer is 'probably fine.'", description: 'Every fold is accurate. Every prediction is the same one.' },
  { id: 'snail', cat: 'E', inv: '0846', name: 'A Snail, Briefly', message: 'A snail can sleep for three years. Imagine the audacity.', description: 'On loan, in a manner of speaking. Please do not rush it.' },
  { id: 'marble', cat: 'E', inv: '0111', name: 'One Good Marble', message: "Hold it up to the light. Don't make it mean anything. Just look.", description: 'Green glass swirl. Previously owned by a very serious child.' },

  // F — I don't know
  { id: 'permission', cat: 'F', inv: '0654', name: 'Emergency Permission Slip', message: 'You are officially permitted to change your mind.', description: 'Signed, stamped and valid in all situations, including this one.' },
  { id: 'jar2', cat: 'F', inv: '0275', name: 'Unlabelled Jar', message: 'Contents unknown. Possibly nothing. Possibly something. Keep it a while.', description: 'The label was left blank on purpose. It rattles in a hopeful way.' },
  { id: 'compass', cat: 'F', inv: '0918', name: 'Slightly Confused Compass', message: "It doesn't point north. It points at whatever you were about to want.", description: 'Follow it, or don\'t. It has been wrong before and it is at peace with that.' },
  { id: 'door', cat: 'F', inv: '0539', name: 'Door, Ajar', message: 'Neither in nor out. A perfectly respectable place to stand for a bit.', description: 'Miniature. Hinges well oiled. The light on the other side is warm.' },
  { id: 'blank', cat: 'F', inv: '0162', name: 'Blank Postcard', message: 'Nothing needs to be written yet. The stamp is already paid for.', description: 'Comes with a stub of pencil, for when you do know.' },
  { id: 'egg', cat: 'F', inv: '0780', name: 'Egg, Unexplained', message: 'We do not know what is inside either. Welcome to the club.', description: 'Speckled, warm to the touch, and entirely uncommitted.' },
]

export const byId = (id: string) => ITEMS.find((i) => i.id === id)
export const catOf = (id: CatId) => CATEGORIES.find((c) => c.id === id)!

if (import.meta.env.DEV) {
  const dup = (xs: string[]) => xs.filter((x, i) => xs.indexOf(x) !== i)
  const bad = [...dup(ITEMS.map((i) => i.id)), ...dup(ITEMS.map((i) => i.inv))]
  if (bad.length) console.warn('Duplicate item id/inv numbers:', bad)
}
