import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { SubscriptionType } from '@/app/components/types'
import MemberDetail from '@/app/components/member/member-detail'
import type { Database } from '@/lib/database.types'
type PageProps = {
  params: {
    memberId: string
  }
}

// メンバー詳細ページ
const MemberDetailPage = async ({ params }: PageProps) => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  // セッションの取得
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // プロフィールを取得
  const { data: profileData } = await supabase
    .from('profiles')
    .select('id, name, introduce, avatar_url')
    .eq('id', params.memberId)
    .single()

  // プロフィールがない場合
  if (!profileData) {
    return <div className="text-center">プロフィールがありません</div>
  }

  // 投稿を取得
  const { data: postData } = await supabase
    .from('posts')
    .select('*, profiles(name, avatar_url), memberships(title)')
    .eq('profile_id', params.memberId)
    .order('created_at', { ascending: false })

  // メンバーシップを取得
  const { data: membershipData } = await supabase
    .from('memberships')
    .select('*')
    .eq('profile_id', params.memberId)
    .order('created_at', { ascending: false })

  // サブスクリプションを取得
  let subscriptions: SubscriptionType[] | null = []
  // ログインしていない場合は空配列
  if (session) {
    const { data: subscriptionData } = await supabase
      .from('subscriptions')
      .select('membership_id, current_period_end')
      .eq('profile_id', session.user.id)
    subscriptions = subscriptionData
  }

  return (
    <MemberDetail
      posts={postData}
      memberId={params.memberId}
      memberships={membershipData}
      profile={profileData}
      subscriptions={subscriptions}
    />
  )
}

export default MemberDetailPage
