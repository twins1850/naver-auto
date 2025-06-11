import logging

from fastapi import HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError


class CustomAPIException(Exception):
    def __init__(self, status_code: int, detail: str, code: str = "error"):
        self.status_code = status_code
        self.detail = detail
        self.code = code


def custom_api_exception_handler(request: Request, exc: CustomAPIException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "code": exc.code,
            "message": exc.detail,
            "path": str(request.url),
        },
    )


def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "code": "http_error",
            "message": exc.detail,
            "path": str(request.url),
        },
    )


def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "code": "validation_error",
            "message": exc.errors(),
            "path": str(request.url),
        },
    )


def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    logging.error(f"DB Error: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "code": "db_error",
            "message": str(exc),
            "path": str(request.url),
        },
    )


def global_exception_handler(request: Request, exc: Exception):
    logging.error(f"Global error: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "code": "server_error",
            "message": str(exc),
            "path": str(request.url),
        },
    )
