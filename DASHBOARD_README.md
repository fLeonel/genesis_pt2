# 🚀 Dashboard de Ventas - Cazuela Chapina

## ✨ Nuevas Características

### 🎯 **Dashboard Mejorado**
- **UI/UX Completamente Rediseñado**: Interfaz moderna con gradientes y micro-interacciones
- **KPIs con Iconos**: Métricas visuales con iconos de Heroicons y colores temáticos
- **Datos Resilientes**: Sistema de fallback con datos mock si la API no está disponible
- **Loading States**: Skeletons de carga profesionales
- **Responsive Design**: Adaptable a todas las pantallas

### 🤖 **GENESIS AI Integration**
- **Motor de IA**: Análisis inteligente de patrones de venta
- **Recomendaciones**: Insights automáticos para optimizar el negocio
- **Parser Inteligente**: Convierte respuestas de markdown a componentes visuales
- **Branding Consistente**: Diseño profesional para la marca GENESIS

## 🎨 **Mejoras de Diseño**

### **KPIs Cards**
- **Ventas Diarias**: Gradiente verde con icono de moneda
- **Ventas Mensuales**: Gradiente azul con icono de tendencia
- **Utilidad Total**: Gradiente púrpura con icono de gráfico
- **Desperdicio**: Gradiente ámbar/rojo dependiendo del valor

### **Gráficos Interactivos**
- **Ventas por Horario**: Chart de barras con formateo de moneda
- **Preferencias de Picante**: Donut chart con porcentajes
- **Productos Más Vendidos**: Bar chart con unidades vendidas

### **GENESIS AI Panel**
- **Header Elegante**: Gradiente púrpura-azul con branding
- **Cards Temáticas**: Cada insight con su color y icono único
- **Estados de Carga**: Animaciones y feedback visual

## 🛠 **Estructura Técnica**

### **Archivos Principales**
```
app/
├── pages/ventas/dashboard/page.tsx         # Dashboard principal
├── ui/components/IA/AIInsightsCard.tsx     # Componente de IA
├── domain/models/AIInsights.ts             # Tipos de datos
├── infrastructure/http/aiRepo.ts           # API de IA
├── application/useCases/IA/               # Lógica de negocio
└── config/mockData.ts                     # Datos de fallback
```

### **Dependencias**
- **Tremor React**: Componentes de dashboard
- **Heroicons**: Iconografía profesional
- **Tailwind CSS**: Estilos y gradientes
- **Next.js**: Framework base

## 🚀 **Cómo Usar**

1. **Iniciar Desarrollo**:
   ```bash
   bun run dev
   ```

2. **Acceder al Dashboard**:
   ```
   http://localhost:3000/pages/ventas/dashboard
   ```

3. **API Backend** (opcional):
   ```
   http://localhost:5009/api/dashboard
   http://localhost:5009/api/ai/insights
   ```

## 📊 **Datos Mock**

Si la API no está disponible, el sistema usa automáticamente datos de demostración:
- Ventas diarias: Q2,350
- Ventas mensuales: Q58,750
- Utilidad: Q18,500
- Desperdicio: 3.2%
- 13 puntos de datos por horario
- 5 productos más vendidos
- Proporción picante/no picante

## 🎯 **Próximas Mejoras**

- [ ] Dashboard en tiempo real con WebSockets
- [ ] Más insights de GENESIS AI
- [ ] Filtros de fecha personalizables
- [ ] Exportación de reportes
- [ ] Notificaciones inteligentes
- [ ] Comparativas históricas

---

**Desarrollado para Cazuela Chapina 🇬🇹**  
*Powered by GENESIS AI*