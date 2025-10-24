import Link from "next/link";
import { styleClasses } from "../theme/designSystem";

interface Props {
  name: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
  color?: string;
}

export default function ModuleCard({ name, description, href, icon, color = "bg-white" }: Props) {
  return (
    <Link
      href={href}
      className={`${color} border-2 rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 group w-full h-48`}
    >
      <div className="p-4 bg-white rounded-full shadow-sm group-hover:shadow-md transition-shadow mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </Link>
  );
}
