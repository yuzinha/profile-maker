"use client"

import { Card } from "@/components/ui/card"
import { MarkdownRenderer } from "@/components/markdown-renderer"

interface TopicItem {
  id: string
  question: string
  answer: string
}

interface ProfileData {
  profileImage: string
  name: string
  nameRomaji: string
  topics: TopicItem[]
}

interface ProfilePreviewProps {
  data: ProfileData
}

export function ProfilePreview({ data }: ProfilePreviewProps) {
  return (
    <div className="max-w-md mx-auto">
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        {/* プロフィール画像 */}
        <div className="mb-6">
          {data.profileImage ? (
            <img
              src={data.profileImage || "/placeholder.svg"}
              alt={data.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 border-4 border-white shadow-lg flex items-center justify-center">
              <span className="text-gray-600 text-sm">画像なし</span>
            </div>
          )}
        </div>

        {/* 名前 */}
        <div className="text-center mb-2">
          <h1 className="text-xl font-bold text-white mb-1">{data.name}</h1>
          {data.nameRomaji && <p className="text-white/80 text-sm">{data.nameRomaji}</p>}
        </div>

        {/* 説明文 */}
        <div className="text-center mb-8 px-4">
          <p className="text-white/90 text-sm leading-relaxed">
            わたしってこんな人♪
            <br />
            どうぞよろしくお願いします！
          </p>
        </div>

        {/* お題リスト */}
        <div className="w-full max-w-sm space-y-3 mb-8">
          {data.topics
            .filter((topic) => topic.question && topic.answer)
            .map((topic) => (
              <Card key={topic.id} className="p-4 bg-white/95 backdrop-blur-sm">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">{topic.question}</p>
                  <MarkdownRenderer
                    content={topic.answer}
                    className="font-medium text-gray-800 text-sm leading-relaxed"
                  />
                </div>
              </Card>
            ))}
        </div>

        {/* フッター */}
        <div className="mt-auto">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            <p className="text-white/80 text-xs flex items-center gap-1">
              <span>⭐</span>
              Join {data.nameRomaji || data.name} on ProfileMaker
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
