"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronUp, ChevronsUpDown, Filter } from "lucide-react"
import { useIrisData } from "./iris-data-provider"
import { Badge } from "@/components/ui/badge"

export function IrisDataTable() {
  const { data } = useIrisData()
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [filterValue, setFilterValue] = useState("")
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([])
  const rowsPerPage = 10

  // Get unique species for filtering
  const uniqueSpecies = Array.from(new Set(data.map((item) => item.species))).sort()

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Filter and sort data
  const filteredData = data.filter((item) => {
    const matchesFilter =
      filterValue === "" ||
      Object.values(item).some(
        (val) => val !== null && val.toString().toLowerCase().includes(filterValue.toLowerCase()),
      )

    const matchesSpecies = selectedSpecies.length === 0 || selectedSpecies.includes(item.species)

    return matchesFilter && matchesSpecies
  })

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn as keyof typeof a]
    const bValue = b[sortColumn as keyof typeof b]

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return sortDirection === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue))
  })

  // Pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage)
  const paginatedData = sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return <ChevronsUpDown className="ml-2 h-4 w-4" />
    return sortDirection === "asc" ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Пошук..."
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="max-w-xs"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Види фільтрів</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {uniqueSpecies.map((species) => (
                <DropdownMenuCheckboxItem
                  key={species}
                  checked={selectedSpecies.includes(species)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedSpecies([...selectedSpecies, species])
                    } else {
                      setSelectedSpecies(selectedSpecies.filter((s) => s !== species))
                    }
                  }}
                >
                  {species}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          {selectedSpecies.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedSpecies.map((species) => (
                <Badge key={species} variant="secondary" className="flex items-center gap-1">
                  {species}
                  <button
                    onClick={() => setSelectedSpecies(selectedSpecies.filter((s) => s !== species))}
                    className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                  >
                    ✕
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>
                <button className="flex items-center font-semibold" onClick={() => handleSort("species")}>
                  Види півників {getSortIcon("species")}
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button className="flex items-center font-semibold ml-auto" onClick={() => handleSort("sepalLength")}>
                  Довжина зовнішньої частки оцвітини {getSortIcon("sepalLength")}
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button className="flex items-center font-semibold ml-auto" onClick={() => handleSort("sepalWidth")}>
                  Ширина зовнішньої частки оцвітини {getSortIcon("sepalWidth")}
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button className="flex items-center font-semibold ml-auto" onClick={() => handleSort("petalLength")}>
                  Довжина внутрішньої частки оцвітини {getSortIcon("petalLength")}
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button className="flex items-center font-semibold ml-auto" onClick={() => handleSort("petalWidth")}>
                  Ширина внутрішньої частки оцвітини {getSortIcon("petalWidth")}
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center font-medium">
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="bg-gray-200">{row.species}</TableCell>
                  <TableCell className="text-right">{row.sepalLength}</TableCell>
                  <TableCell className="text-right">{row.sepalWidth}</TableCell>
                  <TableCell className="text-right">{row.petalLength}</TableCell>
                  <TableCell className="text-right">{row.petalWidth}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Немає результатів.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {paginatedData.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to{" "}
          {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Попередня
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <Button
                  key={i}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Наступна
          </Button>
        </div>
      </div>
    </div>
  )
}
