import os
import json
import requests
import time

def main():
    # Load env variables directly if python-dotenv is not installed
    api_key = os.environ.get("VITE_GEMINI_API_KEY")
    if not api_key:
        with open('.env', 'r') as f:
            for line in f:
                if line.startswith('VITE_GEMINI_API_KEY='):
                    api_key = line.split('=', 1)[1].strip()
                    break

    if not api_key:
        print("Error: VITE_GEMINI_API_KEY not found.")
        return

    modules_path = os.path.join("src", "data", "modules.json")
    with open(modules_path, 'r', encoding='utf-8') as f:
        modules = json.load(f)

    codex_db = {}
    
    print(f"Generating high-fidelity Codex entries for {len(modules)} modules...")

    for module in modules:
        mod_id = module['id']
        title = module['title']
        desc = module['description']
        
        topics = ", ".join([lesson['title'] for lesson in module.get('lessons', []) if lesson['type'] != 'quiz'])

        print(f"[{mod_id}] Processing: {title}...")

        prompt = f"""
You are Pythia, a friendly, encouraging coding mentor writing a helpful lesson for a beginner programmer.
Your goal is to write a clear, easy-to-understand educational guide about '{title}'.

Module Context: "{desc}"
Key concepts to cover: {topics}

Write a friendly 4-part instructional guide using GitHub Flavored Markdown.
Include simple, human explanations. Avoid intimidating vocabulary and overly complex technical jargon. Explain concepts with fun, real-world analogies.

Structure the response exactly as follows:

# {title}: The Basics
(Explain what this is and why it's cool in simple, friendly terms. Imagine you're explaining it to a friend who is casually interested in coding.)

# How It Works (With Code)
(Provide clear, simple code snippets with friendly comments explaining what each line does.)

# Watch Out For This
(Friendly advice on common mistakes beginners make and how to avoid them.)

# Real World Example
(Give 1 or 2 concrete, fun examples of how this is used in everyday apps we use.)

IMPORTANT LIMITATIONS:
- Return ONLY the Markdown. No preamble, no postscript.
- Keep the tone encouraging, human, and absolutely not intimidating.
- Use Mermaid diagrams if it helps explain a concept simply.
"""
        
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.4}
        }
        
        try:
            response = requests.post(url, json=payload)
            response.raise_for_status()
            data = response.json()
            markdown_content = data['candidates'][0]['content']['parts'][0]['text']
            
            codex_db[mod_id] = {
                "moduleId": mod_id,
                "title": title,
                "content": markdown_content
            }
            print(f"  -> Generated {len(markdown_content)} bytes of Codex lore.")
            time.sleep(2)  # Rate limiting
        except Exception as e:
            print(f"  -> Error generating {mod_id}: {e}")
            
    codex_path = os.path.join("src", "data", "codex.json")
    with open(codex_path, 'w', encoding='utf-8') as f:
        json.dump(codex_db, f, indent=2)
        
    print(f"Successfully wrote Codex DB to {codex_path}")

if __name__ == '__main__':
    main()
