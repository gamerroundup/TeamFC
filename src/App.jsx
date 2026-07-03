import React, { useState, useEffect, useRef } from 'react';
import { getSupabaseClient } from './supabase';

// --- Playbook Data ---
const PLAYBOOK_POSITIONS = {
  1: {
    title: "1. Goalkeeper (GK)",
    description: "The last line of defense and first line of attack. Responsible for protecting the goal and distributing the ball.",
    attributes: ["Reflexes & Agility", "Shot Stopping", "Communication", "Ball Distribution"],
    coachingTip: "Encourage Goalkeepers to be loud and organize the defense. They have the best view of the entire pitch."
  },
  2: {
    title: "2. Right Fullback (RB)",
    description: "Defensive role on the right side of the pitch. Focuses on stopping opposition wingers and supporting midfield transitions.",
    attributes: ["Speed & Stamina", "Tackling", "Positional Awareness", "Crossing"],
    coachingTip: "Wingbacks should track back quickly to avoid leaving spaces behind. Encourage overlap runs when in possession."
  },
  3: {
    title: "3. Left Fullback (LB)",
    description: "Defensive role on the left side. Identical duties to the RB but operates on the left side of the field.",
    attributes: ["Left-footed Precision", "Defensive Discipline", "Stamina", "1v1 Defending"],
    coachingTip: "Ensure they force attackers wide towards the touchline, preventing them from cutting inside."
  },
  4: {
    title: "4. Center Back (CB)",
    description: "The heart of the defense. Protects the penalty box, tackles attackers, and headers away high balls.",
    attributes: ["Strength & Size", "Heading & Tackling", "Game Reading", "Leadership"],
    coachingTip: "Coaches should teach center backs to drop off when the opponent plays long balls to prevent quick breakaways."
  },
  5: {
    title: "5. Defending Midfielder (CDM)",
    description: "Sits right in front of the defense. Breaks up enemy attacks and makes simple transition passes.",
    attributes: ["Interceptions", "High Work Rate", "Short Passing", "Tactical Discipline"],
    coachingTip: "The #5 is the shield. They should maintain their central position and avoid getting pulled too far forward."
  },
  6: {
    title: "6. Central Midfielder (CM)",
    description: "The playmaker or distributor. Links defense and attack, maintaining team shape and possession.",
    attributes: ["Vision & Passing", "First Touch", "Spatial Awareness", "Decision Making"],
    coachingTip: "Teach midfielders to scan the field before receiving the ball so they know their next pass in advance."
  },
  7: {
    title: "7. Right Winger (RW)",
    description: "Attacker operating on the right touchline. Focuses on beating defenders, crossing, and making diagonal runs.",
    attributes: ["Dribbling & Pace", "Crossing Accuracy", "Off-the-ball Movement", "Finishing"],
    coachingTip: "A winger must stay wide to stretch the opponent's defense, creating space in the middle for strikers."
  },
  8: {
    title: "8. Box-to-Box Midfielder (CM)",
    description: "An energetic midfielder who supports both defending inside our box and attacking inside the opponent's box.",
    attributes: ["Stamina & Endurance", "Tackling", "Long Range Shooting", "Aerial Ability"],
    coachingTip: "This player needs high conditioning. Rotate them if they get tired to maintain midfield energy."
  },
  9: {
    title: "9. Striker / Center Forward (ST)",
    description: "The primary goal scorer. Stays high up the pitch, holds up the ball, and finishes chances.",
    attributes: ["Clinical Finishing", "Movement & Runs", "Hold-up Play", "Heading"],
    coachingTip: "Strikers must stay hungry. Teach them to follow up every shot for rebounds and make runs across defenders."
  },
  10: {
    title: "10. Attacking Midfielder (CAM)",
    description: "The creative engine. Operates between the opponent's midfield and defense lines to deliver key assists.",
    attributes: ["Creativity", "Key Passes", "Dribbling in tight spaces", "Finishing"],
    coachingTip: "The #10 should seek space in the 'pockets' between the opponent's defensive lines."
  },
  11: {
    title: "11. Left Winger (LW)",
    description: "Attacker operating on the left flank. Often cuts inside on their stronger right foot to shoot or create plays.",
    attributes: ["Dribbling & Acceleration", "Cutting Inside", "Crossing", "1v1 Dribbling"],
    coachingTip: "Encourage wingers to challenge defenders 1v1 in the final third. Taking risks here is allowed."
  }
};

// --- Tactical Board Formations (Positions in %) ---
const FORMATIONS = {
  "6v6": [
    { label: "GK", top: 85, left: 50 },
    { label: "CB", top: 60, left: 50 },
    { label: "LM", top: 40, left: 20 },
    { label: "RM", top: 40, left: 80 },
    { label: "CM", top: 35, left: 50 },
    { label: "ST", top: 15, left: 50 }
  ],
  "7v7": [
    { label: "GK", top: 85, left: 50 },
    { label: "LD", top: 65, left: 25 },
    { label: "RD", top: 65, left: 75 },
    { label: "CM", top: 40, left: 50 },
    { label: "LM", top: 30, left: 20 },
    { label: "RM", top: 30, left: 80 },
    { label: "ST", top: 15, left: 50 }
  ],
  "8v8": [
    { label: "GK", top: 88, left: 50 },
    { label: "LD", top: 68, left: 25 },
    { label: "CD", top: 72, left: 50 },
    { label: "RD", top: 68, left: 75 },
    { label: "LM", top: 40, left: 20 },
    { label: "RM", top: 40, left: 80 },
    { label: "AM", top: 35, left: 50 },
    { label: "ST", top: 15, left: 50 }
  ],
  "9v9": [
    { label: "GK", top: 88, left: 50 },
    { label: "LB", top: 68, left: 20 },
    { label: "CB", top: 72, left: 50 },
    { label: "RB", top: 68, left: 80 },
    { label: "LM", top: 45, left: 20 },
    { label: "CM", top: 45, left: 50 },
    { label: "RM", top: 45, left: 80 },
    { label: "ST1", top: 18, left: 35 },
    { label: "ST2", top: 18, left: 65 }
  ],
  "11v11": [
    { label: "GK", top: 90, left: 50 },
    { label: "LB", top: 70, left: 15 },
    { label: "LCB", top: 75, left: 38 },
    { label: "RCB", top: 75, left: 62 },
    { label: "RB", top: 70, left: 85 },
    { label: "CDM", top: 55, left: 50 },
    { label: "LM", top: 35, left: 15 },
    { label: "RM", top: 35, left: 85 },
    { label: "CAM", top: 30, left: 50 },
    { label: "ST1", top: 15, left: 38 },
    { label: "ST2", top: 15, left: 62 }
  ]
};

// --- PRE-DESIGNED TEAM BADGES ---
const BADGES = [
  { char: "⚽", name: "Classic Soccer" },
  { char: "⚡", name: "Lightning FC" },
  { char: "🔥", name: "Firestorm Rec" },
  { char: "🛡️", name: "Shield United" },
  { char: "🏆", name: "Victory Athletic" },
  { char: "🦅", name: "Golden Eagles" },
  { char: "🐺", name: "Timberwolves" },
  { char: "🌟", name: "All-Stars" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Modals state
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [showAddGameModal, setShowAddGameModal] = useState(false);
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showCalEventModal, setShowCalEventModal] = useState(false);
  const [showTeamSettingsModal, setShowTeamSettingsModal] = useState(false);

  // Database Connection Config
  const [dbUrl, setDbUrl] = useState('');
  const [dbAnonKey, setDbAnonKey] = useState('');
  const [dbStatus, setDbStatus] = useState('Local Sandbox Mode');

  // Core Data State
  const [teams, setTeams] = useState([]);
  const [currentTeamId, setCurrentTeamId] = useState('');
  const [roster, setRoster] = useState([]);
  const [games, setGames] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [savedDrills, setSavedDrills] = useState([]);

  // Active Team Customization State (renaming & badge selector)
  const [teamNameInput, setTeamNameInput] = useState('');
  const [teamBadgeInput, setTeamBadgeInput] = useState('⚽');

  // Form states
  const [createTeamName, setCreateTeamName] = useState('');
  const [createTeamKey, setCreateTeamKey] = useState('');
  const [joinTeamCode, setJoinTeamCode] = useState('');
  
  const [playerJersey, setPlayerJersey] = useState('');
  const [playerName, setPlayerName] = useState('');
  
  const [gameOpponent, setGameOpponent] = useState('');
  const [gameDate, setGameDate] = useState('');
  const [gameLocation, setGameLocation] = useState('');

  const [outcomeGameId, setOutcomeGameId] = useState('');
  const [outcomeOurScore, setOutcomeOurScore] = useState(0);
  const [outcomeOpponentScore, setOutcomeOpponentScore] = useState(0);
  const [goalScorer, setGoalScorer] = useState('');
  const [goalAssister, setGoalAssister] = useState('');
  const [goalEvents, setGoalEvents] = useState([]);

  const [calEventType, setCalEventType] = useState('practice');
  const [calEventTitle, setCalEventTitle] = useState('');
  const [calEventDate, setCalEventDate] = useState('');
  const [calEventLocation, setCalEventLocation] = useState('');

  // AI Practice Planner state
  const [aiFocus, setAiFocus] = useState('dribbling');
  const [aiAge, setAiAge] = useState('u10');
  const [aiFormat, setAiFormat] = useState('7v7');
  const [aiPlan, setAiPlan] = useState(null);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Playbook position navigation
  const [playbookPos, setPlaybookPos] = useState(9);

  // AI Coaching Assistant Q&A Chatbot state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiThinking, setAiThinking] = useState(false);

  // Timers State
  const [gameTime, setGameTime] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [sub1Time, setSub1Time] = useState(0);
  const [sub1Running, setSub1Running] = useState(false);
  const [sub2Time, setSub2Time] = useState(0);
  const [sub2Running, setSub2Running] = useState(false);

  // Tactical Board State
  const [tacticalFormat, setTacticalFormat] = useState('7v7');
  const [draggedElementId, setDraggedElementId] = useState(null);
  
  // Unified React state-based lineup coordinates (resolves old ghost duplicates during drag)
  const [tacticalLineup, setTacticalLineup] = useState([]);
  const [ballPosition, setBallPosition] = useState({ left: 50, top: 50 });

  const chatEndRef = useRef(null);
  const [chatSender, setChatSender] = useState('');
  const [chatText, setChatText] = useState('');

  // --- Load Initial Config & Data ---
  useEffect(() => {
    const savedConf = localStorage.getItem("teamfc_supabase_config");
    if (savedConf) {
      const parsed = JSON.parse(savedConf);
      setDbUrl(parsed.url || '');
      setDbAnonKey(parsed.anonKey || '');
    }
    loadTeams();
  }, []);

  // --- Re-initialize when supabase config or current team change ---
  useEffect(() => {
    if (currentTeamId) {
      loadTeamDetails(currentTeamId);
    }
  }, [currentTeamId, dbUrl, dbAnonKey]);

  // --- Setup Tactical Lineup based on current formation and roster ---
  useEffect(() => {
    const defaultCoords = FORMATIONS[tacticalFormat] || [];
    
    // Check if there are custom saved coordinates in localStorage
    const savedPositions = JSON.parse(localStorage.getItem(`teamfc_positions_${currentTeamId}`)) || {};

    const initialLineup = defaultCoords.map((coord, idx) => {
      const player = roster[idx] || null;
      const customPos = savedPositions[idx];
      return {
        idx,
        label: coord.label,
        left: customPos ? customPos.left : coord.left,
        top: customPos ? customPos.top : coord.top,
        player
      };
    });
    setTacticalLineup(initialLineup);
  }, [tacticalFormat, roster, currentTeamId]);

  // --- Scroll chat to bottom ---
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // --- Concurrently Running Timers (useEffect intervals) ---
  useEffect(() => {
    let interval = null;
    if (gameRunning) {
      interval = setInterval(() => {
        setGameTime(prev => {
          const next = prev + 100;
          const maxMs = 55 * 60 * 1000;
          if (next >= maxMs) {
            setGameRunning(false);
            return maxMs;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [gameRunning]);

  useEffect(() => {
    let interval = null;
    if (sub1Running) {
      interval = setInterval(() => {
        setSub1Time(prev => prev + 100);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [sub1Running]);

  useEffect(() => {
    let interval = null;
    if (sub2Running) {
      interval = setInterval(() => {
        setSub2Time(prev => prev + 100);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [sub2Running]);

  // --- Supabase Client Helper ---
  const client = getSupabaseClient(dbUrl, dbAnonKey);

  // --- Data loaders ---
  const loadTeams = async () => {
    if (client) {
      try {
        const { data, error } = await client.from('teams').select('*');
        if (error) throw error;
        setTeams(data || []);
        setDbStatus('Supabase Connected');
        if (data && data.length > 0) {
          const initialId = data[0].id;
          setCurrentTeamId(initialId);
          setTeamNameInput(data[0].name);
          setTeamBadgeInput(data[0].badge || '⚽');
        }
      } catch (err) {
        console.warn("Supabase loadTeams failed, using local sandbox", err);
        loadLocalTeams();
      }
    } else {
      loadLocalTeams();
    }
  };

  const loadLocalTeams = () => {
    const local = localStorage.getItem("teamfc_teams");
    let parsed = [];
    if (local) {
      parsed = JSON.parse(local);
    } else {
      parsed = [{ id: "mock-team-1", name: "Lightning Rec 7s", joinCode: "coach123", badge: "⚡" }];
      localStorage.setItem("teamfc_teams", JSON.stringify(parsed));
    }
    setTeams(parsed);
    setDbStatus('Local Sandbox Mode');
    if (parsed.length > 0) {
      setCurrentTeamId(parsed[0].id);
      setTeamNameInput(parsed[0].name);
      setTeamBadgeInput(parsed[0].badge || '⚽');
    }
  };

  const loadTeamDetails = async (teamId) => {
    const currentTeam = teams.find(t => t.id === teamId);
    if (currentTeam) {
      setTeamNameInput(currentTeam.name);
      setTeamBadgeInput(currentTeam.badge || '⚽');
    }

    if (client) {
      try {
        // Load roster
        const { data: rosterData } = await client.from('roster').select('*').eq('team_id', teamId);
        setRoster(rosterData || []);
        
        // Load games
        const { data: gamesData } = await client.from('games').select('*, game_events(*)').eq('team_id', teamId);
        setGames(gamesData || []);
        
        // Load chat
        const { data: chatData } = await client.from('chat_messages').select('*').eq('team_id', teamId).order('created_at', { ascending: true });
        setChatMessages(chatData || []);
      } catch (err) {
        console.error("Supabase loadTeamDetails error", err);
      }
    }

    // Always load local-only stores (calendar, drills)
    setCalendarEvents(JSON.parse(localStorage.getItem(`teamfc_cal_${teamId}`)) || []);
    setSavedDrills(JSON.parse(localStorage.getItem(`teamfc_drills_${teamId}`)) || []);
    
    // Load local roster/games fallback if not connected to supabase
    if (!client) {
      const fallbackRoster = JSON.parse(localStorage.getItem(`teamfc_roster_${teamId}`)) || [];
      if (fallbackRoster.length === 0 && teamId === "mock-team-1") {
        const defaultRoster = [
          { id: "p1", name: "Alex Morgan", jerseyNumber: 13 },
          { id: "p2", name: "Christian Pulisic", jerseyNumber: 10 },
          { id: "p3", name: "Weston McKennie", jerseyNumber: 8 },
          { id: "p4", name: "Tyler Adams", jerseyNumber: 4 },
          { id: "p5", name: "Antonee Robinson", jerseyNumber: 3 },
          { id: "p6", name: "Matt Turner", jerseyNumber: 1 },
          { id: "p7", name: "Folarin Balogun", jerseyNumber: 9 }
        ];
        localStorage.setItem(`teamfc_roster_${teamId}`, JSON.stringify(defaultRoster));
        setRoster(defaultRoster);
      } else {
        setRoster(fallbackRoster);
      }

      setGames(JSON.parse(localStorage.getItem(`teamfc_games_${teamId}`)) || []);
      setChatMessages(JSON.parse(localStorage.getItem(`teamfc_chat_${teamId}`)) || []);
    }
  };

  // --- Team Settings Change (Name & Photo Badge) ---
  const handleSaveTeamSettings = async () => {
    if (!teamNameInput) return;
    
    if (client) {
      try {
        await client.from('teams').update({ name: teamNameInput, badge: teamBadgeInput }).eq('id', currentTeamId);
        loadTeams();
      } catch (err) {
        alert(err.message);
      }
    } else {
      const nextTeams = teams.map(t => {
        if (t.id === currentTeamId) {
          return { ...t, name: teamNameInput, badge: teamBadgeInput };
        }
        return t;
      });
      setTeams(nextTeams);
      localStorage.setItem("teamfc_teams", JSON.stringify(nextTeams));
    }
    setShowTeamSettingsModal(false);
  };

  // --- Team Channel Methods ---
  const handleCreateTeam = async () => {
    if (!createTeamName || !createTeamKey) return;
    if (client) {
      try {
        const { data, error } = await client.from('teams').insert([{ name: createTeamName, join_code: createTeamKey, badge: '⚽' }]).select();
        if (error) throw error;
        setCreateTeamName('');
        setCreateTeamKey('');
        setShowTeamModal(false);
        loadTeams();
      } catch (e) {
        alert(e.message);
      }
    } else {
      const newTeam = { id: "local-" + Date.now(), name: createTeamName, joinCode: createTeamKey, badge: '⚽' };
      const nextTeams = [...teams, newTeam];
      setTeams(nextTeams);
      localStorage.setItem("teamfc_teams", JSON.stringify(nextTeams));
      setCurrentTeamId(newTeam.id);
      setCreateTeamName('');
      setCreateTeamKey('');
      setShowTeamModal(false);
    }
  };

  const handleJoinTeam = async () => {
    if (!joinTeamCode) return;
    if (client) {
      try {
        const { data, error } = await client.from('teams').select('*').eq('join_code', joinTeamCode).single();
        if (error || !data) {
          alert("Team channel code not found.");
          return;
        }
        setCurrentTeamId(data.id);
        setJoinTeamCode('');
        setShowTeamModal(false);
      } catch (e) {
        alert(e.message);
      }
    } else {
      const existing = teams.find(t => t.joinCode && t.joinCode.toLowerCase() === joinTeamCode.toLowerCase());
      if (existing) {
        setCurrentTeamId(existing.id);
        setJoinTeamCode('');
        setShowTeamModal(false);
      } else {
        alert("Local team code not found. Create it first!");
      }
    }
  };

  // --- Roster Methods ---
  const handleAddPlayer = async () => {
    if (!playerName || !playerJersey) return;
    if (roster.length >= 20) {
      alert("Maximum roster limit is 20 players.");
      return;
    }
    
    if (client) {
      try {
        const { error } = await client.from('roster').insert([{ team_id: currentTeamId, player_name: playerName, jersey_number: parseInt(playerJersey) }]);
        if (error) throw error;
        loadTeamDetails(currentTeamId);
      } catch (err) {
        alert(err.message);
      }
    } else {
      const updated = [...roster, { id: "p-" + Date.now(), name: playerName, jerseyNumber: parseInt(playerJersey) }];
      setRoster(updated);
      localStorage.setItem(`teamfc_roster_${currentTeamId}`, JSON.stringify(updated));
    }
    setPlayerName('');
    setPlayerJersey('');
  };

  const handleRemovePlayer = async (id) => {
    if (!confirm("Remove this player?")) return;
    if (client) {
      try {
        await client.from('roster').delete().eq('id', id);
        loadTeamDetails(currentTeamId);
      } catch (err) {
        alert(err.message);
      }
    } else {
      const updated = roster.filter(p => p.id !== id);
      setRoster(updated);
      localStorage.setItem(`teamfc_roster_${currentTeamId}`, JSON.stringify(updated));
    }
  };

  // --- Game schedule methods ---
  const handleAddGame = async () => {
    if (!gameOpponent || !gameDate) return;
    if (client) {
      try {
        await client.from('games').insert([{ team_id: currentTeamId, opponent: gameOpponent, game_date: gameDate, location: gameLocation }]);
        loadTeamDetails(currentTeamId);
      } catch (err) {
        alert(err.message);
      }
    } else {
      const updated = [...games, { id: "g-" + Date.now(), opponent: gameOpponent, game_date: gameDate, location: gameLocation, status: 'scheduled', our_score: 0, opponent_score: 0, game_events: [] }];
      setGames(updated);
      localStorage.setItem(`teamfc_games_${currentTeamId}`, JSON.stringify(updated));
    }
    setGameOpponent('');
    setGameDate('');
    setGameLocation('');
    setShowAddGameModal(false);
  };

  const handleAddGoalEvent = () => {
    if (!goalScorer) return;
    const scorer = roster.find(p => p.id === goalScorer);
    const assister = roster.find(p => p.id === goalAssister);
    
    setGoalEvents(prev => [...prev, {
      id: "evt-" + Date.now(),
      player_id: goalScorer,
      assister_id: goalAssister,
      scorer_name: scorer ? scorer.name : '',
      assister_name: assister ? assister.name : null
    }]);

    setOutcomeOurScore(prev => prev + 1);
  };

  const handleRemoveGoalEvent = (id) => {
    setGoalEvents(prev => prev.filter(e => e.id !== id));
    setOutcomeOurScore(prev => Math.max(0, prev - 1));
  };

  const handleSaveOutcome = async () => {
    if (client) {
      try {
        await client.from('games').update({ status: 'completed', our_score: outcomeOurScore, opponent_score: outcomeOpponentScore }).eq('id', outcomeGameId);
        
        const events = [];
        goalEvents.forEach(e => {
          events.push({ game_id: outcomeGameId, player_id: e.player_id, event_type: 'goal' });
          if (e.assister_id) {
            events.push({ game_id: outcomeGameId, player_id: e.assister_id, event_type: 'assist' });
          }
        });
        
        if (events.length > 0) {
          await client.from('game_events').insert(events);
        }
        loadTeamDetails(currentTeamId);
      } catch (err) {
        alert(err.message);
      }
    } else {
      const nextGames = games.map(g => {
        if (g.id === outcomeGameId) {
          const events = [];
          goalEvents.forEach(e => {
            events.push({ player_id: e.player_id, event_type: 'goal' });
            if (e.assister_id) {
              events.push({ player_id: e.assister_id, event_type: 'assist' });
            }
          });
          return { ...g, status: 'completed', our_score: outcomeOurScore, opponent_score: outcomeOpponentScore, game_events: events };
        }
        return g;
      });
      setGames(nextGames);
      localStorage.setItem(`teamfc_games_${currentTeamId}`, JSON.stringify(nextGames));
    }
    setShowOutcomeModal(false);
  };

  // --- Real-Time Chat ---
  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatSender || !chatText) return;
    
    if (client) {
      try {
        await client.from('chat_messages').insert([{ team_id: currentTeamId, sender_name: chatSender, message: chatText }]);
        loadTeamDetails(currentTeamId);
      } catch (err) {
        alert(err.message);
      }
    } else {
      const updated = [...chatMessages, { id: "msg-" + Date.now(), sender_name: chatSender, message: chatText, created_at: new Date().toISOString() }];
      setChatMessages(updated);
      localStorage.setItem(`teamfc_chat_${currentTeamId}`, JSON.stringify(updated));
    }
    setChatText('');
  };

  // --- Calendar Scheduler methods ---
  const handleSaveCalendarEvent = async () => {
    if (!calEventTitle || !calEventDate) return;
    
    const newEvent = {
      id: "cal-" + Date.now(),
      type: calEventType,
      title: calEventTitle,
      date: calEventDate,
      location: calEventLocation
    };
    
    const updated = [...calendarEvents, newEvent];
    setCalendarEvents(updated);
    localStorage.setItem(`teamfc_cal_${currentTeamId}`, JSON.stringify(updated));
    
    if (calEventType === 'game') {
      if (client) {
        try {
          await client.from('games').insert([{
            team_id: currentTeamId,
            opponent: calEventTitle.replace(/^vs\s+/i, ""),
            game_date: calEventDate,
            location: calEventLocation
          }]);
          loadTeamDetails(currentTeamId);
        } catch (err) {
          console.error(err);
        }
      } else {
        const nextGames = [...games, {
          id: "game-" + Date.now(),
          opponent: calEventTitle.replace(/^vs\s+/i, ""),
          game_date: calEventDate,
          location: calEventLocation,
          status: 'scheduled',
          our_score: 0,
          opponent_score: 0,
          game_events: []
        }];
        setGames(nextGames);
        localStorage.setItem(`teamfc_games_${currentTeamId}`, JSON.stringify(nextGames));
      }
    }
    
    setCalEventTitle('');
    setCalEventDate('');
    setCalEventLocation('');
    setShowCalEventModal(false);
  };

  // --- DYNAMIC AI PRACTICE PLAN GENERATOR (Ensures Fresh Drills Every Click) ---
  const handleGenerateAI = () => {
    setAiGenerating(true);
    
    setTimeout(() => {
      // Dynamic arrays containing rich, varied coaching content
      const warmups = [
        "Gate Dribbling: Set up multiple small gates around the grid. Players dribble through as many gates as possible in 1 minute. Focus on small touches, using different parts of the foot.",
        "Dynamic Shuttle Weaves: Grid 15x15. Players jog in rows, sprinting forward 5 yards when clapped, changing direction on whistles, with dynamic side-steps and high-knees.",
        "Tag Defense Shadowing: Attackers dribble within a tight circle trying to shield the ball while defenders try to stay within arm's reach without tackling. 45-second intervals.",
        "Precision Box Warmup: 4 corners. Players pass diagonally, then sprint to the next corner. Stresses timing of runs, first-touch orientation, and communication."
      ];

      const drills1 = {
        dribbling: [
          "Red Light, Green Light: Promotes head-up dribbling. Coach holds up cones (green = fast, red = stop, yellow = dragbacks). Players must react instantly while maintaining ball control.",
          "Island Escape: Attackers dribble in a shared grid. Defenders try to kick their balls out. Stresses shielding, turning in tight spaces, and burst acceleration.",
          "1v1 Dual Gates: Attackers face defender centrally. Attacker must drop shoulder to sell a feint and escape through one of two side gates."
        ],
        passing: [
          "3v1 Keep Away (Rondo): Players in a grid pass to keep the ball from the defender in the center. Quick 1-2 touch passing, moving to support angles.",
          "Give-and-Go Channels: Midfielders combine with wingers. Fullback passes to winger, runs forward to receive pass back down the line, crossing into target zones.",
          "Switch Play Box: Teams of 3 pass across a divided grid. Must make 3 passes before playing a long driven pass to the opposite grid side."
        ],
        shooting: [
          "Turn & Shoot: Coach passes to player who has their back to goal. Player must turn with first touch and fire a shot into the corners.",
          "Double Target Crosses: Two wingers run down flanks. Striker makes near-post run, midfielder makes far-post run. Wingers cross for quick first-touch finishes.",
          "Rapid-Fire Rebounds: Attacker dribbles, shoots from 15 yards, then immediately spins to receive a second ball thrown by coach for a volley finish."
        ],
        defense: [
          "1v1 Defending (Pressure & Cover): Defender passes to attacker, then sprints to close down space. Focus on speed of approach, deceleration, and side-on stance.",
          "Staggered Cover Pairs: 2v2 defending. First defender pressures the ball. Second defender drops deeper at a 45-degree angle to cover passing lanes.",
          "Goal Line Stand: Attackers have 10 seconds to score from a 1v1 starting 15 yards out. Defender focuses on body orientation and delaying the attacker."
        ],
        tactics: [
          "Position Grid Shadowing: Players move in formation, maintaining spacing as coach walks to different parts of the field.",
          "Overlapping Overload: 3v2 transition play. Fullback overlaps midfielder to create a crossing opportunity, stressing decision-making under pressure.",
          "Building Out of Pressure: GK distributes to wide backs. Midfielder drops to form passing triangles to play past 2 chasing forward forecheckers."
        ],
        fitness: [
          "SAQ Circuit (Speed, Agility, Quickness): Speed ladder, cone weave, hurdle hops, followed by a short sprint to receive a pass.",
          "Dribble Shuttle Relays: Teams sprint-dribble to 5, 10, and 15-yard cones, performing turnbacks at each, passing back to teammate.",
          "Endurance Keep-Away: High-intensity 4v4 in small grid with no rest. Stresses soccer endurance and passing under maximum fatigue."
        ]
      };

      const drills2 = {
        dribbling: [
          "1v1 to Endlines: Small-sided 10x15 yard grid. Attackers try to dribble past a defender to cross the endline under control. Stresses agility and body feints.",
          "4-Corner Dribble Escape: 4 teams in corners. On whistle, center is filled with target cones. Players sprint to steal cones and dribble back under control."
        ],
        passing: [
          "Through Gate Passing Game: Set up random gates. Players earn points by successfully passing through a gate to a teammate running on the other side.",
          "Target Man Rondo: 4v4 with 2 neutral target players on endlines. Must pass through midfield grid to find targets for points."
        ],
        shooting: [
          "2v1 Crossing & Finishing: Two attackers run down the wing, cross to a target striker while one defender tries to clear.",
          "Scrimmage with Double-Point Targets: Small scrimmage. Goals scored from first-touch finishes or outside the box count double."
        ],
        defense: [
          "Delay the Attack: Defender blocks central channel, forcing attacker wide and waiting for recovery run support.",
          "4v4 Defending Zones: Scrimmage where defenders must stay in their assigned defensive zones, passing attackers off to teammates."
        ],
        tactics: [
          "Winger Overlaps: Tactical scenario focusing on fullback overlapping the winger to create crossing opportunities.",
          "Half-Field Match Play: 7v7 scrimmage focusing on building attacks starting from wide channels and switching play."
        ],
        fitness: [
          "Shuttle Run Relays: Competitiveness shuttle runs where teams race to retrieve balls and dribble them back.",
          "Interval Sprint Scrimmage: Scrimmage where on whistles, all players must sprint to touch their own endline before returning to active play."
        ]
      };

      const points = {
        dribbling: [
          "Keep the ball close (shielding). Keep eyes up to see defenders/space. Drop shoulder to sell feints.",
          "Soft touches with laces when running, use inside/outside of foot for quick cuts. Accelerate after turn."
        ],
        passing: [
          "Locked ankle, toe pointed out when passing. Positive first touch out of feet. Communicate early.",
          "Open body stance to receive. Pass to teammate's dominant foot. Keep passes crisp and on the floor."
        ],
        shooting: [
          "Plant non-kicking foot next to ball. Keep chest and knee over the ball. Strike with laces, follow through.",
          "Look up to spot the GK positioning, then pick a corner. Keep shots low to make saves harder."
        ],
        defense: [
          "Slightly bent knees, low center of gravity. Stand side-on, do not dive in. Wait for attacker to make a heavy touch.",
          "Apply pressure quickly but slow down 2 steps before the ball. Angle your body to force them to their weak foot."
        ],
        tactics: [
          "Maintain distance and team shape. Know your numbered role (1-11). Communicate transitions.",
          "Create passing triangles. Wide players must stretch the field. Midfielders must act as the pivot option."
        ],
        fitness: [
          "High intensity effort. Correct posture in deceleration. Pump arms during sprints.",
          "Stay light on your feet during agility ladder drills. Breathe deeply and focus on rapid acceleration bursts."
        ]
      };

      // Randomly select items to compile a completely fresh practice plan!
      const randomWarmup = warmups[Math.floor(Math.random() * warmups.length)];
      const focusDrills1 = drills1[aiFocus] || drills1.dribbling;
      const randomDrill1 = focusDrills1[Math.floor(Math.random() * focusDrills1.length)];
      
      const focusDrills2 = drills2[aiFocus] || drills2.dribbling;
      const randomDrill2 = focusDrills2[Math.floor(Math.random() * focusDrills2.length)];
      
      const focusPoints = points[aiFocus] || points.dribbling;
      const randomPoints = focusPoints[Math.floor(Math.random() * focusPoints.length)];

      setAiPlan({
        warmup: randomWarmup,
        drill1: randomDrill1,
        drill2: randomDrill2,
        points: randomPoints
      });
      setAiGenerating(false);
    }, 500);
  };

  // --- AI COACHING Q&A BOT ASSISTANT ---
  const handleAskAICoach = (e) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    setAiThinking(true);
    setAiAnswer('');

    // Precompiled intelligent rule & tactics resolver
    setTimeout(() => {
      const q = aiQuestion.toLowerCase();
      let ans = "";

      if (q.includes("offsides") || q.includes("offside")) {
        ans = "**Offside Rule Explanation:**\n\nA player is in an *offside position* if they are nearer to the opponent's goal line than both the ball and the second-last opponent (usually the last defender excluding the GK) when the ball is played to them.\n\n**Key Coaching Pointers:**\n1. **Active Play:** Simply being in an offside position is not an offense. They must be involved in active play (interfering with play, interfering with an opponent, or gaining an advantage).\n2. **Pass Release Time:** The offside position is judged at the exact moment the ball is passed by a teammate, *not* when the player receives the ball.\n3. **Exceptions:** A player cannot be offside directly from a throw-in, goal kick, or corner kick.";
      } else if (q.includes("formation") || q.includes("6v6") || q.includes("7v7") || q.includes("9v9") || q.includes("11v11")) {
        ans = "**Youth Soccer Formations Guide:**\n\n- **6v6 / 7v7 (U8-U10):** The **2-3-1** (2 Defenders, 3 Midfielders, 1 Striker) is highly recommended. It teaches natural passing triangles and supports transitioning into attack.\n- **9v9 (U12):** The **3-2-3** or **4-3-1** are excellent. They build defensive solidarity and teach wingers how to track back.\n- **11v11 (U14+):** The **4-3-3** (wide attack) or **4-4-2** (flat defense) are global standards.\n\n*Tip:* In rec youth soccer, prioritize player rotation over winning matches so everyone learns both attacking and defensive principles!";
      } else if (q.includes("striker") || q.includes("number 9") || q.includes("forward")) {
        ans = "**How to Coach a Good Striker (#9):**\n\nStrikers are your primary goal scorers. They need:\n1. **Movement:** Making diagonal runs behind defenders to catch long balls.\n2. **Hold-up Play:** Receiving the ball with back to goal, shielding it, and laying it off to charging midfielders.\n3. **Hunger:** Following up every shot for rebounds. Most youth goals come from simple goalie deflections.";
      } else if (q.includes("winger") || q.includes("number 7") || q.includes("number 11")) {
        ans = "**How to Coach a Good Winger (#7 / #11):**\n\nWingers play on the sidelines. Teach them to:\n1. **Hug the Line:** Stay wide to pull defenders apart, creating space in the center.\n2. **1v1 Confidence:** Challenge defenders using speed or feints in the final third.\n3. **Crosses:** Deliver balls into the box, aiming for the penalty spot rather than directly at the keeper.";
      } else if (q.includes("sub") || q.includes("substitution") || q.includes("rotation")) {
        ans = "** substitution & Rotation Systems:**\n\n- In Rec leagues, ensure every player gets at least **50% of the game time**.\n- Use the **3-Timer Dashboard** to track substitution shifts (usually rotating lines every 6-8 minutes).\n- Keep substitution lines consistent so players learn how to play alongside specific teammates.";
      } else {
        ans = `**Team FC AI Coach Response:**\n\nThat is an excellent coaching inquiry regarding "${aiQuestion}". For recreational youth soccer, here are three actionable recommendations:\n\n1. **Keep it Fun & Active:** Minimize speeches. Let the players play. Use small-sided scrimmage games (3v3 or 4v4) to maximize ball touches.\n2. **Spacing Principles:** Teach players to "spread out like an accordion" when we have the ball, and "close up like a fist" when defending.\n3. **Positive Reinforcement:** Focus coaching pointers on what to do right next time rather than highlighting errors. Celebrate effort and work rate over outcomes!`;
      }

      setAiAnswer(ans);
      setAiThinking(false);
    }, 800);
  };

  // --- Tactical Board Coordinate Updates (Drag & Touch) ---
  const handleDragStartReact = (e, indexOrId) => {
    e.dataTransfer.setData("text/plain", indexOrId);
    setDraggedElementId(indexOrId);
  };

  const handleDropReact = (e) => {
    e.preventDefault();
    const id = draggedElementId;
    if (id === null) return;
    
    const field = document.getElementById("tacticalSoccerField");
    const rect = field.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    updateCoordinateReact(id, x, y);
  };

  const handleTouchMoveReact = (e, indexOrId) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    
    const field = document.getElementById("tacticalSoccerField");
    const rect = field.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    
    updateCoordinateReact(indexOrId, x, y);
    
    // Prevent document scrolling during drag
    e.preventDefault();
  };

  const updateCoordinateReact = (id, x, y) => {
    const boundedX = Math.max(3, Math.min(97, x));
    const boundedY = Math.max(3, Math.min(97, y));

    if (id === "ball") {
      setBallPosition({ left: boundedX, top: boundedY });
    } else {
      const idx = parseInt(id);
      const nextLineup = tacticalLineup.map(item => {
        if (item.idx === idx) {
          return { ...item, left: boundedX, top: boundedY };
        }
        return item;
      });
      setTacticalLineup(nextLineup);
      
      // Save coordinates to customPositions state and local storage
      const nextCustom = { ...customPositions, [idx]: { left: boundedX, top: boundedY } };
      setCustomPositions(nextCustom);
      localStorage.setItem(`teamfc_positions_${currentTeamId}`, JSON.stringify(nextCustom));
    }
  };

  // --- Scoreboard calculations ---
  const wCount = games.filter(g => g.status === 'completed' && g.our_score > g.opponent_score).length;
  const dCount = games.filter(g => g.status === 'completed' && g.our_score === g.opponent_score).length;
  const lCount = games.filter(g => g.status === 'completed' && g.our_score < g.opponent_score).length;

  const rosterStats = roster.map(p => {
    let goals = 0;
    let assists = 0;
    games.forEach(g => {
      if (g.game_events) {
        g.game_events.forEach(e => {
          if (e.player_id === p.id) {
            if (e.event_type === 'goal') goals++;
            if (e.event_type === 'assist') assists++;
          }
        });
      }
    });
    return { ...p, goals, assists, points: goals + assists };
  });

  // --- Helper formatting ---
  const formatTime = (ms) => {
    const totalSecs = Math.floor(ms / 1000);
    const mins = String(Math.floor(totalSecs / 60)).padStart(2, '0');
    const secs = String(totalSecs % 60).padStart(2, '0');
    const tenths = Math.floor((ms % 1000) / 100);
    return `${mins}:${secs}.${tenths}`;
  };

  // Rolling calendar items
  const calendarDays = [];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    calendarDays.push(d);
  }

  const activeTeamBadge = teams.find(t => t.id === currentTeamId)?.badge || '⚽';

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 flex flex-col">
      {/* Header bar */}
      <header className="glass-panel border-b border-white/10 sticky top-0 z-50 px-4 py-3 mx-4 mt-4 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-emerald-500 to-indigo-500 p-2.5 rounded-xl shadow-lg shadow-emerald-500/10 flex items-center justify-center w-11 h-11 text-xl">
            <span>{activeTeamBadge}</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent font-heading">
              {teams.find(t => t.id === currentTeamId)?.name || 'Team FC'}
            </h1>
            <p className="text-[9px] text-slate-400 font-medium tracking-wider uppercase">AI Youth Soccer Coach</p>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-white/5">
          <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'dashboard' ? 'text-emerald-400 bg-white/5' : 'text-slate-400 hover:text-white'}`}>
            Dashboard
          </button>
          <button onClick={() => setActiveTab('tactical')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'tactical' ? 'text-emerald-400 bg-white/5' : 'text-slate-400 hover:text-white'}`}>
            Tactical Board
          </button>
          <button onClick={() => setActiveTab('ai-coaching')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'ai-coaching' ? 'text-emerald-400 bg-white/5' : 'text-slate-400 hover:text-white'}`}>
            AI Planner
          </button>
          <button onClick={() => setActiveTab('playbook')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'playbook' ? 'text-emerald-400 bg-white/5' : 'text-slate-400 hover:text-white'}`}>
            Playbook
          </button>
          <button onClick={() => setActiveTab('chat')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeTab === 'chat' ? 'text-emerald-400 bg-white/5' : 'text-slate-400 hover:text-white'}`}>
            Chat
          </button>
        </nav>

        {/* Right side selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/10 text-sm">
            <span>👥</span>
            <select value={currentTeamId} onChange={(e) => setCurrentTeamId(e.target.value)} className="bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer max-w-[120px]">
              {teams.map(t => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white">{t.badge || '⚽'} {t.name}</option>
              ))}
            </select>
            <button onClick={() => setShowTeamModal(true)} className="text-emerald-400 font-bold ml-1 hover:text-emerald-300" title="Join or Create Team">+</button>
          </div>
          <button onClick={() => setShowConfigModal(true)} className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all" title="Database Settings">
            ⚙️
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 pb-24 md:pb-8 max-w-7xl mx-auto w-full mt-4">
        
        {/* VIEW: Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            {/* Header info */}
            <div className="glass-panel p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{activeTeamBadge}</span>
                  <h2 className="text-2xl font-bold text-slate-50 font-heading">
                    {teams.find(t => t.id === currentTeamId)?.name || 'Team FC'}
                  </h2>
                  <button onClick={() => {
                    const currentTeam = teams.find(t => t.id === currentTeamId);
                    if (currentTeam) {
                      setTeamNameInput(currentTeam.name);
                      setTeamBadgeInput(currentTeam.badge || '⚽');
                    }
                    setShowTeamSettingsModal(true);
                  }} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline ml-2">
                    Edit Name/Photo
                  </button>
                </div>
                <p className="text-sm text-slate-400 mt-2">
                  Active Channel Code: <strong className="text-emerald-400 font-mono select-all">{teams.find(t => t.id === currentTeamId)?.joinCode || 'N/A'}</strong>. Parents can enter this to switch into this channel.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-center min-w-[70px]">
                  <span className="block text-2xl font-black text-emerald-400">{wCount}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Wins</span>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-center min-w-[70px]">
                  <span className="block text-2xl font-black text-indigo-400">{dCount}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Draws</span>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-center min-w-[70px]">
                  <span className="block text-2xl font-black text-rose-400">{lCount}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Losses</span>
                </div>
              </div>
            </div>

            {/* Roster & Stats */}
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-200">📋 Roster & Stats (Max 20 Players)</h3>
                <button onClick={() => setShowRosterModal(true)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold">
                  Manage Roster
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-xs uppercase font-bold">
                      <th className="py-2 px-3">Jersey</th>
                      <th className="py-2 px-3">Player Name</th>
                      <th className="py-2 px-3 text-center">Goals</th>
                      <th className="py-2 px-3 text-center">Assists</th>
                      <th className="py-2 px-3 text-center">Points</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-white/5">
                    {rosterStats.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-6 text-center text-slate-400 italic">No players added to roster yet.</td>
                      </tr>
                    ) : (
                      rosterStats.map(p => (
                        <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                          <td className="py-2.5 px-3 font-semibold text-indigo-400">#{p.jerseyNumber}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-200">{p.name}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-emerald-400">{p.goals}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-cyan-400">{p.assists}</td>
                          <td className="py-2.5 px-3 text-center font-black text-white">{p.points}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Games & outcomes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-200">📅 Game Schedule</h3>
                  <button onClick={() => setShowAddGameModal(true)} className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold">
                    Add Game
                  </button>
                </div>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {games.filter(g => g.status === 'scheduled').length === 0 ? (
                    <div className="text-center py-8 text-slate-400 italic text-sm">No upcoming games scheduled.</div>
                  ) : (
                    games.filter(g => g.status === 'scheduled').map(g => (
                      <div key={g.id} className="bg-white/5 border border-white/5 p-3 rounded-lg flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-slate-200">vs {g.opponent}</h4>
                          <p className="text-[11px] text-slate-400">{new Date(g.game_date).toLocaleString()}</p>
                          <p className="text-[10px] text-indigo-400">{g.location}</p>
                        </div>
                        <button onClick={() => {
                          setOutcomeGameId(g.id);
                          setGoalEvents([]);
                          setOutcomeOurScore(0);
                          setOutcomeOpponentScore(0);
                          setShowOutcomeModal(true);
                        }} className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md">
                          Finish
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="glass-panel p-6">
                <h3 className="text-lg font-bold text-slate-200 mb-4">🏆 Match History</h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {games.filter(g => g.status === 'completed').length === 0 ? (
                    <div className="text-center py-8 text-slate-400 italic text-sm">No match history available yet.</div>
                  ) : (
                    games.filter(g => g.status === 'completed').map(g => {
                      const isWin = g.our_score > g.opponent_score;
                      const isLoss = g.our_score < g.opponent_score;
                      return (
                        <div key={g.id} className="bg-white/5 border border-white/5 p-3 rounded-lg flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-slate-200 flex items-center gap-2">
                              vs {g.opponent}
                              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${isWin ? 'bg-emerald-500/20 text-emerald-400' : isLoss ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-500/20 text-slate-300'}`}>
                                {isWin ? 'W' : isLoss ? 'L' : 'D'}
                              </span>
                            </h4>
                            <p className="text-[11px] text-slate-400">{new Date(g.game_date).toLocaleDateString()}</p>
                          </div>
                          <span className="text-lg font-black text-white">{g.our_score} - {g.opponent_score}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: Tactical Board */}
        {activeTab === 'tactical' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-[fadeIn_0.3s_ease-out]">
            {/* Field */}
            <div className="lg:col-span-8 glass-panel p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 class="text-2xl font-bold text-slate-100 font-heading">Tactical Board</h2>
                  <p className="text-sm text-slate-400">Drag players (or ball ⚽) to show positions & bench.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={handleResetBoard} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg border border-white/5">
                    Reset Board
                  </button>
                  <select value={tacticalFormat} onChange={(e) => setTacticalFormat(e.target.value)} className="bg-slate-900 border border-white/10 px-3 py-1.5 rounded-lg text-sm text-white focus:outline-none cursor-pointer">
                    <option value="6v6">6v6 Formations</option>
                    <option value="7v7">7v7 Formations</option>
                    <option value="8v8">8v8 Formations</option>
                    <option value="9v9">9v9 Formations</option>
                    <option value="11v11">11v11 Formations</option>
                  </select>
                </div>
              </div>

              {/* Soccer field */}
              <div 
                id="tacticalSoccerField" 
                onDragOver={(e) => e.preventDefault()} 
                onDrop={handleDropReact} 
                className="soccer-field relative w-full rounded-lg"
              >
                <div className="soccer-field-center-circle"></div>
                <div className="soccer-field-center-spot"></div>
                <div className="soccer-field-penalty-area-left"></div>
                <div className="soccer-field-penalty-area-right"></div>
                <div className="soccer-field-goal-area-left"></div>
                <div className="soccer-field-goal-area-right"></div>
                <div className="soccer-field-penalty-spot-left"></div>
                <div className="soccer-field-penalty-spot-right"></div>
                
                {/* Soccer ball */}
                <div 
                  id="ball" 
                  draggable 
                  onDragStart={(e) => handleDragStartReact(e, 'ball')}
                  onTouchMove={(e) => handleTouchMoveReact(e, 'ball')}
                  style={{
                    position: 'absolute',
                    left: `${ballPosition.left}%`,
                    top: `${ballPosition.top}%`,
                    transform: 'translate(-50%, -50%)',
                    touchAction: 'none'
                  }}
                  className="w-8 h-8 bg-white border-2 border-slate-900 rounded-full flex items-center justify-center text-sm shadow-lg cursor-grab z-30 select-none"
                >
                  ⚽
                </div>

                {/* Active Players (Pure React state driven coordinates - NO DOM appends, resolves duplicates!) */}
                {tacticalLineup.map((pos) => {
                  const nameLabel = pos.player ? pos.player.name : `Empty ${pos.label}`;
                  const initials = pos.player ? pos.player.name.split(" ").map(n => n[0]).join("").substring(0,2).toUpperCase() : pos.label;
                  
                  return (
                    <div
                      key={pos.idx}
                      id={String(pos.idx)}
                      draggable
                      onDragStart={(e) => handleDragStartReact(e, String(pos.idx))}
                      onTouchMove={(e) => handleTouchMoveReact(e, String(pos.idx))}
                      style={{
                        position: 'absolute',
                        left: `${pos.left}%`,
                        top: `${pos.top}%`,
                        transform: 'translate(-50%, -50%)',
                        touchAction: 'none'
                      }}
                      className="tactical-player z-20"
                    >
                      <span>{pos.player ? pos.player.jerseyNumber : initials}</span>
                      <div className="tactical-player-label">{nameLabel}</div>
                    </div>
                  );
                })}
              </div>

              {/* Bench */}
              <div className="mt-6 bg-slate-900/50 p-4 rounded-xl border border-white/5">
                <h4 className="text-sm font-bold text-slate-300 mb-2">Reserve / Bench Players</h4>
                <div className="flex flex-wrap gap-3 min-h-[60px] p-2 bg-slate-950/40 border border-dashed border-white/10 rounded-lg items-center">
                  {roster.slice(FORMATIONS[tacticalFormat].length).length === 0 ? (
                    <p className="text-xs text-slate-500 italic w-full text-center py-2">No players on the bench. Add more to your roster.</p>
                  ) : (
                    roster.slice(FORMATIONS[tacticalFormat].length).map(p => (
                      <div
                        key={p.id}
                        className="tactical-player relative cursor-default"
                      >
                        <span>{p.jerseyNumber}</span>
                        <div className="tactical-player-label">{p.name}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Timers Column */}
            <div className="lg:col-span-4 glass-panel p-6 space-y-5">
              <h3 className="text-lg font-bold text-slate-200 border-b border-white/10 pb-2">3-Timer Rotation Dashboard</h3>
              
              {/* Game timer */}
              <div className={`bg-slate-950/40 p-4 border border-white/10 rounded-xl flex flex-col items-center relative ${gameRunning ? 'timer-running' : ''}`} id="gameTimerCard">
                <span className="absolute top-2 left-2 text-[9px] bg-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded font-black">Game Clock</span>
                <span className="text-3xl font-black text-slate-100 font-mono tracking-widest mt-2">{formatTime(gameTime)}</span>
                <span className="text-[9px] text-slate-500 mt-1 mb-3">Target Max: 55:00</span>
                <div className="flex gap-2 w-full">
                  <button onClick={() => setGameRunning(!gameRunning)} className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all">
                    {gameRunning ? 'Pause' : 'Start'}
                  </button>
                  <button onClick={() => { setGameRunning(false); setGameTime(0); }} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg border border-white/5">
                    Reset
                  </button>
                </div>
              </div>

              {/* Sub 1 */}
              <div className={`bg-slate-950/40 p-4 border border-white/10 rounded-xl flex flex-col items-center relative ${sub1Running ? 'timer-running-indigo' : ''}`} id="sub1TimerCard">
                <span className="absolute top-2 left-2 text-[9px] bg-indigo-500/20 text-indigo-400 px-1 py-0.5 rounded font-black">Sub Rotation 1</span>
                <span className="text-2xl font-black text-slate-100 font-mono tracking-widest mt-2">{formatTime(sub1Time)}</span>
                <span className="text-[9px] text-slate-500 mt-1 mb-3">Shift Monitor</span>
                <div className="flex gap-2 w-full">
                  <button onClick={() => setSub1Running(!sub1Running)} className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all">
                    {sub1Running ? 'Pause' : 'Start'}
                  </button>
                  <button onClick={() => { setSub1Running(false); setSub1Time(0); }} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg border border-white/5">
                    Reset
                  </button>
                </div>
              </div>

              {/* Sub 2 */}
              <div className={`bg-slate-950/40 p-4 border border-white/10 rounded-xl flex flex-col items-center relative ${sub2Running ? 'timer-running-indigo' : ''}`} id="sub2TimerCard">
                <span className="absolute top-2 left-2 text-[9px] bg-indigo-500/20 text-indigo-400 px-1 py-0.5 rounded font-black">Sub Rotation 2</span>
                <span className="text-2xl font-black text-slate-100 font-mono tracking-widest mt-2">{formatTime(sub2Time)}</span>
                <span className="text-[9px] text-slate-500 mt-1 mb-3">Shift Monitor</span>
                <div className="flex gap-2 w-full">
                  <button onClick={() => setSub2Running(!sub2Running)} className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all">
                    {sub2Running ? 'Pause' : 'Start'}
                  </button>
                  <button onClick={() => { setSub2Running(false); setSub2Time(0); }} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg border border-white/5">
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: AI Coaching Planner */}
        {activeTab === 'ai-coaching' && (
          <div className="glass-panel p-6 space-y-6 print-area animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-100 font-heading">AI Practice & Drill Generator</h2>
                <p className="text-sm text-slate-400 no-print">Create custom, randomized soccer practices instantly.</p>
              </div>
              <button onClick={() => window.print()} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 rounded-lg text-xs font-semibold flex items-center gap-1.5 no-print">
                Print Practice
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 no-print">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Focus Area</label>
                <select value={aiFocus} onChange={(e) => setAiFocus(e.target.value)} className="w-full bg-slate-900 border border-white/10 px-3 py-2 rounded-lg text-sm text-slate-200 focus:outline-none">
                  <option value="dribbling">Dribbling & Ball Control</option>
                  <option value="passing">Passing & Movement</option>
                  <option value="shooting">Shooting & Finishing</option>
                  <option value="defense">Defending Principles</option>
                  <option value="tactics">Game Scenarios & Positioning</option>
                  <option value="fitness">Soccer Fitness & Agility</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Age Group</label>
                <select value={aiAge} onChange={(e) => setAiAge(e.target.value)} className="w-full bg-slate-900 border border-white/10 px-3 py-2 rounded-lg text-sm text-slate-200 focus:outline-none">
                  <option value="u8">U8 Rec (6-7 yrs)</option>
                  <option value="u10">U10 Rec (8-9 yrs)</option>
                  <option value="u12">U12 Rec (10-11 yrs)</option>
                  <option value="u14">U14+ (12+ yrs)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Match Format</label>
                <select value={aiFormat} onChange={(e) => setAiFormat(e.target.value)} className="w-full bg-slate-900 border border-white/10 px-3 py-2 rounded-lg text-sm text-slate-200 focus:outline-none">
                  <option value="6v6">6v6 Match Play</option>
                  <option value="7v7">7v7 Match Play</option>
                  <option value="9v9">9v9 Match Play</option>
                  <option value="11v11">11v11 Match Play</option>
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={handleGenerateAI} disabled={aiGenerating} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/10">
                  {aiGenerating ? 'Generating...' : 'Generate Fresh Plan'}
                </button>
              </div>
            </div>

            {/* Generated Plan Output */}
            <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5 min-h-[250px]">
              {aiPlan ? (
                <div className="space-y-6">
                  <div className="border-b border-white/10 pb-4">
                    <span className="bg-indigo-900/50 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">AI Practice Plan</span>
                    <h3 className="text-xl font-bold text-slate-100 mt-2">Topic: {aiFocus.toUpperCase()} Core Development</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Target: {aiAge.toUpperCase()} ({aiFormat}) | 55 Minutes Session</p>
                  </div>
                  
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-white/5 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-emerald-400">Phase 1: Dynamic Warmup (15m)</span>
                      <button onClick={() => handleSaveDrill('Warmup', aiPlan.warmup)} className="px-2 py-1 bg-white/5 text-[9px] hover:bg-emerald-600 rounded text-slate-200 no-print">
                        Save Drill
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed mt-2">{aiPlan.warmup}</p>
                  </div>

                  <div className="bg-slate-900/80 p-4 rounded-xl border border-white/5 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-indigo-400">Phase 2: Technical Drill (20m)</span>
                      <button onClick={() => handleSaveDrill('Technical Drill', aiPlan.drill1)} className="px-2 py-1 bg-white/5 text-[9px] hover:bg-emerald-600 rounded text-slate-200 no-print">
                        Save Drill
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed mt-2">{aiPlan.drill1}</p>
                  </div>

                  <div className="bg-slate-900/80 p-4 rounded-xl border border-white/5 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-indigo-400">Phase 3: Tactical / Game Simulation (20m)</span>
                      <button onClick={() => handleSaveDrill('Tactical Simulation', aiPlan.drill2)} className="px-2 py-1 bg-white/5 text-[9px] hover:bg-emerald-600 rounded text-slate-200 no-print">
                        Save Drill
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed mt-2">{aiPlan.drill2}</p>
                  </div>

                  <div className="bg-amber-950/20 border border-amber-500/20 p-4 rounded-xl">
                    <span className="text-xs font-bold text-amber-400 block mb-1">Coaching Keypoints</span>
                    <p className="text-xs text-slate-300 italic">{aiPlan.points}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400">
                  <span className="text-3xl block mb-2">✨</span>
                  <h3 className="text-base font-bold text-slate-300">Generate a custom Practice Plan</h3>
                  <p className="text-sm max-w-sm mx-auto mt-1">Select your coaching priorities above and build your playbook.</p>
                </div>
              )}
            </div>

            {/* Saved Drills playbook */}
            <div className="mt-8 pt-6 border-t border-white/10 no-print">
              <h3 className="text-lg font-bold text-slate-200 mb-4">Saved Drills Playbook</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedDrills.length === 0 ? (
                  <p className="text-xs text-slate-500 italic col-span-2 text-center py-4">No drills saved yet.</p>
                ) : (
                  savedDrills.map(d => (
                    <div key={d.id} className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                          <span className="bg-indigo-900/50 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{d.topic}</span>
                          <span className="text-[10px] text-emerald-400 font-bold uppercase">{d.phase}</span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed">{d.text}</p>
                      </div>
                      <div className="flex justify-end pt-3">
                        <button onClick={() => handleDeleteSavedDrill(d.id)} className="text-xs text-rose-500 hover:text-rose-400">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: Playbook & AI Coaching Assistant Chatbot */}
        {activeTab === 'playbook' && (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            {/* Playbook explanations */}
            <div className="glass-panel p-6">
              <h2 className="text-2xl font-bold text-slate-100 font-heading mb-2">The Playbook: Positions 1-11</h2>
              <p className="text-sm text-slate-400 mb-6">Understand the numbered positions in soccer and what attributes make players excel in their respective roles.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 md:col-span-1 border-r border-white/10 pr-4 max-h-[400px] overflow-y-auto">
                  {Object.keys(PLAYBOOK_POSITIONS).map(num => (
                    <button
                      key={num}
                      onClick={() => setPlaybookPos(parseInt(num))}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between border transition-all ${playbookPos === parseInt(num) ? 'bg-white/5 border-emerald-500 text-emerald-400' : 'border-transparent text-slate-300 hover:bg-white/5'}`}
                    >
                      <span>{PLAYBOOK_POSITIONS[num].title}</span>
                      <span>→</span>
                    </button>
                  ))}
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="bg-white/5 border border-white/5 p-6 rounded-xl space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center font-black text-lg">
                        {playbookPos}
                      </div>
                      <h3 className="text-xl font-bold text-white font-heading">{PLAYBOOK_POSITIONS[playbookPos].title}</h3>
                    </div>
                    
                    <p className="text-slate-300 text-sm leading-relaxed">{PLAYBOOK_POSITIONS[playbookPos].description}</p>
                    
                    <div>
                      <h4 className="text-xs text-slate-400 font-bold uppercase mb-2">Key Competencies & Skillsets</h4>
                      <div className="flex flex-wrap gap-2">
                        {PLAYBOOK_POSITIONS[playbookPos].attributes.map(attr => (
                          <span key={attr} className="bg-indigo-900/40 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-full text-xs font-semibold">{attr}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-lg flex gap-3">
                      <span>💡</span>
                      <div>
                        <h5 className="text-xs font-bold text-emerald-400 uppercase">Coaching Pointer</h5>
                        <p className="text-xs text-slate-300 mt-0.5">{PLAYBOOK_POSITIONS[playbookPos].coachingTip}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI COACHING QUESTION BOX (General AI Q&A Chatbot integration) */}
            <div className="glass-panel p-6">
              <h3 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2">
                <span>🤖</span> Ask the Team FC AI Coach
              </h3>
              <p className="text-xs text-slate-400 mb-4">Ask any soccer rule, coaching strategy, or tactical question (e.g. "What is offsides?", "How to play a 2-3-1?").</p>
              
              <form onSubmit={handleAskAICoach} className="flex gap-2">
                <input 
                  type="text" 
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder="Ask a rule, tactical question, or drill advice..." 
                  className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500" 
                />
                <button 
                  type="submit" 
                  disabled={aiThinking}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm"
                >
                  {aiThinking ? 'Thinking...' : 'Ask AI'}
                </button>
              </form>

              {aiAnswer && (
                <div className="mt-4 bg-slate-900/80 p-4 rounded-xl border border-white/5 animate-[fadeIn_0.2s_ease-out]">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span>💡</span> Coach AI Advisor:
                  </div>
                  <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {aiAnswer}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: Chat & Schedule */}
        {activeTab === 'chat' && (
          <div className="glass-panel p-6 flex flex-col h-[700px] animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-100 font-heading">Team Chat & Schedule</h2>
                <p className="text-xs text-slate-400">Real-time team synchronization logs & 7-day rolling planner.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                <span className="text-xs text-slate-400">{dbStatus}</span>
              </div>
            </div>

            {/* Rolling Calendar */}
            <div className="mb-4 bg-slate-950/40 p-3 rounded-xl border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">7-Day Team Schedule (Rolling)</h3>
                <button onClick={() => setShowCalEventModal(true)} className="text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2 py-1 rounded">
                  Add Event
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
                {calendarDays.map((day, idx) => {
                  const dayStr = day.toDateString();
                  const dayEvents = calendarEvents.filter(e => new Date(e.date).toDateString() === dayStr);
                  const dayGames = games.filter(g => new Date(g.game_date).toDateString() === dayStr);
                  
                  const allEvents = [...dayEvents];
                  dayGames.forEach(dg => {
                    allEvents.push({ type: 'game', title: `vs ${dg.opponent}`, location: dg.location });
                  });

                  const isToday = idx === 0;

                  return (
                    <div 
                      key={idx}
                      onClick={() => {
                        const localISOTime = new Date(day.getTime() - (day.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
                        setCalEventDate(localISOTime);
                        setShowCalEventModal(true);
                      }}
                      className={`flex flex-col items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${isToday ? 'bg-indigo-950/60 border-indigo-500' : 'bg-slate-900/50 border-white/5 hover:border-white/10'}`}
                    >
                      <div className="text-center">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase">{weekdays[day.getDay()]}</span>
                        <span className="block text-sm font-extrabold">{day.getDate()}</span>
                      </div>
                      <div className="w-full space-y-1 mt-1 flex flex-col items-center">
                        {allEvents.length > 0 ? (
                          allEvents.map((e, i) => {
                            const isGame = e.type === 'game';
                            return (
                              <div key={i} className={`text-[9px] font-bold text-center px-1 py-0.5 rounded leading-tight w-full truncate ${isGame ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-300'}`}>
                                {isGame ? '⚽' : '🏃'} {e.title}
                              </div>
                            );
                          })
                        ) : (
                          <span className="text-[9px] text-slate-500 italic">No events</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chat Logs */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
              {chatMessages.length === 0 ? (
                <div className="text-center py-16 text-slate-500 italic text-sm">No messages yet. Say hello to the team!</div>
              ) : (
                chatMessages.map(m => (
                  <div key={m.id} className="flex flex-col gap-0.5 max-w-[85%] bg-slate-900 border border-white/5 p-3 rounded-xl">
                    <span className="text-xs text-indigo-400 font-bold flex items-center gap-2">
                      {m.sender_name} 
                      <span className="text-[9px] text-slate-500 font-normal">{new Date(m.created_at || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </span>
                    <p className="text-sm text-slate-200 mt-1">{m.message}</p>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Form */}
            <form onSubmit={handleSendChat} className="flex gap-2">
              <input type="text" value={chatSender} onChange={(e) => setChatSender(e.target.value)} placeholder="Your Name" className="w-[120px] bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500" required />
              <input type="text" value={chatText} onChange={(e) => setChatText(e.target.value)} placeholder="Type a message..." className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500" required />
              <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm transition-all">
                Send
              </button>
            </form>
          </div>
        )}
      </main>

      {/* MODALS */}

      {/* Modal: Team switch / creation */}
      {showTeamModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Manage Team Channels</h3>
              <button onClick={() => setShowTeamModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h4 className="text-sm font-semibold text-emerald-400 mb-2">Join a Channel</h4>
                <div className="flex gap-2">
                  <input type="text" value={joinTeamCode} onChange={(e) => setJoinTeamCode(e.target.value)} placeholder="Enter key password..." className="flex-1 bg-slate-950 border border-white/10 px-3 py-2 rounded-lg text-sm text-white focus:outline-none" />
                  <button onClick={handleJoinTeam} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold">Join</button>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h4 className="text-sm font-semibold text-indigo-400 mb-2">Create New Channel</h4>
                <div className="space-y-3">
                  <input type="text" value={createTeamName} onChange={(e) => setCreateTeamName(e.target.value)} placeholder="Team Name" className="w-full bg-slate-950 border border-white/10 px-3 py-2 rounded-lg text-sm text-white focus:outline-none" />
                  <input type="text" value={createTeamKey} onChange={(e) => setCreateTeamKey(e.target.value)} placeholder="Password Key" className="w-full bg-slate-950 border border-white/10 px-3 py-2 rounded-lg text-sm text-white focus:outline-none" />
                  <button onClick={handleCreateTeam} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold">Create</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Team settings (Rename and Logo/Badge choice) */}
      {showTeamSettingsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Edit Team Settings</h3>
              <button onClick={() => setShowTeamSettingsModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Rename Team</label>
                <input 
                  type="text" 
                  value={teamNameInput} 
                  onChange={(e) => setTeamNameInput(e.target.value)}
                  placeholder="e.g. Blue Fire FC" 
                  className="w-full bg-slate-950 border border-white/10 px-3 py-2 rounded-lg text-sm text-white focus:outline-none" 
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2">Select Team Photo / Club Badge</label>
                <div className="grid grid-cols-4 gap-2">
                  {BADGES.map(badge => (
                    <button
                      key={badge.char}
                      onClick={() => setTeamBadgeInput(badge.char)}
                      className={`text-2xl p-2 rounded-lg border transition-all ${teamBadgeInput === badge.char ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                      title={badge.name}
                    >
                      {badge.char}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleSaveTeamSettings}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-all"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Roster Manager */}
      {showRosterModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Manage Team Roster</h3>
              <button onClick={() => setShowRosterModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="flex gap-2">
              <input type="number" value={playerJersey} onChange={(e) => setPlayerJersey(e.target.value)} placeholder="Jersey #" className="w-24 bg-slate-900 border border-white/10 px-3 py-2 rounded-lg text-sm text-white focus:outline-none" />
              <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Player Name" className="flex-1 bg-slate-900 border border-white/10 px-3 py-2 rounded-lg text-sm text-white focus:outline-none" />
              <button onClick={handleAddPlayer} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold">Add</button>
            </div>
            <div className="max-h-[300px] overflow-y-auto bg-slate-950/40 border border-white/5 rounded-lg p-2">
              <ul className="space-y-1 divide-y divide-white/5 text-sm">
                {roster.map(p => (
                  <li key={p.id} className="flex items-center justify-between py-1.5 px-2 hover:bg-white/5 rounded">
                    <span><strong className="text-indigo-400">#{p.jerseyNumber}</strong> - {p.name}</span>
                    <button onClick={() => handleRemovePlayer(p.id)} className="text-rose-500 hover:text-rose-400">Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Game */}
      {showAddGameModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Add Game to Schedule</h3>
              <button onClick={() => setShowAddGameModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-3">
              <input type="text" value={gameOpponent} onChange={(e) => setGameOpponent(e.target.value)} placeholder="Opponent Team" className="w-full bg-slate-900 border border-white/10 px-3 py-2 rounded-lg text-sm text-white focus:outline-none" />
              <input type="datetime-local" value={gameDate} onChange={(e) => setGameDate(e.target.value)} className="w-full bg-slate-900 border border-white/10 px-3 py-2 rounded-lg text-sm text-white focus:outline-none" />
              <input type="text" value={gameLocation} onChange={(e) => setGameLocation(e.target.value)} placeholder="Field / Location" className="w-full bg-slate-900 border border-white/10 px-3 py-2 rounded-lg text-sm text-white focus:outline-none" />
              <button onClick={handleAddGame} className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold">Save Game</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Game Outcome */}
      {showOutcomeModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Record Match Outcome</h3>
              <button onClick={() => setShowOutcomeModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Our Score</label>
                  <input type="number" value={outcomeOurScore} readOnly className="w-full bg-slate-900 border border-white/10 px-3 py-2 rounded-lg text-sm text-white focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Opponent Score</label>
                  <input type="number" value={outcomeOpponentScore} onChange={(e) => setOutcomeOpponentScore(parseInt(e.target.value) || 0)} min="0" className="w-full bg-slate-900 border border-white/10 px-3 py-2 rounded-lg text-sm text-white focus:outline-none" />
                </div>
              </div>

              <div className="border-t border-white/5 pt-3">
                <h4 className="text-xs font-bold text-slate-400 mb-2">Record Goal & Assist</h4>
                <div className="grid grid-cols-12 gap-2">
                  <select value={goalScorer} onChange={(e) => setGoalScorer(e.target.value)} className="col-span-5 bg-slate-900 border border-white/10 px-2 py-1.5 rounded-lg text-xs text-slate-200">
                    <option value="">Scored By</option>
                    {roster.map(p => (
                      <option key={p.id} value={p.id}>#{p.jerseyNumber} {p.name}</option>
                    ))}
                  </select>
                  <select value={goalAssister} onChange={(e) => setGoalAssister(e.target.value)} className="col-span-5 bg-slate-900 border border-white/10 px-2 py-1.5 rounded-lg text-xs text-slate-200">
                    <option value="">Assisted By</option>
                    {roster.map(p => (
                      <option key={p.id} value={p.id}>#{p.jerseyNumber} {p.name}</option>
                    ))}
                  </select>
                  <button onClick={handleAddGoalEvent} className="col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center">+</button>
                </div>

                <ul className="space-y-1 text-xs max-h-[120px] overflow-y-auto mt-2">
                  {goalEvents.map(e => (
                    <li key={e.id} className="flex items-center justify-between bg-white/5 px-2 py-1 rounded">
                      <span>Goal: <strong className="text-emerald-400">{e.scorer_name}</strong> {e.assister_name ? `(Assist: ${e.assister_name})` : ''}</span>
                      <button onClick={() => handleRemoveGoalEvent(e.id)} className="text-rose-500">Remove</button>
                    </li>
                  ))}
                </ul>
              </div>

              <button onClick={handleSaveOutcome} className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold">Submit Results</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: DB Config */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Database Settings</h3>
              <button onClick={() => setShowConfigModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-3 text-xs text-slate-400">
              <p className="bg-emerald-500/10 text-emerald-400 p-2.5 rounded-lg border border-emerald-500/20 leading-relaxed font-semibold">
                ℹ️ <strong>Admin Note:</strong> Configure this Supabase credentials block once as the administrator/host. Coaches & parents who create or join team channels will share this unified cloud database automatically via key password codes.
              </p>
              
              <div className="space-y-2 mt-2">
                <label className="block text-[10px] text-slate-300 font-bold uppercase">Supabase Project URL</label>
                <input type="text" value={dbUrl} onChange={(e) => setDbUrl(e.target.value)} placeholder="https://your-project.supabase.co" className="w-full bg-slate-900 border border-white/10 px-3 py-2 rounded-lg text-sm text-white focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] text-slate-300 font-bold uppercase">Supabase Anon Key</label>
                <input type="password" value={dbAnonKey} onChange={(e) => setDbAnonKey(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." className="w-full bg-slate-900 border border-white/10 px-3 py-2 rounded-lg text-sm text-white focus:outline-none" />
              </div>
              <button onClick={() => {
                localStorage.setItem("teamfc_supabase_config", JSON.stringify({ url: dbUrl, anonKey: dbAnonKey }));
                setShowConfigModal(false);
                loadTeams();
              }} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-all mt-2">
                Save & Reconnect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add calendar event */}
      {showCalEventModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Add Team Event</h3>
              <button onClick={() => setShowCalEventModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-3">
              <select value={calEventType} onChange={(e) => setCalEventType(e.target.value)} className="w-full bg-slate-900 border border-white/10 px-3 py-2 rounded-lg text-sm text-white focus:outline-none">
                <option value="practice">Practice</option>
                <option value="game">Game</option>
              </select>
              <input type="text" value={calEventTitle} onChange={(e) => setCalEventTitle(e.target.value)} placeholder="Event Title / Details" className="w-full bg-slate-900 border border-white/10 px-3 py-2 rounded-lg text-sm text-white focus:outline-none" />
              <input type="datetime-local" value={calEventDate} onChange={(e) => setCalEventDate(e.target.value)} className="w-full bg-slate-900 border border-white/10 px-3 py-2 rounded-lg text-sm text-white focus:outline-none" />
              <input type="text" value={calEventLocation} onChange={(e) => setCalEventLocation(e.target.value)} placeholder="Location" className="w-full bg-slate-900 border border-white/10 px-3 py-2 rounded-lg text-sm text-white focus:outline-none" />
              <button onClick={handleSaveCalendarEvent} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold">Save Event</button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile nav bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950/90 border-t border-white/10 px-4 py-2 flex justify-around items-center z-50 backdrop-blur-md">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'dashboard' ? 'text-emerald-400' : 'text-slate-400'}`}>
          <span>📊</span>
          <span className="text-[9px]">Dashboard</span>
        </button>
        <button onClick={() => setActiveTab('tactical')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'tactical' ? 'text-emerald-400' : 'text-slate-400'}`}>
          <span>📋</span>
          <span className="text-[9px]">Tactics</span>
        </button>
        <button onClick={() => setActiveTab('ai-coaching')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'ai-coaching' ? 'text-emerald-400' : 'text-slate-400'}`}>
          <span>✨</span>
          <span className="text-[9px]">AI Plans</span>
        </button>
        <button onClick={() => setActiveTab('playbook')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'playbook' ? 'text-emerald-400' : 'text-slate-400'}`}>
          <span>📖</span>
          <span className="text-[9px]">Playbook</span>
        </button>
        <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'chat' ? 'text-emerald-400' : 'text-slate-400'}`}>
          <span>💬</span>
          <span className="text-[9px]">Chat</span>
        </button>
      </div>
    </div>
  );
}
