'use client'

import { format } from 'date-fns'
import { PostWithProfileType } from '@/app/components/types'
import Image from 'next/image'
import Link from 'next/link'

// 投稿詳細
const PostDetail = ({
  post,
  isSubscriber,
}: {
  post: PostWithProfileType
  isSubscriber: boolean
}) => {
  return (
    <div>
      <Link href={`/member/${post.profile_id}`}>
        <div className="inline-flex items-center space-x-2 mb-5">
          <div className="relative w-10 h-10">
            <Image
              src={post.profiles?.avatar_url ? post.profiles.avatar_url : '/default.png'}
              className="rounded-full object-cover"
              alt="avatar"
              fill
            />
          </div>
          <div>
            <div className="font-bold">{post.profiles?.name}</div>
            <div className="text-sm text-gray-500">
              {format(new Date(post.created_at), 'yyyy/MM/dd HH:mm')}
            </div>
          </div>
        </div>
      </Link>

      <div className="mb-5 flex items-center space-x-1">
        <div className="font-bold text-lg">{post.title}</div>
        <div className="text-sm text-gray-500">
          - {post.memberships ? post.memberships.title : '公開'}
        </div>
      </div>

      <div className="relative w-full h-[350px]">
        <Image
          src={
            isSubscriber ? (post.image_url ? post.image_url : '/noimage.png') : '/subscribers.png'
          }
          className="object-cover rounded-lg"
          alt="post"
          fill
        />
      </div>

      {isSubscriber ? (
        <div className="my-5 leading-relaxed break-words whitespace-pre-wrap">{post.content}</div>
      ) : (
        <div className="my-5 text-center">メンバーシップ登録をお願いします</div>
      )}
    </div>
  )
}

export default PostDetail
