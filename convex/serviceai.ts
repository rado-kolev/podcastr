import { v } from 'convex/values';
import { action } from './_generated/server';

import { UnrealSpeech } from 'react-native-unrealspeech';

// const apiKey = process.env.NEXT_PUBLIC_UNREALSPEECH_API_KEY!;

// if (!apiKey) {
//   throw new Error('UNREALSPEECH_API_KEY is not defined');
// }

const unrealSpeech = new UnrealSpeech(
  'xVEw57alwf8uUv0cZ3ZGL8z6mxLc7mGiDfJtKMS8nyQgmpH8EU2Fcl'
);


export const generateAudioAction = action({
  args: { input: v.string(), voice: v.string() },
  handler: async (_, { voice, input }) => {
    // Step 1: Extract the text and voiceId for the speech generation
    const text = input;
    const voiceId = voice;

    // Step 2: Generate speech using Unreal Speech API
    const speechData = await unrealSpeech.speech(text, voiceId);

    // Step 3: Fetch the generated audio file from the OutputUri
    const audioResponse = await fetch(speechData.OutputUri);
    const arrayBuffer = await audioResponse.arrayBuffer();

    // Step 4: Return the audio data as an ArrayBuffer
    return arrayBuffer;
  },
});



export const generateThumbnailAction = action({
  args: {
    prompt: v.string(), // Define the expected argument
  },
  handler: async (_, { prompt }) => {
    // Define the API request options
    const options = {
      method: 'POST',
      headers: {
        'x-freepik-api-key': 'FPSX57eab42cc12d4af5a19ba6181df7ff13', // Replace with your actual API key
        'Content-Type': 'application/json',
        Accept: 'application/json', // Ensure the 'Accept' header is included
      },
      body: JSON.stringify({
        prompt: prompt, // Use the prompt passed into the action
        seed: 42, // Include any other required parameters
        num_inference_steps: 20,
        num_images: 1,
        image: {
          size: 'square', // Customize size if needed - Available options: square, portrait, social_post, social_story, standard, rectangular, widescreen
        },
      }),
    };

    try {
      // Make the API call to Freepik
      const response = await fetch(
        'https://api.freepik.com/v1/ai/text-to-image',
        options
      );

      if (!response.ok) {
        throw new Error(`Error generating image: ${response.statusText}`);
      }

      const responseData = await response.json();

      // Check if the response contains image data
      if (responseData.data && responseData.data.length > 0) {
        // Extract the base64 data
        const base64Image = responseData.data[0].base64;

        // Convert base64 to ArrayBuffer
        const base64ToArrayBuffer = (base64: any) => {
          const binaryString = atob(base64);
          const binaryLen = binaryString.length;
          const bytes = new Uint8Array(binaryLen);
          for (let i = 0; i < binaryLen; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          return bytes.buffer;
        };

        const arrayBuffer = base64ToArrayBuffer(base64Image);

        // Return the ArrayBuffer
        return arrayBuffer;
      } else {
        throw new Error('No image data found in the response.');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      throw new Error('Failed to generate image');
    }
  },
});

