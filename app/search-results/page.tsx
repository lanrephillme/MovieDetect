"use client"

import { SearchPlaceholder } from "@/components/search-placeholder"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""
  const type = searchParams.get("type") || "text"

  const handleClose = () => {
    router.push("/")
  }

  return <SearchPlaceholder searchQuery={query} searchType={type} onClose={handleClose} />
}
