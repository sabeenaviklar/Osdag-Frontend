# OSDAG Bridge Design Module

 This is my submission for the OSDAG screening task. I've built a web-based bridge design interface that handles user inputs, validates data, and auto-calculates geometry parameters based on engineering constraints.

## What I Built

This is a full-stack web application with a React frontend and Django backend. The main feature is a "Group Design" module where users can input bridge parameters and get real-time validation and calculations.

The coolest part is probably the geometry popup - it automatically calculates the third value when you enter any two parameters, all while respecting the constraint equation: (Overall Width - Overhang) / Spacing = Number of Girders.

## Tech Stack

**Backend:**
- Django 4.2 (Python web framework)
- Django REST Framework (for the API)
- SQLite (database)
- django-cors-headers (to connect frontend and backend)

**Frontend:**
- React 18
- Axios (for API calls)
- Plain CSS (no fancy frameworks, kept it simple)
- Material-UI icons (just for a few icons)

## Features I Implemented

### 1. Structure Type Selection
Pretty straightforward - you can choose between "Highway" and "Other". If you select "Other", all the input fields get disabled and you see a warning message saying that other structures aren't included yet.

### 2. Project Location (Two Ways)

I implemented both modes they asked for:

**Mode 1 - Location Selection:**
- Pick a state from the dropdown
- Then pick a district
- Location data (wind speed, seismic zone, temperatures) shows up automatically in green
- I hardcoded 5 major cities: Mumbai, Delhi, Chennai, Bangalore, and Kolkata

**Mode 2 - Custom Parameters:**
- Click "Open Spreadsheet" button
- Enter your own values in a popup
- Zone factor updates automatically when you select a seismic zone
- Same data appears in green after you save

### 3. Geometric Inputs with Validation

I added validation for:
- **Span**: Must be between 5-100 meters
- **Carriageway Width**: Must be between 3-50 meters  
- **Skew Angle**: Shows a warning if you go above 20° (IRC 24 requirement)
- **Footpath**: Three options - Single-sided, Both, or None

### 4. The Geometry Calculation Popup

This was the trickiest part. When you click "Modify Additional Geometry":
- A popup opens showing the constraint formula
- You can enter any two values (spacing, number of girders, or overhang)
- When you blur out of a field, it calculates the third value automatically
- Everything has to satisfy: Overall Width = Carriageway Width + 5
- Plus the main equation: (Overall Width - Overhang) / Spacing = No. of Girders
- Shows clear error messages if your values don't work

### 5. Material Selection
Simple dropdowns for:
- Girder Steel (E250, E350, E450)
- Cross Bracing Steel (same options)
- Deck Concrete (M25 through M60)

## How to Run This

### Prerequisites
You'll need:
- Python 3.10 or newer
- Node.js 16 or newer
- About 10 minutes to set everything up

### Backend Setup

```bash
# Create a folder and go into it
mkdir osdag-bridge-project
cd osdag-bridge-project
mkdir backend
cd backend

# How to Set up Python virtual environment?
python3 -m venv venv
source venv/bin/activatee

# Installing Python packages which is required in the project
pip install Django==4.2.0
pip install djangorestframework==3.14.0
pip install django-cors-headers==4.0.0

# Create Django project
django-admin startproject bridge_backend .
python manage.py startapp bridge_module

# Copy all the backend files I created to the right places
# (models.py, views.py, serializers.py, settings.py, urls.py)

# Set up database
python manage.py makemigrations
python manage.py migrate
python manage.py shell < load_data.py

# Start the server
python manage.py runserver 8000
```

Keep this terminal running!

### ========= Frontend Setup ==============

Open a new terminal:

```bash
# Go to project root
cd osdag-bridge-project

# Create React app
npx create-react-app frontend
cd frontend

# Install dependencies
npm install axios
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material


# Start the app
npm start
```

The app should open automatically run at http://localhost:3000


## API Endpoints

I created these REST endpoints:

- `GET /api/states/` - List all states
- `GET /api/districts/` - List all districts
- `GET /api/districts/?state_id=1` - Filter by state
- `GET /api/districts/1/location_data/` - Get location details
- `POST /api/calculate-geometry/` - Calculate geometry values
- `GET /api/material-options/` - Get steel/concrete grades

## The Challenges which I Faced during this project are

1. Geometry Auto-Calculation**
The hardest part was getting the geometry calculations right. I had to think through all the edge cases - what if someone enters spacing that's bigger than the bridge width? What if the numbers don't divide evenly? I ended up creating a Django serializer that handles all the math and validation on the backend, then sends back the calculated values.

2. State Management**
Managing state in React got complicated with so many interdependent fields. I used multiple useEffect hooks to handle the cascade - when state changes, fetch districts; when district changes, fetch location data; when structure type changes, disable/enable fields. Took some debugging to get the timing right.

3. CORS Issues**
Initially couldn't get the frontend to talk to the backend. Had to install and configure django-cors-headers properly. Also made sure the API calls were going to the right URL (localhost:8000).

4. Validation UX**
I wanted validation to feel smooth, not annoying. So I validate on blur instead of on every keystroke, clear errors as soon as the user fixes them, and show specific messages like "Outside the software range" instead of generic errors.

## What I'd Improve

I had more time(because i started a little late), I would:
- Implement Option A with the full database (all districts from the Excel tables)
- Add form submission to actually save designs to the database
- Add a designs list page to view previous calculations
- Make the UI responsive for mobile
- Add unit tests for the geometry calculations
- Maybe add a visualization of the bridge based on the inputs




**Option B vs Option A:**
I implemented Option B (5 hardcoded cities) because it was faster to set up. The code is structured so upgrading to Option A would just mean replacing the load_data.py script - no frontend changes needed.

**Code organization:**
I tried to keep things modular. Each React component has its own file, Django has proper separation between models/views/serializers, and I used meaningful variable names so the code is readable.



## Files Included

All the code files are in this submission:
- Complete Django backend (models, views, serializers, settings)
- Complete React frontend (all components with CSS)
- Data loading script
- This README
- Setup instructions

## Video Demo

I recorded a demo showing:
- UI overview
- Both location modes working
- Geometry auto-calculation
- Validation errors
- All the features in action

Link i will share it in the submission form.

## Summary

This was a really a fun project to build! I learned a lot about constraint-based calculations and building intuitive UIs for engineering applications. The geometry popup was definitely the most interesting part, and also making sure the math works correctly while also handling all the edge cases took some careful thinking. (Building the backend was a really a hard apart.)

Thanks for reviewing my submission!


**===Built by:====** Sabeena 
**For:** OSDAG Screening Task - Bridge Module