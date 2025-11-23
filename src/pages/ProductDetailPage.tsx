import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { activeProducts } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ProductDetailPage = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();

    const product = activeProducts.find(p => p.id === productId);

    if (!product) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="container mx-auto px-4 py-20">
                    <div className="max-w-2xl mx-auto text-center">
                        <h1 className="text-2xl font-bold mb-4">상품을 찾을 수 없습니다</h1>
                        <Button onClick={() => navigate("/products")}>
                            상품 목록으로 돌아가기
                        </Button>
                    </div>
                </main>
                <Footer showBusinessInfo={true} />
            </div>
        );
    }

    // Render different content based on product type
    const renderInsoleContent = () => (
        <>
            {/* Product Introduction */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">
                        특허받은 척추측만증 교정용, JS Insole
                    </h1>
                    <div className="prose max-w-none">
                        <p className="text-base text-muted-foreground text-center leading-relaxed">
                            JS Insole은 단순한 깔창이 아닙니다.<br />
                            특허받은 기술을 적용하여 척추측만증 교정을 돕기 위해<br />
                            의학적 원리로 제작된 기능성 인솔입니다.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Patent Certificate */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-center mb-3">특허 인증</h2>
                <img
                    src="/images/products/patent-certificate.png"
                    alt="특허증"
                    className="w-full max-w-md mx-auto rounded-lg shadow-sm"
                />
            </div>

            {/* Purchase Guide */}
            <Card className="mb-8">
                <CardContent className="pt-6">
                    <Alert className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle className="text-base font-bold">필독</AlertTitle>
                        <AlertDescription className="text-sm">
                            구매 옵션 및 수량 안내
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            상품별 판매 단위가 다르므로, 주문 전 반드시 확인 부탁드립니다.
                        </p>

                        <div className="space-y-3">
                            <div className="bg-muted/50 p-3 rounded-lg">
                                <h3 className="font-bold text-base mb-1">1. JS Insole (기본형)</h3>
                                <p className="text-sm text-muted-foreground">
                                    • 판매 단위: <strong className="text-foreground">낱개 (1개)</strong> 가격입니다.
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    (좌/우 구분이 필요한 경우 옵션을 확인해주세요.)
                                </p>
                            </div>

                            <div className="bg-muted/50 p-3 rounded-lg">
                                <h3 className="font-bold text-base mb-1">2. 대각 Insole (특수형)</h3>
                                <p className="text-sm text-muted-foreground">
                                    • 5mm / 6mm 타입: <strong className="text-foreground">1세트 (2개)</strong> 가격입니다.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    • 10mm / 11mm (Soft) 타입: <strong className="text-foreground">낱개 (1개)</strong> 가격입니다.
                                </p>
                            </div>
                        </div>

                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle className="text-sm font-bold">⚠️ 주문 시 유의사항</AlertTitle>
                            <AlertDescription className="space-y-1 mt-2 text-xs">
                                <p>• 여성용/남성용 사이즈를 정확히 선택해 주세요.</p>
                                <p>• 일반형과 대각(Diagonal) 형태를 혼동하지 않도록 주의해 주세요.</p>
                                <p>• 의료용 교정구 특성상 개봉 및 사용 후에는 단순 변심 반품이 제한될 수 있습니다.</p>
                            </AlertDescription>
                        </Alert>
                    </div>
                </CardContent>
            </Card>
        </>
    );

    const renderBaromaOilContent = () => (
        <>
            {/* Product Introduction */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">
                        바로마 오일
                    </h1>
                    <p className="text-base text-muted-foreground text-center leading-relaxed mb-6">
                        균형있는 신체 밸런스를 위한 발마사지 오일입니다.
                    </p>

                    <div className="space-y-6">
                        {/* 사용법 */}
                        <div>
                            <h3 className="font-bold text-lg mb-3">사용법</h3>
                            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                                <li>우측 발바닥 오목한 곳에 오일 2방울을 떨어뜨립니다.</li>
                                <li>우측 발바닥으로 좌측 발등을 문지릅니다.</li>
                                <li>발가락 운동을 합니다.</li>
                            </ol>
                            <p className="text-xs text-muted-foreground mt-3">
                                자세한 바로마오일의 적용 방법은 <strong className="text-foreground">010-4002-1094</strong>로 문의주시면 동영상 안내해드리고 있습니다.
                            </p>
                        </div>

                        {/* 주의사항 */}
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle className="text-sm font-bold">사용 시 주의사항</AlertTitle>
                            <AlertDescription className="space-y-2 mt-2 text-xs">
                                <p>• 오일 사용 시 또는 사용 후 직사광선에 의하여 사용부위가 붉은 반점, 부어오름 또는 가려움증 등의 이상 증상이나 부작용이 있는 경우 전문의 등과 상담하십시오.</p>
                                <p>• 상처가 있는 부위 등에는 사용을 자제하십시오.</p>
                                <p>• 섭취하지 마십시오.</p>
                            </AlertDescription>
                        </Alert>

                        {/* 보관 방법 */}
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <h3 className="font-bold text-base mb-2">보관 및 취급 시 주의사항</h3>
                            <ul className="space-y-1 text-xs text-muted-foreground">
                                <li>• 어린이의 손에 닿지 않는 곳에 보관하십시오.</li>
                                <li>• 직사광선을 피해서 보관하십시오.</li>
                            </ul>
                        </div>

                        <p className="text-xs text-muted-foreground text-center">
                            본 제품에 이상이 있을 경우 공정거래 위원회 고시 품목별 소비자분쟁해결기준에 의해 보상해 드립니다.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </>
    );

    const renderKuruntaContent = () => (
        <>
            {/* Product Introduction */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">
                        쿠룬타
                    </h1>
                    <p className="text-base text-muted-foreground text-center leading-relaxed mb-6">
                        중형 사이즈의 쿠룬타입니다.
                    </p>

                    <div className="space-y-4">
                        {/* 제품 사양 */}
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <h3 className="font-bold text-base mb-3">제품 사양</h3>
                            <div className="grid grid-cols-3 gap-3 text-sm">
                                <div className="text-center">
                                    <p className="text-muted-foreground text-xs mb-1">가로</p>
                                    <p className="font-bold text-foreground">430mm</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-muted-foreground text-xs mb-1">세로</p>
                                    <p className="font-bold text-foreground">760mm</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-muted-foreground text-xs mb-1">높이</p>
                                    <p className="font-bold text-foreground">160mm</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground text-center">
                            자세한 사용 방법 및 문의사항은 <strong className="text-foreground">010-4002-1094</strong>로 연락 주시기 바랍니다.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </>
    );

    const isInsole = product.id.includes('silicon');
    const isBaromaOil = product.id === 'aroma-oil';
    const isKurunta = product.id === 'kuronta';

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/products")}
                        className="mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        상품 목록으로 돌아가기
                    </Button>

                    {/* Product Main Image */}
                    <div className="mb-6">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full max-w-lg mx-auto rounded-lg shadow-sm"
                        />
                    </div>

                    {/* Render product-specific content */}
                    {isInsole && renderInsoleContent()}
                    {isBaromaOil && renderBaromaOilContent()}
                    {isKurunta && renderKuruntaContent()}

                    {/* CTA Button */}
                    <div className="text-center">
                        <Button
                            size="lg"
                            onClick={() => navigate("/products")}
                            className="text-base px-6 py-5"
                        >
                            구매하러 가기
                        </Button>
                    </div>
                </div>
            </main>

            <Footer showBusinessInfo={true} />
        </div>
    );
};

export default ProductDetailPage;
