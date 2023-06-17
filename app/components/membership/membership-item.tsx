'use client'

import { MembershipType } from '@/app/components/types'
import Image from 'next/image'
import Loading from '@/app/loading'
import useStore from '@/store'

// メンバーシップアイテム
const MembershipItem = ({
  loading,
  handleJoin,
  membership,
}: {
  loading: string
  handleJoin: (membership_id: string, price_id: string) => void
  membership: MembershipType
}) => {
  const { user } = useStore()

  return (
    <div className="border rounded-lg shadow-lg shadow-gray-100">
      <div className="relative w-full h-[150px] mb-5">
        <Image
          src={membership.image_url ? membership.image_url : '/noimage.png'}
          className="object-cover rounded-t-lg"
          alt="post"
          fill
        />
      </div>

      <div className="m-2">
        <div className="text-center font-bold mb-3">{membership.title}</div>
        <div className="text-center mb-3 font-bold">{`月${membership.price}円`}</div>

        <div className="text-center mb-5">
          {loading === membership.id ? (
            <Loading />
          ) : user.id ? (
            <div
              className="bg-red-500 text-white rounded-full py-1 w-32 inline-block cursor-pointer"
              onClick={() => handleJoin(membership.id, membership.price_id)}
            >
              参加
            </div>
          ) : (
            <div className="bg-gray-500 text-white rounded-full py-1 w-32 inline-block">参加</div>
          )}
        </div>

        <div className="break-words whitespace-pre-wrap">{membership.content}</div>
      </div>
    </div>
  )
}

export default MembershipItem
