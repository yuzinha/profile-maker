import { type NextRequest, NextResponse } from "next/server"

// ランダムな文字列を生成する関数
function generateRandomId(length = 8): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export async function POST(request: NextRequest) {
  try {
    const profileData = await request.json()

    // ランダムなIDを生成
    const id = generateRandomId()

    // プロフィールデータにメタデータを追加
    const profileWithMeta = {
      ...profileData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // クライアントサイドで保存するためにデータを返す
    return NextResponse.json({
      id,
      success: true,
      profile: profileWithMeta,
    })
  } catch (error) {
    console.error("Profile save error:", error)
    return NextResponse.json({ error: "プロフィールの保存に失敗しました" }, { status: 500 })
  }
}

export async function GET() {
  // クライアントサイドでローカルストレージから取得するため、空の配列を返す
  return NextResponse.json({ profiles: [] })
}
