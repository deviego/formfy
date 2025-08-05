import { QuestionType } from "@/types/form";

export const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: "yes_no", label: "Sim/Não" },
  { value: "multiple_choice", label: "Múltipla escolha" },
  { value: "single_choice", label: "Escolha única" },
  { value: "text_free", label: "Texto livre" },
  { value: "integer", label: "Número inteiro" },
  { value: "decimal_number", label: "Número decimal" },
];

export const STORAGE_KEYS = {
  FORMS: "formfy_forms",
  RESPONSES: "formfy_responses",
} as const;

export const ERROR_MESSAGES = {
  FORM_TITLE_REQUIRED: "Título é obrigatório",
  EMAIL_REQUIRED: "Email de destino é obrigatório",
  EMAIL_INVALID: "Email inválido",
  QUESTION_TITLE_REQUIRED: "Título da pergunta é obrigatório",
  ANSWER_OPTIONS_REQUIRED: "Adicione pelo menos uma opção de resposta",
  ANSWER_OPTIONS_EMPTY: "Todas as opções devem ter um texto",
  FIELD_REQUIRED: "Este campo é obrigatório",
  FORM_SAVE_ERROR: "Erro ao salvar formulário",
  FORM_LOAD_ERROR: "Erro ao carregar formulário",
  FORM_DELETE_ERROR: "Erro ao excluir formulário",
  EMAIL_SEND_ERROR: "Erro ao enviar email",
  RESPONSE_SAVE_ERROR: "Erro ao salvar resposta",
} as const;

export const SUCCESS_MESSAGES = {
  FORM_SAVED: "Formulário salvo com sucesso!",
  FORM_DELETED: "Formulário excluído com sucesso!",
  QUESTION_ADDED: "Pergunta adicionada com sucesso!",
  QUESTION_REMOVED: "Pergunta removida com sucesso!",
  URL_COPIED: "URL do formulário copiada para a área de transferência!",
  FORM_SUBMITTED:
    "Formulário enviado com sucesso! O responsável receberá suas respostas por email.",
} as const;
