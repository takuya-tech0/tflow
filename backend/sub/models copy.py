# /Users/takuya/Documents/talent-flow1.1/fastapi-backend/models.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Grade(Base):
    __tablename__ = "grades"

    grade_id = Column(Integer, primary_key=True, index=True)
    grade_name = Column(String, unique=True, index=True)

    employee = relationship("EmployeeGrade", back_populates="grade")

class Employee(Base):
    __tablename__ = "employee"

    employee_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    password = Column(String)  # 'hashed_password' ではなく 'password' を使用
    birthdate = Column(String)
    gender = Column(String)
    academic_background = Column(String)
    hire_date = Column(String)
    recruitment_type = Column(String)

    grades = relationship("EmployeeGrade", back_populates="employee")

class EmployeeGrade(Base):
    __tablename__ = "employee_grade"  # 修正されたテーブル名

    employeegrade_id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employee.employee_id"))  # 外部キーの参照も "employee" に修正
    grade_id = Column(Integer, ForeignKey("grades.grade_id"))

    employee = relationship("Employee", back_populates="grades")
    grade = relationship("Grade", back_populates="employee")
