
<div align="center">
  
# ManimGen Backend - LLM Context

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/Kaushal-0071/manimgen-backend?style=social)](https://github.com/Kaushal-0071/manimgen-backend/stargazers)

</div>

This repository serves as the backend for generating Manim (Mathematical Animation Engine) code using LLM (Large Language Model) context. It allows users to input prompts and receive corresponding Manim code snippets, enabling the creation of mathematical animations through natural language instructions.

## ✨ Key Features

-   **LLM-Powered Code Generation:** Uses a Large Language Model to translate natural language prompts into Manim code.
-   **Modular Design:** Organized code structure for easy maintenance and extensibility.
-   **API Endpoints:** Provides API endpoints for generating animation code and resolving errors.
-   **Configuration:** Uses a `.env` file to store and manage environment variables.

## 🧭 Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [Dependencies](#dependencies)
-   [Contributing](#contributing)
-   [License](#license)
-   [Contact](#contact)

## 🛠️ Installation

To install and set up the project, follow these steps:

1.  Clone the repository:

    ```bash
    git clone https://github.com/Kaushal-0071/manimgen-backend.git
    cd manimgen-backend
    ```

2.  Install the necessary dependencies using npm:

    ```bash
    npm install
    ```

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following environment variable:

```
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

Replace `YOUR_GEMINI_API_KEY` with your actual Gemini API key.

## 🚀 Usage

1.  Start the server:

    ```bash
    npm start
    ```

2.  The server will run on `http://localhost:4000` (or the port specified in your environment).

3.  Use the following API endpoints:
    *   `POST /generate-animation`: Generates Manim animation code based on the provided prompt.
    *   `POST /regenerate`: Regenerates Manim code with new planning steps from Gemini, given an input prompt and existing code.
    *   `POST /resolve`: Resolves errors in Manim code, given an error message and existing code.
    *   `POST /render`: Renders a Manim video based on the provided code.
    *   `GET /sendvid`: Sends the rendered video file.

## 🔩 Dependencies

-   **express:** Web application framework for Node.js.
-   **cors:**  Middleware to enable Cross-Origin Resource Sharing.
-   **body-parser:** Middleware to parse incoming request bodies.
-   **child\_process:** Provides the ability to spawn child processes from Node.js.
-   **fs:**  Provides methods for interacting with the file system.
-   **path:** Provides utilities for working with file and directory paths.
-   **fs-extra:** Provides extra file system utility methods.
-   **dotenv:** Loads environment variables from a `.env` file.
-   **@google/generative-ai:** Google's generative AI API client library.

## 🤝 Contributing

Contributions are welcome! Here's how you can contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Submit a pull request.

