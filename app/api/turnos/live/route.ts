import { sseEmitter } from '@/lib/sse'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const codigo = searchParams.get('codigo')

  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  })

  const stream = new ReadableStream({
    start(controller) {
      const onUpdate = (data: any) => {
        if (codigo && data.codigo !== codigo) return
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`)
      }
      sseEmitter.on('update', onUpdate)
      controller.enqueue('event: ping\ndata: connected\n\n')
      const interval = setInterval(() => {
        controller.enqueue('event: ping\ndata: keepalive\n\n')
      }, 15000)
      return () => {
        clearInterval(interval)
        sseEmitter.off('update', onUpdate)
      }
    },
  })

  return new Response(stream, { headers })
}
