// Clicker Game v1.4 - All Counters Fix

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element Getters ---
    const cookie = document.getElementById('cookie');
    const cookieCount = document.getElementById('cookie-count');
    const totalCookiesBakedDisplay = document.getElementById('total-cookies-baked');
    const buyGrandma = document.getElementById('buy-grandma');
    const grandmaCount = document.getElementById('grandma-count');
    const grandmaBakedCount = document.getElementById('grandma-baked-count');
    const grandmaContainer = document.getElementById('grandma-container');
    const buyFactory = document.getElementById('buy-factory');
    const factoryCount = document.getElementById('factory-count');
    const factoryBakedCount = document.getElementById('factory-baked-count');
    const factoryContainer = document.getElementById('factory-container');
    const saveButton = document.getElementById('save-button');
    const resetButton = document.getElementById('reset-button');
    const achievementList = document.getElementById('achievement-list');
    const achievementToast = document.getElementById('achievement-toast');
    const goldenCookie = document.getElementById('golden-cookie');
    const bonusDisplay = document.getElementById('bonus-display');

    // --- Game State Variables ---
    let count = 0;
    let totalClicks = 0;
    let totalCookiesBaked = 0;
    let grandma = 0;
    let grandmaCost = 50;
    let grandmaBaked = 0;
    let factory = 0;
    let factoryCost = 1000;
    let factoryBaked = 0;
    let cps = 0;
    let bonusMultiplier = 1;
    let goldenCookieClicks = 0; // Added for golden cookie achievements

    // --- Achievements (Master Definition) ---
    const achievements = {
        // Click Achievements
        'click1': { name: 'はじめの一歩', description: '初めてクッキーをクリックする', unlocked: false, category: 'click', difficulty: 'common' },
        'click1000': { name: '指ならし', description: '1,000回クリックする', unlocked: false, category: 'click', difficulty: 'common' },
        'click10000': { name: 'クリッカーの達人', description: '10,000回クリックする', unlocked: false, category: 'click', difficulty: 'uncommon' },
        'click100000': { name: 'マウスクラッシャー', description: '100,000回クリックする', unlocked: false, category: 'click', difficulty: 'rare' },

        // Baking Achievements
        'bake1000': { name: 'クッキーベイカー', description: '合計で1,000枚のクッキーを焼く', unlocked: false, category: 'baking', difficulty: 'common' },
        'bake250k': { name: 'ブロンズクッキー', description: '25万枚のクッキーを焼く', unlocked: false, category: 'baking', difficulty: 'common' },
        'bake500k': { name: 'シルバークッキー', description: '50万枚のクッキーを焼く', unlocked: false, category: 'baking', difficulty: 'uncommon' },
        'bake750k': { name: 'ゴールドクッキー', description: '75万枚のクッキーを焼く', unlocked: false, category: 'baking', difficulty: 'uncommon' },
        'bake1M': { name: 'クッキー起業家', description: '合計で100万枚のクッキーを焼く', unlocked: false, category: 'baking', difficulty: 'rare' },
        'bake2.5M': { name: 'プラチナクッキー', description: '250万枚のクッキーを焼く', unlocked: false, category: 'baking', difficulty: 'rare' },
        'bake5M': { name: 'ダイヤモンドクッキー', description: '500万枚のクッキーを焼く', unlocked: false, category: 'baking', difficulty: 'rare' },
        'bake25M': { name: 'クッキー男爵', description: '2500万枚のクッキーを焼く', unlocked: false, category: 'baking', difficulty: 'epic' },
        'bake50M': { name: 'クッキー伯爵', description: '5000万枚のクッキーを焼く', unlocked: false, category: 'baking', difficulty: 'epic' },
        'bake75M': { name: 'クッキー侯爵', description: '7500万枚のクッキーを焼く', unlocked: false, category: 'baking', difficulty: 'epic' },
        'bake1B': { name: 'クッキー大君', description: '合計で1億枚のクッキーを焼く', unlocked: false, category: 'baking', difficulty: 'epic' },
        'bake10B': { name: 'クッキー惑星', description: '合計で10億枚のクッキーを焼く', unlocked: false, category: 'baking', difficulty: 'epic' },
        'bake100B': { name: 'クッキー銀河', description: '合計で100億枚のクッキーを焼く', unlocked: false, category: 'baking', difficulty: 'epic' },

        // Building Achievements
        'grandma1': { name: 'おばあちゃん登場', description: '初めておばあちゃんを雇う', unlocked: false, category: 'building', difficulty: 'common' },
        'grandma10': { name: 'おばあちゃん部隊', description: 'おばあちゃんを10人雇う', unlocked: false, category: 'building', difficulty: 'uncommon' },
        'grandma25': { name: 'おばあちゃん軍団', description: 'おばあちゃんを25人雇う', unlocked: false, category: 'building', difficulty: 'uncommon' },
        'grandma50': { name: 'おばあちゃん帝国', description: 'おばあちゃんを50人雇う', unlocked: false, category: 'building', difficulty: 'rare' },
        'grandma100': { name: 'グランマポカリプス', description: 'おばあちゃんを100人雇う', unlocked: false, category: 'building', difficulty: 'epic' },

        'factory1': { name: '近代化', description: '初めて工場を建設する', unlocked: false, category: 'building', difficulty: 'common' },
        'factory25': { name: '産業革命', description: '工場を25個建設する', unlocked: false, category: 'building', difficulty: 'rare' },
        'factory50': { name: 'オートメーションの鬼', description: '工場を50個建設する', unlocked: false, category: 'building', difficulty: 'epic' },
        'factory100': { name: 'クッキー製造国家', description: '工場を100個建設する', unlocked: false, category: 'building', difficulty: 'epic' },

        // Special Achievements
        'gold1': { name: '幸運の始まり', description: '初めてゴールデンクッキーをクリックする', unlocked: false, category: 'special', difficulty: 'uncommon' },
        'gold10': { name: 'ラッキーコレクター', description: 'ゴールデンクッキーを10回クリックする', unlocked: false, category: 'special', difficulty: 'rare' },
        'gold50': { name: '幸運の探求者', description: 'ゴールデンクッキーを50回クリックする', unlocked: false, category: 'special', difficulty: 'epic' },
    };

    // --- Core Game Logic ---
    function loadGame() {
        const savedGame = localStorage.getItem('clickerGameSave');
        if (savedGame) {
            const gameState = JSON.parse(savedGame);
            count = gameState.count || 0;
            totalClicks = gameState.totalClicks || 0;
            totalCookiesBaked = gameState.totalCookiesBaked || 0;
            grandma = gameState.grandma || 0;
            grandmaCost = gameState.grandmaCost || 50;
            grandmaBaked = gameState.grandmaBaked || 0;
            factory = gameState.factory || 0;
            factoryCost = gameState.factoryCost || 1000;
            factoryBaked = gameState.factoryBaked || 0;
            goldenCookieClicks = gameState.goldenCookieClicks || 0; // Load golden cookie clicks

            if (gameState.achievements) {
                for (const id in achievements) {
                    if (gameState.achievements[id]) {
                        achievements[id].unlocked = gameState.achievements[id].unlocked;
                    }
                }
            }
        }
    }

    function saveGame() {
        const gameState = {
            count, totalClicks, totalCookiesBaked, grandma, grandmaCost, grandmaBaked, factory, factoryCost, factoryBaked, achievements, goldenCookieClicks
        };
        localStorage.setItem('clickerGameSave', JSON.stringify(gameState));
    }

    function resetGame() {
        if (confirm("本当にリセットしますか？")) {
            localStorage.removeItem('clickerGameSave');
            location.reload();
        }
    }

    function calculateCPS() {
        const baseCps = (grandma * 1) + (factory * 10);
        cps = baseCps * bonusMultiplier;
    }

    function produce() {
        calculateCPS();
        const production = cps / 10; // Called every 100ms
        count += production;
        totalCookiesBaked += production;
        grandmaBaked += (grandma * bonusMultiplier) / 10;
        factoryBaked += (factory * 10 * bonusMultiplier) / 10;
        checkAchievements();
        update(); // Ensure update is called after production
    }

    // --- UI Update & Display Logic ---
    function update() {
        cookieCount.textContent = Math.floor(count).toLocaleString();
        totalCookiesBakedDisplay.textContent = Math.floor(totalCookiesBaked).toLocaleString();
        grandmaCount.textContent = grandma.toLocaleString();
        grandmaBakedCount.textContent = Math.floor(grandmaBaked).toLocaleString();
        buyGrandma.textContent = `おばあちゃんを雇う (コスト: ${Math.ceil(grandmaCost).toLocaleString()})`;
        factoryCount.textContent = factory.toLocaleString();
        factoryBakedCount.textContent = Math.floor(factoryBaked).toLocaleString();
        buyFactory.textContent = `工場を建設する (コスト: ${Math.ceil(factoryCost).toLocaleString()})`;
        updateGrandmaDisplay();
        updateFactoryDisplay();
    }

    function updateGrandmaDisplay() {
        grandmaContainer.innerHTML = '';
        const groupsOfTen = Math.floor(grandma / 10);
        const remainder = grandma % 10;

        for (let i = 0; i < groupsOfTen; i++) {
            const groupDiv = document.createElement('div');
            groupDiv.classList.add('grandma-group');
            const grandmaImg = document.createElement('img');
            grandmaImg.src = 'images/grandma.png';
            grandmaImg.classList.add('grandma-img');
            const countSpan = document.createElement('span');
            countSpan.classList.add('item-count');
            countSpan.textContent = 'x10';
            groupDiv.appendChild(grandmaImg);
            groupDiv.appendChild(countSpan);
            grandmaContainer.appendChild(groupDiv);
        }

        for (let i = 0; i < remainder; i++) {
            const grandmaImg = document.createElement('img');
            grandmaImg.src = 'images/grandma.png';
            grandmaImg.classList.add('grandma-img');
            grandmaContainer.appendChild(grandmaImg);
        }
    }

    function updateFactoryDisplay() {
        factoryContainer.innerHTML = '';
        const groupsOfTen = Math.floor(factory / 10);
        const remainder = factory % 10;

        for (let i = 0; i < groupsOfTen; i++) {
            const groupDiv = document.createElement('div');
            groupDiv.classList.add('factory-group');
            const factoryImg = document.createElement('img');
            factoryImg.src = 'images/factory.png';
            factoryImg.classList.add('factory-img');
            const countSpan = document.createElement('span');
            countSpan.classList.add('item-count');
            countSpan.textContent = 'x10';
            groupDiv.appendChild(factoryImg);
            groupDiv.appendChild(countSpan);
            factoryContainer.appendChild(groupDiv);
        }

        for (let i = 0; i < remainder; i++) {
            const factoryImg = document.createElement('img');
            factoryImg.src = 'images/factory.png';
            factoryImg.classList.add('factory-img');
            factoryContainer.appendChild(factoryImg);
        }
    }

    function showPlusOne(e) {
        const plusOne = document.createElement('div');
        plusOne.textContent = '+1';
        plusOne.classList.add('plus-one');
        plusOne.style.left = `${e.clientX}px`;
        plusOne.style.top = `${e.clientY}px`;
        document.body.appendChild(plusOne);
        setTimeout(() => plusOne.remove(), 1000);
    }

    // --- Event Listeners ---
    cookie.addEventListener('click', (e) => {
        count++;
        totalClicks++;
        totalCookiesBaked++; // Manual clicks also add to total baked
        new Audio('sounds/click.mp3').play().catch(err => {});
        showPlusOne(e);
        checkAchievement('click1');
        update(); // Update after click
    });

    buyGrandma.addEventListener('click', () => {
        if (count >= grandmaCost) {
            count -= grandmaCost;
            grandma++;
            grandmaCost = Math.ceil(grandmaCost * 1.15);
            new Audio('sounds/buy.mp3').play().catch(err => {});
            update(); // Update after purchase
        }
    });

    buyFactory.addEventListener('click', () => {
        if (count >= factoryCost) {
            count -= factoryCost;
            factory++;
            factoryCost = Math.ceil(factoryCost * 1.2);
            new Audio('sounds/buy.mp3').play().catch(err => {});
            update(); // Update after purchase
        }
    });

    saveButton.addEventListener('click', () => {
        saveGame();
        alert("ゲームをセーブしました！");
    });

    resetButton.addEventListener('click', resetGame);

    goldenCookie.addEventListener('click', () => {
        new Audio('sounds/golden_click.mp3').play().catch(err => {});
        goldenCookieClicks++; // Increment golden cookie clicks
        checkAchievement('gold1');
        activateGoldenCookieBonus();
        goldenCookie.classList.add('hidden');
        update(); // Update after golden cookie bonus
    });

    // --- Achievement Logic ---
    function checkAchievement(id) {
        if (achievements[id] && !achievements[id].unlocked) {
            unlockAchievement(id);
        }
    }

    function checkAchievements() {
        // Click achievements
        if (totalClicks >= 1000) checkAchievement('click1000');
        if (totalClicks >= 10000) checkAchievement('click10000');
        if (totalClicks >= 100000) checkAchievement('click100000');

        // Bake achievements
        if (totalCookiesBaked >= 1000) checkAchievement('bake1000');
        if (totalCookiesBaked >= 250000) checkAchievement('bake250k');
        if (totalCookiesBaked >= 500000) checkAchievement('bake500k');
        if (totalCookiesBaked >= 750000) checkAchievement('bake750k');
        if (totalCookiesBaked >= 1000000) checkAchievement('bake1M');
        if (totalCookiesBaked >= 2500000) checkAchievement('bake2.5M');
        if (totalCookiesBaked >= 5000000) checkAchievement('bake5M');
        if (totalCookiesBaked >= 25000000) checkAchievement('bake25M');
        if (totalCookiesBaked >= 50000000) checkAchievement('bake50M');
        if (totalCookiesBaked >= 75000000) checkAchievement('bake75M');
        if (totalCookiesBaked >= 100000000) checkAchievement('bake1B');
        if (totalCookiesBaked >= 1000000000) checkAchievement('bake10B');
        if (totalCookiesBaked >= 10000000000) checkAchievement('bake100B');

        // Grandma achievements
        if (grandma >= 1) checkAchievement('grandma1');
        if (grandma >= 10) checkAchievement('grandma10');
        if (grandma >= 25) checkAchievement('grandma25');
        if (grandma >= 50) checkAchievement('grandma50');
        if (grandma >= 100) checkAchievement('grandma100');

        // Factory achievements
        if (factory >= 1) checkAchievement('factory1');
        if (factory >= 25) checkAchievement('factory25');
        if (factory >= 50) checkAchievement('factory50');
        if (factory >= 100) checkAchievement('factory100');

        // Golden cookie achievements
        if (goldenCookieClicks >= 1) checkAchievement('gold1');
        if (goldenCookieClicks >= 10) checkAchievement('gold10');
        if (goldenCookieClicks >= 50) checkAchievement('gold50');
    }

    function unlockAchievement(id) {
        achievements[id].unlocked = true;
        showAchievementToast(achievements[id].name);
        updateAchievementList();
    }

    function showAchievementToast(name) {
        achievementToast.textContent = `チャレンジ達成: ${name}`;
        achievementToast.classList.remove('hidden');
        achievementToast.classList.add('show');
        setTimeout(() => {
            achievementToast.classList.remove('show');
            setTimeout(() => achievementToast.classList.add('hidden'), 500);
        }, 3000);
    }

    function updateAchievementList() {
        if (!achievementList) return;
        achievementList.innerHTML = '';
        for (const id in achievements) {
            const ach = achievements[id];
            const li = document.createElement('li');
            li.innerHTML = `<strong>${ach.name}</strong><br>${ach.description}`;
            li.classList.add('achievement-item');
            li.classList.add(`ach-category-${ach.category}`);
            li.classList.add(`ach-difficulty-${ach.difficulty}`);
            if (ach.unlocked) {
                li.classList.add('unlocked');
            }
            achievementList.appendChild(li);
        }
    }

    // --- Golden Cookie Logic ---
    function setupGoldenCookie() {
        const minTime = 60 * 1000, maxTime = 180 * 1000;
        const randomTime = Math.random() * (maxTime - minTime) + minTime;
        setTimeout(() => {
            showGoldenCookie();
            setupGoldenCookie();
        }, randomTime);
    }

    function showGoldenCookie() {
        const x = Math.random() * (window.innerWidth - 80);
        const y = Math.random() * (window.innerHeight - 80);
        goldenCookie.style.left = `${x}px`;
        goldenCookie.style.top = `${y}px`;
        goldenCookie.classList.remove('hidden');
        setTimeout(() => goldenCookie.classList.add('hidden'), 10000);
    }

    function activateGoldenCookieBonus() {
        const bonuses = ['frenzy', 'lucky'];
        const randomBonus = bonuses[Math.floor(Math.random() * bonuses.length)];

        if (randomBonus === 'frenzy') {
            bonusMultiplier = 7;
            showBonusDisplay(`生産フィーバー！ (x7 for 77s)`);
            setTimeout(() => {
                bonusMultiplier = 1;
                hideBonusDisplay();
            }, 77000);
        }
        else if (randomBonus === 'lucky') {
            calculateCPS();
            const reward = Math.min((cps / bonusMultiplier) * 900, count * 0.15) + 13;
            count += reward;
            showBonusDisplay(`ラッキー！ +${Math.floor(reward).toLocaleString()}クッキー`);
            update(); // Update after lucky bonus
            setTimeout(hideBonusDisplay, 4000);
        }
    }

    function showBonusDisplay(message) {
        bonusDisplay.textContent = message;
        bonusDisplay.classList.remove('hidden');
    }

    function hideBonusDisplay() {
        bonusDisplay.classList.add('hidden');
    }

    // --- Initialization ---
    function init() {
        loadGame();
        updateAchievementList();
        setupGoldenCookie();
        update(); // Initial update to display loaded values
    }

    // --- Game Loop ---
    setInterval(() => {
        produce();
    }, 100);
    setInterval(saveGame, 30000);

    init();
});