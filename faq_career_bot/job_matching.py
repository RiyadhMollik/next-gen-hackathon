"""
Intelligent Job Matching System with Match Percentage
Analyzes user skills against job requirements and provides detailed recommendations
"""

import mysql.connector
from mysql.connector import Error
from typing import List, Dict, Tuple
import re
from collections import Counter


class JobMatchingEngine:
    """Intelligent job matching system with skill analysis and recommendations"""
    
    def __init__(self):
        """Initialize the job matching engine"""
        self.db_config = {
            "host": "localhost",
            "user": "root",
            "password": "",
            "database": "final_db",
            "port": 3307
        }
        
        # Skill proficiency weights
        self.proficiency_weights = {
            "Beginner": 0.3,
            "Intermediate": 0.6,
            "Advanced": 0.9,
            "Expert": 1.0
        }
        
        # Experience level mapping
        self.experience_levels = {
            "Fresher": 0,
            "Junior": 1,
            "Mid-level": 2,
            "Senior": 3
        }
        
        # Job platforms with URLs
        self.job_platforms = {
            "LinkedIn": "https://www.linkedin.com/jobs",
            "BDjobs": "https://www.bdjobs.com",
            "Glassdoor": "https://www.glassdoor.com/Job",
            "Indeed": "https://www.indeed.com",
            "AngelList": "https://angel.co/jobs",
            "GitHub Jobs": "https://jobs.github.com",
            "Stack Overflow": "https://stackoverflow.com/jobs",
            "Remote.co": "https://remote.co/remote-jobs",
            "We Work Remotely": "https://weworkremotely.com"
        }
    
    def get_user_skills(self, user_id: int) -> List[Dict]:
        """Fetch user skills from database"""
        connection = None
        try:
            connection = mysql.connector.connect(**self.db_config)
            cursor = connection.cursor(dictionary=True)
            
            query = """
                SELECT skillName, proficiency 
                FROM UserSkills 
                WHERE userId = %s
            """
            cursor.execute(query, (user_id,))
            skills = cursor.fetchall()
            cursor.close()
            return skills
            
        except Error as e:
            print(f"❌ Database error: {e}")
            return []
        finally:
            if connection and connection.is_connected():
                connection.close()
    
    def get_all_jobs(self) -> List[Dict]:
        """Fetch all jobs from database"""
        connection = None
        try:
            connection = mysql.connector.connect(**self.db_config)
            cursor = connection.cursor(dictionary=True)
            
            query = """
                SELECT id, title, company, location, requiredSkills, 
                       experienceLevel, jobType, careerTrack, description
                FROM Jobs
            """
            cursor.execute(query)
            jobs = cursor.fetchall()
            cursor.close()
            return jobs
            
        except Error as e:
            print(f"❌ Database error: {e}")
            return []
        finally:
            if connection and connection.is_connected():
                connection.close()
    
    def parse_required_skills(self, skills_str: str) -> List[str]:
        """Parse required skills string into list"""
        if not skills_str:
            return []
        
        # Remove brackets and quotes, split by comma
        skills_str = skills_str.strip('[]"\'')
        skills = [s.strip(' "\'') for s in skills_str.split(',')]
        return [s for s in skills if s]
    
    def normalize_skill(self, skill: str) -> str:
        """Normalize skill name for comparison"""
        return skill.lower().strip().replace('-', '').replace('.', '')
    
    def calculate_skill_match(self, user_skills: List[Dict], required_skills: List[str]) -> Dict:
        """
        Calculate skill match score and details
        Returns: {
            'score': float (0-1),
            'matched_skills': list,
            'missing_skills': list,
            'proficiency_bonus': float
        }
        """
        # Normalize user skills
        user_skill_map = {
            self.normalize_skill(skill['skillName']): skill['proficiency']
            for skill in user_skills
        }
        
        # Normalize required skills
        required_normalized = [self.normalize_skill(s) for s in required_skills]
        
        matched_skills = []
        missing_skills = []
        proficiency_sum = 0
        
        for req_skill in required_skills:
            req_norm = self.normalize_skill(req_skill)
            
            if req_norm in user_skill_map:
                proficiency = user_skill_map[req_norm]
                matched_skills.append({
                    'skill': req_skill,
                    'proficiency': proficiency,
                    'weight': self.proficiency_weights.get(proficiency, 0.5)
                })
                proficiency_sum += self.proficiency_weights.get(proficiency, 0.5)
            else:
                missing_skills.append(req_skill)
        
        # Calculate score
        if not required_skills:
            return {
                'score': 0,
                'matched_skills': [],
                'missing_skills': [],
                'proficiency_bonus': 0
            }
        
        # Base score: percentage of matched skills
        base_score = len(matched_skills) / len(required_skills)
        
        # Proficiency bonus: average proficiency weight of matched skills
        proficiency_bonus = 0
        if matched_skills:
            proficiency_bonus = proficiency_sum / len(matched_skills) * 0.2  # 20% bonus max
        
        total_score = min(base_score + proficiency_bonus, 1.0)
        
        return {
            'score': total_score,
            'matched_skills': matched_skills,
            'missing_skills': missing_skills,
            'proficiency_bonus': proficiency_bonus
        }
    
    def calculate_experience_match(self, user_level: str, job_level: str) -> float:
        """Calculate experience level match score (0-1)"""
        if not user_level or not job_level:
            return 0.5
        
        user_exp = self.experience_levels.get(user_level, 0)
        job_exp = self.experience_levels.get(job_level, 0)
        
        diff = abs(user_exp - job_exp)
        
        # Perfect match
        if diff == 0:
            return 1.0
        # One level difference
        elif diff == 1:
            return 0.7
        # Two levels difference
        elif diff == 2:
            return 0.4
        else:
            return 0.2
    
    def calculate_track_match(self, user_track: str, job_track: str) -> float:
        """Calculate career track match score (0-1)"""
        if not user_track or not job_track:
            return 0.5
        
        user_track_norm = self.normalize_skill(user_track)
        job_track_norm = self.normalize_skill(job_track)
        
        if user_track_norm == job_track_norm:
            return 1.0
        
        # Partial matches for related tracks
        related_tracks = {
            'webdevelopment': ['frontend', 'backend', 'fullstack', 'softwaredevelopment'],
            'mobiledevelopment': ['ios', 'android', 'softwaredevelopment'],
            'dataanalytics': ['datascience', 'machinelearning', 'ai'],
            'ai': ['machinelearning', 'datascience'],
        }
        
        for main_track, related in related_tracks.items():
            if main_track in user_track_norm:
                if any(r in job_track_norm for r in related):
                    return 0.6
        
        return 0.3
    
    def get_job_platforms_for_job(self, job: Dict) -> List[Dict]:
        """Get relevant job platforms for a specific job"""
        platforms = []
        
        # LinkedIn - always relevant
        platforms.append({
            'name': 'LinkedIn',
            'url': f"{self.job_platforms['LinkedIn']}/search?keywords={job['title'].replace(' ', '+')}",
            'priority': 'High'
        })
        
        # BDjobs - for Bangladesh jobs
        if 'bangladesh' in job.get('location', '').lower() or 'dhaka' in job.get('location', '').lower():
            platforms.append({
                'name': 'BDjobs',
                'url': self.job_platforms['BDjobs'],
                'priority': 'High'
            })
        
        # Indeed - general
        platforms.append({
            'name': 'Indeed',
            'url': f"{self.job_platforms['Indeed']}/jobs?q={job['title'].replace(' ', '+')}",
            'priority': 'High'
        })
        
        # Tech-specific platforms
        tech_keywords = ['developer', 'engineer', 'programmer', 'software', 'data', 'ai', 'ml']
        if any(keyword in job['title'].lower() for keyword in tech_keywords):
            platforms.append({
                'name': 'GitHub Jobs',
                'url': self.job_platforms['GitHub Jobs'],
                'priority': 'Medium'
            })
            platforms.append({
                'name': 'Stack Overflow',
                'url': self.job_platforms['Stack Overflow'],
                'priority': 'Medium'
            })
        
        # Remote jobs
        if job.get('location', '').lower() == 'remote':
            platforms.append({
                'name': 'Remote.co',
                'url': self.job_platforms['Remote.co'],
                'priority': 'High'
            })
            platforms.append({
                'name': 'We Work Remotely',
                'url': self.job_platforms['We Work Remotely'],
                'priority': 'High'
            })
        
        # Glassdoor - for company insights
        platforms.append({
            'name': 'Glassdoor',
            'url': f"{self.job_platforms['Glassdoor']}/Jobs/{job['company'].replace(' ', '-')}-jobs-SRCH_KE0,{len(job['company'])}.htm",
            'priority': 'Medium'
        })
        
        return platforms
    
    def match_user_to_jobs(self, user_id: int, user_experience: str = None, 
                          user_track: str = None, top_n: int = 10) -> List[Dict]:
        """
        Match user to jobs with detailed scoring
        
        Args:
            user_id: User ID from database
            user_experience: User's experience level (optional)
            user_track: User's preferred career track (optional)
            top_n: Number of top matches to return
            
        Returns:
            List of job matches with scores and recommendations
        """
        # Get user skills
        user_skills = self.get_user_skills(user_id)
        
        if not user_skills:
            return []
        
        # Get all jobs
        jobs = self.get_all_jobs()
        
        if not jobs:
            return []
        
        matches = []
        
        for job in jobs:
            # Parse required skills
            required_skills = self.parse_required_skills(job['requiredSkills'])
            
            # Calculate skill match
            skill_match = self.calculate_skill_match(user_skills, required_skills)
            
            # Calculate experience match
            experience_match = 0.5
            if user_experience:
                experience_match = self.calculate_experience_match(
                    user_experience, 
                    job['experienceLevel']
                )
            
            # Calculate track match
            track_match = 0.5
            if user_track:
                track_match = self.calculate_track_match(
                    user_track, 
                    job['careerTrack']
                )
            
            # Calculate overall match score (weighted average)
            overall_score = (
                skill_match['score'] * 0.6 +      # 60% weight on skills
                experience_match * 0.25 +          # 25% weight on experience
                track_match * 0.15                 # 15% weight on track
            )
            
            # Get job platforms
            platforms = self.get_job_platforms_for_job(job)
            
            # Build match reasons
            reasons = []
            
            if skill_match['matched_skills']:
                matched_names = [s['skill'] for s in skill_match['matched_skills']]
                reasons.append(f"✓ Matches {len(matched_names)} skills: {', '.join(matched_names[:5])}")
            
            if skill_match['missing_skills']:
                missing_names = skill_match['missing_skills']
                reasons.append(f"✗ Missing {len(missing_names)} skills: {', '.join(missing_names[:5])}")
            
            if experience_match >= 0.7:
                reasons.append(f"✓ Experience level matches ({job['experienceLevel']})")
            elif experience_match < 0.5:
                reasons.append(f"⚠ Experience mismatch (requires {job['experienceLevel']})")
            
            if track_match >= 0.7:
                reasons.append(f"✓ Career track aligns ({job['careerTrack']})")
            
            matches.append({
                'job_id': job['id'],
                'title': job['title'],
                'company': job['company'],
                'location': job['location'],
                'job_type': job['jobType'],
                'experience_level': job['experienceLevel'],
                'career_track': job['careerTrack'],
                'description': job['description'],
                'required_skills': required_skills,
                'match_score': overall_score,
                'match_percentage': round(overall_score * 100, 1),
                'skill_match': skill_match,
                'experience_match': experience_match,
                'track_match': track_match,
                'reasons': reasons,
                'platforms': platforms,
                'recommendation': self.get_recommendation(overall_score, skill_match)
            })
        
        # Sort by match score
        matches.sort(key=lambda x: x['match_score'], reverse=True)
        
        return matches[:top_n]
    
    def get_recommendation(self, match_score: float, skill_match: Dict) -> str:
        """Generate recommendation based on match score"""
        if match_score >= 0.8:
            return "🎯 Excellent match! Apply now!"
        elif match_score >= 0.6:
            return "✅ Good match! Consider applying."
        elif match_score >= 0.4:
            if len(skill_match['missing_skills']) <= 2:
                return "📚 Learn these missing skills and apply soon!"
            else:
                return "⚠ Moderate match. Focus on building required skills."
        else:
            return "❌ Low match. Consider other opportunities or upskill significantly."
    
    def format_match_report(self, match: Dict) -> str:
        """Format a single match as a readable report"""
        report = []
        report.append("=" * 80)
        report.append(f"🏢 {match['title']} at {match['company']}")
        report.append(f"📍 {match['location']} | {match['job_type']} | {match['experience_level']}")
        report.append(f"🎯 Career Track: {match['career_track']}")
        report.append("")
        report.append(f"💯 MATCH SCORE: {match['match_percentage']}% {self.get_score_emoji(match['match_percentage'])}")
        report.append("")
        report.append("📊 Score Breakdown:")
        report.append(f"  • Skills Match: {match['skill_match']['score']*100:.1f}%")
        report.append(f"  • Experience Match: {match['experience_match']*100:.1f}%")
        report.append(f"  • Track Match: {match['track_match']*100:.1f}%")
        report.append("")
        report.append("📝 Match Analysis:")
        for reason in match['reasons']:
            report.append(f"  {reason}")
        report.append("")
        report.append(f"💡 Recommendation: {match['recommendation']}")
        report.append("")
        report.append("🔍 Where to Apply:")
        for platform in match['platforms'][:5]:
            report.append(f"  • {platform['name']} [{platform['priority']} Priority]")
            report.append(f"    {platform['url']}")
        report.append("=" * 80)
        
        return "\n".join(report)
    
    def get_score_emoji(self, score: float) -> str:
        """Get emoji based on score"""
        if score >= 80:
            return "🔥"
        elif score >= 60:
            return "✨"
        elif score >= 40:
            return "💡"
        else:
            return "📚"
    
    def get_learning_recommendations(self, matches: List[Dict]) -> Dict:
        """Analyze matches and provide learning recommendations"""
        all_missing_skills = []
        
        for match in matches:
            all_missing_skills.extend(match['skill_match']['missing_skills'])
        
        # Count frequency
        skill_frequency = Counter(all_missing_skills)
        top_skills = skill_frequency.most_common(10)
        
        return {
            'most_needed_skills': [skill for skill, count in top_skills],
            'skill_frequency': dict(top_skills),
            'recommendation': f"Focus on learning: {', '.join([s for s, _ in top_skills[:5]])}"
        }
    
    def get_json_output(self, user_id: int, user_experience: str = None, 
                       user_track: str = None, top_n: int = 10) -> Dict:
        """
        Get complete job matching results as JSON-ready dictionary
        
        Returns:
            Dictionary with all matching results in JSON format
        """
        matches = self.match_user_to_jobs(
            user_id=user_id,
            user_experience=user_experience,
            user_track=user_track,
            top_n=top_n
        )
        
        if not matches:
            return {
                "success": False,
                "message": "No matches found. Please check user skills or job data.",
                "user_id": user_id,
                "total_matches": 0,
                "matches": [],
                "learning_recommendations": {}
            }
        
        # Get learning recommendations
        learning = self.get_learning_recommendations(matches)
        
        # Enhance each match with clear missing skills section
        enhanced_matches = []
        for match in matches:
            enhanced_match = {
                "job_id": match['job_id'],
                "title": match['title'],
                "company": match['company'],
                "location": match['location'],
                "job_type": match['job_type'],
                "experience_level": match['experience_level'],
                "career_track": match['career_track'],
                "description": match['description'][:200] + "..." if len(match['description']) > 200 else match['description'],
                "match_percentage": match['match_percentage'],
                "match_score": round(match['match_score'], 3),
                "recommendation": match['recommendation'],
                "score_breakdown": {
                    "skills_match": round(match['skill_match']['score'] * 100, 1),
                    "experience_match": round(match['experience_match'] * 100, 1),
                    "track_match": round(match['track_match'] * 100, 1)
                },
                "skills_analysis": {
                    "required_skills": match['required_skills'],
                    "total_required": len(match['required_skills']),
                    "matched_skills": [
                        {
                            "skill": s['skill'],
                            "proficiency": s['proficiency'],
                            "weight": s['weight']
                        } for s in match['skill_match']['matched_skills']
                    ],
                    "total_matched": len(match['skill_match']['matched_skills']),
                    "missing_skills": match['skill_match']['missing_skills'],
                    "total_missing": len(match['skill_match']['missing_skills']),
                    "match_rate": f"{len(match['skill_match']['matched_skills'])}/{len(match['required_skills'])}"
                },
                "reasons": match['reasons'],
                "platforms": match['platforms'][:5]
            }
            enhanced_matches.append(enhanced_match)
        
        return {
            "success": True,
            "user_id": user_id,
            "user_experience": user_experience,
            "user_track": user_track,
            "total_matches": len(matches),
            "matches": enhanced_matches,
            "learning_recommendations": {
                "top_skills_to_learn": learning['most_needed_skills'],
                "skill_demand": learning['skill_frequency'],
                "summary": learning['recommendation'],
                "total_unique_missing_skills": len(learning['most_needed_skills'])
            },
            "summary": {
                "best_match_percentage": enhanced_matches[0]['match_percentage'] if enhanced_matches else 0,
                "average_match_percentage": round(sum(m['match_percentage'] for m in enhanced_matches) / len(enhanced_matches), 1) if enhanced_matches else 0,
                "high_matches": len([m for m in enhanced_matches if m['match_percentage'] >= 70]),
                "good_matches": len([m for m in enhanced_matches if 50 <= m['match_percentage'] < 70]),
                "potential_matches": len([m for m in enhanced_matches if m['match_percentage'] < 50])
            }
        }
    


# Test function
def test_job_matching():
    """Test the job matching system"""
    import json
    
    print("🚀 Testing Intelligent Job Matching System")
    print("=" * 80)
    
    engine = JobMatchingEngine()
    
    # Test with user ID 1
    user_id = 1
    user_experience = "Intermediate"
    user_track = "Web Development"
    
    print(f"\n👤 Finding matches for User ID: {user_id}")
    print(f"📊 Experience: {user_experience}")
    print(f"🎯 Track: {user_track}")
    print()
    
    matches = engine.match_user_to_jobs(
        user_id=user_id,
        user_experience=user_experience,
        user_track=user_track,
        top_n=5
    )
    
    if not matches:
        print("❌ No matches found or no data available")
        return
    
    # Get learning recommendations
    learning = engine.get_learning_recommendations(matches)
    
    # Build complete JSON output
    output = {
        "success": True,
        "user_id": user_id,
        "user_experience": user_experience,
        "user_track": user_track,
        "total_matches": len(matches),
        "matches": matches,
        "learning_recommendations": learning
    }
    
    print(f"✅ Found {len(matches)} job matches!\n")
    print("="*80)
    print("� JSON OUTPUT")
    print("="*80)
    print(json.dumps(output, indent=2, default=str))
    
    # Also save to file
    with open('job_matching_results.json', 'w') as f:
        json.dump(output, f, indent=2, default=str)
    
    print("\n" + "="*80)
    print("✅ Results saved to: job_matching_results.json")
    print("="*80)


if __name__ == "__main__":
    test_job_matching()
