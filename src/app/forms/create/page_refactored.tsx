"use client";

import { ArrowLeft, Save, Plus } from "lucide-react";
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
import { useFormCreation } from "@/hooks/useFormCreation";
import { QuestionForm } from "@/components/forms/QuestionForm";
import { AnswerOptionsEditor } from "@/components/forms/AnswerOptionsEditor";
import { useRouter } from "next/navigation";

export default function CreateFormPage() {
  const router = useRouter();
  const {
    form,
    currentQuestion,
    errors,
    questionErrors,
    isSubmitting,
    handleFormChange,
    handleQuestionChange,
    addAnswerOption,
    updateAnswerOption,
    removeAnswerOption,
    addQuestion,
    removeQuestion,
    saveForm,
  } = useFormCreation();

  const needsAnswerOptions =
    currentQuestion.questionType === "multiple_choice" ||
    currentQuestion.questionType === "single_choice";

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Criar Formulário</h1>
            <p className="text-gray-600">Configure seu formulário dinâmico</p>
          </div>
        </div>
        <Button
          onClick={saveForm}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? "Salvando..." : "Salvar Formulário"}
        </Button>
      </div>

      <div className="space-y-8">
        {/* Form Details */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Formulário</CardTitle>
            <CardDescription>
              Informações básicas sobre o formulário
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title" className="mb-2">
                Título do Formulário *
              </Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => handleFormChange("title", e.target.value)}
                placeholder="Digite o título do formulário"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description" className="mb-2">
                Descrição
              </Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
                placeholder="Descrição opcional do formulário"
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="destinationEmail" className="mb-2">
                Email de Destino *
              </Label>
              <Input
                id="destinationEmail"
                type="email"
                value={form.destinationEmail}
                onChange={(e) =>
                  handleFormChange("destinationEmail", e.target.value)
                }
                placeholder="email@exemplo.com"
                className={errors.destinationEmail ? "border-red-500" : ""}
              />
              {errors.destinationEmail && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.destinationEmail}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Question Form */}
        <QuestionForm
          question={currentQuestion}
          onChange={handleQuestionChange}
          errors={questionErrors}
        />

        {/* Answer Options Editor */}
        {needsAnswerOptions && (
          <AnswerOptionsEditor
            options={currentQuestion.answerOptions || []}
            onAdd={addAnswerOption}
            onChange={updateAnswerOption}
            onRemove={removeAnswerOption}
            errors={questionErrors}
          />
        )}

        {/* Add Question Button */}
        <div className="flex justify-center">
          <Button onClick={addQuestion} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {form.title ? "Adicionar Pergunta" : "Criar Pergunta"}
          </Button>
        </div>

        {/* Questions List */}
        {form.questions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                Perguntas do Formulário ({form.questions.length})
              </CardTitle>
              <CardDescription>
                Perguntas que serão exibidas no formulário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {form.questions
                  .sort((a, b) => a.order - b.order)
                  .map((question, index) => (
                    <div
                      key={question.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {index + 1}. {question.title}
                          </span>
                          {question.required && (
                            <span className="text-red-500 text-sm">*</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Tipo: {question.questionType.replace("_", " ")}
                        </p>
                        {question.answerGuidance && (
                          <p className="text-sm text-gray-500 mt-1">
                            {question.answerGuidance}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
