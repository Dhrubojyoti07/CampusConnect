import { Suspense } from 'react'
import SignupPage from './signup'

export default function Page() {
  return (
    <Suspense fallback={<div className="shell" style={{ padding: '60px 0', textAlign: 'center' }}>Loading...</div>}>
      <SignupPage />
    </Suspense>
  )
}

