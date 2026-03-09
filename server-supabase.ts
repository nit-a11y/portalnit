import express from "express";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase Client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// Email Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || "interfacenit@gmail.com",
    pass: process.env.EMAIL_PASS || "rppt otux xdgr fqnk",
  },
});

// Seed initial projects if table is empty
async function seedProjects() {
  try {
    const { data: existingProjects, error } = await supabase
      .from('projects')
      .select('id')
      .limit(1);

    if (error) throw error;

    if (!existingProjects || existingProjects.length === 0) {
      const seedProjects = [
        { 
          title: "Sistema Integrado de Gestão Operacional", 
          tag: "Business Intelligence & Gestão Empresarial", 
          description: "Sistema completo de gestão operacional para Nordeste Locações, integrando múltiplos módulos de negócio em uma plataforma unificada. O sistema gerencia agendamentos, manutenções, frota de veículos, patrimônio, ocorrências, cobranças e recursos humanos com automação de e-mails e relatórios em tempo real.",
          impact: "Redução de 60% no tempo de processamento de agendamentos",
          image_url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800"
        },
        { 
          title: "Plataforma de Gestão de Motoristas e Logística", 
          tag: "Logística & Gestão de Frotas", 
          description: "Sistema especializado na gestão de motoristas e operações logísticas da Nordeste Locações. A plataforma oferece controle completo de dossiês de motoristas, registro de incidentes, métricas de performance, gestão de rotas e controle de tempo de serviço, com dashboard analítico para tomada de decisões estratégicas.",
          impact: "Redução de 35% no tempo de administração de motoristas",
          image_url: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=800"
        },
        { 
          title: "Sistema de Procedimentos Operacionais Padrão", 
          tag: "Gestão da Qualidade & Manutenção", 
          description: "Plataforma digital para gestão de Procedimentos Operacionais Padrão (POP) focada em manutenção de equipamentos leves. O sistema oferece checklists digitais, histórico de manutenções, controle de óleo e lubrificação, painel administrativo e acesso móvel para equipes de campo, garantindo padronização e qualidade nos processos de manutenção.",
          impact: "Redução de 70% no tempo de preenchimento de checklists",
          image_url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800"
        },
        { 
          title: "Plataforma de Requisição Digital Integrada", 
          tag: "Processos Digitais & Automação", 
          description: "Sistema completo de digitalização de processos de requisição para Nordeste Locações. A plataforma transforma processos manuais em fluxos digitais automatizados com autenticação segura, WebSocket para atualizações em tempo real, gestão de uploads e módulo especializado para recálculo e sucata, integrando todos os setores da empresa.",
          impact: "Redução de 80% no tempo de processamento de requisições",
          image_url: "https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=800"
        },
        { 
          title: "Plataforma Completa de Gestão de Capital Humano", 
          tag: "Recursos Humanos & Gestão de Pessoas", 
          description: "Sistema abrangente de gestão de recursos humanos que controla todo o ciclo de vida do colaborador. A plataforma gerencia cadastros, empresas, uniformes e kits, ocorrências, carreira, ASO, SST, férias, inteligência de RH, perfis, temas de interface e metas de atividade, oferecendo uma visão 360° da gestão de pessoas.",
          impact: "Redução de 75% no tempo de processamento de RH",
          image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
        }
      ];

      const { error: insertError } = await supabase
        .from('projects')
        .insert(seedProjects);

      if (insertError) throw insertError;
      
      console.log('[NIT] Projetos iniciais inseridos com sucesso');
    }
  } catch (error) {
    console.error('[NIT] Erro ao fazer seed dos projetos:', error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/projects", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const { title, tag, description, impact, image_url } = req.body;
      
      const { data, error } = await supabase
        .from('projects')
        .insert([{ title, tag, description, impact, image_url }])
        .select();

      if (error) throw error;
      res.json({ success: true, id: data?.[0]?.id });
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { title, tag, description, impact, image_url } = req.body;
      
      const { error } = await supabase
        .from('projects')
        .update({ title, tag, description, impact, image_url })
        .eq('id', id);

      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  });

  app.post("/api/requests", async (req, res) => {
    try {
      const {
        name, department, role, email, phone, unit,
        project_name, request_type, current_problem,
        solution_objective, business_impact, problem_frequency,
        urgency, systems_involved, sectors_involved, description
      } = req.body;

      const year = new Date().getFullYear();
      
      // Get current count to generate ticket ID
      const { data: requests, error: countError } = await supabase
        .from('requests')
        .select('id')
        .eq('ticket_id', `NIT-${year}%`);

      if (countError) throw countError;

      const count = requests?.length || 0;
      const ticketId = `NIT-${year}-${(count + 1).toString().padStart(3, '0')}`;

      const { error: insertError } = await supabase
        .from('requests')
        .insert([{
          ticket_id: ticketId,
          name,
          department,
          role,
          email,
          phone,
          unit,
          project_name,
          request_type,
          current_problem,
          solution_objective,
          business_impact,
          problem_frequency,
          urgency,
          systems_involved,
          sectors_involved,
          description
        }]);

      if (insertError) throw insertError;

      console.log(`[NIT] Nova solicitação registrada: ${ticketId}`);

      // Send Email
      const mailOptions = {
        from: '"Portal NIT" <interfacenit@gmail.com>',
        to: ["rafael@nordesteloc.com.br", "ricardo@nordesteloc.com.br"],
        cc: [
          "nathanael.soeiro@nordesteloc.com.br",
          "nit@nordesteloc.com.br",
          "adm@nordesteloc.com.br",
          email // Requester's email
        ],
        subject: `[NIT] Nova Solicitação de Projeto - ${ticketId}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #E31E24; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">Nova Solicitação NIT</h1>
              <p style="margin: 5px 0 0; font-weight: bold;">Ticket: ${ticketId}</p>
            </div>
            <div style="padding: 20px; color: #333;">
              <h2 style="border-bottom: 2px solid #E31E24; padding-bottom: 5px;">Informações do Solicitante</h2>
              <p><strong>Nome:</strong> ${name}</p>
              <p><strong>Departamento:</strong> ${department}</p>
              <p><strong>Cargo:</strong> ${role}</p>
              <p><strong>Unidade:</strong> ${unit}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Telefone:</strong> ${phone}</p>

              <h2 style="border-bottom: 2px solid #E31E24; padding-bottom: 5px; margin-top: 30px;">Detalhes do Projeto</h2>
              <p><strong>Projeto:</strong> ${project_name}</p>
              <p><strong>Tipo:</strong> ${request_type}</p>
              <p><strong>Problema Atual:</strong><br/>${current_problem}</p>
              <p><strong>Objetivo da Solução:</strong><br/>${solution_objective}</p>
              
              <h2 style="border-bottom: 2px solid #E31E24; padding-bottom: 5px; margin-top: 30px;">Impacto e Urgência</h2>
              <p><strong>Impacto:</strong> ${business_impact}</p>
              <p><strong>Frequência:</strong> ${problem_frequency}</p>
              <p><strong>Urgência:</strong> ${urgency}</p>
              <p><strong>Setores Envolvidos:</strong> ${Array.isArray(sectors_involved) ? sectors_involved.join(', ') : sectors_involved}</p>
              <p><strong>Sistemas Envolvidos:</strong> ${Array.isArray(systems_involved) ? systems_involved.join(', ') : systems_involved}</p>
              
              <div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; font-size: 12px; color: #666;">
                <p style="margin: 0;">Este é um e-mail automático gerado pelo Portal NIT.</p>
              </div>
            </div>
          </div>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      res.json({ success: true, ticketId });
    } catch (error) {
      console.error("Error saving request:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  });

  app.get("/api/requests", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  // Seed projects on startup
  await seedProjects();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
