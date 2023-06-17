'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MembershipType } from '@/app/components/types'
import axios from 'axios'
import useStore from '@/store'
import MembershipItem from '@/app/components/membership/membership-item'

// メンバーシップ詳細
const MembershipDetail = ({
  memberships,
  memberId,
}: {
  memberships: MembershipType[] | null
  memberId: string
}) => {
  const router = useRouter()
  const [loading, setLoading] = useState('')
  const { user } = useStore()

  // メンバーシップに参加する
  const handleJoin = async (membership_id: string, price_id: string) => {
    setLoading(membership_id)

    try {
      // ユーザーIDがない場合は処理を終了
      if (!user.id) {
        return
      }

      // チェックアウトを作成するAPIをコール
      const res = await axios.post('/api/create-checkout', {
        user_id: user.id,
        name: user.name,
        member_id: memberId,
        membership_id,
        customer: user.customer_id ? user.customer_id : 'new',
        email: user.email,
        price_id,
      })

      // チェックアウトのURLを取得
      const url = res.data.response

      // チェックアウトを開く
      if (url) {
        router.push(url)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading('')
    }
  }

  return (
    <div>
      {memberships && memberships.length !== 0 ? (
        <div>
          <div className="text-center font-bold text-xl mb-5">メンバーシップを選択</div>
          <div className="grid grid-cols-2 gap-5">
            {memberships.map((membership, index) => (
              <MembershipItem
                key={index}
                loading={loading}
                handleJoin={handleJoin}
                membership={membership}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center">メンバーシップはありません</div>
      )}
    </div>
  )
}

export default MembershipDetail
