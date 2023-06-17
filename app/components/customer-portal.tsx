'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import Loading from '@/app/loading'
import axios from 'axios'
import useStore from '@/store'

// カスタマーポータル
const CustomerPortal = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { user } = useStore()

  // カスタマーポータルを開く
  const openCustomerPortal = async () => {
    setLoading(true)

    try {
      // 顧客IDがない場合は処理を終了
      if (!user.customer_id) {
        return
      }

      // カスタマーポータルを開くAPIをコール
      const res = await axios.post('/api/customer-portal', {
        customer_id: user.customer_id,
      })

      // カスタマーポータルのURLを取得
      const url = res.data.response

      // カスタマーポータルを開く
      if (url) {
        router.push(url)
      }
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="text-center font-bold text-xl mb-10">カスタマーポータル</div>
      <div className="mb-5">カスタマーポータルでは、下記のことができます。</div>
      <ul className="list-disc list-inside mb-5">
        <li>ご請求を確認する</li>
        <li>お支払い方法を変更する</li>
        <li>定期支払いをキャンセルする</li>
        <li>請求履歴を確認する</li>
        <li>領収書をダウンロードする</li>
        <li>インボイスをダウンロードする</li>
      </ul>

      <div className="mb-5">
        {loading ? (
          <Loading />
        ) : (
          <div
            className="text-center cursor-pointer font-bold bg-sky-500 hover:brightness-95 w-full rounded-full p-2 text-white text-sm"
            onClick={openCustomerPortal}
          >
            カスタマーポータルを開く
          </div>
        )}
      </div>

      {message && <div className="my-5 text-center text-sm text-red-500">{message}</div>}
    </div>
  )
}

export default CustomerPortal
