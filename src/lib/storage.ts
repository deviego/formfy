import { Form, FormResponse } from "@/types/form";

const STORAGE_KEYS = {
  FORMS: "formfy_forms",
  RESPONSES: "formfy_responses",
} as const;

// Form Functions
export const saveForm = (form: Form): void => {
  try {
    const forms = getForms();
    const index = forms.findIndex((f) => f.id === form.id);

    if (index >= 0) {
      forms[index] = form;
    } else {
      forms.push(form);
    }

    localStorage.setItem(STORAGE_KEYS.FORMS, JSON.stringify(forms));
  } catch (error) {
    console.error("Error saving form:", error);
  }
};

export const getForms = (): Form[] => {
  try {
    const forms = localStorage.getItem(STORAGE_KEYS.FORMS);
    return forms ? JSON.parse(forms) : [];
  } catch (error) {
    console.error("Error getting forms:", error);
    return [];
  }
};

export const getForm = (id: string): Form | null => {
  try {
    const forms = getForms();
    return forms.find((f) => f.id === id) || null;
  } catch (error) {
    console.error("Error getting form:", error);
    return null;
  }
};

export const deleteForm = (id: string): void => {
  try {
    const forms = getForms();
    const updatedForms = forms.filter((f) => f.id !== id);
    localStorage.setItem(STORAGE_KEYS.FORMS, JSON.stringify(updatedForms));
  } catch (error) {
    console.error("Error deleting form:", error);
  }
};

// Response Functions
export const saveResponse = (response: FormResponse): void => {
  try {
    const responses = getResponses();
    responses.push(response);
    localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(responses));

    // Send by email (simulated via console)
    const form = getForm(response.formId);
    if (form) {
      console.log(`📧 Simulated email sent to: ${form.destinationEmail}`);
      console.log("Response data:", response);
    }
  } catch (error) {
    console.error("Error saving response:", error);
  }
};

export const getResponses = (): FormResponse[] => {
  try {
    const responses = localStorage.getItem(STORAGE_KEYS.RESPONSES);
    return responses ? JSON.parse(responses) : [];
  } catch (error) {
    console.error("Error getting responses:", error);
    return [];
  }
};

export const getFormResponses = (formId: string): FormResponse[] => {
  try {
    const responses = getResponses();
    return responses.filter((r) => r.formId === formId);
  } catch (error) {
    console.error("Error getting form responses:", error);
    return [];
  }
};

// Function to generate shareable URL
export const generateShareableUrl = (formId: string): string => {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  return `${baseUrl}/forms/${formId}`;
};

// Function to generate unique code for question
export const generateQuestionCode = (title: string): string => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 20);
};

// Function to generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};
