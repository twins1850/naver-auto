from . import models
from .database import Base, engine

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    print("[DB 초기화] 테이블 생성 완료")
