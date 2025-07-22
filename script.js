// Clicker Game v1.3 - Save Compatibility Fix

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

    // --- Achievements (Master Definition) ---
    const achievements = {
        'click1': { name: 'はじめの一歩', description: '初めてクッキーをクリックする', unlocked: false },
        'click100': { name: 'クリッカーの卵', description: '100回クリックする', unlocked: false },
        'bake1000': { name: 'クッキーベイカー', description: '合計で1,000枚のクッキーを焼く', unlocked: false },
        'bake1M': { name: 'クッキー起業家', description: '合計で100万枚のクッキーを焼く', unlocked: false },
        'bake1B': { name: 'クッキー大君', description: '合計で1億枚のクッキーを焼く', unlocked: false },
        'bake10B': { name: 'クッキー惑星', description: '合計で10億枚のクッキーを焼く', unlocked: false },
        'bake100B': { name: 'クッキー銀河', description: '合計で100億枚のクッキーを焼く', unlocked: false },
        'grandma1': { name: 'おばあちゃん登場', description: '初めておばあちゃんを雇う', unlocked: false },
        'grandma10': { name: 'おばあちゃん軍団', description: 'おばあちゃんを10人雇う', unlocked: false },
        'factory1': { name: '近代化', description: '初めて工場を建設する', unlocked: false },
        'gold1': { name: '幸運', description: '初めてゴールデンクッキーをクリックする', unlocked: false },
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

            // --- THIS IS THE FIX ---
            // Safely merge achievement progress from save file
            if (gameState.achievements) {
                for (const id in gameState.achievements) {
                    if (achievements[id]) { // If achievement from save exists in master list
                        achievements[id].unlocked = gameState.achievements[id].unlocked;
                    }
                }
            }
            // -----------------------
        }
    }

    function saveGame() {
        const gameState = {
            count, totalClicks, totalCookiesBaked, grandma, grandmaCost, grandmaBaked, factory, factoryCost, factoryBaked, achievements
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
        const production = cps / 10;
        count += production;
        totalCookiesBaked += production;
        grandmaBaked += (grandma * bonusMultiplier) / 10;
        factoryBaked += (factory * 10 * bonusMultiplier) / 10;
        checkAchievements();
    }

    // --- UI Update & Display Logic ---
    function update() {
        cookieCount.textContent = Math.floor(count);
        totalCookiesBakedDisplay.textContent = Math.floor(totalCookiesBaked);
        grandmaCount.textContent = grandma;
        grandmaBakedCount.textContent = Math.floor(grandmaBaked);
        buyGrandma.textContent = `おばあちゃんを雇う (コスト: ${grandmaCost})`;
        factoryCount.textContent = factory;
        factoryBakedCount.textContent = Math.floor(factoryBaked);
        buyFactory.textContent = `工場を建設する (コスト: ${factoryCost})`;
    }

    function addGrandmaImage() {
        const grandmaImg = document.createElement('img');
        grandmaImg.src = 'images/grandma.png';
        grandmaImg.classList.add('grandma-img');
        grandmaContainer.appendChild(grandmaImg);
    }

    function addFactoryImage() {
        const factoryImg = document.createElement('img');
        factoryImg.src = 'images/factory.png';
        factoryImg.classList.add('factory-img');
        factoryContainer.appendChild(factoryImg);
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
        new Audio('sounds/click.mp3').play().catch(err => {});
        showPlusOne(e);
        checkAchievement('click1');
    });

    buyGrandma.addEventListener('click', () => {
        if (count >= grandmaCost) {
            count -= grandmaCost;
            grandma++;
            grandmaCost = Math.ceil(grandmaCost * 1.15);
            new Audio('sounds/buy.mp3').play().catch(err => {});
            addGrandmaImage();
        }
    });

    buyFactory.addEventListener('click', () => {
        if (count >= factoryCost) {
            count -= factoryCost;
            factory++;
            factoryCost = Math.ceil(factoryCost * 1.2);
            new Audio('sounds/buy.mp3').play().catch(err => {});
            addFactoryImage();
        }
    });

    saveButton.addEventListener('click', () => {
        saveGame();
        alert("ゲームをセーブしました！");
    });

    resetButton.addEventListener('click', resetGame);

    goldenCookie.addEventListener('click', () => {
        new Audio('sounds/golden_click.mp3').play().catch(err => {});
        checkAchievement('gold1');
        activateGoldenCookieBonus();
        goldenCookie.classList.add('hidden');
    });

    // --- Achievement Logic ---
    function checkAchievement(id) {
        if (achievements[id] && !achievements[id].unlocked) {
            unlockAchievement(id);
        }
    }

    function checkAchievements() {
        if (totalClicks >= 100) checkAchievement('click100');
        if (totalCookiesBaked >= 1000) checkAchievement('bake1000');
        if (totalCookiesBaked >= 1000000) checkAchievement('bake1M');
        if (totalCookiesBaked >= 100000000) checkAchievement('bake1B');
        if (totalCookiesBaked >= 1000000000) checkAchievement('bake10B');
        if (totalCookiesBaked >= 10000000000) checkAchievement('bake100B');
        if (grandma >= 1) checkAchievement('grandma1');
        if (grandma >= 10) checkAchievement('grandma10');
        if (factory >= 1) checkAchievement('factory1');
    }

    function unlockAchievement(id) {
        achievements[id].unlocked = true;
        showAchievementToast(achievements[id].name);
        updateAchievementList();
    }

    function showAchievementToast(name) {
        achievementToast.textContent = `実績解除: ${name}`;
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
            li.textContent = `${ach.name}: ${ach.description}`;
            if (ach.unlocked) li.classList.add('unlocked');
            achievementList.appendChild(li);
        }
    }

    // --- Golden Cookie Logic (omitted for brevity, but it's here)
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
            showBonusDisplay(`ラッキー！ +${Math.floor(reward)}クッキー`);
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
        for (let i = 0; i < grandma; i++) addGrandmaImage();
        for (let i = 0; i < factory; i++) addFactoryImage();
        updateAchievementList();
        setupGoldenCookie();
    }

    // --- Game Loop ---
    setInterval(() => {
        produce();
        update();
    }, 100);
    setInterval(saveGame, 30000);

    init();
});
