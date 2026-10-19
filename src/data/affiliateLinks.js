// Single source of truth for Amazon affiliate destinations.
//
// To swap a Wish List for an Amazon Idea List (or a direct product link) later,
// change the URL on that one line below — every post link using {% alink %}
// updates automatically. The associate tag is also set once, here.

export const AMAZON_TAG = 'preparedathome-21';

// Base URLs WITHOUT the ?tag= param. The tag is appended once, in affiliateUrl().
const lists = {
  torch: 'https://www.amazon.co.uk/hz/wishlist/ls/3U65BNDUEJOGE',
  powerbank: 'https://www.amazon.co.uk/hz/wishlist/ls/1J835ZUILIDKG',
  radio: 'https://www.amazon.co.uk/hz/wishlist/ls/1TNPQ743YE90T',
  tinopener: 'https://www.amazon.co.uk/hz/wishlist/ls/3VWQ8TAKCWRLG',
  firstaid: 'https://www.amazon.co.uk/hz/wishlist/ls/1J38VW9K44WWB',
  water: 'https://www.amazon.co.uk/hz/wishlist/ls/11AEF2AV5147Z',
  tins: 'https://www.amazon.co.uk/hz/wishlist/ls/1GM6NCRY2I30L',
};

export function affiliateUrl(id) {
  const base = lists[id];
  if (!base) return null;
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}tag=${AMAZON_TAG}`;
}

export const affiliateIds = Object.keys(lists);
