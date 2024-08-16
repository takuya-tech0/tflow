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

def get_top_similar_jobs(employee_vector, job_vectors_array, job_posts, top_n=3):
    similarities = cosine_similarity([employee_vector], job_vectors_array)[0]
    top_indices = np.argsort(similarities)[-top_n:][::-1]
    return [job_posts[i] for i in top_indices]

def get_job_recommendations(employee_data, job_posts):
    employee_vector = vectorize_employee(employee_data)
    job_vectors = {job.job_post_id: vectorize_job_post(job) for job in job_posts}

    job_posts_sorted = sorted(job_posts, key=lambda x: x.job_post_id)
    job_vectors_array = [job_vectors[job.job_post_id] for job in job_posts_sorted]

    top_jobs = get_top_similar_jobs(employee_vector, job_vectors_array, job_posts_sorted)

    return [{"job_post_id": job.job_post_id, "job_title": job.job_title} for job in top_jobs]

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
