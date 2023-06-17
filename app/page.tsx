import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import PostItem from '@/app/components/post/post-item'
import type { Database } from '@/lib/database.types'
import type { SubscriptionType } from '@/app/components/types'

// メインページ
const Home = async () => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  })

  // セッションの取得
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 投稿を取得
  const { data: postData } = await supabase
    .from('posts')
    .select('*, profiles(name, avatar_url), memberships(title)')
    .order('created_at', { ascending: false })

  // 投稿がない場合
  if (!postData || postData.length === 0) {
    return <div className="text-center">投稿はありません</div>
  }

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
    <div>
      {postData.map((post, index) => {
        // サブスクリプションの判定
        const isSubscriber =
          post.membership_id === null || session?.user.id === post.profile_id
            ? true
            : subscriptions!.some(
                (item) =>
                  item.membership_id === post.membership_id &&
                  new Date(item.current_period_end!) >= new Date()
              )

        return <PostItem key={index} post={post} isSubscriber={isSubscriber} />
      })}
    </div>
  )
}

export default Home
