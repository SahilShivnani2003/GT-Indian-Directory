"use client"

import {  useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, ChevronDown } from "lucide-react"
import { City } from "@/types/CityState"

type searchProps = {
  cities : City[];
}
export function SearchBar({ cities }: searchProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("all")
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (location !== "all") params.set("location", location)
    router.push(`/listings?${params.toString()}`)
  }

  const selectedLabel = location === "all" ? "All Locations" : cities.find(c => c.name.toLowerCase() === location)?.name || "All Locations"

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-2xl flex-col gap-2 sm:flex-row sm:gap-0">
      <div className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex w-full items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground sm:w-48 sm:rounded-l-lg sm:rounded-r-none sm:border-r-0"
        >
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="flex-1 text-left">{selectedLabel}</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
            <div className="absolute left-0 top-full z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-border bg-card py-1 shadow-lg sm:w-48">
              <button
                type="button"
                className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-secondary"
                onClick={() => { setLocation("all"); setDropdownOpen(false) }}
              >
                All Locations
              </button>
              {cities.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  className="flex w-full items-center px-4 py-2 text-sm text-foreground hover:bg-secondary"
                  onClick={() => { setLocation(city.name.toLowerCase()); setDropdownOpen(false) }}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="relative flex flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search services, businesses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary sm:rounded-none sm:border-x-0"
        />
      </div>
      <button
        type="submit"
        className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:rounded-l-none sm:rounded-r-lg"
      >
        Search
      </button>
    </form>
  )
}
