export interface Product {
  id: string;
  name: string;
  type?: string;
  price: number;
  description: string;
  image?: string;
  isActive: boolean; // For hiding products during approval
  options: {
    sizes: string[];
    types: string[];
  };
}

export const products: Product[] = [
  {
    id: "male-silicon-basic",
    name: "남성 실리콘 인솔",
    type: "기본형",
    price: 9900,
    description: "특허받은 척추측만증 교정용 JS Insole",
    image: "/images/products/insole-main.png",
    isActive: true,
    options: {
      sizes: ["6mm", "8mm", "11mm", "15mm", "18mm"],
      types: ["기본형"]
    }
  },
  {
    id: "male-silicon-angle",
    name: "남성 실리콘 인솔",
    type: "각도형",
    price: 9900,
    description: "특허받은 척추측만증 교정용 JS Insole",
    image: "/images/products/insole-main.png",
    isActive: true,
    options: {
      sizes: ["표준"],
      types: [
        "6mm 각도 (좌측우측 각1개 2개 1세트)",
        "6mm 각도 (좌측 2개 1세트)",
        "6mm 각도 (우측 2개 1세트)",
        "11mm 각도 좌측",
        "11mm 각도 우측"
      ]
    }
  },
  {
    id: "female-silicon-basic",
    name: "여성 실리콘 인솔",
    type: "기본형",
    price: 9900,
    description: "특허받은 척추측만증 교정용 JS Insole",
    image: "/images/products/insole-main.png",
    isActive: true,
    options: {
      sizes: ["5mm", "7mm", "10mm", "13mm", "16mm"],
      types: ["기본형"]
    }
  },
  {
    id: "female-silicon-angle",
    name: "여성 실리콘 인솔",
    type: "각도형",
    price: 9900,
    description: "특허받은 척추측만증 교정용 JS Insole",
    image: "/images/products/insole-main.png",
    isActive: true,
    options: {
      sizes: ["표준"],
      types: [
        "5mm 각도 (좌측우측 각1개 2개 1세트)",
        "5mm 각도 (좌측 2개 1세트)",
        "5mm 각도 (우측 2개 1세트)",
        "10mm 각도 좌측",
        "10mm 각도 우측"
      ]
    }
  },
  {
    id: "socks",
    name: "양말",
    type: "",
    price: 2200,
    description: "",
    image: "/images/products/socks.jpg",
    isActive: true, // Now active
    options: {
      sizes: ["Free"],
      types: ["남성", "여성"]
    }
  },
  {
    id: "aroma-oil",
    name: "바로마오일",
    type: "",
    price: 15000,
    description: "균형있는 신체 밸런스를 위한 발마사지 오일",
    image: "/images/products/baroma_oil.png",
    isActive: true, // Now active
    options: {
      sizes: ["10ml"],
      types: ["기본형"]
    }
  },
  {
    id: "healing-max",
    name: "힐링맥스",
    type: "",
    price: 99000,
    description: "",
    image: "/images/products/healing_max.jpg",
    isActive: true, // Now active
    options: {
      sizes: ["표준"],
      types: ["기본형"]
    }
  },
  {
    id: "kuronta",
    name: "쿠룬타",
    type: "",
    price: 132000,
    description: "중형 사이즈 쿠룬타 (가로 430mm x 세로 760mm x 높이 160mm)",
    image: "/images/products/kurunta.png",
    isActive: true, // Now active
    options: {
      sizes: ["표준"],
      types: ["기본형"]
    }
  }
];

// Export only active products
export const activeProducts = products.filter(p => p.isActive);

