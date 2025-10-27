import { apiClient } from "./apiClient";
import { AIInsights } from "@/domain/models/AIInsights";

export const getAIInsights = async (): Promise<AIInsights> => {
  try {
    const res = await apiClient.get<AIInsights>("/api/ai/insights");
    return res.data;
  } catch (error) {
    console.error("Error obteniendo insights de IA:", error);
    // Mock data en caso de error
    return {
      recomendacion: `### Reporte Estratégico de Ventas Mensuales

#### 1. Productos Más Vendidos
En el mes analizado (Octubre) los productos más vendidos son:
- **Tamal Dulce**: 11 unidades
- **Chocolate Mediano**: 11 unidades  
- **Tamal Nacional**: 2 unidades

**Análisis**: Los Tamales Dulces y el Chocolate Mediano comparten el primer lugar en ventas, lo que indica una alta preferencia por estos productos.

#### 2. Productos que Podrían Escasear
Con base en las cifras, los productos que podrían escasear si la tendencia se mantiene son:
- **Tamal Nacional**: Solo se vendieron 2 unidades, lo que sugiere que podría estar en riesgo de agotarse.

#### 3. Sugerencias Estacionales
**Clima y fechas importantes**:
- **Otoño**: En esta temporada comienzan a preferirse alimentos reconfortantes y dulces.
- **Halloween**: Oportunidad para promocionar productos con enfoque festivo.

#### 4. Posibles Combos Nuevos
- **Combo 1**: Tamal Dulce + Chocolate Mediano
- **Combo 2**: Tamal Nacional + Bebida caliente

### Conclusiones
- Potenciar la promoción de los productos más vendidos es clave para consolidar su popularidad.
- Aprovechar las temporadas y festividades para introducir productos especiales.`
    };
  }
};