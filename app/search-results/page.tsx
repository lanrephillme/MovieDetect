"use client"

import { SearchPlaceholder } from "@/components/search-placeholder"
import { useSearchParams } from "next/navigation"

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const type = searchParams.get("type") || "text"

  return <SearchPlaceholder searchQuery={query} searchType={type} onClose={() => window.history.back()} />
}
