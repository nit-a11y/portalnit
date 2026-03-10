import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../_lib/supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "ID inválido" });
  }

  // PUT /api/projects/:id — Atualiza projeto
  if (req.method === "PUT") {
    const { title, tag, description, impact, image_url } = req.body;

    const { error } = await supabase
      .from("projects")
      .update({ title, tag, description, impact, image_url })
      .eq("id", id);

    if (error) {
      console.error("[NIT] Erro ao atualizar projeto:", error);
      return res.status(500).json({ success: false, error: "Erro interno" });
    }

    return res.status(200).json({ success: true });
  }

  // DELETE /api/projects/:id — Remove projeto
  if (req.method === "DELETE") {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[NIT] Erro ao deletar projeto:", error);
      return res.status(500).json({ success: false, error: "Erro interno" });
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Método não permitido" });
}
