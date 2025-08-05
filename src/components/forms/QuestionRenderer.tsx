import { Question } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface QuestionRendererProps {
  question: Question;
  value: string | string[] | number | boolean | undefined;
  onChange: (value: string | string[] | number | boolean) => void;
  hasError?: boolean;
  errorMessage?: string;
}

export const QuestionRenderer = ({
  question,
  value,
  onChange,
  hasError,
  errorMessage,
}: QuestionRendererProps) => {
  const renderQuestionInput = () => {
    switch (question.questionType) {
      case "yes_no":
        return (
          <RadioGroup
            value={value !== undefined ? String(value) : ""}
            onValueChange={(val) => onChange(val === "true")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id={`${question.id}-yes`} />
              <Label htmlFor={`${question.id}-yes`}>Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id={`${question.id}-no`} />
              <Label htmlFor={`${question.id}-no`}>Não</Label>
            </div>
          </RadioGroup>
        );

      case "single_choice":
        return (
          <RadioGroup
            value={typeof value === "string" ? value : ""}
            onValueChange={(val) => onChange(val)}
          >
            {question.answerOptions?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.answer}
                  id={`${question.id}-${option.id}`}
                />
                <Label htmlFor={`${question.id}-${option.id}`}>
                  {option.answer}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "multiple_choice":
        return (
          <div className="space-y-2">
            {question.answerOptions?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${option.id}`}
                  checked={
                    Array.isArray(value) ? value.includes(option.answer) : false
                  }
                  onCheckedChange={(checked) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    if (checked) {
                      onChange([...currentValues, option.answer]);
                    } else {
                      onChange(
                        currentValues.filter((v: string) => v !== option.answer)
                      );
                    }
                  }}
                />
                <Label htmlFor={`${question.id}-${option.id}`}>
                  {option.answer}
                </Label>
              </div>
            ))}
          </div>
        );

      case "text_free":
        return (
          <Textarea
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Digite sua resposta"
            className={`min-h-[100px] ${hasError ? "border-red-500" : ""}`}
          />
        );

      case "integer":
        return (
          <Input
            type="number"
            step="1"
            value={typeof value === "number" ? value : ""}
            onChange={(e) => onChange(parseInt(e.target.value) || "")}
            placeholder="Digite um número inteiro"
            className={hasError ? "border-red-500" : ""}
          />
        );

      case "decimal_number":
        return (
          <Input
            type="number"
            step="0.01"
            value={typeof value === "number" ? value : ""}
            onChange={(e) => onChange(parseFloat(e.target.value) || "")}
            placeholder="Digite um número decimal"
            className={hasError ? "border-red-500" : ""}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={hasError ? "border border-red-500 rounded-md p-3" : ""}>
      {renderQuestionInput()}
      {hasError && errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};
