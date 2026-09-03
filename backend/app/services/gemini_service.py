import os
import json
import google.generativeai as genai
from typing import Dict, Any
from app.core.config import settings

def analyze_csr_need(csr_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyzes a CSR Need using Gemini and returns structured schema.
    """
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        raise ValueError("Gemini API key is missing.")
        
    genai.configure(api_key=api_key)
    
    prompt = f"""
You are an expert CSR (Corporate Social Responsibility) analyst.
Analyze the following CSR requirement submitted to Inspectra.

CSR REQUIREMENT DATA:
State: {csr_data.get('state')}
District: {csr_data.get('district')}
City/Locality: {csr_data.get('city_locality')}
Category: {csr_data.get('category')}
Beneficiary Type: {csr_data.get('beneficiary_type')}
Beneficiary Count: {csr_data.get('beneficiary_count')}
Urgency: {csr_data.get('urgency')}
Description: {csr_data.get('description')}

INSTRUCTIONS:
1. Understand the core problem and structural need.
2. Return ONLY a valid JSON object matching exactly the following schema.
3. Do NOT invent facts or NGO recommendations.
4. Do NOT include markdown blocks like ```json or anything else outside the curly brackets.

SCHEMA:
{{
  "summary": "Short 1-2 sentence summary of the need",
  "identified_category": "The specific field (e.g. Education, Healthcare)",
  "beneficiary_group": "Who this helps",
  "required_intervention": "What action needs to be taken",
  "key_need": "The single most important requirement",
  "analysis": "A brief paragraph explaining the context and importance"
}}
    """
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.2,
            )
        )
        
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
        
        parsed = json.loads(text)
        
        expected_keys = {"summary", "identified_category", "beneficiary_group", "required_intervention", "key_need", "analysis"}
        if not expected_keys.issubset(parsed.keys()):
            raise ValueError("Gemini response is missing required fields.")
            
        return parsed
        
    except json.JSONDecodeError:
        raise ValueError("Failed to parse Gemini response into JSON.")
    except Exception as e:
        raise ValueError(f"Gemini API failure: {str(e)}")
