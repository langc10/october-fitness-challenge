// Multi-user challenge tracking system
let currentUser = 'casey'; // Default user
const users = ['casey', 'kyle'];

// Challenge data structure for each user
const userChallenges = {
    casey: {
        workouts: { target: 8, completed: 0, type: 'monthly' },
        yoga: { target: 12, completed: 0, type: 'monthly' },
        meditation: { target: 4, completed: 0, type: 'monthly' },
        pushups: { target: 100, completed: 0, type: 'daily' },
        reading: { target: 10, completed: 0, type: 'daily' },
        drink: { target: 20, completed: 0, type: 'monthly' },
        movement: { target: 2.0, completed: 0, type: 'daily' }
    },
    kyle: {
        workouts: { target: 8, completed: 0, type: 'monthly' },
        yoga: { target: 12, completed: 0, type: 'monthly' },
        meditation: { target: 4, completed: 0, type: 'monthly' },
        pushups: { target: 100, completed: 0, type: 'daily' },
        reading: { target: 10, completed: 0, type: 'daily' },
        drink: { target: 20, completed: 0, type: 'monthly' },
        movement: { target: 2.0, completed: 0, type: 'daily' }
    }
};

// Daily data structure for each user
let userDailyData = {
    casey: {},
    kyle: {}
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    switchUser('casey'); // Start with Casey
    generateCalendar();
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
    generateCalendar();
}

// Load data from localStorage
function loadData() {
    const savedUserChallenges = localStorage.getItem('octoberChallenge2024MultiUser');
    const savedUserDailyData = localStorage.getItem('octoberDailyData2024MultiUser');
    const savedCurrentUser = localStorage.getItem('octoberCurrentUser2024');
    
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

// Save data to localStorage
function saveData() {
    localStorage.setItem('octoberChallenge2024MultiUser', JSON.stringify(userChallenges));
    localStorage.setItem('octoberDailyData2024MultiUser', JSON.stringify(userDailyData));
    localStorage.setItem('octoberCurrentUser2024', currentUser);
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
        
        if (challengeType === 'pushups') {
            challenges.pushups.completed++;
            userDailyData[currentUser][today].pushups = challenges.pushups.completed;
        } else if (challengeType === 'reading') {
            challenges.reading.completed++;
            userDailyData[currentUser][today].reading = challenges.reading.completed;
        } else if (challengeType === 'movement') {
            challenges.movement.completed++;
            userDailyData[currentUser][today].movement = challenges.movement.completed;
        }
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
    generateCalendar();
    saveData();
    
    console.log('Progress updated and data saved');
}

// Add pushups with custom amount
function addPushups() {
    const input = document.getElementById('pushupsInput');
    const amount = parseInt(input.value);
    
    if (amount && amount > 0) {
        const today = getDateString(new Date());
        if (!userDailyData[currentUser][today]) {
            userDailyData[currentUser][today] = {
                pushups: 0,
                reading: 0,
                movement: 0,
                completed: []
            };
        }
        
        userChallenges[currentUser].pushups.completed = Math.min(100, userChallenges[currentUser].pushups.completed + amount);
        userDailyData[currentUser][today].pushups = userChallenges[currentUser].pushups.completed;
        
        input.value = '';
        updateAllProgress();
        updateStats();
        saveData();
        
        // Success animation
        const button = event.target.closest('.action-btn');
        button.classList.add('success-animation');
        setTimeout(() => button.classList.remove('success-animation'), 600);
    }
}

// Add reading pages
function addReading() {
    const input = document.getElementById('readingInput');
    const amount = parseInt(input.value);
    
    if (amount && amount > 0) {
        const today = getDateString(new Date());
        if (!userDailyData[currentUser][today]) {
            userDailyData[currentUser][today] = {
                pushups: 0,
                reading: 0,
                movement: 0,
                completed: []
            };
        }
        
        userChallenges[currentUser].reading.completed = Math.min(10, userChallenges[currentUser].reading.completed + amount);
        userDailyData[currentUser][today].reading = userChallenges[currentUser].reading.completed;
        
        input.value = '';
        updateAllProgress();
        updateStats();
        saveData();
        
        // Success animation
        const button = event.target.closest('.action-btn');
        button.classList.add('success-animation');
        setTimeout(() => button.classList.remove('success-animation'), 600);
    }
}

// Add movement miles
function addMovement() {
    const input = document.getElementById('movementInput');
    const amount = parseFloat(input.value);
    
    if (amount && amount > 0) {
        const today = getDateString(new Date());
        if (!userDailyData[currentUser][today]) {
            userDailyData[currentUser][today] = {
                pushups: 0,
                reading: 0,
                movement: 0,
                completed: []
            };
        }
        
        userChallenges[currentUser].movement.completed = Math.min(20, userChallenges[currentUser].movement.completed + amount);
        userDailyData[currentUser][today].movement = userChallenges[currentUser].movement.completed;
        
        input.value = '';
        updateAllProgress();
        updateStats();
        saveData();
        
        // Success animation
        const button = event.target.closest('.action-btn');
        button.classList.add('success-animation');
        setTimeout(() => button.classList.remove('success-animation'), 600);
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
    
    // Update overall progress
    updateOverallProgress();
}

// Update individual challenge progress
function updateChallengeProgress(challengeType, completed, target) {
    const percentage = Math.min(100, (completed / target) * 100);
    console.log(`Updating ${challengeType}: ${completed}/${target} (${percentage}%)`);
    
    // Update counter
    const counterElement = document.getElementById(challengeType + 'Completed');
    if (counterElement) {
        counterElement.textContent = challengeType === 'movement' ? completed.toFixed(1) : completed;
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
    
    // Calculate monthly challenges progress
    const monthlyChallenges = ['workouts', 'yoga', 'meditation', 'drink'];
    monthlyChallenges.forEach(challenge => {
        totalCompleted += challenges[challenge].completed;
        totalTarget += challenges[challenge].target;
    });
    
    // Calculate daily challenges progress (based on today's completion)
    const dailyChallenges = ['pushups', 'reading', 'movement'];
    dailyChallenges.forEach(challenge => {
        const completed = challenges[challenge].completed;
        const target = challenges[challenge].target;
        totalCompleted += Math.min(1, completed / target); // Normalize daily to 0-1
        totalTarget += 1;
    });
    
    const overallPercentage = Math.round((totalCompleted / totalTarget) * 100);
    
    document.getElementById('overallProgress').textContent = overallPercentage + '%';
    document.getElementById('overallProgressBar').style.width = overallPercentage + '%';
}

// Update stats section
function updateStats() {
    const challenges = userChallenges[currentUser];
    const today = getDateString(new Date());
    
    // Calculate today's score (0-7 points)
    let todayScore = 0;
    if (challenges.pushups.completed >= challenges.pushups.target) todayScore++;
    if (challenges.reading.completed >= challenges.reading.target) todayScore++;
    if (challenges.movement.completed >= challenges.movement.target) todayScore++;
    
    document.getElementById('todayScore').textContent = todayScore;
    
    // Calculate streak
    let streak = 0;
    const sortedDates = Object.keys(userDailyData[currentUser]).sort();
    for (let i = sortedDates.length - 1; i >= 0; i--) {
        const date = sortedDates[i];
        const dayData = userDailyData[currentUser][date];
        if (dayData && dayData.pushups >= 100 && dayData.reading >= 10 && dayData.movement >= 2.0) {
            streak++;
        } else {
            break;
        }
    }
    
    document.getElementById('streakDays').textContent = streak;
    
    // Calculate total score
    let totalScore = 0;
    Object.values(userDailyData[currentUser]).forEach(dayData => {
        if (dayData && dayData.pushups >= 100) totalScore++;
        if (dayData && dayData.reading >= 10) totalScore++;
        if (dayData && dayData.movement >= 2.0) totalScore++;
    });
    
    // Add monthly challenge completions
    totalScore += challenges.workouts.completed + challenges.yoga.completed + 
                  challenges.meditation.completed + challenges.drink.completed;
    
    document.getElementById('totalScore').textContent = totalScore;
}

// Generate calendar
function generateCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day header';
        dayElement.textContent = day;
        calendarGrid.appendChild(dayElement);
    });
    
    // Generate calendar days
    const firstDay = new Date(2024, 9, 1); // October 1, 2024
    const lastDay = new Date(2024, 9, 31); // October 31, 2024
    
    // Add days before October
    const startDay = firstDay.getDay();
    for (let i = 0; i < startDay; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day other-month';
        dayElement.textContent = '';
        calendarGrid.appendChild(dayElement);
    }
    
    // Add October days
    for (let day = 1; day <= 31; day++) {
        const dayElement = document.createElement('div');
        const dateString = `2024-10-${day.toString().padStart(2, '0')}`;
        const dayData = userDailyData[currentUser][dateString];
        
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        // Check if today
        const today = new Date();
        const isToday = today.getFullYear() === 2024 && 
                       today.getMonth() === 9 && 
                       today.getDate() === day;
        
        if (isToday) {
            dayElement.classList.add('today');
        } else if (dayData) {
            // Check completion status
            const completed = dayData.pushups >= 100 && 
                            dayData.reading >= 10 && 
                            dayData.movement >= 2.0;
            const partial = dayData.pushups > 0 || dayData.reading > 0 || dayData.movement > 0;
            
            if (completed) {
                dayElement.classList.add('completed');
            } else if (partial) {
                dayElement.classList.add('partial');
            }
        }
        
        calendarGrid.appendChild(dayElement);
    }
}

// Utility functions for debugging (can be removed in production)
function resetAllData() {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
        localStorage.removeItem('octoberChallenge2024MultiUser');
        localStorage.removeItem('octoberDailyData2024MultiUser');
        localStorage.removeItem('octoberCurrentUser2024');
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
