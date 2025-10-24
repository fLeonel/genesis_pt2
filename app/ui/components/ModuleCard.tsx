import Link from "next/link";

interface Props {
  name: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
}

export default function ModuleCard({ name, description, href, icon }: Props) {
  return (
    <Link
      href={href}
      className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:scale-[1.03] transition-transform w-48 h-48"
    >
      <div className="mb-4 opacity-80">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
      <p className="text-xs text-gray-500 mt-1 leading-tight">{description}</p>
    </Link>
  );
}
