import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex align-middle justify-center pt-8">
        <SignIn />
    </div>
  ) 
}