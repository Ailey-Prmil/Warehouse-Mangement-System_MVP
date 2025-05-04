import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface BackButtonProps {
  href: string
}

export function BackButton({ href }: BackButtonProps) {
  return (
    <Button asChild variant="ghost" size="icon" className="h-9 w-9">
      <Link href={href}>
        <ArrowLeft className="h-5 w-5" />
      </Link>
    </Button>
  )
}
