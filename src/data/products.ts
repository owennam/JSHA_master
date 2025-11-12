export interface Product {
  id: string;
  name: string;
  type?: string;
  price: number;
  description: string;
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
    description: "",
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
    description: "",
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
    description: "",
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
    description: "",
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
    options: {
      sizes: ["Free"],
      types: ["남성", "여성"]
    }
  },
  {
    id: "aroma-oil",
    name: "아로마오일",
    type: "",
    price: 15000,
    description: "",
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
    options: {
      sizes: ["표준"],
      types: ["기본형"]
    }
  },
  {
    id: "kuronta",
    name: "쿠론타",
    type: "",
    price: 132000,
    description: "",
    options: {
      sizes: ["표준"],
      types: ["기본형"]
    }
  }
];
