export async function generateEmbedding(text: string) {
  const body = JSON.stringify({
    model: 'jina-embeddings-v3',
    task: 'retrieval.query',
    dimensions: 1024,
    late_chunking: false,
    embedding_type: 'float',
    input: [text],
  });

  const response = await fetch('https://api.jina.ai/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + process.env.JINA_API_KEY,
    },
    body,
  });

  if (response.status !== 200) {
    const data = (await response.json()) as {
      detail: {
        loc: string[];
        msg: string;
        type: string;
      }[];
    };
    throw new Error(data.detail[0].msg);
  }

  const data = (await response.json()) as {
    data: {
      index: number;
      embedding: number[];
      object: string;
    }[];
    usage: {
      total_tokens: number;
      prompt_tokens: number;
    };
  };

  return data.data[0].embedding;
}
