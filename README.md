# Campus Connect

Campus Connect is a full-stack web application designed to facilitate communication and collaboration within a university campus. It features a modern, intuitive user interface and a robust backend to support real-time interactions.

## Developers

-   **Backend:** Shivasharanappa Biradar
-   **Frontend:** Swapnil Naik, Pranav Dessai

## Technologies

### Backend

-   **Framework:** Express.js
-   **Database:** PostgreSQL
-   **ORM:** Drizzle ORM
-   **Authentication:** JSON Web Tokens (JWT)
-   **Hosting:** Supabase

### Frontend

-   **Framework:** React.js
-   **Build Tool:** Vite
-   **Styling:** Tailwind CSS
-   **UI Components:** Radix UI, Lucide React
-   **Routing:** React Router
-   **Text Editor:** Editor.js, Lexical, Tiptap

## Getting Started

To get the project up and running on your local machine, follow these steps.

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Database Setup:**
    This project uses a PostgreSQL database hosted on Supabase. The connection URL is already configured in `backend/drizzle.config.mjs`. To apply the schema, you can use Drizzle Kit.

    *Note: You may need to install `drizzle-kit` globally or as a dev dependency.*

    ```bash
    npx drizzle-kit push
    ```

4.  **Start the server:**
    ```bash
    node server.mjs
    ```
    The backend server will start on `http://localhost:3000`.

### Frontend Setup

1.  **Navigate to the client directory:**
    ```bash
    cd client
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The frontend application will open in your browser, typically at `http://localhost:5173`.

## Project Structure

The project is organized into two main parts: a `backend` folder for the server-side code and a `client` folder for the frontend application.

```
/
├── backend/        # Express.js API
│   ├── src/
│   ├── drizzle/    # Drizzle ORM migration files
│   └── ...
├── client/         # React.js client
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
└── README.md
```

## Project Report
[Project Report Link](https://docs.google.com/document/d/1VODrTef5AD6aEHiFLciMuG1BW84L3T48/edit?usp=sharing&ouid=106539620862714888600&rtpof=true&sd=true)
