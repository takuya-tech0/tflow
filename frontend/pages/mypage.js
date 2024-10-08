// /Users/takuya/Documents/talent-flow1.1/nextjs-frontend/pages/mypage.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'; // 追加

export default function MyPage() {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const router = useRouter(); // ルーターを使用するためのフック

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/users/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserData(response.data);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                setError('ユーザー情報の取得に失敗しました。');
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (!userData) {
        return <p>Loading...</p>;
    }

    const radarData = [
        userData.spi.extraversion,
        userData.spi.agreebleness,
        userData.spi.conscientiousness,
        userData.spi.neuroticism,
        userData.spi.openness,
    ];

    return (
        <div className="mypage-container">
            <header className="header">
                <div className="logo-container">
                    <img src="/images/TF_logo.png" alt="Talent Flow Logo" className="logo" />
                    <h1>Talent Flow</h1>
                </div>
            </header>
            
            <div className="content">
                <aside className="sidebar">
                    <img src="/images/profile.png" alt="Profile" className="profile-image" />
                    <ul className="profile-info">
                        <li><strong>氏名:</strong> {userData.employee_info.name}</li>
                        <li><strong>社員番号:</strong> {userData.employee_info.id}</li>
                        <li><strong>役職:</strong> {userData.departments[0].role_name}</li>
                        <li><strong>エリア:</strong> {userData.departments[0].area_name}</li>
                        <li><strong>部署:</strong> {userData.departments[0].department_name}</li>
                        <li><strong>チーム:</strong> {userData.departments[0].team_name}</li>
                    </ul>
                </aside>

                <main className="main-content">
                    <div className="section-container">
                        <div className="section">
                            <h2>サイコグラフィック特性</h2>
                            <RadarChart data={radarData} labels={['創造力', 'リーダーシップ', '分析力', '協調性', '実行力']} />
                        </div>

                        <div className="section">
                            <h2>キャリア情報</h2>
                            <p><strong>評価履歴:</strong></p>
                            <ul>
                                {userData.evaluations.map((evaluation, index) => (
                                    <li key={index}>{evaluation.year}: {evaluation.evaluation}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="section">
                        <h2>スキル情報</h2>
                        <div className="skills">
                            {userData.skills.map((skill, index) => (
                                <span key={index} className="skill-card">{skill.skill_name}</span>
                            ))}
                        </div>
                    </div>

                    <div className="buttons">
                        <button onClick={() => alert('評価・コメント閲覧')}>評価・コメント閲覧</button>
                        <button onClick={() => router.push('/job_recommendation')}>求人推薦システム</button> {/* 変更 */}
                    </div>
                </main>
            </div>

            <style jsx>{`
                .mypage-container {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    width: 100vw;
                    background-color: #f7f7f7;
                }
                .header {
                    display: flex;
                    justify-content: flex-start; /* 左寄せ */
                    align-items: center;
                    padding: 10px 20px;
                    background-color: #fff;
                    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
                }
                .logo-container {
                    display: flex;
                    align-items: center;
                }
                .logo {
                    width: 50px;
                    margin-right: 10px;
                }
                .content {
                    display: flex;
                    flex: 1;
                    overflow-y: hidden;
                }
                .sidebar {
                    flex: 0 0 250px;
                    background-color: #fff;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
                }
                .profile-image {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    object-fit: cover;
                    margin-bottom: 20px;
                }
                .profile-info {
                    list-style: none;
                    padding: 0;
                    width: 100%;
                    text-align: left;
                }
                .profile-info li {
                    margin-bottom: 10px;
                    font-size: 14px;
                }
                .main-content {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                }
                .section-container {
                    display: flex;
                    gap: 20px; /* コンテナ間のスペース */
                    margin-bottom: 20px;
                }
                .section {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    flex: 1;
                }
                h2 {
                    font-size: 24px;
                    color: #333;
                    margin-bottom: 10px;
                }
                .skills {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                }
                .skill-card {
                    padding: 10px 15px;
                    background-color: #e9ecef;
                    border-radius: 5px;
                    font-size: 14px;
                    color: #495057;
                }
                .buttons {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 20px;
                }
                button {
                    padding: 10px 20px;
                    background-color: #FFA500; /* オレンジ色に変更 */
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                }
                button:hover {
                    background-color: #ff8c00; /* ホバー時に少し暗いオレンジに変更 */
                }
            `}</style>
        </div>
    );
}

function RadarChart({ data, labels }) {
    const chartSize = 300;
    const center = chartSize / 2;
    const maxValue = 100; // レーダーチャートの最大値を100に設定

    // チャートの頂点を計算
    const points = data.map((value, index) => {
        const angle = ((Math.PI * 2) / data.length) * index;
        const x = center + (Math.cos(angle) * (value / maxValue) * (center - 20));
        const y = center + (Math.sin(angle) * (value / maxValue) * (center - 20));
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={chartSize} height={chartSize}>
            {/* 背景の円 */}
            <circle cx={center} cy={center} r={center - 20} stroke="#ccc" fill="none" />
            {/* 各軸の線 */}
            {labels.map((label, index) => {
                const angle = ((Math.PI * 2) / labels.length) * index;
                const x = center + Math.cos(angle) * (center - 20);
                const y = center + Math.sin(angle) * (center - 20);
                return <line key={index} x1={center} y1={center} x2={x} y2={y} stroke="#ccc" />;
            })}
            {/* ラベルの表示 */}
            {labels.map((label, index) => {
                const angle = ((Math.PI * 2) / labels.length) * index;
                const x = center + Math.cos(angle) * (center - 10);
                const y = center + Math.sin(angle) * (center - 10);
                return <text key={index} x={x} y={y} fontSize="10" textAnchor="middle">{label}</text>;
            })}
            {/* データのポリゴン */}
            <polygon points={points} fill="rgba(255, 165, 0, 0.5)" stroke="rgba(255, 165, 0, 1)" strokeWidth="2" />
        </svg>
    );
}
