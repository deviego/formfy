import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Form, FormResponse } from "@/types/form";
import { FormService } from "@/services/formService";
import { FormValidator } from "@/utils/validation";
import { generateId } from "@/lib/storage";
import { toast } from "sonner";

export const useFormResponse = () => {
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadForm = async () => {
      if (formId) {
        try {
          const foundForm = await FormService.getForm(formId);
          setForm(foundForm);
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Erro ao carregar formulário";
          toast.error(errorMessage);
        } finally {
          setLoading(false);
        }
      }
    };

    loadForm();
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

    // Validate responses
    const validationErrors = FormValidator.validateFormResponse(
      form.questions,
      responses
    );

    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((error) => {
        errorMap[error.field] = error.message;
      });
      setErrors(errorMap);

      const missingQuestions = validationErrors.map((error) => {
        const question = form.questions.find((q) => q.id === error.field);
        return question?.title || "Pergunta";
      });

      toast.error(
        `Por favor, responda todas as perguntas obrigatórias: ${missingQuestions.join(", ")}`
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
      // Save response locally
      await FormService.saveResponse(formResponse);

      // Prepare data for email
      const answersWithTitles = Object.entries(responses).map(
        ([questionId, answer]) => {
          const question = form.questions.find((q) => q.id === questionId);
          return {
            questionTitle: question?.title || "Pergunta",
            answer: answer,
          };
        }
      );

      // Send email with responses
      await FormService.sendFormResponse({
        formTitle: form.title,
        destinationEmail: form.destinationEmail,
        respondentEmail: respondentEmail || undefined,
        answers: answersWithTitles,
        responseDate: formResponse.responseDate,
      });

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
    try {
      const url = FormService.generateShareableUrl(formId);
      navigator.clipboard.writeText(url);
      toast.success("URL do formulário copiada para a área de transferência!");
    } catch {
      toast.error("Erro ao copiar URL");
    }
  };

  return {
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
  };
};
