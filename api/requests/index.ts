import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../_lib/supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS para o frontend na Vercel
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  // GET /api/projects — Lista todos os projetos
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[NIT] Erro ao buscar projetos:", error);
      return res.status(500).json({ success: false, error: "Erro interno" });
    }

    return res.status(200).json(data || []);
  }

  // POST /api/projects — Cria novo projeto
  if (req.method === "POST") {
    const { title, tag, description, impact, image_url } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, error: "Campo 'title' obrigatório" });
    }

    const { data, error } = await supabase
      .from("projects")
      .insert([{ title, tag, description, impact, image_url }])
      .select();

    if (error) {
      console.error("[NIT] Erro ao criar projeto:", error);
      return res.status(500).json({ success: false, error: "Erro interno" });
    }

    return res.status(201).json({ success: true, id: data?.[0]?.id });
  }

  return res.status(405).json({ error: "Método não permitido" });
}
