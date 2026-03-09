import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("nit_portal.db");

// Email Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "interfacenit@gmail.com",
    pass: "rppt otux xdgr fqnk",
  },
});

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id TEXT UNIQUE,
    name TEXT,
    department TEXT,
    role TEXT,
    email TEXT,
    phone TEXT,
    unit TEXT,
    project_name TEXT,
    request_type TEXT,
    current_problem TEXT,
    solution_objective TEXT,
    business_impact TEXT,
    problem_frequency TEXT,
    urgency TEXT,
    systems_involved TEXT,
    sectors_involved TEXT,
    description TEXT,
    status TEXT DEFAULT 'Recebido',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    tag TEXT,
    description TEXT,
    impact TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Migration to add sectors_involved if it doesn't exist
try {
  db.exec("ALTER TABLE requests ADD COLUMN sectors_involved TEXT");
} catch (e) {
  // Column already exists
}

// Seed initial projects if table is empty or contains old placeholders
const projectCount = db.prepare("SELECT COUNT(*) as count FROM projects").get() as { count: number };
const hasOldData = db.prepare("SELECT COUNT(*) as count FROM projects WHERE title = 'Dashboard Operacional 360°'").get() as { count: number };

if (projectCount.count === 0 || hasOldData.count > 0) {
  // Clear old data if present
  db.prepare("DELETE FROM projects").run();
  
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

  const insertProject = db.prepare("INSERT INTO projects (title, tag, description, impact, image_url) VALUES (?, ?, ?, ?, ?)");
  seedProjects.forEach(p => insertProject.run(p.title, p.tag, p.description, p.impact, p.image_url));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/projects", (req, res) => {
    const projects = db.prepare("SELECT * FROM projects ORDER BY created_at DESC").all();
    res.json(projects);
  });

  app.post("/api/projects", (req, res) => {
    const { title, tag, description, impact, image_url } = req.body;
    const stmt = db.prepare("INSERT INTO projects (title, tag, description, impact, image_url) VALUES (?, ?, ?, ?, ?)");
    const result = stmt.run(title, tag, description, impact, image_url);
    res.json({ success: true, id: result.lastInsertRowid });
  });

  app.put("/api/projects/:id", (req, res) => {
    const { id } = req.params;
    const { title, tag, description, impact, image_url } = req.body;
    const stmt = db.prepare("UPDATE projects SET title = ?, tag = ?, description = ?, impact = ?, image_url = ? WHERE id = ?");
    stmt.run(title, tag, description, impact, image_url, id);
    res.json({ success: true });
  });

  app.delete("/api/projects/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM projects WHERE id = ?").run(id);
    res.json({ success: true });
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
      const count = db.prepare("SELECT COUNT(*) as count FROM requests").get() as { count: number };
      const ticketId = `NIT-${year}-${(count.count + 1).toString().padStart(3, '0')}`;

      const stmt = db.prepare(`
        INSERT INTO requests (
          ticket_id, name, department, role, email, phone, unit,
          project_name, request_type, current_problem,
          solution_objective, business_impact, problem_frequency,
          urgency, systems_involved, sectors_involved, description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        ticketId, name, department, role, email, phone, unit,
        project_name, request_type, current_problem,
        solution_objective, business_impact, problem_frequency,
        urgency, JSON.stringify(systems_involved), JSON.stringify(sectors_involved), description
      );

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

  app.get("/api/requests", (req, res) => {
    const requests = db.prepare("SELECT * FROM requests ORDER BY created_at DESC").all();
    res.json(requests);
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
