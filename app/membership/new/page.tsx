import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import MembershipNew from '@/app/components/membership/membership-new'
import type { Database } from '@/lib/database.types'

// 新規メンバーシップページ
const MembershipNewPage = async () => {
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

  return <MembershipNew />
}

export default MembershipNewPage
