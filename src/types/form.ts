export type QuestionType =
  | "yes_no"
  | "multiple_choice"
  | "single_choice"
  | "text_free"
  | "integer"
  | "decimal_number";

export interface AnswerOption {
  id: string;
  questionId: string;
  answer: string;
  order: number;
  openAnswer: boolean;
}

export interface Question {
  id: string;
  formId: string;
  title: string;
  code: string;
  answerGuidance: string;
  order: number;
  required: boolean;
  subQuestion: boolean;
  questionType: QuestionType;
  answerOptions?: AnswerOption[];
}

export interface QuestionAnswerOption {
  id: string;
  answerOptionId: string;
  questionId: string;
}

export interface Form {
  id: string;
  title: string;
  description: string;
  order: number;
  destinationEmail: string;
  questions: Question[];
}

export interface FormResponse {
  id: string;
  formId: string;
  respondentEmail?: string;
  responseDate: string;
  answers: {
    questionId: string;
    answer: string | string[] | number | boolean;
  }[];
}

export interface QuestionConditional {
  sourceQuestionId: string;
  answerOptionId: string;
  targetQuestionId: string;
}
