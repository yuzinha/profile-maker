"use client"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  // マークダウンをHTMLに変換
  const renderMarkdown = (text: string) => {
    console.log("Original text:", text)

    // 改行を<br>に変換
    let html = text.replace(/\n/g, "<br>")
    console.log("After newline conversion:", html)

    // 画像 ![alt](url) を <img> に変換
    html = html.replace(
      /!\[([^\]]*)\]$$([^)]+)$$/g,
      '<img src="$2" alt="$1" class="max-w-full h-auto rounded my-2" style="max-height: 200px; object-fit: cover;" />',
    )
    console.log("After image conversion:", html)

    // リンク [text](url) を <a> に変換
    html = html.replace(
      /\[([^\]]+)\]$$([^)]+)$$/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-300 underline hover:text-blue-200 break-all">$1</a>',
    )
    console.log("After link conversion:", html)

    return html
  }

  return (
    <div className={`markdown-content ${className}`} dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
  )
}
