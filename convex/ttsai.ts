import { v } from 'convex/values';
import { action } from './_generated/server';

import {UnrealSpeech} from 'react-native-unrealspeech';

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



