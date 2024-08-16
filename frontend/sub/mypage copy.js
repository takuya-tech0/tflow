// /Users/takuya/Documents/talent-flow1.1/nextjs-frontend/pages/mypage.js
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

            {/* Employee Information */}
            <h2>Employee Information</h2>
            <p><strong>ID:</strong> {userData.employee_info.id}</p>
            <p><strong>Name:</strong> {userData.employee_info.name}</p>
            <p><strong>Birthdate:</strong> {userData.employee_info.birthdate}</p>
            <p><strong>Gender:</strong> {userData.employee_info.gender}</p>
            <p><strong>Academic Background:</strong> {userData.employee_info.academic_background}</p>
            <p><strong>Hire Date:</strong> {userData.employee_info.hire_date}</p>
            <p><strong>Recruitment Type:</strong> {userData.employee_info.recruitment_type}</p>

            {/* Grades */}
            <h2>Grades</h2>
            {userData.grades.length > 0 ? (
                <ul>
                    {userData.grades.map((grade, index) => (
                        <li key={index}>{grade.grade_name} (ID: {grade.grade_id})</li>
                    ))}
                </ul>
            ) : (
                <p>No grades available</p>
            )}

            {/* Skills */}
            <h2>Skills</h2>
            {userData.skills.length > 0 ? (
                <ul>
                    {userData.skills.map((skill, index) => (
                        <li key={index}>{skill.skill_name} (Category: {skill.skill_category}, ID: {skill.skill_id})</li>
                    ))}
                </ul>
            ) : (
                <p>No skills available</p>
            )}

            {/* SPI */}
            <h2>SPI</h2>
            {userData.spi ? (
                <ul>
                    <li>Extraversion: {userData.spi.extraversion}</li>
                    <li>Agreebleness: {userData.spi.agreebleness}</li>
                    <li>Conscientiousness: {userData.spi.conscientiousness}</li>
                    <li>Neuroticism: {userData.spi.neuroticism}</li>
                    <li>Openness: {userData.spi.openness}</li>
                </ul>
            ) : (
                <p>No SPI data available</p>
            )}

            {/* Evaluations */}
            <h2>Evaluations</h2>
            {userData.evaluations.length > 0 ? (
                <ul>
                    {userData.evaluations.map((evaluation, index) => (
                        <li key={index}>{evaluation.year}: {evaluation.evaluation} - {evaluation.comment}</li>
                    ))}
                </ul>
            ) : (
                <p>No evaluations available</p>
            )}

            {/* Departments */}
            <h2>Departments</h2>
            {userData.departments.length > 0 ? (
                <ul>
                    {userData.departments.map((department, index) => (
                        <li key={index}>{department.department_name} (ID: {department.department_id})</li>
                    ))}
                </ul>
            ) : (
                <p>No departments available</p>
            )}
        </div>
    );
}
