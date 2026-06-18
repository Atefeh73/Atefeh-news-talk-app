import urllib.request
import xml.etree.ElementTree as ET
from flask import Flask, jsonify, render_template

app = Flask(__name__)

FEED_URL = "http://rss.cnn.com/rss/edition.rss"

def parse_feed():
    try:
        req = urllib.request.Request(
            FEED_URL, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            xml_data = response.read()
            
        root = ET.fromstring(xml_data)
        
        # Handle RSS format (CNN)
        items = root.findall(".//item")
        entries = []
        
        if items:
            for item in items:
                title = item.find("title")
                link = item.find("link")
                desc = item.find("description")
                pub_date = item.find("pubDate")
                guid = item.find("guid")
                
                title_text = title.text if title is not None else "No Headline"
                link_text = link.text if link is not None else "#"
                desc_text = desc.text if desc is not None else ""
                pub_date_text = pub_date.text if pub_date is not None else ""
                guid_text = guid.text if guid is not None else link_text
                
                # Format content as HTML
                content_html = f"<p>{desc_text}</p><p><a href='{link_text}' target='_blank'>Read full story on CNN <i class='fa-solid fa-arrow-up-right-from-square'></i></a></p>"
                
                entries.append({
                    "id": guid_text,
                    "title": pub_date_text,
                    "updated": pub_date_text,
                    "headline": title_text,
                    "content": content_html
                })
        else:
            # Fallback to Atom format
            ns = {"atom": "http://www.w3.org/2005/Atom"}
            for entry in root.findall("atom:entry", ns):
                title = entry.find("atom:title", ns)
                updated = entry.find("atom:updated", ns)
                id_val = entry.find("atom:id", ns)
                content = entry.find("atom:content", ns)
                
                entries.append({
                    "id": id_val.text if id_val is not None else "",
                    "title": title.text if title is not None else "",
                    "updated": updated.text if updated is not None else "",
                    "headline": "",
                    "content": content.text if content is not None else ""
                })
        return entries, None
    except Exception as e:
        return None, str(e)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/releases")
def get_releases():
    entries, error = parse_feed()
    if error:
        return jsonify({"success": False, "error": error}), 500
    return jsonify({"success": True, "releases": entries})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
