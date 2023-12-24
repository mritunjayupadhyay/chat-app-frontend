import Image from 'next/image'

export const runtime = 'edge';
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>Chat App</p>
    </main>
  )
}
