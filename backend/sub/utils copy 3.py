# /Users/takuya/Documents/talent-flow1.1/fastapi-backend/utils.py
import openai
import json
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from models import JobPost

# Initialize the OpenAI client
client = openai.OpenAI(api_key="OPENAI_API_KEY")

def get_embedding(text, model="text-embedding-ada-002"):
    text = text.replace("\n", " ")
    response = client.embeddings.create(input=[text], model=model)
    return response.data[0].embedding

def vectorize_employee(employee_data):
    employee_text = f"{employee_data['employee_info']['name']} {employee_data['employee_info']['gender']} {employee_data['employee_info']['academic_background']} {employee_data['employee_info']['recruitment_type']}"
    return get_embedding(employee_text)

def vectorize_job_post(job_post):
    job_text = f"{job_post.job_title} {job_post.job_detail}"
    return get_embedding(job_text)

def get_all_job_posts(session):
    try:
        return session.query(JobPost).all()
    except Exception as e:
        print(f"Error retrieving job posts: {e}")
        return []

def get_top_similar_jobs(employee_vector, job_vectors_array, job_posts, top_n=10):
    similarities = cosine_similarity([employee_vector], job_vectors_array)[0]
    top_indices = np.argsort(similarities)[-top_n:][::-1]
    return [job_posts[i] for i in top_indices], [job_vectors_array[i] for i in top_indices]

def preprocess_job_data(job_posts, job_vectors):
    return [
        {
            "job_post_id": job.job_post_id,
            "job_title": job.job_title,
            "job_detail": job.job_detail,
            "vector": vector.tolist()
        }
        for job, vector in zip(job_posts, job_vectors)
    ]

def get_job_recommendations(employee_data, employee_vector, job_posts, job_vectors):
    # job_vectorsを2D配列に変換
    job_posts_sorted = sorted(job_posts, key=lambda x: x.job_post_id)
    job_vectors_array = [job_vectors[job.job_post_id] for job in job_posts_sorted]

    top_jobs, top_vectors = get_top_similar_jobs(employee_vector, job_vectors_array, job_posts_sorted)
    preprocessed_jobs = preprocess_job_data(top_jobs, top_vectors)

    employee_info_str = json.dumps({
        "name": employee_data['employee_info']['name'],
        "skills": [skill['skill_name'] for skill in employee_data['skills']],
        "academic_background": employee_data['employee_info']['academic_background'],
        "recruitment_type": employee_data['employee_info']['recruitment_type']
    })
    job_posts_str = json.dumps(preprocessed_jobs)

    prompt = f"""以下の従業員情報と上位10件の求人情報を分析し、{employee_data['employee_info']['name']}さんの強みに最も合致する求人IDを3つ提案してください。
また、それぞれのマッチングについて、具体的かつ詳細な理由を3つずつ述べてください。

従業員情報: {employee_info_str}
求人情報: {job_posts_str}

回答は以下のフォーマットで提供してください：

1. 推奨求人ID: [ID番号]
   求人タイトル: [タイトル]
   理由1: [詳細な説明]
   理由2: [詳細な説明]
   理由3: [詳細な説明]

2. 推奨求人ID: [ID番号]
   求人タイトル: [タイトル]
   理由1: [詳細な説明]
   理由2: [詳細な説明]
   理由3: [詳細な説明]

3. 推奨求人ID: [ID番号]
   求人タイトル: [タイトル]
   理由1: [詳細な説明]
   理由2: [詳細な説明]
   理由3: [詳細な説明]

従業員のスキル、経験、学歴などを考慮し、マッチングの理由を具体的に説明してください。"""

    try:
        completion = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "あなたは優秀な人材マッチングの専門家です。従業員の特性と求人の要件を詳細に分析し、最適なマッチングを提案します。"},
                {"role": "user", "content": prompt}
            ]
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Error in API call: {str(e)}"

def get_all_employee_data(session, employee):
    try:
        employee_data = {
            "employee_info": {
                "id": employee.employee_id,
                "name": employee.name,
                "birthdate": str(employee.birthdate),
                "gender": employee.gender,
                "academic_background": employee.academic_background,
                "hire_date": str(employee.hire_date),
                "recruitment_type": employee.recruitment_type
            },
            "grades": [{"grade_id": g.grade, "grade_name": g.grade_info.grade_name} for g in employee.grades],
            "skills": [{"skill_id": s.skill_id, "skill_name": s.skill.skill_name, "skill_category": s.skill.skill_category} for s in employee.skills],
            "spi": employee.spi[0].__dict__ if employee.spi else None,
            "evaluations": [{"year": e.evaluation_year, "evaluation": e.evaluation, "comment": e.evaluation_comment} for e in employee.evaluations],
            "departments": [{"department_id": d.department_id, "department_name": d.department.department_name} for d in employee.departments]
        }
        return employee_data
    except Exception as e:
        print(f"Error retrieving employee data: {e}")
        return None
