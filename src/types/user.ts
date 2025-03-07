// import type { UserRole } from "../services/supabase";

export interface User {
  id: string;
  email: string;
  name: string | null;
  // role: UserRole;
  avatar_url: string | null;
  company_id: string | null;
  created_at: string;
}
