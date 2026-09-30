// fit: how well the cut suits each face shape, 1-5.
const f = (oval, round, square, oblong, heart, diamond) => ({ oval, round, square, oblong, heart, diamond });

export const STYLES = [
  {
    id: 'textured-crop', name: 'Textured Crop', length: 'short', types: ['straight', 'wavy', 'curly'],
    fit: f(5, 4, 4, 3, 4, 4),
    desc: 'Short choppy top with a fade or tapered sides.',
    tip: 'Ask for a #1-2 fade with 2-3 inches on top, cut with point-cutting. Style with matte clay.',
  },
  {
    id: 'taper-fade', name: 'Taper Fade', length: 'short', types: ['straight', 'wavy', 'curly', 'coily'],
    fit: f(5, 4, 5, 3, 4, 4),
    desc: 'Clean gradual fade that keeps the sides tight and the top your own.',
    tip: 'Low, mid or high changes the whole vibe. Mid is the safe pick. Keep the top 2+ inches for balance.',
  },
  {
    id: 'quiff', name: 'Quiff', length: 'short', types: ['straight', 'wavy'],
    fit: f(5, 5, 4, 2, 3, 4),
    desc: 'Volume swept up and back at the front for extra height.',
    tip: 'Blow-dry up and back, finish with pomade or paste. Height lengthens round faces.',
  },
  {
    id: 'side-part', name: 'Classic Side Part', length: 'short', types: ['straight', 'wavy'],
    fit: f(5, 3, 5, 4, 4, 4),
    desc: 'Sharp, timeless parting with tidy sides.',
    tip: 'Find your natural part line and comb it in while damp. A hard part adds definition.',
  },
  {
    id: 'slick-back', name: 'Slick Back', length: 'medium', types: ['straight', 'wavy'],
    fit: f(5, 3, 4, 2, 4, 3),
    desc: 'Length combed straight back for a polished look.',
    tip: 'Needs about 3-4 inches. Use a strong-hold gel or pomade and a comb.',
  },
  {
    id: 'buzz', name: 'Buzz Cut', length: 'short', types: ['straight', 'wavy', 'curly', 'coily'],
    fit: f(4, 2, 5, 2, 3, 3),
    desc: 'Low-maintenance, clipper-all-over. Shows off bone structure.',
    tip: 'Start at a #3-4 guard to see how your head shape looks before going shorter.',
  },
  {
    id: 'french-crop', name: 'French Crop', length: 'short', types: ['straight', 'wavy', 'curly'],
    fit: f(5, 4, 4, 5, 3, 4),
    desc: 'Short fringe cut straight across with faded sides.',
    tip: 'The fringe visually shortens long faces. Ask for a blunt fringe with a skin or low fade.',
  },
  {
    id: 'curly-top-fade', name: 'Curly Top Fade', length: 'short', types: ['curly', 'coily'],
    fit: f(5, 5, 4, 3, 4, 4),
    desc: 'Defined curls on top with a clean fade underneath.',
    tip: 'Use a curl cream and diffuse or air-dry. Leave 3+ inches on top for definition.',
  },
  {
    id: 'twist-sponge', name: 'Twists / Sponge Curls', length: 'short', types: ['coily'],
    fit: f(5, 4, 4, 4, 4, 5),
    desc: 'Coil sponge or twist-out on top with tight sides.',
    tip: 'Use a coil sponge on 2-3 inches of growth, or twist damp hair and unravel when dry.',
  },
  {
    id: 'waves-360', name: '360 Waves', length: 'short', types: ['coily', 'curly'],
    fit: f(5, 4, 5, 3, 4, 4),
    desc: 'Short, brushed-down hair with a rippling wave pattern all the way around.',
    tip: 'Ask for a #1-2 on top with a clean line-up. Brush daily and wear a durag at night to set the waves.',
  },
  {
    id: 'afro', name: 'Afro', length: 'medium', types: ['coily', 'curly'],
    fit: f(5, 3, 5, 5, 4, 5),
    desc: 'Full natural volume, shaped evenly into a rounded outline.',
    tip: 'Ask for a shape-up that keeps it round and even. Pick it out from the roots and moisturize daily.',
  },
  {
    id: 'curtains', name: 'Curtains / Middle Part', length: 'medium', types: ['straight', 'wavy'],
    fit: f(5, 2, 3, 5, 4, 5),
    desc: 'Center-parted length that frames both sides of the face.',
    tip: 'Add a little width at the sides for narrow faces. Sea-salt spray keeps the texture.',
  },
  {
    id: 'messy-fringe', name: 'Messy Fringe', length: 'medium', types: ['straight', 'wavy'],
    fit: f(5, 3, 4, 5, 5, 4),
    desc: 'Textured fringe that softens the forehead.',
    tip: 'Great for broad foreheads. Ask for a textured fringe, not a heavy blunt one.',
  },
  {
    id: 'flow', name: 'Medium Flow', length: 'medium', types: ['straight', 'wavy', 'curly'],
    fit: f(5, 3, 4, 3, 4, 4),
    desc: 'Layered length, ear to jaw, that moves naturally.',
    tip: 'Regular trims every 8-10 weeks keep it shaped. Add layers to control weight.',
  },
  {
    id: 'curly-medium', name: 'Curly Medium Length', length: 'medium', types: ['curly', 'coily'],
    fit: f(5, 3, 4, 4, 4, 4),
    desc: 'Voluminous curls kept in a shaped, layered cut.',
    tip: 'Ask for a dry cut. Diffuse or air-dry with a leave-in and gel.',
  },
  {
    id: 'layers-long', name: 'Long Layers', length: 'long', types: ['straight', 'wavy', 'curly'],
    fit: f(5, 3, 4, 3, 4, 4),
    desc: 'Longer hair with layers to add shape and movement.',
    tip: 'Face-framing layers help. On round faces, start layers below the chin.',
  },
  {
    id: 'waves-shoulder', name: 'Shoulder-Length Waves', length: 'long', types: ['wavy', 'curly', 'straight'],
    fit: f(5, 3, 4, 5, 4, 4),
    desc: 'Soft waves adding width, great for balancing long faces.',
    tip: 'Add width at the sides with waves or a curling wand; keep the ends healthy.',
  },
  {
    id: 'braids-locs', name: 'Braids / Locs', length: 'long', types: ['coily', 'curly'],
    fit: f(5, 4, 5, 4, 4, 5),
    desc: 'Protective, long-lasting styles with lots of variety.',
    tip: 'Go to a stylist who specializes in your hair type. Scalp care matters as much as the style.',
  },
];

export const HAIR_TYPES = ['straight', 'wavy', 'curly', 'coily'];
export const LENGTHS = ['short', 'medium', 'long'];

export function recommend(shape, { hairType, length }) {
  return STYLES.filter((s) => (!hairType || s.types.includes(hairType)) && (!length || s.length === length))
    .map((s) => ({ ...s, match: Math.round(55 + (s.fit[shape] / 5) * 43) }))
    .sort((a, b) => b.match - a.match);
}

export const HAIR_COLORS = [
  { name: 'Jet black', hex: '#0d0d10' },
  { name: 'Espresso', hex: '#3b2417' },
  { name: 'Chestnut', hex: '#6b3e26' },
  { name: 'Caramel', hex: '#a86b32' },
  { name: 'Dirty blonde', hex: '#b89a5b' },
  { name: 'Platinum', hex: '#e9e4d0' },
  { name: 'Ash grey', hex: '#8f95a1' },
  { name: 'Copper', hex: '#b5482a' },
  { name: 'Burgundy', hex: '#6e1a35' },
  { name: 'Violet', hex: '#7a3fd1' },
  { name: 'Blue', hex: '#2f6bff' },
  { name: 'Pink', hex: '#ff5fa2' },
];
