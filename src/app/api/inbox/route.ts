import { NextResponse } from 'next/server'
import { getAuthContext, isAuthError, isDemoMode } from '@/lib/api/auth'

export async function GET() {
  if (isDemoMode()) {
    return NextResponse.json({ data: [] })
  }

  const auth = await getAuthContext()
  if (isAuthError(auth)) return auth

  const { supabase, tenantId } = auth
  const { data, error } = await supabase
    .from('inbox_messages')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ data: [] })
  return NextResponse.json({ data: data ?? [] })
}
