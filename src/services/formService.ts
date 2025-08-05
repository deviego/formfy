import { Form, FormResponse } from "@/types/form";
import {
  saveForm as saveFormStorage,
  getForm as getFormStorage,
  getForms as getFormsStorage,
  deleteForm as deleteFormStorage,
  saveResponse as saveResponseStorage,
  generateShareableUrl as generateShareableUrlStorage,
} from "@/lib/storage";

export class FormService {
  static async saveForm(form: Form): Promise<void> {
    try {
      saveFormStorage(form);
    } catch {
      throw new Error("Erro ao salvar formulário");
    }
  }

  static async getForm(id: string): Promise<Form | null> {
    try {
      return getFormStorage(id);
    } catch {
      throw new Error("Erro ao buscar formulário");
    }
  }

  static async getForms(): Promise<Form[]> {
    try {
      return getFormsStorage();
    } catch {
      throw new Error("Erro ao buscar formulários");
    }
  }

  static async deleteForm(id: string): Promise<void> {
    try {
      deleteFormStorage(id);
    } catch {
      throw new Error("Erro ao excluir formulário");
    }
  }

  static async saveResponse(response: FormResponse): Promise<void> {
    try {
      saveResponseStorage(response);
    } catch {
      throw new Error("Erro ao salvar resposta");
    }
  }

  static async sendFormResponse(data: {
    formTitle: string;
    destinationEmail: string;
    respondentEmail?: string;
    answers: Array<{
      questionTitle: string;
      answer: string | string[] | number | boolean;
    }>;
    responseDate: string;
  }): Promise<void> {
    const response = await fetch("/api/send-form-response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Erro ao enviar email");
    }
  }

  static generateShareableUrl(formId: string): string {
    return generateShareableUrlStorage(formId);
  }
}
