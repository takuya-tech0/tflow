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
                },
                withCredentials: true
            });

            localStorage.setItem('token', response.data.access_token);
            window.location.href = '/mypage';
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
        <div className="login-container">
            <div className="login-left">
                <div className="login-brand">
                    <img src="/images/TF_logo.png" alt="Talent Flow Logo" className="logo" style={{ width: '500px', marginBottom: '10px' }}/>
                    <h1>AIによる最適な人事配置を実現</h1>
                    <h2>Talent Flow</h2>
                </div>
            </div>
            <div className="login-right">
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            placeholder="User Name" 
                        />
                    </div>
                    <div className="input-group">
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Password" 
                        />
                    </div>
                    <div className="input-group">
                        <button type="submit">log in</button>
                    </div>
                </form>
            </div>

            <style jsx>{`
                .login-container {
                    display: flex;
                    height: 100vh;
                    width: 100vw;
                }
                .login-left {
                    flex: 1;
                    background-color: #f0f0f0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    text-align: center;
                }
                .login-right {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #fff;
                }
                .login-brand {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .logo {
                    width: 150px; /* ロゴのサイズを適宜調整 */
                    margin-bottom: 20px;
                }
                h1 {
                    font-size: 24px;
                    color: #666;
                }
                h2 {
                    font-size: 32px;
                    color: #333;
                    margin-top: 10px;
                }
                form {
                    width: 300px;
                }
                .input-group {
                    margin-bottom: 20px;
                }
                input {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 16px;
                }
                button {
                    width: 100%;
                    padding: 10px;
                    background-color: #f0ad4e;
                    border: none;
                    border-radius: 5px;
                    color: white;
                    font-size: 16px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #ec971f;
                }
                .forgot-password {
                    display: block;
                    margin-top: 10px;
                    text-align: center;
                    color: #666;
                    font-size: 14px;
                    text-decoration: none;
                }
                .forgot-password:hover {
                    color: #333;
                }
            `}</style>
        </div>
    );
}
