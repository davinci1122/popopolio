const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const db = require('../database');
const auth = require('../middleware/auth');
const router = express.Router();

const upload = multer({
    dest: 'temp_uploads/',
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit before processing
});

// Post creation
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const { tsukkomi, lat, lng } = req.body;
        const filename = `tsukkomi_${Date.now()}.jpg`;
        const outputPath = path.join(__dirname, '../../uploads', filename);

        // Image processing with Sharp - force resize and compression to stay under 1MB
        await sharp(req.file.path)
            .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toFile(outputPath);

        // Delete temp file
        fs.unlinkSync(req.file.path);

        const stmt = db.prepare('INSERT INTO posts (user_id, tsukkomi, image_path, lat, lng) VALUES (?, ?, ?, ?, ?)');
        stmt.run(req.user.id, tsukkomi, `/uploads/${filename}`, lat, lng);

        res.status(201).send({ message: 'Post created successfully' });
    } catch (e) {
        console.error(e);
        res.status(400).send({ error: 'Error creating post' });
    }
});

// Get Feed (Newest or Ranking)
router.get('/', (req, res) => {
    const { sort, userId } = req.query;
    let query = `
    SELECT p.*, u.nickname, 
    (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = ?) as isLiked
    FROM posts p
    JOIN users u ON p.user_id = u.id
  `;

    if (sort === 'ranking') {
        query += ' ORDER BY votes_count DESC, created_at DESC';
    } else {
        query += ' ORDER BY created_at DESC';
    }

    const posts = db.prepare(query).all(userId || 0);
    res.send(posts);
});

// Like/Unlike Toggle
router.post('/:id/like', auth, (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    try {
        const existing = db.prepare('SELECT * FROM likes WHERE post_id = ? AND user_id = ?').get(postId, userId);

        if (existing) {
            // Unlike
            const transaction = db.transaction(() => {
                db.prepare('DELETE FROM likes WHERE post_id = ? AND user_id = ?').run(postId, userId);
                db.prepare('UPDATE posts SET votes_count = votes_count - 1 WHERE id = ?').run(postId);
            });
            transaction();
            res.send({ liked: false });
        } else {
            // Like
            const transaction = db.transaction(() => {
                db.prepare('INSERT INTO likes (post_id, user_id) VALUES (?, ?)').run(postId, userId);
                db.prepare('UPDATE posts SET votes_count = votes_count + 1 WHERE id = ?').run(postId);
            });
            transaction();
            res.send({ liked: true });
        }
    } catch (e) {
        res.status(400).send({ error: 'Error processing like' });
    }
});

module.exports = router;
