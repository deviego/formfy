"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForms } from "@/hooks/useForms";
import { FormCard } from "@/components/forms/FormCard";
import { EmptyFormsState } from "@/components/forms/EmptyFormsState";
import Link from "next/link";

export default function HomePage() {
  const { forms, loading, deleteForm, shareForm } = useForms();

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-gray-600">Carregando formulários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">FormFy</h1>
          <p className="text-gray-600 mt-2">
            Crie e gerencie formulários dinâmicos
          </p>
        </div>
        <Link href="/forms/create">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Formulário
          </Button>
        </Link>
      </div>

      {forms.length === 0 ? (
        <EmptyFormsState />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <FormCard
              key={form.id}
              form={form}
              onDelete={deleteForm}
              onShare={shareForm}
            />
          ))}
        </div>
      )}
    </div>
  );
}
