# RoomieZ Backend - Matcher Logic & Data Models

## 📊 Data Models

### 1. **User Model** (`models/User.js`)
```javascript
{
  email: String (unique, lowercase, must be @ku.ac.ke),
  passwordHash: String (bcrypted with salt rounds: 12),
  isVerified: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### 2. **Profile Model** (`models/Profile.js`)
```javascript
{
  userId: ObjectId (ref User, unique),
  name: String,
  phone: String,
  uniIdImage: String (URL),
  budgetMin: Number (KSh),
  budgetMax: Number (KSh),
  roomType: String (enum: 'single', 'double', 'apartment', 'shared'),
  createdAt: Date,
  updatedAt: Date
}
```

### 3. **Questionnaire Model** (`models/Questionnaire.js`)
```javascript
{
  userId: ObjectId (ref User, unique),
  cleanliness: String (enum: 'neat-freak', 'moderate', 'organized-chaos'),
  sleepSchedule: String (enum: 'early-bird', 'night-owl', 'flexible'),
  socialLevel: String (enum: 'frequent-guests', 'occasional', 'private-sanctuary'),
  noiseTolerance: String (enum: 'silence-needed', 'moderate-noise', 'can-sleep-anywhere'),
  studyEnvironment: String (enum: 'study-at-home', 'study-at-library', 'mix'),
  sharingPolicy: String (enum: 'share-everything', 'ask-first', 'do-not-share'),
  smoking: Boolean,
  introversion: String (enum: 'introverted', 'extroverted', 'ambiverted'),
  createdAt: Date,
  updatedAt: Date
}
```

### 4. **Match Model** (`models/Match.js`)
```javascript
{
  users: [ObjectId, ObjectId] (array of 2 user IDs),
  likes: [ObjectId] (array of userIds who have liked),
  status: String (enum: 'pending', 'matched'),
  createdAt: Date
}
```
**Status Logic:**
- `pending`: One user has liked
- `matched`: Both users have liked each other

### 5. **Message Model** (`models/Message.js`)
```javascript
{
  matchId: String (indexed),
  senderId: ObjectId (ref User),
  text: String,
  createdAt: Date
}
```

---

## 🧮 Compatibility Matching Algorithm (`utils/matcher.js`)

**Total Score Range: 0-100**

### Scoring Breakdown:

| Factor | Weight | Scoring Logic |
|--------|--------|---------------|
| **Cleanliness** | 20% | Exact match = +20. Moderate with extreme = +10 |
| **Sleep Schedule** | 15% | Exact match = +15 |
| **Social Level** | 15% | Exact match = +15 |
| **Noise Tolerance** | 10% | Exact match = +10 |
| **Budget Overlap** | 30% | If min/max ranges overlap = +30 |
| **Personality** | 5% | Introversion match = +5 |
| **Smoking** | 5% | Smoking match = +5 |

### Budget Overlap Calculation:
```
overlap = Math.min(budgetMax_A, budgetMax_B) - Math.max(budgetMin_A, budgetMin_B)
if (overlap > 0) score += 30
```

### Minimum Threshold: **40% compatibility** required to show as match

### Example Calculation:
```
User A: neat-freak, early-bird, occasional, silence-needed, study-at-home, 
        share-everything, no-smoking, introverted, budget: 8000-15000

User B: moderate, early-bird, occasional, moderate-noise, study-at-library, 
        ask-first, no-smoking, introverted, budget: 10000-18000

Score:
- Cleanliness: 0 (moderate ≠ neat-freak) = 0
- Sleep Schedule: 15 (both early-bird) = 15
- Social Level: 15 (both occasional) = 15
- Noise Tolerance: 0 (silence ≠ moderate) = 0
- Budget: 9000-15000 overlap exists = 30
- Personality: 5 (both introverted) = 5
- Smoking: 5 (both no) = 5

TOTAL: 75/100 = 75% Compatible ✅
```

---

## 🔄 API Endpoints for Matching

### Get Matches
**Endpoint:** `GET /api/matches`  
**Auth:** Required (Bearer token)  
**Returns:** Array of matches sorted by compatibility score (highest first)

```javascript
Response: {
  success: true,
  count: 5,
  matches: [
    {
      user: { _id, email },
      profile: { _id, userId, name, budgetMin, budgetMax, roomType, uniIdImage },
      compatibility: 88
    },
    // ... more matches
  ]
}
```

### Like a User
**Endpoint:** `POST /api/profile/like/:targetUserId`  
**Auth:** Required  
**Body:** None

```javascript
Response: { status: 'liked' } // or { status: 'matched' }
```

---

## 💬 Chat & Messaging Flow

1. **User A** matches with **User B** (status = 'matched')
2. Users can `socket.emit('join_room', matchId)` to join chat room
3. Messages are persisted to MongoDB via `Message` collection
4. Real-time updates via Socket.io

### Socket Events:
- `join_room`: User joins match chat room
- `send_message`: Sends message (saves to DB + emits)
- `receive_message`: Real-time message broadcast
- `typing`: Typing indicator
- `disconnect`: User left

---

## 🚀 Current Demo Flow (UI Only)

1. **Dashboard** → Landing page
2. **Questionnaire** → Answer 8 questions (stored in localStorage)
3. **Matches** → Shows 6 mock users with compatibility scores (no backend call yet)
4. **MatchCard** → Can like users (mock implementation)

To connect to real backend:
- Update `Matches.jsx` to call `GET /api/matches` instead of using MOCK_MATCHES
- Implement real like functionality via `POST /api/profile/like/:targetUserId`
- Add authentication token flow between components
