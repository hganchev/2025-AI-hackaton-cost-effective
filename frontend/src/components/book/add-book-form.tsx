"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useBooks } from "@/lib/books-context"
import { Book } from "@/types/index"

export function AddBookForm() {
  const router = useRouter()
  const { categories, addBook } = useBooks()
  
  const [formData, setFormData] = useState<Omit<Book, "id">>({
    title: "",
    author: "",
    coverImage: "",
    description: "",
    category: "",
    year: undefined
  })
  
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    
    // Специална обработка за годината
    if (name === "year") {
      if (!value) {
        setFormData(prev => ({ ...prev, year: undefined }))
      } else {
        const yearValue = parseInt(value, 10)
        if (!isNaN(yearValue)) {
          setFormData(prev => ({ ...prev, year: yearValue }))
        }
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    
    if (!formData.title || !formData.author || !formData.description) {
      setError("Заглавие, автор и описание са задължителни полета.")
      setIsSubmitting(false)
      return
    }
    
    try {
      const newBook = addBook(formData)
      router.push(`/book/${newBook.id}`)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Възникна грешка при добавянето на книгата.")
      }
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Добавете нова книга</h1>
        <p className="text-muted-foreground mt-2">
          Попълнете информацията за книгата, която искате да добавите
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-900 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Заглавие *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Заглавие на книгата"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="author" className="text-sm font-medium">
              Автор *
            </label>
            <input
              id="author"
              name="author"
              type="text"
              value={formData.author}
              onChange={handleChange}
              required
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Име на автора"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Категория
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Изберете категория</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="year" className="text-sm font-medium">
              Година на издаване
            </label>
            <input
              id="year"
              name="year"
              type="number"
              value={formData.year || ""}
              onChange={handleChange}
              min={1000}
              max={new Date().getFullYear()}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Година на издаване"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="coverImage" className="text-sm font-medium">
              URL на корицата
            </label>
            <input
              id="coverImage"
              name="coverImage"
              type="url"
              value={formData.coverImage}
              onChange={handleChange}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="https://example.com/book-cover.jpg"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="description" className="text-sm font-medium">
              Описание *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Кратко описание на книгата"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button 
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Отказ
          </Button>
          
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Добавяне..." : "Добави книга"}
          </Button>
        </div>
      </form>
    </div>
  )
} 