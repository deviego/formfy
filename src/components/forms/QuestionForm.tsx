import { Question, QuestionType } from "@/types/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { QUESTION_TYPES } from "@/utils/constants";

interface QuestionFormProps {
  question: Question;
  onChange: (field: keyof Question, value: string | boolean) => void;
  errors: Record<string, string>;
}

const questionTypes: { value: QuestionType; label: string }[] = QUESTION_TYPES;

export const QuestionForm = ({
  question,
  onChange,
  errors,
}: QuestionFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {question.title ? "Editar Pergunta" : "Nova Pergunta"}
        </CardTitle>
        <CardDescription>Configure os detalhes da pergunta</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="questionTitle" className="mb-2">
            Título da Pergunta *
          </Label>
          <Input
            id="questionTitle"
            value={question.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="Digite o título da pergunta"
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <Label htmlFor="questionGuidance" className="mb-2">
            Orientações para Resposta
          </Label>
          <Textarea
            id="questionGuidance"
            value={question.answerGuidance}
            onChange={(e) => onChange("answerGuidance", e.target.value)}
            placeholder="Instruções opcionais para ajudar na resposta"
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label htmlFor="questionType" className="mb-2">
            Tipo de Pergunta
          </Label>
          <Select
            value={question.questionType}
            onValueChange={(value) => onChange("questionType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {questionTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="required"
            checked={question.required}
            onCheckedChange={(checked) => onChange("required", !!checked)}
          />
          <Label htmlFor="required">Pergunta obrigatória</Label>
        </div>
      </CardContent>
    </Card>
  );
};
