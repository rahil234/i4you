'use client'

import api from '@/lib/api';

export async function subscribeUser(sub: PushSubscription) {
  await api.post('notification/subscribe', sub)
  return { success: true }
}

export async function unsubscribeUser() {
  await api.post('/notification/unsubscribe')
  return { success: true }
}

export async function sendNotification(message: string) {
  await api.post('/notification/send-notification', { message })
  return { success: true }
}
