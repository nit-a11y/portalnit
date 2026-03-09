import { supabase } from './supabase';

export interface Project {
  id: number;
  title: string;
  tag: string;
  description: string;
  impact: string;
  image_url: string;
  created_at?: string;
}

export interface Request {
  id: number;
  ticket_id: string;
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
  status: string;
  created_at?: string;
}

// Projects API
export const projectsAPI = {
  getAll: async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  create: async (project: Omit<Project, 'id' | 'created_at'>): Promise<{ success: boolean; id?: number }> => {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select();
    
    if (error) throw error;
    return { success: true, id: data?.[0]?.id };
  },

  update: async (id: number, project: Partial<Project>): Promise<{ success: boolean }> => {
    const { error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  delete: async (id: number): Promise<{ success: boolean }> => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }
};

// Requests API
export const requestsAPI = {
  getAll: async (): Promise<Request[]> => {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  create: async (request: Omit<Request, 'id' | 'ticket_id' | 'status' | 'created_at'>): Promise<{ success: boolean; ticketId?: string }> => {
    // Generate ticket ID
    const year = new Date().getFullYear();
    const { data: existingRequests } = await supabase
      .from('requests')
      .select('id')
      .like('ticket_id', `NIT-${year}%`);
    
    const count = existingRequests?.length || 0;
    const ticketId = `NIT-${year}-${(count + 1).toString().padStart(3, '0')}`;

    const { error } = await supabase
      .from('requests')
      .insert([{
        ...request,
        ticket_id: ticketId,
        status: 'Recebido'
      }]);
    
    if (error) throw error;
    return { success: true, ticketId };
  }
};
