"use client";

import { ArrowLeft, Send, Share2 } from "lucide-react";
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
import { useFormResponse } from "@/hooks/useFormResponse";
import { QuestionRenderer } from "@/components/forms/QuestionRenderer";

export default function FormViewPage() {
  const {
    form,
    responses,
    respondentEmail,
    isSubmitting,
    errors,
    loading,
    setRespondentEmail,
    handleResponseChange,
    handleSubmit,
    handleShare,
    router,
  } = useFormResponse();

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-gray-600">Carregando formulário...</p>
        </div>
      </div>
    );
  }

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
              <p className="text-gray-600">{form.description}</p>
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
              <CardContent>
                <QuestionRenderer
                  question={question}
                  value={responses[question.id]}
                  onChange={(value) => handleResponseChange(question.id, value)}
                  hasError={!!errors[question.id]}
                  errorMessage={errors[question.id]}
                />
              </CardContent>
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
