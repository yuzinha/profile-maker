import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const filePath = path.join(DATA_DIR, `${params.id}.json`)
    const content = await fs.readFile(filePath, "utf-8")
    const profile = JSON.parse(content)

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Profile get error:", error)
    return NextResponse.json({ error: "プロフィールが見つかりません" }, { status: 404 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const filePath = path.join(DATA_DIR, `${params.id}.json`)
    await fs.unlink(filePath)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Profile delete error:", error)
    return NextResponse.json({ error: "プロフィールの削除に失敗しました" }, { status: 500 })
  }
}
