import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

// データディレクトリのパス
const DATA_DIR = path.join(process.cwd(), "data")

// ランダムな文字列を生成する関数
function generateRandomId(length = 8): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// データディレクトリが存在しない場合は作成
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDataDir()

    const profileData = await request.json()

    // ランダムなIDを生成（重複チェック付き）
    let id: string
    let attempts = 0
    do {
      id = generateRandomId()
      attempts++
      try {
        await fs.access(path.join(DATA_DIR, `${id}.json`))
        // ファイルが存在する場合は続行（新しいIDを生成）
      } catch {
        // ファイルが存在しない場合はこのIDを使用
        break
      }
    } while (attempts < 10)

    if (attempts >= 10) {
      return NextResponse.json({ error: "ID生成に失敗しました" }, { status: 500 })
    }

    // プロフィールデータにメタデータを追加
    const profileWithMeta = {
      ...profileData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // ファイルに保存
    await fs.writeFile(path.join(DATA_DIR, `${id}.json`), JSON.stringify(profileWithMeta, null, 2))

    return NextResponse.json({ id, success: true })
  } catch (error) {
    console.error("Profile save error:", error)
    return NextResponse.json({ error: "プロフィールの保存に失敗しました" }, { status: 500 })
  }
}

export async function GET() {
  try {
    await ensureDataDir()

    const files = await fs.readdir(DATA_DIR)
    const profiles = []

    for (const file of files) {
      if (file.endsWith(".json")) {
        try {
          const content = await fs.readFile(path.join(DATA_DIR, file), "utf-8")
          const profile = JSON.parse(content)
          profiles.push({
            id: profile.id,
            name: profile.name,
            nameRomaji: profile.nameRomaji,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt,
          })
        } catch (error) {
          console.error(`Error reading profile ${file}:`, error)
        }
      }
    }

    // 作成日時の降順でソート
    profiles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ profiles })
  } catch (error) {
    console.error("Profiles list error:", error)
    return NextResponse.json({ error: "プロフィール一覧の取得に失敗しました" }, { status: 500 })
  }
}
