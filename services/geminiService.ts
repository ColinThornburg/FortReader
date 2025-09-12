import { GoogleGenAI, Type } from "@google/genai";
import type { ReadingLevel, ComprehensionQuestion } from '../types';
import { GEMINI_TEXT_MODEL, GEMINI_IMAGE_MODEL, READING_LEVEL_SETTINGS } from '../constants';
import { uploadImage } from './firebaseService';

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper function to convert base64 to File object
const base64ToFile = (base64String: string, filename: string): File => {
  const base64Data = base64String.split(',')[1]; // Remove data:image/png;base64, prefix
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new File([byteArray], filename, { type: 'image/png' });
};

export const generateStory = async (readingLevel: ReadingLevel, topic: string): Promise<{ title: string, content: string }> => {
  const settings = READING_LEVEL_SETTINGS[readingLevel];
  
  const prompt = `Generate a children's story about "${topic}".
  The story should be between ${settings.wordCount} words.
  ${settings.promptAddition}
  The story must be engaging and exciting for a child.
  Return the story in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'An exciting and short title for the story.'
            },
            content: {
              type: Type.STRING,
              description: 'The full content of the story, formatted with paragraphs separated by newlines.'
            }
          },
          required: ["title", "content"]
        }
      }
    });

    const jsonText = response.text.trim();
    const storyData = JSON.parse(jsonText);
    
    // Replace newlines with paragraph breaks for HTML rendering
    storyData.content = storyData.content.replace(/\n/g, '<br /><br />');
    
    return storyData;

  } catch (error) {
    console.error("Error generating story:", error);
    throw new Error("Could not generate a story from the Gemini API.");
  }
};

export const generateComprehensionQuestion = async (story: { title: string, content: string, readingLevel: ReadingLevel }): Promise<ComprehensionQuestion> => {
  const settings = READING_LEVEL_SETTINGS[story.readingLevel];
  
  // Clean the story content by removing HTML tags for better AI processing
  const cleanContent = story.content.replace(/<br \/><br \/>/g, '\n\n').replace(/<[^>]*>/g, '');
  
  const prompt = `Based on this story titled "${story.title}", create a simple comprehension question to validate that a child at ${story.readingLevel} level has read and understood the story.

Story content:
${cleanContent}

Requirements:
- Create a multiple choice question with 4 options
- The question should be fairly easy - just to validate they read the story
- Make it appropriate for ${story.readingLevel} reading level
- Focus on basic story elements like characters, main events, or simple plot points
- Avoid overly complex analysis or deep interpretation
- Make sure one answer is clearly correct and the others are plausible but wrong
- Keep the question and answers concise and age-appropriate

Return the question in JSON format.`;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: {
              type: Type.STRING,
              description: 'A simple comprehension question about the story'
            },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              },
              description: 'Four multiple choice options'
            },
            correctAnswerIndex: {
              type: Type.INTEGER,
              description: 'The index (0-3) of the correct answer'
            },
            explanation: {
              type: Type.STRING,
              description: 'A brief explanation of why this answer is correct'
            }
          },
          required: ["question", "options", "correctAnswerIndex"]
        }
      }
    });

    const jsonText = response.text.trim();
    const questionData = JSON.parse(jsonText);
    
    // Validate the response
    if (!questionData.options || questionData.options.length !== 4) {
      throw new Error("Invalid question format: must have exactly 4 options");
    }
    
    if (questionData.correctAnswerIndex < 0 || questionData.correctAnswerIndex > 3) {
      throw new Error("Invalid correct answer index: must be between 0 and 3");
    }
    
    return questionData;

  } catch (error) {
    console.error("Error generating comprehension question:", error);
    
    // Fallback question based on the story title and basic content
    const fallbackQuestion: ComprehensionQuestion = {
      question: `What was the main topic of the story "${story.title}"?`,
      options: [
        "The story was about adventure and friendship",
        "The story was about cooking recipes",
        "The story was about building houses", 
        "The story was about space travel"
      ],
      correctAnswerIndex: 0,
      explanation: "Based on the story content, this was the main theme."
    };
    
    return fallbackQuestion;
  }
};

export const generateSkin = async (prompt: string): Promise<string> => {
  try {
    console.log("Attempting to generate image with prompt:", prompt);
    
    const response = await ai.models.generateImages({
      model: GEMINI_IMAGE_MODEL,
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
        // Add safety settings to avoid content policy issues
        safetySettings: [
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_ONLY_HIGH'
          }
        ]
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      console.log("Successfully generated image via Gemini API");
      
      // Convert base64 to File and upload to Firebase Storage
      const timestamp = Date.now();
      const filename = `generated-skins/${timestamp}-${prompt.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      const file = base64ToFile(`data:image/png;base64,${base64ImageBytes}`, filename);
      
      try {
        const downloadURL = await uploadImage(file, filename);
        console.log("Image uploaded to Firebase Storage:", downloadURL);
        return downloadURL;
      } catch (uploadError) {
        console.error("Failed to upload to Firebase Storage, using base64 fallback:", uploadError);
        return `data:image/png;base64,${base64ImageBytes}`;
      }
    } else {
      throw new Error("No image was generated.");
    }
  } catch (error) {
    console.error("Error generating skin image:", error);
    
    // Check for specific error types and provide appropriate fallbacks
    if (error.message.includes("billed users") || error.message.includes("billing")) {
      console.log("🔄 Using fallback placeholder image due to billing restriction");
      console.log("💡 To get AI-generated images, enable billing in Google Cloud Console");
      return generatePlaceholderImage(prompt);
    }
    
    if (error.message.includes("SAFETY") || error.message.includes("content policy")) {
      console.log("🔄 Using fallback due to content policy, trying safer prompt");
      return generatePlaceholderImage(prompt);
    }
    
    // For other errors, also use fallback but log the specific error
    console.log("🔄 Using fallback placeholder due to API error:", error.message);
    return generatePlaceholderImage(prompt);
  }
};

// Fallback function to generate placeholder images
const generatePlaceholderImage = (prompt: string): string => {
  // Create a simple colored square based on the prompt hash
  const hash = prompt.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  
  const color = colors[Math.abs(hash) % colors.length];
  
  // Generate a simple SVG placeholder
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="${color}"/>
      <circle cx="100" cy="80" r="30" fill="white" opacity="0.8"/>
      <circle cx="85" cy="75" r="5" fill="black"/>
      <circle cx="115" cy="75" r="5" fill="black"/>
      <path d="M 80 100 Q 100 120 120 100" stroke="black" stroke-width="3" fill="none"/>
      <text x="100" y="160" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">
        ${prompt.split(' ').slice(0, 2).join(' ')}
      </text>
    </svg>
  `;
  
  // Convert SVG to base64
  const base64 = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${base64}`;
};