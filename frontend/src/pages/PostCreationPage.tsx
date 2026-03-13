import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { Camera, Send } from 'lucide-react';
import { playSE } from '../lib/sound';

export const PostCreationPage: React.FC = () => {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [tsukkomi, setTsukkomi] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview immediately
        setPreview(URL.createObjectURL(file));

        // Frontend Compression
        const options = {
            maxSizeMB: 0.9,
            maxWidthOrHeight: 1200,
            useWebWorker: true,
        };

        try {
            const compressedFile = await imageCompression(file, options);
            setImage(compressedFile);
            playSE(6); // Sound when image is selected/ready
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image || !tsukkomi) return alert('画像とツッコミが必要です！');

        setLoading(true);
        const formData = new FormData();
        formData.append('image', image);
        formData.append('tsukkomi', tsukkomi);
        playSE(11); // Sound when submitting

        try {
            await api.post('/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            navigate('/');
        } catch (e) {
            alert('エラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto px-4 py-8">
            <h1 className="text-4xl font-black mb-8 bg-punch-red text-white p-2 border-4 border-black inline-block -rotate-2">
                街にツッコむ
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="neo-brutal-card bg-matrix-green">
                    <label className="block mb-4 text-xl font-bold">1. 写真を選ぶ</label>
                    <div className="relative border-4 border-black border-dashed h-64 flex items-center justify-center bg-white cursor-pointer hover:bg-gray-100">
                        {preview ? (
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <Camera size={64} />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>
                </div>

                <div className="neo-brutal-card bg-cyber-yellow">
                    <label className="block mb-4 text-xl font-bold">2. ツッコミを入れる</label>
                    <input
                        type="text"
                        placeholder="最大50文字のツッコミ！"
                        className="neo-brutal-input w-full text-2xl"
                        value={tsukkomi}
                        maxLength={50}
                        onChange={(e) => setTsukkomi(e.target.value)}
                    />
                </div>

                <button
                    disabled={loading}
                    className="neo-brutal-btn bg-punch-red text-white text-3xl p-4 flex items-center justify-center gap-4"
                >
                    {loading ? '送信中...' : <>ツッコむ！ <Send /></>}
                </button>
            </form>
        </div>
    );
};
