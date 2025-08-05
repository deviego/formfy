"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Send, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Form, FormResponse, Question } from "@/types/form";
import {
  getForm,
  saveResponse,
  generateId,
  generateShareableUrl,
} from "@/lib/storage";

export default function FormViewPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;

  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<
    Record<string, string | string[] | number | boolean>
  >({});
  const [respondentEmail, setRespondentEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (formId) {
      const foundForm = getForm(formId);
      setForm(foundForm);
    }
  }, [formId]);

  const handleResponseChange = (
    questionId: string,
    value: string | string[] | number | boolean
  ) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    // Remove error when user provides a value
    if (
      errors[questionId] &&
      value !== "" &&
      value !== null &&
      value !== undefined
    ) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    if (!form) return;

    // Validate required questions
    const requiredQuestions = form.questions.filter((q) => q.required);
    const missingRequired = requiredQuestions.filter((q) => {
      const response = responses[q.id];
      return (
        !response ||
        (Array.isArray(response) && response.length === 0) ||
        response === ""
      );
    });

    if (missingRequired.length > 0) {
      const newErrors: Record<string, string> = {};
      missingRequired.forEach((q) => {
        newErrors[q.id] = "Este campo é obrigatório";
      });
      setErrors(newErrors);

      toast.error(
        `Por favor, responda todas as perguntas obrigatórias: ${missingRequired.map((q) => q.title).join(", ")}`
      );
      return;
    }

    setIsSubmitting(true);

    const formResponse: FormResponse = {
      id: generateId(),
      formId: form.id,
      respondentEmail: respondentEmail || undefined,
      responseDate: new Date().toISOString(),
      answers: Object.entries(responses).map(([questionId, answer]) => ({
        questionId,
        answer,
      })),
    };

    try {
      // Salvar resposta localmente
      saveResponse(formResponse);

      // Preparar dados para envio por email
      const answersWithTitles = Object.entries(responses).map(
        ([questionId, answer]) => {
          const question = form.questions.find((q) => q.id === questionId);
          return {
            questionTitle: question?.title || "Pergunta",
            answer: answer,
          };
        }
      );

      // Enviar email com as respostas
      const emailResponse = await fetch("/api/send-form-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formTitle: form.title,
          destinationEmail: form.destinationEmail,
          respondentEmail: respondentEmail || null,
          answers: answersWithTitles,
          responseDate: formResponse.responseDate,
        }),
      });

      if (!emailResponse.ok) {
        throw new Error("Erro ao enviar email");
      }

      toast.success(
        "Formulário enviado com sucesso! O responsável receberá suas respostas por email."
      );
      setResponses({});
      setRespondentEmail("");
      setErrors({});
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      toast.error(
        "Erro ao enviar formulário. Suas respostas foram salvas, mas o email pode não ter sido enviado."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    const url = generateShareableUrl(formId);
    navigator.clipboard.writeText(url);
    toast.success("URL do formulário copiada para a área de transferência!");
  };

  const renderQuestion = (question: Question) => {
    const value = responses[question.id];
    const hasError = !!errors[question.id];

    switch (question.questionType) {
      case "yes_no":
        return (
          <div
            className={hasError ? "border border-red-500 rounded-md p-3" : ""}
          >
            <RadioGroup
              value={value !== undefined ? String(value) : ""}
              onValueChange={(val) =>
                handleResponseChange(question.id, val === "true")
              }
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
            {hasError && (
              <p className="text-red-500 text-sm mt-1">{errors[question.id]}</p>
            )}
          </div>
        );

      case "single_choice":
        return (
          <div
            className={hasError ? "border border-red-500 rounded-md p-3" : ""}
          >
            <RadioGroup
              value={typeof value === "string" ? value : ""}
              onValueChange={(val) => handleResponseChange(question.id, val)}
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
            {hasError && (
              <p className="text-red-500 text-sm mt-1">{errors[question.id]}</p>
            )}
          </div>
        );

      case "multiple_choice":
        return (
          <div
            className={hasError ? "border border-red-500 rounded-md p-3" : ""}
          >
            <div className="space-y-2">
              {question.answerOptions?.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.id}-${option.id}`}
                    checked={
                      Array.isArray(value)
                        ? value.includes(option.answer)
                        : false
                    }
                    onCheckedChange={(checked) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      if (checked) {
                        handleResponseChange(question.id, [
                          ...currentValues,
                          option.answer,
                        ]);
                      } else {
                        handleResponseChange(
                          question.id,
                          currentValues.filter(
                            (v: string) => v !== option.answer
                          )
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
            {hasError && (
              <p className="text-red-500 text-sm mt-1">{errors[question.id]}</p>
            )}
          </div>
        );

      case "text_free":
        return (
          <div>
            <Textarea
              value={typeof value === "string" ? value : ""}
              onChange={(e) =>
                handleResponseChange(question.id, e.target.value)
              }
              placeholder="Digite sua resposta"
              className={`min-h-[100px] ${hasError ? "border-red-500" : ""}`}
            />
            {hasError && (
              <p className="text-red-500 text-sm mt-1">{errors[question.id]}</p>
            )}
          </div>
        );

      case "integer":
        return (
          <div>
            <Input
              type="number"
              step="1"
              value={typeof value === "number" ? value : ""}
              onChange={(e) =>
                handleResponseChange(
                  question.id,
                  parseInt(e.target.value) || ""
                )
              }
              placeholder="Digite um número inteiro"
              className={hasError ? "border-red-500" : ""}
            />
            {hasError && (
              <p className="text-red-500 text-sm mt-1">{errors[question.id]}</p>
            )}
          </div>
        );

      case "decimal_number":
        return (
          <div>
            <Input
              type="number"
              step="0.01"
              value={typeof value === "number" ? value : ""}
              onChange={(e) =>
                handleResponseChange(
                  question.id,
                  parseFloat(e.target.value) || ""
                )
              }
              placeholder="Digite um número decimal"
              className={hasError ? "border-red-500" : ""}
            />
            {hasError && (
              <p className="text-red-500 text-sm mt-1">{errors[question.id]}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!form) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Formulário não encontrado</h1>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-10">
          <Button variant="outline" onClick={() => router.push("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{form.title}</h1>
            {form.description && (
              <p className="text-gray-600 ">{form.description}</p>
            )}
          </div>
        </div>
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="w-4 h-4 mr-2" />
          Compartilhar
        </Button>
      </div>

      <div className="space-y-6">
        {/* Respondent Email */}
        <Card>
          <CardHeader>
            <CardTitle>Suas Informações</CardTitle>
            <CardDescription>
              Opcional: Forneça seu e-mail para acompanhamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="respondentEmail" className="mb-2">
              Endereço de E-mail
            </Label>
            <Input
              id="respondentEmail"
              type="email"
              value={respondentEmail}
              onChange={(e) => setRespondentEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
            />
          </CardContent>
        </Card>

        {/* Questions */}
        {form.questions
          .sort((a, b) => a.order - b.order)
          .map((question) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {question.title}
                      {question.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </CardTitle>
                    {question.answerGuidance && (
                      <CardDescription className="mt-2">
                        {question.answerGuidance}
                      </CardDescription>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{question.order}</div>
                </div>
              </CardHeader>
              <CardContent>{renderQuestion(question)}</CardContent>
            </Card>
          ))}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? "Enviando..." : "Enviar Formulário"}
          </Button>
        </div>
      </div>
    </div>
  );
}
