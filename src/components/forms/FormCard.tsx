import { Form } from "@/types/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Share2, Trash2 } from "lucide-react";
import Link from "next/link";

interface FormCardProps {
  form: Form;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
}

export const FormCard = ({ form, onDelete, onShare }: FormCardProps) => {
  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir este formulário?")) {
      onDelete(form.id);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{form.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {form.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-600 mb-4">
          <p>
            {form.questions.length}{" "}
            {form.questions.length === 1 ? "pergunta" : "perguntas"}
          </p>
          <p>Destino: {form.destinationEmail}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/forms/${form.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="w-4 h-4 mr-2" />
              Visualizar
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onShare(form.id)}
            title="Compartilhar formulário"
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700"
            title="Excluir formulário"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
