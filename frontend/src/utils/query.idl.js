export const idlFactory = ({ IDL }) => {
    const KYCStatus = IDL.Variant({       
      'Rejected' : IDL.Null,
      'Verified' : IDL.Null,
      'Pending' : IDL.Null,
    });
    const UserProfile = IDL.Record({
      'id' : IDL.Principal,
      'updated_at' : IDL.Nat64,
      'username' : IDL.Text,
      'balance' : IDL.Nat64,
      'created_at' : IDL.Nat64,
      'email' : IDL.Opt(IDL.Text),
      'kyc_status' : KYCStatus,
      'phone' : IDL.Opt(IDL.Text),
    });
    const UserProfileResponse = IDL.Record({
      'data' : IDL.Opt(UserProfile),
      'error' : IDL.Opt(IDL.Text),
      'success' : IDL.Bool,
    });
    const Sport = IDL.Variant({
      'Basketball' : IDL.Null,
      'Tennis' : IDL.Null,
      'Football' : IDL.Null,
      'Cricket' : IDL.Null,
    });
    const ScoringRule = IDL.Record({
      'action' : IDL.Text,
      'sport' : Sport,
      'points' : IDL.Float64,
    });
    const ScoringRuleResponse = IDL.Record({
      'data' : IDL.Opt(ScoringRule),
      'error' : IDL.Opt(IDL.Text),
      'success' : IDL.Bool,
    });
    const PlayerPosition = IDL.Variant({
      'PowerForward' : IDL.Null,
      'Goalkeeper' : IDL.Null,
      'Center' : IDL.Null,
      'AllRounder' : IDL.Null,
      'PointGuard' : IDL.Null,
      'WicketKeeper' : IDL.Null,
      'Batsman' : IDL.Null,
      'Bowler' : IDL.Null,
      'Midfielder' : IDL.Null,
      'Forward' : IDL.Null,
      'Defender' : IDL.Null,
      'ShootingGuard' : IDL.Null,
      'SmallForward' : IDL.Null,
    });
    const Player = IDL.Record({
      'id' : IDL.Text,
      'name' : IDL.Text,
      'team_id' : IDL.Text,
      'is_playing' : IDL.Bool,
      'price' : IDL.Nat64,
      'position' : PlayerPosition,
      'points' : IDL.Float64,
    });
    const Team = IDL.Record({
      'id' : IDL.Text,
      'name' : IDL.Text,
      'players' : IDL.Vec(Player),
      'short_name' : IDL.Text,
    });
    const TournamentStatus = IDL.Variant({
      'Live' : IDL.Null,
      'Cancelled' : IDL.Null,
      'Completed' : IDL.Null,
      'Upcoming' : IDL.Null,
    });
    const MatchStatus = IDL.Variant({
      'Live' : IDL.Null,
      'Scheduled' : IDL.Null,
      'Cancelled' : IDL.Null,
      'Completed' : IDL.Null,
    });
    const MatchScore = IDL.Record({
      'team2_score' : IDL.Text,
      'team1_overs' : IDL.Opt(IDL.Float64),
      'team2_overs' : IDL.Opt(IDL.Float64),
      'team1_score' : IDL.Text,
    });
    const Match = IDL.Record({
      'id' : IDL.Text,
      'status' : MatchStatus,
      'score' : IDL.Opt(MatchScore),
      'start_time' : IDL.Nat64,
      'tournament_id' : IDL.Text,
      'team1_id' : IDL.Text,
      'team2_id' : IDL.Text,
    });
    const Tournament = IDL.Record({
      'id' : IDL.Text,
      'status' : TournamentStatus,
      'teams' : IDL.Vec(Team),
      'name' : IDL.Text,
      'end_time' : IDL.Nat64,
      'sport' : Sport,
      'start_time' : IDL.Nat64,
      'matches' : IDL.Vec(Match),
    });
    const TournamentResponse = IDL.Record({
      'data' : IDL.Opt(Tournament),
      'error' : IDL.Opt(IDL.Text),
      'success' : IDL.Bool,
    });
    const RewardStatus = IDL.Variant({
      'Failed' : IDL.Null,
      'Claimed' : IDL.Null,
      'Pending' : IDL.Null,
    });
    const UserReward = IDL.Record({
      'id' : IDL.Text,
      'status' : RewardStatus,
      'claimed_at' : IDL.Opt(IDL.Nat64),
      'contest_id' : IDL.Text,
      'rank' : IDL.Nat32,
      'created_at' : IDL.Nat64,
      'user_id' : IDL.Principal,
      'amount' : IDL.Nat64,
    });
    const UserRewardResponse = IDL.Record({
      'data' : IDL.Opt(UserReward),
      'error' : IDL.Opt(IDL.Text),
      'success' : IDL.Bool,
    });
    const ContestType = IDL.Variant({
      'MultiPlayer' : IDL.Null,
      'Guaranteed' : IDL.Null,
      'HeadToHead' : IDL.Null,
      'WinnerTakesAll' : IDL.Null,
    });
    const ContestStatus = IDL.Variant({
      'Full' : IDL.Null,
      'Live' : IDL.Null,
      'Open' : IDL.Null,
      'Cancelled' : IDL.Null,
      'Completed' : IDL.Null,
    });
    const Contest = IDL.Record({
      'id' : IDL.Text,
      'status' : ContestStatus,
      'total_spots' : IDL.Nat32,
      'contest_type' : ContestType,
      'entry_fee' : IDL.Nat64,
      'name' : IDL.Text,
      'created_at' : IDL.Nat64,
      'filled_spots' : IDL.Nat32,
      'start_time' : IDL.Nat64,
      'prize_pool' : IDL.Nat64,
      'match_id' : IDL.Text,
    });
    const ContestResponse = IDL.Record({
      'data' : IDL.Opt(Contest),
      'error' : IDL.Opt(IDL.Text),
      'success' : IDL.Bool,
    });
    const FantasyTeam = IDL.Record({
      'id' : IDL.Text,
      'total_points' : IDL.Float64,
      'name' : IDL.Text,
      'total_price' : IDL.Nat64,
      'players' : IDL.Vec(IDL.Text),
      'captain_id' : IDL.Text,
      'vice_captain_id' : IDL.Text,
    });
    const FantasyTeamResponse = IDL.Record({
      'data' : IDL.Opt(FantasyTeam),
      'error' : IDL.Opt(IDL.Text),
      'success' : IDL.Bool,
    });
    const MatchResponse = IDL.Record({
      'data' : IDL.Opt(Match),
      'error' : IDL.Opt(IDL.Text),
      'success' : IDL.Bool,
    });
    const NotificationType = IDL.Variant({
      'ContestReminder' : IDL.Null,
      'SystemUpdate' : IDL.Null,
      'ContestResult' : IDL.Null,
      'PrizeWon' : IDL.Null,
    });
    const Notification = IDL.Record({
      'id' : IDL.Text,
      'title' : IDL.Text,
      'read' : IDL.Bool,
      'created_at' : IDL.Nat64,
      'user_id' : IDL.Principal,
      'notification_type' : NotificationType,
      'message' : IDL.Text,
    });
    const NotificationResponse = IDL.Record({
      'data' : IDL.Opt(Notification),
      'error' : IDL.Opt(IDL.Text),
      'success' : IDL.Bool,
    });
    const PlayerResponse = IDL.Record({
      'data' : IDL.Opt(Player),
      'error' : IDL.Opt(IDL.Text),
      'success' : IDL.Bool,
    });
    const PrizeDistribution = IDL.Record({
      'rank' : IDL.Nat32,
      'amount' : IDL.Nat64,
      'percentage' : IDL.Float64,
    });
    const PrizePool = IDL.Record({
      'distributed' : IDL.Bool,
      'total_amount' : IDL.Nat64,
      'contest_id' : IDL.Text,
      'distribution' : IDL.Vec(PrizeDistribution),
    });
    const PrizePoolResponse = IDL.Record({
      'data' : IDL.Opt(PrizePool),
      'error' : IDL.Opt(IDL.Text),
      'success' : IDL.Bool,
    });
    const TeamResponse = IDL.Record({
      'data' : IDL.Opt(Team),
      'error' : IDL.Opt(IDL.Text),
      'success' : IDL.Bool,
    });
    const UserRewardsResponse = IDL.Record({
      'data' : IDL.Opt(IDL.Vec(UserReward)),
      'error' : IDL.Opt(IDL.Text),
      'success' : IDL.Bool,
    });
    const ContestEntry = IDL.Record({
      'id' : IDL.Text,
      'contest_id' : IDL.Text,
      'rank' : IDL.Opt(IDL.Nat32),
      'team' : FantasyTeam,
      'created_at' : IDL.Nat64,
      'user_id' : IDL.Principal,
      'prize' : IDL.Opt(IDL.Nat64),
      'points' : IDL.Float64,
    });
    const ContestEntriesResponse = IDL.Record({
      'data' : IDL.Opt(IDL.Vec(ContestEntry)),
      'error' : IDL.Opt(IDL.Text),
      'success' : IDL.Bool,
    });
    const PlayerStats = IDL.Record({
      'stumpings' : IDL.Opt(IDL.Nat32),
      'steals' : IDL.Opt(IDL.Nat32),
      'economy' : IDL.Opt(IDL.Float64),
      'maidens' : IDL.Opt(IDL.Nat32),
      'overs' : IDL.Opt(IDL.Float64),
      'assists' : IDL.Opt(IDL.Nat32),
      'rebounds' : IDL.Opt(IDL.Nat32),
      'runs' : IDL.Opt(IDL.Nat32),
      'yellow_cards' : IDL.Opt(IDL.Nat32),
      'turnovers' : IDL.Opt(IDL.Nat32),
      'run_outs' : IDL.Opt(IDL.Nat32),
      'saves' : IDL.Opt(IDL.Nat32),
      'wickets' : IDL.Opt(IDL.Nat32),
      'goals' : IDL.Opt(IDL.Nat32),
      'blocks' : IDL.Opt(IDL.Nat32),
      'clean_sheets' : IDL.Opt(IDL.Nat32),
      'catches' : IDL.Opt(IDL.Nat32),
      'points' : IDL.Opt(IDL.Nat32),
      'red_cards' : IDL.Opt(IDL.Nat32),
    });
    const PlayerScore = IDL.Record({
      'player_id' : IDL.Text,
      'updated_at' : IDL.Nat64,
      'stats' : PlayerStats,
      'match_id' : IDL.Text,
      'points' : IDL.Float64,
    });
    const MatchScoreResponse = IDL.Record({
      'data' : IDL.Opt(MatchScore),
      'error' : IDL.Opt(IDL.Text),
      'success' : IDL.Bool,
    });
    const PlayerScoreResponse = IDL.Record({
      'data' : IDL.Opt(PlayerScore),
      'error' : IDL.Opt(IDL.Text),
      'success' : IDL.Bool,
    });
    const TeamsResponse = IDL.Record({
      'data' : IDL.Opt(IDL.Vec(Team)),
      'error' : IDL.Opt(IDL.Text),
      'success' : IDL.Bool,
    });
    const FantasyTeamsResponse = IDL.Record({
      'data' : IDL.Opt(IDL.Vec(FantasyTeam)),
      'error' : IDL.Opt(IDL.Text),
      'success' : IDL.Bool,
    });
    const NotificationsResponse = IDL.Record({
      'data' : IDL.Opt(IDL.Vec(Notification)),
      'error' : IDL.Opt(IDL.Text),
      'success' : IDL.Bool,
    });
    const TransactionStatus = IDL.Variant({
      'Failed' : IDL.Null,
      'Cancelled' : IDL.Null,
      'Completed' : IDL.Null,
      'Pending' : IDL.Null,
    });
    const TransactionType = IDL.Variant({
      'ContestWin' : IDL.Null,
      'Deposit' : IDL.Null,
      'Bonus' : IDL.Null,
      'Withdrawal' : IDL.Null,
      'ContestEntry' : IDL.Null,
    });
    const RewardTransaction = IDL.Record({
      'id' : IDL.Text,
      'status' : TransactionStatus,
      'transaction_type' : TransactionType,
      'created_at' : IDL.Nat64,
      'user_id' : IDL.Principal,
      'completed_at' : IDL.Opt(IDL.Nat64),
      'amount' : IDL.Nat64,
    });
    const RewardTransactionsResponse = IDL.Record({
      'data' : IDL.Opt(IDL.Vec(RewardTransaction)),
      'error' : IDL.Opt(IDL.Text),
      'success' : IDL.Bool,
    });
    const ContestEntryResponse = IDL.Record({
      'data' : IDL.Opt(ContestEntry),
      'error' : IDL.Opt(IDL.Text),
      'success' : IDL.Bool,
    });
    return IDL.Service({
      'add_balance' : IDL.Func(
          [IDL.Principal, IDL.Nat64],
          [UserProfileResponse],
          [],
        ),
      'add_scoring_rule' : IDL.Func(
          [Sport, IDL.Text, IDL.Float64],
          [ScoringRuleResponse],
          [],
        ),
      'add_team_to_tournament' : IDL.Func(
          [IDL.Text, Team],
          [TournamentResponse],
          [],
        ),
      'calculate_fantasy_team_points' : IDL.Func(
          [IDL.Vec(IDL.Text), IDL.Text, IDL.Text, IDL.Text],
          [IDL.Float64],
          ['query'],
        ),
      'claim_reward' : IDL.Func([IDL.Text], [UserRewardResponse], []),
      'create_bonus_reward' : IDL.Func(
          [IDL.Principal, IDL.Nat64, IDL.Text],
          [UserRewardResponse],
          [],
        ),
      'create_contest' : IDL.Func(
          [
            IDL.Text,
            IDL.Text,
            IDL.Nat64,
            IDL.Nat32,
            IDL.Nat64,
            ContestType,
            IDL.Nat64,
          ],
          [ContestResponse],
          [],
        ),
      'create_fantasy_team' : IDL.Func(
          [IDL.Text, IDL.Text, IDL.Text, IDL.Vec(IDL.Text)],
          [FantasyTeamResponse],
          [],
        ),
      'create_match' : IDL.Func(
          [IDL.Text, IDL.Text, IDL.Text, IDL.Nat64],
          [MatchResponse],
          [],
        ),
      'create_notification' : IDL.Func(
          [IDL.Principal, IDL.Text, IDL.Text, NotificationType],
          [NotificationResponse],
          [],
        ),
      'create_player' : IDL.Func(
          [IDL.Text, IDL.Text, PlayerPosition, IDL.Nat64],
          [PlayerResponse],
          [],
        ),
      'create_prize_pool' : IDL.Func(
          [IDL.Text, IDL.Nat64, IDL.Vec(PrizeDistribution)],
          [PrizePoolResponse],
          [],
        ),
      'create_team' : IDL.Func([IDL.Text, IDL.Text], [TeamResponse], []),
      'create_tournament' : IDL.Func(
          [IDL.Text, Sport, IDL.Nat64, IDL.Nat64],
          [TournamentResponse],
          [],
        ),
      'deduct_balance' : IDL.Func(
          [IDL.Principal, IDL.Nat64],
          [UserProfileResponse],
          [],
        ),
      'distribute_contest_rewards' : IDL.Func(
          [IDL.Text, IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat32, IDL.Nat64))],
          [UserRewardsResponse],
          [],
        ),
      'finalize_contest' : IDL.Func([IDL.Text], [ContestEntriesResponse], []),
      'get_all_player_scores' : IDL.Func([], [IDL.Vec(PlayerScore)], ['query']),
      'get_all_players' : IDL.Func([], [IDL.Vec(Player)], ['query']),
      'get_all_teams' : IDL.Func([], [IDL.Vec(Team)], ['query']),
      'get_all_tournaments' : IDL.Func([], [IDL.Vec(Tournament)], ['query']),
      'get_all_users' : IDL.Func([], [IDL.Vec(UserProfile)], ['query']),
      'get_contest' : IDL.Func([IDL.Text], [ContestResponse], []),
      'get_contest_count' : IDL.Func([], [IDL.Nat64], ['query']),
      'get_contest_entries' : IDL.Func(
          [IDL.Text],
          [IDL.Vec(ContestEntry)],
          ['query'],
        ),
      'get_contests_by_match' : IDL.Func(
          [IDL.Text],
          [IDL.Vec(Contest)],
          ['query'],
        ),
      'get_entry_count' : IDL.Func([], [IDL.Nat64], ['query']),
      'get_fantasy_team' : IDL.Func([IDL.Text], [FantasyTeamResponse], []),
      'get_live_matches' : IDL.Func([], [IDL.Vec(Match)], ['query']),
      'get_live_tournaments' : IDL.Func([], [IDL.Vec(Tournament)], ['query']),
      'get_match' : IDL.Func([IDL.Text], [MatchResponse], []),
      'get_match_count' : IDL.Func([], [IDL.Nat64], ['query']),
      'get_match_score' : IDL.Func([IDL.Text], [MatchScoreResponse], []),
      'get_match_scores' : IDL.Func(
          [IDL.Text],
          [IDL.Vec(PlayerScore)],
          ['query'],
        ),
      'get_matches_by_tournament' : IDL.Func(
          [IDL.Text],
          [IDL.Vec(Match)],
          ['query'],
        ),
      'get_open_contests' : IDL.Func([], [IDL.Vec(Contest)], ['query']),
      'get_pending_rewards' : IDL.Func(
          [IDL.Opt(IDL.Principal)],
          [UserRewardsResponse],
          [],
        ),
      'get_player' : IDL.Func([IDL.Text], [PlayerResponse], []),
      'get_player_score' : IDL.Func(
          [IDL.Text, IDL.Text],
          [PlayerScoreResponse],
          [],
        ),
      'get_players_by_position' : IDL.Func(
          [PlayerPosition],
          [IDL.Vec(Player)],
          ['query'],
        ),
      'get_players_by_team' : IDL.Func([IDL.Text], [IDL.Vec(Player)], ['query']),
      'get_prize_pool' : IDL.Func([IDL.Text], [PrizePoolResponse], []),
      'get_reward_count' : IDL.Func([], [IDL.Nat64], ['query']),
      'get_score_count' : IDL.Func([], [IDL.Nat64], ['query']),
      'get_scoring_rules' : IDL.Func([Sport], [IDL.Vec(ScoringRule)], ['query']),
      'get_team' : IDL.Func([IDL.Text], [TeamResponse], []),
      'get_total_rewards_distributed' : IDL.Func([], [IDL.Nat64], ['query']),
      'get_tournament' : IDL.Func([IDL.Text], [TournamentResponse], []),
      'get_tournament_count' : IDL.Func([], [IDL.Nat64], ['query']),
      'get_tournament_teams' : IDL.Func([IDL.Text], [TeamsResponse], []),
      'get_tournaments_by_sport' : IDL.Func(
          [Sport],
          [IDL.Vec(Tournament)],
          ['query'],
        ),
      'get_transaction_count' : IDL.Func([], [IDL.Nat64], ['query']),
      'get_upcoming_matches' : IDL.Func([], [IDL.Vec(Match)], ['query']),
      'get_user_contest_entries' : IDL.Func(
          [IDL.Opt(IDL.Principal)],
          [ContestEntriesResponse],
          [],
        ),
      'get_user_count' : IDL.Func([], [IDL.Nat64], ['query']),
      'get_user_fantasy_teams' : IDL.Func(
          [IDL.Opt(IDL.Principal)],
          [FantasyTeamsResponse],
          [],
        ),
      'get_user_notifications' : IDL.Func(
          [IDL.Opt(IDL.Principal)],
          [NotificationsResponse],
          [],
        ),
      'get_user_profile' : IDL.Func(
          [IDL.Opt(IDL.Principal)],
          [UserProfileResponse],
          [],
        ),
      'get_user_rewards' : IDL.Func(
          [IDL.Opt(IDL.Principal)],
          [UserRewardsResponse],
          [],
        ),
      'get_user_transactions' : IDL.Func(
          [IDL.Opt(IDL.Principal)],
          [RewardTransactionsResponse],
          [],
        ),
      'init' : IDL.Func([], [], []),
      'join_contest' : IDL.Func([IDL.Text, IDL.Text], [ContestEntryResponse], []),
      'mark_notification_read' : IDL.Func([IDL.Text], [NotificationResponse], []),
      'register_user' : IDL.Func(
          [IDL.Text, IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
          [UserProfileResponse],
          [],
        ),
      'update_contest_status' : IDL.Func(
          [IDL.Text, ContestStatus],
          [ContestResponse],
          [],
        ),
      'update_entry_points' : IDL.Func(
          [IDL.Text, IDL.Float64],
          [ContestEntryResponse],
          [],
        ),
      'update_kyc_status' : IDL.Func(
          [IDL.Principal, KYCStatus],
          [UserProfileResponse],
          [],
        ),
      'update_match_score' : IDL.Func(
          [IDL.Text, MatchScore],
          [MatchResponse],
          [],
        ),
      'update_match_score_data' : IDL.Func(
          [IDL.Text, MatchScore],
          [MatchScoreResponse],
          [],
        ),
      'update_match_status' : IDL.Func(
          [IDL.Text, MatchStatus],
          [MatchResponse],
          [],
        ),
      'update_player_playing_status' : IDL.Func(
          [IDL.Text, IDL.Bool],
          [PlayerResponse],
          [],
        ),
      'update_player_points' : IDL.Func(
          [IDL.Text, IDL.Float64],
          [PlayerResponse],
          [],
        ),
      'update_player_score' : IDL.Func(
          [IDL.Text, IDL.Text, PlayerStats],
          [PlayerScoreResponse],
          [],
        ),
      'update_tournament_status' : IDL.Func(
          [IDL.Text, TournamentStatus],
          [TournamentResponse],
          [],
        ),
      'update_user_profile' : IDL.Func(
          [IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
          [UserProfileResponse],
          [],
        ),
    });
  };
  export const init = ({ IDL }) => { return []; };