export interface AIInsights {
  recomendacion: string;
}

export interface ProductoVendido {
  nombre: string;
  cantidad: number;
}

export interface ComboSugerido {
  nombre: string;
  productos: string[];
  descripcion: string;
}

export interface RecomendacionEstructurada {
  productosMasVendidos: ProductoVendido[];
  productosQuePodrianEscasear: string[];
  sugerenciasEstacionales: string[];
  combosSugeridos: ComboSugerido[];
  conclusiones: string[];
}