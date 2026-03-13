import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { playSE } from '../lib/sound';

export const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password, nickname);
            }
            playSE(4); // Login/Register success sound
            navigate('/');
        } catch (e) {
            alert('認証エラーです');
        }
    };

    return (
        <div className="max-w-md mx-auto px-4 py-16">
            <div className="neo-brutal-card bg-white">
                <h1 className="text-4xl font-black mb-8 border-b-4 border-black pb-2">
                    {isLogin ? 'ログイン' : '新規登録'}
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {!isLogin && (
                        <div className="flex flex-col gap-1">
                            <label className="font-bold">ニックネーム</label>
                            <input
                                type="text"
                                className="neo-brutal-input"
                                value={nickname}
                                onChange={e => setNickname(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="flex flex-col gap-1">
                        <label className="font-bold">メールアドレス</label>
                        <input
                            type="email"
                            className="neo-brutal-input"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="font-bold">パスワード</label>
                        <input
                            type="password"
                            className="neo-brutal-input"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button className="neo-brutal-btn bg-matrix-green hover:bg-green-400 mt-4 h-14">
                        {isLogin ? 'GO!' : '登録して参加！'}
                    </button>
                </form>

                <button
                    onClick={() => {
                    setIsLogin(!isLogin);
                    playSE(5); // Toggle sound
                }}
                className="mt-6 text-sm font-bold underline hover:text-punch-red block w-full text-center"
            >
                {isLogin ? 'アカウントを持っていない場合' : 'ログインはこちら'}
                </button>
            </div>
        </div>
    );
};
