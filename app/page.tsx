'use client'
import { useAuth } from '@/context/AuthContext';
import cntl from 'cntl';
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';

export const runtime = 'edge';
const classes = {
  backdrop: cntl`

  `,
  container: 'container',
  sun: 'sun',
  water: 'water',
  fishy: 'fishy',
}
export default function Home() {
  const router = useRouter()
  const { token, user } = useAuth()

  const handleClick = () => {
    router.replace('/login')
  }

  useEffect(() => {
      if (!token) {
        console.log("No token found", token, user)
          router.replace('/login')
      } else {
        console.log("Token found", token, user)
          router.replace('/chat')
      }
  }, [token])
  return (
    <main className="min-h-screen relative overflow-hidden">
      <section className="backdrop">
        <button className="heading" onClick={handleClick}>Log in to connect other fish</button>
      </section>

      <section className="absolute h-screen w-full text-center top-0">
        <div className="water"></div>
        <div className="fishy"></div>
      </section>
    </main>
  )
}
