import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 pt-40 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">개인정보처리방침</h1>

          <Card className="mb-8">
            <CardContent className="p-8 space-y-8">
              <section>
                <p className="text-muted-foreground mb-4">
                  대전제이에스힐링의원(이하 "JSHA")은 개인정보보호법 제30조에 따라 정보주체의 개인정보를 보호하고
                  이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
                </p>
                <p className="text-sm text-muted-foreground">
                  시행일자: 2024년 1월 1일
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">제1조 (개인정보의 처리 목적)</h2>
                <p className="text-foreground mb-4">
                  JSHA는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
                  이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                </p>
                <div className="bg-accent/20 p-4 rounded-lg space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">1. 마스터 코스 신청 및 관리</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                      <li>교육 신청 의사 확인, 교육생 식별, 교육생 자격 유지·관리</li>
                      <li>교육 일정 안내, 교육 자료 제공</li>
                      <li>불만 처리 등 민원 처리, 고지사항 전달</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">2. 제품(인솔) 판매 및 배송</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                      <li>제품 주문 확인, 결제 처리</li>
                      <li>제품 배송 및 배송 현황 안내</li>
                      <li>구매 및 대금 결제, 환불 등의 처리</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">3. 마케팅 및 광고 활용</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                      <li>신규 교육 프로그램 개발 및 맞춤형 교육 제공</li>
                      <li>이벤트 및 광고성 정보 제공 및 참여 기회 제공</li>
                      <li>교육 만족도 조사</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">제2조 (개인정보의 처리 및 보유 기간)</h2>
                <p className="text-foreground mb-4">
                  JSHA는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서
                  개인정보를 처리·보유합니다.
                </p>
                <div className="bg-accent/20 p-4 rounded-lg space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">1. 마스터 코스 신청 정보</h3>
                    <p className="text-sm text-muted-foreground ml-4">보유기간: 교육 종료 후 3년</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">2. 제품 구매 정보</h3>
                    <p className="text-sm text-muted-foreground ml-4">
                      보유기간: 전자상거래법에 따라 5년
                      <br />
                      (계약 또는 청약철회 등에 관한 기록: 5년)
                      <br />
                      (대금결제 및 재화 등의 공급에 관한 기록: 5년)
                      <br />
                      (소비자 불만 또는 분쟁처리에 관한 기록: 3년)
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">제3조 (처리하는 개인정보의 항목)</h2>
                <p className="text-foreground mb-4">JSHA는 다음의 개인정보 항목을 처리하고 있습니다.</p>
                <div className="bg-accent/20 p-4 rounded-lg space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">1. 필수 항목</h3>
                    <p className="text-sm text-muted-foreground ml-4">이름, 이메일, 전화번호</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">2. 제품 구매 시 추가 수집 항목</h3>
                    <p className="text-sm text-muted-foreground ml-4">배송지 주소, 결제 정보</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">3. 자동 수집 항목</h3>
                    <p className="text-sm text-muted-foreground ml-4">
                      접속 IP 정보, 쿠키, 접속 로그, 서비스 이용 기록
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">제4조 (개인정보의 제3자 제공)</h2>
                <p className="text-foreground mb-4">
                  JSHA는 원칙적으로 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며,
                  정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
                </p>
                <div className="bg-accent/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">제3자 제공 현황</h3>
                  <div className="space-y-3 text-sm text-muted-foreground ml-4">
                    <div>
                      <p className="font-semibold text-foreground">1. 결제 대행사 (토스페이먼츠)</p>
                      <ul className="list-disc list-inside ml-4">
                        <li>제공받는 자: 토스페이먼츠</li>
                        <li>제공 목적: 결제 처리</li>
                        <li>제공 항목: 이름, 이메일, 전화번호, 결제 금액</li>
                        <li>보유 기간: 거래 종료 후 5년</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">2. 배송 대행사</p>
                      <ul className="list-disc list-inside ml-4">
                        <li>제공받는 자: 계약된 택배사</li>
                        <li>제공 목적: 제품 배송</li>
                        <li>제공 항목: 이름, 전화번호, 배송지 주소</li>
                        <li>보유 기간: 배송 완료 후 즉시 파기</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">제5조 (개인정보처리의 위탁)</h2>
                <p className="text-foreground mb-4">
                  JSHA는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
                </p>
                <div className="bg-accent/20 p-4 rounded-lg">
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div>
                      <p className="font-semibold text-foreground">1. 이메일 발송 대행</p>
                      <ul className="list-disc list-inside ml-4">
                        <li>수탁업체: Gmail (Google)</li>
                        <li>위탁업무 내용: 교육 안내 및 주문 확인 이메일 발송</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">2. 데이터 저장</p>
                      <ul className="list-disc list-inside ml-4">
                        <li>수탁업체: Google Sheets (Google)</li>
                        <li>위탁업무 내용: 신청 정보 및 결제 정보 저장</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">제6조 (정보주체의 권리·의무 및 행사방법)</h2>
                <p className="text-foreground mb-4">
                  정보주체는 JSHA에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
                </p>
                <div className="bg-accent/20 p-4 rounded-lg">
                  <ul className="list-decimal list-inside text-sm text-muted-foreground space-y-2">
                    <li>개인정보 열람 요구</li>
                    <li>오류 등이 있을 경우 정정 요구</li>
                    <li>삭제 요구</li>
                    <li>처리정지 요구</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-4">
                    권리 행사는 JSHA에 대해 서면, 전화, 전자우편 등을 통하여 하실 수 있으며,
                    JSHA는 이에 대해 지체 없이 조치하겠습니다.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">제7조 (개인정보의 파기)</h2>
                <p className="text-foreground mb-4">
                  JSHA는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는
                  지체 없이 해당 개인정보를 파기합니다.
                </p>
                <div className="bg-accent/20 p-4 rounded-lg space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">파기 절차</h3>
                    <p className="text-sm text-muted-foreground ml-4">
                      이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져(종이의 경우 별도의 서류)
                      내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">파기 방법</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                      <li>전자적 파일 형태: 복구 및 재생되지 않도록 안전하게 삭제</li>
                      <li>종이 문서: 분쇄기로 분쇄하거나 소각</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">제8조 (개인정보 보호책임자)</h2>
                <p className="text-foreground mb-4">
                  JSHA는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및
                  피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
                </p>
                <div className="bg-accent/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-3">개인정보 보호책임자</h3>
                  <div className="space-y-2 text-sm text-muted-foreground ml-4">
                    <p><strong className="text-foreground">소속:</strong> 대전제이에스힐링의원</p>
                    <p><strong className="text-foreground">연락처:</strong> 010-4002-1094</p>
                    <p><strong className="text-foreground">이메일:</strong> contact@jsha.kr</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    정보주체께서는 JSHA의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리,
                    피해구제 등에 관한 사항을 개인정보 보호책임자에게 문의하실 수 있습니다.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">제9조 (개인정보 처리방침 변경)</h2>
                <p className="text-foreground">
                  이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는
                  변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
                </p>
              </section>

              <section className="border-t pt-6">
                <p className="text-sm text-muted-foreground">
                  본 방침은 2024년 1월 1일부터 시행됩니다.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
