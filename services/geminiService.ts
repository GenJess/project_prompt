import { GoogleGenAI, Type } from "@google/genai";
import type { ScoreAndFeedbackResponse } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const promptSchema = {
  type: Type.OBJECT,
  properties: {
    description: {
      type: Type.STRING,
      description: "A one-sentence, vivid overall description of the image, capturing the main essence."
    },
    image_properties: {
        type: Type.OBJECT,
        description: "The properties of the original image.",
        properties: {
            width: { type: Type.INTEGER, description: "The width of the image in pixels." },
            height: { type: Type.INTEGER, description: "The height of the image in pixels." },
        },
        required: ["width", "height"],
    },
    subject: {
      type: Type.OBJECT,
      properties: {
        description: { type: Type.STRING, description: "Detailed description of the main subject(s), including appearance, clothing, and any objects they are interacting with." },
        expression: { type: Type.STRING, description: "The specific facial expression or perceived emotion of the subject (e.g., joyful, contemplative, serious)." },
        pose: { type: Type.STRING, description: "The posture, stance, or action of the subject (e.g., sitting cross-legged, running, pointing)." }
      },
       required: ["description"]
    },
    style: {
      type: Type.OBJECT,
      properties: {
        artistic_style: { type: Type.STRING, description: "The primary artistic style (e.g., photorealistic, impressionistic, anime, minimalist, surreal)." },
        medium: { type: Type.STRING, description: "The perceived medium (e.g., digital photography, oil on canvas, 35mm film photo, watercolor)." },
        mood: { type: Type.STRING, description: "The overall mood or atmosphere (e.g., nostalgic, energetic, tranquil, mysterious, cheerful)." }
      },
       required: ["artistic_style", "medium", "mood"]
    },
    composition: {
      type: Type.OBJECT,
      properties: {
        camera_angle: { type: Type.STRING, description: "The camera's perspective (e.g., low-angle shot, eye-level, high-angle, Dutch angle)." },
        framing: { type: Type.STRING, description: "The shot type (e.g., close-up, medium shot, full shot, wide shot)." },
        lighting: { type: Type.STRING, description: "The lighting style (e.g., soft natural light, dramatic chiaroscuro, backlighting, golden hour)." },
        focus: {type: Type.STRING, description: "The focus of the shot (e.g., shallow depth of field, deep focus, soft focus)."}
      },
      required: ["camera_angle", "framing", "lighting"]
    },
    setting: {
      type: Type.OBJECT,
      properties: {
        location: { type: Type.STRING, description: "The physical location or environment (e.g., a dense forest, a futuristic cityscape, a cozy cafe)." },
        time_of_day: { type: Type.STRING, description: "The specific time of day depicted (e.g., sunrise, midday, twilight, night)." }
      },
       required: ["location"]
    },
    color_palette: {
      type: Type.OBJECT,
      properties: {
        dominant_colors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of the 3-5 most dominant colors in hex or descriptive format." },
        overall_tone: { type: Type.STRING, description: "The color temperature and saturation (e.g., warm and vibrant, cool and muted, monochromatic)." }
      },
      required: ["dominant_colors", "overall_tone"]
    },
    additional_details: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of any other notable details, textures, or secondary objects that contribute to the image's character."
    }
  },
  required: ["description", "image_properties", "subject", "style", "composition", "setting", "color_palette"]
};

export const generatePromptFromImage = async (base64ImageData: string, mimeType: string, width: number, height: number): Promise<string> => {
  const imagePart = {
    inlineData: {
      data: base64ImageData,
      mimeType: mimeType,
    },
  };
  
  const textPart = {
    text: `You are an expert prompt engineer for generative AI image models. Analyze this image meticulously. The original image dimensions are ${width}x${height} pixels. Your task is to generate a structured JSON object that describes the image in extreme detail, including these dimensions. This JSON will be used as a prompt to recreate the image with high fidelity. Follow the provided schema precisely.`,
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: promptSchema,
        temperature: 0.2, // Lower temperature for more deterministic, descriptive output
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    if (error instanceof Error && error.message.includes("429")) {
        throw new Error("API rate limit exceeded. Please try again later.");
    }
    throw new Error("Failed to generate prompt from image. The model may have been unable to process the request.");
  }
};

const scoreAndFeedbackSchemaV2 = {
    type: Type.OBJECT,
    properties: {
        score: {
            type: Type.INTEGER,
            description: "An integer score from 0 to 100 representing how closely the user's generated image matches the reference image, based purely on visual similarity.",
        },
        analysis: {
            type: Type.ARRAY,
            description: "An array of objects, each analyzing a specific semantic parameter of the prompts.",
            items: {
                type: Type.OBJECT,
                properties: {
                    parameter: {
                        type: Type.STRING,
                        description: "The semantic parameter being analyzed (e.g., 'Subject', 'Style', 'Composition', 'Setting', 'Color', 'Action', 'Detail').",
                    },
                    target_phrase: {
                        type: Type.STRING,
                        description: "The corresponding phrase or keywords from the target prompt for this parameter. If no direct phrase exists, synthesize the concept.",
                    },
                    user_phrase: {
                        type: Type.STRING,
                        description: "The corresponding phrase or keywords from the user's prompt for this parameter. If the user missed this parameter, this can be an empty string.",
                    },
                    feedback: {
                        type: Type.STRING,
                        description: "Concise, constructive feedback comparing the user's phrase to the target phrase for this specific parameter. Explain what they did well and how they could be more specific or descriptive to better match the target.",
                    },
                },
                required: ["parameter", "target_phrase", "user_phrase", "feedback"],
            }
        }
    },
    required: ["score", "analysis"],
};


export const generateChallenge = async (difficulty: string): Promise<{ prompt: string; base64: string; mimeType: string }> => {
    // 1. Generate a prompt based on difficulty
    const promptGenerationResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Create a single, detailed, and creative image generation prompt for a generative AI. The image should have a difficulty level of '${difficulty}'. The difficulty relates to the complexity of the scene, the number of subjects, the specificity of the style, and the subtlety of the lighting and composition. Do not respond with anything other than the prompt itself. Be concise and clear.`,
        config: { temperature: 1.2 } // Higher temp for more creative/varied prompts
    });
    const targetPrompt = promptGenerationResponse.text;

    // 2. Generate an image from that prompt
    const imageGenerationResponse = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: targetPrompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '1:1',
        },
    });

    if (!imageGenerationResponse.generatedImages || imageGenerationResponse.generatedImages.length === 0) {
        throw new Error("Failed to generate challenge image.");
    }
    const image = imageGenerationResponse.generatedImages[0];

    return {
        prompt: targetPrompt,
        base64: image.image.imageBytes,
        mimeType: image.image.mimeType,
    };
};

export const generateImageFromUserPrompt = async (prompt: string): Promise<{ base64: string; mimeType: string }> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '1:1',
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("The model could not generate an image from your prompt. Try being more descriptive.");
    }
    const image = response.generatedImages[0];
    
    return {
        base64: image.image.imageBytes,
        mimeType: image.image.mimeType,
    };
};

export const getScoreAndFeedback = async (
    refImage: { base64: string; mimeType: string },
    userImage: { base64: string; mimeType: string },
    targetPrompt: string,
    userPrompt: string
): Promise<ScoreAndFeedbackResponse> => {
    const refImagePart = { inlineData: { data: refImage.base64, mimeType: refImage.mimeType } };
    const userImagePart = { inlineData: { data: userImage.base64, mimeType: userImage.mimeType } };
    
    const textPart = {
        text: `You are an AI image analysis expert and a prompt engineering coach. Your task is to provide a structured analysis comparing a user's attempt to recreate a reference image.

1.  **Image Score**: First, visually compare the two images provided (reference vs. user-generated). Provide a 'score' from 0-100 based on how closely the user's image matches the reference in terms of subject, style, color, and composition. This score is purely about the visual result.

2.  **Prompt Analysis**: Second, analyze the prompts that created these images.
    - Target Prompt: "${targetPrompt}"
    - User's Prompt: "${userPrompt}"

    Break down both prompts into their core semantic components. For each component (e.g., Subject, Style, Composition, Color, etc.), identify the relevant phrases from both prompts. Then, provide concise, actionable feedback on the user's phrasing for that specific component. The goal is to teach them how to be more descriptive and effective.

    - Find corresponding phrases in both prompts.
    - If the user missed a component, their phrase can be empty.
    - The feedback should be helpful and educational, focusing on vocabulary and specificity.

Return your complete analysis as a single JSON object that strictly follows the provided schema. The 'analysis' array should contain an object for each major semantic component you identify.`
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [textPart, refImagePart, userImagePart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: scoreAndFeedbackSchemaV2,
        },
    });

    try {
        const resultJson = JSON.parse(response.text);
        return resultJson;
    } catch (e) {
        console.error("Failed to parse score and feedback JSON:", response.text);
        throw new Error("The model provided an invalid response for the analysis.");
    }
};