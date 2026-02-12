"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface SignaturePadProps {
  open: boolean
  onClose: () => void
  onSave: (signature: string) => void
  language: "en" | "pt" | "es"
}

export function SignaturePad({ open, onClose, onSave, language }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)

  const labels = {
    en: {
      title: "Sign Here",
      description: "Draw your signature below",
      clear: "Clear",
      save: "Save Signature",
      cancel: "Cancel",
    },
    pt: {
      title: "Assine Aqui",
      description: "Desenhe sua assinatura abaixo",
      clear: "Limpar",
      save: "Salvar Assinatura",
      cancel: "Cancelar",
    },
    es: {
      title: "Firme Aquí",
      description: "Dibuje su firma a continuación",
      clear: "Borrar",
      save: "Guardar Firma",
      cancel: "Cancelar",
    },
  }

  const t = labels[language]

  useEffect(() => {
    if (!open) return

    const canvas = canvasRef.current
    if (!canvas) return

    // Wait for dialog animation to complete
    setTimeout(() => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Set drawing style
      ctx.strokeStyle = "#000000"
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
    }, 100)
  }, [open])

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

    // Calculate exact position relative to canvas
    const x = (clientX - rect.left) * (canvas.width / rect.width)
    const y = (clientY - rect.top) * (canvas.height / rect.height)

    return { x, y }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()

    const canvas = canvasRef.current
    if (!canvas) return

    setIsDrawing(true)
    setHasDrawn(true)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { x, y } = getCoordinates(e)

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    e.preventDefault()

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { x, y } = getCoordinates(e)

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
  }

  const saveSignature = () => {
    const canvas = canvasRef.current
    if (!canvas || !hasDrawn) return

    const dataUrl = canvas.toDataURL("image/png")
    onSave(dataUrl)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle className="text-2xl">{t.title}</DialogTitle>
        <DialogDescription>{t.description}</DialogDescription>
      </DialogHeader>

      <DialogContent className="max-w-2xl">
        <div className="space-y-4">
          <div className="relative border-2 border-border rounded-lg overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              className="w-full h-64 cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={clearCanvas} className="gap-2 bg-transparent">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {t.clear}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              {t.cancel}
            </Button>
            <Button type="button" onClick={saveSignature} disabled={!hasDrawn}>
              {t.save}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
