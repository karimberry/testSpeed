export async function POST(request) {
    try {
        // Simulate processing the upload
        const data = await request.formData();
        const file = data.get('file');
        console.log(file);
        
        if (!file) {
            return new Response('No file uploaded', { status: 400 });
        }

        // We don't actually save the file, just measure the upload speed
        return new Response('Upload successful', { status: 200 });
    } catch (error) {
        console.error('Upload error:', error);
        return new Response('Upload failed', { status: 500 });
    }
} 