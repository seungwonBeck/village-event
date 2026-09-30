import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase 클라이언트 초기화
 * 환경 변수가 설정되어 있지 않아도 로컬/오프라인 모드로 안전하게 폴백 동작합니다.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
