import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

interface AnswerData {
  questionTitle: string;
  answer: string | string[] | number | boolean;
}

export async function POST(request: NextRequest) {
  try {
    const {
      formTitle,
      destinationEmail,
      respondentEmail,
      answers,
      responseDate,
    } = await request.json();

    // Gerar HTML do email com as respostas
    const answersHtml = answers
      .map((answer: AnswerData) => {
        let answerValue = "";

        if (Array.isArray(answer.answer)) {
          answerValue = answer.answer.join(", ");
        } else if (typeof answer.answer === "boolean") {
          answerValue = answer.answer ? "Sim" : "Não";
        } else {
          answerValue = String(answer.answer);
        }

        return `
        <div style="margin-bottom: 20px; padding: 15px; border-left: 3px solid #3b82f6; background-color: #f8fafc;">
          <h3 style="margin: 0 0 8px 0; color: #1e293b; font-size: 16px;">${answer.questionTitle}</h3>
          <p style="margin: 0; color: #475569; font-size: 14px;"><strong>Resposta:</strong> ${answerValue}</p>
        </div>
      `;
      })
      .join("");

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Nova Resposta do Formulário</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #3b82f6; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">📋 Nova Resposta de Formulário</h1>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
            <div style="margin-bottom: 20px;">
              <h2 style="color: #1e293b; margin: 0 0 10px 0;">Formulário: ${formTitle}</h2>
              <p style="margin: 0; color: #64748b; font-size: 14px;">
                <strong>Data de resposta:</strong> ${new Date(
                  responseDate
                ).toLocaleDateString("pt-BR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              ${respondentEmail ? `<p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;"><strong>E-mail do respondente:</strong> ${respondentEmail}</p>` : ""}
            </div>

            <h3 style="color: #1e293b; margin: 20px 0 15px 0; font-size: 18px;">📝 Respostas:</h3>
            ${answersHtml}
          </div>

          <div style="margin-top: 20px; padding: 15px; background-color: #f1f5f9; border-radius: 8px; font-size: 12px; color: #64748b; text-align: center;">
            <p style="margin: 0;">Este e-mail foi enviado automaticamente pelo sistema FormFy</p>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: "FormFy <onboarding@resend.dev>",
      to: [destinationEmail],
      subject: `📋 Nova resposta do formulário: ${formTitle}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Erro ao enviar email:", error);
      return NextResponse.json(
        { error: "Erro ao enviar email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Erro na API de envio:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
