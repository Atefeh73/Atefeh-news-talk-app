# CNN News Insights (Atefeh-news-talk-app)

A premium, responsive single-page web application built with **Python Flask** and **Vanilla HTML, JavaScript, and CSS** that tracks live global headlines from the CNN Edition RSS feed and integrates sharing utilities for X (Twitter) and Instagram.

---

## 🚀 Key Features

*   **Real-time News Feed**: Pulls live stories directly from the official CNN Edition RSS feed.
*   **Intelligent Classification**: Automatically classifies articles into categories (**Politics**, **World**, **Business & Econ**, **Tech & Sci**, or **General**) based on keyword analysis.
*   **Search & Filtering**: Filter by clicking category chips or perform instant searches across headlines and body descriptions.
*   **Interactive X/Twitter Composer**: Open pre-formatted tweets (`[CNN] Headline #CATEGORY`) with a real-time 280-character limit counter.
*   **Instagram Share Graphic Creator**: Generates a high-quality square graphic card of any story on an **HTML5 Canvas** dynamically, including:
    *   One-click **Download Card** (PNG format).
    *   An auto-formatted caption copy-paste block (with relevant tags and hashtags).
*   **Navy Blue Visual Theme**: Sleek, glassmorphic dark interface with radial gradients and responsive cards.

---

## 🛠️ Technology Stack

*   **Backend**: Python Flask (handling feed pulling & JSON API routing).
*   **Frontend**: Plain HTML5, CSS3 (Custom transitions & variables), Vanilla JavaScript (DOM Parser, Canvas API, clipboard handlers).

---

## 💻 Setup & Installation

Follow these steps to run the application locally:

### 1. Clone the Repository
```bash
git clone https://github.com/Atefeh73/Atefeh-news-talk-app.git
cd Atefeh-news-talk-app
```

### 2. Create and Activate a Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install flask
```

### 4. Run the Application
```bash
python app.py
```

### 5. Access in Browser
Open your browser and navigate to:
**[http://127.0.0.1:5000](http://127.0.0.1:5000)**

---

## 📄 License
This project is open-source and available under the MIT License.
