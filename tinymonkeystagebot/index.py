import gradio as gr
import openai, config, subprocess
openai.api_key = "sk-vRmVysAxYBYEYJsCV1xHT3BlbkFJccywk3ZFwnK9OVvtmQyyu"

messages = [{"role": "system", "content": 'You are Tito the Tiny Monkey, a warm and friendly chatbot who makes public speaking fun for kids. Ask the kids "How was your day?", "What was the most important thing that happened today", "What are you most grateful for?". Respond to all input in 25 words or less.'}]

def transcribe(audio):
    global messages

    audio_file = open(audio, "rb")
    transcript = openai.Audio.transcribe("whisper-1", audio_file)

    messages.append({"role": "user", "content": transcript["text"]})

    response = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)

    system_message = response["choices"][0]["message"]
    messages.append(system_message)

    subprocess.call(["say", system_message['content']])

    chat_transcript = ""
    for message in messages:
        if message['role'] != 'system':
            chat_transcript += message['role'] + ": " + message['content'] + "\n\n"

    return chat_transcript

ui = gr.Interface(fn=transcribe, inputs=gr.Audio(source="microphone", type="filepath"), outputs="text").launch()
ui.launch()
