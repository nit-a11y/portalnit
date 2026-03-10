import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Usa service_role para operações server-side (bypassa RLS quando necessário)
export const supabase = createClient(supabaseUrl, supabaseKey);
