# CurricuLab 🎓

CurricuLab is a modern, interactive Learning Management System (LMS) frontend designed for MBA Business Analytics students. It provides a rich, engaging interface for accessing course materials, unit details, question banks, and study notes.

## 🚀 Features

*   **Course Content Hub**: Organized view of subjects and units.
*   **Interactive QA Bank**: Categorized questions (2, 7, 8, 15 marks) with toggleable solutions.
*   **Rich Study Notes**: Synthesized notes with diagrams, tables, and highlighted key concepts.
*   **Responsive Design**: Optimized for desktop and tablet learning.
*   **Dynamic Data**: Content driven by structured JSON files for easy updates.

## 🛠️ Tech Stack

*   **Language**: TypeScript
*   **Framework**: Vanilla DOM (No comprehensive frontend framework, built for performance)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: Custom CSS with CSS Variables for theming

## 📦 Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Harry-0402/CurricuLab.git
    cd CurricuLab
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

## 📂 Project Structure

```
src/
├── assets/
│   ├── images/       # Course-specific images
│   └── json/         # Content data (questions, syllabi)
├── components/       # Reusable UI components (Header, Footer, Card)
├── pages/            # Page logic (Home, UnitDetails, Resources)
├── services/         # Data fetching services
└── types.ts          # TypeScript interfaces
```

## 🤝 Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
