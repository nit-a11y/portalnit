import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function md5(text: string): string {
  return crypto.createHash("md5").update(text).digest("hex");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido" });

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: "Usuário e senha são obrigatórios" });
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("id, name, department, email, unit, username, active")
    .eq("username", username.trim().toLowerCase())
    .eq("password_hash", md5(password))
    .eq("active", true)
    .single();

  if (error || !user) {
    return res.status(401).json({ success: false, error: "Usuário ou senha incorretos" });
  }

  // Retorna os dados do usuário (sem senha) para o frontend armazenar em sessão
  return res.status(200).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      department: user.department,
      email: user.email,
      unit: user.unit,
      username: user.username,
    },
  });
}
