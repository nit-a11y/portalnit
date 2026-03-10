import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../_lib/supabase";
import { transporter, buildRequestEmailHtml } from "../_lib/mailer";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  // GET /api/requests — Lista todas as solicitações (painel admin)
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[NIT] Erro ao buscar solicitações:", error);
      return res.status(500).json({ success: false, error: "Erro interno" });
    }

    return res.status(200).json(data || []);
  }

  // POST /api/requests — Registra nova solicitação
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

    // Gera ticket ID: NIT-2026-001
    const year = new Date().getFullYear();
    const { count, error: countError } = await supabase
      .from("requests")
      .select("id", { count: "exact", head: true })
      .like("ticket_id", `NIT-${year}-%`);

    if (countError) {
      console.error("[NIT] Erro ao contar tickets:", countError);
      return res.status(500).json({ success: false, error: "Erro interno" });
    }

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

    if (insertError) {
      console.error("[NIT] Erro ao inserir solicitação:", insertError);
      return res.status(500).json({ success: false, error: "Erro interno" });
    }

    console.log(`[NIT] Nova solicitação registrada: ${ticketId}`);

    // Envia e-mail de notificação (não bloqueia a resposta)
    const mailOptions = {
      from: '"Portal NIT" <interfacenit@gmail.com>',
      to: ["rafael@nordesteloc.com.br", "ricardo@nordesteloc.com.br"],
      cc: [
        "nathanael.soeiro@nordesteloc.com.br",
        "nit@nordesteloc.com.br",
        "adm@nordesteloc.com.br",
        email,
      ],
      subject: `[NIT] Nova Solicitação de Projeto - ${ticketId}`,
      html: buildRequestEmailHtml({
        ticketId, name, department, role, unit, email, phone,
        project_name, request_type, current_problem,
        solution_objective, business_impact, problem_frequency,
        urgency, sectors_involved, systems_involved,
      }),
    };

    // Fire-and-forget: responde ao usuário imediatamente
    transporter.sendMail(mailOptions).catch((err) => {
      console.error("[NIT] Erro ao enviar e-mail:", err);
    });

    return res.status(201).json({ success: true, ticketId });
  }

  return res.status(405).json({ error: "Método não permitido" });
}
