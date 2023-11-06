export async function GET(request: Request) {
  console.log('blog');
  return new Response(JSON.stringify({ answer: 'John Doe' }), {
    status: 200,
  });
}
