import { AnswerOption } from "@/types/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface AnswerOptionsEditorProps {
  options: AnswerOption[];
  onAdd: () => void;
  onChange: (
    index: number,
    field: keyof AnswerOption,
    value: string | boolean | number
  ) => void;
  onRemove: (index: number) => void;
  errors: Record<string, string>;
}

export const AnswerOptionsEditor = ({
  options,
  onAdd,
  onChange,
  onRemove,
  errors,
}: AnswerOptionsEditorProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Opções de Resposta</CardTitle>
        <Button variant="outline" size="sm" onClick={onAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Opção
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {options.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nenhuma opção adicionada. Clique em &quot;Adicionar Opção&quot; para
            começar.
          </p>
        ) : (
          options.map((option, index) => (
            <div key={option.id} className="flex gap-2 items-center">
              <div className="flex-1">
                <Input
                  value={option.answer}
                  onChange={(e) => onChange(index, "answer", e.target.value)}
                  placeholder={`Opção ${index + 1}`}
                  className={errors.answerOptions ? "border-red-500" : ""}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemove(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
        {errors.answerOptions && (
          <p className="text-red-500 text-sm mt-1">{errors.answerOptions}</p>
        )}
      </CardContent>
    </Card>
  );
};
