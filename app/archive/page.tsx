"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, ExternalLink, ArrowLeft } from "lucide-react"

interface ProfileSummary {
  id: string
  name: string
  nameRomaji: string
  createdAt: string
  updatedAt: string
}

export default function ArchivePage() {
  const [profiles, setProfiles] = useState<ProfileSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    try {
      // ローカルストレージから保存済みプロフィール一覧を取得
      const savedProfiles = JSON.parse(localStorage.getItem("saved_profiles") || "[]")
      setProfiles(savedProfiles)
    } catch (error) {
      console.error("Profiles fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProfile = async (id: string) => {
    if (!confirm("このプロフィールを削除してもよろしいですか？")) {
      return
    }

    try {
      // ローカルストレージから削除
      localStorage.removeItem(`profile_${id}`)

      // 保存済みプロフィール一覧からも削除
      const savedProfiles = JSON.parse(localStorage.getItem("saved_profiles") || "[]")
      const updatedProfiles = savedProfiles.filter((profile: any) => profile.id !== id)
      localStorage.setItem("saved_profiles", JSON.stringify(updatedProfiles))

      setProfiles(updatedProfiles)
      alert("プロフィールを削除しました")
    } catch (error) {
      console.error("Delete error:", error)
      alert("削除に失敗しました")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => (window.location.href = "/")} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              新規作成に戻る
            </Button>
            <div>
              <h1 className="text-2xl font-bold">保存済みプロフィール一覧</h1>
              <p className="text-gray-600">作成したプロフィールページの管理</p>
            </div>
          </div>

          {profiles.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-600 mb-4">まだプロフィールが作成されていません</p>
                <Button onClick={() => (window.location.href = "/")}>最初のプロフィールを作成</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {profiles.map((profile) => (
                <Card key={profile.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{profile.name}</CardTitle>
                        <CardDescription>{profile.nameRomaji}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/${profile.id}`, "_blank")}
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          表示
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteProfile(profile.id)}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                          削除
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-600">
                      <p>作成日: {formatDate(profile.createdAt)}</p>
                      <p>更新日: {formatDate(profile.updatedAt)}</p>
                      <p className="mt-2">
                        URL:{" "}
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {window.location.origin}/{profile.id}
                        </code>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
