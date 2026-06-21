from sqlalchemy import Column, String, Boolean
from database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    completed = Column(Boolean, default=False)
    createdAt = Column(String, nullable=False)


class Setting(Base):
    __tablename__ = "settings"

    key = Column(String, primary_key=True)
    value = Column(String, nullable=False)