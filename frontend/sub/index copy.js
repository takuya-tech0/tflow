///Users/takuya/Documents/talent-flow1.1/nextjs-frontend/pages/index.js
import { useState } from 'react';
import axios from 'axios';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const params = new URLSearchParams();
            params.append('username', username);
            params.append('password', password);

            const response = await axios.post('http://localhost:8000/token', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            // JWTトークンを保存
            localStorage.setItem('token', response.data.access_token);

            // ダッシュボードにリダイレクト
            window.location.href = '/dashboard';
        } catch (error) {
            console.error('ログインに失敗しました:', error);
            if (error.response) {
                setError(`ログインに失敗しました。エラーコード: ${error.response.status}`);
            } else if (error.request) {
                setError('サーバーに接続できません。CORS設定を確認してください。');
            } else {
                setError('リクエストの送信中にエラーが発生しました。');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="ユーザー名"
            />
            <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="パスワード"
            />
            <button type="submit">ログイン</button>
            {error && <p style={{color: 'red'}}>{error}</p>}
        </form>
    );
}
