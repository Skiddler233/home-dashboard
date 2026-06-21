from database import engine
from models import Task, Setting
from database import Base

Base.metadata.create_all(bind=engine)

print("Database created")