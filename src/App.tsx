/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Settings, 
  BarChart3, 
  Link as LinkIcon, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  ClipboardList,
  Lightbulb,
  ArrowRight,
  Send,
  Building2,
  Mail,
  Phone,
  User,
  Briefcase,
  MapPin,
  Clock,
  Zap,
  CheckSquare,
  Plus,
  Trash2,
  Edit2,
  X,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { projectsAPI, requestsAPI, Project, Request } from './lib/api';

type View = 'home' | 'form' | 'success' | 'projects' | 'admin';

interface FormData {
  name: string;
  department: string;
  role: string;
  email: string;
  phone: string;
  unit: string;
  project_name: string;
  request_type: string;
  current_problem: string;
  solution_objective: string;
  business_impact: string;
  problem_frequency: string;
  urgency: string;
  systems_involved: string[];
  sectors_involved: string[];
  description: string;
}

const INITIAL_FORM_DATA: FormData = {
  name: '',
  department: '',
  role: '',
  email: '',
  phone: '',
  unit: '',
  project_name: '',
  request_type: '',
  current_problem: '',
  solution_objective: '',
  business_impact: 'Médio',
  problem_frequency: 'Semanal',
  urgency: 'Média',
  systems_involved: [],
  sectors_involved: [],
  description: ''
};

export default function App() {
  const [view, setView] = useState<View>('home');
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Admin State
  const [nitClickCount, setNitClickCount] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectsAPI.getAll();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Erro ao carregar projetos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleNitClick = () => {
    const newCount = nitClickCount + 1;
    if (newCount === 3) {
      setShowPasswordModal(true);
      setNitClickCount(0);
    } else {
      setNitClickCount(newCount);
      setTimeout(() => setNitClickCount(0), 2000);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === '201823') {
      setIsAdminAuthenticated(true);
      setShowPasswordModal(false);
      setView('admin');
      setAdminPassword('');
    } else {
      alert('Senha incorreta!');
      setAdminPassword('');
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const method = editingProject.id ? 'update' : 'create';
      
      if (method === 'update') {
        await projectsAPI.update(editingProject.id, editingProject);
      } else {
        await projectsAPI.create(editingProject);
      }
      
      await fetchProjects();
      setIsProjectModalOpen(false);
      setEditingProject(null);
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Erro ao salvar projeto. Tente novamente.");
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Deseja realmente excluir este projeto?')) return;
    try {
      await projectsAPI.delete(id);
      await fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Erro ao excluir projeto. Tente novamente.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field: 'systems_involved' | 'sectors_involved', value: string) => {
    setFormData(prev => {
      const items = prev[field].includes(value)
        ? prev[field].filter(s => s !== value)
        : [...prev[field], value];
      return { ...prev, [field]: items };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await requestsAPI.create(formData);
      if (data.success) {
        setTicketId(data.ticketId || '');
        setView('success');
        setFormData(INITIAL_FORM_DATA);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Erro ao enviar solicitação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
              <div className="w-10 h-10 bg-nit-red rounded-lg flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                <Lightbulb size={24} />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tighter text-nit-dark">NIT</span>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold -mt-1">Núcleo de Inteligência</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => setView('home')} className={`text-sm font-semibold transition-colors ${view === 'home' ? 'text-nit-red' : 'text-gray-500 hover:text-nit-dark'}`}>Início</button>
              <button onClick={() => setView('projects')} className={`text-sm font-semibold transition-colors ${view === 'projects' ? 'text-nit-red' : 'text-gray-500 hover:text-nit-dark'}`}>Projetos</button>
              <button onClick={() => setView('form')} className="btn-primary py-2 px-5 text-sm">Solicitar Projeto</button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
            >
              {/* Hero Section */}
              <div className="relative rounded-3xl overflow-hidden bg-nit-dark text-white p-8 md:p-16 mb-20 shadow-2xl">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-l from-nit-red to-transparent"></div>
                  <img 
                    src="https://raw.githubusercontent.com/nit-a11y/portalnit/refs/heads/main/nit%20-%20tema%20(2).png" 
                    alt="Background" 
                    className="w-full h-full object-cover grayscale"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="relative z-10 max-w-2xl">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nit-red/20 border border-nit-red/30 text-nit-red text-xs font-bold uppercase tracking-wider mb-6"
                  >
                    <Zap size={14} /> Inovação & Tecnologia
                  </motion.div>
                  <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
                    Transformando processos em <span className="text-nit-red">soluções.</span>
                  </h1>
                  <p className="text-lg text-gray-400 mb-10 leading-relaxed">
                    O Núcleo de Inteligência e Tecnologia (NIT) é o motor de inovação da Nordeste Locações. 
                    Desenvolvemos automações, sistemas e análises de dados para impulsionar a eficiência operacional.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button onClick={() => setView('form')} className="btn-primary flex items-center gap-2 group">
                      Solicitar Novo Projeto <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button onClick={() => setView('projects')} className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors font-semibold">
                      Ver Projetos Desenvolvidos
                    </button>
                  </div>
                </div>
              </div>

              {/* Services Section */}
              <div className="mb-24">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-nit-dark mb-4">O que o NIT faz?</h2>
                  <p className="text-gray-500 max-w-2xl mx-auto">Soluções personalizadas para os desafios tecnológicos da nossa empresa.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { icon: <Settings className="text-nit-red" />, title: "Automação de Processos", desc: "Eliminação de tarefas repetitivas através de scripts e integrações inteligentes." },
                    { icon: <Rocket className="text-nit-red" />, title: "Sistemas Internos", desc: "Desenvolvimento de ferramentas personalizadas para necessidades específicas." },
                    { icon: <BarChart3 className="text-nit-red" />, title: "Business Intelligence", desc: "Dashboards e relatórios estratégicos para apoio à tomada de decisão." },
                    { icon: <LinkIcon className="text-nit-red" />, title: "Integrações", desc: "Conexão fluida entre sistemas, bancos de dados e planilhas corporativas." }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ y: -5 }}
                      className="glass-card p-8 hover:border-nit-red/30 transition-colors"
                    >
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6">
                        {item.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* How it works */}
              <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm mb-24">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-nit-dark mb-4">Como funciona o processo?</h2>
                  <p className="text-gray-500">Transparência e agilidade da solicitação à entrega.</p>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative">
                  <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-100 -z-10"></div>
                  {[
                    { step: "01", title: "Solicitação", desc: "Preenchimento do formulário detalhado no portal." },
                    { step: "02", title: "Triagem NIT", desc: "Análise técnica inicial da viabilidade do projeto." },
                    { step: "03", title: "Avaliação", desc: "O comitê estratégico prioriza a demanda." },
                    { step: "04", title: "Desenvolvimento", desc: "Criação da solução seguindo padrões ágeis." },
                    { step: "05", title: "Entrega", desc: "Homologação e implementação oficial." }
                  ].map((item, i) => (
                    <div key={i} className="flex-1 text-center">
                      <div className="w-12 h-12 bg-white border-2 border-nit-red rounded-full flex items-center justify-center mx-auto mb-6 text-nit-red font-bold shadow-lg shadow-red-500/10">
                        {item.step}
                      </div>
                      <h3 className="font-bold mb-2">{item.title}</h3>
                      <p className="text-xs text-gray-400 px-4">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Before requesting */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-black mb-6">Antes de solicitar, <span className="text-nit-red">verifique:</span></h2>
                  <p className="text-gray-500 mb-8">Para garantir que o NIT foque nos projetos de maior impacto, faça a si mesmo estas perguntas:</p>
                  <ul className="space-y-4">
                    {[
                      "Já existe alguma solução interna que resolva isso?",
                      "O problema é recorrente e impacta a produtividade?",
                      "Existe um impacto claro no negócio (tempo ou custo)?",
                      "A solução depende obrigatoriamente de tecnologia?"
                    ].map((text, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                        <CheckCircle2 className="text-emerald-500 shrink-0" size={20} /> {text}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-nit-red rounded-3xl p-10 text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-4">Pronto para inovar?</h3>
                    <p className="text-red-100 mb-8">Nossa equipe está pronta para analisar sua demanda e transformar seu desafio em uma solução tecnológica de alto nível.</p>
                    <button onClick={() => setView('form')} className="bg-white text-nit-red font-bold py-4 px-8 rounded-2xl hover:bg-red-50 transition-colors shadow-xl">
                      Iniciar Solicitação Agora
                    </button>
                  </div>
                  <div className="absolute -bottom-10 -right-10 opacity-20">
                    <Rocket size={200} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto px-4 py-12"
            >
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <button onClick={() => setView('home')} className="text-sm font-bold text-gray-400 hover:text-nit-red flex items-center gap-1 mb-2 transition-colors">
                    <ChevronRight className="rotate-180" size={16} /> Voltar ao Início
                  </button>
                  <h1 className="text-3xl font-black">Solicitar Novo Projeto</h1>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tempo estimado</p>
                  <p className="text-lg font-bold text-nit-dark flex items-center gap-1 justify-end">
                    <Clock size={18} className="text-nit-red" /> 4 minutos
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Solicitante */}
                <div className="glass-card p-8">
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                      <User size={20} />
                    </div>
                    <h2 className="text-xl font-bold">Informações do Solicitante</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="label-text">Nome Completo</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input required name="name" value={formData.name} onChange={handleInputChange} className="input-field pl-11" placeholder="Ex: João Silva" />
                      </div>
                    </div>
                    <div>
                      <label className="label-text">Departamento</label>
                      <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input required name="department" value={formData.department} onChange={handleInputChange} className="input-field pl-11" placeholder="Ex: Financeiro" />
                      </div>
                    </div>
                    <div>
                      <label className="label-text">Email Corporativo</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="input-field pl-11" placeholder="joao.silva@nordesteloc.com.br" />
                      </div>
                    </div>
                    <div>
                      <label className="label-text">Unidade</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <select required name="unit" value={formData.unit} onChange={handleInputChange} className="input-field pl-11 appearance-none">
                          <option value="">Selecione a unidade</option>
                          <option value="Fortaleza">Fortaleza</option>
                          <option value="Eusébio">Eusébio</option>
                          <option value="Juazeiro do Norte">Juazeiro do Norte</option>
                          <option value="São Luís">São Luís</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Projeto */}
                <div className="glass-card p-8">
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                      <ClipboardList size={20} />
                    </div>
                    <h2 className="text-xl font-bold">Detalhes do Projeto</h2>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="label-text">Nome do Projeto</label>
                      <input required name="project_name" value={formData.project_name} onChange={handleInputChange} className="input-field" placeholder="Ex: Automação de Relatório de Faturamento" />
                    </div>
                    <div>
                      <label className="label-text">Tipo de Solicitação</label>
                      <select required name="request_type" value={formData.request_type} onChange={handleInputChange} className="input-field">
                        <option value="">Selecione o tipo</option>
                        <option value="Automação de processo">Automação de processo</option>
                        <option value="Relatório / Dashboard">Relatório / Dashboard</option>
                        <option value="Sistema novo">Sistema novo</option>
                        <option value="Melhoria em sistema existente">Melhoria em sistema existente</option>
                        <option value="Integração entre sistemas">Integração entre sistemas</option>
                        <option value="Infraestrutura / servidor">Infraestrutura / servidor</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>
                    <div>
                      <label className="label-text">Problema Atual (O que ocorre hoje?)</label>
                      <textarea required name="current_problem" value={formData.current_problem} onChange={handleInputChange} rows={3} className="input-field" placeholder="Descreva o problema. Ex: O relatório é feito manualmente e leva 2 horas por dia." />
                    </div>
                    <div>
                      <label className="label-text">Objetivo da Solução (O que espera resolver?)</label>
                      <textarea required name="solution_objective" value={formData.solution_objective} onChange={handleInputChange} rows={3} className="input-field" placeholder="Ex: Automatizar a extração de dados para que o relatório seja gerado em 5 minutos." />
                    </div>
                  </div>
                </div>

                {/* Section 3: Impacto e Urgência */}
                <div className="glass-card p-8">
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                      <BarChart3 size={20} />
                    </div>
                    <h2 className="text-xl font-bold">Impacto e Prioridade</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="label-text">Impacto no Negócio</label>
                      <select name="business_impact" value={formData.business_impact} onChange={handleInputChange} className="input-field">
                        <option value="Baixo">Baixo</option>
                        <option value="Médio">Médio</option>
                        <option value="Alto">Alto</option>
                        <option value="Crítico">Crítico</option>
                      </select>
                    </div>
                    <div>
                      <label className="label-text">Frequência</label>
                      <select name="problem_frequency" value={formData.problem_frequency} onChange={handleInputChange} className="input-field">
                        <option value="Ocasional">Ocasional</option>
                        <option value="Semanal">Semanal</option>
                        <option value="Diário">Diário</option>
                        <option value="Constante">Constante</option>
                      </select>
                    </div>
                    <div>
                      <label className="label-text">Urgência</label>
                      <select name="urgency" value={formData.urgency} onChange={handleInputChange} className="input-field">
                        <option value="Baixa">Baixa</option>
                        <option value="Média">Média</option>
                        <option value="Alta">Alta</option>
                        <option value="Crítica">Crítica</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 4: Setores Envolvidos */}
                <div className="glass-card p-8">
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                      <Building2 size={20} />
                    </div>
                    <h2 className="text-xl font-bold">Processos e Setores Envolvidos</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {['Comercial', 'Manutenção', 'Compras', 'Almoxarifado', 'Logística', 'Financeiro', 'Marketing', 'DP', 'RH', 'PCM', 'Oficina'].map((sector) => (
                      <label key={sector} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={formData.sectors_involved.includes(sector)}
                          onChange={() => handleCheckboxChange('sectors_involved', sector)}
                          className="w-5 h-5 accent-nit-red rounded"
                        />
                        <span className="text-sm font-semibold text-gray-600">{sector}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Section 5: Sistemas */}
                <div className="glass-card p-8">
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                      <CheckSquare size={20} />
                    </div>
                    <h2 className="text-xl font-bold">Sistemas Envolvidos</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {['Excel', 'ERP', 'CRM', 'Banco de Dados', 'Planilhas Google', 'Outro'].map((system) => (
                      <label key={system} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={formData.systems_involved.includes(system)}
                          onChange={() => handleCheckboxChange('systems_involved', system)}
                          className="w-5 h-5 accent-nit-red rounded"
                        />
                        <span className="text-sm font-semibold text-gray-600">{system}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Enviando...' : (
                      <>
                        Enviar Solicitação ao NIT <Send size={20} />
                      </>
                    )}
                  </button>
                  <button type="button" onClick={() => setView('home')} className="px-8 py-4 rounded-2xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-100 transition-colors">
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {view === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto px-4 py-24 text-center"
            >
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={48} />
              </div>
              <h1 className="text-4xl font-black mb-4">Solicitação Registrada!</h1>
              <p className="text-gray-500 mb-8 text-lg">Sua demanda foi enviada com sucesso para a equipe do NIT.</p>
              
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-10">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">ID da Solicitação</p>
                <p className="text-3xl font-black text-nit-red tracking-tight">{ticketId}</p>
              </div>

              <div className="text-left space-y-4 mb-12">
                <h3 className="font-bold text-nit-dark">Próximos Passos:</h3>
                <div className="space-y-3">
                  {[
                    "Triagem técnica pelo NIT",
                    "Avaliação de viabilidade e impacto",
                    "Priorização pelo comitê estratégico",
                    "Notificação via email sobre o status"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={14} />
                      </div>
                      {text}
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => setView('home')} className="btn-primary w-full py-4">
                Voltar para a Página Inicial
              </button>
            </motion.div>
          )}

          {view === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-4 py-12"
            >
              <div className="mb-12">
                <h1 className="text-4xl font-black mb-4">Projetos <span className="text-nit-red">Desenvolvidos</span></h1>
                <p className="text-gray-500">Conheça algumas das soluções que já estão transformando a Nordeste Locações.</p>
              </div>

              {loading && (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-nit-red"></div>
                  <p className="mt-4 text-gray-500">Carregando projetos...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                  <p className="text-red-600">{error}</p>
                  <button onClick={fetchProjects} className="mt-4 text-red-600 underline hover:no-underline">
                    Tentar novamente
                  </button>
                </div>
              )}

              {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {projects.map((project) => (
                    <div key={project.id} className="glass-card overflow-hidden flex flex-col md:flex-row">
                      <div className="w-full md:w-48 bg-gray-100 relative shrink-0">
                        <img 
                          src={project.image_url} 
                          alt={project.title} 
                          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-2 py-1 bg-nit-red text-white text-[10px] font-bold uppercase tracking-wider rounded">
                            {project.tag}
                          </span>
                        </div>
                      </div>
                      <div className="p-8">
                        <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                        <p className="text-sm text-gray-500 mb-4 leading-relaxed">{project.description}</p>
                        <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold">
                          <Zap size={16} /> {project.impact}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-16 p-12 bg-nit-dark rounded-3xl text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Seu projeto pode ser o próximo!</h2>
                <p className="text-gray-400 mb-8 max-w-xl mx-auto">Tem uma ideia que pode melhorar nosso dia a dia? O NIT está aqui para transformar essa ideia em realidade.</p>
                <button onClick={() => setView('form')} className="btn-primary">
                  Solicitar Meu Projeto Agora
                </button>
              </div>
            </motion.div>
          )}

          {view === 'admin' && isAdminAuthenticated && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-7xl mx-auto px-4 py-12"
            >
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h1 className="text-4xl font-black mb-2">Painel <span className="text-nit-red">Administrativo</span></h1>
                  <p className="text-gray-500">Gerencie os projetos exibidos no portal.</p>
                </div>
                <button onClick={() => setView('home')} className="text-gray-400 hover:text-nit-red">
                  <X size={24} />
                </button>
              </div>

              <div className="glass-card p-8 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Projetos</h2>
                  <button 
                    onClick={() => {
                      setEditingProject({
                        id: 0,
                        title: '',
                        tag: '',
                        description: '',
                        impact: '',
                        image_url: ''
                      });
                      setIsProjectModalOpen(true);
                    }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Plus size={20} /> Novo Projeto
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-nit-red"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="border border-gray-200 rounded-xl p-6 flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                          <p className="text-sm text-gray-500 mb-2">{project.tag}</p>
                          <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button 
                            onClick={() => {
                              setEditingProject(project);
                              setIsProjectModalOpen(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Project Modal */}
              {isProjectModalOpen && editingProject && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">
                        {editingProject.id ? 'Editar Projeto' : 'Novo Projeto'}
                      </h2>
                      <button 
                        onClick={() => {
                          setIsProjectModalOpen(false);
                          setEditingProject(null);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    <form onSubmit={handleSaveProject} className="space-y-6">
                      <div>
                        <label className="label-text">Título</label>
                        <input 
                          required 
                          value={editingProject.title} 
                          onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                          className="input-field" 
                          placeholder="Título do projeto" 
                        />
                      </div>

                      <div>
                        <label className="label-text">Tag</label>
                        <input 
                          required 
                          value={editingProject.tag} 
                          onChange={(e) => setEditingProject({...editingProject, tag: e.target.value})}
                          className="input-field" 
                          placeholder="Categoria do projeto" 
                        />
                      </div>

                      <div>
                        <label className="label-text">Descrição</label>
                        <textarea 
                          required 
                          value={editingProject.description} 
                          onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                          rows={4}
                          className="input-field" 
                          placeholder="Descrição detalhada do projeto" 
                        />
                      </div>

                      <div>
                        <label className="label-text">Impacto</label>
                        <input 
                          required 
                          value={editingProject.impact} 
                          onChange={(e) => setEditingProject({...editingProject, impact: e.target.value})}
                          className="input-field" 
                          placeholder="Ex: Redução de 50% no tempo de processamento" 
                        />
                      </div>

                      <div>
                        <label className="label-text">URL da Imagem</label>
                        <input 
                          required 
                          value={editingProject.image_url} 
                          onChange={(e) => setEditingProject({...editingProject, image_url: e.target.value})}
                          className="input-field" 
                          placeholder="https://exemplo.com/imagem.jpg" 
                        />
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button type="submit" className="btn-primary flex-1">
                          {editingProject.id ? 'Atualizar' : 'Criar'} Projeto
                        </button>
                        <button 
                          type="button" 
                          onClick={() => {
                            setIsProjectModalOpen(false);
                            setEditingProject(null);
                          }}
                          className="px-6 py-3 rounded-xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Password Modal */}
          {showPasswordModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                    <Lock size={20} />
                  </div>
                  <h2 className="text-xl font-bold">Acesso Administrativo</h2>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-6">
                  <div>
                    <label className="label-text">Senha</label>
                    <input 
                      type="password" 
                      value={adminPassword} 
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="input-field" 
                      placeholder="Digite a senha de administrador"
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="submit" className="btn-primary flex-1">
                      Entrar
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowPasswordModal(false);
                        setAdminPassword('');
                      }}
                      className="px-6 py-3 rounded-xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-nit-dark text-white mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-nit-red rounded-lg flex items-center justify-center">
                  <Lightbulb size={20} />
                </div>
                <span
                  className="text-2xl font-black tracking-tighter cursor-pointer select-none"
                  onClick={handleNitClick} // gatilho admin
                >
                  NIT
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Núcleo de Inteligência e Tecnologia da Nordeste Locações. 
                Transformando processos em soluções digitais.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-4">Navegação</h4>
              <ul className="space-y-3">
                <li><button onClick={() => setView('home')} className="text-gray-300 hover:text-white transition-colors text-sm">Início</button></li>
                <li><button onClick={() => setView('projects')} className="text-gray-300 hover:text-white transition-colors text-sm">Projetos</button></li>
                <li><button onClick={() => setView('form')} className="text-gray-300 hover:text-white transition-colors text-sm">Solicitar Projeto</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-4">Contato</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-2"><Mail size={14} /> nit@nordesteloc.com.br</li>
                <li className="flex items-center gap-2"><Building2 size={14} /> Nordeste Locações</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs">© {new Date().getFullYear()} NIT — Nordeste Locações. Todos os direitos reservados.</p>
            <p className="text-gray-600 text-xs">v1.0.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
