import { Suspense } from 'react'
import LoginPage from './login'

export default function Page() {
  return (
    <Suspense fallback={<div className="shell" style={{ padding: '60px 0', textAlign: 'center' }}>Loading...</div>}>
      <LoginPage />
    </Suspense>
  )
}

