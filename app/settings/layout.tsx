'use client'

import { useEffect, useState } from 'react'
import {
  UserCircleIcon,
  EnvelopeIcon,
  KeyIcon,
  CreditCardIcon,
  ArrowLeftOnRectangleIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import useStore from '@/store'

// レイアウト
const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const { user } = useStore()
  const [userId, setUserId] = useState('')

  useEffect(() => {
    if (user.id) {
      setUserId(user.id)
    }
  }, [user])

  // ナビゲーション
  const subNavigation = [
    {
      name: 'プロフィール',
      icon: UserCircleIcon,
      href: '/settings/profile',
    },
    {
      name: 'マイページ',
      icon: ComputerDesktopIcon,
      href: userId ? `/member/${userId}` : '/',
    },
    {
      name: 'メールアドレス',
      icon: EnvelopeIcon,
      href: '/settings/email',
    },
    {
      name: 'パスワード',
      icon: KeyIcon,
      href: '/settings/password',
    },
    {
      name: 'カスタマーポータル',
      icon: CreditCardIcon,
      href: '/settings/customer-portal',
    },
    {
      name: 'ログアウト',
      icon: ArrowLeftOnRectangleIcon,
      href: '/settings/logout',
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="col-span-1 text-sm space-y-1 font-bold flex flex-col">
        {subNavigation.map((item, index) => (
          <Link href={item.href} key={index}>
            <div
              className={`${
                item.href == pathname && 'bg-sky-100 text-sky-500'
              } hover:bg-sky-100 px-3 py-2 rounded-full`}
            >
              <item.icon className="inline-block w-5 h-5 mr-2" />
              {item.name}
            </div>
          </Link>
        ))}
      </div>
      <div className="col-span-2">{children}</div>
    </div>
  )
}

export default SettingsLayout
