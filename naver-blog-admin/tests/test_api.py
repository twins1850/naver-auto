from datetime import datetime, timedelta

import pytest
from naver_blog_admin.app.main import app
from fastapi.testclient import TestClient
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

client = TestClient(app)

# 테스트용 사용자 정보
TEST_EMAIL = "testuser@example.com"
TEST_PASSWORD = "test1234"
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "admin1234"


@pytest.fixture(scope="session")
def user_token():
    # 회원가입 (이미 있으면 무시)
    client.post(
        "/users/",
        json={
            "name": "테스트유저",
            "email": TEST_EMAIL,
            "phone": "010-1111-2222",
            "plan": "basic",
            "password": TEST_PASSWORD,
        },
    )
    # 로그인
    res = client.post(
        "/auth/token", data={"username": TEST_EMAIL, "password": TEST_PASSWORD}
    )
    assert res.status_code == 200
    return res.json()["access_token"]


@pytest.fixture(scope="session")
def admin_token():
    # 관리자 회원가입 (이미 있으면 무시)
    client.post(
        "/users/",
        json={
            "name": "관리자",
            "email": ADMIN_EMAIL,
            "phone": "010-9999-8888",
            "plan": "basic",
            "password": ADMIN_PASSWORD,
            "is_admin": True,
        },
    )
    # 로그인
    res = client.post(
        "/auth/token", data={"username": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
    )
    assert res.status_code == 200
    return res.json()["access_token"]


def test_auth_token_and_refresh():
    # 로그인 시 access/refresh 토큰 모두 발급
    res = client.post(
        "/auth/token", data={"username": TEST_EMAIL, "password": TEST_PASSWORD}
    )
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data and "refresh_token" in data
    # 리프레시 토큰으로 access_token 재발급
    refresh_token = data["refresh_token"]
    res2 = client.post("/auth/refresh", json={"refresh_token": refresh_token})
    assert res2.status_code == 200
    data2 = res2.json()
    assert "access_token" in data2 and "refresh_token" in data2
    assert data2["refresh_token"] != refresh_token  # 재발급 시 토큰 변경


def test_admin_only_endpoint(admin_token, user_token):
    # 일반 사용자는 /users/all 접근 불가
    res = client.get("/users/all", headers={"Authorization": f"Bearer {user_token}"})
    assert res.status_code == 403
    # 관리자는 /users/all 접근 가능
    res2 = client.get("/users/all", headers={"Authorization": f"Bearer {admin_token}"})
    assert res2.status_code == 200
    assert isinstance(res2.json(), list)


def test_01_signup():
    res = client.post(
        "/users/",
        json={
            "name": "테스트유저",
            "email": TEST_EMAIL,
            "phone": "010-1111-2222",
            "plan": "basic",
            "password": TEST_PASSWORD,
        },
    )
    assert res.status_code in (200, 400)  # 이미 있으면 400, 처음이면 200


def test_02_login():
    res = client.post(
        "/auth/token", data={"username": TEST_EMAIL, "password": TEST_PASSWORD}
    )
    assert res.status_code == 200
    assert "access_token" in res.json()


def test_03_user_info(user_token):
    res2 = client.get("/users/1", headers={"Authorization": f"Bearer {user_token}"})
    assert res2.status_code in (200, 404)


def test_04_license_crud(user_token):
    # 라이선스 발급
    expire_at = (datetime.utcnow() + timedelta(days=30)).isoformat()
    res = client.post(
        "/licenses/",
        json={"user_id": 1, "expire_at": expire_at},
        headers={"Authorization": f"Bearer {user_token}"},
    )
    if res.status_code != 200:
        print("라이선스 발급 실패:", res.status_code, res.text)
    assert res.status_code == 200
    license_id = res.json()["id"]
    # 전체 조회
    res = client.get("/licenses/", headers={"Authorization": f"Bearer {user_token}"})
    assert res.status_code == 200
    # 상세 조회
    res = client.get(
        f"/licenses/{license_id}", headers={"Authorization": f"Bearer {user_token}"}
    )
    assert res.status_code == 200
    # 삭제
    res = client.delete(
        f"/licenses/{license_id}", headers={"Authorization": f"Bearer {user_token}"}
    )
    assert res.status_code == 200


def test_05_payment_crud(user_token):
    # 결제 등록
    next_due = (datetime.utcnow() + timedelta(days=30)).isoformat()
    res = client.post(
        "/payments/",
        json={"user_id": 1, "amount": 10000, "next_due": next_due},
        headers={"Authorization": f"Bearer {user_token}"},
    )
    if res.status_code != 200:
        print("결제 등록 실패:", res.status_code, res.text)
    assert res.status_code == 200
    payment_id = res.json()["id"]
    # 전체 조회
    res = client.get("/payments/", headers={"Authorization": f"Bearer {user_token}"})
    assert res.status_code == 200
    # 상세 조회
    res = client.get(
        f"/payments/{payment_id}", headers={"Authorization": f"Bearer {user_token}"}
    )
    assert res.status_code == 200
    # 삭제
    res = client.delete(
        f"/payments/{payment_id}", headers={"Authorization": f"Bearer {user_token}"}
    )
    assert res.status_code == 200


def test_06_usage_crud(user_token):
    # 사용량 등록
    date = datetime.utcnow().isoformat()
    res = client.post(
        "/usages/",
        json={
            "user_id": 1,
            "date": date,
            "post_count": 1,
            "success_count": 1,
            "fail_count": 0,
        },
        headers={"Authorization": f"Bearer {user_token}"},
    )
    if res.status_code != 200:
        print("사용량 등록 실패:", res.status_code, res.text)
    assert res.status_code == 200
    usage_id = res.json()["id"]
    # 전체 조회
    res = client.get("/usages/", headers={"Authorization": f"Bearer {user_token}"})
    assert res.status_code == 200
    # 상세 조회
    res = client.get(
        f"/usages/{usage_id}", headers={"Authorization": f"Bearer {user_token}"}
    )
    assert res.status_code == 200
    # 삭제
    res = client.delete(
        f"/usages/{usage_id}", headers={"Authorization": f"Bearer {user_token}"}
    )
    assert res.status_code == 200
