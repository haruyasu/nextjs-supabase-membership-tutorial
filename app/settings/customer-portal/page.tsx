import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import CustomerPortal from '@/app/components/customer-portal'
import type { Database } from '@/lib/database.types'

// カスタマーポータルページ
const CustomerPortalPage = async () => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  // セッションの取得
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 未認証の場合、リダイレクト
  if (!session) {
    redirect('/auth/login')
  }

  return <CustomerPortal />
}

export default CustomerPortalPage
