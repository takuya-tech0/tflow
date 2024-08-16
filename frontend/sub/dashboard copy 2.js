// /Users/takuya/Documents/talent-flow1.1/nextjs-frontend/pages/dashboard.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');

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

    return (
        <div>
            <h1>ダッシュボード</h1>
            <p><strong>名前:</strong> {userData.name}</p>
            <p><strong>生年月日:</strong> {userData.birthdate}</p>
            <p><strong>性別:</strong> {userData.gender}</p>
            <p><strong>学歴:</strong> {userData.academic_background}</p>
            <p><strong>入社日:</strong> {userData.hire_date}</p>
            <p><strong>採用区分:</strong> {userData.recruitment_type}</p>
            <p><strong>グレード:</strong> {userData.grades.join(', ')}</p> {/* 複数のグレードがある場合はカンマ区切りで表示 */}
        </div>
    );
}
