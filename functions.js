const dotenv = require("dotenv")
const Replicate = require("replicate");
dotenv.config()
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const  emailjs  = require("@emailjs/nodejs")

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
        prompt=`You have to summarise this given text in short description in first person and then produce todos and tasks in simple easy to understand language if any , sort them on the basis of priority and return them in an array , the text is : ${transcription}`
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text
        }
        catch(error){
            return error
        }
}

async function getSummary(dataBuffer){
    try{
        const prompt = "Summarize the following text for me in under 300 words in a crisp and easy to understand manner and if it has multiple points or sub topics you can create points for them and extend the word limit keeping in mind the result text is short and crisp , the text is : "+dataBuffer
        let x = await model.generateContent(prompt);
        let text = x.response.text()
        return text
        }
    catch(error){
        return error
        console.log(error);
    }
}

async function ask(dataBuffer,question){
    try{
        const prompt = "Answer this question "+question+" briefly from this information provided and you have to interpret the information in the best way you can "+dataBuffer
        let x = await model.generateContent(prompt);
        let text = x.response.text()
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


async function sendEmail(message,reciever){
    const templateParams = {
        name: 'Apple',
        message: message,
        to_email: reciever
    };
    await emailjs.send('service_0ajikk8', 'template_k5zsu4i', templateParams, {
        publicKey: 'Tnh3aPeueEt-ErVPY',
        privateKey: 'WU8LYhrlBCOYd7VH261et',
    }).then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text);
        },
        (err) => {
          console.log('FAILED...', err);
        },
    );
}


module.exports = { getOutput , getSummary , ask , sendEmail}