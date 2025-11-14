import os
import uuid
from typing import List, Dict, TypedDict, Annotated, Optional
import numpy as np
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import Error

# LangChain imports
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.tools import tool

# LangGraph imports
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.checkpoint.memory import MemorySaver

# Load environment variables
load_dotenv()


class CareerBotRAG:
    """AI-Powered Youth Employment & Career Roadmap Platform with Streaming, Memory, and Personalization."""
    
    def __init__(self, knowledge_base_path: str = "knowledge_base.txt", user_id: Optional[int] = None, user_profile: Optional[Dict] = None):
        """
        Initialize the Career Bot with RAG capabilities, streaming, and memory.
        
        Args:
            knowledge_base_path: Path to the knowledge base text file
            user_id: Optional user ID to fetch personalized skills from database
            user_profile: Optional comprehensive user profile data from backend
        """
        print("🚀 Initializing AI-Powered Career Bot with Streaming & Memory...")
        print("="*70)
        
        # Store user ID and profile for personalization
        self.user_id = user_id
        self.user_profile = user_profile or {}
        self.user_skills = []
        
        # Initialize thread ID for conversation memory
        self.thread_id = str(uuid.uuid4())
        print(f"🔗 Thread ID: {self.thread_id}")
        
        # Use profile data if provided, otherwise fetch from database
        if user_profile:
            print(f"👤 Using provided user profile for User ID: {user_id}")
            if user_profile.get('skills'):
                self.user_skills = user_profile['skills']
                print(f"✓ Loaded {len(self.user_skills)} skills from profile")
                for skill in self.user_skills[:5]:  # Show first 5
                    print(f"   • {skill.get('name')} ({skill.get('proficiency')})")
                if len(self.user_skills) > 5:
                    print(f"   ... and {len(self.user_skills) - 5} more")
        elif user_id:
            print(f"👤 Fetching skills for User ID: {user_id}")
            self.user_skills = self._fetch_user_skills(user_id)
            if self.user_skills:
                print(f"✓ Found {len(self.user_skills)} skills for this user")
                for skill in self.user_skills:
                    print(f"   • {skill['skillName']} ({skill['proficiency']})")
            else:
                print("⚠ No skills found for this user")
        
        # Initialize OpenAI embedding model
        print("\n🔢 Initializing OpenAI Embedding Model...")
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        
        self.embedding_model = OpenAIEmbeddings(
            model="text-embedding-3-small",
            openai_api_key=api_key
        )
        print("✓ OpenAI Embeddings initialized (text-embedding-3-small)")
        
        # Load and process knowledge base
        print("\n📖 Loading Career & Employment Knowledge Base...")
        self.knowledge_chunks = self._load_and_chunk_knowledge_base(knowledge_base_path)
        print(f"✓ Loaded {len(self.knowledge_chunks)} career guidance chunks")
        
        # Create embeddings for all chunks using OpenAI
        print("\n🔢 Creating embeddings using OpenAI...")
        self.chunk_embeddings = self._create_embeddings(self.knowledge_chunks)
        print("✓ Knowledge base embeddings created")
        
        # Configure OpenAI LLM with streaming
        print("\n🤖 Configuring OpenAI LLM with Streaming...")
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            api_key=api_key,
            temperature=0.7,
            streaming=True
        )
        print("✓ OpenAI LLM configured (gpt-4o-mini) with streaming enabled")
        
        # Initialize memory saver
        print("\n💾 Initializing Conversation Memory...")
        self.memory = MemorySaver()
        print("✓ In-memory conversation storage ready")
        
        # Build LangGraph workflow with memory
        print("\n🔧 Building LangGraph Workflow with Memory...")
        self._setup_graph()
        print("✓ LangGraph workflow ready with checkpointing")
        
        print("="*70)
        print("✅ Career Bot initialization complete!")
        print("💡 Ready to provide personalized career guidance with streaming!\n")
    
    def _fetch_user_skills(self, user_id: int) -> List[Dict]:
        """
        Fetch user skills from the MySQL database.
        
        Args:
            user_id: User ID to fetch skills for
            
        Returns:
            List of skill dictionaries with skillName and proficiency
        """
        skills = []
        connection = None
        
        try:
            # Create database connection
            connection = mysql.connector.connect(
                host="localhost",
                user="root",
                password="",
                database="youth_employment_db",
                port=3307
            )
            
            if connection.is_connected():
                cursor = connection.cursor(dictionary=True)
                
                # Query to fetch user skills
                query = """
                    SELECT id, userId, skillName, proficiency, createdAt, updatedAt
                    FROM UserSkills
                    WHERE userId = %s
                    ORDER BY createdAt DESC
                """
                
                cursor.execute(query, (user_id,))
                skills = cursor.fetchall()
                cursor.close()
                
        except Error as e:
            print(f"❌ Database error while fetching skills: {e}")
        
        finally:
            if connection and connection.is_connected():
                connection.close()
        
        return skills
    
    def _load_and_chunk_knowledge_base(self, file_path: str) -> List[str]:
        """
        Load and chunk the knowledge base file.
        
        Args:
            file_path: Path to the knowledge base file
            
        Returns:
            List of text chunks (Q&A pairs)
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Knowledge base file not found: {file_path}")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Split by Q: to get individual Q&A pairs
        chunks = []
        parts = content.split('Q: ')
        
        for part in parts:
            if part.strip():
                chunk = 'Q: ' + part.strip()
                chunks.append(chunk)
        
        return chunks
    
    def _create_embeddings(self, texts: List[str]) -> np.ndarray:
        """
        Create embeddings using OpenAI's embedding model.
        
        Args:
            texts: List of text strings to embed
            
        Returns:
            Numpy array of embeddings
        """
        # Use OpenAI embeddings
        embeddings = self.embedding_model.embed_documents(texts)
        return np.array(embeddings)
    
    def _get_user_context(self) -> str:
        """
        Generate comprehensive user context string from their profile.
        
        Returns:
            Formatted string with complete user profile
        """
        if not self.user_profile and not self.user_skills:
            return "No specific user profile data available yet."
        
        context_parts = []
        
        # Basic Information
        if self.user_profile:
            if self.user_profile.get('fullName'):
                context_parts.append(f"Name: {self.user_profile['fullName']}")
            
            if self.user_profile.get('email'):
                context_parts.append(f"Email: {self.user_profile['email']}")
            
            if self.user_profile.get('phone'):
                context_parts.append(f"Phone: {self.user_profile['phone']}")
            
            if self.user_profile.get('website'):
                context_parts.append(f"Website: {self.user_profile['website']}")
            
            # Professional Summary
            if self.user_profile.get('summary'):
                context_parts.append(f"\nProfessional Summary:\n{self.user_profile['summary']}")
            
            # Career Information
            if self.user_profile.get('experienceLevel'):
                context_parts.append(f"\nExperience Level: {self.user_profile['experienceLevel']}")
            
            if self.user_profile.get('preferredCareerTrack'):
                context_parts.append(f"Preferred Career Track: {self.user_profile['preferredCareerTrack']}")
            
            if self.user_profile.get('targetRoles'):
                context_parts.append(f"Target Roles: {self.user_profile['targetRoles']}")
            
            # Education
            if self.user_profile.get('educationLevel'):
                context_parts.append(f"Education Level: {self.user_profile['educationLevel']}")
            
            if self.user_profile.get('department'):
                context_parts.append(f"Department: {self.user_profile['department']}")
            
            # Detailed Education History
            if self.user_profile.get('education') and len(self.user_profile['education']) > 0:
                context_parts.append("\nEducation History:")
                for edu in self.user_profile['education']:
                    edu_line = f"- {edu.get('degree', 'Degree')} in {edu.get('fieldOfStudy', 'Field')}"
                    if edu.get('institution'):
                        edu_line += f" from {edu['institution']}"
                    if edu.get('graduationYear'):
                        edu_line += f" ({edu['graduationYear']})"
                    if edu.get('grade'):
                        edu_line += f" - Grade: {edu['grade']}"
                    context_parts.append(edu_line)
            
            # Work Experience
            if self.user_profile.get('workExperience') and len(self.user_profile['workExperience']) > 0:
                context_parts.append("\nWork Experience:")
                for work in self.user_profile['workExperience']:
                    work_line = f"- {work.get('jobTitle', 'Position')} at {work.get('company', 'Company')}"
                    if work.get('startDate'):
                        work_line += f" ({work['startDate']}"
                        if work.get('endDate'):
                            work_line += f" - {work['endDate']})"
                        else:
                            work_line += " - Present)"
                    context_parts.append(work_line)
                    
                    if work.get('responsibilities'):
                        for resp in work['responsibilities'][:3]:  # Show first 3
                            context_parts.append(f"  • {resp}")
            
            # Projects
            if self.user_profile.get('projects') and len(self.user_profile['projects']) > 0:
                context_parts.append("\nProjects:")
                for project in self.user_profile['projects']:
                    proj_line = f"- {project.get('projectName', 'Project')}"
                    if project.get('role'):
                        proj_line += f" (Role: {project['role']})"
                    context_parts.append(proj_line)
                    
                    if project.get('description'):
                        context_parts.append(f"  Description: {project['description'][:100]}...")
                    
                    if project.get('technologies'):
                        context_parts.append(f"  Technologies: {project['technologies']}")
                    
                    if project.get('achievements'):
                        for achievement in project['achievements'][:2]:  # Show first 2
                            context_parts.append(f"  • {achievement}")
            
            # Additional Context
            if self.user_profile.get('projectDescriptions'):
                context_parts.append(f"\nProject Descriptions:\n{self.user_profile['projectDescriptions'][:200]}...")
            
            if self.user_profile.get('cvText'):
                context_parts.append(f"\nCV Text/Notes:\n{self.user_profile['cvText'][:200]}...")
        
        # Skills
        skills_data = self.user_profile.get('skills', []) if self.user_profile else self.user_skills
        if skills_data:
            context_parts.append("\nSkills & Proficiency:")
            for skill in skills_data:
                skill_name = skill.get('name') or skill.get('skillName', 'Unknown')
                skill_prof = skill.get('proficiency', 'Not specified')
                context_parts.append(f"- {skill_name}: {skill_prof} level")
        
        return "\n".join(context_parts) if context_parts else "No specific user profile data available yet."
    
    def update_user_profile(self, user_profile: Optional[Dict] = None):
        """
        Update the user profile with new data.
        
        Args:
            user_profile: New user profile data
        """
        if user_profile:
            self.user_profile = user_profile
            if user_profile.get('skills'):
                self.user_skills = user_profile['skills']
            print(f"✓ User profile updated for User ID: {self.user_id}")
    
    def _setup_graph(self):
        """Set up the LangGraph workflow with tools and memory."""
        
        # Create a tool for career knowledge search
        @tool
        def search_career_knowledge(query: str) -> str:
            """
            Search the career guidance and employment knowledge base across 10 categories:
            AI & Machine Learning, Web Development, Digital Marketing, UI/UX Design, 
            Mobile Development, Data Science, Cloud & DevOps, Cybersecurity, 
            Product Management, and General Career Development.
            
            Use this tool when the user asks about:
            - Career paths and opportunities in any tech field
            - Skills to learn for specific roles
            - Job search strategies
            - Interview preparation
            - Salary information
            - Career transitions
            - Professional development
            - Any career-related questions
            
            Args:
                query: The search query
                
            Returns:
                Relevant career guidance information
            """
            return self._retrieve_relevant_context(query, top_k=3)
        
        # Create a tool to get user profile
        @tool
        def get_user_skills() -> str:
            """
            Get the current user's complete profile including personal info, skills, 
            work experience, projects, education, and career preferences.
            
            Use this tool when:
            - User asks about their profile, background, or experience
            - Providing personalized career recommendations
            - Need to understand user's current skills and proficiency levels
            - Suggesting learning paths tailored to their background
            - Discussing their projects or work experience
            - Referencing their career goals and target roles
            - Need context about their education and qualifications
            
            Returns:
                Comprehensive user profile with all available data including:
                - Personal information (name, contact details)
                - Professional summary
                - Experience level and preferred career track
                - Detailed work experience history
                - Projects with descriptions and technologies
                - Education background
                - Skills with proficiency levels
                - Target roles and career goals
            """
            return self._get_user_context()
        
        # Bind tools to LLM
        self.tools = [search_career_knowledge, get_user_skills]
        self.llm_with_tools = self.llm.bind_tools(self.tools)
        
        # Define state
        class ChatState(TypedDict):
            messages: Annotated[list[BaseMessage], add_messages]
        
        # Enhanced system prompt for career guidance
        user_info = f"\n\n=== CURRENT USER PROFILE ===\n{self._get_user_context()}\n========================\n" if (self.user_profile or self.user_skills) else ""
        
        system_prompt = f"""You are an AI-powered Career Advisor for a Youth Employment & Career Roadmap Platform.

⚠️ CRITICAL SCOPE RESTRICTION:
You MUST ONLY respond to questions about CAREERS, JOBS, PROFESSIONAL DEVELOPMENT, and WORK-RELATED topics.
If a user asks about anything else (making objects, recipes, games, general knowledge, etc.), politely decline and redirect them to career topics.

Example off-topic responses:
- User: "How to make a pencil?"
  You: "I'm a career guidance AI assistant focused on helping with your professional development. I can't help with manufacturing or DIY projects. However, I'd be happy to discuss careers in:
  • Product Design & Engineering
  • Manufacturing & Production Management
  • Supply Chain & Operations
  
  Would you like to explore career paths in any of these fields?"

- User: "Tell me a recipe"
  You: "I specialize in career guidance, not cooking! But if you're interested in culinary careers, I can help you explore:
  • Chef & Culinary Arts careers
  • Food Science & Technology
  • Restaurant Management
  • Food Product Development
  
  Are you interested in any food industry careers?"

Your role is to provide HIGHLY PERSONALIZED career guidance across 10 specialized domains:
1. 🤖 AI & Machine Learning
2. 🌐 Web Development (Frontend, Backend, Full-Stack)
3. 📱 Mobile App Development (iOS, Android, Cross-Platform)
4. 🎨 UI/UX Design
5. 📊 Data Science & Analytics
6. 📈 Digital Marketing (SEO, PPC, Content, Social Media)
7. ☁️ Cloud & DevOps
8. 🔐 Cybersecurity
9. 📦 Product Management
10. 💼 General Career Development

CAPABILITIES (CAREER-FOCUSED ONLY):
- Career path recommendations based on user's actual experience, projects, and skills
- Skill development roadmaps tailored to their current proficiency levels
- Job search strategies aligned with their target roles and career track
- Salary expectations based on their experience level and location
- Career transition guidance considering their existing background
- Industry trends relevant to their preferred domains
- Portfolio building advice using their actual projects
- Interview preparation customized to their target positions

PERSONALIZATION INSTRUCTIONS:
1. ALWAYS refer to the user's actual profile data when giving advice
2. Acknowledge their existing skills, projects, and experience in your responses
3. Use their preferred career track and target roles to focus recommendations
4. Consider their experience level (Fresher/Junior/Mid/Senior) when suggesting timelines
5. Reference their actual work experience and projects when discussing capabilities
6. Tailor learning paths based on skills they already have vs. skills they need
7. Use get_user_skills tool to access their complete profile when needed
8. Use search_career_knowledge tool for domain-specific information

RESPONSE GUIDELINES:
- Start by acknowledging relevant aspects of their profile (e.g., "Given your experience in X...")
- Provide specific, actionable advice based on their actual background
- Suggest concrete next steps that build on their existing foundation
- When discussing projects or experience, reference what they've already done
- Be encouraging about their progress and realistic about growth timelines
- Cite specific resources, salary ranges, and timelines when available
- If their profile is incomplete, politely ask for relevant details
- IMMEDIATELY DECLINE non-career questions and redirect to career topics{user_info}

TONE: Professional yet warm, empathetic, motivating, and solution-focused.
Remember: You have access to their complete profile - use it to provide truly personalized guidance!
STRICT RULE: Only answer career, job, and professional development questions. Politely refuse everything else."""
        
        # Create nodes
        def chat_node(state: ChatState):
            messages = state["messages"]
            
            # Add system message if not present
            if not messages or not isinstance(messages[0], SystemMessage):
                messages = [SystemMessage(content=system_prompt)] + messages
            
            response = self.llm_with_tools.invoke(messages)
            return {"messages": [response]}
        
        tool_node = ToolNode(self.tools)
        
        # Build graph with memory
        graph = StateGraph(ChatState)
        graph.add_node("chat_node", chat_node)
        graph.add_node("tools", tool_node)
        
        graph.add_edge(START, "chat_node")
        graph.add_conditional_edges("chat_node", tools_condition)
        graph.add_edge("tools", "chat_node")
        
        # Compile with memory checkpointing
        self.graph = graph.compile(checkpointer=self.memory)
    
    def _retrieve_relevant_context(self, query: str, top_k: int = 3) -> str:
        """
        Retrieve the most relevant chunks from the knowledge base using OpenAI embeddings.
        
        Args:
            query: User's question
            top_k: Number of top chunks to retrieve
            
        Returns:
            Concatenated relevant context
        """
        # Create embedding for the query using OpenAI
        query_embedding = np.array(self.embedding_model.embed_query(query))
        
        # Calculate cosine similarity
        similarities = np.dot(self.chunk_embeddings, query_embedding) / (
            np.linalg.norm(self.chunk_embeddings, axis=1) * np.linalg.norm(query_embedding)
        )
        
        # Get indices of top_k most similar chunks
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        top_scores = similarities[top_indices]
        
        # Print retrieval information
        print(f"\n🔍 RAG Retrieval Results:")
        for idx, (chunk_idx, score) in enumerate(zip(top_indices, top_scores), 1):
            print(f"  [{idx}] Similarity: {score:.4f}")
            preview = self.knowledge_chunks[chunk_idx][:100].replace('\n', ' ')
            print(f"      Preview: {preview}...")
        
        # Retrieve the actual chunks
        relevant_chunks = [self.knowledge_chunks[idx] for idx in top_indices]
        
        # Concatenate with clear separation
        context = "\n\n---\n\n".join(relevant_chunks)
        
        return context
    
    def ask_stream(self, query: str):
        """
        Answer a user question using RAG with streaming response (like ChatGPT).
        
        Args:
            query: User's question
            
        Yields:
            Streamed response chunks
        """
        print(f"\n💬 User Question: {query}")
        print("-"*70)
        print("\n🤖 Career Bot: ", end="", flush=True)
        
        try:
            # Configuration for thread-based memory
            config = {"configurable": {"thread_id": self.thread_id}}
            
            # Stream the response
            full_response = ""
            for chunk in self.graph.stream(
                {"messages": [HumanMessage(content=query)]},
                config=config,
                stream_mode="values"
            ):
                messages = chunk.get("messages", [])
                if messages:
                    last_message = messages[-1]
                    if isinstance(last_message, AIMessage) and last_message.content:
                        # Extract new content
                        if len(last_message.content) > len(full_response):
                            new_content = last_message.content[len(full_response):]
                            print(new_content, end="", flush=True)
                            full_response = last_message.content
                            yield new_content
            
            print("\n" + "-"*70 + "\n")
            
        except Exception as e:
            error_msg = f"Error generating response: {str(e)}"
            print(f"\n❌ {error_msg}\n")
            import traceback
            traceback.print_exc()
            yield error_msg
    
    def ask(self, query: str) -> str:
        """
        Answer a user question using RAG with streaming (collects full response).
        
        Args:
            query: User's question
            
        Returns:
            Complete answer
        """
        full_response = ""
        for chunk in self.ask_stream(query):
            full_response += chunk
        return full_response
    
    def interactive_mode(self):
        """Run the career bot in interactive mode with streaming responses."""
        print("\n" + "="*70)
        print("🎯 AI-Powered Career Bot - Interactive Mode with Streaming")
        print("="*70)
        
        if self.user_id and self.user_skills:
            print(f"👤 User ID: {self.user_id}")
            print(f"📊 Your Skills: {', '.join([s['skillName'] for s in self.user_skills])}")
        
        print(f"\n🔗 Conversation Thread: {self.thread_id}")
        print("\n💡 I can help you with careers in:")
        print("   🤖 AI & ML  |  🌐 Web Dev  |  📱 Mobile  |  🎨 UI/UX  |  📊 Data Science")
        print("   📈 Marketing  |  ☁️ Cloud/DevOps  |  🔐 Security  |  📦 Product  |  💼 Career")
        print("\nType 'quit', 'exit', or 'q' to end the conversation.")
        print("="*70 + "\n")
        
        while True:
            try:
                user_input = input("You: ").strip()
                
                if not user_input:
                    continue
                
                if user_input.lower() in ['quit', 'exit', 'q']:
                    print("\n👋 Thank you for using Career Bot! Best of luck with your career journey!")
                    break
                
                # Stream the response
                self.ask(user_input)
                
            except KeyboardInterrupt:
                print("\n\n👋 Thank you for using Career Bot! Best of luck with your career journey!")
                break
            except Exception as e:
                print(f"\n❌ Error: {e}\n")


def main():
    """Main function to run the Career Bot."""
    
    print("="*70)
    print("🌟 Welcome to AI-Powered Youth Employment & Career Roadmap Platform")
    print("="*70)
    
    # Check if knowledge base exists
    if not os.path.exists("knowledge_base.txt"):
        print("❌ Error: knowledge_base.txt not found!")
        print("Please ensure the knowledge_base.txt file is in the same directory.")
        return
    
    # Check for API key
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ Error: OPENAI_API_KEY not found in environment variables!")
        print("Please set your OpenAI API key in .env file")
        return
    
    # Ask for user ID for personalization
    print("\n🔐 Personalization Setup")
    print("-" * 70)
    user_id_input = input("Enter your User ID (press Enter to skip): ").strip()
    
    user_id = None
    if user_id_input and user_id_input.isdigit():
        user_id = int(user_id_input)
    
    # Initialize the bot
    try:
        bot = CareerBotRAG(user_id=user_id)
        
        # Run in interactive mode
        bot.interactive_mode()
        
    except Exception as e:
        print(f"\n❌ Failed to initialize Career Bot: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
