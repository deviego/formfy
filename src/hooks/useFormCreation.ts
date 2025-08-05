import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Question, AnswerOption } from "@/types/form";
import { FormService } from "@/services/formService";
import { FormValidator } from "@/utils/validation";
import { generateId, generateQuestionCode } from "@/lib/storage";
import { toast } from "sonner";

export const useFormCreation = () => {
  const router = useRouter();

  const [form, setForm] = useState<Form>({
    id: generateId(),
    title: "",
    description: "",
    order: 1,
    destinationEmail: "",
    questions: [],
  });

  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: generateId(),
    formId: form.id,
    title: "",
    code: "",
    answerGuidance: "",
    order: 1,
    required: false,
    subQuestion: false,
    questionType: "text_free",
    answerOptions: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [questionErrors, setQuestionErrors] = useState<Record<string, string>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormChange = (field: keyof Form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (errors[field] && value.trim()) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleQuestionChange = (
    field: keyof Question,
    value: string | boolean
  ) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "title" && typeof value === "string"
        ? { code: generateQuestionCode(value) }
        : {}),
    }));

    if (questionErrors[field] && value && value !== "") {
      setQuestionErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const addAnswerOption = () => {
    const newOption: AnswerOption = {
      id: generateId(),
      questionId: currentQuestion.id,
      answer: "",
      order: (currentQuestion.answerOptions?.length || 0) + 1,
      openAnswer: false,
    };

    setCurrentQuestion((prev) => ({
      ...prev,
      answerOptions: [...(prev.answerOptions || []), newOption],
    }));
  };

  const updateAnswerOption = (
    index: number,
    field: keyof AnswerOption,
    value: string | boolean | number
  ) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      answerOptions: prev.answerOptions?.map((option, i) =>
        i === index ? { ...option, [field]: value } : option
      ),
    }));
  };

  const removeAnswerOption = (index: number) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      answerOptions: prev.answerOptions?.filter((_, i) => i !== index),
    }));
  };

  const addQuestion = () => {
    const validationErrors = FormValidator.validateQuestion(currentQuestion);

    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((error) => {
        errorMap[error.field] = error.message;
      });
      setQuestionErrors(errorMap);
      toast.error("Por favor, corrija os erros na pergunta");
      return;
    }

    const questionToAdd = {
      ...currentQuestion,
      order: form.questions.length + 1,
    };

    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, questionToAdd],
    }));

    // Reset current question
    setCurrentQuestion({
      id: generateId(),
      formId: form.id,
      title: "",
      code: "",
      answerGuidance: "",
      order: form.questions.length + 2,
      required: false,
      subQuestion: false,
      questionType: "text_free",
      answerOptions: [],
    });

    setQuestionErrors({});
    toast.success("Pergunta adicionada com sucesso!");
  };

  const removeQuestion = (questionId: string) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
    toast.success("Pergunta removida com sucesso!");
  };

  const saveForm = async () => {
    const validationErrors = FormValidator.validateForm(form);

    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((error) => {
        errorMap[error.field] = error.message;
      });
      setErrors(errorMap);
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }

    if (form.questions.length === 0) {
      toast.error("Adicione pelo menos uma pergunta ao formulário");
      return;
    }

    try {
      setIsSubmitting(true);
      await FormService.saveForm(form);
      toast.success("Formulário salvo com sucesso!");
      router.push("/");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao salvar formulário";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
};
