"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Title,
  Metric,
  Text,
  BarChart,
  DonutChart,
  Grid,
  Flex,
  Badge,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@tremor/react";
import { 
  ChartBarIcon, 
  SparklesIcon, 
  CpuChipIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import { AIInsightsCard } from "@/ui/components/IA/AIInsightsCard";
import { getAIInsights } from "@/infrastructure/http/aiRepo";
import { parseAIRecomendacion } from "@/application/useCases/IA/parseAIRecomendacion";
import { AIInsights, RecomendacionEstructurada } from "@/domain/models/AIInsights";
import { mockDashboardData } from "@/config/mockData";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [aiInsights, setAiInsights] = useState<RecomendacionEstructurada | null>(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cargar datos del dashboard
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5009/api/dashboard");
        if (response.ok) {
          const dashboardData = await response.json();
          setData(dashboardData);
        } else {
          // Usar datos mock si la API falla
          console.log("API no disponible, usando datos mock");
          setData(mockDashboardData);
        }
      } catch (error) {
        console.error("Error cargando dashboard:", error);
        setData(mockDashboardData);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();

    // Cargar insights de IA
    const loadAIInsights = async () => {
      try {
        setAiLoading(true);
        const insights = await getAIInsights();
        const parsedData = parseAIRecomendacion(insights.recomendacion);
        setAiInsights(parsedData);
      } catch (error) {
        console.error("Error cargando insights de IA:", error);
      } finally {
        setAiLoading(false);
      }
    };

    loadAIInsights();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const dashboard = {
    ventasDiarias: Math.max(0, data.ventasDiarias ?? 0),
    ventasMensuales: Math.max(0, data.ventasMensuales ?? 0),
    utilidadTotal: Math.max(0, data.utilidadTotal ?? 0),
    desperdicioMateriaPrima: data.desperdicioMateriaPrima ?? 0,
    bebidasPorHorario: (data.bebidasPorHorario ?? []).sort(
      (a: any, b: any) => parseInt(a.hora) - parseInt(b.hora),
    ),
    tamalesMasVendidos: (data.tamalesMasVendidos ?? []).slice(0, 5),
    proporcionPicante: data.proporcionPicante ?? { picante: 0, noPicante: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Title className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard de Ventas
              </Title>
              <Text className="text-gray-600 mt-2 text-lg">
                Cazuela Chapina — Resumen ejecutivo
              </Text>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <Text className="text-green-600 font-medium">En vivo</Text>
            </div>
          </div>
        </div>

        <TabGroup>
          <TabList className="grid w-full grid-cols-2 bg-white rounded-xl p-2 shadow-sm border">
            <Tab className="flex items-center justify-center space-x-3 py-3 px-6 rounded-lg transition-all duration-200">
              <ChartBarIcon className="w-5 h-5" />
              <span className="font-medium">Métricas</span>
            </Tab>
            <Tab className="flex items-center justify-center space-x-3 py-3 px-6 rounded-lg transition-all duration-200">
              <SparklesIcon className="w-5 h-5" />
              <span className="font-medium">GENESIS AI</span>
            </Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel className="mt-8">
              <div className="space-y-8">
                {/* KPIs Grid */}
                <Grid numItemsSm={2} numItemsLg={4} className="gap-6">
                  <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <Text className="text-emerald-100">Ventas Diarias</Text>
                        <Metric className="text-white text-3xl font-bold">
                          Q{dashboard.ventasDiarias.toLocaleString()}
                        </Metric>
                      </div>
                      <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-lg">
                        <CurrencyDollarIcon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <Text className="text-blue-100">Ventas Mensuales</Text>
                        <Metric className="text-white text-3xl font-bold">
                          Q{dashboard.ventasMensuales.toLocaleString()}
                        </Metric>
                      </div>
                      <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-lg">
                        <ArrowTrendingUpIcon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <Text className="text-purple-100">Utilidad Total</Text>
                        <Metric className="text-white text-3xl font-bold">
                          Q{dashboard.utilidadTotal.toLocaleString()}
                        </Metric>
                      </div>
                      <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-lg">
                        <ChartBarIcon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </Card>

                  <Card className={`bg-gradient-to-br border-0 shadow-lg ${
                    dashboard.desperdicioMateriaPrima > 5 
                      ? 'from-red-500 to-red-600' 
                      : 'from-amber-500 to-amber-600'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <Text className="text-white opacity-90">Desperdicio</Text>
                        <Metric className="text-white text-3xl font-bold">
                          {dashboard.desperdicioMateriaPrima.toFixed(1)}%
                        </Metric>
                      </div>
                      <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-lg">
                        <ExclamationTriangleIcon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </Card>
                </Grid>

                {/* Charts Grid */}
                <Grid numItemsSm={1} numItemsLg={2} className="gap-8">
                  <Card className="shadow-lg border-0 bg-white">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                          <ClockIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <Title className="text-xl font-semibold text-gray-800">Ventas por Horario</Title>
                      </div>
                      <Badge color="blue" size="sm">Hoy</Badge>
                    </div>
                    <BarChart
                      className="mt-4 h-64"
                      data={dashboard.bebidasPorHorario}
                      index="hora"
                      categories={["ventas"]}
                      colors={["blue"]}
                      valueFormatter={(number: number) => `Q${number.toLocaleString()}`}
                    />
                  </Card>

                  <Card className="shadow-lg border-0 bg-white">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-lg">
                        <ChartBarIcon className="w-6 h-6 text-emerald-600" />
                      </div>
                      <Title className="text-xl font-semibold text-gray-800">Preferencias de Picante</Title>
                    </div>
                    <DonutChart
                      className="mt-4 h-64"
                      data={[
                        { tipo: "Picante", valor: dashboard.proporcionPicante.picante },
                        { tipo: "No Picante", valor: dashboard.proporcionPicante.noPicante },
                      ]}
                      category="valor"
                      index="tipo"
                      colors={["red", "emerald"]}
                      valueFormatter={(number: number) => `${number}%`}
                    />
                  </Card>
                </Grid>

                {/* Top Products */}
                <Card className="shadow-lg border-0 bg-white">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-lg">
                      <ArrowTrendingUpIcon className="w-6 h-6 text-amber-600" />
                    </div>
                    <Title className="text-xl font-semibold text-gray-800">Productos Más Vendidos</Title>
                  </div>
                  <BarChart
                    className="mt-4 h-80"
                    data={dashboard.tamalesMasVendidos}
                    index="nombre"
                    categories={["cantidad"]}
                    colors={["amber"]}
                    valueFormatter={(number: number) => `${number} unidades`}
                  />
                </Card>
              </div>
            </TabPanel>

            <TabPanel className="mt-8">
              <div className="space-y-8">
                {/* GENESIS AI Header */}
                <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                        <CpuChipIcon className="w-10 h-10" />
                      </div>
                      <div>
                        <Title className="text-white text-3xl font-bold mb-2">GENESIS AI</Title>
                        <Text className="text-purple-100 text-lg">
                          Análisis Inteligente • Insights de Ventas • Recomendaciones Estratégicas
                        </Text>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge color="black" size="lg" className="mb-2 rounded-full w-auto">Inteligencia Artificial</Badge>
                      <div className="flex items-center space-x-2 justify-end">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <Text className="text-purple-100 text-sm">Análisis en tiempo real</Text>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* AI Content */}
                {aiInsights ? (
                  <AIInsightsCard data={aiInsights} isLoading={aiLoading} />
                ) : (
                  <Card className="text-center p-16 bg-gradient-to-br from-gray-50 to-gray-100 border-0 shadow-lg">
                    <div className="flex flex-col items-center space-y-6">
                      <div className="relative">
                        <div className="flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full">
                          <CpuChipIcon className="w-10 h-10 text-purple-600 color:blacks" />
                        </div>
                        {aiLoading && (
                          <div className="absolute -inset-2 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                        )}
                      </div>
                      <div className="text-center max-w-md">
                        <Title className="text-gray-800 mb-3 text-2xl">
                          {aiLoading ? "GENESIS está procesando datos..." : "Error de conexión con GENESIS"}
                        </Title>
                        <Text className="text-gray-500 text-lg leading-relaxed">
                          {aiLoading 
                            ? "Nuestro motor de inteligencia artificial está analizando patrones de venta, tendencias de mercado y generando recomendaciones personalizadas para tu negocio."
                            : "No se pudo establecer conexión con el motor de IA. Verifica tu conexión y vuelve a intentar."
                          }
                        </Text>
                      </div>
                      {!aiLoading && (
                        <button 
                          onClick={() => window.location.reload()} 
                          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                        >
                          Reintentar
                        </button>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
