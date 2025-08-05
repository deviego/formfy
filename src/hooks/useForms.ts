import { useState, useEffect } from "react";
import { Form } from "@/types/form";
import { FormService } from "@/services/formService";
import { toast } from "sonner";

export const useForms = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadForms = async () => {
    try {
      setLoading(true);
      setError(null);
      const formsData = await FormService.getForms();
      setForms(formsData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar formulários";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteForm = async (id: string) => {
    try {
      await FormService.deleteForm(id);
      setForms((prev) => prev.filter((form) => form.id !== id));
      toast.success("Formulário excluído com sucesso!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao excluir formulário";
      toast.error(errorMessage);
    }
  };

  const shareForm = (id: string) => {
    try {
      const url = FormService.generateShareableUrl(id);
      navigator.clipboard.writeText(url);
      toast.success("URL do formulário copiada para a área de transferência!");
    } catch {
      toast.error("Erro ao copiar URL");
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  return {
    forms,
    loading,
    error,
    deleteForm,
    shareForm,
    refreshForms: loadForms,
  };
};
