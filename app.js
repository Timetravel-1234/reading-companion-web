// Reading Companion App - JavaScript

// Application State
let appState = {
    user: {
        name: "Reader",
        streak: 7,
        booksCompleted: 3,
        pagesRead: 567,
        dailyGoal: 20,
        todayPages: 15
    },
    books: [],
    moodEntries: [],
    currentBook: null,
    readingTimer: null,
    readingStartTime: null,
    currentPage: 1
};

// Sample Books Data
const SAMPLE_BOOKS = [
    {
        id: 1,
        title: "The Happiness Project",
        author: "Gretchen Rubin",
        genre: "self-help",
        totalPages: 301,
        currentPage: 45,
        status: "reading",
        rating: 4.2,
        mood: ["happy", "neutral"],
        description: "A memoir about one woman's year-long journey to discover what leads to true happiness.",
        content: generateBookContent("The Happiness Project", 301)
    },
    {
        id: 2,
        title: "Atomic Habits",
        author: "James Clear",
        genre: "self-help",
        totalPages: 320,
        currentPage: 240,
        status: "reading",
        rating: 4.8,
        mood: ["neutral", "sad"],
        description: "A comprehensive guide to building good habits and breaking bad ones.",
        content: generateBookContent("Atomic Habits", 320)
    },
    {
        id: 3,
        title: "The Midnight Library",
        author: "Matt Haig",
        genre: "fiction",
        totalPages: 288,
        currentPage: 288,
        status: "completed",
        rating: 4.5,
        mood: ["sad", "neutral"],
        description: "A novel about life, regret, and the infinite possibilities of existence.",
        content: generateBookContent("The Midnight Library", 288)
    },
    {
        id: 4,
        title: "Educated",
        author: "Tara Westover",
        genre: "biography",
        totalPages: 334,
        currentPage: 0,
        status: "want-to-read",
        rating: 4.6,
        mood: ["neutral"],
        description: "A memoir about education as the means by which we escape ourselves.",
        content: generateBookContent("Educated", 334)
    },
    {
        id: 5,
        title: "The Seven Husbands of Evelyn Hugo",
        author: "Taylor Jenkins Reid",
        genre: "romance",
        totalPages: 400,
        currentPage: 0,
        status: "want-to-read",
        rating: 4.7,
        mood: ["happy", "very-happy"],
        description: "A reclusive Hollywood icon finally tells her story to an unknown journalist.",
        content: generateBookContent("The Seven Husbands of Evelyn Hugo", 400)
    }
];

// Sample Community Data
const SAMPLE_LEADERBOARD = [
    { name: "BookWorm42", avatar: "📚", booksRead: 15, streak: 23, rank: 1 },
    { name: "ReadingQueen", avatar: "👑", booksRead: 12, streak: 18, rank: 2 },
    { name: "NovelLover", avatar: "💖", booksRead: 10, streak: 15, rank: 3 },
    { name: "PageTurner", avatar: "📖", booksRead: 8, streak: 12, rank: 4 },
    { name: "StorySeeker", avatar: "🔍", booksRead: 7, streak: 10, rank: 5 }
];

const SAMPLE_REVIEWS = [
    {
        user: "BookCritic", avatar: "🎭", book: "Atomic Habits", rating: 5,
        text: "Life-changing book! The strategies are practical and the writing is clear. Highly recommend for anyone looking to improve themselves.",
        date: "2 days ago"
    },
    {
        user: "FictionFan", avatar: "🌟", book: "The Midnight Library", rating: 4,
        text: "Beautiful exploration of parallel lives and possibilities. Made me think deeply about choices and regrets.",
        date: "1 week ago"
    },
    {
        user: "SelfHelpGuru", avatar: "🧠", book: "The Happiness Project", rating: 4,
        text: "Practical approach to happiness with real-world experiments. Some chapters were more engaging than others.",
        date: "2 weeks ago"
    }
];

// Emotion tags for different moods
const EMOTION_TAGS = {
    'very-happy': ['Excited', 'Energetic', 'Grateful', 'Joyful', 'Optimistic', 'Confident'],
    'happy': ['Content', 'Peaceful', 'Satisfied', 'Cheerful', 'Hopeful', 'Relaxed'],
    'neutral': ['Balanced', 'Focused', 'Calm', 'Steady', 'Thoughtful', 'Present'],
    'sad': ['Stressed', 'Tired', 'Overwhelmed', 'Disappointed', 'Lonely', 'Worried'],
    'very-sad': ['Depressed', 'Anxious', 'Heartbroken', 'Defeated', 'Lost', 'Hopeless']
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load data
    loadSampleData();
    
    // Show splash screen for 2 seconds
    setTimeout(() => {
        document.getElementById('splash-screen').style.display = 'none';
        document.getElementById('bottom-nav').style.display = 'flex';
        document.getElementById('main-content').style.display = 'block';
        
        // Initialize screens
        setupNavigation();
        setupMoodTracking();
        setupLibraryFilters();
        setupCommunityTabs();
        
        // Update dashboard
        updateDashboard();
        
        // Set current book if exists
        if (appState.books.length > 0) {
            const currentReading = appState.books.find(book => book.status === 'reading');
            if (currentReading) {
                appState.currentBook = currentReading;
                updateCurrentBookDisplay();
            }
        }
        
    }, 2000);
}

function loadSampleData() {
    appState.books = [...SAMPLE_BOOKS];
    
    // Calculate user stats based on books
    appState.user.booksCompleted = appState.books.filter(book => book.status === 'completed').length;
    appState.user.pagesRead = appState.books.reduce((total, book) => total + book.currentPage, 0);
}

function generateBookContent(title, totalPages) {
    const sampleTexts = [
        "In the quiet moments before dawn, when the world holds its breath and possibilities stretch endlessly ahead, we find ourselves at the crossroads of what was and what could be. The gentle whisper of turning pages echoes through libraries and reading nooks, carrying with it the promise of new worlds, fresh perspectives, and transformative ideas.",
        
        "Reading is not merely the act of consuming words on a page; it is a journey of discovery that takes us beyond the confines of our immediate experience. Each book we open is a door to understanding, a bridge to empathy, and a window into the vast tapestry of human experience.",
        
        "The beauty of literature lies not just in its ability to entertain, but in its power to challenge, inspire, and transform. Through the pages of a book, we can walk in someone else's shoes, explore distant lands, and grapple with ideas that expand our understanding of ourselves and our world.",
        
        "In our digital age, the act of reading remains one of our most intimate and personal experiences. It requires focus, patience, and presence – qualities that become increasingly precious in our fast-paced world. When we read, we give ourselves the gift of slowing down and truly engaging with ideas.",
        
        "Every reader has a story about a book that changed their life. Perhaps it was a novel that helped them understand love, a biography that inspired them to pursue their dreams, or a self-help book that provided the tools they needed to overcome challenges. These transformative reading experiences remind us of the profound impact that books can have on our lives."
    ];
    
    const content = [];
    for (let i = 1; i <= totalPages; i++) {
        const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        content.push({
            page: i,
            text: `Page ${i} of "${title}"\n\n${randomText}\n\nThis is a sample text for demonstration purposes. In a real application, this would contain the actual book content. The reading experience would be enhanced with features like bookmarking, highlighting, and note-taking capabilities.`
        });
    }
    return content;
}

// Navigation Functions
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const screenId = item.dataset.screen;
            switchScreen(screenId);
            
            // Update nav active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function switchScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    
    document.getElementById(screenId + '-screen').classList.add('active');
    
    // Load screen-specific content
    switch(screenId) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'library':
            updateLibrary();
            break;
        case 'community':
            updateCommunity();
            break;
        case 'mood':
            resetMoodTracking();
            break;
    }
}

// Dashboard Functions
function updateDashboard() {
    // Update welcome text based on time
    const hour = new Date().getHours();
    let greeting = "Good Morning! 🌅";
    if (hour >= 12 && hour < 18) greeting = "Good Afternoon! ☀️";
    else if (hour >= 18) greeting = "Good Evening! 🌙";
    
    document.querySelector('.screen-header h1').textContent = greeting;
    
    // Update stats
    document.getElementById('current-streak').textContent = appState.user.streak;
    document.getElementById('books-completed').textContent = appState.user.booksCompleted;
    document.getElementById('pages-read').textContent = appState.user.pagesRead;
    
    // Update daily goal progress
    const progressPercent = Math.min((appState.user.todayPages / appState.user.dailyGoal) * 100, 100);
    document.getElementById('daily-progress').style.width = progressPercent + '%';
    document.getElementById('progress-text').textContent = `${appState.user.todayPages} / ${appState.user.dailyGoal} pages`;
    
    // Update goal badge
    if (progressPercent >= 100) {
        document.getElementById('goal-badge').textContent = '🏆';
    }
    
    // Update recommendations
    updateRecommendations();
}

function updateCurrentBookDisplay() {
    if (appState.currentBook) {
        const book = appState.currentBook;
        document.getElementById('current-book-title').textContent = book.title;
        document.getElementById('current-book-author').textContent = `by ${book.author}`;
        
        const progressPercent = (book.currentPage / book.totalPages) * 100;
        document.getElementById('book-progress').style.width = progressPercent + '%';
        document.getElementById('book-progress-text').textContent = Math.round(progressPercent) + '%';
    }
}

function updateRecommendations() {
    const grid = document.getElementById('recommendations-grid');
    const recommendations = appState.books.filter(book => book.status === 'want-to-read').slice(0, 3);
    
    grid.innerHTML = recommendations.map(book => `
        <div class="book-card" onclick="selectBook(${book.id})">
            <div class="book-card-cover">📖</div>
            <h4>${book.title}</h4>
            <p>by ${book.author}</p>
            <div class="book-rating">
                <span>⭐ ${book.rating}</span>
            </div>
        </div>
    `).join('');
}

function continueReading() {
    if (appState.currentBook) {
        switchToReading(appState.currentBook);
        switchScreen('reading');
        
        // Update nav
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelector('[data-screen="reading"]').classList.add('active');
    } else {
        alert('Please select a book from your library first!');
        switchScreen('library');
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelector('[data-screen="library"]').classList.add('active');
    }
}

// Mood Tracking Functions
function setupMoodTracking() {
    const moodButtons = document.querySelectorAll('.mood-button');
    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectMood(button.dataset.mood);
        });
    });
}

function selectMood(moodType) {
    // Update UI
    document.querySelectorAll('.mood-button').forEach(btn => btn.classList.remove('selected'));
    document.querySelector(`[data-mood="${moodType}"]`).classList.add('selected');
    
    // Show emotion tags
    showEmotionTags(moodType);
    
    // Show mood recommendations
    showMoodRecommendations(moodType);
    
    // Store selected mood
    appState.selectedMood = moodType;
}

function showEmotionTags(moodType) {
    const tagsSection = document.getElementById('emotion-tags');
    const tagsContainer = tagsSection.querySelector('.tags-container');
    const tags = EMOTION_TAGS[moodType];
    
    tagsContainer.innerHTML = tags.map(tag => `
        <button class="emotion-tag" onclick="toggleTag(this)">${tag}</button>
    `).join('');
    
    tagsSection.style.display = 'block';
    
    // Show notes section
    document.getElementById('mood-notes').style.display = 'block';
    document.getElementById('save-mood-btn').style.display = 'block';
}

function toggleTag(tagElement) {
    tagElement.classList.toggle('selected');
}

function showMoodRecommendations(moodType) {
    const recommendationsSection = document.getElementById('mood-recommendations');
    const grid = document.getElementById('mood-books-grid');
    
    const moodBooks = appState.books.filter(book => book.mood.includes(moodType));
    
    grid.innerHTML = moodBooks.map(book => `
        <div class="book-card" onclick="selectBook(${book.id})">
            <div class="book-card-cover">📖</div>
            <h4>${book.title}</h4>
            <p>by ${book.author}</p>
            <div class="book-rating">
                <span>⭐ ${book.rating}</span>
            </div>
        </div>
    `).join('');
    
    recommendationsSection.style.display = 'block';
}

function saveMoodEntry() {
    const selectedTags = Array.from(document.querySelectorAll('.emotion-tag.selected')).map(tag => tag.textContent);
    const note = document.getElementById('mood-note-text').value;
    
    const moodEntry = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        mood: appState.selectedMood,
        tags: selectedTags,
        note: note,
        timestamp: new Date()
    };
    
    appState.moodEntries.push(moodEntry);
    
    // Show success message
    alert('Mood entry saved! 🎉\n\nBased on your mood, check out our recommendations below.');
    
    // Reset form for next time
    setTimeout(() => {
        resetMoodTracking();
    }, 1000);
}

function resetMoodTracking() {
    document.querySelectorAll('.mood-button').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('emotion-tags').style.display = 'none';
    document.getElementById('mood-notes').style.display = 'none';
    document.getElementById('mood-recommendations').style.display = 'none';
    document.getElementById('save-mood-btn').style.display = 'none';
    document.getElementById('mood-note-text').value = '';
}

// Library Functions
function setupLibraryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            filterLibrary(filter);
        });
    });
}

function updateLibrary() {
    filterLibrary('all');
}

function filterLibrary(filter) {
    let filteredBooks = appState.books;
    
    if (filter !== 'all') {
        filteredBooks = appState.books.filter(book => book.status === filter);
    }
    
    const grid = document.getElementById('library-grid');
    grid.innerHTML = filteredBooks.map(book => `
        <div class="library-book-card" onclick="openBookDetails(${book.id})">
            <div class="book-card-cover">📖</div>
            <h4>${book.title}</h4>
            <p>by ${book.author}</p>
            <div class="book-rating">
                <span>⭐ ${book.rating}</span>
            </div>
            <div class="progress-bar small" style="margin: 0.5rem 0;">
                <div class="progress-fill" style="width: ${(book.currentPage / book.totalPages) * 100}%"></div>
            </div>
            <p style="font-size: 0.8rem; color: #666;">${book.currentPage} / ${book.totalPages} pages</p>
            <div style="margin-top: 1rem;">
                <button class="btn btn-primary" onclick="event.stopPropagation(); selectBook(${book.id})" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
                    ${book.status === 'reading' ? 'Continue' : book.status === 'completed' ? 'Read Again' : 'Start Reading'}
                </button>
            </div>
        </div>
    `).join('');
}

function selectBook(bookId) {
    const book = appState.books.find(b => b.id === bookId);
    if (book) {
        appState.currentBook = book;
        if (book.status === 'want-to-read') {
            book.status = 'reading';
        }
        updateCurrentBookDisplay();
        alert(`📚 "${book.title}" selected as your current book!`);
    }
}

function openBookDetails(bookId) {
    const book = appState.books.find(b => b.id === bookId);
    if (book) {
        alert(`📖 ${book.title}\n👤 ${book.author}\n🏷️ ${book.genre}\n⭐ ${book.rating}/5\n📄 ${book.totalPages} pages\n\n${book.description}`);
    }
}

function addBook() {
    document.getElementById('book-modal').classList.add('show');
}

function saveNewBook() {
    const title = document.getElementById('book-title-input').value;
    const author = document.getElementById('book-author-input').value;
    const genre = document.getElementById('book-genre-input').value;
    const pages = parseInt(document.getElementById('book-pages-input').value);
    
    if (!title || !author || !genre || !pages) {
        alert('Please fill in all fields!');
        return;
    }
    
    const newBook = {
        id: Date.now(),
        title: title,
        author: author,
        genre: genre,
        totalPages: pages,
        currentPage: 0,
        status: 'want-to-read',
        rating: 4.0,
        mood: ['neutral'],
        description: `A new book added by the user: ${title} by ${author}.`,
        content: generateBookContent(title, pages)
    };
    
    appState.books.push(newBook);
    
    // Clear form
    document.getElementById('book-title-input').value = '';
    document.getElementById('book-author-input').value = '';
    document.getElementById('book-genre-input').value = '';
    document.getElementById('book-pages-input').value = '';
    
    closeModal('book-modal');
    updateLibrary();
    
    alert(`📚 "${title}" added to your library!`);
}

// Community Functions
function setupCommunityTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const tab = btn.dataset.tab;
            switchCommunityTab(tab);
        });
    });
}

function updateCommunity() {
    updateLeaderboard();
    updateReviews();
}

function switchCommunityTab(tab) {
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tab + '-tab').classList.add('active');
}

function updateLeaderboard() {
    const list = document.getElementById('leaderboard-list');
    list.innerHTML = SAMPLE_LEADERBOARD.map(user => `
        <div class="leaderboard-entry">
            <div class="rank ${user.rank <= 3 ? (user.rank === 1 ? 'gold' : user.rank === 2 ? 'silver' : 'bronze') : ''}">${user.rank}</div>
            <div class="user-avatar">${user.avatar}</div>
            <div class="user-info">
                <h4>${user.name}</h4>
                <p>📚 ${user.booksRead} books • 🔥 ${user.streak} day streak</p>
            </div>
            <div class="user-stats">
                <div style="font-weight: 700; color: #58cc02;">${user.booksRead}</div>
                <div style="font-size: 0.8rem; color: #666;">books</div>
            </div>
        </div>
    `).join('');
}

function updateReviews() {
    const list = document.getElementById('reviews-list');
    list.innerHTML = SAMPLE_REVIEWS.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="review-avatar">${review.avatar}</div>
                <div class="review-info">
                    <h5>${review.user}</h5>
                    <div class="review-meta">reviewed "${review.book}" • ${review.date}</div>
                </div>
                <div class="review-rating">${'⭐'.repeat(review.rating)}</div>
            </div>
            <div class="review-text">${review.text}</div>
        </div>
    `).join('');
}

// Reading Functions
function switchToReading(book) {
    appState.currentBook = book;
    appState.currentPage = book.currentPage + 1;
    
    document.getElementById('reading-book-title').textContent = book.title;
    updateReadingProgress();
    updateReadingContent();
    
    // Setup page slider
    const slider = document.getElementById('page-slider');
    slider.min = 1;
    slider.max = book.totalPages;
    slider.value = appState.currentPage;
    
    slider.addEventListener('input', (e) => {
        appState.currentPage = parseInt(e.target.value);
        updateReadingProgress();
        updateReadingContent();
    });
    
    // Start reading timer
    startReadingTimer();
}

function updateReadingProgress() {
    const book = appState.currentBook;
    if (book) {
        document.getElementById('reading-progress').textContent = `Page ${appState.currentPage} of ${book.totalPages}`;
        document.getElementById('page-indicator').textContent = `${appState.currentPage} / ${book.totalPages}`;
        document.getElementById('page-slider').value = appState.currentPage;
    }
}

function updateReadingContent() {
    const book = appState.currentBook;
    if (book && book.content && book.content[appState.currentPage - 1]) {
        const pageContent = book.content[appState.currentPage - 1];
        document.getElementById('reading-text').innerHTML = `<p>${pageContent.text.replace(/\n/g, '</p><p>')}</p>`;
    }
}

function previousPage() {
    if (appState.currentPage > 1) {
        appState.currentPage--;
        updateReadingProgress();
        updateReadingContent();
    }
}

function nextPage() {
    const book = appState.currentBook;
    if (book && appState.currentPage < book.totalPages) {
        appState.currentPage++;
        updateReadingProgress();
        updateReadingContent();
        
        // Update book progress
        if (appState.currentPage > book.currentPage) {
            book.currentPage = appState.currentPage;
            appState.user.pagesRead++;
            appState.user.todayPages++;
            
            // Check if book is completed
            if (appState.currentPage >= book.totalPages) {
                book.status = 'completed';
                alert('🎉 Congratulations! You\'ve finished reading "' + book.title + '"!');
                appState.user.booksCompleted++;
            }
        }
    }
}

function startReadingTimer() {
    appState.readingStartTime = Date.now();
    appState.readingTimer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (appState.readingStartTime) {
        const elapsed = Date.now() - appState.readingStartTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        document.getElementById('timer-display').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function exitReading() {
    if (appState.readingTimer) {
        clearInterval(appState.readingTimer);
        appState.readingTimer = null;
    }
    
    // Switch back to dashboard
    switchScreen('dashboard');
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector('[data-screen="dashboard"]').classList.add('active');
}

function toggleReadingSettings() {
    alert('⚙️ Reading Settings\n\n• Font Size: Medium\n• Background: Light\n• Reading Mode: Normal\n\nSettings can be customized in a full version!');
}

// Modal Functions
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Click outside modal to close
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

// Prevent body scroll when modal is open
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('show', () => {
        document.body.style.overflow = 'hidden';
    });
    modal.addEventListener('hide', () => {
        document.body.style.overflow = 'auto';
    });
});
