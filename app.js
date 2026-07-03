// Team FC - Application Logic

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

// --- App State & Storage System ---
let state = {
  teams: [],
  currentTeamId: null,
  roster: [],
  games: [],
  chatMessages: [],
  goalEvents: [], // Temporary storage for outcome modal
  calendarEvents: [], // Practices and games for the rolling calendar
  savedDrills: [], // Drills coaches chose to save
  supabaseConfig: { url: "", anonKey: "" }
};

let supabaseClient = null;

// --- Initialize Application ---
document.addEventListener("DOMContentLoaded", () => {
  // Load configuration from local storage
  const savedConfig = localStorage.getItem("teamfc_supabase_config");
  if (savedConfig) {
    state.supabaseConfig = JSON.parse(savedConfig);
    document.getElementById("dbUrl").value = state.supabaseConfig.url || "";
    document.getElementById("dbAnonKey").value = state.supabaseConfig.anonKey || "";
  }
  
  initSupabase();
  loadData();
  lucide.createIcons();
  
  // Set default playbook details
  selectPlaybookPosition(9); 
  
  // Initialise drag events
  initDragAndDrop();
});

// --- Supabase Connection ---
function initSupabase() {
  const { url, anonKey } = state.supabaseConfig;
  if (url && anonKey) {
    try {
      supabaseClient = supabase.createClient(url, anonKey);
      document.getElementById("chatActiveStatus").innerText = "Supabase Realtime Connected";
      document.getElementById("chatActiveStatus").classList.replace("text-slate-400", "text-emerald-400");
    } catch (e) {
      console.error("Supabase config error, using sandbox fallback", e);
      supabaseClient = null;
      document.getElementById("chatActiveStatus").innerText = "Local Fallback Mode";
    }
  } else {
    supabaseClient = null;
    document.getElementById("chatActiveStatus").innerText = "Local Sandbox Mode";
  }
}

function saveSupabaseConfig() {
  const url = document.getElementById("dbUrl").value.trim();
  const anonKey = document.getElementById("dbAnonKey").value.trim();
  
  state.supabaseConfig = { url, anonKey };
  localStorage.setItem("teamfc_supabase_config", JSON.stringify(state.supabaseConfig));
  
  closeConfigModal();
  initSupabase();
  loadData();
}

// --- Data Loading & Storage Wrapper ---
async function loadData() {
  if (supabaseClient) {
    try {
      // 1. Fetch Teams
      const { data: teamsData, error: teamsError } = await supabaseClient
        .from('teams')
        .select('*');
      if (teamsError) throw teamsError;
      state.teams = teamsData || [];
      
      if (state.teams.length > 0) {
        if (!state.currentTeamId) {
          state.currentTeamId = state.teams[0].id;
        }
        await loadTeamDetails(state.currentTeamId);
      }
      updateTeamDropdown();
    } catch (err) {
      console.warn("Supabase fetch failed. Falling back to local storage.", err);
      loadLocalFallback();
    }
  } else {
    loadLocalFallback();
  }
}

function loadLocalFallback() {
  const localTeams = localStorage.getItem("teamfc_teams");
  if (localTeams) {
    state.teams = JSON.parse(localTeams);
  } else {
    // Inject mock team for instant demonstration
    state.teams = [
      { id: "mock-team-1", name: "Lightning Rec 7s", joinCode: "coach123" }
    ];
    localStorage.setItem("teamfc_teams", JSON.stringify(state.teams));
  }
  
  if (state.teams.length > 0 && !state.currentTeamId) {
    state.currentTeamId = state.teams[0].id;
  }
  
  if (state.currentTeamId) {
    const rosterKey = `teamfc_roster_${state.currentTeamId}`;
    const gamesKey = `teamfc_games_${state.currentTeamId}`;
    const chatKey = `teamfc_chat_${state.currentTeamId}`;
    const calKey = `teamfc_cal_${state.currentTeamId}`;
    const drillsKey = `teamfc_drills_${state.currentTeamId}`;
    
    state.roster = JSON.parse(localStorage.getItem(rosterKey)) || [];
    state.games = JSON.parse(localStorage.getItem(gamesKey)) || [];
    state.chatMessages = JSON.parse(localStorage.getItem(chatKey)) || [];
    state.calendarEvents = JSON.parse(localStorage.getItem(calKey)) || [];
    state.savedDrills = JSON.parse(localStorage.getItem(drillsKey)) || [];
    
    // Inject mock roster if completely empty
    if (state.roster.length === 0) {
      state.roster = [
        { id: "p1", name: "Alex Morgan", jerseyNumber: 13 },
        { id: "p2", name: "Christian Pulisic", jerseyNumber: 10 },
        { id: "p3", name: "Weston McKennie", jerseyNumber: 8 },
        { id: "p4", name: "Tyler Adams", jerseyNumber: 4 },
        { id: "p5", name: "Antonee Robinson", jerseyNumber: 3 },
        { id: "p6", name: "Matt Turner", jerseyNumber: 1 },
        { id: "p7", name: "Folarin Balogun", jerseyNumber: 9 }
      ];
      localStorage.setItem(rosterKey, JSON.stringify(state.roster));
    }
  }
  
  updateTeamDropdown();
  renderAllViews();
}

async function loadTeamDetails(teamId) {
  if (!supabaseClient) return;
  
  // Load roster
  const { data: rosterData } = await supabaseClient
    .from('roster')
    .select('*')
    .eq('team_id', teamId);
  state.roster = rosterData || [];
  
  // Load games
  const { data: gamesData } = await supabaseClient
    .from('games')
    .select('*, game_events(*)')
    .eq('team_id', teamId);
  state.games = gamesData || [];
  
  // Load chat
  const { data: chatData } = await supabaseClient
    .from('chat_messages')
    .select('*')
    .eq('team_id', teamId)
    .order('created_at', { ascending: true });
  state.chatMessages = chatData || [];

  // Local fallback for calendar/drills in Supabase mode
  state.calendarEvents = JSON.parse(localStorage.getItem(`teamfc_cal_${teamId}`)) || [];
  state.savedDrills = JSON.parse(localStorage.getItem(`teamfc_drills_${teamId}`)) || [];
  
  renderAllViews();
}

// --- View Rendering ---
function renderAllViews() {
  const currentTeam = state.teams.find(t => t.id === state.currentTeamId);
  
  if (currentTeam) {
    document.getElementById("currentTeamTitle").innerText = currentTeam.name;
    document.getElementById("currentTeamCodeDisplay").innerHTML = `Active Channel Code: <strong class="text-emerald-400 font-mono select-all">${currentTeam.joinCode}</strong>. Parents can enter this to switch into this channel.`;
  } else {
    document.getElementById("currentTeamTitle").innerText = "No Team Selected";
    document.getElementById("currentTeamCodeDisplay").innerText = "Join or create a team to get started.";
  }
  
  renderRoster();
  renderGames();
  renderChat();
  renderTacticalBench();
  handleFormationChange(); 
  renderRollingCalendar();
  renderSavedDrills();
}

function updateTeamDropdown() {
  const selector = document.getElementById("teamSelector");
  selector.innerHTML = `<option value="" class="bg-slate-900 text-slate-400">-- Switch Team --</option>`;
  
  state.teams.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = t.name;
    opt.className = "bg-slate-900 text-slate-100";
    if (t.id === state.currentTeamId) {
      opt.selected = true;
    }
    selector.appendChild(opt);
  });
}

function handleTeamChange() {
  const selectedId = document.getElementById("teamSelector").value;
  if (!selectedId) return;
  state.currentTeamId = selectedId;
  if (supabaseClient) {
    loadTeamDetails(selectedId);
  } else {
    loadLocalFallback();
  }
}

// --- Team Creation & Joining ---
async function createTeamChannel() {
  const name = document.getElementById("createTeamName").value.trim();
  const joinCode = document.getElementById("createTeamKey").value.trim();
  
  if (!name || !joinCode) {
    alert("Please fill in both name and access code");
    return;
  }
  
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('teams')
        .insert([{ name, join_code: joinCode }])
        .select();
      if (error) throw error;
      
      state.currentTeamId = data[0].id;
      await loadData();
      closeTeamModal();
    } catch (e) {
      alert("Error creating team: " + e.message);
    }
  } else {
    // Local fallback
    const newTeam = {
      id: "local-" + Date.now(),
      name: name,
      joinCode: joinCode
    };
    state.teams.push(newTeam);
    state.currentTeamId = newTeam.id;
    localStorage.setItem("teamfc_teams", JSON.stringify(state.teams));
    
    // Save empty lists for new team
    localStorage.setItem(`teamfc_roster_${newTeam.id}`, JSON.stringify([]));
    localStorage.setItem(`teamfc_games_${newTeam.id}`, JSON.stringify([]));
    localStorage.setItem(`teamfc_chat_${newTeam.id}`, JSON.stringify([]));
    localStorage.setItem(`teamfc_cal_${newTeam.id}`, JSON.stringify([]));
    localStorage.setItem(`teamfc_drills_${newTeam.id}`, JSON.stringify([]));
    
    loadLocalFallback();
    closeTeamModal();
  }
}

async function joinTeamByCode() {
  const code = document.getElementById("joinTeamCode").value.trim();
  if (!code) return;
  
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('teams')
        .select('*')
        .eq('join_code', code)
        .single();
      
      if (error || !data) {
        alert("Invalid team channel code.");
        return;
      }
      
      state.currentTeamId = data.id;
      await loadData();
      closeTeamModal();
    } catch (e) {
      alert("Error finding team: " + e.message);
    }
  } else {
    // Local lookup
    const existing = state.teams.find(t => t.joinCode.toLowerCase() === code.toLowerCase());
    if (existing) {
      state.currentTeamId = existing.id;
      loadLocalFallback();
      closeTeamModal();
    } else {
      alert("Team code not found in local sandbox. Create it first!");
    }
  }
}

// --- Roster Management ---
function renderRoster() {
  const container = document.getElementById("rosterStatsList");
  const modalList = document.getElementById("modalRosterList");
  
  if (state.roster.length === 0) {
    container.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-slate-400 italic">No players added to roster yet. Click Manage Roster.</td></tr>`;
    modalList.innerHTML = `<li class="text-xs text-slate-500 italic text-center py-2">Roster is empty. Add a player.</li>`;
    return;
  }
  
  // Calculate scores/stats
  const statsMap = {};
  state.roster.forEach(p => {
    statsMap[p.id] = { goals: 0, assists: 0 };
  });
  
  state.games.forEach(g => {
    if (g.game_events) {
      g.game_events.forEach(e => {
        if (statsMap[e.player_id]) {
          if (e.event_type === 'goal') statsMap[e.player_id].goals++;
          if (e.event_type === 'assist') statsMap[e.player_id].assists++;
        }
      });
    }
  });

  // Render main dashboard roster
  container.innerHTML = "";
  state.roster.forEach(p => {
    const stats = statsMap[p.id] || { goals: 0, assists: 0 };
    const row = document.createElement("tr");
    row.className = "border-b border-white/5 hover:bg-white/5 transition-all";
    row.innerHTML = `
      <td class="py-2.5 px-3 font-semibold text-indigo-400">#${p.jerseyNumber || '-'}</td>
      <td class="py-2.5 px-3 font-bold text-slate-200">${p.name}</td>
      <td class="py-2.5 px-3 text-center font-bold text-emerald-400">${stats.goals}</td>
      <td class="py-2.5 px-3 text-center font-bold text-cyan-400">${stats.assists}</td>
      <td class="py-2.5 px-3 text-center font-black text-white">${stats.goals + stats.assists}</td>
    `;
    container.appendChild(row);
  });

  // Render modal roster list
  modalList.innerHTML = "";
  state.roster.forEach(p => {
    const li = document.createElement("li");
    li.className = "flex items-center justify-between py-1.5 px-2 hover:bg-white/5 rounded";
    li.innerHTML = `
      <span class="font-semibold text-slate-300"><span class="text-indigo-400 font-bold">#${p.jerseyNumber}</span> - ${p.name}</span>
      <button onclick="removePlayerFromRoster('${p.id}')" class="text-rose-500 hover:text-rose-400 transition-all">
        <i data-lucide="trash-2" class="w-4 h-4"></i>
      </button>
    `;
    modalList.appendChild(li);
  });
  lucide.createIcons();
}

async function addPlayerToRoster() {
  const jersey = document.getElementById("playerJersey").value;
  const name = document.getElementById("playerName").value.trim();
  
  if (!name || !jersey) return;
  if (state.roster.length >= 20) {
    alert("Maximum roster limit is 20 players!");
    return;
  }
  
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('roster')
        .insert([{ team_id: state.currentTeamId, player_name: name, jersey_number: parseInt(jersey) }])
        .select();
      if (error) throw error;
      await loadTeamDetails(state.currentTeamId);
    } catch (e) {
      alert(e.message);
    }
  } else {
    // Local
    const newPlayer = {
      id: "player-" + Date.now(),
      name,
      jerseyNumber: parseInt(jersey)
    };
    state.roster.push(newPlayer);
    localStorage.setItem(`teamfc_roster_${state.currentTeamId}`, JSON.stringify(state.roster));
    renderAllViews();
  }
  
  document.getElementById("playerJersey").value = "";
  document.getElementById("playerName").value = "";
}

async function removePlayerFromRoster(playerId) {
  if (!confirm("Are you sure you want to remove this player?")) return;
  
  if (supabaseClient) {
    try {
      await supabaseClient.from('roster').delete().eq('id', playerId);
      await loadTeamDetails(state.currentTeamId);
    } catch (e) {
      alert(e.message);
    }
  } else {
    state.roster = state.roster.filter(p => p.id !== playerId);
    localStorage.setItem(`teamfc_roster_${state.currentTeamId}`, JSON.stringify(state.roster));
    renderAllViews();
  }
}

// --- Game Schedule & Matches ---
function renderGames() {
  const scheduleList = document.getElementById("scheduleList");
  const matchHistoryList = document.getElementById("matchHistoryList");
  
  scheduleList.innerHTML = "";
  matchHistoryList.innerHTML = "";
  
  let w = 0, d = 0, l = 0;
  
  const upcoming = state.games.filter(g => g.status === 'scheduled');
  const finished = state.games.filter(g => g.status === 'completed');
  
  if (upcoming.length === 0) {
    scheduleList.innerHTML = `<div class="text-center py-8 text-slate-400 italic text-sm">No upcoming games scheduled.</div>`;
  } else {
    upcoming.forEach(g => {
      const dObj = new Date(g.game_date);
      const card = document.createElement("div");
      card.className = "bg-white/5 border border-white/5 p-3 rounded-lg flex items-center justify-between";
      card.innerHTML = `
        <div>
          <h4 class="font-bold text-slate-200">vs ${g.opponent}</h4>
          <p class="text-[11px] text-slate-400">${dObj.toLocaleDateString()} @ ${dObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
          <p class="text-[10px] text-indigo-400">${g.location || 'No Location specified'}</p>
        </div>
        <button onclick="openOutcomeModal('${g.id}')" class="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md flex items-center gap-1 transition-all">
          <i data-lucide="check" class="w-3.5 h-3.5"></i> Finish
        </button>
      `;
      scheduleList.appendChild(card);
    });
  }
  
  if (finished.length === 0) {
    matchHistoryList.innerHTML = `<div class="text-center py-8 text-slate-400 italic text-sm">No match history. Mark games completed.</div>`;
  } else {
    finished.forEach(g => {
      const card = document.createElement("div");
      card.className = "bg-white/5 border border-white/5 p-3 rounded-lg flex items-center justify-between";
      
      const ourScore = g.our_score || 0;
      const oppScore = g.opponent_score || 0;
      let outcomeBadge = "";
      
      if (ourScore > oppScore) {
        w++;
        outcomeBadge = `<span class="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-1.5 py-0.5 rounded border border-emerald-500/20">W</span>`;
      } else if (ourScore < oppScore) {
        l++;
        outcomeBadge = `<span class="bg-rose-500/20 text-rose-400 text-[10px] font-black px-1.5 py-0.5 rounded border border-rose-500/20">L</span>`;
      } else {
        d++;
        outcomeBadge = `<span class="bg-slate-500/20 text-slate-300 text-[10px] font-black px-1.5 py-0.5 rounded border border-slate-500/20">D</span>`;
      }
      
      card.innerHTML = `
        <div>
          <h4 class="font-bold text-slate-200 flex items-center gap-2">vs ${g.opponent} ${outcomeBadge}</h4>
          <p class="text-[11px] text-slate-400">${new Date(g.game_date).toLocaleDateString()}</p>
        </div>
        <div class="text-right">
          <span class="text-lg font-black text-white">${ourScore} - ${oppScore}</span>
        </div>
      `;
      matchHistoryList.appendChild(card);
    });
  }
  
  // Update scoreboard elements
  document.getElementById("stat-wins").innerText = w;
  document.getElementById("stat-draws").innerText = d;
  document.getElementById("stat-losses").innerText = l;
  
  lucide.createIcons();
}

async function saveScheduledGame() {
  const opponent = document.getElementById("gameOpponent").value.trim();
  const date = document.getElementById("gameDate").value;
  const location = document.getElementById("gameLocation").value.trim();
  
  if (!opponent || !date) return;
  
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('games')
        .insert([{ team_id: state.currentTeamId, opponent, game_date: date, location }])
        .select();
      if (error) throw error;
      await loadTeamDetails(state.currentTeamId);
    } catch (e) {
      alert(e.message);
    }
  } else {
    // Local
    const newGame = {
      id: "game-" + Date.now(),
      opponent,
      game_date: date,
      location,
      status: 'scheduled',
      our_score: 0,
      opponent_score: 0,
      game_events: []
    };
    state.games.push(newGame);
    localStorage.setItem(`teamfc_games_${state.currentTeamId}`, JSON.stringify(state.games));
    renderAllViews();
  }
  
  document.getElementById("gameOpponent").value = "";
  document.getElementById("gameDate").value = "";
  document.getElementById("gameLocation").value = "";
  closeAddGameModal();
}

function openOutcomeModal(gameId) {
  document.getElementById("outcomeGameId").value = gameId;
  
  // Populate player select options
  const scorerSelect = document.getElementById("goalScorer");
  const assisterSelect = document.getElementById("goalAssister");
  
  scorerSelect.innerHTML = `<option value="">Scored By</option>`;
  assisterSelect.innerHTML = `<option value="">Assisted By</option>`;
  
  state.roster.forEach(p => {
    const opt1 = document.createElement("option");
    opt1.value = p.id;
    opt1.textContent = `#${p.jerseyNumber} ${p.name}`;
    scorerSelect.appendChild(opt1);
    
    const opt2 = document.createElement("option");
    opt2.value = p.id;
    opt2.textContent = `#${p.jerseyNumber} ${p.name}`;
    assisterSelect.appendChild(opt2);
  });
  
  state.goalEvents = [];
  document.getElementById("outcomeEventsList").innerHTML = "";
  document.getElementById("outcomeOurScore").value = 0;
  document.getElementById("outcomeOpponentScore").value = 0;
  
  document.getElementById("outcomeModal").classList.replace("hidden", "flex");
}

function addGoalEventRow() {
  const scorerId = document.getElementById("goalScorer").value;
  const assisterId = document.getElementById("goalAssister").value;
  
  if (!scorerId) return;
  
  const scorer = state.roster.find(p => p.id === scorerId);
  const assister = state.roster.find(p => p.id === assisterId);
  
  const eventId = "evt-" + Date.now();
  state.goalEvents.push({
    id: eventId,
    player_id: scorerId,
    assister_id: assisterId,
    scorer_name: scorer.name,
    assister_name: assister ? assister.name : null
  });
  
  const li = document.createElement("li");
  li.className = "flex items-center justify-between bg-white/5 px-2 py-1 rounded border border-white/5";
  li.id = eventId;
  li.innerHTML = `
    <span>Goal: <strong class="text-emerald-400">${scorer.name}</strong> ${assister ? `(Assist: <strong class="text-cyan-400">${assister.name}</strong>)` : ''}</span>
    <button onclick="removeGoalEventRow('${eventId}')" class="text-rose-500 hover:text-rose-400">Remove</button>
  `;
  document.getElementById("outcomeEventsList").appendChild(li);
  
  // Auto-increment our score
  const scoreInput = document.getElementById("outcomeOurScore");
  scoreInput.value = parseInt(scoreInput.value) + 1;
}

function removeGoalEventRow(id) {
  state.goalEvents = state.goalEvents.filter(e => e.id !== id);
  const row = document.getElementById(id);
  if (row) row.remove();
  
  const scoreInput = document.getElementById("outcomeOurScore");
  scoreInput.value = Math.max(0, parseInt(scoreInput.value) - 1);
}

async function saveMatchOutcome() {
  const gameId = document.getElementById("outcomeGameId").value;
  const ourScore = parseInt(document.getElementById("outcomeOurScore").value) || 0;
  const opponentScore = parseInt(document.getElementById("outcomeOpponentScore").value) || 0;
  
  if (supabaseClient) {
    try {
      // Update Game status
      const { error: gameErr } = await supabaseClient
        .from('games')
        .update({ status: 'completed', our_score: ourScore, opponent_score: opponentScore })
        .eq('id', gameId);
      if (gameErr) throw gameErr;
      
      // Save Events
      const eventsToInsert = [];
      state.goalEvents.forEach(e => {
        eventsToInsert.push({ game_id: gameId, player_id: e.player_id, event_type: 'goal' });
        if (e.assister_id) {
          eventsToInsert.push({ game_id: gameId, player_id: e.assister_id, event_type: 'assist' });
        }
      });
      
      if (eventsToInsert.length > 0) {
        const { error: evtErr } = await supabaseClient
          .from('game_events')
          .insert(eventsToInsert);
        if (evtErr) throw evtErr;
      }
      
      await loadTeamDetails(state.currentTeamId);
    } catch (e) {
      alert(e.message);
    }
  } else {
    // Local
    const idx = state.games.findIndex(g => g.id === gameId);
    if (idx !== -1) {
      state.games[idx].status = 'completed';
      state.games[idx].our_score = ourScore;
      state.games[idx].opponent_score = opponentScore;
      
      // Format events list for local stats processing
      const localEvents = [];
      state.goalEvents.forEach(e => {
        localEvents.push({ player_id: e.player_id, event_type: 'goal' });
        if (e.assister_id) {
          localEvents.push({ player_id: e.assister_id, event_type: 'assist' });
        }
      });
      state.games[idx].game_events = localEvents;
    }
    localStorage.setItem(`teamfc_games_${state.currentTeamId}`, JSON.stringify(state.games));
    renderAllViews();
  }
  
  closeOutcomeModal();
}

// --- Team Chat Rooms ---
function renderChat() {
  const container = document.getElementById("chatMessages");
  container.innerHTML = "";
  
  if (state.chatMessages.length === 0) {
    container.innerHTML = `<div class="text-center py-16 text-slate-500 italic text-sm">No messages yet. Say hello to the team!</div>`;
    return;
  }
  
  state.chatMessages.forEach(m => {
    const d = document.createElement("div");
    d.className = "flex flex-col gap-0.5 max-w-[85%] bg-slate-900 border border-white/5 p-3 rounded-xl";
    d.innerHTML = `
      <span class="text-xs text-indigo-400 font-bold flex items-center gap-2">
        ${m.sender_name} 
        <span class="text-[9px] text-slate-500 font-normal">${new Date(m.created_at || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
      </span>
      <p class="text-sm text-slate-200 mt-1">${m.message}</p>
    `;
    container.appendChild(d);
  });
  
  // Auto-scroll chat
  container.scrollTop = container.scrollHeight;
}

async function handleSendChatMessage(e) {
  e.preventDefault();
  const name = document.getElementById("chatSenderName").value.trim();
  const text = document.getElementById("chatMessageInput").value.trim();
  
  if (!name || !text) return;
  
  if (supabaseClient) {
    try {
      const { error } = await supabaseClient
        .from('chat_messages')
        .insert([{ team_id: state.currentTeamId, sender_name: name, message: text }]);
      if (error) throw error;
      await loadTeamDetails(state.currentTeamId);
    } catch (err) {
      alert(err.message);
    }
  } else {
    // Local
    const newMsg = {
      id: "msg-" + Date.now(),
      sender_name: name,
      message: text,
      created_at: new Date().toISOString()
    };
    state.chatMessages.push(newMsg);
    localStorage.setItem(`teamfc_chat_${state.currentTeamId}`, JSON.stringify(state.chatMessages));
    renderChat();
  }
  
  document.getElementById("chatMessageInput").value = "";
}

// --- 7-Day Rolling Calendar Logic ---
function renderRollingCalendar() {
  const container = document.getElementById("rollingCalendarContainer");
  if (!container) return;
  
  container.innerHTML = "";
  
  // Calculate next 7 rolling days starting today
  const days = [];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  for (let i = 0; i < 7; i++) {
    const today = new Date();
    today.setDate(today.getDate() + i);
    days.push(today);
  }
  
  days.forEach((day, index) => {
    const dayStr = day.toDateString();
    
    // Check if there are games or practices scheduled for this day in state
    const dayEvents = state.calendarEvents.filter(e => new Date(e.date).toDateString() === dayStr);
    
    // Check if any scheduled game matches this day
    const dayGames = state.games.filter(g => new Date(g.game_date).toDateString() === dayStr);
    
    // Combine events
    const allDayEvents = [...dayEvents];
    dayGames.forEach(dg => {
      allDayEvents.push({
        type: 'game',
        title: `vs ${dg.opponent}`,
        location: dg.location
      });
    });

    const isToday = index === 0;
    const card = document.createElement("div");
    
    card.className = `flex flex-col items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
      isToday 
        ? "bg-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-500/10" 
        : "bg-slate-900/50 border-white/5 hover:border-white/10"
    }`;
    card.onclick = () => {
      // Pre-fill date input in the calendar event modal
      const localISOTime = new Date(day.getTime() - (day.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
      document.getElementById("calEventDate").value = localISOTime;
      openCalendarEventModal();
    };

    let eventsHtml = "";
    if (allDayEvents.length > 0) {
      allDayEvents.forEach(e => {
        const isGame = e.type === 'game';
        eventsHtml += `
          <div class="text-[9px] font-bold text-center px-1 py-0.5 rounded leading-tight w-full truncate ${
            isGame ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-300'
          }" title="${e.title} @ ${e.location}">
            ${isGame ? '⚽' : '🏃'} ${e.title}
          </div>
        `;
      });
    } else {
      eventsHtml = `<span class="text-[9px] text-slate-500 italic">No events</span>`;
    }

    card.innerHTML = `
      <div class="text-center">
        <span class="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">${weekdays[day.getDay()]}</span>
        <span class="block text-sm font-extrabold ${isToday ? 'text-emerald-400' : 'text-slate-100'}">${day.getDate()}</span>
      </div>
      <div class="w-full space-y-1 mt-1 flex flex-col items-center">
        ${eventsHtml}
      </div>
    `;
    container.appendChild(card);
  });
}

function openCalendarEventModal() {
  document.getElementById("calendarEventModal").classList.replace("hidden", "flex");
}

function closeCalendarEventModal() {
  document.getElementById("calendarEventModal").classList.replace("flex", "hidden");
}

async function saveCalendarEvent() {
  const type = document.getElementById("calEventType").value;
  const title = document.getElementById("calEventTitle").value.trim();
  const date = document.getElementById("calEventDate").value;
  const location = document.getElementById("calEventLocation").value.trim();
  
  if (!title || !date) {
    alert("Please fill in a title and date.");
    return;
  }
  
  const newEvent = {
    id: "cal-" + Date.now(),
    type,
    title,
    date,
    location
  };
  
  // Save calendar event
  state.calendarEvents.push(newEvent);
  localStorage.setItem(`teamfc_cal_${state.currentTeamId}`, JSON.stringify(state.calendarEvents));
  
  // If it's a Game, automatically push it to the main games table/schedule as well!
  if (type === 'game') {
    if (supabaseClient) {
      try {
        await supabaseClient.from('games').insert([{
          team_id: state.currentTeamId,
          opponent: title.replace(/^vs\s+/i, ""),
          game_date: date,
          location
        }]);
        await loadTeamDetails(state.currentTeamId);
      } catch (err) {
        console.error("Failed to sync game to Supabase", err);
      }
    } else {
      state.games.push({
        id: "game-" + Date.now(),
        opponent: title.replace(/^vs\s+/i, ""),
        game_date: date,
        location,
        status: 'scheduled',
        our_score: 0,
        opponent_score: 0,
        game_events: []
      });
      localStorage.setItem(`teamfc_games_${state.currentTeamId}`, JSON.stringify(state.games));
    }
  }
  
  // Reset inputs
  document.getElementById("calEventTitle").value = "";
  document.getElementById("calEventDate").value = "";
  document.getElementById("calEventLocation").value = "";
  
  closeCalendarEventModal();
  renderAllViews();
}

// --- Saved Drills Playbook Logic ---
function renderSavedDrills() {
  const container = document.getElementById("savedDrillsContainer");
  if (!container) return;
  
  if (state.savedDrills.length === 0) {
    container.innerHTML = `<p class="text-xs text-slate-500 italic col-span-2 text-center py-4">No drills saved yet. Click "Save Drill" on generated plans to keep them here.</p>`;
    return;
  }
  
  container.innerHTML = "";
  state.savedDrills.forEach(d => {
    const card = document.createElement("div");
    card.className = "bg-white/5 border border-white/5 p-4 rounded-xl space-y-2 flex flex-col justify-between";
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
          <span class="bg-indigo-900/50 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-500/20 uppercase tracking-wider">${d.topic}</span>
          <span class="text-[10px] text-emerald-400 font-bold uppercase">${d.phase}</span>
        </div>
        <p class="text-xs text-slate-200 leading-relaxed">${d.text}</p>
      </div>
      <div class="flex justify-end pt-2">
        <button onclick="deleteSavedDrill('${d.id}')" class="text-xs text-rose-500 hover:text-rose-400 font-semibold flex items-center gap-1">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
        </button>
      </div>
    `;
    container.appendChild(card);
  });
  lucide.createIcons();
}

function saveDrill(topic, phase, text) {
  // Prevent duplicate saves
  const exists = state.savedDrills.some(d => d.text === text);
  if (exists) {
    alert("Drill is already saved to your Playbook!");
    return;
  }
  
  const newDrill = {
    id: "drill-" + Date.now(),
    topic,
    phase,
    text
  };
  
  state.savedDrills.push(newDrill);
  localStorage.setItem(`teamfc_drills_${state.currentTeamId}`, JSON.stringify(state.savedDrills));
  renderSavedDrills();
  alert("Drill saved successfully to the playbook below!");
}

function deleteSavedDrill(drillId) {
  if (!confirm("Remove this drill from your playbook?")) return;
  state.savedDrills = state.savedDrills.filter(d => d.id !== drillId);
  localStorage.setItem(`teamfc_drills_${state.currentTeamId}`, JSON.stringify(state.savedDrills));
  renderSavedDrills();
}

// --- Playbook ---
function selectPlaybookPosition(num) {
  // Update buttons state
  document.querySelectorAll(".playbook-pos-btn").forEach((btn, idx) => {
    if (idx + 1 === num) {
      btn.className = "playbook-pos-btn w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between bg-white/5 border border-emerald-500 text-emerald-400 transition-all";
    } else {
      btn.className = "playbook-pos-btn w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between hover:bg-white/5 border border-transparent text-slate-300 transition-all";
    }
  });

  const detailContainer = document.getElementById("playbookDetailContainer");
  const data = PLAYBOOK_POSITIONS[num];
  
  if (!data) return;
  
  let attrsHTML = "";
  data.attributes.forEach(attr => {
    attrsHTML += `<span class="bg-indigo-900/40 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-full text-xs font-semibold">${attr}</span>`;
  });

  detailContainer.innerHTML = `
    <div class="bg-white/5 border border-white/5 p-6 rounded-xl space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center font-black text-lg">
          ${num}
        </div>
        <h3 class="text-xl font-bold text-white">${data.title}</h3>
      </div>
      
      <p class="text-slate-300 text-sm leading-relaxed">${data.description}</p>
      
      <div>
        <h4 class="text-xs text-slate-400 font-bold uppercase mb-2">Key Competencies & Skillsets</h4>
        <div class="flex flex-wrap gap-2">
          ${attrsHTML}
        </div>
      </div>
      
      <div class="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-lg flex gap-3">
        <i data-lucide="sparkles" class="w-5 h-5 text-emerald-400 shrink-0"></i>
        <div>
          <h5 class="text-xs font-bold text-emerald-400 uppercase">Coaching Pointer</h5>
          <p class="text-xs text-slate-300 mt-0.5">${data.coachingTip}</p>
        </div>
      </div>
    </div>
  `;
  lucide.createIcons();
}

// --- 3-Timer Dashboard Logic ---
const timers = {
  game: { interval: null, ms: 0, isRunning: false, maxMs: 55 * 60 * 1000 },
  sub1: { interval: null, ms: 0, isRunning: false },
  sub2: { interval: null, ms: 0, isRunning: false }
};

function toggleTimer(type) {
  const timerObj = timers[type];
  const playBtn = document.getElementById(`btn${capitalizeFirstLetter(type)}Play`);
  const card = document.getElementById(`${type}TimerCard`);
  
  if (timerObj.isRunning) {
    // Pause
    clearInterval(timerObj.interval);
    timerObj.isRunning = false;
    playBtn.innerHTML = `<i data-lucide="play" class="w-3 h-3"></i> Resume`;
    card.classList.remove(type === 'game' ? 'timer-running' : 'timer-running-indigo');
  } else {
    // Start
    timerObj.isRunning = true;
    playBtn.innerHTML = `<i data-lucide="pause" class="w-3 h-3"></i> Pause`;
    card.classList.add(type === 'game' ? 'timer-running' : 'timer-running-indigo');
    
    let lastTime = Date.now();
    timerObj.interval = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTime;
      lastTime = now;
      
      timerObj.ms += delta;
      
      if (type === 'game' && timerObj.ms >= timerObj.maxMs) {
        timerObj.ms = timerObj.maxMs;
        clearInterval(timerObj.interval);
        timerObj.isRunning = false;
        playBtn.innerHTML = `<i data-lucide="play" class="w-3 h-3"></i> Start`;
        card.classList.remove('timer-running');
      }
      
      updateTimerDisplay(type);
    }, 100);
  }
  lucide.createIcons();
}

function resetTimer(type) {
  const timerObj = timers[type];
  const playBtn = document.getElementById(`btn${capitalizeFirstLetter(type)}Play`);
  const card = document.getElementById(`${type}TimerCard`);
  
  clearInterval(timerObj.interval);
  timerObj.ms = 0;
  timerObj.isRunning = false;
  
  playBtn.innerHTML = `<i data-lucide="play" class="w-3 h-3"></i> Start`;
  card.classList.remove(type === 'game' ? 'timer-running' : 'timer-running-indigo');
  
  updateTimerDisplay(type);
  lucide.createIcons();
}

function updateTimerDisplay(type) {
  const display = document.getElementById(`timer${capitalizeFirstLetter(type)}Display`);
  const totalSeconds = Math.floor(timers[type].ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((timers[type].ms % 1000) / 100);
  
  const minStr = String(minutes).padStart(2, '0');
  const secStr = String(seconds).padStart(2, '0');
  
  display.innerText = `${minStr}:${secStr}.${tenths}`;
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// --- Electronic Tactical Board Logic ---
function handleFormationChange() {
  const format = document.getElementById("tacticalFormat").value;
  const coords = FORMATIONS[format];
  const field = document.getElementById("tacticalSoccerField");
  
  // Clear any existing player nodes on the field
  const existingPlayers = field.querySelectorAll(".tactical-player");
  existingPlayers.forEach(p => p.remove());
  
  // Render active lineup circles on coordinates
  coords.forEach((c, idx) => {
    // Try to get player name from our roster corresponding to this position idx
    const assignedPlayer = state.roster[idx];
    const nameLabel = assignedPlayer ? assignedPlayer.name : `Empty ${c.label}`;
    const initials = assignedPlayer ? assignedPlayer.name.split(" ").map(n => n[0]).join("").substring(0,2).toUpperCase() : c.label;
    
    const node = document.createElement("div");
    node.className = "tactical-player cursor-grab hover:scale-105 transition-all";
    node.style.top = `${c.top - 4}%`;
    node.style.left = `${c.left - 4.5}%`;
    node.id = `pitch-pos-${idx}`;
    node.draggable = true;
    
    // Label tag
    const label = document.createElement("div");
    label.className = "tactical-player-label";
    label.innerText = nameLabel;
    
    node.innerHTML = `<span>${assignedPlayer ? assignedPlayer.jerseyNumber : initials}</span>`;
    node.appendChild(label);
    
    // Add drag event listeners
    node.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", node.id);
    });
    
    // Touch support for mobile/tablets
    setupTouchListeners(node);
    
    field.appendChild(node);
  });
  
  renderTacticalBench();
}

function resetBoardPositions() {
  // Snaps players back to formation coordinates
  handleFormationChange();
  
  // Reset ball to center
  const ball = document.getElementById("tacticalBall");
  if (ball) {
    ball.style.top = "50%";
    ball.style.left = "50%";
    ball.style.transform = "translate(-50%, -50%)";
  }
}

function renderTacticalBench() {
  const benchContainer = document.getElementById("benchContainer");
  benchContainer.innerHTML = "";
  
  // Any player not in the core starting formation index is on the bench
  const format = document.getElementById("tacticalFormat").value;
  const startingSlots = FORMATIONS[format].length;
  
  const benchPlayers = state.roster.slice(startingSlots);
  
  if (benchPlayers.length === 0) {
    benchContainer.innerHTML = `<p class="text-xs text-slate-500 italic w-full text-center py-2">No bench/substitute players. Add more roster players to fill bench spots.</p>`;
    return;
  }
  
  benchPlayers.forEach(p => {
    const node = document.createElement("div");
    node.className = "tactical-player bench-player cursor-grab hover:scale-105 transition-all";
    node.draggable = true;
    node.id = `bench-player-${p.id}`;
    
    const label = document.createElement("div");
    label.className = "tactical-player-label";
    label.innerText = p.name;
    
    node.innerHTML = `<span>${p.jerseyNumber}</span>`;
    node.appendChild(label);
    
    setupTouchListeners(node);
    
    benchContainer.appendChild(node);
  });
}

// --- Drag & Drop Core Event Bindings (with Touch Events for Tablets/Mobile) ---
function setupTouchListeners(el) {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartLeft = 0;
  let touchStartTop = 0;

  el.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    
    // Read current positions
    const rect = el.getBoundingClientRect();
    const parentRect = document.getElementById("tacticalSoccerField").getBoundingClientRect();
    
    touchStartLeft = ((rect.left - parentRect.left) / parentRect.width) * 100;
    touchStartTop = ((rect.top - parentRect.top) / parentRect.height) * 100;
    
    el.style.cursor = "grabbing";
    el.classList.add("scale-115");
  }, { passive: true });

  el.addEventListener("touchmove", (e) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    
    const parent = document.getElementById("tacticalSoccerField");
    const parentRect = parent.getBoundingClientRect();
    
    // Convert deltas to percentage
    const deltaXPercent = (deltaX / parentRect.width) * 100;
    const deltaYPercent = (deltaY / parentRect.height) * 100;
    
    let newLeft = touchStartLeft + deltaXPercent;
    let newTop = touchStartTop + deltaYPercent;
    
    // Bounds check
    newLeft = Math.max(2, Math.min(94, newLeft));
    newTop = Math.max(2, Math.min(94, newTop));
    
    if (el.classList.contains("bench-player")) {
      el.classList.remove("bench-player", "relative", "top-auto", "left-auto", "margin-4");
      el.style.position = "absolute";
      parent.appendChild(el);
    }
    
    el.style.left = `${newLeft}%`;
    el.style.top = `${newTop}%`;
    
    // Prevent scrolling screen while dragging players on touch devices
    e.preventDefault();
  }, { passive: false });

  el.addEventListener("touchend", () => {
    el.style.cursor = "grab";
    el.classList.remove("scale-115");
  });
}

function initDragAndDrop() {
  const field = document.getElementById("tacticalSoccerField");
  const ball = document.getElementById("tacticalBall");
  
  if (ball) {
    ball.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", "tacticalBall");
    });
    setupTouchListeners(ball);
  }
  
  field.addEventListener("dragover", (e) => {
    e.preventDefault(); 
  });
  
  field.addEventListener("drop", (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const node = document.getElementById(id);
    
    if (node) {
      const rect = field.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      const boundedX = Math.max(4, Math.min(96, x));
      const boundedY = Math.max(4, Math.min(96, y));
      
      if (node.classList.contains("bench-player")) {
        node.classList.remove("bench-player", "relative", "top-auto", "left-auto", "margin-4");
        node.style.position = "absolute";
        field.appendChild(node);
      }
      
      node.style.left = `${boundedX - 4.5}%`;
      node.style.top = `${boundedY - 4}%`;
    }
  });
}

// --- AI Coaching & Practice Plan Generator ---
function generateAIPracticePlan() {
  const focus = document.getElementById("aiFocus").value;
  const age = document.getElementById("aiAge").value.toUpperCase();
  const format = document.getElementById("aiFormat").value;
  
  const btn = document.getElementById("aiGenBtn");
  btn.disabled = true;
  btn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Generating...`;
  lucide.createIcons();
  
  // Simulate AI generation time
  setTimeout(() => {
    const plans = {
      dribbling: {
        warmup: "Gate Dribbling: Set up multiple small gates around the grid. Players dribble through as many gates as possible in 1 minute. Focus on small touches, using different parts of the foot.",
        drill1: "Red Light, Green Light: Promotes head-up dribbling. Coach holds up cones (green = fast, red = stop, yellow = dragbacks). Players must react instantly while maintaining ball control.",
        drill2: "1v1 to Endlines: Small-sided 10x15 yard grid. Attackers try to dribble past a defender to cross the endline under control. Stresses agility and body feints.",
        points: "Keep the ball close (shielding). Keep eyes up to see defenders/space. Drop shoulder to sell feints."
      },
      passing: {
        warmup: "Square Passing: Players pass around a 10x10 yard square, following their pass. Stresses body shape, open reception, and clean first touch.",
        drill1: "3v1 Keep Away (Rondo): Players in a grid pass to keep the ball from the defender in the center. Quick 1-2 touch passing, moving to support angles.",
        drill2: "Through Gate Passing Game: Set up random gates. Players earn points by successfully passing through a gate to a teammate running on the other side.",
        points: "Locked ankle, toe pointed out when passing. Positive first touch out of feet. Communicate early."
      },
      shooting: {
        warmup: "Cone Knockout: Players take turns shooting from 10 yards out, trying to knock over training cones set up on the goal line.",
        drill1: "Turn & Shoot: Coach passes to player who has their back to goal. Player must turn with first touch and fire a shot into the corners.",
        drill2: "2v1 Crossing & Finishing: Two attackers run down the wing, cross to a target striker while one defender tries to clear.",
        points: "Plant non-kicking foot next to ball. Keep chest and knee over the ball. Strike with laces, follow through."
      },
      defense: {
        warmup: "Tag Defense: Defender runs without ball trying to keep shadow distance from attacker who is changing directions.",
        drill1: "1v1 Defending (Pressure & Cover): Defender passes to attacker, then sprints to close down space. Focus on speed of approach, deceleration, and side-on stance.",
        drill2: "Delay the Attack: Defender blocks central channel, forcing attacker wide and waiting for recovery run support.",
        points: "Slightly bent knees, low center of gravity. Stand side-on, do not dive in. Wait for attacker to make a heavy touch."
      },
      tactics: {
        warmup: "Position Grid Shadowing: Players move in formation, maintaining spacing as coach walks to different parts of the field.",
        drill1: "Building from the Back: GK starts with ball. Defenders split wide to receive. Midfielders drop to show support. Goal is to pass past midfield line.",
        drill2: "Winger Overlaps: Tactical scenario focusing on fullback overlapping the winger to create crossing opportunities.",
        points: "Maintain distance and team shape. Know your numbered role (1-11). Communicate transitions."
      },
      fitness: {
        warmup: "Dynamic Jogging: High knees, butt kicks, sidesteps, and short sprints in lines.",
        drill1: "SAQ Circuit (Speed, Agility, Quickness): Speed ladder, cone weave, hurdle hops, followed by a short sprint to receive a pass.",
        drill2: "Shuttle Run Relays: Competitiveness shuttle runs where teams race to retrieve balls and dribble them back.",
        points: "High intensity effort. Correct posture in deceleration. Pump arms during sprints."
      }
    };
    
    const plan = plans[focus] || plans.dribbling;
    const output = document.getElementById("practicePlanOutput");
    
    output.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="border-b border-white/10 pb-4 flex items-center justify-between">
          <div>
            <span class="bg-indigo-900/50 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">AI Generated Practice Plan</span>
            <h3 class="text-xl font-bold text-slate-100 mt-2">Topic: ${capitalizeFirstLetter(focus)} Drill & Rotation System</h3>
            <p class="text-xs text-slate-400">Target Group: ${age} (${format}) | Duration: 55 Minutes</p>
          </div>
        </div>
        
        <!-- Warmup -->
        <div class="space-y-2 bg-slate-900/80 p-4 rounded-xl border border-white/5">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
              <i data-lucide="activity" class="w-4 h-4"></i> Phase 1: Dynamic Warmup (15 Mins)
            </h4>
            <button onclick="saveDrill('${focus}', 'Warmup', '${escapeSingleQuote(plan.warmup)}')" class="px-2 py-1 bg-white/5 hover:bg-emerald-600 hover:text-white rounded text-[10px] font-bold text-slate-300 transition-all flex items-center gap-1 no-print">
              <i data-lucide="bookmark" class="w-3 h-3"></i> Save Drill
            </button>
          </div>
          <p class="text-xs text-slate-200 leading-relaxed mt-2">${plan.warmup}</p>
        </div>

        <!-- Drill 1 -->
        <div class="space-y-2 bg-slate-900/80 p-4 rounded-xl border border-white/5">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-bold text-indigo-400 flex items-center gap-1.5">
              <i data-lucide="zap" class="w-4 h-4"></i> Phase 2: Technical Development (20 Mins)
            </h4>
            <button onclick="saveDrill('${focus}', 'Technical Development', '${escapeSingleQuote(plan.drill1)}')" class="px-2 py-1 bg-white/5 hover:bg-indigo-600 hover:text-white rounded text-[10px] font-bold text-slate-300 transition-all flex items-center gap-1 no-print">
              <i data-lucide="bookmark" class="w-3 h-3"></i> Save Drill
            </button>
          </div>
          <p class="text-xs text-slate-200 leading-relaxed mt-2">${plan.drill1}</p>
        </div>

        <!-- Drill 2 -->
        <div class="space-y-2 bg-slate-900/80 p-4 rounded-xl border border-white/5">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-bold text-indigo-400 flex items-center gap-1.5">
              <i data-lucide="swords" class="w-4 h-4"></i> Phase 3: Tactical / Match Simulation (20 Mins)
            </h4>
            <button onclick="saveDrill('${focus}', 'Match Simulation', '${escapeSingleQuote(plan.drill2)}')" class="px-2 py-1 bg-white/5 hover:bg-indigo-600 hover:text-white rounded text-[10px] font-bold text-slate-300 transition-all flex items-center gap-1 no-print">
              <i data-lucide="bookmark" class="w-3 h-3"></i> Save Drill
            </button>
          </div>
          <p class="text-xs text-slate-200 leading-relaxed mt-2">${plan.drill2}</p>
        </div>

        <!-- Coaching Points -->
        <div class="bg-amber-950/20 border border-amber-500/20 p-4 rounded-xl space-y-2">
          <h4 class="text-xs font-bold text-amber-400 flex items-center gap-1">
            <i data-lucide="lightbulb" class="w-4 h-4"></i> Core AI Coaching Points
          </h4>
          <p class="text-xs text-slate-300 italic">${plan.points}</p>
        </div>
      </div>
    `;
    
    btn.disabled = false;
    btn.innerHTML = `<i data-lucide="sparkles" class="w-4 h-4"></i> Generate Plan`;
    lucide.createIcons();
  }, 500);
}

function escapeSingleQuote(str) {
  return str.replace(/'/g, "\\'");
}

// --- Navigation Tabs Switcher ---
function switchTab(tabId) {
  // Update desktop nav tabs active classes
  document.querySelectorAll(".nav-tab").forEach(btn => {
    btn.classList.remove("text-emerald-400", "bg-white/5");
    btn.classList.add("text-slate-400", "hover:text-white");
  });
  const deskBtn = document.getElementById(`tab-btn-${tabId}`);
  if (deskBtn) {
    deskBtn.classList.add("text-emerald-400", "bg-white/5");
    deskBtn.classList.remove("text-slate-400", "hover:text-white");
  }

  // Update mobile bottom nav tabs active classes
  document.querySelectorAll(".mobile-nav-tab").forEach(btn => {
    btn.classList.replace("text-emerald-400", "text-slate-400");
  });
  const mobBtn = document.getElementById(`mob-tab-${tabId}`);
  if (mobBtn) {
    mobBtn.classList.replace("text-slate-400", "text-emerald-400");
  }

  // Toggle active views
  document.querySelectorAll(".tab-content").forEach(view => {
    view.classList.remove("active");
  });
  const activeView = document.getElementById(`tab-${tabId}`);
  if (activeView) {
    activeView.classList.add("active");
  }
}

// --- Modal open/close controllers ---
function openTeamModal() {
  document.getElementById("teamModal").classList.replace("hidden", "flex");
}
function closeTeamModal() {
  document.getElementById("teamModal").classList.replace("flex", "hidden");
}
function openRosterModal() {
  document.getElementById("rosterModal").classList.replace("hidden", "flex");
}
function closeRosterModal() {
  document.getElementById("rosterModal").classList.replace("flex", "hidden");
}
function openAddGameModal() {
  document.getElementById("addGameModal").classList.replace("hidden", "flex");
}
function closeAddGameModal() {
  document.getElementById("addGameModal").classList.replace("flex", "hidden");
}
function closeOutcomeModal() {
  document.getElementById("outcomeModal").classList.replace("flex", "hidden");
}
function openConfigModal() {
  document.getElementById("configModal").classList.replace("hidden", "flex");
}
function closeConfigModal() {
  document.getElementById("configModal").classList.replace("flex", "hidden");
}
