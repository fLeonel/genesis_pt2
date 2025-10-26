"use client";

import ComboForm from "@/ui/components/Combos/ComboForm";
import { useParams } from "next/navigation";

export default function EditComboPage() {
  const { id } = useParams();

  if (!id || typeof id !== "string") {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <p className="text-gray-500 text-sm">ID de combo no válido</p>
      </div>
    );
  }

  return <ComboForm mode="edit" comboId={id} />;
}
