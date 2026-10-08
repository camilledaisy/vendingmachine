export const PLAYFUL_LINES = [
  ['Processing feelings.', 'Please hold.'],
  ['Checking inventory of small comforts.', ''],
  ['One moment.', 'The machine is having a moment.'],
  ['Your selection is being prepared.', 'Please avoid making any major life decisions in the meantime.'],
  ['Consulting the back room.', 'There is no back room.'],
  ['Rummaging.', 'Please do not read into the noises.'],
] as const

export const DELIVERED_LINES = [
  ['Your item has been approved by management.', ''],
  ['Please collect your emotional baggage.', 'Just kidding.'],
  ['Item dispensed.', 'It is a little warm. That is normal.'],
] as const

export const MAINTENANCE_LOG: { date: string; note: string }[] = [
  { date: 'January 6', note: 'Item stuck in the spiral. Freed with a gentle tap. Machine said "ow", then immediately denied saying it.' },
  { date: 'March 3', note: 'Coin return jammed with one button. Not ours. Kept it anyway.' },
  { date: 'May 19', note: 'Machine hums when nobody is looking. Technician pretended not to notice.' },
  { date: 'June 2', note: 'Replaced one bulb. Machine did not say thank you. Then it did. Awkward for everyone.' },
  { date: 'July 30', note: 'A visitor asked it for a plan. Machine declined and offered a very small umbrella instead.' },
  { date: 'August 14', note: 'Pigeon on the roof identified as unsupervised. Left alone.' },
  { date: 'September 9', note: 'The cat on top is not on the payroll. The cat is not leaving. Arrangement approved.' },
  { date: 'October 12', note: 'Machine reported feeling underappreciated. Technician advised positive reinforcement. Machine said "fine". Technician said "good machine". Lights stayed on all night.' },
  { date: 'November 1', note: 'Machine asked whether anyone had visited while it was switched off. Technician said yes. Machine glowed for six minutes.' },
  { date: 'December 24', note: 'Lights left on all night. Reason given: "in case."' },
  { date: 'Always', note: 'Please be gentle with the machine. It is doing its best.' },
]

export const HATCH_NOTE = [
  'If you found this, you were paying attention.',
  "That's most of what it takes, honestly.",
  'There is nothing else in the drawer. I checked. Twice.',
  '— whoever restocks the machine',
  "P.S. The cat's name is Inventory.",
]

export const SELECT_HINTS = [
  ['Please make a selection first.', 'I cannot read minds. I have tried.'],
  ['Nothing selected.', 'Even "I don\'t know" is an option. It is on the bottom right.'],
] as const
