import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "interfacenit@gmail.com",
    pass: process.env.EMAIL_PASS,
  },
});

export function buildRequestEmailHtml(data: {
  ticketId: string;
  name: string;
  department: string;
  role: string;
  unit: string;
  email: string;
  phone: string;
  project_name: string;
  request_type: string;
  current_problem: string;
  solution_objective: string;
  business_impact: string;
  problem_frequency: string;
  urgency: string;
  sectors_involved: string[] | string;
  systems_involved: string[] | string;
}) {
  const sectors = Array.isArray(data.sectors_involved)
    ? data.sectors_involved.join(", ")
    : data.sectors_involved;
  const systems = Array.isArray(data.systems_involved)
    ? data.systems_involved.join(", ")
    : data.systems_involved;

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
      <div style="background-color: #E31E24; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Nova Solicitação NIT</h1>
        <p style="margin: 5px 0 0; font-weight: bold;">Ticket: ${data.ticketId}</p>
      </div>
      <div style="padding: 20px; color: #333;">
        <h2 style="border-bottom: 2px solid #E31E24; padding-bottom: 5px;">Informações do Solicitante</h2>
        <p><strong>Nome:</strong> ${data.name}</p>
        <p><strong>Departamento:</strong> ${data.department}</p>
        <p><strong>Cargo:</strong> ${data.role}</p>
        <p><strong>Unidade:</strong> ${data.unit}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Telefone:</strong> ${data.phone}</p>

        <h2 style="border-bottom: 2px solid #E31E24; padding-bottom: 5px; margin-top: 30px;">Detalhes do Projeto</h2>
        <p><strong>Projeto:</strong> ${data.project_name}</p>
        <p><strong>Tipo:</strong> ${data.request_type}</p>
        <p><strong>Problema Atual:</strong><br/>${data.current_problem}</p>
        <p><strong>Objetivo da Solução:</strong><br/>${data.solution_objective}</p>

        <h2 style="border-bottom: 2px solid #E31E24; padding-bottom: 5px; margin-top: 30px;">Impacto e Urgência</h2>
        <p><strong>Impacto:</strong> ${data.business_impact}</p>
        <p><strong>Frequência:</strong> ${data.problem_frequency}</p>
        <p><strong>Urgência:</strong> ${data.urgency}</p>
        <p><strong>Setores Envolvidos:</strong> ${sectors}</p>
        <p><strong>Sistemas Envolvidos:</strong> ${systems}</p>

        <div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; font-size: 12px; color: #666;">
          <p style="margin: 0;">Este é um e-mail automático gerado pelo Portal NIT.</p>
        </div>
      </div>
    </div>
  `;
}
