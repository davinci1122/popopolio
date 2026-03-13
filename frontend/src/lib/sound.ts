/**
 * Utility for playing sound effects and laughter
 */

const SE_BASE_PATH = '/sounds/';

export const playSE = (id: number) => {
    try {
        const audio = new Audio(`${SE_BASE_PATH}${id}.mp3`);
        audio.play().catch(err => console.error('Audio play failed:', err));
    } catch (e) {
        console.error('Audio error:', e);
    }
};

export const playRandomLaugh = () => {
    try {
        const laughs = ['laugh_1', 'laugh_2', 'laugh_3', 'laugh_4'];
        const randomLaugh = laughs[Math.floor(Math.random() * laughs.length)];
        const audio = new Audio(`${SE_BASE_PATH}${randomLaugh}.mp3`);
        audio.play().catch(err => console.error('Laugh play failed:', err));
    } catch (e) {
        console.error('Audio error:', e);
    }
};
