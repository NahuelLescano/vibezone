import { UserButton } from "@clerk/nextjs";
import { createOrUpdateUser } from "@lib/actions/user";

export default function Home(){

  return(
    <div className="h-screen">
      <UserButton afterSignOutUrl="/"/>
    </div>
  )
}