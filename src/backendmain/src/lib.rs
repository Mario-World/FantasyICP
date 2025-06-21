// Unified backend lib.rs

// --- Shared Types ---
use candid::{CandidType, Deserialize, Principal};
use serde::Serialize;
use std::collections::HashMap;
use ic_cdk::{api::caller, init, post_upgrade, pre_upgrade, query, update};
use ic_stable_structures::{
    memory_manager::{MemoryId, MemoryManager, VirtualMemory},
    DefaultMemoryImpl, StableBTreeMap, StableCell,
};
use std::cell::RefCell;
use std::thread::LocalKey;

type Memory = VirtualMemory<DefaultMemoryImpl>;
type StableMap<K, V> = StableBTreeMap<K, V, Memory>;

// Additional types for rewards
#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct UserReward {
    pub id: String,
    pub user_id: Principal,
    pub contest_id: String,
    pub amount: u64,
    pub rank: u32,
    pub status: RewardStatus,
    pub created_at: u64,
    pub claimed_at: Option<u64>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug, Eq, Hash, PartialEq)]
pub enum RewardStatus {
    Pending,
    Claimed,
    Failed,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct RewardTransaction {
    pub id: String,
    pub user_id: Principal,
    pub amount: u64,
    pub transaction_type: TransactionType,
    pub status: TransactionStatus,
    pub created_at: u64,
    pub completed_at: Option<u64>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug, Eq, Hash, PartialEq)]
pub enum TransactionType {
    ContestWin,
    ContestEntry,
    Withdrawal,
    Deposit,
    Bonus,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug, Eq, Hash, PartialEq)]
pub enum TransactionStatus {
    Pending,
    Completed,
    Failed,
    Cancelled,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct ScoringRule {
    pub action: String,
    pub points: f64,
    pub sport: Sport,
}

// User Management Types
#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct UserProfile {
    pub id: Principal,
    pub username: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub kyc_status: KYCStatus,
    pub balance: u64, // in tokens
    pub created_at: u64,
    pub updated_at: u64,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub enum KYCStatus {
    Pending,
    Verified,
    Rejected,
}

// Tournament Types
#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct Tournament {
    pub id: String,
    pub name: String,
    pub sport: Sport,
    pub start_time: u64,
    pub end_time: u64,
    pub status: TournamentStatus,
    pub teams: Vec<Team>,
    pub matches: Vec<Match>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug, Eq, Hash, PartialEq)]
pub enum Sport {
    Cricket,
    Football,
    Basketball,
    Tennis,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug, Eq, Hash, PartialEq)]
pub enum TournamentStatus {
    Upcoming,
    Live,
    Completed,
    Cancelled,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct Team {
    pub id: String,
    pub name: String,
    pub short_name: String,
    pub players: Vec<Player>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct Player {
    pub id: String,
    pub name: String,
    pub team_id: String,
    pub position: PlayerPosition,
    pub points: f64,
    pub price: u64, // in tokens
    pub is_playing: bool,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug, Eq, Hash, PartialEq)]
pub enum PlayerPosition {
    Batsman,
    Bowler,
    AllRounder,
    WicketKeeper,
    Forward,
    Midfielder,
    Defender,
    Goalkeeper,
    PointGuard,
    ShootingGuard,
    SmallForward,
    PowerForward,
    Center,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct Match {
    pub id: String,
    pub tournament_id: String,
    pub team1_id: String,
    pub team2_id: String,
    pub start_time: u64,
    pub status: MatchStatus,
    pub score: Option<MatchScore>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug, Eq, Hash, PartialEq)]
pub enum MatchStatus {
    Scheduled,
    Live,
    Completed,
    Cancelled,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct MatchScore {
    pub team1_score: String,
    pub team2_score: String,
    pub team1_overs: Option<f64>,
    pub team2_overs: Option<f64>,
}

// Contest Types
#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct Contest {
    pub id: String,
    pub name: String,
    pub match_id: String,
    pub entry_fee: u64,
    pub total_spots: u32,
    pub filled_spots: u32,
    pub prize_pool: u64,
    pub contest_type: ContestType,
    pub status: ContestStatus,
    pub created_at: u64,
    pub start_time: u64,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub enum ContestType {
    HeadToHead,
    MultiPlayer,
    Guaranteed,
    WinnerTakesAll,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug, Eq, Hash, PartialEq)]
pub enum ContestStatus {
    Open,
    Full,
    Live,
    Completed,
    Cancelled,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct ContestEntry {
    pub id: String,
    pub contest_id: String,
    pub user_id: Principal,
    pub team: FantasyTeam,
    pub points: f64,
    pub rank: Option<u32>,
    pub prize: Option<u64>,
    pub created_at: u64,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct FantasyTeam {
    pub id: String,
    pub name: String,
    pub captain_id: String,
    pub vice_captain_id: String,
    pub players: Vec<String>, // Player IDs
    pub total_points: f64,
    pub total_price: u64,
}

// Scoring Types
#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct PlayerScore {
    pub player_id: String,
    pub match_id: String,
    pub points: f64,
    pub stats: PlayerStats,
    pub updated_at: u64,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct PlayerStats {
    // Cricket stats
    pub runs: Option<u32>,
    pub wickets: Option<u32>,
    pub catches: Option<u32>,
    pub stumpings: Option<u32>,
    pub run_outs: Option<u32>,
    pub overs: Option<f64>,
    pub maidens: Option<u32>,
    pub economy: Option<f64>,
    
    // Football stats
    pub goals: Option<u32>,
    pub assists: Option<u32>,
    pub clean_sheets: Option<u32>,
    pub saves: Option<u32>,
    pub yellow_cards: Option<u32>,
    pub red_cards: Option<u32>,
    
    // Basketball stats
    pub points: Option<u32>,
    pub rebounds: Option<u32>,
    pub blocks: Option<u32>,
    pub steals: Option<u32>,
    pub turnovers: Option<u32>,
}

// Rewards Types
#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct PrizePool {
    pub contest_id: String,
    pub total_amount: u64,
    pub distribution: Vec<PrizeDistribution>,
    pub distributed: bool,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct PrizeDistribution {
    pub rank: u32,
    pub percentage: f64,
    pub amount: u64,
}

// Error Types
#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub enum FantasyError {
    UserNotFound,
    TournamentNotFound,
    ContestNotFound,
    ContestFull,
    InsufficientBalance,
    InvalidTeam,
    ContestAlreadyStarted,
    ContestCompleted,
    Unauthorized,
    InvalidOperation,
    SystemError,
}

// Response Types
#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct UserProfileResponse {
    pub success: bool,
    pub data: Option<UserProfile>,
    pub error: Option<String>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct NotificationResponse {
    pub success: bool,
    pub data: Option<Notification>,
    pub error: Option<String>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct NotificationsResponse {
    pub success: bool,
    pub data: Option<Vec<Notification>>,
    pub error: Option<String>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct TournamentResponse {
    pub success: bool,
    pub data: Option<Tournament>,
    pub error: Option<String>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct TeamsResponse {
    pub success: bool,
    pub data: Option<Vec<Team>>,
    pub error: Option<String>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct TeamResponse {
    pub success: bool,
    pub data: Option<Team>,
    pub error: Option<String>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct PlayerResponse {
    pub success: bool,
    pub data: Option<Player>,
    pub error: Option<String>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct MatchResponse {
    pub success: bool,
    pub data: Option<Match>,
    pub error: Option<String>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct MatchScoreResponse {
    pub success: bool,
    pub data: Option<MatchScore>,
    pub error: Option<String>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct ContestResponse {
    pub success: bool,
    pub data: Option<Contest>,
    pub error: Option<String>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct ContestEntryResponse {
    pub success: bool,
    pub data: Option<ContestEntry>,
    pub error: Option<String>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct ContestEntriesResponse {
    pub success: bool,
    pub data: Option<Vec<ContestEntry>>,
    pub error: Option<String>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct PlayerScoreResponse {
    pub success: bool,
    pub data: Option<PlayerScore>,
    pub error: Option<String>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct ScoringRuleResponse {
    pub success: bool,
    pub data: Option<ScoringRule>,
    pub error: Option<String>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct PrizePoolResponse {
    pub success: bool,
    pub data: Option<PrizePool>,
    pub error: Option<String>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct UserRewardResponse {
    pub success: bool,
    pub data: Option<UserReward>,
    pub error: Option<String>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct UserRewardsResponse {
    pub success: bool,
    pub data: Option<Vec<UserReward>>,
    pub error: Option<String>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct RewardTransactionsResponse {
    pub success: bool,
    pub data: Option<Vec<RewardTransaction>>,
    pub error: Option<String>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct FantasyTeamResponse {
    pub success: bool,
    pub data: Option<FantasyTeam>,
    pub error: Option<String>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct FantasyTeamsResponse {
    pub success: bool,
    pub data: Option<Vec<FantasyTeam>>,
    pub error: Option<String>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct LeaderboardEntry {
    pub rank: u32,
    pub user_id: Principal,
    pub username: String,
    pub points: f64,
    pub prize: Option<u64>,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct Notification {
    pub id: String,
    pub user_id: Principal,
    pub title: String,
    pub message: String,
    pub notification_type: NotificationType,
    pub read: bool,
    pub created_at: u64,
}

#[derive(CandidType, Deserialize, Serialize, Clone, Debug, Eq, Hash, PartialEq)]
pub enum NotificationType {
    ContestResult,
    PrizeWon,
    ContestReminder,
    SystemUpdate,
}

// Constants
pub const MAX_TEAM_SIZE: u32 = 11;
pub const MIN_TEAM_SIZE: u32 = 11;
pub const MAX_TEAM_PRICE: u64 = 100; // in tokens
pub const MIN_TEAM_PRICE: u64 = 80; // in tokens

// --- All Module Statics ---
thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));
    
    // User Management - Using simpler storage for complex types
    static USERS: RefCell<HashMap<Principal, UserProfile>> = RefCell::new(HashMap::new());
    static USERNAMES: RefCell<HashMap<String, Principal>> = RefCell::new(HashMap::new());
    static NOTIFICATIONS: RefCell<HashMap<String, Notification>> = RefCell::new(HashMap::new());
    static NEXT_NOTIFICATION_ID: RefCell<Option<StableCell<u64, Memory>>> = RefCell::new(None);
    
    // Tournament Management - Using simpler storage for complex types
    static TOURNAMENTS: RefCell<HashMap<String, Tournament>> = RefCell::new(HashMap::new());
    static MATCHES: RefCell<HashMap<String, Match>> = RefCell::new(HashMap::new());
    static TEAMS: RefCell<HashMap<String, Team>> = RefCell::new(HashMap::new());
    static PLAYERS: RefCell<HashMap<String, Player>> = RefCell::new(HashMap::new());
    static NEXT_TOURNAMENT_ID: RefCell<Option<StableCell<u64, Memory>>> = RefCell::new(None);
    static NEXT_MATCH_ID: RefCell<Option<StableCell<u64, Memory>>> = RefCell::new(None);
    static NEXT_TEAM_ID: RefCell<Option<StableCell<u64, Memory>>> = RefCell::new(None);
    static NEXT_PLAYER_ID: RefCell<Option<StableCell<u64, Memory>>> = RefCell::new(None);
    
    // Contest Management - Using simpler storage for complex types
    static CONTESTS: RefCell<HashMap<String, Contest>> = RefCell::new(HashMap::new());
    static CONTEST_ENTRIES: RefCell<HashMap<String, ContestEntry>> = RefCell::new(HashMap::new());
    static USER_CONTESTS: RefCell<HashMap<Principal, Vec<String>>> = RefCell::new(HashMap::new());
    static CONTEST_ENTRIES_BY_CONTEST: RefCell<HashMap<String, Vec<String>>> = RefCell::new(HashMap::new());
    static NEXT_CONTEST_ID: RefCell<Option<StableCell<u64, Memory>>> = RefCell::new(None);
    static NEXT_ENTRY_ID: RefCell<Option<StableCell<u64, Memory>>> = RefCell::new(None);
    
    // Scoring Management - Using simpler storage for complex types
    static PLAYER_SCORES: RefCell<HashMap<String, PlayerScore>> = RefCell::new(HashMap::new());
    static MATCH_SCORES: RefCell<HashMap<String, MatchScore>> = RefCell::new(HashMap::new());
    static SCORING_RULES: RefCell<HashMap<Sport, Vec<ScoringRule>>> = RefCell::new(HashMap::new());
    static NEXT_SCORE_ID: RefCell<Option<StableCell<u64, Memory>>> = RefCell::new(None);
    
    // Rewards Management - Using simpler storage for complex types
    static PRIZE_POOLS: RefCell<HashMap<String, PrizePool>> = RefCell::new(HashMap::new());
    static USER_REWARDS: RefCell<HashMap<Principal, Vec<UserReward>>> = RefCell::new(HashMap::new());
    static REWARD_HISTORY: RefCell<HashMap<String, RewardTransaction>> = RefCell::new(HashMap::new());
    static NEXT_REWARD_ID: RefCell<Option<StableCell<u64, Memory>>> = RefCell::new(None);
    static NEXT_TRANSACTION_ID: RefCell<Option<StableCell<u64, Memory>>> = RefCell::new(None);
    
    // Team Management - Using simpler storage for complex types
    static FANTASY_TEAMS: RefCell<HashMap<String, FantasyTeam>> = RefCell::new(HashMap::new());
    static USER_FANTASY_TEAMS: RefCell<HashMap<Principal, Vec<String>>> = RefCell::new(HashMap::new());
    static NEXT_FANTASY_TEAM_ID: RefCell<Option<StableCell<u64, Memory>>> = RefCell::new(None);
}

#[derive(CandidType, Deserialize, Serialize)]
struct InitPayload {
    admin_principal: Option<Principal>,
}

#[init]
fn init() {
    // Initialize with default admin principal
    let admin_principal = Principal::from_text("2vxsx-fae").unwrap(); // Default admin for development
    
    MEMORY_MANAGER.with(|mm| {
        let mut mm = mm.borrow_mut();
        
        NEXT_NOTIFICATION_ID.with(|next_id| {
            *next_id.borrow_mut() = Some(StableCell::init(mm.get(MemoryId::new(0)), 0).unwrap());
        });
        
        NEXT_TOURNAMENT_ID.with(|next_id| {
            *next_id.borrow_mut() = Some(StableCell::init(mm.get(MemoryId::new(1)), 0).unwrap());
        });
        NEXT_MATCH_ID.with(|next_id| {
            *next_id.borrow_mut() = Some(StableCell::init(mm.get(MemoryId::new(2)), 0).unwrap());
        });
        NEXT_TEAM_ID.with(|next_id| {
            *next_id.borrow_mut() = Some(StableCell::init(mm.get(MemoryId::new(3)), 0).unwrap());
        });
        NEXT_PLAYER_ID.with(|next_id| {
            *next_id.borrow_mut() = Some(StableCell::init(mm.get(MemoryId::new(4)), 0).unwrap());
        });
        
        NEXT_CONTEST_ID.with(|next_id| {
            *next_id.borrow_mut() = Some(StableCell::init(mm.get(MemoryId::new(5)), 0).unwrap());
        });
        NEXT_ENTRY_ID.with(|next_id| {
            *next_id.borrow_mut() = Some(StableCell::init(mm.get(MemoryId::new(6)), 0).unwrap());
        });
        
        NEXT_SCORE_ID.with(|next_id| {
            *next_id.borrow_mut() = Some(StableCell::init(mm.get(MemoryId::new(7)), 0).unwrap());
        });
        
        NEXT_REWARD_ID.with(|next_id| {
            *next_id.borrow_mut() = Some(StableCell::init(mm.get(MemoryId::new(8)), 0).unwrap());
        });
        NEXT_TRANSACTION_ID.with(|next_id| {
            *next_id.borrow_mut() = Some(StableCell::init(mm.get(MemoryId::new(9)), 0).unwrap());
        });
        
        NEXT_FANTASY_TEAM_ID.with(|next_id| {
            *next_id.borrow_mut() = Some(StableCell::init(mm.get(MemoryId::new(10)), 0).unwrap());
        });
    });
    
    // Initialize default scoring rules
    initialize_default_scoring_rules();
}

fn initialize_default_scoring_rules() {
    // Cricket scoring rules
    let cricket_rules = vec![
        ScoringRule { action: "run".to_string(), points: 1.0, sport: Sport::Cricket },
        ScoringRule { action: "wicket".to_string(), points: 10.0, sport: Sport::Cricket },
        ScoringRule { action: "catch".to_string(), points: 8.0, sport: Sport::Cricket },
        ScoringRule { action: "stumping".to_string(), points: 10.0, sport: Sport::Cricket },
        ScoringRule { action: "run_out".to_string(), points: 6.0, sport: Sport::Cricket },
        ScoringRule { action: "maiden_over".to_string(), points: 4.0, sport: Sport::Cricket },
        ScoringRule { action: "economy_bonus".to_string(), points: 2.0, sport: Sport::Cricket },
    ];
    
    SCORING_RULES.with(|rules| {
        rules.borrow_mut().insert(Sport::Cricket, cricket_rules);
    });
    
    // Football scoring rules
    let football_rules = vec![
        ScoringRule { action: "goal".to_string(), points: 6.0, sport: Sport::Football },
        ScoringRule { action: "assist".to_string(), points: 3.0, sport: Sport::Football },
        ScoringRule { action: "clean_sheet".to_string(), points: 4.0, sport: Sport::Football },
        ScoringRule { action: "save".to_string(), points: 1.0, sport: Sport::Football },
        ScoringRule { action: "yellow_card".to_string(), points: -1.0, sport: Sport::Football },
        ScoringRule { action: "red_card".to_string(), points: -3.0, sport: Sport::Football },
    ];
    
    SCORING_RULES.with(|rules| {
        rules.borrow_mut().insert(Sport::Football, football_rules);
    });
    
    // Basketball scoring rules
    let basketball_rules = vec![
        ScoringRule { action: "point".to_string(), points: 1.0, sport: Sport::Basketball },
        ScoringRule { action: "rebound".to_string(), points: 1.2, sport: Sport::Basketball },
        ScoringRule { action: "assist".to_string(), points: 1.5, sport: Sport::Basketball },
        ScoringRule { action: "block".to_string(), points: 2.0, sport: Sport::Basketball },
        ScoringRule { action: "steal".to_string(), points: 2.0, sport: Sport::Basketball },
        ScoringRule { action: "turnover".to_string(), points: -1.0, sport: Sport::Basketball },
    ];
    
    SCORING_RULES.with(|rules| {
        rules.borrow_mut().insert(Sport::Basketball, basketball_rules);
    });
}

#[pre_upgrade]
fn pre_upgrade() {
    // Save state before upgrade
}

#[post_upgrade]
fn post_upgrade() {
    // Restore state after upgrade
}

// --- User Management Section ---
// User Registration and Profile Management
#[update]
fn register_user(username: String, email: Option<String>, phone: Option<String>) -> UserProfileResponse {
    let caller = caller();
    
    // Check if user already exists
    if USERS.with(|users| users.borrow().get(&caller).is_some()) {
        return UserProfileResponse {
            success: false,
            data: None,
            error: Some("User already registered".to_string()),
        };
    }
    
    // Check if username is already taken
    if USERNAMES.with(|usernames| usernames.borrow().get(&username).is_some()) {
        return UserProfileResponse {
            success: false,
            data: None,
            error: Some("Username already taken".to_string()),
        };
    }
    
    let now = ic_cdk::api::time();
    let user_profile = UserProfile {
        id: caller,
        username: username.clone(),
        email,
        phone,
        kyc_status: KYCStatus::Pending,
        balance: 1000, // Starting balance
        created_at: now,
        updated_at: now,
    };
    
    USERS.with(|users| {
        users.borrow_mut().insert(caller, user_profile.clone());
    });
    
    USERNAMES.with(|usernames| {
        usernames.borrow_mut().insert(username, caller);
    });
    
    UserProfileResponse {
        success: true,
        data: Some(user_profile),
        error: None,
    }
}

#[query]
fn get_user_profile(user_id: Option<Principal>) -> UserProfileResponse {
    let user_id = user_id.unwrap_or_else(caller);
    
    let user = USERS.with(|users| users.borrow().get(&user_id).cloned());
    
    match user {
        Some(profile) => UserProfileResponse {
            success: true,
            data: Some(profile),
            error: None,
        },
        None => UserProfileResponse {
            success: false,
            data: None,
            error: Some("User not found".to_string()),
        },
    }
}

#[update]
fn update_user_profile(
    email: Option<String>,
    phone: Option<String>,
) -> UserProfileResponse {
    let caller = caller();
    
    let mut user = USERS.with(|users| users.borrow().get(&caller).cloned());
    
    if let Some(ref mut profile) = user {
        if let Some(email) = email {
            profile.email = Some(email);
        }
        if let Some(phone) = phone {
            profile.phone = Some(phone);
        }
        profile.updated_at = ic_cdk::api::time();
        
        USERS.with(|users| {
            users.borrow_mut().insert(caller, profile.clone());
        });
        
        UserProfileResponse {
            success: true,
            data: Some(profile.clone()),
            error: None,
        }
    } else {
        UserProfileResponse {
            success: false,
            data: None,
            error: Some("User not found".to_string()),
        }
    }
}

#[update]
fn update_kyc_status(user_id: Principal, status: KYCStatus) -> UserProfileResponse {
    // Only admin can update KYC status
    let caller = caller();
    // TODO: Add admin check
    
    let mut user = USERS.with(|users| users.borrow().get(&user_id).cloned());
    
    if let Some(ref mut profile) = user {
        profile.kyc_status = status;
        profile.updated_at = ic_cdk::api::time();
        
        USERS.with(|users| {
            users.borrow_mut().insert(user_id, profile.clone());
        });
        
        UserProfileResponse {
            success: true,
            data: Some(profile.clone()),
            error: None,
        }
    } else {
        UserProfileResponse {
            success: false,
            data: None,
            error: Some("User not found".to_string()),
        }
    }
}

// Balance Management
#[update]
fn add_balance(user_id: Principal, amount: u64) -> UserProfileResponse {
    let mut user = USERS.with(|users| users.borrow().get(&user_id).cloned());
    
    if let Some(ref mut profile) = user {
        profile.balance += amount;
        profile.updated_at = ic_cdk::api::time();
        
        USERS.with(|users| {
            users.borrow_mut().insert(user_id, profile.clone());
        });
        
        UserProfileResponse {
            success: true,
            data: Some(profile.clone()),
            error: None,
        }
    } else {
        UserProfileResponse {
            success: false,
            data: None,
            error: Some("User not found".to_string()),
        }
    }
}

#[update]
fn deduct_balance(user_id: Principal, amount: u64) -> UserProfileResponse {
    let mut user = USERS.with(|users| users.borrow().get(&user_id).cloned());
    
    if let Some(ref mut profile) = user {
        if profile.balance < amount {
            return UserProfileResponse {
                success: false,
                data: None,
                error: Some("Insufficient balance".to_string()),
            };
        }
        
        profile.balance -= amount;
        profile.updated_at = ic_cdk::api::time();
        
        USERS.with(|users| {
            users.borrow_mut().insert(user_id, profile.clone());
        });
        
        UserProfileResponse {
            success: true,
            data: Some(profile.clone()),
            error: None,
        }
    } else {
        UserProfileResponse {
            success: false,
            data: None,
            error: Some("User not found".to_string()),
        }
    }
}

// Notification Management
#[update]
fn create_notification(
    user_id: Principal,
    title: String,
    message: String,
    notification_type: NotificationType,
) -> NotificationResponse {
    let notification_id = get_next_id(&NEXT_NOTIFICATION_ID);
    
    let notification = Notification {
        id: notification_id.to_string(),
        user_id,
        title,
        message,
        notification_type,
        read: false,
        created_at: ic_cdk::api::time(),
    };
    
    NOTIFICATIONS.with(|notifications| {
        notifications.borrow_mut().insert(notification_id.to_string(), notification.clone());
    });
    
    NotificationResponse {
        success: true,
        data: Some(notification),
        error: None,
    }
}

#[query]
fn get_user_notifications(user_id: Option<Principal>) -> NotificationsResponse {
    let user_id = user_id.unwrap_or_else(caller);
    
    let notifications = NOTIFICATIONS.with(|notifications| {
        notifications
            .borrow()
            .iter()
            .filter(|(_, notification)| notification.user_id == user_id)
            .map(|(_, notification)| notification.clone())
            .collect()
    });
    
    NotificationsResponse {
        success: true,
        data: Some(notifications),
        error: None,
    }
}

#[update]
fn mark_notification_read(notification_id: String) -> NotificationResponse {
    let mut notification = NOTIFICATIONS.with(|notifications| {
        notifications.borrow().get(&notification_id).cloned()
    });
    
    if let Some(ref mut notif) = notification {
        notif.read = true;
        
        NOTIFICATIONS.with(|notifications| {
            notifications.borrow_mut().insert(notification_id, notif.clone());
        });
        
        NotificationResponse {
            success: true,
            data: Some(notif.clone()),
            error: None,
        }
    } else {
        NotificationResponse {
            success: false,
            data: None,
            error: Some("Notification not found".to_string()),
        }
    }
}

#[query]
fn get_all_users() -> Vec<UserProfile> {
    USERS.with(|users| {
        users.borrow().iter().map(|(_, user)| user.clone()).collect()
    })
}

#[query]
fn get_user_count() -> u64 {
    USERS.with(|users| users.borrow().len() as u64)
}

// --- Tournament Section ---
// Tournament Management
#[update]
fn create_tournament(
    name: String,
    sport: Sport,
    start_time: u64,
    end_time: u64,
) -> TournamentResponse {
    let tournament_id = get_next_id(&NEXT_TOURNAMENT_ID);

    let tournament = Tournament {
        id: tournament_id.to_string(),
        name,
        sport,
        start_time,
        end_time,
        status: TournamentStatus::Upcoming,
        teams: Vec::new(),
        matches: Vec::new(),
    };

    TOURNAMENTS.with(|tournaments| {
        tournaments.borrow_mut().insert(tournament_id.to_string(), tournament.clone());
    });

    TournamentResponse {
        success: true,
        data: Some(tournament),
        error: None,
    }
}

#[query]
fn get_tournament(tournament_id: String) -> TournamentResponse {
    let tournament = TOURNAMENTS.with(|tournaments| {
        tournaments.borrow().get(&tournament_id).cloned()
    });

    match tournament {
        Some(tournament) => TournamentResponse {
            success: true,
            data: Some(tournament),
            error: None,
        },
        None => TournamentResponse {
            success: false,
            data: None,
            error: Some("Tournament not found".to_string()),
        },
    }
}

#[query]
fn get_all_tournaments() -> Vec<Tournament> {
    TOURNAMENTS.with(|tournaments| {
        tournaments.borrow().iter().map(|(_, tournament)| tournament.clone()).collect()
    })
}

#[query]
fn get_tournaments_by_sport(sport: Sport) -> Vec<Tournament> {
    TOURNAMENTS.with(|tournaments| {
        tournaments
            .borrow()
            .iter()
            .filter(|(_, tournament)| tournament.sport == sport)
            .map(|(_, tournament)| tournament.clone())
            .collect()
    })
}

#[query]
fn get_live_tournaments() -> Vec<Tournament> {
    TOURNAMENTS.with(|tournaments| {
        tournaments
            .borrow()
            .iter()
            .filter(|(_, tournament)| tournament.status == TournamentStatus::Live)
            .map(|(_, tournament)| tournament.clone())
            .collect()
    })
}

#[update]
fn update_tournament_status(tournament_id: String, status: TournamentStatus) -> TournamentResponse {
    let mut tournament = TOURNAMENTS.with(|tournaments| {
        tournaments.borrow().get(&tournament_id).cloned()
    });

    if let Some(ref mut tourney) = tournament {
        tourney.status = status;

        TOURNAMENTS.with(|tournaments| {
            tournaments.borrow_mut().insert(tournament_id, tourney.clone());
        });

        TournamentResponse {
            success: true,
            data: Some(tourney.clone()),
            error: None,
        }
    } else {
        TournamentResponse {
            success: false,
            data: None,
            error: Some("Tournament not found".to_string()),
        }
    }
}

// Team Management
#[update]
fn create_team(name: String, short_name: String) -> TeamResponse {
    let team_id = get_next_id(&NEXT_TEAM_ID);

    let team = Team {
        id: team_id.to_string(),
        name,
        short_name,
        players: Vec::new(),
    };

    TEAMS.with(|teams| {
        teams.borrow_mut().insert(team_id.to_string(), team.clone());
    });

    TeamResponse {
        success: true,
        data: Some(team),
        error: None,
    }
}

#[query]
fn get_team(team_id: String) -> TeamResponse {
    let team = TEAMS.with(|teams| teams.borrow().get(&team_id).cloned());

    match team {
        Some(t) => TeamResponse {
            success: true,
            data: Some(t),
            error: None,
        },
        None => TeamResponse {
            success: false,
            data: None,
            error: Some("Team not found".to_string()),
        },
    }
}

#[query]
fn get_all_teams() -> Vec<Team> {
    TEAMS.with(|teams| teams.borrow().iter().map(|(_, team)| team.clone()).collect())
}

// Player Management
#[update]
fn create_player(
    name: String,
    team_id: String,
    position: PlayerPosition,
    price: u64,
) -> PlayerResponse {
    let player_id = get_next_id(&NEXT_PLAYER_ID);

    let player = Player {
        id: player_id.to_string(),
        name,
        team_id: team_id.clone(),
        position,
        points: 0.0,
        price,
        is_playing: false,
    };

    PLAYERS.with(|players| {
        players.borrow_mut().insert(player_id.to_string(), player.clone());
    });

    // Add player to team
    let mut team = TEAMS.with(|teams| teams.borrow().get(&team_id).cloned());
    if let Some(ref mut t) = team {
        t.players.push(player.clone());
        TEAMS.with(|teams| {
            teams.borrow_mut().insert(team_id, t.clone());
        });
    }

    PlayerResponse {
        success: true,
        data: Some(player),
        error: None,
    }
}

#[query]
fn get_player(player_id: String) -> PlayerResponse {
    let player = PLAYERS.with(|players| players.borrow().get(&player_id).cloned());

    match player {
        Some(p) => PlayerResponse {
            success: true,
            data: Some(p),
            error: None,
        },
        None => PlayerResponse {
            success: false,
            data: None,
            error: Some("Player not found".to_string()),
        },
    }
}

#[query]
fn get_players_by_team(team_id: String) -> Vec<Player> {
    PLAYERS.with(|players| {
        players
            .borrow()
            .iter()
            .filter(|(_, player)| player.team_id == team_id)
            .map(|(_, player)| player.clone())
            .collect()
    })
}

#[query]
fn get_players_by_position(position: PlayerPosition) -> Vec<Player> {
    PLAYERS.with(|players| {
        players
            .borrow()
            .iter()
            .filter(|(_, player)| player.position == position)
            .map(|(_, player)| player.clone())
            .collect()
    })
}

#[update]
fn update_player_points(player_id: String, points: f64) -> PlayerResponse {
    let mut player = PLAYERS.with(|players| players.borrow().get(&player_id).cloned());

    if let Some(ref mut p) = player {
        p.points = points;

        PLAYERS.with(|players| {
            players.borrow_mut().insert(player_id, p.clone());
        });

        PlayerResponse {
            success: true,
            data: Some(p.clone()),
            error: None,
        }
    } else {
        PlayerResponse {
            success: false,
            data: None,
            error: Some("Player not found".to_string()),
        }
    }
}

// Match Management
#[update]
fn create_match(
    tournament_id: String,
    team1_id: String,
    team2_id: String,
    start_time: u64,
) -> MatchResponse {
    let match_id = get_next_id(&NEXT_MATCH_ID);

    let match_obj = Match {
        id: match_id.to_string(),
        tournament_id: tournament_id.clone(),
        team1_id,
        team2_id,
        start_time,
        status: MatchStatus::Scheduled,
        score: None,
    };

    MATCHES.with(|matches| {
        matches.borrow_mut().insert(match_id.to_string(), match_obj.clone());
    });

    // Add match to tournament
    let mut tournament = TOURNAMENTS.with(|tournaments| {
        tournaments.borrow().get(&tournament_id).cloned()
    });

    if let Some(ref mut tourney) = tournament {
        tourney.matches.push(match_obj.clone());
        TOURNAMENTS.with(|tournaments| {
            tournaments.borrow_mut().insert(tournament_id, tourney.clone());
        });
    }

    MatchResponse {
        success: true,
        data: Some(match_obj),
        error: None,
    }
}

#[query]
fn get_match(match_id: String) -> MatchResponse {
    let match_obj = MATCHES.with(|matches| matches.borrow().get(&match_id).cloned());

    match match_obj {
        Some(m) => MatchResponse {
            success: true,
            data: Some(m),
            error: None,
        },
        None => MatchResponse {
            success: false,
            data: None,
            error: Some("Match not found".to_string()),
        },
    }
}

#[query]
fn get_matches_by_tournament(tournament_id: String) -> Vec<Match> {
    MATCHES.with(|matches| {
        matches
            .borrow()
            .iter()
            .filter(|(_, match_obj)| match_obj.tournament_id == tournament_id)
            .map(|(_, match_obj)| match_obj.clone())
            .collect()
    })
}

#[update]
fn update_match_status(match_id: String, status: MatchStatus) -> MatchResponse {
    let mut match_obj = MATCHES.with(|matches| matches.borrow().get(&match_id).cloned());

    if let Some(ref mut m) = match_obj {
        m.status = status;

        MATCHES.with(|matches| {
            matches.borrow_mut().insert(match_id, m.clone());
        });

        MatchResponse {
            success: true,
            data: Some(m.clone()),
            error: None,
        }
    } else {
        MatchResponse {
            success: false,
            data: None,
            error: Some("Match not found".to_string()),
        }
    }
}

#[update]
fn update_match_score(match_id: String, score: MatchScore) -> MatchResponse {
    let mut match_obj = MATCHES.with(|matches| matches.borrow().get(&match_id).cloned());

    if let Some(ref mut m) = match_obj {
        m.score = Some(score);

        MATCHES.with(|matches| {
            matches.borrow_mut().insert(match_id, m.clone());
        });

        MatchResponse {
            success: true,
            data: Some(m.clone()),
            error: None,
        }
    } else {
        MatchResponse {
            success: false,
            data: None,
            error: Some("Match not found".to_string()),
        }
    }
}

#[update]
fn update_match_score_data(match_id: String, score: MatchScore) -> MatchScoreResponse {
    MATCH_SCORES.with(|match_scores| {
        match_scores.borrow_mut().insert(match_id.clone(), score.clone());
    });
    
    MatchScoreResponse {
        success: true,
        data: Some(score),
        error: None,
    }
}

#[query]
fn get_match_score(match_id: String) -> MatchScoreResponse {
    let score = MATCH_SCORES.with(|match_scores| {
        match_scores.borrow().get(&match_id).cloned()
    });
    
    match score {
        Some(s) => MatchScoreResponse {
            success: true,
            data: Some(s),
            error: None,
        },
        None => MatchScoreResponse {
            success: false,
            data: None,
            error: Some("Match score not found".to_string()),
        },
    }
}

#[update]
fn add_team_to_tournament(tournament_id: String, team: Team) -> TournamentResponse {
    let mut tournament = TOURNAMENTS.with(|tournaments| {
        tournaments.borrow().get(&tournament_id).cloned()
    });

    if let Some(ref mut tourney) = tournament {
        tourney.teams.push(team);

        TOURNAMENTS.with(|tournaments| {
            tournaments.borrow_mut().insert(tournament_id, tourney.clone());
        });

        TournamentResponse {
            success: true,
            data: Some(tourney.clone()),
            error: None,
        }
    } else {
        TournamentResponse {
            success: false,
            data: None,
            error: Some("Tournament not found".to_string()),
        }
    }
}

#[query]
fn get_tournament_teams(tournament_id: String) -> TeamsResponse {
    let tournament = TOURNAMENTS.with(|tournaments| {
        tournaments.borrow().get(&tournament_id).cloned()
    });

    match tournament {
        Some(tourney) => TeamsResponse {
            success: true,
            data: Some(tourney.teams),
            error: None,
        },
        None => TeamsResponse {
            success: false,
            data: None,
            error: Some("Tournament not found".to_string()),
        },
    }
}

#[query]
fn get_tournament_count() -> u64 {
    TOURNAMENTS.with(|tournaments| tournaments.borrow().len() as u64)
}

#[query]
fn get_match_count() -> u64 {
    MATCHES.with(|matches| matches.borrow().len() as u64)
}

#[query]
fn get_live_matches() -> Vec<Match> {
    MATCHES.with(|matches| {
        matches
            .borrow()
            .iter()
            .filter(|(_, match_obj)| match_obj.status == MatchStatus::Live)
            .map(|(_, match_obj)| match_obj.clone())
            .collect()
    })
}

#[query]
fn get_upcoming_matches() -> Vec<Match> {
    MATCHES.with(|matches| {
        matches
            .borrow()
            .iter()
            .filter(|(_, match_obj)| match_obj.status == MatchStatus::Scheduled)
            .map(|(_, match_obj)| match_obj.clone())
            .collect()
    })
}

// --- Team Management Section ---
// (Insert all thread_local! statics and functions from team_management/src/lib.rs here)
// ...

// --- Contest Section ---
// Contest Management
#[update]
fn create_contest(
    name: String,
    match_id: String,
    entry_fee: u64,
    total_spots: u32,
    prize_pool: u64,
    contest_type: ContestType,
    start_time: u64,
) -> ContestResponse {
    let contest_id = get_next_id(&NEXT_CONTEST_ID);
    
    let contest = Contest {
        id: contest_id.to_string(),
        name,
        match_id,
        entry_fee,
        total_spots,
        filled_spots: 0,
        prize_pool,
        contest_type,
        status: ContestStatus::Open,
        created_at: ic_cdk::api::time(),
        start_time,
    };
    
    CONTESTS.with(|contests| {
        contests.borrow_mut().insert(contest_id.to_string(), contest.clone());
    });
    
    CONTEST_ENTRIES_BY_CONTEST.with(|contest_entries| {
        contest_entries.borrow_mut().insert(contest_id.to_string(), Vec::new());
    });
    
    ContestResponse {
        success: true,
        data: Some(contest),
        error: None,
    }
}

#[query]
fn get_contest(contest_id: String) -> ContestResponse {
    let contest = CONTESTS.with(|contests| contests.borrow().get(&contest_id).cloned());
    
    match contest {
        Some(c) => ContestResponse {
            success: true,
            data: Some(c),
            error: None,
        },
        None => ContestResponse {
            success: false,
            data: None,
            error: Some("Contest not found".to_string()),
        },
    }
}

#[query]
fn get_contests_by_match(match_id: String) -> Vec<Contest> {
    CONTESTS.with(|contests| {
        contests
            .borrow()
            .iter()
            .filter(|(_, contest)| contest.match_id == match_id)
            .map(|(_, contest)| contest.clone())
            .collect()
    })
}

#[query]
fn get_open_contests() -> Vec<Contest> {
    CONTESTS.with(|contests| {
        contests
            .borrow()
            .iter()
            .filter(|(_, contest)| contest.status == ContestStatus::Open)
            .map(|(_, contest)| contest.clone())
            .collect()
    })
}

// Contest Entry Management
#[update]
fn join_contest(contest_id: String, fantasy_team_id: String) -> ContestEntryResponse {
    let caller = caller();
    
    // Get contest
    let contest = CONTESTS.with(|contests| contests.borrow().get(&contest_id).cloned());
    if contest.is_none() {
        return ContestEntryResponse {
            success: false,
            data: None,
            error: Some("Contest not found".to_string()),
        };
    }
    let contest = contest.unwrap();
    
    // Check if contest is open
    if contest.status != ContestStatus::Open {
        return ContestEntryResponse {
            success: false,
            data: None,
            error: Some("Contest is not open for entries".to_string()),
        };
    }
    
    // Check if contest is full
    if contest.filled_spots >= contest.total_spots {
        return ContestEntryResponse {
            success: false,
            data: None,
            error: Some("Contest is full".to_string()),
        };
    }
    
    // Check if user already joined this contest
    let user_contest_ids = USER_CONTESTS.with(|user_contests| {
        user_contests.borrow().get(&caller).cloned().unwrap_or(vec![])
    });
    
    if user_contest_ids.contains(&contest_id) {
        return ContestEntryResponse {
            success: false,
            data: None,
            error: Some("User already joined this contest".to_string()),
        };
    }
    
    // TODO: Deduct entry fee from user balance (call user_management canister)
    // TODO: Get fantasy team details (call team_management canister)
    
    let entry_id = get_next_id(&NEXT_ENTRY_ID);
    
    let entry = ContestEntry {
        id: entry_id.to_string(),
        contest_id: contest_id.clone(),
        user_id: caller,
        team: FantasyTeam {
            id: fantasy_team_id.clone(),
            name: "".to_string(),
            captain_id: "".to_string(),
            vice_captain_id: "".to_string(),
            players: Vec::new(),
            total_points: 0.0,
            total_price: 0,
        },
        points: 0.0,
        rank: None,
        prize: None,
        created_at: ic_cdk::api::time(),
    };
    
    CONTEST_ENTRIES.with(|entries| {
        entries.borrow_mut().insert(entry_id.to_string(), entry.clone());
    });
    
    // Update contest filled spots
    let mut updated_contest = contest.clone();
    updated_contest.filled_spots += 1;
    if updated_contest.filled_spots >= updated_contest.total_spots {
        updated_contest.status = ContestStatus::Full;
    }
    
    CONTESTS.with(|contests| {
        contests.borrow_mut().insert(contest_id.clone(), updated_contest);
    });
    
    // Update user contests
    let mut user_contest_ids = user_contest_ids;
    user_contest_ids.push(contest_id.clone());
    USER_CONTESTS.with(|user_contests_map| {
        user_contests_map.borrow_mut().insert(caller, user_contest_ids);
    });
    
    // Update contest entries
    let mut contest_entries = CONTEST_ENTRIES_BY_CONTEST.with(|contest_entries| {
        contest_entries.borrow().get(&contest_id).cloned().unwrap_or(vec![])
    });
    contest_entries.push(entry_id.to_string());
    CONTEST_ENTRIES_BY_CONTEST.with(|contest_entries_map| {
        contest_entries_map.borrow_mut().insert(contest_id, contest_entries);
    });
    
    ContestEntryResponse {
        success: true,
        data: Some(entry),
        error: None,
    }
}

#[query]
fn get_contest_entries(contest_id: String) -> Vec<ContestEntry> {
    let entry_ids = CONTEST_ENTRIES_BY_CONTEST.with(|contest_entries| {
        contest_entries.borrow().get(&contest_id).cloned().unwrap_or(vec![])
    });
    
    CONTEST_ENTRIES.with(|entries| {
        entry_ids
            .iter()
            .filter_map(|id| entries.borrow().get(id).cloned())
            .collect()
    })
}

#[query]
fn get_user_contest_entries(user_id: Option<Principal>) -> ContestEntriesResponse {
    let user_id = user_id.unwrap_or_else(caller);
    
    let contest_ids = USER_CONTESTS.with(|user_contests| {
        user_contests.borrow().get(&user_id).cloned().unwrap_or(vec![])
    });
    
    let entries = CONTEST_ENTRIES.with(|entries| {
        entries
            .borrow()
            .iter()
            .filter(|(_, entry)| entry.user_id == user_id)
            .map(|(_, entry)| entry.clone())
            .collect()
    });
    
    ContestEntriesResponse {
        success: true,
        data: Some(entries),
        error: None,
    }
}

#[update]
fn update_contest_status(contest_id: String, status: ContestStatus) -> ContestResponse {
    let mut contest = CONTESTS.with(|contests| contests.borrow().get(&contest_id).cloned());
    
    if let Some(ref mut c) = contest {
        c.status = status;
        
        CONTESTS.with(|contests| {
            contests.borrow_mut().insert(contest_id, c.clone());
        });
        
        ContestResponse {
            success: true,
            data: Some(c.clone()),
            error: None,
        }
    } else {
        ContestResponse {
            success: false,
            data: None,
            error: Some("Contest not found".to_string()),
        }
    }
}

#[update]
fn update_entry_points(entry_id: String, points: f64) -> ContestEntryResponse {
    let mut entry = CONTEST_ENTRIES.with(|entries| entries.borrow().get(&entry_id).cloned());
    
    if let Some(ref mut e) = entry {
        e.points = points;
        
        CONTEST_ENTRIES.with(|entries| {
            entries.borrow_mut().insert(entry_id, e.clone());
        });
        
        ContestEntryResponse {
            success: true,
            data: Some(e.clone()),
            error: None,
        }
    } else {
        ContestEntryResponse {
            success: false,
            data: None,
            error: Some("Entry not found".to_string()),
        }
    }
}

#[update]
fn finalize_contest(contest_id: String) -> ContestEntriesResponse {
    let entries = get_contest_entries(contest_id.clone());
    
    if entries.is_empty() {
        return ContestEntriesResponse {
            success: false,
            data: None,
            error: Some("No entries found for contest".to_string()),
        };
    }
    
    // Sort entries by points (descending)
    let mut sorted_entries = entries.clone();
    sorted_entries.sort_by(|a, b| b.points.partial_cmp(&a.points).unwrap());
    
    // Assign ranks
    for (index, entry) in sorted_entries.iter_mut().enumerate() {
        entry.rank = Some((index + 1) as u32);
        
        CONTEST_ENTRIES.with(|entries| {
            entries.borrow_mut().insert(entry.id.clone(), entry.clone());
        });
    }
    
    // Update contest status
    update_contest_status(contest_id, ContestStatus::Completed);
    
    ContestEntriesResponse {
        success: true,
        data: Some(sorted_entries),
        error: None,
    }
}

#[query]
fn get_contest_count() -> u64 {
    CONTESTS.with(|contests| contests.borrow().len() as u64)
}

#[query]
fn get_entry_count() -> u64 {
    CONTEST_ENTRIES.with(|entries| entries.borrow().len() as u64)
}

// --- Scoring Section ---
// Scoring Management
#[update]
fn update_player_score(
    player_id: String,
    match_id: String,
    stats: PlayerStats,
) -> PlayerScoreResponse {
    let score_id = format!("{}:{}", player_id, match_id);
    
    let mut player_score = PLAYER_SCORES.with(|scores| {
        scores.borrow().get(&score_id).cloned()
    });
    
    if player_score.is_none() {
        player_score = Some(PlayerScore {
            player_id: player_id.clone(),
            match_id: match_id.clone(),
            points: 0.0,
            stats: PlayerStats {
                runs: None,
                wickets: None,
                catches: None,
                stumpings: None,
                run_outs: None,
                overs: None,
                maidens: None,
                economy: None,
                goals: None,
                assists: None,
                clean_sheets: None,
                saves: None,
                yellow_cards: None,
                red_cards: None,
                points: None,
                rebounds: None,
                blocks: None,
                steals: None,
                turnovers: None,
            },
            updated_at: ic_cdk::api::time(),
        });
    }
    
    if let Some(ref mut score) = player_score {
        score.stats = stats;
        score.points = calculate_player_points(&score.stats);
        score.updated_at = ic_cdk::api::time();
        
        PLAYER_SCORES.with(|scores| {
            scores.borrow_mut().insert(score_id, score.clone());
        });
        
        PlayerScoreResponse {
            success: true,
            data: Some(score.clone()),
            error: None,
        }
    } else {
        PlayerScoreResponse {
            success: false,
            data: None,
            error: Some("Failed to create player score".to_string()),
        }
    }
}

fn calculate_player_points(stats: &PlayerStats) -> f64 {
    let mut total_points = 0.0;
    
    // Cricket points
    if let Some(runs) = stats.runs {
        total_points += runs as f64 * 1.0;
    }
    if let Some(wickets) = stats.wickets {
        total_points += wickets as f64 * 10.0;
    }
    if let Some(catches) = stats.catches {
        total_points += catches as f64 * 8.0;
    }
    if let Some(stumpings) = stats.stumpings {
        total_points += stumpings as f64 * 10.0;
    }
    if let Some(run_outs) = stats.run_outs {
        total_points += run_outs as f64 * 6.0;
    }
    if let Some(maidens) = stats.maidens {
        total_points += maidens as f64 * 4.0;
    }
    if let Some(economy) = stats.economy {
        if economy < 4.0 {
            total_points += 2.0; // Economy bonus
        }
    }
    
    // Football points
    if let Some(goals) = stats.goals {
        total_points += goals as f64 * 6.0;
    }
    if let Some(assists) = stats.assists {
        total_points += assists as f64 * 3.0;
    }
    if let Some(clean_sheets) = stats.clean_sheets {
        total_points += clean_sheets as f64 * 4.0;
    }
    if let Some(saves) = stats.saves {
        total_points += saves as f64 * 1.0;
    }
    if let Some(yellow_cards) = stats.yellow_cards {
        total_points -= yellow_cards as f64 * 1.0;
    }
    if let Some(red_cards) = stats.red_cards {
        total_points -= red_cards as f64 * 3.0;
    }
    
    // Basketball points
    if let Some(points) = stats.points {
        total_points += points as f64 * 1.0;
    }
    if let Some(rebounds) = stats.rebounds {
        total_points += rebounds as f64 * 1.2;
    }
    if let Some(assists) = stats.assists {
        total_points += assists as f64 * 1.5;
    }
    if let Some(blocks) = stats.blocks {
        total_points += blocks as f64 * 2.0;
    }
    if let Some(steals) = stats.steals {
        total_points += steals as f64 * 2.0;
    }
    if let Some(turnovers) = stats.turnovers {
        total_points -= turnovers as f64 * 1.0;
    }
    
    total_points
}

#[query]
fn get_player_score(player_id: String, match_id: String) -> PlayerScoreResponse {
    let score_id = format!("{}:{}", player_id, match_id);
    
    let player_score = PLAYER_SCORES.with(|scores| {
        scores.borrow().get(&score_id).cloned()
    });
    
    match player_score {
        Some(score) => PlayerScoreResponse {
            success: true,
            data: Some(score),
            error: None,
        },
        None => PlayerScoreResponse {
            success: false,
            data: None,
            error: Some("Player score not found".to_string()),
        },
    }
}

#[query]
fn get_match_scores(match_id: String) -> Vec<PlayerScore> {
    PLAYER_SCORES.with(|scores| {
        scores
            .borrow()
            .iter()
            .filter(|(_, score)| score.match_id == match_id)
            .map(|(_, score)| score.clone())
            .collect()
    })
}

#[update]
fn add_scoring_rule(sport: Sport, action: String, points: f64) -> ScoringRuleResponse {
    let rule = ScoringRule {
        action: action.clone(),
        points,
        sport: sport.clone(),
    };
    
    let mut rules = SCORING_RULES.with(|scoring_rules| {
        scoring_rules.borrow().get(&sport).cloned().unwrap_or(vec![])
    });
    rules.push(rule.clone());
    
    SCORING_RULES.with(|scoring_rules| {
        scoring_rules.borrow_mut().insert(sport, rules);
    });
    
    ScoringRuleResponse {
        success: true,
        data: Some(rule),
        error: None,
    }
}

#[query]
fn get_scoring_rules(sport: Sport) -> Vec<ScoringRule> {
    SCORING_RULES.with(|rules| {
        rules.borrow().get(&sport).cloned().unwrap_or(vec![])
    })
}

#[query]
fn calculate_fantasy_team_points(
    player_ids: Vec<String>,
    match_id: String,
    captain_id: String,
    vice_captain_id: String,
) -> f64 {
    let mut total_points = 0.0;
    
    for player_id in player_ids {
        let score = PLAYER_SCORES.with(|scores| {
            let score_id = format!("{}:{}", player_id, match_id);
            scores.borrow().get(&score_id).cloned()
        });
        
        if let Some(player_score) = score {
            let mut points = player_score.points;
            
            // Apply captain/vice-captain multipliers
            if player_id == captain_id {
                points *= 2.0;
            } else if player_id == vice_captain_id {
                points *= 1.5;
            }
            
            total_points += points;
        }
    }
    
    total_points
}

#[query]
fn get_all_player_scores() -> Vec<PlayerScore> {
    PLAYER_SCORES.with(|scores| {
        scores.borrow().iter().map(|(_, score)| score.clone()).collect()
    })
}

#[query]
fn get_score_count() -> u64 {
    PLAYER_SCORES.with(|scores| scores.borrow().len() as u64)
}

// --- Rewards Section ---
// Prize Pool Management
#[update]
fn create_prize_pool(
    contest_id: String,
    total_amount: u64,
    distribution: Vec<PrizeDistribution>,
) -> PrizePoolResponse {
    let prize_pool = PrizePool {
        contest_id: contest_id.clone(),
        total_amount,
        distribution,
        distributed: false,
    };
    
    PRIZE_POOLS.with(|pools| {
        pools.borrow_mut().insert(contest_id, prize_pool.clone());
    });
    
    PrizePoolResponse {
        success: true,
        data: Some(prize_pool),
        error: None,
    }
}

#[query]
fn get_prize_pool(contest_id: String) -> PrizePoolResponse {
    let pool = PRIZE_POOLS.with(|pools| pools.borrow().get(&contest_id).cloned());
    
    match pool {
        Some(p) => PrizePoolResponse {
            success: true,
            data: Some(p),
            error: None,
        },
        None => PrizePoolResponse {
            success: false,
            data: None,
            error: Some("Prize pool not found".to_string()),
        },
    }
}

// Reward Distribution
#[update]
fn distribute_contest_rewards(
    contest_id: String,
    winners: Vec<(Principal, u32, u64)>, // (user_id, rank, amount)
) -> UserRewardsResponse {
    let mut rewards = Vec::new();
    
    for (user_id, rank, amount) in winners {
        let reward_id = get_next_id(&NEXT_REWARD_ID);
        
        let user_reward = UserReward {
            id: reward_id.to_string(),
            user_id,
            contest_id: contest_id.clone(),
            amount,
            rank,
            status: RewardStatus::Pending,
            created_at: ic_cdk::api::time(),
            claimed_at: None,
        };
        
        USER_REWARDS.with(|rewards_map| {
            let mut user_rewards = rewards_map.borrow().get(&user_id).cloned().unwrap_or(vec![]);
            user_rewards.push(user_reward.clone());
            rewards_map.borrow_mut().insert(user_id, user_rewards);
        });
        
        rewards.push(user_reward);
    }
    
    // Mark prize pool as distributed
    let mut prize_pool = PRIZE_POOLS.with(|pools| pools.borrow().get(&contest_id).cloned());
    if let Some(ref mut pool) = prize_pool {
        pool.distributed = true;
        PRIZE_POOLS.with(|pools| {
            pools.borrow_mut().insert(contest_id, pool.clone());
        });
    }
    
    UserRewardsResponse {
        success: true,
        data: Some(rewards),
        error: None,
    }
}

#[update]
fn claim_reward(reward_id: String) -> UserRewardResponse {
    let mut reward = find_user_reward(reward_id.clone());
    
    if let Some(ref mut r) = reward {
        if r.status == RewardStatus::Pending {
            r.status = RewardStatus::Claimed;
            r.claimed_at = Some(ic_cdk::api::time());
            
            update_user_reward(r.clone());
            
            // Add balance to user
            add_balance(r.user_id, r.amount);
            
            UserRewardResponse {
                success: true,
                data: Some(r.clone()),
                error: None,
            }
        } else {
            UserRewardResponse {
                success: false,
                data: None,
                error: Some("Reward already claimed or failed".to_string()),
            }
        }
    } else {
        UserRewardResponse {
            success: false,
            data: None,
            error: Some("Reward not found".to_string()),
        }
    }
}

fn find_user_reward(reward_id: String) -> Option<UserReward> {
    USER_REWARDS.with(|rewards| {
        for (_, user_rewards) in rewards.borrow().iter() {
            for reward in user_rewards {
                if reward.id == reward_id {
                    return Some(reward.clone());
                }
            }
        }
        None
    })
}

fn update_user_reward(updated_reward: UserReward) {
    USER_REWARDS.with(|rewards| {
        for (user_id, user_rewards) in rewards.borrow_mut().iter_mut() {
            for reward in user_rewards {
                if reward.id == updated_reward.id {
                    *reward = updated_reward.clone();
                    return;
                }
            }
        }
    });
}

fn create_transaction(
    user_id: Principal,
    amount: u64,
    transaction_type: TransactionType,
    status: TransactionStatus,
) {
    let transaction_id = get_next_id(&NEXT_TRANSACTION_ID);
    
    let transaction = RewardTransaction {
        id: transaction_id.to_string(),
        user_id,
        amount,
        transaction_type,
        status,
        created_at: ic_cdk::api::time(),
        completed_at: None,
    };
    
    REWARD_HISTORY.with(|history| {
        history.borrow_mut().insert(transaction_id.to_string(), transaction);
    });
}

#[query]
fn get_user_rewards(user_id: Option<Principal>) -> UserRewardsResponse {
    let user_id = user_id.unwrap_or_else(caller);
    
    let rewards = USER_REWARDS.with(|rewards| {
        rewards.borrow().get(&user_id).cloned().unwrap_or(vec![])
    });
    
    UserRewardsResponse {
        success: true,
        data: Some(rewards),
        error: None,
    }
}

#[query]
fn get_user_transactions(user_id: Option<Principal>) -> RewardTransactionsResponse {
    let user_id = user_id.unwrap_or_else(caller);
    
    let transactions = REWARD_HISTORY.with(|history| {
        history
            .borrow()
            .iter()
            .filter(|(_, transaction)| transaction.user_id == user_id)
            .map(|(_, transaction)| transaction.clone())
            .collect()
    });
    
    RewardTransactionsResponse {
        success: true,
        data: Some(transactions),
        error: None,
    }
}

#[query]
fn get_pending_rewards(user_id: Option<Principal>) -> UserRewardsResponse {
    let user_id = user_id.unwrap_or_else(caller);
    
    let rewards = USER_REWARDS.with(|rewards| {
        rewards
            .borrow()
            .get(&user_id)
            .cloned()
            .unwrap_or(vec![])
            .into_iter()
            .filter(|reward| reward.status == RewardStatus::Pending)
            .collect()
    });
    
    UserRewardsResponse {
        success: true,
        data: Some(rewards),
        error: None,
    }
}

#[update]
fn create_bonus_reward(user_id: Principal, amount: u64, reason: String) -> UserRewardResponse {
    let reward_id = get_next_id(&NEXT_REWARD_ID);
    
    let user_reward = UserReward {
        id: reward_id.to_string(),
        user_id,
        contest_id: "bonus".to_string(),
        amount,
        rank: 0,
        status: RewardStatus::Pending,
        created_at: ic_cdk::api::time(),
        claimed_at: None,
    };
    
    USER_REWARDS.with(|rewards_map| {
        let mut user_rewards = rewards_map.borrow().get(&user_id).cloned().unwrap_or(vec![]);
        user_rewards.push(user_reward.clone());
        rewards_map.borrow_mut().insert(user_id, user_rewards);
    });
    
    // Create transaction record
    create_transaction(
        user_id,
        amount,
        TransactionType::Bonus,
        TransactionStatus::Pending,
    );
    
    UserRewardResponse {
        success: true,
        data: Some(user_reward),
        error: None,
    }
}

#[query]
fn get_total_rewards_distributed() -> u64 {
    USER_REWARDS.with(|rewards| {
        rewards
            .borrow()
            .iter()
            .flat_map(|(_, user_rewards)| user_rewards)
            .filter(|reward| reward.status == RewardStatus::Claimed)
            .map(|reward| reward.amount)
            .sum()
    })
}

#[query]
fn get_reward_count() -> u64 {
    USER_REWARDS.with(|rewards| {
        rewards
            .borrow()
            .iter()
            .map(|(_, user_rewards)| user_rewards.len() as u64)
            .sum()
    })
}

#[query]
fn get_transaction_count() -> u64 {
    REWARD_HISTORY.with(|history| history.borrow().len() as u64)
}

// --- Team Management Section ---
// Fantasy Team Management
#[update]
fn create_fantasy_team(
    name: String,
    captain_id: String,
    vice_captain_id: String,
    player_ids: Vec<String>,
) -> FantasyTeamResponse {
    let caller = caller();
    
    // Validate team size
    if player_ids.len() != MAX_TEAM_SIZE as usize {
        return FantasyTeamResponse {
            success: false,
            data: None,
            error: Some(format!("Team must have exactly {} players", MAX_TEAM_SIZE)),
        };
    }
    
    // Validate captain and vice-captain are in the team
    if !player_ids.contains(&captain_id) || !player_ids.contains(&vice_captain_id) {
        return FantasyTeamResponse {
            success: false,
            data: None,
            error: Some("Captain and vice-captain must be in the team".to_string()),
        };
    }
    
    // Calculate total price
    let mut total_price = 0u64;
    for player_id in &player_ids {
        if let Some(player) = PLAYERS.with(|players| players.borrow().get(player_id).cloned()) {
            total_price += player.price;
        }
    }
    
    // Validate team price
    if total_price > MAX_TEAM_PRICE || total_price < MIN_TEAM_PRICE {
        return FantasyTeamResponse {
            success: false,
            data: None,
            error: Some(format!(
                "Team price must be between {} and {} tokens",
                MIN_TEAM_PRICE, MAX_TEAM_PRICE
            )),
        };
    }
    
    let team_id = get_next_id(&NEXT_FANTASY_TEAM_ID);
    
    let fantasy_team = FantasyTeam {
        id: team_id.to_string(),
        name,
        captain_id,
        vice_captain_id,
        players: player_ids,
        total_points: 0.0,
        total_price,
    };
    
    FANTASY_TEAMS.with(|teams| {
        teams.borrow_mut().insert(team_id.to_string(), fantasy_team.clone());
    });
    
    // Add team to user's teams
    let mut user_teams = USER_FANTASY_TEAMS.with(|user_teams| {
        user_teams.borrow().get(&caller).cloned().unwrap_or(vec![])
    });
    user_teams.push(team_id.to_string());
    USER_FANTASY_TEAMS.with(|user_teams_map| {
        user_teams_map.borrow_mut().insert(caller, user_teams);
    });
    
    FantasyTeamResponse {
        success: true,
        data: Some(fantasy_team),
        error: None,
    }
}

#[query]
fn get_user_fantasy_teams(user_id: Option<Principal>) -> FantasyTeamsResponse {
    let user_id = user_id.unwrap_or_else(caller);
    
    let team_ids = USER_FANTASY_TEAMS.with(|user_teams| {
        user_teams.borrow().get(&user_id).cloned().unwrap_or(vec![])
    });
    
    let teams = FANTASY_TEAMS.with(|teams| {
        team_ids
            .iter()
            .filter_map(|id| teams.borrow().get(id).cloned())
            .collect()
    });
    
    FantasyTeamsResponse {
        success: true,
        data: Some(teams),
        error: None,
    }
}

#[query]
fn get_fantasy_team(team_id: String) -> FantasyTeamResponse {
    let team = FANTASY_TEAMS.with(|teams| teams.borrow().get(&team_id).cloned());
    
    match team {
        Some(t) => FantasyTeamResponse {
            success: true,
            data: Some(t),
            error: None,
        },
        None => FantasyTeamResponse {
            success: false,
            data: None,
            error: Some("Fantasy team not found".to_string()),
        },
    }
}

#[update]
fn update_player_playing_status(player_id: String, is_playing: bool) -> PlayerResponse {
    let mut player = PLAYERS.with(|players| players.borrow().get(&player_id).cloned());
    
    if let Some(ref mut p) = player {
        p.is_playing = is_playing;
        
        PLAYERS.with(|players| {
            players.borrow_mut().insert(player_id, p.clone());
        });
        
        PlayerResponse {
            success: true,
            data: Some(p.clone()),
            error: None,
        }
    } else {
        PlayerResponse {
            success: false,
            data: None,
            error: Some("Player not found".to_string()),
        }
    }
}

#[query]
fn get_all_players() -> Vec<Player> {
    PLAYERS.with(|players| {
        players.borrow().iter().map(|(_, player)| player.clone()).collect()
    })
}

fn get_next_id(id_ref: &'static LocalKey<RefCell<Option<StableCell<u64, Memory>>>>) -> u64 {
    id_ref.with(|id| {
        let mut id = id.borrow_mut();
        let stable_cell = id.as_mut().unwrap();
        let current_id = *stable_cell.get();
        stable_cell.set(current_id + 1).unwrap();
        current_id
    })
} 