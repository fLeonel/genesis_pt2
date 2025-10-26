export interface ComboProducto {
  productoId: string;
  cantidad: number;
}

export interface Combo {
  id?: string;
  nombre: string;
  descripcion?: string;
  precioTotal: number;
  productos: ComboProducto[];
}
