import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Plus } from "lucide-react";
import Link from "next/link";

export const EmptyFormsState = () => {
  return (
    <Card className="text-center py-16">
      <CardContent>
        <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nenhum formulário ainda</h3>
        <p className="text-gray-600 mb-4">
          Crie seu primeiro formulário dinâmico para começar
        </p>
        <Link href="/forms/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Criar Formulário
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
