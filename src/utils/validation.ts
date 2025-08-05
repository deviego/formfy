import { Form, Question } from "@/types/form";

export interface ValidationError {
  field: string;
  message: string;
}

export class FormValidator {
  static validateForm(form: Partial<Form>): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!form.title?.trim()) {
      errors.push({ field: "title", message: "Título é obrigatório" });
    }

    if (!form.destinationEmail?.trim()) {
      errors.push({
        field: "destinationEmail",
        message: "Email de destino é obrigatório",
      });
    } else if (!this.isValidEmail(form.destinationEmail)) {
      errors.push({ field: "destinationEmail", message: "Email inválido" });
    }

    return errors;
  }

  static validateQuestion(question: Partial<Question>): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!question.title?.trim()) {
      errors.push({
        field: "title",
        message: "Título da pergunta é obrigatório",
      });
    }

    if (
      question.questionType === "multiple_choice" ||
      question.questionType === "single_choice"
    ) {
      if (!question.answerOptions || question.answerOptions.length === 0) {
        errors.push({
          field: "answerOptions",
          message: "Adicione pelo menos uma opção de resposta",
        });
      } else {
        const emptyOptions = question.answerOptions.filter(
          (opt) => !opt.answer?.trim()
        );
        if (emptyOptions.length > 0) {
          errors.push({
            field: "answerOptions",
            message: "Todas as opções devem ter um texto",
          });
        }
      }
    }

    return errors;
  }

  static validateFormResponse(
    questions: Question[],
    responses: Record<string, string | string[] | number | boolean>
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    const requiredQuestions = questions.filter((q) => q.required);

    requiredQuestions.forEach((question) => {
      const response = responses[question.id];

      if (
        !response ||
        (Array.isArray(response) && response.length === 0) ||
        response === "" ||
        response === null ||
        response === undefined
      ) {
        errors.push({
          field: question.id,
          message: "Este campo é obrigatório",
        });
      }
    });

    return errors;
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
