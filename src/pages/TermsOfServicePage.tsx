import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">이용약관</h1>

          <Card className="mb-8">
            <CardContent className="p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">제1조 (목적)</h2>
                <p className="text-foreground">
                  이 약관은 대전제이에스힐링의원(이하 "JSHA")이 제공하는 JSHA 마스터 코스 교육 서비스 및
                  제품 판매 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항,
                  기타 필요한 사항을 규정함을 목적으로 합니다.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">제2조 (정의)</h2>
                <div className="bg-accent/20 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="font-semibold text-foreground">1. "서비스"</p>
                    <p className="text-sm text-muted-foreground ml-4">
                      JSHA가 제공하는 JSHA 마스터 코스 교육 프로그램, 인솔 등 제품 판매,
                      관련 온라인 플랫폼 및 모든 부가 서비스를 의미합니다.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">2. "이용자"</p>
                    <p className="text-sm text-muted-foreground ml-4">
                      이 약관에 따라 JSHA가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">3. "교육생"</p>
                    <p className="text-sm text-muted-foreground ml-4">
                      JSHA 마스터 코스에 신청하여 교육을 받는 자를 말합니다.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">4. "구매자"</p>
                    <p className="text-sm text-muted-foreground ml-4">
                      JSHA가 판매하는 제품을 구매하는 자를 말합니다.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">제3조 (약관의 게시와 개정)</h2>
                <div className="space-y-3">
                  <p className="text-foreground">
                    1. JSHA는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.
                  </p>
                  <p className="text-foreground">
                    2. JSHA는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
                  </p>
                  <p className="text-foreground">
                    3. JSHA가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께
                    서비스 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.
                  </p>
                  <p className="text-foreground">
                    4. 이용자는 개정된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">제4조 (서비스의 제공 및 변경)</h2>
                <div className="space-y-3">
                  <p className="text-foreground">
                    1. JSHA는 다음과 같은 서비스를 제공합니다:
                  </p>
                  <div className="bg-accent/20 p-4 rounded-lg ml-4">
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                      <li>JSHA 마스터 코스 교육 프로그램 제공</li>
                      <li>교육 관련 자료 및 콘텐츠 제공</li>
                      <li>인솔 등 제품 판매 및 배송</li>
                      <li>기타 JSHA가 정하는 서비스</li>
                    </ul>
                  </div>
                  <p className="text-foreground">
                    2. JSHA는 상당한 이유가 있는 경우에 운영상, 기술상의 필요에 따라 제공하고 있는
                    서비스를 변경할 수 있습니다.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">제5조 (교육 신청 및 승인)</h2>
                <div className="space-y-3">
                  <p className="text-foreground">
                    1. 교육 신청자는 JSHA가 정한 양식에 따라 필요한 정보를 기입한 후 신청합니다.
                  </p>
                  <p className="text-foreground">
                    2. JSHA는 제1항과 같이 신청한 이용자에 대하여 다음 각 호에 해당하는 경우를 제외하고는
                    신청을 승인합니다:
                  </p>
                  <div className="bg-accent/20 p-4 rounded-lg ml-4">
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                      <li>허위의 정보를 기재하거나, JSHA가 제시하는 내용을 기재하지 않은 경우</li>
                      <li>교육 정원이 초과된 경우</li>
                      <li>기타 JSHA가 필요하다고 인정하는 경우</li>
                    </ul>
                  </div>
                  <p className="text-foreground">
                    3. 교육생 선발은 JSHA의 내부 기준에 따라 진행되며, 선발 결과는 이메일 또는 전화로 통보됩니다.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">제6조 (수강료 및 결제)</h2>
                <div className="space-y-3">
                  <p className="text-foreground">
                    1. 수강료는 다음과 같습니다:
                  </p>
                  <div className="bg-accent/20 p-4 rounded-lg ml-4">
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                      <li>세션 1 (1회차): 1,970,000원</li>
                      <li>전회차 등록 (세션 1-4): 11,000,000원</li>
                      <li>워크숍 참석자: 50% 할인 적용</li>
                    </ul>
                  </div>
                  <p className="text-foreground">
                    2. 결제는 JSHA가 지정한 결제 수단을 통해 진행되며, 결제 완료 시 교육 등록이 확정됩니다.
                  </p>
                  <p className="text-foreground">
                    3. 수강료는 교육 시작 전까지 완납되어야 하며, 미납 시 교육 참여가 제한될 수 있습니다.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">제7조 (환불 규정)</h2>
                <div className="space-y-3">
                  <p className="text-foreground">
                    1. 교육 환불은 다음의 기준에 따릅니다:
                  </p>
                  <div className="bg-accent/20 p-4 rounded-lg ml-4">
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                      <li>교육 시작일 30일 전: 전액 환불</li>
                      <li>교육 시작일 14일 전 ~ 29일 전: 50% 환불</li>
                      <li>교육 시작일 13일 전 이후: 환불 불가</li>
                      <li>교육 진행 중 중도 포기: 환불 불가</li>
                    </ul>
                  </div>
                  <p className="text-foreground">
                    2. JSHA의 귀책사유로 교육이 취소되는 경우 전액 환불됩니다.
                  </p>
                  <p className="text-foreground">
                    3. 환불 시 결제 수수료는 이용자가 부담합니다.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">제8조 (제품 구매 및 배송)</h2>
                <div className="space-y-3">
                  <p className="text-foreground">
                    1. 이용자는 JSHA가 판매하는 제품을 온라인을 통해 구매할 수 있습니다.
                  </p>
                  <p className="text-foreground">
                    2. JSHA는 이용자가 구매 신청한 제품이 품절 등의 사유로 인도 또는 제공을 할 수 없을 때에는
                    지체 없이 그 사유를 이용자에게 통지하고 환불 조치합니다.
                  </p>
                  <p className="text-foreground">
                    3. 배송은 결제 완료 후 영업일 기준 2-3일 이내에 이루어집니다.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">제9조 (청약철회 및 반품)</h2>
                <div className="space-y-3">
                  <p className="text-foreground">
                    1. 이용자는 제품을 배송받은 날로부터 7일 이내에 청약철회를 할 수 있습니다.
                  </p>
                  <p className="text-foreground">
                    2. 다음 각 호의 경우에는 청약철회가 제한됩니다:
                  </p>
                  <div className="bg-accent/20 p-4 rounded-lg ml-4">
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                      <li>이용자의 책임 있는 사유로 제품이 멸실 또는 훼손된 경우</li>
                      <li>이용자의 사용 또는 일부 소비로 제품의 가치가 현저히 감소한 경우</li>
                      <li>시간의 경과에 의하여 재판매가 곤란할 정도로 제품의 가치가 현저히 감소한 경우</li>
                    </ul>
                  </div>
                  <p className="text-foreground">
                    3. 반품 배송비는 이용자의 귀책사유인 경우 이용자가 부담하고, JSHA의 귀책사유인 경우 JSHA가 부담합니다.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">제10조 (이용자의 의무)</h2>
                <div className="space-y-3">
                  <p className="text-foreground">
                    이용자는 다음 각 호의 행위를 하여서는 안됩니다:
                  </p>
                  <div className="bg-accent/20 p-4 rounded-lg">
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                      <li>허위 내용의 등록</li>
                      <li>타인의 정보 도용</li>
                      <li>JSHA가 게시한 정보의 무단 변경</li>
                      <li>JSHA가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                      <li>JSHA 및 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                      <li>JSHA 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                      <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">제11조 (저작권의 귀속 및 이용제한)</h2>
                <div className="space-y-3">
                  <p className="text-foreground">
                    1. JSHA가 작성한 저작물에 대한 저작권 기타 지적재산권은 JSHA에 귀속합니다.
                  </p>
                  <p className="text-foreground">
                    2. 이용자는 서비스를 이용함으로써 얻은 정보 중 JSHA에게 지적재산권이 귀속된 정보를
                    JSHA의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로
                    이용하거나 제3자에게 이용하게 하여서는 안됩니다.
                  </p>
                  <p className="text-foreground">
                    3. 교육 자료의 무단 배포, 복제, 전송은 법적 책임을 질 수 있습니다.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">제12조 (면책조항)</h2>
                <div className="space-y-3">
                  <p className="text-foreground">
                    1. JSHA는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는
                    서비스 제공에 관한 책임이 면제됩니다.
                  </p>
                  <p className="text-foreground">
                    2. JSHA는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.
                  </p>
                  <p className="text-foreground">
                    3. JSHA는 이용자가 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며,
                    그 밖의 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.
                  </p>
                  <p className="text-foreground">
                    4. JSHA는 교육 효과나 성과에 대해 보장하지 않으며, 교육 참여에 따른 결과는 이용자 본인의 책임입니다.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">제13조 (분쟁해결)</h2>
                <div className="space-y-3">
                  <p className="text-foreground">
                    1. JSHA는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여
                    피해보상처리기구를 설치·운영합니다.
                  </p>
                  <p className="text-foreground">
                    2. JSHA는 이용자로부터 제출되는 불만사항 및 의견은 우선적으로 그 사항을 처리합니다.
                    다만, 신속한 처리가 곤란한 경우에는 이용자에게 그 사유와 처리일정을 즉시 통보해 드립니다.
                  </p>
                  <p className="text-foreground">
                    3. JSHA와 이용자 간에 발생한 전자상거래 분쟁과 관련하여 이용자의 피해구제신청이 있는 경우에는
                    공정거래위원회 또는 시·도지사가 의뢰하는 분쟁조정기관의 조정에 따를 수 있습니다.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">제14조 (재판권 및 준거법)</h2>
                <div className="space-y-3">
                  <p className="text-foreground">
                    1. 이 약관의 해석 및 JSHA와 이용자 간의 분쟁에 대하여는 대한민국의 법을 적용합니다.
                  </p>
                  <p className="text-foreground">
                    2. 서비스 이용으로 발생한 분쟁에 대해 소송이 제기될 경우 대전지방법원을 관할 법원으로 합니다.
                  </p>
                </div>
              </section>

              <section className="border-t pt-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">부칙</h2>
                <p className="text-sm text-muted-foreground">
                  본 약관은 2024년 1월 1일부터 시행됩니다.
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

export default TermsOfServicePage;
