import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // クライアントサイドでローカルストレージから取得するため、
  // IDの妥当性チェックのみ行う
  if (!params.id || params.id.length !== 8) {
    return NextResponse.json({ error: "無効なプロフィールIDです" }, { status: 400 })
  }

  return NextResponse.json({ id: params.id, clientSide: true })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // クライアントサイドで削除するため、成功レスポンスを返す
  return NextResponse.json({ success: true })
}
