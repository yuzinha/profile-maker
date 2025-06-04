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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/profiles/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setProfileData(data)
          setProfileUrl(window.location.href)
        }
      } catch (error) {
        console.error("Profile fetch error:", error)
      } finally {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">プロフィールが見つかりません</h1>
          <p className="text-gray-600 mb-4">指定されたプロフィールは存在しないか、削除された可能性があります。</p>
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
