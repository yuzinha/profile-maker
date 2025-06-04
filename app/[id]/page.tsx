"use client"

import { useEffect, useState } from "react"
import { ProfilePreview } from "@/components/profile-preview"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { ShareDialog } from "@/components/share-dialog"

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

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [showShare, setShowShare] = useState(false)
  const [profileUrl, setProfileUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  useEffect(() => {
    const fetchProfile = async () => {
      const debug: string[] = []
      debug.push(`Looking for profile with ID: ${params.id}`)

      try {
        // ローカルストレージのキーを確認
        const allKeys = Object.keys(localStorage)
        debug.push(`All localStorage keys: ${allKeys.join(", ")}`)

        // まずローカルストレージから取得を試行
        const localData = localStorage.getItem(`profile_${params.id}`)
        debug.push(`LocalStorage data for profile_${params.id}: ${localData ? "Found" : "Not found"}`)

        if (localData) {
          try {
            const data = JSON.parse(localData)
            debug.push(`Parsed data successfully: ${JSON.stringify(data, null, 2)}`)
            setProfileData(data)
            setProfileUrl(window.location.href)
            setDebugInfo(debug)
            setLoading(false)
            return
          } catch (parseError) {
            debug.push(`Parse error: ${parseError}`)
          }
        }

        // ローカルストレージにない場合はAPIを呼び出し（IDの妥当性チェックのため）
        debug.push("Trying API call...")
        const response = await fetch(`/api/profiles/${params.id}`)
        debug.push(`API response status: ${response.status}`)

        if (!response.ok) {
          debug.push("API call failed")
          setDebugInfo(debug)
          setLoading(false)
          return
        }

        // プロフィールが見つからない場合
        debug.push("Profile not found")
        setDebugInfo(debug)
        setLoading(false)
      } catch (error) {
        debug.push(`Error: ${error}`)
        console.error("Profile fetch error:", error)
        setDebugInfo(debug)
        setLoading(false)
      }
    }

    fetchProfile()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-2xl font-bold mb-4">プロフィールが見つかりません</h1>
          <p className="text-gray-600 mb-4">指定されたプロフィールは存在しないか、削除された可能性があります。</p>

          {/* デバッグ情報 */}
          <details className="mb-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-500">デバッグ情報を表示</summary>
            <div className="mt-2 p-4 bg-gray-100 rounded text-xs">
              {debugInfo.map((info, index) => (
                <div key={index} className="mb-1">
                  {info}
                </div>
              ))}
            </div>
          </details>

          <Button onClick={() => (window.location.href = "/")}>新しいプロフィールを作成</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-4 right-4 z-10">
        <Button
          onClick={() => setShowShare(true)}
          className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30"
          variant="outline"
        >
          <Share2 className="w-4 h-4" />
          シェア
        </Button>
      </div>

      <ProfilePreview data={profileData} />

      <ShareDialog
        open={showShare}
        onOpenChange={setShowShare}
        url={profileUrl}
        title={`${profileData.name}の自己紹介`}
      />
    </div>
  )
}
