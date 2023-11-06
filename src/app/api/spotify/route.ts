export async function GET(request: Request) {
  console.log('spotify');
  return new Response(JSON.stringify({ answer: 'John Doe' }), {
    status: 200,
  });
}
