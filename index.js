import { HfInference } from "https://cdn.jsdelivr.net/npm/@huggingface/inference@2.6.1/+esm";

// insert huggingface token here (don't publish this to github)
const HF_ACCESS_TOKEN = "";
const inference = new HfInference(HF_ACCESS_TOKEN);

const audio = document.querySelector("#audio");

// initialize Speechrecognition for webkit bowsers, prefix
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

// grammer -> these are all commands you can say, feel free to change
const commands = ["start", "stop", "speel","dans"];
const grammar = `#JSGF V1.0; grammar commands; public <command> = ${commands.join(
  " | "
)};`;

document.querySelector("#loading").style.display = "none";

// just speech recognition settings, standard MDN documentation stuff
const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = "nl-NL";
recognition.interimResults = false;

// start listinging
recognition.start();

// on result, log result
recognition.onresult = function (event) {
  // log the word
  let recognizedSpeech = event.results[event.results.length - 1][0].transcript;

  if (recognizedSpeech === "") return;

  // trim word and lowercase
  recognizedSpeech = recognizedSpeech.trim().toLowerCase();

  // update DOM
  document.querySelector("#commando").innerHTML = recognizedSpeech;

  //speelcommando
  if (recognizedSpeech === "speel") {
    playAudio();
    console.log("speel");
  }

  //zoekcommando
  if (recognizedSpeech.includes("zoek")) {
    const query = recognizedSpeech.replace("zoek", "").trim(); // Remove "zoek" and trim any extra spaces
    if (query.length > 0) {
      search(query);
      console.log("zoek");
    }
  }

  //danscommando
  if (recognizedSpeech === "dans") {
    showDanceGIF(); // Show the dance GIF
    console.log("dans");
  }
};

//the function that searches google if the user says "zoek"
const search = async (query) => {
  const sanitizedQuery = encodeURIComponent(query); // Ensure the query is properly encoded for a URL
  window.open("https://www.google.com/search?q=" + sanitizedQuery);
};

//the function that makes music
const playAudio = async () => {
  const audio = new Audio("jay-z-ai.mp3");
  audio.play();
  //console.log(audio);
};

// the function that makes images
const makeImage = async (prompt) => {
  // showLoading();
  let result = await inference.textToImage({
    inputs: `${prompt}`,
    model: "stabilityai/stable-diffusion-2",
    parameters: {
      negative_prompt: "blurry"
    }
  });
  document.querySelector("#hf").src = URL.createObjectURL(result);
  // hideLoading();
};


// the function that handles the dans GIF
  const showDanceGIF = () => {
  const hfContainer = document.querySelector(".full");
  const danceGIF = document.createElement("img");
  danceGIF.src = "./dans-gif.gif"; // Replace with the actual GIF path
  danceGIF.id = "dance-gif"; // Assign an ID to the GIF element (optional)
  
  // Clear any previous content inside the .full container
  hfContainer.innerHTML = '';
  
  // Append the GIF element to the .full container
  hfContainer.appendChild(danceGIF);
};

makeImage(
  "foto van een laptop geschilderd door Vincent Van Gogh, laptop in de voorgrond, met een hond erop, in een bos, met een zonsondergang"
);
