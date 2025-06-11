import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from .config import get_settings

settings = get_settings()

def send_purchase_confirmation_email(purchase_data: dict):
    """🆕 강의 아이디어: 개선된 구매 완료 및 다운로드 안내 이메일 발송"""
    
    # 다운로드 URL 생성
    download_url = f"{settings.BASE_URL}/purchases/download/{purchase_data['temporary_license']}"
    
    # 🆕 강의 아이디어: 더 매력적이고 개인화된 제목
    subject = f"🎉 {purchase_data['customer_name']}님, 네이버 블로그 자동화 v{purchase_data['version']} 구매가 완료되었습니다!"
    
    # 🆕 강의 아이디어: 현대적이고 전문적인 HTML 이메일 템플릿
    html_content = f"""
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>구매 완료 안내</title>
        <style>
            /* 🆕 강의 아이디어: 모바일 우선 반응형 디자인 */
            * {{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }}
            
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #2d3748;
                background-color: #f7fafc;
            }}
            
            .email-container {{
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                border-radius: 16px;
                overflow: hidden;
            }}
            
            /* 🆕 강의 아이디어: 브랜드 인식을 높이는 헤더 디자인 */
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
                position: relative;
            }}
            
            .header::before {{
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="white" opacity="0.1"/><circle cx="80" cy="40" r="1.5" fill="white" opacity="0.1"/><circle cx="40" cy="70" r="1" fill="white" opacity="0.1"/><circle cx="90" cy="80" r="2.5" fill="white" opacity="0.1"/></svg>');
            }}
            
            .header h1 {{
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 8px;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                position: relative;
                z-index: 1;
            }}
            
            .header .subtitle {{
                font-size: 18px;
                opacity: 0.9;
                font-weight: 400;
                position: relative;
                z-index: 1;
            }}
            
            /* 🆕 강의 아이디어: 컨텐츠 영역 개선 */
            .content {{
                padding: 40px 30px;
            }}
            
            .greeting {{
                font-size: 20px;
                font-weight: 600;
                margin-bottom: 20px;
                color: #2d3748;
            }}
            
            .intro-text {{
                font-size: 16px;
                margin-bottom: 30px;
                color: #4a5568;
                line-height: 1.7;
            }}
            
            /* 🆕 강의 아이디어: 강화된 CTA 버튼 디자인 */
            .download-section {{
                background: linear-gradient(135deg, #e6fffa 0%, #f0fff4 100%);
                border: 2px solid #81e6d9;
                padding: 30px;
                border-radius: 16px;
                margin: 30px 0;
                text-align: center;
                position: relative;
                overflow: hidden;
            }}
            
            .download-section::before {{
                content: '📥';
                font-size: 48px;
                position: absolute;
                top: 15px;
                right: 20px;
                opacity: 0.3;
            }}
            
            .download-title {{
                font-size: 22px;
                font-weight: 700;
                color: #2b6cb0;
                margin-bottom: 15px;
            }}
            
            .download-btn {{
                display: inline-block;
                background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
                color: white;
                padding: 18px 36px;
                text-decoration: none;
                border-radius: 12px;
                font-weight: 700;
                font-size: 16px;
                box-shadow: 0 8px 20px rgba(66, 153, 225, 0.3);
                transition: all 0.3s ease;
                margin: 15px 0;
                text-transform: none;
            }}
            
            .download-btn:hover {{
                transform: translateY(-2px);
                box-shadow: 0 12px 30px rgba(66, 153, 225, 0.4);
            }}
            
            .download-note {{
                font-size: 13px;
                color: #718096;
                margin-top: 15px;
                font-style: italic;
            }}
            
            /* 🆕 강의 아이디어: 정보 카드 디자인 */
            .info-card {{
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 24px;
                margin: 25px 0;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            }}
            
            .info-card h3 {{
                font-size: 18px;
                font-weight: 700;
                color: #2d3748;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                gap: 8px;
            }}
            
            .info-item {{
                padding: 12px 0;
                border-bottom: 1px solid #f7fafc;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }}
            
            .info-item:last-child {{
                border-bottom: none;
            }}
            
            .info-label {{
                font-weight: 600;
                color: #4a5568;
            }}
            
            .info-value {{
                color: #2d3748;
                font-weight: 500;
            }}
            
            /* 🆕 강의 아이디어: 라이선스 코드 스타일링 */
            .license-section {{
                background: linear-gradient(135deg, #fef5e7 0%, #fed7aa 20%, #fef5e7 100%);
                border: 2px solid #f6ad55;
                border-radius: 12px;
                padding: 24px;
                margin: 25px 0;
            }}
            
            .license-code {{
                background: #2d3748;
                color: #e2e8f0;
                padding: 16px;
                border-radius: 8px;
                font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
                font-size: 12px;
                line-height: 1.5;
                word-break: break-all;
                border: 1px solid #4a5568;
                margin: 12px 0;
                box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
            }}
            
            /* 🆕 강의 아이디어: 기능 목록 개선 */
            .features-grid {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 16px;
                margin: 20px 0;
            }}
            
            .feature-item {{
                background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%);
                border: 1px solid #9ae6b4;
                border-radius: 8px;
                padding: 16px;
                display: flex;
                align-items: center;
                gap: 12px;
                transition: transform 0.2s ease;
            }}
            
            .feature-item:hover {{
                transform: translateY(-1px);
            }}
            
            .feature-icon {{
                font-size: 24px;
                min-width: 32px;
            }}
            
            .feature-text {{
                font-weight: 600;
                color: #2f855a;
            }}
            
            /* 🆕 강의 아이디어: 설치 가이드 개선 */
            .guide-section {{
                background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
                border: 2px solid #7dd3fc;
                border-radius: 16px;
                padding: 30px;
                margin: 30px 0;
            }}
            
            .guide-steps {{
                list-style: none;
                counter-reset: step-counter;
            }}
            
            .guide-step {{
                counter-increment: step-counter;
                margin: 16px 0;
                padding-left: 60px;
                position: relative;
                font-size: 15px;
                line-height: 1.6;
            }}
            
            .guide-step::before {{
                content: counter(step-counter);
                position: absolute;
                left: 0;
                top: 0;
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 16px;
                box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
            }}
            
            /* 🆕 강의 아이디어: 문의 섹션 개선 */
            .contact-section {{
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                border: 1px solid #cbd5e0;
                border-radius: 12px;
                padding: 24px;
                margin: 25px 0;
                text-align: center;
            }}
            
            .contact-title {{
                font-size: 18px;
                font-weight: 700;
                color: #2d3748;
                margin-bottom: 16px;
            }}
            
            .contact-info {{
                display: flex;
                justify-content: center;
                gap: 30px;
                flex-wrap: wrap;
                margin-top: 12px;
            }}
            
            .contact-item {{
                display: flex;
                align-items: center;
                gap: 8px;
                color: #4a5568;
                font-weight: 500;
            }}
            
            /* 🆕 강의 아이디어: 모바일 반응형 */
            @media (max-width: 600px) {{
                .email-container {{
                    margin: 10px;
                    border-radius: 12px;
                }}
                
                .header, .content {{
                    padding: 25px 20px;
                }}
                
                .download-section {{
                    padding: 20px;
                }}
                
                .info-card {{
                    padding: 18px;
                }}
                
                .features-grid {{
                    grid-template-columns: 1fr;
                }}
                
                .contact-info {{
                    flex-direction: column;
                    gap: 12px;
                }}
                
                .guide-step {{
                    padding-left: 50px;
                }}
                
                .guide-step::before {{
                    width: 32px;
                    height: 32px;
                    font-size: 14px;
                }}
            }}
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- 🆕 강의 아이디어: 브랜드 인식 강화 헤더 -->
            <div class="header">
                <h1>🎉 구매 완료!</h1>
                <div class="subtitle">네이버 블로그 자동화 v{purchase_data['version']}</div>
            </div>
            
            <div class="content">
                <!-- 🆕 강의 아이디어: 개인화된 인사말 -->
                <div class="greeting">
                    안녕하세요, {purchase_data['customer_name']}님! 👋
                </div>
                
                <div class="intro-text">
                    네이버 블로그 자동화 프로그램 구매가 <strong>성공적으로 완료</strong>되었습니다. 
                    이제 효율적인 블로그 관리와 자동화된 컨텐츠 생성을 경험해보세요!
                </div>
                
                <!-- 🆕 강의 아이디어: 강화된 다운로드 섹션 -->
                <div class="download-section">
                    <div class="download-title">프로그램 다운로드</div>
                    <p style="margin-bottom: 20px; color: #2b6cb0; font-size: 15px;">
                        아래 버튼을 클릭하여 프로그램을 바로 다운로드하세요
                    </p>
                    <a href="{download_url}" class="download-btn">
                        🚀 프로그램 다운로드 (v{purchase_data['version']})
                    </a>
                    <div class="download-note">
                        ⏰ 다운로드 링크는 구매일로부터 30일간 유효합니다
                    </div>
                </div>
                
                <!-- 🆕 강의 아이디어: 구매 내역 카드 -->
                <div class="info-card">
                    <h3>📋 구매 내역</h3>
                    <div class="info-item">
                        <span class="info-label">주문번호</span>
                        <span class="info-value">{purchase_data['order_id']}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">제품 버전</span>
                        <span class="info-value">v{purchase_data['version']}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">사용 가능 계정</span>
                        <span class="info-value">{purchase_data['account_count']}개</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">월 포스트 한도</span>
                        <span class="info-value">{purchase_data['post_count']}개</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">사용 기간</span>
                        <span class="info-value">{purchase_data['months']}개월</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">만료일</span>
                        <span class="info-value">{purchase_data['expire_date'][:10]}</span>
                    </div>
                </div>
                
                <!-- 🆕 강의 아이디어: 라이선스 섹션 개선 -->
                <div class="license-section">
                    <h3 style="color: #c05621; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                        🔑 임시 라이선스 (설치 시 필요)
                    </h3>
                    <div class="license-code">{purchase_data['temporary_license']}</div>
                    <div style="font-size: 13px; color: #c05621; margin-top: 8px;">
                        ⚠️ 이 임시 라이선스는 프로그램 설치 시 필요합니다. 
                        프로그램 설치 후 자동으로 최종 인증키로 전환됩니다.
                    </div>
                </div>
                
                <!-- 🆕 강의 아이디어: 기능 목록 그리드 -->
                {get_version_features_html(purchase_data['version'])}
                
                <!-- 🆕 강의 아이디어: 설치 가이드 개선 -->
                <div class="guide-section">
                    <h3 style="text-align: center; color: #0369a1; margin-bottom: 24px; font-size: 20px;">
                        🚀 설치 및 사용 방법
                    </h3>
                    <ol class="guide-steps">
                        <li class="guide-step">위의 다운로드 버튼을 클릭하여 프로그램을 다운로드하세요</li>
                        <li class="guide-step">다운로드한 프로그램을 실행하세요</li>
                        <li class="guide-step">최초 실행 시 위의 임시 라이선스를 입력하세요</li>
                        <li class="guide-step">하드웨어 ID가 자동으로 등록되며 최종 인증키가 발급됩니다</li>
                        <li class="guide-step">이제 구매하신 버전의 모든 기능을 사용하실 수 있습니다!</li>
                    </ol>
                </div>
                
                <!-- 🆕 강의 아이디어: 문의 섹션 개선 -->
                <div class="contact-section">
                    <div class="contact-title">💬 문의사항이 있으시면 언제든지 연락주세요!</div>
                    <div class="contact-info">
                        <div class="contact-item">
                            <span>📧</span>
                            <span>support@yourdomain.com</span>
                        </div>
                        <div class="contact-item">
                            <span>📞</span>
                            <span>1588-0000</span>
                        </div>
                        <div class="contact-item">
                            <span>💬</span>
                            <span>카카오톡 채널</span>
                        </div>
                    </div>
                </div>
                
                <!-- 🆕 강의 아이디어: 감사 메시지 -->
                <div style="text-align: center; margin-top: 30px; padding: 20px; color: #4a5568;">
                    <p style="font-size: 16px; margin-bottom: 8px;">
                        네이버 블로그 자동화를 선택해주셔서 감사합니다! 🙏
                    </p>
                    <p style="font-size: 14px; color: #718096;">
                        더 나은 서비스로 보답하겠습니다.
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    
    # 이메일 발송
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = settings.MAIL_FROM
        msg['To'] = purchase_data['customer_email']
        
        html_part = MIMEText(html_content, 'html', 'utf-8')
        msg.attach(html_part)
        
        with smtplib.SMTP(settings.MAIL_SERVER, settings.MAIL_PORT) as server:
            if settings.MAIL_TLS:
                server.starttls()
            server.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
            server.send_message(msg)
            
        return True
        
    except Exception as e:
        print(f"이메일 발송 실패: {e}")
        return False

def get_version_features_html(version: str) -> str:
    """🆕 강의 아이디어: 개선된 버전별 기능 HTML 생성"""
    features_map = {
        "1.1": [
            ("✍️", "기본 포스팅", "네이버 블로그 자동 글 작성"),
            ("⏰", "간단 예약", "시간 설정으로 예약 포스팅"),
            ("👤", "1계정 지원", "개인 블로그 운영에 최적")
        ],
        "2.3": [
            ("✍️", "기본 포스팅", "네이버 블로그 자동 글 작성"),
            ("⏰", "고급 예약", "정교한 스케줄링 시스템"),
            ("🏷️", "자동 해시태그", "트렌드 기반 해시태그 생성"),
            ("👥", "2-3계정 지원", "멀티 계정 관리"),
            ("⚡", "고급 기능", "SEO 최적화 및 분석")
        ],
        "4.4": [
            ("🎯", "모든 기본 기능", "전체 포스팅 자동화"),
            ("🤖", "AI 컨텐츠 생성", "ChatGPT 기반 컨텐츠 자동 생성"),
            ("📤", "대량 업로드", "Excel/CSV 파일 일괄 업로드"),
            ("📈", "프리미엄 분석", "상세한 성과 분석 리포트"),
            ("👥", "최대 10계정", "대규모 블로그 네트워크 관리"),
            ("🔧", "커스터마이징", "맞춤형 설정 및 템플릿")
        ]
    }
    
    features = features_map.get(version, features_map["1.1"])
    
    html = '''
    <div class="info-card">
        <h3>✨ 포함된 기능</h3>
        <div class="features-grid">
    '''
    
    for icon, title, description in features:
        html += f'''
        <div class="feature-item">
            <div class="feature-icon">{icon}</div>
            <div>
                <div class="feature-text">{title}</div>
                <div style="font-size: 12px; color: #68d391; margin-top: 4px;">{description}</div>
            </div>
        </div>
        '''
    
    html += '''
        </div>
    </div>
    '''
    
    return html 