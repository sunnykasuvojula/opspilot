Day 1 Responsibilities (Step-by-step)
1) Create project structure (api + web)

Deliverable

Repo created

Folders: api/ and web/

Checks

api runs on http://localhost:5000

web runs on http://localhost:5173

2) Backend setup (api)

Install + configure

Express

dotenv

mongoose

cors

helmet

morgan

Deliverable

src/app.js (middleware + routes)

src/server.js (starts server)

src/config/db.js (Mongo connection)

Checks

Server starts without errors

Mongo connects successfully


What you should create FIRST today (practical)

If you’re starting right now, do this sequence:

Create Git repo + folders (api + web)

Setup MongoDB connection + Mongoose

Create User + Workspace + Project + Ticket models

Build POST /auth/register + POST /auth/login

Build GET /auth/me to test auth quickly

Then start React screens