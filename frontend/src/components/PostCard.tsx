import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { playRandomLaugh } from '../lib/sound';
import { getRandomProfileImage } from '../lib/user';

interface PostProps {
    post: {
        id: number;
        tsukkomi: string;
        image_path: string;
        nickname: string;
        votes_count: number;
        isLiked: number;
        created_at: string;
    };
}

export const PostCard: React.FC<PostProps> = ({ post }) => {
    const { user } = useAuth();
    const [liked, setLiked] = useState(!!post.isLiked);
    const [count, setCount] = useState(post.votes_count);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleLike = async () => {
        if (!user) return alert('ログインが必要です！');

        // Optimistic UI
        setLiked(!liked);
        setCount(prev => liked ? prev - 1 : prev + 1);
        setIsAnimating(true);
        playRandomLaugh();
        setTimeout(() => setIsAnimating(false), 300);

        try {
            await api.post(`/posts/${post.id}/like`);
        } catch (e) {
            // Revert on error
            setLiked(liked);
            setCount(count);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="neo-brutal-card mb-8 overflow-hidden relative"
        >
            <div className="relative">
                <img
                    src={`http://localhost:3001${post.image_path}`}
                    alt="Street View"
                    className="w-full h-auto border-b-4 border-black"
                />

                {/* Tsukkomi Overlay */}
                <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
                    <motion.div
                        initial={{ scale: 0.8, rotate: -5 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="tsukkomi-text text-center"
                    >
                        {post.tsukkomi}
                    </motion.div>
                </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <img 
                            src={getRandomProfileImage(post.nickname)} 
                            alt={post.nickname}
                            className="w-8 h-8 rounded-full border-2 border-black object-cover bg-white"
                        />
                        <span className="bg-cyber-yellow border-2 border-black px-2 font-bold text-sm">
                            @{post.nickname}
                        </span>
                    </div>
                    <div className="text-xs text-gray-500">
                        {new Date(post.created_at).toLocaleDateString()}
                    </div>
                </div>

                <button
                    onClick={handleLike}
                    className={`neo-brutal-btn mt-2 flex items-center justify-center gap-2 ${liked ? 'bg-punch-red text-white' : 'bg-white'}`}
                >
                    <motion.div animate={isAnimating ? { scale: [1, 1.5, 1] } : {}}>
                        <Heart fill={liked ? 'white' : 'none'} size={20} />
                    </motion.div>
                    <span className="text-xl font-black">{count}</span>
                </button>
            </div>
        </motion.div>
    );
};
