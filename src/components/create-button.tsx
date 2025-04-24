import Link from "next/link"
import { Button } from "@/components/ui/button"

interface CreateButtonProps {
  href: string
}

export function CreateButton({ href }: CreateButtonProps) {
  return (
    <Button asChild className="bg-blue-600 hover:bg-blue-700">
      <Link href={href}>Create</Link>
    </Button>
  )
}
