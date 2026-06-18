# CNN News Insights Web Application (Navy & Instagram Update)

A premium, responsive single-page web application built with **Python Flask** and **Vanilla HTML, JavaScript, and CSS**. The application fetches the official CNN Edition RSS feed, dynamically parses it into stories, and renders them in a custom dark navy blue visual layout.

---

## 🏗️ Project Architecture

```mermaid
graph TD
    subgraph Backend [Flask Application Backend]
        A[app.py] -->|1. Fetches RSS feed| B(CNN Edition Feed)
        A -->|2. Parses RSS item tags| C[rss:item list]
        A -->|3. Serves API| D[/api/releases]
        A -->|4. Serves Page| E[/]
    end
    subgraph Frontend [Client Web Interface]
        E -->|Loads| F[index.html]
        F -->|Applies Style| G[style.css]
        F -->|Runs logic| H[app.js]
        D -->|Fetch JSON| H
        H -->|1. Keyword classifies stories| I[Categorized News Cards]
        H -->|2. Filters & Searches| J[Rendered cards]
        H -->|3. Click Tweet / Instagram| K[Composer Modals]
        K -->|4a. Post Update to X| L((X / Twitter Intent))
        K -->|4b. Download Graphic Card| M((Instagram Share Card))
    end
end
```

---

## 📁 File Structure

The project is structured under the [bq-releases-notes](file:///Users/atefehhosseini/agy-cli-projects/bq-releases-notes) directory:

*   🐍 **[app.py](file:///Users/atefehhosseini/agy-cli-projects/bq-releases-notes/app.py)**: The Flask backend that fetches and serves the CNN RSS data.
*   📄 **[templates/index.html](file:///Users/atefehhosseini/agy-cli-projects/bq-releases-notes/templates/index.html)**: The modern responsive layout with modals for X and Instagram.
*   🎨 **[static/css/style.css](file:///Users/atefehhosseini/agy-cli-projects/bq-releases-notes/static/css/style.css)**: Custom navy blue theme featuring glassmorphism elements and custom badge colors.
*   ⚙️ **[static/js/app.js](file:///Users/atefehhosseini/agy-cli-projects/bq-releases-notes/static/js/app.js)**: Client-side logic for classifying news categories, drawing image cards on HTML5 canvas, and handling clipboard copies.

---

## ✨ Features & Design Aesthetics

1.  **Navy Blue Visual Theme**: Styled with a premium dark navy blue background (`#030a16`), slate blue borders, and glowing royal blue backdrops for an elegant look.
2.  **Stable RSS Integration**: Utilizes the official, high-performance CNN RSS feed (`http://rss.cnn.com/rss/edition.rss`) to fetch global headlines quickly and reliably.
3.  **Dynamic Instagram Post Creator**:
    *   **Live Preview**: Generates a square image (1080x1080 style) on HTML5 Canvas representing the story as a graphic banner (complete with custom category badge highlights, brand logo, and centered story text).
    *   **Direct Download**: Users can download the generated card as a PNG image directly to their device.
    *   **Auto-Captioning**: Formats a custom caption including description blocks and hashtags, ready to copy and paste upon upload.
4.  **X/Twitter Sharing**: Formats posts as `[CNN] Headline #CATEGORY` with real-time character constraints.

---

## 🚀 Running the Server

To view the application:
1.  Open your browser and navigate to **`http://127.0.0.1:5000`**.
2.  Browse, search, filter, and tweet/share the latest news.
