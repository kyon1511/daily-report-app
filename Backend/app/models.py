from sqlalchemy import Column, Integer, String, Text, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.sql import func
from .database import Base
from typing import Optional
from datetime import date
from pydantic import BaseModel

class User(Base):
    __tablename__ = "users"
    id: Mapped[str] = mapped_column(String, primary_key=True, index=True, comment="Firebase UID") # Firebase UIDを保存
    name: Mapped[Optional[str]] = mapped_column(String, nullable=True, comment="ユーザー名")
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False, comment="メールアドレス")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), comment="作成日時")
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), comment="更新日時")
    daily_reports = relationship("DailyReport", back_populates="owner")

class DailyReport(Base):
    __tablename__ = "daily_reports"

    id = Column(Integer, primary_key=True, index=True, comment="日報ID")
    report_date = Column(Date, nullable=False, comment="報告日")
    learned_today = Column(Text, nullable=False, comment="今日学んだこと")
    learning_improvement = Column(Text, nullable=False, comment="今日の学びの改善点")
    challenge_for_tomorrow = Column(Text, nullable=False, comment="明日チャレンジすること")
    impressions = Column(Text, nullable=False, comment="ひとこと(感想)")
    other_notes = Column(Text, comment="その他（任意）")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), comment="作成日時")
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), comment="更新日時")
    owner_id = Column(String, ForeignKey("users.id"), nullable=False, comment="報告者のユーザーID")

    owner = relationship("User", back_populates="daily_reports")

