import { Card, Title, Text, Badge, Flex, List, ListItem } from "@tremor/react";
import { RecomendacionEstructurada } from "@/domain/models/AIInsights";
import { 
  TrophyIcon, 
  ExclamationTriangleIcon, 
  CalendarDaysIcon, 
  LightBulbIcon, 
  ChartBarIcon,
  SparklesIcon 
} from "@heroicons/react/24/outline";

interface AIInsightsCardProps {
  data: RecomendacionEstructurada;
  isLoading?: boolean;
}

export function AIInsightsCard({ data, isLoading }: AIInsightsCardProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse border-l-4 border-l-gray-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="ml-auto h-6 w-20 bg-gray-200 rounded-full"></div>
            </div>
            <div className="space-y-3">
              <div className="h-16 bg-gray-100 rounded-lg"></div>
              <div className="h-16 bg-gray-100 rounded-lg"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Productos Más Vendidos */}
      <Card className="border-l-4 border-l-emerald-500">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 rounded-lg">
              <TrophyIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <Title className="text-emerald-900">Productos Más Vendidos</Title>
          </div>
          <Badge color="emerald" size="sm">Top Performers</Badge>
        </div>
        <div className="space-y-3">
          {data.productosMasVendidos.map((producto, idx) => (
            <div key={idx} className="flex justify-between items-center p-4 bg-emerald-50 border border-emerald-100 rounded-lg hover:bg-emerald-100 transition-all duration-200 hover:shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <Text className="font-semibold text-emerald-900">{producto.nombre}</Text>
              </div>
              <div className="flex items-center space-x-2">
                <Badge color="emerald">{producto.cantidad} unidades</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Productos que Podrían Escasear */}
      {data.productosQuePodrianEscasear.length > 0 && (
        <Card className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-lg">
                <ExclamationTriangleIcon className="w-6 h-6 text-amber-600" />
              </div>
              <Title className="text-amber-900">Alerta de Inventario</Title>
            </div>
            <Badge color="amber" size="sm">Atención Requerida</Badge>
          </div>
          <div className="space-y-3">
            {data.productosQuePodrianEscasear.map((producto, idx) => (
              <div key={idx} className="flex items-center space-x-3 p-4 bg-amber-50 border border-amber-100 rounded-lg hover:bg-amber-100 transition-all duration-200">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <Text className="font-medium text-amber-900">{producto}</Text>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Sugerencias Estacionales */}
      {data.sugerenciasEstacionales.length > 0 && (
        <Card className="border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                <CalendarDaysIcon className="w-6 h-6 text-blue-600" />
              </div>
              <Title className="text-blue-900">Oportunidades Estacionales</Title>
            </div>
            <Badge color="blue" size="sm">Tendencias</Badge>
          </div>
          <div className="space-y-3">
            {data.sugerenciasEstacionales.map((sugerencia, idx) => (
              <div key={idx} className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <Text className="text-blue-900">{sugerencia}</Text>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Combos Sugeridos */}
      {data.combosSugeridos.length > 0 && (
        <Card className="border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                <LightBulbIcon className="w-6 h-6 text-purple-600" />
              </div>
              <Title className="text-purple-900">Combos Recomendados</Title>
            </div>
            <Badge color="purple" size="sm">Nuevas Ideas</Badge>
          </div>
          <div className="space-y-4">
            {data.combosSugeridos.map((combo, idx) => (
              <div key={idx} className="p-5 bg-purple-50 border border-purple-100 rounded-lg">
                <Text className="font-semibold text-purple-900 mb-2">{combo.nombre}</Text>
                <Text className="text-purple-700 mb-3">{combo.descripcion}</Text>
                <div className="flex flex-wrap gap-2">
                  {combo.productos.map((producto, pidx) => (
                    <Badge key={pidx} color="purple" size="sm">
                      {producto}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Conclusiones */}
      {data.conclusiones.length > 0 && (
        <Card className="border-l-4 border-l-slate-500">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-slate-600" />
              </div>
              <Title className="text-slate-900">Conclusiones Estratégicas</Title>
            </div>
            <Badge color="slate" size="sm">Análisis</Badge>
          </div>
          <div className="space-y-3">
            {data.conclusiones.map((conclusion, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                <Text className="text-slate-900">{conclusion}</Text>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}