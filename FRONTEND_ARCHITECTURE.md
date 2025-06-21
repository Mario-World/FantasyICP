# Frontend Architecture & User Flow

## Overview
This document outlines the frontend structure and user flows for the Fantasy Sports Platform based on the backend.did interface.

## Technology Stack
- **Framework**: React.js with TypeScript
- **State Management**: Redux Toolkit or Zustand
- **UI Library**: Material-UI or Ant Design
- **Authentication**: Internet Identity (IC)
- **Styling**: Tailwind CSS or Styled Components
- **Build Tool**: Vite or Webpack

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── assets/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── Modal.tsx
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── Profile.tsx
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── BalanceCard.tsx
│   │   │   ├── RecentContests.tsx
│   │   │   └── Notifications.tsx
│   │   ├── tournaments/
│   │   │   ├── TournamentList.tsx
│   │   │   ├── TournamentCard.tsx
│   │   │   ├── TournamentDetail.tsx
│   │   │   ├── TeamList.tsx
│   │   │   └── PlayerList.tsx
│   │   ├── contests/
│   │   │   ├── ContestList.tsx
│   │   │   ├── ContestCard.tsx
│   │   │   ├── ContestDetail.tsx
│   │   │   ├── ContestEntry.tsx
│   │   │   └── ContestLeaderboard.tsx
│   │   ├── fantasy/
│   │   │   ├── TeamBuilder.tsx
│   │   │   ├── PlayerSelector.tsx
│   │   │   ├── CaptainSelector.tsx
│   │   │   ├── TeamPreview.tsx
│   │   │   └── PointsCalculator.tsx
│   │   ├── matches/
│   │   │   ├── MatchList.tsx
│   │   │   ├── MatchCard.tsx
│   │   │   ├── LiveScore.tsx
│   │   │   └── MatchStats.tsx
│   │   └── rewards/
│   │       ├── RewardsList.tsx
│   │       ├── TransactionHistory.tsx
│   │       └── ClaimReward.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Tournaments.tsx
│   │   ├── Contests.tsx
│   │   ├── MyTeams.tsx
│   │   ├── Rewards.tsx
│   │   └── Profile.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── tournaments.ts
│   │   ├── contests.ts
│   │   ├── fantasy.ts
│   │   └── rewards.ts
│   ├── store/
│   │   ├── index.ts
│   │   ├── authSlice.ts
│   │   ├── tournamentSlice.ts
│   │   ├── contestSlice.ts
│   │   └── userSlice.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── tournament.ts
│   │   ├── contest.ts
│   │   ├── player.ts
│   │   └── reward.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   ├── validation.ts
│   │   └── formatters.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTournaments.ts
│   │   ├── useContests.ts
│   │   └── useWebSocket.ts
│   └── App.tsx
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

## User Flow Diagrams

### 1. Authentication Flow
```
User visits site
    ↓
Check if user is authenticated
    ↓
If not authenticated → Show Login/Register page
    ↓
User clicks "Login with Internet Identity"
    ↓
Redirect to Internet Identity
    ↓
User authenticates with II
    ↓
Return to app with principal
    ↓
Call register_user() or get_user_profile()
    ↓
Store user data in state
    ↓
Redirect to Dashboard
```

### 2. Tournament Browsing Flow
```
User visits Tournaments page
    ↓
Load all tournaments (get_all_tournaments())
    ↓
Display tournament cards with filters
    ↓
User clicks on tournament
    ↓
Load tournament details (get_tournament())
    ↓
Display teams, matches, and contests
    ↓
User can view teams (get_tournament_teams())
    ↓
User can view players (get_players_by_team())
    ↓
User can join contests
```

### 3. Contest Participation Flow
```
User finds contest on tournament page
    ↓
Click "Join Contest"
    ↓
Check user balance
    ↓
If insufficient balance → Show add balance modal
    ↓
If sufficient balance → Show team builder
    ↓
User builds fantasy team
    ↓
Select captain and vice-captain
    ↓
Validate team (budget, player count)
    ↓
Preview team and confirm
    ↓
Call join_contest()
    ↓
Deduct entry fee from balance
    ↓
Show confirmation and redirect to contest
```

### 4. Fantasy Team Building Flow
```
User starts team building
    ↓
Load available players (get_players_by_team())
    ↓
Display player cards with stats and prices
    ↓
User selects players
    ↓
Real-time budget calculation
    ↓
User selects captain (2x points)
    ↓
User selects vice-captain (1.5x points)
    ↓
Validate team composition
    ↓
Show team preview with points projection
    ↓
User confirms team
    ↓
Save fantasy team (create_fantasy_team())
```

### 5. Live Match Following Flow
```
User joins contest
    ↓
Wait for match to start
    ↓
Match goes live (update_match_status())
    ↓
Real-time score updates (update_match_score())
    ↓
Player performance updates (update_player_score())
    ↓
Calculate fantasy team points
    ↓
Update contest leaderboard
    ↓
Show live notifications
    ↓
Match ends
    ↓
Finalize contest (finalize_contest())
    ↓
Distribute rewards (distribute_contest_rewards())
```

### 6. Rewards & Transactions Flow
```
Contest ends
    ↓
Calculate final rankings
    ↓
Distribute prizes (create_prize_pool())
    ↓
Send notifications to winners
    ↓
User checks rewards page
    ↓
Display pending rewards (get_pending_rewards())
    ↓
User clicks "Claim Reward"
    ↓
Call claim_reward()
    ↓
Add to user balance
    ↓
Create transaction record
    ↓
Show confirmation
```

## Key Components Breakdown

### 1. Header Component
```typescript
interface HeaderProps {
  user: UserProfile;
  balance: number;
  notifications: Notification[];
  onLogout: () => void;
}
```

**Features:**
- User profile dropdown
- Balance display
- Notification bell with unread count
- Navigation menu
- Search functionality

### 2. Dashboard Component
```typescript
interface DashboardProps {
  user: UserProfile;
  recentContests: ContestEntry[];
  upcomingMatches: Match[];
  notifications: Notification[];
}
```

**Features:**
- Welcome message with user stats
- Recent contest performance
- Upcoming matches
- Quick actions (join contest, create team)
- Recent notifications

### 3. Tournament List Component
```typescript
interface TournamentListProps {
  tournaments: Tournament[];
  filters: {
    sport: Sport;
    status: TournamentStatus;
    dateRange: [Date, Date];
  };
}
```

**Features:**
- Grid/list view toggle
- Sport filter (Cricket, Football, Basketball, Tennis)
- Status filter (Upcoming, Live, Completed)
- Search by tournament name
- Sort by date, popularity

### 4. Contest Card Component
```typescript
interface ContestCardProps {
  contest: Contest;
  match: Match;
  entryFee: number;
  prizePool: number;
  spotsLeft: number;
  onJoin: (contestId: string) => void;
}
```

**Features:**
- Contest name and type
- Entry fee and prize pool
- Spots filled/remaining
- Match details
- Join button with balance check

### 5. Team Builder Component
```typescript
interface TeamBuilderProps {
  match: Match;
  players: Player[];
  budget: number;
  onTeamComplete: (team: FantasyTeam) => void;
}
```

**Features:**
- Player selection grid
- Budget tracker
- Captain/vice-captain selection
- Team validation
- Points projection
- Save/load team templates

### 6. Live Score Component
```typescript
interface LiveScoreProps {
  match: Match;
  playerScores: PlayerScore[];
  contestEntries: ContestEntry[];
}
```

**Features:**
- Real-time match score
- Player performance updates
- Contest leaderboard
- Points calculation
- Live notifications

## State Management Structure

### Redux Store Structure
```typescript
interface RootState {
  auth: {
    user: UserProfile | null;
    isAuthenticated: boolean;
    loading: boolean;
  };
  tournaments: {
    tournaments: Tournament[];
    currentTournament: Tournament | null;
    loading: boolean;
  };
  contests: {
    contests: Contest[];
    userEntries: ContestEntry[];
    currentContest: Contest | null;
    loading: boolean;
  };
  fantasy: {
    teams: FantasyTeam[];
    currentTeam: FantasyTeam | null;
    players: Player[];
    loading: boolean;
  };
  matches: {
    matches: Match[];
    liveMatches: Match[];
    playerScores: PlayerScore[];
    loading: boolean;
  };
  rewards: {
    rewards: UserReward[];
    transactions: RewardTransaction[];
    loading: boolean;
  };
}
```

## API Service Structure

### Authentication Service
```typescript
class AuthService {
  async login(principal: Principal): Promise<UserProfile>;
  async register(username: string, email?: string, phone?: string): Promise<UserProfile>;
  async getProfile(): Promise<UserProfile>;
  async updateProfile(username?: string, email?: string): Promise<UserProfile>;
  async addBalance(amount: number): Promise<UserProfile>;
}
```

### Tournament Service
```typescript
class TournamentService {
  async getAllTournaments(): Promise<Tournament[]>;
  async getTournament(id: string): Promise<Tournament>;
  async getTournamentsBySport(sport: Sport): Promise<Tournament[]>;
  async getLiveTournaments(): Promise<Tournament[]>;
  async getTeams(tournamentId: string): Promise<Team[]>;
  async getPlayers(teamId: string): Promise<Player[]>;
}
```

### Contest Service
```typescript
class ContestService {
  async getContests(matchId: string): Promise<Contest[]>;
  async getOpenContests(): Promise<Contest[]>;
  async joinContest(contestId: string, teamId: string): Promise<ContestEntry>;
  async getEntries(contestId: string): Promise<ContestEntry[]>;
  async getUserEntries(): Promise<ContestEntry[]>;
}
```

## Responsive Design Considerations

### Mobile-First Approach
- Touch-friendly interfaces
- Swipe gestures for navigation
- Optimized for small screens
- Fast loading times

### Desktop Enhancements
- Multi-column layouts
- Hover effects
- Keyboard shortcuts
- Advanced filtering options

## Performance Optimizations

### Code Splitting
- Route-based code splitting
- Component lazy loading
- Dynamic imports for heavy components

### Caching Strategy
- API response caching
- Local storage for user preferences
- Service worker for offline functionality

### Real-time Updates
- WebSocket connections for live scores
- Polling for contest updates
- Optimistic UI updates

## Security Considerations

### Authentication
- Internet Identity integration
- Principal-based user identification
- Secure session management

### Data Validation
- Client-side form validation
- Server-side validation
- Input sanitization

### Privacy
- User data protection
- GDPR compliance
- Secure data transmission

## Testing Strategy

### Unit Tests
- Component testing with Jest/React Testing Library
- Service layer testing
- Utility function testing

### Integration Tests
- API integration testing
- User flow testing
- Cross-browser testing

### E2E Tests
- Complete user journey testing
- Mobile device testing
- Performance testing

This architecture provides a solid foundation for building a scalable, user-friendly fantasy sports platform that leverages all the functionality defined in your backend.did interface. 