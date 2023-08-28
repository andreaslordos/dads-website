// schemas/objects/instagramPost.ts

export default {
    name: "embed",
    type: "object",
    title: "Embed (e.g. Youtube Video)",
    fields: [
      {
        name: "embedurl",
        title: "Embed URL",
        type: "string",
        description: "e.g. https://www.youtube.com/embed/oxtvvRmZFWU?si=V8S6O2MRNVcjlGVd for YouTube" 
      }
    ]
  };