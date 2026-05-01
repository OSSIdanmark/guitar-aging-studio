import OpenAI from "openai";

export async function POST(req) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const formData = await req.formData();
    const files = formData.getAll("images");

    if (!files || files.length === 0) {
      return new Response(
        JSON.stringify({ error: "No images uploaded" }),
        { status: 400 }
      );
    }

    const results = [];

    for (const file of files) {
      try {
        // 🔥 FORSØG AI
        const response = await openai.images.edit({
          model: "gpt-image-1",
          image: file,
          prompt: `
Edit THIS guitar image.

- Keep guitar EXACTLY the same
- Add subtle relic wear on body
- Add cinematic tropical background
- Shallow depth of field
          `,
          size: "1024x1024",
        });

        const imageBase64 = response.data[0].b64_json;
        const imageUrl = `data:image/png;base64,${imageBase64}`;

        results.push(imageUrl);

      } catch (err) {
        console.log("⚠️ AI failed → fallback to original");

        // 🔁 fallback = original image
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const type = file.type;

        const imageUrl = `data:${type};base64,${base64}`;
        results.push(imageUrl);
      }
    }

    return new Response(
      JSON.stringify({ images: results }),
      { status: 200 }
    );

  } catch (error) {
    console.error("API ERROR:", error);

    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
