// /Users/takuya/Documents/talent-flow1.2/nextjs-frontend/pages/job_recommendation.js
import { useState } from 'react';
import axios from 'axios';

export default function JobRecommendation() {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
            
            // デバッグ用のログを追加
            console.log('Recommendations:', response.data);
            console.log('Type of recommendations:', typeof response.data);

            setRecommendations(response.data);
        } catch (error) {
            console.error('Failed to fetch job recommendations:', error);
            setError('求人推薦の取得に失敗しました。');
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <h2>求人推薦システム</h2>
            
            {/* システム概要 */}
            <div className="card">
                <h3>システム概要</h3>
                <p>この求人推薦システムは、従業員のスキル、経験、学歴などのデータを分析し、最適な求人をAIを用いて推薦します。主な機能は以下の通りです:</p>
                <ul>
                    <li>従業員データと求人データの前処理</li>
                    <li>コサイン類似度を用いた求人マッチング</li>
                    <li>GPT-4を使用した詳細な推薦理由の生成</li>
                </ul>
            </div>

            {/* 求人推薦結果 */}
            <div className="card">
                <h3>求人推薦結果</h3>
                
                {loading ? (
                    <p>検索中...</p>
                ) : (
                    <ul>
                        {Array.isArray(recommendations) && recommendations.length > 0 ? (
                            recommendations.map((job, index) => (
                                <li key={index} className="job-item">
                                    <div className="job-title">{job.job_title} (ID: {job.job_post_id})</div>
                                    <ul className="reasons">
                                        {job.reasons.map((reason, idx) => (
                                            <li key={idx}>{reason}</li>
                                        ))}
                                    </ul>
                                </li>
                            ))
                        ) : (
                            <p>求人を検索してください。</p>
                        )}
                    </ul>
                )}

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button onClick={handleJobRecommendation}>求人を検索する</button>
            </div>

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
                ul {
                    list-style-type: none;
                    padding: 0;
                }
                .job-item {
                    margin-bottom: 20px;
                    padding: 15px;
                    background-color: #f9f9f9;
                    border-radius: 5px;
                }
                .job-title {
                    font-weight: bold;
                    font-size: 18px;
                    margin-bottom: 10px;
                    color: #007bff;
                }
                .reasons {
                    margin-left: 20px;
                    font-size: 14px;
                    color: #555;
                }
                .reasons li {
                    margin-bottom: 5px;
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
            `}</style>
        </div>
    );
}
