import axios from "axios";

async function send_to_gpt(message) {
        try {
            const response = await axios.post('https://delegate-ai-backend.onrender.com/chat', {
                prompt: message,
            })
            return response.data.reply;
        }
        catch (error) {
            console.error('Error sending message to GPT:', error);
        }
}

export { send_to_gpt };