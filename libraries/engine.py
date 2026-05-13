import sys 
import os 
import io 
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.document_loaders import YoutubeLoader
from langgraph.graph import StateGraph, END
from typing import TypedDict


sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

load_dotenv()

class GraphState(TypedDict):
    url:str
    transcript:str
    result:str
    language:str


def extract_transcript(state: GraphState):
    try:
        loader = YoutubeLoader.from_youtube_url(state['url'], add_video_info=False)
        docs = loader.load()
        return {"transcript": docs[0].page_content}
    except Exception as e:
        return {"transcript": f"Error: {str(e)}"}


def generate_prompt (state: GraphState):
    if "Error" in state["transcript"]:
        return {"result": state["transcript"]}

    llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GEMINI_API_KEY"),
    temperature = 0.7
)

    system_msg = f"""
    Always write in {state['language']}.
    You MUST respond ONLY in that language.
    """
    response = response = llm.invoke([
    ("system", system_msg),
    ("user", f"""
        Summarize this YouTube transcript in {state['language']}.  Transcript:{state['transcript']}""")
])
    return {'result': response.content}

workflow = StateGraph(GraphState)
workflow.add_node("extract",extract_transcript)
workflow.add_node("generate",generate_prompt)
workflow.set_entry_point("extract")

workflow.add_edge("extract", "generate")
workflow.add_edge("generate", END)

app = workflow.compile()

if __name__ == "__main__":
    input_url = sys.argv[1]
    input_language = sys.argv[2]
    final_state = app.invoke({"url": input_url, "language": input_language})
    print(final_state["result"])







   