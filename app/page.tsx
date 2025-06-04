"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Eye, Share2, Save } from "lucide-react"
import { ProfilePreview } from "@/components/profile-preview"
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

export default function ProfileMaker() {
  const [profileData, setProfileData] = useState<ProfileData>({
    profileImage: "",
    name: "",
    nameRomaji: "",
    topics: [{ id: "1", question: "", answer: "" }],
  })
  const [showPreview, setShowPreview] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [profileUrl, setProfileUrl] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileData((prev) => ({
          ...prev,
          profileImage: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const addTopic = () => {
    if (profileData.topics.length < 5) {
      setProfileData((prev) => ({
        ...prev,
        topics: [...prev.topics, { id: Date.now().toString(), question: "", answer: "" }],
      }))
    }
  }

  const removeTopic = (id: string) => {
    if (profileData.topics.length > 1) {
      setProfileData((prev) => ({
        ...prev,
        topics: prev.topics.filter((topic) => topic.id !== id),
      }))
    }
  }

  const updateTopic = (id: string, field: "question" | "answer", value: string) => {
    setProfileData((prev) => ({
      ...prev,
      topics: prev.topics.map((topic) => (topic.id === id ? { ...topic, [field]: value } : topic)),
    }))
  }

  const generateProfile = () => {
    // プロフィールデータをローカルストレージに保存
    const profileId = Date.now().toString()
    localStorage.setItem(`profile_${profileId}`, JSON.stringify(profileData))

    // プロフィールURLを生成
    const url = `${window.location.origin}/profile/${profileId}`
    setProfileUrl(url)
    setShowPreview(true)
  }

  const saveProfile = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      })

      if (response.ok) {
        const { id } = await response.json()
        const url = `${window.location.origin}/${id}`
        setProfileUrl(url)
        setShowShare(true)
      } else {
        alert("保存に失敗しました。もう一度お試しください。")
      }
    } catch (error) {
      console.error("Save error:", error)
      alert("保存に失敗しました。もう一度お試しください。")
    } finally {
      setIsSaving(false)
    }
  }

  const handleShare = () => {
    if (profileUrl) {
      setShowShare(true)
    }
  }

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              編集に戻る
            </Button>
            <Button onClick={handleShare} className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              シェア
            </Button>
          </div>
          <ProfilePreview data={profileData} />
        </div>
        <ShareDialog
          open={showShare}
          onOpenChange={setShowShare}
          url={profileUrl}
          title={`${profileData.name}の自己紹介`}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">自己紹介ページを作成</h1>
            <Button variant="outline" onClick={() => (window.location.href = "/archive")}>
              保存済みページ一覧
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>自己紹介ページを作成</CardTitle>
              <CardDescription>
                あなたの自己紹介ページを作成しましょう。プロフィール画像、名前、お題を入力してください。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* プロフィール画像 */}
              <div className="space-y-2">
                <Label htmlFor="profile-image">プロフィール画像</Label>
                <div className="flex items-center gap-4">
                  {profileData.profileImage && (
                    <img
                      src={profileData.profileImage || "/placeholder.svg"}
                      alt="プロフィール"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <Input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* 名前 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">名前</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="山田太郎"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name-romaji">名前（ローマ字）</Label>
                  <Input
                    id="name-romaji"
                    value={profileData.nameRomaji}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, nameRomaji: e.target.value }))}
                    placeholder="Taro Yamada"
                  />
                </div>
              </div>

              {/* お題 */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>お題と回答</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTopic}
                    disabled={profileData.topics.length >= 5}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    追加
                  </Button>
                </div>

                {profileData.topics.map((topic, index) => (
                  <Card key={topic.id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-medium text-gray-600">お題 {index + 1}</span>
                      {profileData.topics.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTopic(topic.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Input
                        placeholder="お題を入力（例：好きなお味噌汁の具）"
                        value={topic.question}
                        onChange={(e) => updateTopic(topic.id, "question", e.target.value)}
                      />
                      <div className="space-y-1">
                        <Textarea
                          placeholder="回答を入力（例：豆腐）&#10;&#10;マークダウン記法が使えます：&#10;- 改行: Enterキー&#10;- 画像: ![説明](画像URL)&#10;- リンク: [テキスト](URL)"
                          value={topic.answer}
                          onChange={(e) => updateTopic(topic.id, "answer", e.target.value)}
                          rows={4}
                        />
                        <p className="text-xs text-gray-500">
                          マークダウン記法対応：改行、画像 ![説明](URL)、リンク [テキスト](URL)
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={generateProfile}
                  variant="outline"
                  className="flex-1 flex items-center gap-2"
                  disabled={!profileData.name || !profileData.nameRomaji}
                >
                  <Eye className="w-4 h-4" />
                  プレビュー
                </Button>
                <Button
                  onClick={saveProfile}
                  className="flex-1 flex items-center gap-2"
                  disabled={!profileData.name || !profileData.nameRomaji || isSaving}
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "保存中..." : "保存して公開"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
