// /Users/takuya/Documents/talent-flow1.2/nextjs-frontend/pages/job_recommendation.js
import { useState } from 'react';

export default function JobRecommendation() {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleJobRecommendation = async () => {
        setLoading(true);
        // ここで求人情報の取得、ベクトル化、レコメンデーションの処理を追加予定
        // setRecommendations(response.data); // 仮のデータ設定
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
                <h3>岡田 玲奈さんへの求人推薦結果</h3>
                
                {loading ? (
                    <p>検索中...</p>
                ) : (
                    <ul>
                        {recommendations.length > 0 ? (
                            recommendations.map((job, index) => (
                                <li key={index}>
                                    <div className="job-title">{job.title} (ID: {job.id})</div>
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
                .job-title {
                    font-weight: bold;
                    font-size: 18px;
                    margin-bottom: 10px;
                }
                .reasons {
                    margin-left: 20px;
                    font-size: 14px;
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
            `}</style>
        </div>
    );
}
