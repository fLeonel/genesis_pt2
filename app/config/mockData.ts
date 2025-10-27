// Datos de prueba para el dashboard
// Estos son los datos que se mostrarán si la API no está disponible

export const mockDashboardData = {
  ventasDiarias: 2350,
  ventasMensuales: 58750,
  utilidadTotal: 18500,
  desperdicioMateriaPrima: 3.2,
  bebidasPorHorario: [
    { hora: "08", ventas: 120 },
    { hora: "09", ventas: 180 },
    { hora: "10", ventas: 220 },
    { hora: "11", ventas: 280 },
    { hora: "12", ventas: 450 },
    { hora: "13", ventas: 520 },
    { hora: "14", ventas: 380 },
    { hora: "15", ventas: 290 },
    { hora: "16", ventas: 340 },
    { hora: "17", ventas: 410 },
    { hora: "18", ventas: 480 },
    { hora: "19", ventas: 360 },
    { hora: "20", ventas: 280 },
  ],
  tamalesMasVendidos: [
    { nombre: "Tamal Dulce", cantidad: 85 },
    { nombre: "Tamal de Pollo", cantidad: 72 },
    { nombre: "Tamal de Cerdo", cantidad: 58 },
    { nombre: "Tamal Vegetariano", cantidad: 35 },
    { nombre: "Tamal de Queso", cantidad: 28 },
  ],
  proporcionPicante: { picante: 42, noPicante: 58 },
};