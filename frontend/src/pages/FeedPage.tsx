import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { PostCard } from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import { playSE } from '../lib/sound';

export const FeedPage: React.FC = () => {
    const [posts, setPosts] = useState([]);
    const [sort, setSort] = useState<'new' | 'ranking'>('ranking');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/posts', {
                params: { sort, userId: user?.id }
            });
            setPosts(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [sort, user]);

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8 gap-4">
                <button
                    onClick={() => {
                        setSort('ranking');
                        playSE(2);
                    }}
                    className={`neo-brutal-btn flex-1 ${sort === 'ranking' ? 'bg-cyber-yellow' : 'bg-white'}`}
                >
                    🏆 ランキング
                </button>
                <button
                    onClick={() => {
                        setSort('new');
                        playSE(3);
                    }}
                    className={`neo-brutal-btn flex-1 ${sort === 'new' ? 'bg-matrix-green' : 'bg-white'}`}
                >
                    ✨ 新着
                </button>
            </div>

            {loading ? (
                <div className="text-center font-black text-2xl animate-bounce">LOADING...</div>
            ) : (
                <div className="flex flex-col">
                    {posts.map((post: any) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                    {posts.length === 0 && (
                        <div className="neo-brutal-card text-center text-xl font-bold bg-white">
                            投稿がまだありません！
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
