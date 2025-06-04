"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check, MessageCircle } from "lucide-react"

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  url: string
  title: string
}

export function ShareDialog({ open, onOpenChange, url, title }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const shareToX = () => {
    const text = encodeURIComponent(`${title}\n${url}`)
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank")
  }

  const shareToFacebook = () => {
    const shareUrl = encodeURIComponent(url)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, "_blank")
  }

  const shareToLine = () => {
    const text = encodeURIComponent(`${title}\n${url}`)
    window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${text}`, "_blank")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>プロフィールをシェア</DialogTitle>
          <DialogDescription>作成したプロフィールページを友達や家族とシェアしましょう。</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* URL コピー */}
          <div className="space-y-2">
            <label className="text-sm font-medium">プロフィールURL</label>
            <div className="flex gap-2">
              <Input value={url} readOnly className="flex-1" />
              <Button onClick={copyToClipboard} size="sm" variant="outline">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* SNS シェアボタン */}
          <div className="space-y-2">
            <label className="text-sm font-medium">SNSでシェア</label>
            <div className="grid grid-cols-3 gap-2">
              <Button onClick={shareToX} variant="outline" className="flex items-center gap-2">
                <div className="w-4 h-4 bg-black rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">X</span>
                </div>
                X
              </Button>
              <Button onClick={shareToFacebook} variant="outline" className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">f</span>
                </div>
                Facebook
              </Button>
              <Button onClick={shareToLine} variant="outline" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-500" />
                LINE
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
