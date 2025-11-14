from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, Dict, List, Any
import json
import asyncio
from career_bot_enhanced import CareerBotRAG
from job_matching import JobMatchingEngine

app = FastAPI(title="AI Career Bot API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Frontend dev
        "http://localhost:3000",  # Alternative frontend
        "http://localhost:5000",  # Backend
        "*"  # Allow all for development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store bot instances
bots = {}
job_engine = JobMatchingEngine()

class ChatRequest(BaseModel):
    query: str
    user_id: Optional[int] = None
    user_profile: Optional[Dict[str, Any]] = None

class JobMatchRequest(BaseModel):
    user_id: int
    user_experience: Optional[str] = None
    user_track: Optional[str] = None
    top_n: Optional[int] = 10

@app.get("/")
def root():
    return {"status": "online", "message": "AI Career Bot API"}

@app.post("/chat")
async def chat_stream(request: ChatRequest):
    """Stream chat responses with full user profile context"""
    try:
        # Get or create bot with user profile
        key = f"user_{request.user_id}" if request.user_id else "guest"
        if key not in bots:
            bots[key] = CareerBotRAG(user_id=request.user_id, user_profile=request.user_profile)
        else:
            # Update bot with latest user profile data
            bots[key].update_user_profile(request.user_profile)
        
        bot = bots[key]
        
        async def generate():
            try:
                for chunk in bot.ask_stream(request.query):
                    if chunk:
                        yield f"data: {json.dumps({'content': chunk})}\n\n"
                        await asyncio.sleep(0)
                yield f"data: {json.dumps({'done': True})}\n\n"
            except Exception as e:
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
        
        return StreamingResponse(
            generate(),
            media_type="text/event-stream"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/match-jobs")
def match_jobs(request: JobMatchRequest):
    """Find matching jobs for user with detailed scoring and JSON output"""
    try:
        result = job_engine.get_json_output(
            user_id=request.user_id,
            user_experience=request.user_experience,
            user_track=request.user_track,
            top_n=request.top_n
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/job-match/{user_id}")
def get_job_match(user_id: int, experience: str = None, track: str = None, top_n: int = 10):
    """GET endpoint for job matching with JSON output"""
    try:
        result = job_engine.get_json_output(
            user_id=user_id,
            user_experience=experience,
            user_track=track,
            top_n=top_n
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat-with-jobs")
async def chat_with_job_context(request: ChatRequest):
    """Chat with job matching context included - AI discusses your matched jobs"""
    try:
        # Get job matches if user_id provided
        job_context = ""
        if request.user_id:
            matches = job_engine.match_user_to_jobs(
                user_id=request.user_id,
                top_n=5
            )
            
            if matches:
                job_context = "\n\n=== YOUR TOP JOB MATCHES ===\n"
                for i, match in enumerate(matches[:3], 1):
                    job_context += f"\n{i}. {match['title']} at {match['company']}"
                    job_context += f"\n   📍 {match['location']} | {match['job_type']}"
                    job_context += f"\n   💯 Match Score: {match['match_percentage']}%"
                    job_context += f"\n   📊 Experience: {match['experience_level']}"
                    job_context += f"\n   🎯 Track: {match['career_track']}"
                    job_context += f"\n   ✅ Matched Skills: {', '.join([s['skill'] for s in match['skill_match']['matched_skills'][:5]])}"
                    if match['skill_match']['missing_skills']:
                        job_context += f"\n   ❌ Missing Skills: {', '.join(match['skill_match']['missing_skills'][:3])}"
                    job_context += f"\n   💡 {match['recommendation']}"
                    job_context += "\n"
                job_context += "===========================\n"
        
        # Add job context to query for AI awareness
        enhanced_query = request.query
        if job_context:
            enhanced_query += job_context
        
        # Get or create bot with user profile
        key = f"user_{request.user_id}" if request.user_id else "guest"
        if key not in bots:
            bots[key] = CareerBotRAG(user_id=request.user_id, user_profile=request.user_profile)
        else:
            bots[key].update_user_profile(request.user_profile)
        
        bot = bots[key]
        
        async def generate():
            try:
                for chunk in bot.ask_stream(enhanced_query):
                    if chunk:
                        yield f"data: {json.dumps({'content': chunk})}\n\n"
                        await asyncio.sleep(0)
                yield f"data: {json.dumps({'done': True})}\n\n"
            except Exception as e:
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
        
        return StreamingResponse(
            generate(),
            media_type="text/event-stream"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
