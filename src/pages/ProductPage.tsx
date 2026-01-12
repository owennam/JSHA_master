import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { activeProducts } from "@/data/products";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, LogOut, Plus, Minus, Trash2, MapPin, Package, RefreshCw, CreditCard } from "lucide-react";

// Daum 우편번호 서비스 타입 선언
declare global {
  interface Window {
    daum: any;
  }
}

// 장바구니 아이템 타입
interface CartItem {
  id: string;
  productId: string;
  productName: string;
  size: string;
  type: string;
  quantity: number;
  price: number;
}

const customerInfoSchema = z.object({
  name: z.string().min(2, "이름을 입력해주세요"),
  email: z.string().email("올바른 이메일을 입력해주세요"),
  phone: z.string().min(10, "올바른 전화번호를 입력해주세요"),
  postalCode: z.string().min(5, "우편번호를 입력해주세요"),
  address: z.string().min(5, "기본 주소를 입력해주세요"),
  addressDetail: z.string().min(1, "상세 주소를 입력해주세요"),
});

type CustomerInfoData = z.infer<typeof customerInfoSchema>;

const ProductPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, userProfile, signOut } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);



  // 인증 체크
  useEffect(() => {
    if (!user) {
      // 로그인하지 않은 경우
      navigate("/auth");
    } else if (userProfile && userProfile.status !== 'approved') {
      // 로그인했지만 승인되지 않은 경우
      navigate("/auth/pending");
    }
  }, [user, userProfile, navigate]);

  // URL 파라미터로 autoOpenSheet가 있으면 시트 열기 (결제 취소 후 복귀 시)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("autoOpenSheet") === "true" && cart.length > 0) {
      setIsSheetOpen(true);
    }
  }, [cart.length]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "로그아웃 완료",
        description: "안전하게 로그아웃되었습니다.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "로그아웃 실패",
        description: "다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  // 주소 검색 팝업 열기
  const handleAddressSearch = () => {
    if (!window.daum) {
      toast({
        title: "주소 검색 오류",
        description: "주소 검색 서비스를 불러올 수 없습니다.",
        variant: "destructive",
      });
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data: any) {
        // 도로명 주소 또는 지번 주소 선택
        const fullAddress = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;

        // 폼 필드에 값 설정
        form.setValue("postalCode", data.zonecode);
        form.setValue("address", fullAddress);

        // 상세주소 입력 필드에 포커스
        setTimeout(() => {
          const addressDetailInput = document.querySelector<HTMLInputElement>('input[name="addressDetail"]');
          if (addressDetailInput) {
            addressDetailInput.focus();
          }
        }, 100);
      },
    }).open();
  };

  const form = useForm<CustomerInfoData>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      postalCode: "",
      address: "",
      addressDetail: "",
    },
  });

  // 장바구니 및 폼 데이터 로드
  useEffect(() => {
    const savedCart = localStorage.getItem("jsha_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }

    const savedCustomerInfo = localStorage.getItem("jsha_customer_info");
    if (savedCustomerInfo) {
      // 현재 세션 정보가 있으면 우선 사용
      try {
        const parsedInfo = JSON.parse(savedCustomerInfo);
        Object.keys(parsedInfo).forEach((key) => {
          form.setValue(key as any, parsedInfo[key]);
        });
      } catch (e) {
        console.error("Failed to parse customer info from localStorage", e);
      }
    } else {
      // 저장된 고객 프로필 로드 (이전 주문 정보)
      const savedProfile = localStorage.getItem("jsha_saved_customer_profile");
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          Object.keys(parsedProfile).forEach((key) => {
            if (parsedProfile[key]) {
              form.setValue(key as any, parsedProfile[key]);
            }
          });
        } catch (e) {
          console.error("Failed to parse saved customer profile", e);
        }
      } else if (userProfile) {
        // 저장된 정보가 없으면 userProfile로 자동 입력
        form.setValue("name", userProfile.directorName);
        form.setValue("email", userProfile.email);
      }
    }
  }, [form, userProfile]);

  // 장바구니 변경 시 저장
  useEffect(() => {
    localStorage.setItem("jsha_cart", JSON.stringify(cart));
  }, [cart]);

  // 폼 데이터 변경 감지 및 저장
  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem("jsha_customer_info", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const selectedProductData = activeProducts.find((p) => p.id === selectedProduct);

  // 장바구니에 추가
  const addToCart = () => {
    if (!selectedProduct || !selectedSize || !selectedType) {
      toast({
        title: "옵션을 선택해주세요",
        description: "제품, 사이즈, 타입을 모두 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    const product = activeProducts.find((p) => p.id === selectedProduct);
    if (!product) return;

    const cartItem: CartItem = {
      id: `${selectedProduct}-${selectedSize}-${selectedType}-${Date.now()}`,
      productId: selectedProduct,
      productName: product.name,
      size: selectedSize,
      type: selectedType,
      quantity: quantity,
      price: product.price,
    };

    setCart([...cart, cartItem]);

    // 선택 초기화
    setSelectedProduct("");
    setSelectedSize("");
    setSelectedType("");
    setQuantity(1);
    setIsSheetOpen(false);

    toast({
      title: "장바구니에 추가되었습니다",
      description: `${product.name} (${selectedSize}, ${selectedType}) x ${quantity}`,
    });
  };

  // 장바구니 아이템 수량 변경
  const updateCartItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(cart.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  // 장바구니 아이템 삭제
  const removeCartItem = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
    toast({
      title: "상품이 삭제되었습니다",
    });
  };

  // 총 금액 계산
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // 결제하기
  const onSubmit = (data: CustomerInfoData) => {
    if (cart.length === 0) {
      toast({
        title: "장바구니가 비어있습니다",
        description: "상품을 먼저 추가해주세요.",
        variant: "destructive",
      });
      return;
    }

    const orderId = `ORDER_${Date.now()}`;
    const productName = cart.length === 1
      ? `${cart[0].productName} (${cart[0].size}, ${cart[0].type})`
      : `${cart[0].productName} 외 ${cart.length - 1}건`;

    // 결제 페이지로 파라미터와 함께 이동
    const params = new URLSearchParams({
      productName,
      amount: totalAmount.toString(),
      orderId,
      customerName: data.name,
      customerEmail: data.email,
      customerPhone: data.phone,
      postalCode: data.postalCode,
      address: data.address,
      addressDetail: data.addressDetail,
      cartItems: JSON.stringify(cart),
    });

    navigate(`/payment?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* 우측 상단 사용자 정보 (RecapPage와 동일한 스타일) */}
      {user && (
        <div className="fixed top-24 right-4 z-40 flex items-center gap-3 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
              <Package className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground max-w-[150px] truncate">
              {user.email}
            </span>
          </div>
          <div className="h-4 w-px bg-gray-300"></div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
          >
            <LogOut className="w-3 h-3 mr-1" />
            로그아웃
          </Button>
        </div>
      )}

      <main className="flex-1 container mx-auto px-4 pt-40 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* 인증 정보 표시 */}
          {userProfile && (
            <div className="mb-8 p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">로그인 정보</p>
                <p className="font-semibold text-foreground">
                  {userProfile.clinicName} | {userProfile.directorName}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/my-orders")}
                  className="gap-2"
                >
                  <Package className="w-4 h-4" />
                  주문 내역
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </Button>
              </div>
            </div>
          )}

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              JSHA 인솔 주문
            </h1>
            <p className="text-muted-foreground">
              전문적인 통증 케어를 위한 맞춤형 인솔
            </p>
          </div>

          <div className="space-y-16">
            {/* 제품 선택 영역 */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4 text-center sm:text-left">제품 리스트</h2>

              {/* 제품 목록 - 4열 그리드 (핵심 변경) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {activeProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden transition-all hover:shadow-lg flex flex-col h-full bg-white group"
                  >
                    {/* Product Image */}
                    {product.image && (
                      <div className="bg-white border-b border-slate-100 aspect-square flex items-center justify-center relative overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="mb-4">
                        <CardTitle className="mb-2 line-clamp-2 min-h-[4rem] flex flex-col justify-start">
                          <span className="text-black font-extrabold text-xl leading-tight">{product.name}</span>
                          {product.type && (
                            <span className="text-lg font-extrabold text-slate-600 mt-1">
                              {product.type}
                            </span>
                          )}
                        </CardTitle>
                        {product.description && (
                          <p className="text-muted-foreground text-sm line-clamp-2 min-h-[2.5rem] mb-2">
                            {product.description}
                          </p>
                        )}
                        <p className="text-xl font-extrabold text-blue-600 mt-2">
                          {product.price.toLocaleString()}원
                        </p>
                      </div>

                      <div className="mt-auto space-y-2">
                        <Button
                          onClick={() => {
                            setSelectedProduct(product.id);
                            setSelectedSize("");
                            setSelectedType("");
                            setQuantity(1);
                            setIsSheetOpen(true);
                          }}
                          className="w-full font-bold shadow-sm"
                        >
                          옵션 선택 및 담기
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => navigate(`/products/${product.id}`)}
                          className="w-full text-xs h-8 text-muted-foreground hover:text-primary"
                        >
                          상세보기
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* 하단: 장바구니 및 결제 영역 (2열 배치) */}
            <div className="grid lg:grid-cols-2 gap-12 border-t pt-12">
              {/* 장바구니 영역 */}
              <div className="space-y-6">
                <Card className="h-full border-slate-200 shadow-md">
                  <CardHeader className="bg-slate-50 border-b border-slate-100">
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <ShoppingCart className="w-5 h-5" />
                      장바구니 ({cart.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground h-full min-h-[200px]">
                        <ShoppingCart className="w-16 h-16 mb-4 opacity-10" />
                        <p className="font-medium text-lg text-slate-400">장바구니가 비어있습니다</p>
                        <p className="text-sm mt-1 text-slate-400">원하시는 상품을 담아주세요</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {cart.map((item) => (
                          <div key={item.id} className="border-b border-slate-100 pb-4 last:border-b-0">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <p className="font-bold text-slate-800">{item.productName}</p>
                                <div className="text-sm text-slate-500 mt-1 flex flex-col">
                                  <span>옵션: {item.size} / {item.type}</span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeCartItem(item.id)}
                                className="text-slate-400 hover:text-red-500 hover:bg-red-50 -mt-2 -mr-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                              <div className="flex items-center gap-3 bg-white rounded border px-2 py-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              <p className="font-bold text-lg text-slate-900">
                                {(item.price * item.quantity).toLocaleString()}원
                              </p>
                            </div>
                          </div>
                        ))}

                        <div className="bg-slate-900 text-white p-5 rounded-lg mt-6 shadow-lg">
                          <div className="flex justify-between items-center text-lg font-bold">
                            <span>총 결제 금액</span>
                            <span className="text-2xl text-yellow-400">
                              {totalAmount.toLocaleString()}원
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* 구매자 정보 및 결제 폼 */}
              <div className="space-y-6">
                {cart.length > 0 ? (
                  <Card className="border-slate-200 shadow-md">
                    <CardHeader className="bg-slate-50 border-b border-slate-100">
                      <CardTitle className="text-slate-800">구매자 정보</CardTitle>
                      <CardDescription>정확한 배송을 위해 주소를 입력해주세요</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>이름</FormLabel>
                                  <FormControl>
                                    <Input placeholder="홍길동" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>연락처</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="tel"
                                      placeholder="01012345678"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>이메일</FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="example@email.com"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-[1fr_80px] gap-2 items-end">
                            <FormField
                              control={form.control}
                              name="postalCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>주소</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="우편번호"
                                      {...field}
                                      readOnly
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleAddressSearch}
                              className="mb-2" // FormMessage 공간 고려 미세조정 필요시
                            >
                              검색
                            </Button>
                          </div>
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem className="-mt-2">
                                <FormControl>
                                  <Input
                                    placeholder="기본 주소"
                                    {...field}
                                    readOnly
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="addressDetail"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="상세주소 입력"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 text-lg shadow-md mt-6"
                          >
                            결제하기
                          </Button>

                          <p className="text-xs text-muted-foreground text-center mt-2 flex items-center justify-center gap-1">
                            <CreditCard className="w-3 h-3" /> 토스페이먼츠 보안 결제
                          </p>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-8 border rounded-lg bg-slate-50 text-slate-400 border-dashed min-h-[300px]">
                    <CreditCard className="w-16 h-16 mb-4 opacity-30" />
                    <p className="font-semibold text-lg">결제 정보 입력</p>
                    <p className="text-sm mt-1">상품을 먼저 장바구니에 담아주세요</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shipping and Return Policy Section */}
          <div className="mt-20 max-w-4xl mx-auto border-t pt-10">
            <h2 className="text-2xl font-bold text-center mb-8 text-slate-800">배송 및 교환/환불 정책</h2>
            <Accordion type="single" collapsible className="w-full">
              {/* Shipping Information */}
              <AccordionItem value="shipping">
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    배송 안내
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong className="text-foreground">배송 방법:</strong>
                      <span className="text-muted-foreground ml-2">택배 배송 (한진택배)</span>
                    </div>
                    <div>
                      <strong className="text-foreground">배송 지역:</strong>
                      <span className="text-muted-foreground ml-2">전국 지역</span>
                    </div>
                    <div>
                      <strong className="text-foreground">배송 비용:</strong>
                      <span className="text-muted-foreground ml-2">무료 배송 (제주 및 도서 산간 지역은 별도의 추가 금액이 발생할 수 있습니다.)</span>
                    </div>
                    <div>
                      <strong className="text-foreground">배송 기간:</strong>
                      <span className="text-muted-foreground ml-2">결제일로부터 영업일 기준 1일 ~ 3일 이내 발송 (단, 상품 종류 및 배송사 사정에 따라 배송이 다소 지연될 수 있습니다.)</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Exchange and Return Policy */}
              <AccordionItem value="exchange-return">
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    교환 및 반품 안내
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">신청 기간</h4>
                      <ul className="space-y-2 ml-4">
                        <li className="text-muted-foreground">
                          • 단순 변심: 상품 수령일로부터 <strong className="text-foreground">7일 이내</strong> (구매자 반품 배송비 부담)
                        </li>
                        <li className="text-muted-foreground">
                          • 표시/광고와 상이, 상품 하자: 상품 수령 후 <strong className="text-foreground">3개월 이내</strong>, 그 사실을 안 날로부터 <strong className="text-foreground">30일 이내</strong> (판매자 반품 배송비 부담)
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">반품 배송비</h4>
                      <ul className="space-y-2 ml-4">
                        <li className="text-muted-foreground">
                          • 단순 변심으로 인한 교환/반품 시 왕복 배송비(6,000원)는 고객님 부담입니다.
                        </li>
                        <li className="text-muted-foreground">
                          • 상품 불량 및 오배송으로 인한 교환/반품 시 배송비는 업체에서 부담합니다.
                        </li>
                      </ul>
                    </div>
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                      <h4 className="font-semibold text-destructive mb-2">교환 및 반품이 불가능한 경우 (필독)</h4>
                      <ul className="space-y-2 ml-4">
                        <li className="text-sm text-muted-foreground">
                          • 고객님의 책임 사유로 상품이 멸실되거나 훼손된 경우 (단, 상품 내용 확인을 위해 포장 등을 훼손한 경우는 제외)
                        </li>
                        <li className="text-sm text-muted-foreground">
                          • <strong className="text-destructive">사용 흔적이 있는 경우:</strong> 인솔(깔창) 제품 특성상 <strong className="text-destructive">착용 흔적, 오염, 세탁, 수선(가위로 자름 등)</strong>이 발생하여 상품의 가치가 현저히 감소한 경우 교환 및 반품이 절대 불가합니다.
                        </li>
                        <li className="text-sm text-muted-foreground">
                          • 포장이 훼손되어 상품 가치가 상실된 경우 (제품 케이스, 라벨, 택 등이 훼손된 경우)
                        </li>
                        <li className="text-sm text-muted-foreground">
                          • 시간의 경과에 의하여 재판매가 곤란할 정도로 상품 등의 가치가 현저히 감소한 경우
                        </li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Payment and Refund Policy */}
              <AccordionItem value="payment-refund">
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    결제 취소 및 환불 규정
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong className="text-foreground">서비스 제공 기간:</strong>
                      <span className="text-muted-foreground ml-2">본 상품의 서비스 제공 기간은 결제 완료 후 배송이 완료되는 시점까지입니다.</span>
                    </div>
                    <div>
                      <strong className="text-foreground">환불 처리:</strong>
                      <span className="text-muted-foreground ml-2">반품 확인 후 영업일 기준 3~5일 이내 환불 처리됩니다.</span>
                    </div>
                    <div>
                      <strong className="text-foreground">결제 취소:</strong>
                      <span className="text-muted-foreground ml-2">배송 전 결제 취소는 고객센터(010-4002-1094)로 연락 주시면 즉시 처리됩니다.</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>

      {/* 옵션 선택 Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              <div className="flex flex-col gap-1">
                <span className="text-black">{selectedProductData?.name}</span>
                {selectedProductData?.type && (
                  <span className="text-lg font-semibold text-black">
                    ({selectedProductData.type})
                  </span>
                )}
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* 가격 표시 */}
            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">제품 가격</p>
              <p className="text-2xl font-bold text-primary">
                {selectedProductData?.price.toLocaleString()}원
              </p>
            </div>

            {/* 옵션 선택 */}
            <div>
              <label className="block text-sm font-medium mb-2">사이즈</label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger>
                  <SelectValue placeholder="사이즈 선택" />
                </SelectTrigger>
                <SelectContent>
                  {selectedProductData?.options?.sizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">타입</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="타입 선택" />
                </SelectTrigger>
                <SelectContent>
                  {selectedProductData?.options?.types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 수량 선택 */}
            <div>
              <label className="block text-sm font-medium mb-2">수량</label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-xl font-medium w-8 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* 총 금액 */}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">총 금액</span>
                <span className="text-xl font-bold text-primary">
                  {(selectedProductData ? selectedProductData.price * quantity : 0).toLocaleString()}원
                </span>
              </div>
              <Button onClick={addToCart} className="w-full" size="lg">
                장바구니 담기
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Footer />
    </div>
  );
};

export default ProductPage;
