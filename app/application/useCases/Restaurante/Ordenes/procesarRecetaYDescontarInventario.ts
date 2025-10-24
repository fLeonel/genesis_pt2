import { OrdenDetalle } from "../../../../domain/models/OrdenRestaurante";
import { Receta } from "../../../../domain/models/Receta";
import { Producto } from "../../../../domain/models/Productos";
import { InventarioMovimiento } from "../../../../domain/models/InventarioMovimiento";

interface ProcesarRecetaResult {
  success: boolean;
  inventarioMovimientos: InventarioMovimiento[];
  errores?: string[];
}

export async function procesarRecetaYDescontarInventario(
  ordenDetalle: OrdenDetalle,
  ordenId: string
): Promise<ProcesarRecetaResult> {
  try {
    // 1. Obtener el producto y su receta
    const responseProducto = await fetch(
      `/api/productos/${ordenDetalle.itemId}`
    );
    if (!responseProducto.ok) {
      throw new Error("Error al obtener el producto");
    }
    const producto: Producto = await responseProducto.json();

    if (!producto.receta) {
      throw new Error("El producto no tiene una receta asociada");
    }

    // 2. Obtener la receta completa con sus detalles
    const responseReceta = await fetch(`/api/recetas/${producto.receta.id}`);
    if (!responseReceta.ok) {
      throw new Error("Error al obtener la receta");
    }
    const receta: Receta = await responseReceta.json();

    // 3. Verificar disponibilidad de ingredientes
    const errores: string[] = [];
    const movimientos: InventarioMovimiento[] = [];

    for (const detalle of receta.detalles) {
      const cantidadNecesaria =
        detalle.cantidadRequerida * ordenDetalle.cantidad;

      // Obtener el producto ingrediente
      const responseIngrediente = await fetch(
        `/api/productos/${detalle.productoIngredienteId}`
      );
      if (!responseIngrediente.ok) {
        errores.push(
          `Error al obtener el ingrediente ${detalle.productoIngredienteId}`
        );
        continue;
      }

      const ingrediente: Producto = await responseIngrediente.json();

      if (ingrediente.cantidadDisponible < cantidadNecesaria) {
        errores.push(
          `Inventario insuficiente para ${ingrediente.nombre}. Disponible: ${ingrediente.cantidadDisponible}, Necesario: ${cantidadNecesaria}`
        );
        continue;
      }

      // Preparar el movimiento de inventario
      movimientos.push({
        id: `${ordenId}-${detalle.id}-${Date.now()}`,
        productoId: detalle.productoIngredienteId,
        ordenId,
        recetaId: receta.id,
        cantidadUtilizada: cantidadNecesaria,
        cantidadAnterior: ingrediente.cantidadDisponible,
        cantidadNueva: ingrediente.cantidadDisponible - cantidadNecesaria,
        motivo: `Producción de ${producto.nombre} - Orden ${ordenId}`,
      });
    }

    if (errores.length > 0) {
      return {
        success: false,
        inventarioMovimientos: [],
        errores,
      };
    }

    // 4. Ejecutar los descuentos de inventario
    const movimientosEjecutados: InventarioMovimiento[] = [];

    for (const movimiento of movimientos) {
      const response = await fetch("/api/inventario/movimientos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movimiento),
      });

      if (!response.ok) {
        throw new Error(
          `Error al registrar movimiento de inventario para producto ${movimiento.productoId}`
        );
      }

      const movimientoCreado = await response.json();
      movimientosEjecutados.push(movimientoCreado);
    }

    return {
      success: true,
      inventarioMovimientos: movimientosEjecutados,
    };
  } catch (error) {
    console.error("Error al procesar receta y descontar inventario:", error);
    return {
      success: false,
      inventarioMovimientos: [],
      errores: [error instanceof Error ? error.message : "Error desconocido"],
    };
  }
}
