// Multi-user challenge tracking system
let currentUser = 'casey'; // Default user
const users = ['casey', 'kyle', 'jillian'];

// Challenge data structure for each user
const userChallenges = {
    casey: {
        workouts: { target: 8, completed: 0, type: 'monthly' },
        yoga: { target: 12, completed: 0, type: 'monthly' },
        meditation: { target: 4, completed: 0, type: 'monthly' },
        pushups: { target: 31, completed: 0, type: 'monthly' },
        reading: { target: 31, completed: 0, type: 'monthly' },
        drink: { target: 20, completed: 0, type: 'monthly' },
        movement: { target: 20, completed: 0, type: 'monthly' }
    },
    kyle: {
        workouts: { target: 8, completed: 0, type: 'monthly' },
        yoga: { target: 12, completed: 0, type: 'monthly' },
        meditation: { target: 4, completed: 0, type: 'monthly' },
        pushups: { target: 31, completed: 0, type: 'monthly' },
        reading: { target: 31, completed: 0, type: 'monthly' },
        drink: { target: 20, completed: 0, type: 'monthly' },
        movement: { target: 20, completed: 0, type: 'monthly' }
    },
    jillian: {
        workouts: { target: 8, completed: 0, type: 'monthly' },
        yoga: { target: 12, completed: 0, type: 'monthly' },
        meditation: { target: 4, completed: 0, type: 'monthly' },
        pushups: { target: 31, completed: 0, type: 'monthly' },
        reading: { target: 31, completed: 0, type: 'monthly' },
        drink: { target: 20, completed: 0, type: 'monthly' },
        movement: { target: 20, completed: 0, type: 'monthly' }
    }
};

// Daily data structure for each user
let userDailyData = {
    casey: {},
    kyle: {},
    jillian: {}
};

// Initialize the app
document.addEventListener('DOMContentLoaded', async function() {
    await loadData();
    switchUser('casey'); // Start with Casey
    updateAllProgress();
    updateStats();
    
    // Reset daily challenges at midnight
    setInterval(checkDateChange, 60000); // Check every minute
    
    // Debug: Log that the app is loaded
    console.log('October Fitness Challenge app loaded for user:', currentUser);
});

// Switch between users
function switchUser(user) {
    currentUser = user;
    
    // Update UI
    document.getElementById('currentUserDisplay').textContent = user.charAt(0).toUpperCase() + user.slice(1);
    
    // Update button states
    document.getElementById('caseyBtn').classList.toggle('active', user === 'casey');
    document.getElementById('kyleBtn').classList.toggle('active', user === 'kyle');
    document.getElementById('jillianBtn').classList.toggle('active', user === 'jillian');
    
    // Load today's daily progress for the selected user
    const today = getDateString(new Date());
    if (!userDailyData[currentUser][today]) {
        userDailyData[currentUser][today] = {
            pushups: 0,
            reading: 0,
            movement: 0,
            completed: []
        };
    }
    
    userChallenges[currentUser].pushups.completed = userDailyData[currentUser][today].pushups || 0;
    userChallenges[currentUser].reading.completed = userDailyData[currentUser][today].reading || 0;
    userChallenges[currentUser].movement.completed = userDailyData[currentUser][today].movement || 0;
    
    // Update all displays
    updateAllProgress();
    updateStats();
}

// Shared storage using JSONBin.io (free service)
const JSONBIN_BIN_ID = '65f8a1231f5677401f3b4f7e';
const JSONBIN_API_KEY = '$2a$10$V8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8';

// Load data from shared storage
async function loadData() {
    try {
        console.log('Loading data from shared storage...');
        
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
            headers: {
                'X-Master-Key': JSONBIN_API_KEY
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            const data = result.record;
            
            if (data && data.userChallenges) {
                Object.assign(userChallenges, data.userChallenges);
            }
            if (data && data.userDailyData) {
                Object.assign(userDailyData, data.userDailyData);
            }
            
            console.log('Data loaded from shared storage:', data);
        } else {
            console.log('No shared data found, using localStorage');
            loadFromLocalStorage();
        }
    } catch (error) {
        console.log('Error loading from shared storage, using localStorage:', error);
        loadFromLocalStorage();
    }
}

// Load from localStorage as fallback
function loadFromLocalStorage() {
    const savedUserChallenges = localStorage.getItem('octoberChallenge2025MultiUser');
    const savedUserDailyData = localStorage.getItem('octoberDailyData2025MultiUser');
    const savedCurrentUser = localStorage.getItem('octoberCurrentUser2025');
    
    if (savedUserChallenges) {
        const parsed = JSON.parse(savedUserChallenges);
        Object.assign(userChallenges, parsed);
    }
    
    if (savedUserDailyData) {
        userDailyData = JSON.parse(savedUserDailyData);
    }
    
    if (savedCurrentUser) {
        currentUser = savedCurrentUser;
    }
}

// Save data to shared storage
async function saveData() {
    try {
        const dataToSave = {
            userChallenges: userChallenges,
            userDailyData: userDailyData,
            currentUser: currentUser,
            lastUpdated: new Date().toISOString()
        };
        
        console.log('Saving data to shared storage:', dataToSave);
        
        const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_API_KEY
            },
            body: JSON.stringify(dataToSave)
        });
        
        if (response.ok) {
            console.log('Data saved to shared storage successfully');
        } else {
            console.log('Error saving to shared storage:', response.status);
            saveToLocalStorage();
        }
    } catch (error) {
        console.log('Error saving to shared storage:', error);
        saveToLocalStorage();
    }
}

// Fallback save to localStorage
function saveToLocalStorage() {
    localStorage.setItem('octoberChallenge2025MultiUser', JSON.stringify(userChallenges));
    localStorage.setItem('octoberDailyData2025MultiUser', JSON.stringify(userDailyData));
    localStorage.setItem('octoberCurrentUser2025', currentUser);
}

// Get date string in YYYY-MM-DD format
function getDateString(date) {
    return date.toISOString().split('T')[0];
}

// Check if date has changed (for daily resets)
function checkDateChange() {
    const today = getDateString(new Date());
    const lastCheck = localStorage.getItem('lastDateCheck');
    
    if (lastCheck !== today) {
        localStorage.setItem('lastDateCheck', today);
        
        // Reset daily challenges for new day for all users
        users.forEach(user => {
            if (!userDailyData[user][today]) {
                userDailyData[user][today] = {
                    pushups: 0,
                    reading: 0,
                    movement: 0,
                    completed: []
                };
            }
            
            // Reset daily challenge progress for current user
            userChallenges[user].pushups.completed = userDailyData[user][today].pushups || 0;
            userChallenges[user].reading.completed = userDailyData[user][today].reading || 0;
            userChallenges[user].movement.completed = userDailyData[user][today].movement || 0;
        });
        
        updateAllProgress();
        updateStats();
        generateCalendar();
        saveData();
    }
}

// Increment challenge completion
function incrementChallenge(challengeType) {
    console.log('incrementChallenge called with:', challengeType, 'for user:', currentUser);
    
    const challenges = userChallenges[currentUser];
    
    if (challenges[challengeType].type === 'monthly') {
        challenges[challengeType].completed++;
        console.log('Monthly challenge updated:', challengeType, 'completed:', challenges[challengeType].completed);
    } else {
        // For daily challenges, add to today's data
        const today = getDateString(new Date());
        if (!userDailyData[currentUser][today]) {
            userDailyData[currentUser][today] = {
                pushups: 0,
                reading: 0,
                movement: 0,
                completed: []
            };
        }
        
        // Push-ups and reading are now monthly challenges, handled above
        console.log('Daily challenge updated:', challengeType, 'completed:', challenges[challengeType].completed);
    }
    
    // Add success animation
    const button = event.target.closest('.action-btn');
    if (button) {
        button.classList.add('success-animation');
        setTimeout(() => button.classList.remove('success-animation'), 600);
    }
    
    updateAllProgress();
    updateStats();
    saveData();
    
    console.log('Progress updated and data saved');
}

// Decrement challenge completion
function decrementChallenge(challengeType) {
    console.log('decrementChallenge called with:', challengeType, 'for user:', currentUser);
    
    const challenges = userChallenges[currentUser];
    
    // Don't allow going below 0
    if (challenges[challengeType].completed > 0) {
        challenges[challengeType].completed--;
        console.log('Challenge decremented:', challengeType, 'completed:', challenges[challengeType].completed);
        
        // Add success animation
        const button = event.target.closest('.remove-btn');
        if (button) {
            button.classList.add('success-animation');
            setTimeout(() => button.classList.remove('success-animation'), 600);
        }
        
        updateAllProgress();
        updateStats();
        generateCalendar();
        saveData();
        
        console.log('Progress updated and data saved');
    } else {
        console.log('Cannot decrement below 0');
    }
}

// Update all progress bars and counters
function updateAllProgress() {
    const challenges = userChallenges[currentUser];
    console.log('Updating progress for user:', currentUser, 'challenges:', challenges);
    
    // Update individual challenge progress
    updateChallengeProgress('workouts', challenges.workouts.completed, challenges.workouts.target);
    updateChallengeProgress('yoga', challenges.yoga.completed, challenges.yoga.target);
    updateChallengeProgress('meditation', challenges.meditation.completed, challenges.meditation.target);
    updateChallengeProgress('pushups', challenges.pushups.completed, challenges.pushups.target);
    updateChallengeProgress('reading', challenges.reading.completed, challenges.reading.target);
    updateChallengeProgress('drink', challenges.drink.completed, challenges.drink.target);
    updateChallengeProgress('movement', challenges.movement.completed, challenges.movement.target);
    
    // Update remove button states
    updateRemoveButtonStates();
    
    // Update overall progress
    updateOverallProgress();
}

// Update remove button states (disable when count is 0)
function updateRemoveButtonStates() {
    const challenges = userChallenges[currentUser];
    const challengeTypes = ['workouts', 'yoga', 'meditation', 'pushups', 'reading', 'drink', 'movement'];
    
    challengeTypes.forEach(challengeType => {
        const removeBtn = document.querySelector(`[onclick="decrementChallenge('${challengeType}')"]`);
        if (removeBtn) {
            if (challenges[challengeType].completed > 0) {
                removeBtn.disabled = false;
            } else {
                removeBtn.disabled = true;
            }
        }
    });
}

// Update individual challenge progress
function updateChallengeProgress(challengeType, completed, target) {
    const percentage = Math.min(100, (completed / target) * 100);
    console.log(`Updating ${challengeType}: ${completed}/${target} (${percentage}%)`);
    
    // Update counter
    const counterElement = document.getElementById(challengeType + 'Completed');
    if (counterElement) {
        counterElement.textContent = completed;
        console.log(`Updated counter for ${challengeType} to:`, counterElement.textContent);
    } else {
        console.error(`Counter element not found for ${challengeType}`);
    }
    
    // Update progress bar
    const progressElement = document.getElementById(challengeType + 'Progress');
    if (progressElement) {
        progressElement.style.width = percentage + '%';
        console.log(`Updated progress bar for ${challengeType} to:`, percentage + '%');
    } else {
        console.error(`Progress element not found for ${challengeType}`);
    }
}

// Update overall progress
function updateOverallProgress() {
    const challenges = userChallenges[currentUser];
    let totalCompleted = 0;
    let totalTarget = 0;
    
    // Calculate monthly challenges progress (all challenges are now monthly)
    const monthlyChallenges = ['workouts', 'yoga', 'meditation', 'pushups', 'reading', 'drink', 'movement'];
    monthlyChallenges.forEach(challenge => {
        totalCompleted += challenges[challenge].completed;
        totalTarget += challenges[challenge].target;
    });
    
    const overallPercentage = Math.round((totalCompleted / totalTarget) * 100);
    
    document.getElementById('overallProgress').textContent = overallPercentage + '%';
    document.getElementById('overallProgressBar').style.width = overallPercentage + '%';
}

// Update stats section (simplified - no stats displayed)
function updateStats() {
    // No stats to update since we removed the stats section
    console.log('Stats updated for user:', currentUser);
}

// Calendar function removed since we removed the calendar section

// Utility functions for debugging (can be removed in production)
function resetAllData() {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
        localStorage.removeItem('octoberChallenge2025MultiUser');
        localStorage.removeItem('octoberDailyData2025MultiUser');
        localStorage.removeItem('octoberCurrentUser2025');
        location.reload();
    }
}

function exportData() {
    const data = {
        userChallenges: userChallenges,
        userDailyData: userDailyData,
        currentUser: currentUser,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'october-challenge-data.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + R to reset (for development)
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        resetAllData();
    }
    
    // Ctrl/Cmd + E to export
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportData();
    }
});
