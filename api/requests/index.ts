import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "interfacenit@gmail.com",
    pass: process.env.EMAIL_PASS,
  },
});

// =============================================
// Mapeamento departamento → diretor responsável
// =============================================
const DIRETOR_POR_DEPARTAMENTO: Record<string, string> = {
  // Rafael
  "Financeiro":                       "rafael@nordesteloc.com.br",
  "Manutenção / ASD / PCM":           "rafael@nordesteloc.com.br",
  "Compras":                           "rafael@nordesteloc.com.br",
  "Gente e Gestão (RH / DP / NIT)":   "rafael@nordesteloc.com.br",
  "Fiscal e Contábil":                 "rafael@nordesteloc.com.br",
  "Serviços Diversos":                 "rafael@nordesteloc.com.br",
  "Serviços Gerais":                   "rafael@nordesteloc.com.br",
  // Ricardo
  "Comercial":                         "ricardo@nordesteloc.com.br",
  "Logística / Almoxarifado":          "ricardo@nordesteloc.com.br",
  "Transportes":                       "ricardo@nordesteloc.com.br",
  "Marketing":                         "ricardo@nordesteloc.com.br",
};

function getDiretorEmail(department: string): string {
  return DIRETOR_POR_DEPARTAMENTO[department] ?? "rafael@nordesteloc.com.br";
}

function buildEmailHtml(data: any, ticketId: string): string {
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
        <p style="margin: 5px 0 0; font-weight: bold;">Ticket: ${ticketId}</p>
      </div>
      <div style="padding: 20px; color: #333;">
        <h2 style="border-bottom: 2px solid #E31E24; padding-bottom: 5px;">Informações do Solicitante</h2>
        <p><strong>Nome:</strong> ${data.name}</p>
        <p><strong>Departamento:</strong> ${data.department}</p>
        <p><strong>Cargo:</strong> ${data.role || '—'}</p>
        <p><strong>Unidade:</strong> ${data.unit}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Telefone:</strong> ${data.phone || '—'}</p>

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  // GET — lista solicitações (painel admin)
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ success: false, error: "Erro interno" });
    return res.status(200).json(data || []);
  }

  // POST — nova solicitação
  if (req.method === "POST") {
    const {
      name, department, role, email, phone, unit,
      project_name, request_type, current_problem,
      solution_objective, business_impact, problem_frequency,
      urgency, systems_involved, sectors_involved, description,
    } = req.body;

    if (!name || !email || !project_name) {
      return res.status(400).json({ success: false, error: "Campos obrigatórios faltando" });
    }

    // Gera ticket ID
    const year = new Date().getFullYear();
    const { count, error: countError } = await supabase
      .from("requests")
      .select("id", { count: "exact", head: true })
      .like("ticket_id", `NIT-${year}-%`);

    if (countError) return res.status(500).json({ success: false, error: "Erro interno" });

    const ticketId = `NIT-${year}-${((count || 0) + 1).toString().padStart(3, "0")}`;

    const { error: insertError } = await supabase
      .from("requests")
      .insert([{
        ticket_id: ticketId,
        name, department, role, email, phone, unit,
        project_name, request_type, current_problem,
        solution_objective, business_impact, problem_frequency,
        urgency, systems_involved, sectors_involved, description,
      }]);

    if (insertError) return res.status(500).json({ success: false, error: "Erro interno" });

    console.log(`[NIT] Nova solicitação: ${ticketId} | Dept: ${department}`);

    // Diretor responsável pelo departamento
    const diretorEmail = getDiretorEmail(department);

    const mailOptions = {
      from: '"Portal NIT" <interfacenit@gmail.com>',
      to: diretorEmail,                         // ← só o diretor do departamento
      cc: [
        "nathanael.soeiro@nordesteloc.com.br",
        "nit@nordesteloc.com.br",
        email,                                  // ← solicitante recebe cópia
      ],
      subject: `[NIT] Nova Solicitação de Projeto - ${ticketId} | ${department}`,
      html: buildEmailHtml(req.body, ticketId),
    };

    transporter.sendMail(mailOptions).catch((err) => {
      console.error("[NIT] Erro ao enviar e-mail:", err);
    });

    return res.status(201).json({ success: true, ticketId });
  }

  return res.status(405).json({ error: "Método não permitido" });
}
