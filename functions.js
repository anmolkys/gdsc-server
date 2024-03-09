const dotenv = require("dotenv")
const Replicate = require("replicate");
dotenv.config()
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });


async function getTranscription(audio){
    const output = await replicate.run(
        "openai/whisper:4d50797290df275329f202e48c76360b3f22b08d28c196cbc54600319435f8d2",
        {
          input: {
            audio: audio,
            model: "large-v3",
            translate: false,
            temperature: 0,
            transcription: "plain text",
            suppress_tokens: "-1",
            logprob_threshold: -1,
            no_speech_threshold: 0.6,
            condition_on_previous_text: true,
            compression_ratio_threshold: 2.4,
            temperature_increment_on_fallback: 0.2
          }
        }
    );

    return output;
}



async function getText(transcription){
    try{
        prompt=`You have to summarise this given text in short description in first person and then produce todos and tasks if any and return them in an array part , the text is : ${transcription}`
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text
        }
        catch(error){
            return error
        }
}



async function getOutput (url) {
    let output = await getTranscription(url)
    let points = await getText(output.transcription)
    return points
};

module.exports = getOutput