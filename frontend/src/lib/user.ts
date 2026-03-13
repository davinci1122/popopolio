/**
 * Utility for user-related assets
 */

const PROFILE_IMAGES = [
  'profile_1.jpg',
  'profile_2.JPG',
  'profile_3.jpg',
  'profile_4.JPEG',
  'profile_5.JPG',
  'profile_6.JPG'
];

/**
 * Returns a consistent profile image for a given nickname or ID
 * using the length/char codes as a simple seed.
 */
export const getRandomProfileImage = (seed: string | number) => {
  const seedStr = String(seed);
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PROFILE_IMAGES.length;
  return `/profiles/${PROFILE_IMAGES[index]}`;
};
