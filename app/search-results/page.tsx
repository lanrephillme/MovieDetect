"use client"

import { useSearchParams } from "next/navigation"
import { SearchPlaceholder } from "@/components/search-placeholder"

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const type = (searchParams.get("type") as "text" | "voice" | "image" | "audio" | "video" | "face") || "text"

  return <SearchPlaceholder searchType={type} query={query} />
}
