'use client'

import { useCallback, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Loading from '@/app/loading'
import useStore from '@/store'
import axios from 'axios'
import * as z from 'zod'
import type { Database } from '@/lib/database.types'
type Schema = z.infer<typeof schema>

// 入力データの検証ルールを定義
const schema = z.object({
  title: z.string().min(2, { message: '2文字以上入力する必要があります。' }),
  price: z.number().min(300, { message: '価格は300円以上である必要があります。' }),
  content: z.string().min(2, { message: '2文字以上入力する必要があります。' }),
})

// 新規メンバーシップ
const MembershipNew = () => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [fileMessage, setFileMessage] = useState('')
  const { user } = useStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // 初期値
    defaultValues: {
      title: '',
      price: 300,
      content: '',
    },
    // 入力値の検証
    resolver: zodResolver(schema),
  })

  // 画像アップロード
  const onUploadImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    setFileMessage('')

    // ファイルが選択されていない場合
    if (!files || files?.length == 0) {
      setFileMessage('画像をアップロードしてください。')
      return
    }

    const fileSize = files[0]?.size / 1024 / 1024 // size in MB
    const fileType = files[0]?.type // MIME type of the file

    // 画像サイズが2MBを超える場合
    if (fileSize > 2) {
      setFileMessage('画像サイズを2MB以下にする必要があります。')
      return
    }

    // ファイル形式がjpgまたはpngでない場合
    if (fileType !== 'image/jpeg' && fileType !== 'image/png') {
      setFileMessage('画像はjpgまたはpng形式である必要があります。')
      return
    }

    // 画像をセット
    setImage(files[0])
  }, [])

  // 送信
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    setLoading(true)
    setMessage('')

    try {
      // ユーザーIDが取得できない場合、処理を終了
      if (!user.id) {
        return
      }

      let image_url = ''

      if (image) {
        // supabaseストレージに画像アップロード
        const { data: storageData, error: storageError } = await supabase.storage
          .from('memberships')
          .upload(`${user.id}/${uuidv4()}`, image)

        // エラーチェック
        if (storageError) {
          setMessage('画像アップロードにエラーが発生しました。' + storageError.message)
          return
        }

        // 画像のURLを取得
        const { data: urlData } = await supabase.storage
          .from('memberships')
          .getPublicUrl(storageData.path)

        image_url = urlData.publicUrl
      }

      // Stripeの商品を作成
      const res = await axios.post('/api/create-product', {
        title: data.title,
        price: data.price,
        user_id: user.id,
        name: user.name,
      })

      // price_idを取得
      const price_id = res.data.response

      // メンバーシップ作成
      const { error: insertError } = await supabase.from('memberships').insert({
        profile_id: user.id,
        title: data.title,
        price: data.price,
        content: data.content,
        price_id,
        image_url,
      })

      // エラーチェック
      if (insertError) {
        setMessage('メンバーシップ作成にエラーが発生しました。' + insertError.message)
        return
      }

      router.push('/member/' + user.id)
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
    } finally {
      setLoading(false)
      router.refresh()
    }
  }

  return (
    <div>
      <div className="text-center font-bold text-xl mb-10">メンバーシップ作成</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 画像 */}
        <div className="mb-5">
          <input type="file" id="image" onChange={onUploadImage} />
          {fileMessage && <div className="text-center text-red-500 my-5">{fileMessage}</div>}
        </div>

        {/* タイトル */}
        <div className="mb-5">
          <div className="text-sm mb-1 font-bold">タイトル</div>
          <input
            type="text"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="タイトル"
            id="title"
            {...register('title', { required: true })}
            required
          />
          <div className="my-3 text-center text-sm text-red-500">{errors.title?.message}</div>
        </div>

        {/* 月額 */}
        <div className="mb-5">
          <div className="text-sm mb-1 font-bold">月額</div>
          <input
            type="number"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="月額"
            id="price"
            {...register('price', { required: true, setValueAs: (value) => parseInt(value, 10) })}
          />
          <div className="my-3 text-center text-sm text-red-500">{errors.price?.message}</div>
        </div>

        {/* 内容 */}
        <div className="mb-5">
          <div className="text-sm mb-1 font-bold">内容</div>
          <textarea
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="内容"
            id="content"
            {...register('content', { required: true })}
            rows={5}
          />
          <div className="my-3 text-center text-sm text-red-500">{errors.content?.message}</div>
        </div>

        {/* 作成ボタン */}
        <div className="mb-5">
          {loading ? (
            <Loading />
          ) : (
            <button
              type="submit"
              className="font-bold bg-sky-500 hover:brightness-95 w-full rounded-full p-2 text-white text-sm"
            >
              作成
            </button>
          )}
        </div>
      </form>

      {/* メッセージ */}
      {message && <div className="my-5 text-center text-red-500 mb-5">{message}</div>}
    </div>
  )
}

export default MembershipNew
