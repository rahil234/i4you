"use client"

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation"
import { subscribeUser, unsubscribeUser } from '@/utils/push-notification.utils';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(() => {
        console.log("SW registered")
        if ("PushManager" in window) {
          console.log("PushManager is supported")
          subscribeToPush()
        } else {
          console.warn("PushManager is not supported")
        }
        router.push("/discover")
      })
    } else {
      router.push("/discover")
    }
  }, [router])

  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  )

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    })
    setSubscription(sub)
    const serializedSub = JSON.parse(JSON.stringify(sub))
    await subscribeUser(serializedSub)
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe()
    setSubscription(null)
    await unsubscribeUser()
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-xl font-bold">Loading…</h1>
    </div>
  )
}
