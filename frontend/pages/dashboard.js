import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('認証トークンが見つかりません。');
                }

                const userResponse = await axios.get('http://localhost:8000/users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setUserData(userResponse.data);
            } catch (error) {
                console.error('ユーザーデータの取得に失敗しました:', error);
                setError(error.response?.data?.detail || error.message || 'ユーザーデータの取得中にエラーが発生しました。');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
                <button onClick={() => router.push('/login')}>ログインページに戻る</button>
            </div>
        );
    }

    return (
        <div className="container">
            <h2>ダッシュボード</h2>

            <div className="user-info card">
                <h3>ユーザー情報</h3>
                <p>名前: {userData.employee_info.name}</p>
                <p>部署: {userData.departments[0]?.department_name || '未設定'}</p>
                <p>役職: {userData.grades[0]?.grade_name || '未設定'}</p>
            </div>

            <div className="card">
                <h3>AIレコメンド求人</h3>
                <p>あなたのスキルと経験に基づいて、最適な社内ポジションをAIがレコメンドします。</p>
                <button onClick={() => router.push('/job_recommendation')}>詳細を見る</button>
            </div>

            <div className="card">
                <h3>マイページ編集</h3>
                <p>プロフィール情報やスキルセットを更新し、より精度の高いマッチングを実現しましょう。</p>
                <button onClick={() => router.push('/mypage')}>編集する</button>
            </div>

            <button className="logout-button" onClick={handleLogout}>ログアウト</button>

            <style jsx>{`
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f7f7f7;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                h2 {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .card {
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                h3 {
                    margin-top: 0;
                    font-size: 20px;
                    color: #333;
                }
                p {
                    font-size: 16px;
                    color: #555;
                }
                button {
                    padding: 10px 20px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    margin-top: 10px;
                }
                button:hover {
                    background-color: #0056b3;
                }
                .logout-button {
                    background-color: #dc3545;
                }
                .logout-button:hover {
                    background-color: #c82333;
                }
                .loading, .error-container {
                    text-align: center;
                    margin-top: 50px;
                }
                ul {
                    list-style-type: none;
                    padding: 0;
                }
                li {
                    margin-bottom: 10px;
                    padding: 10px;
                    background-color: #f0f0f0;
                    border-radius: 5px;
                }
            `}</style>
        </div>
    );
}