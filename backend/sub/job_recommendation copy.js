///Users/takuya/Documents/タレントフロー1.3/frontend/pages/job_recommendation.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function JobRecommendation() {
    const [userData, setUserData] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
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

        fetchUserData();
    }, []);

    const handleJobRecommendation = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8000/recommendations', null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Response data:', response.data);

            const recommendations = [];
            let tempReasons = [];
            let currentJob = null;

            const lines = response.data.split('\n').filter(line => line.trim() !== '');

            lines.forEach((line) => {
                if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) {
                    if (currentJob) {
                        recommendations.push({ ...currentJob, reasons: [...tempReasons] });
                    }
                    currentJob = {
                        job_title: line.substring(3),
                    };
                    tempReasons = [];
                } else if (line.startsWith('理由') && currentJob) {
                    tempReasons.push(line);
                } else if (currentJob) {
                    tempReasons.push(line);
                }
            });

            if (currentJob) {
                recommendations.push({ ...currentJob, reasons: [...tempReasons] });
            }

            setRecommendations(recommendations);
        } catch (error) {
            console.error('Failed to fetch job recommendations:', error);
            setError('求人推薦の取得に失敗しました。');
        }
        setLoading(false);
    };

    if (!userData) {
        return <p>Loading...</p>;
    }

    return (
        <div className="job-recommendation-container">
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
                    <div className="card">
                        <h2>求人推薦システム</h2>
                        <p>この求人推薦システムは、従業員のスキル、経験、学歴などのデータを分析し、最適な求人をAIを用いて推薦します。主な機能は以下の通りです:</p>
                        <ul>
                            <li>従業員データと求人データの前処理</li>
                            <li>コサイン類似度を用いた求人マッチング</li>
                            <li>GPTを使用した詳細な推薦理由の生成</li>
                        </ul>
                    </div>

                    <div className="card">
                        <h3>求人推薦結果</h3>
                        {loading ? (
                            <p>お探しています...お待ちください</p>
                        ) : (
                            <>
                                <ul className="recommendations-list">
                                    {recommendations.length > 0 ? (
                                        recommendations.map((job, index) => (
                                            <li key={index} className="job-item">
                                                <div className="job-header">
                                                    <div className="job-title">{job.job_title}</div>
                                                </div>
                                                <ul className="reasons">
                                                    {job.reasons && job.reasons.map((reason, idx) => (
                                                        <li key={idx}>{reason}</li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))
                                    ) : (
                                        <p>AIに求人を探してもらってください。</p>
                                    )}
                                </ul>
                            </>
                        )}

                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        <button onClick={handleJobRecommendation}>AIに探してもらう</button>
                    </div>
                </main>
            </div>

            <style jsx>{`
                .job-recommendation-container {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    width: 100vw;
                    background-color: #f7f7f7;
                }
                .header {
                    display: flex;
                    justify-content: flex-start;
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
                .card {
                    width: 100%;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                h2, h3 {
                    font-size: 24px;
                    color: #333;
                    margin-bottom: 10px;
                }
                p {
                    font-size: 16px;
                    color: #555;
                }
                ul {
                    list-style-type: none;
                    padding: 0;
                }
                .job-item {
                    margin-bottom: 20px;
                    padding: 15px;
                    background-color: #f9f9f9;
                    border-radius: 5px;
                    position: relative;
                }
                .job-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .job-title {
                    font-weight: bold;
                    font-size: 18px;
                    color: #333;
                }
                .reasons {
                    margin-top: 10px;
                    margin-left: 20px;
                    font-size: 14px;
                    color: #555;
                }
                .reasons li {
                    margin-bottom: 5px;
                }
                button {
                    padding: 10px 20px;
                    background-color: #FFA500;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    margin-top: 10px;
                }
                button:hover {
                    background-color: #ff8c00;
                }
            `}</style>
        </div>
    );
}
