import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import MembershipResult from '@/app/components/membership/membership-result'
import type { Database } from '@/lib/database.types'

// 支払い完了ページ
const MembershipResultPage = async () => {
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

  return <MembershipResult />
}

export default MembershipResultPage
