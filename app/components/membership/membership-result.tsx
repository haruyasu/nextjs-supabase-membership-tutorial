'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Loading from '@/app/loading'
import Stripe from 'stripe'
import Link from 'next/link'

// 支払い完了
const MembershipResult = () => {
  const searchParams = useSearchParams()
  const session_id = searchParams.get('session_id')
  const [checkoutSession, setCheckoutSession] = useState<Stripe.Checkout.Session | null>(null)
  const [loading, setLoading] = useState(false)

  // チェックアウトセッション詳細の取得
  useEffect(() => {
    const fn = async () => {
      setLoading(true)

      try {
        // チェックアウトセッション詳細の取得APIをコール
        const res = await axios.post('/api/retrieve-checkout', {
          session_id,
        })

        // チェックアウトセッションを取得
        setCheckoutSession(res.data.response)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    if (session_id) {
      fn()
    }
  }, [session_id])

  return (
    <div className="max-w-[400px] mx-auto">
      {loading ? (
        <Loading />
      ) : checkoutSession ? (
        <div className="text-center">
          <div className="text-2xl mb-5">お支払いが完了しました</div>
          <div className="text-2xl mb-5 font-bold">{checkoutSession.amount_total}円/月</div>
          <div className="mb-5">領収書は、カスタマーポータルから発行できます。</div>
          <Link href="/settings/customer-portal">
            <div className="font-bold bg-sky-500 hover:brightness-95 w-full rounded-full p-2 text-white text-sm">
              カスタマーポータル
            </div>
          </Link>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default MembershipResult
