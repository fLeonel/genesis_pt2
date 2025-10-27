import { RecomendacionEstructurada, ProductoVendido, ComboSugerido } from "@/domain/models/AIInsights";

export const parseAIRecomendacion = (recomendacion: string): RecomendacionEstructurada => {
  const lineas = recomendacion.split('\n').filter(l => l.trim());
  
  const productosMasVendidos: ProductoVendido[] = [];
  const productosQuePodrianEscasear: string[] = [];
  const sugerenciasEstacionales: string[] = [];
  const combosSugeridos: ComboSugerido[] = [];
  const conclusiones: string[] = [];

  let seccionActual = '';
  
  for (const linea of lineas) {
    const lineaTrim = linea.trim();
    
    // Detectar secciones
    if (lineaTrim.includes('Productos Más Vendidos')) {
      seccionActual = 'productos-vendidos';
      continue;
    } else if (lineaTrim.includes('Productos que Podrían Escasear')) {
      seccionActual = 'productos-escasear';
      continue;
    } else if (lineaTrim.includes('Sugerencias Estacionales')) {
      seccionActual = 'sugerencias-estacionales';
      continue;
    } else if (lineaTrim.includes('Posibles Combos') || lineaTrim.includes('Combos Nuevos')) {
      seccionActual = 'combos';
      continue;
    } else if (lineaTrim.includes('Conclusiones')) {
      seccionActual = 'conclusiones';
      continue;
    }

    // Parsear contenido por sección
    if (lineaTrim.startsWith('- **') && seccionActual === 'productos-vendidos') {
      const match = lineaTrim.match(/- \*\*(.+?)\*\*:\s*(\d+)\s*unidades?/);
      if (match) {
        productosMasVendidos.push({
          nombre: match[1],
          cantidad: parseInt(match[2])
        });
      }
    } else if (lineaTrim.startsWith('- **') && seccionActual === 'productos-escasear') {
      const match = lineaTrim.match(/- \*\*(.+?)\*\*/);
      if (match) {
        productosQuePodrianEscasear.push(match[1]);
      }
    } else if ((lineaTrim.startsWith('- **') || lineaTrim.startsWith('-')) && seccionActual === 'sugerencias-estacionales') {
      const texto = lineaTrim.replace(/^- ?\*\*.*?\*\*:?/, '').trim();
      if (texto) {
        sugerenciasEstacionales.push(texto);
      }
    } else if (lineaTrim.startsWith('- **Combo') && seccionActual === 'combos') {
      const match = lineaTrim.match(/- \*\*Combo \d+\*\*:\s*(.+)/);
      if (match) {
        const descripcion = match[1];
        const productos = descripcion.split('+').map(p => p.trim());
        combosSugeridos.push({
          nombre: `Combo ${combosSugeridos.length + 1}`,
          productos,
          descripcion
        });
      }
    } else if (lineaTrim.startsWith('- ') && seccionActual === 'conclusiones') {
      conclusiones.push(lineaTrim.replace('- ', ''));
    }
  }

  return {
    productosMasVendidos,
    productosQuePodrianEscasear,
    sugerenciasEstacionales,
    combosSugeridos,
    conclusiones
  };
};