// 游戏核心模块
const MemoryGame = {
    // 游戏状态
    gameState: {
        currentLevel: 1,
        cards: [],
        flippedCards: [],
        matchedCards: [],
        flipCount: 0,
        timer: 0,
        timerInterval: null,
        gameStarted: false,
        globalTimer: 0, // 全局计时
        globalTimerInterval: null, // 全局计时器
        backgroundMusic: null, // 背景音乐
        musicEnabled: true, // 音乐是否开启
        failedAttempts: 0, // 连续失败次数
        levelConfig: {
            1: { rows: 2, cols: 2, pairs: 2 },
            2: { rows: 4, cols: 4, pairs: 8 },
            3: { rows: 6, cols: 6, pairs: 18 }
        }
    },
    
    // 音效系统
    audioContext: null,
    
    // 初始化音效系统
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    },
    
    // 播放翻牌音效
    playFlipSound() {
        // 创建音频对象
        const audio = new Audio('菜鸟图库-扑克翻牌.mp3');
        audio.volume = 0.5;
        
        // 播放音效
        audio.play().catch(error => {
            console.log('音效播放失败:', error);
        });
    },
    
    // 播放匹配成功音效
    playMatchSound() {
        // 创建音频对象
        const audio = new Audio('菜鸟图库-真香哎呀吗王.mp3');
        audio.volume = 0.5;
        
        // 播放音效
        audio.play().catch(error => {
            console.log('音效播放失败:', error);
        });
    },
    
    // 播放失败音效
    playFailSound() {
        // 创建音频对象
        const audio = new Audio('菜鸟图库-不！（撒娇）.mp3');
        audio.volume = 0.5;
        
        // 播放音效
        audio.play().catch(error => {
            console.log('音效播放失败:', error);
        });
    },
    
    // 播放背景音乐
    playBackgroundMusic() {
        // 如果背景音乐已经在播放，不重复播放
        if (this.gameState.backgroundMusic) return;
        
        // 创建音频对象
        const audio = new Audio('菜鸟图库-轻快放松综艺.mp3');
        audio.loop = true;
        audio.volume = 0.3;
        
        // 播放音乐
        audio.play().catch(error => {
            console.log('音乐播放失败:', error);
        });
        
        // 存储音乐对象
        this.gameState.backgroundMusic = audio;
    },
    
    // 停止背景音乐
    stopBackgroundMusic() {
        if (this.gameState.backgroundMusic) {
            this.gameState.backgroundMusic.pause();
            this.gameState.backgroundMusic.currentTime = 0;
            this.gameState.backgroundMusic = null;
        }
    },
    
    // 动物图像数据
    animalImages: [
        {
            id: 1,
            name: 'cat',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20cat%20with%20big%20eyes%20and%20friendly%20expression&image_size=square'
        },
        {
            id: 2,
            name: 'dog',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20dog%20with%20big%20eyes%20and%20friendly%20expression&image_size=square'
        },
        {
            id: 3,
            name: 'rabbit',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20rabbit%20with%20big%20eyes%20and%20friendly%20expression&image_size=square'
        },
        {
            id: 4,
            name: 'panda',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20panda%20with%20big%20eyes%20and%20friendly%20expression&image_size=square'
        },
        {
            id: 5,
            name: 'elephant',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20elephant%20with%20big%20eyes%20and%20friendly%20expression&image_size=square'
        },
        {
            id: 6,
            name: 'giraffe',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20giraffe%20with%20big%20eyes%20and%20friendly%20expression&image_size=square'
        },
        {
            id: 7,
            name: 'monkey',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20monkey%20with%20big%20eyes%20and%20friendly%20expression&image_size=square'
        },
        {
            id: 8,
            name: 'tiger',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20tiger%20with%20big%20eyes%20and%20friendly%20expression&image_size=square'
        },
        {
            id: 9,
            name: 'lion',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20lion%20with%20big%20eyes%20and%20friendly%20expression&image_size=square'
        },
        {
            id: 10,
            name: 'bear',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20bear%20with%20big%20eyes%20and%20friendly%20expression&image_size=square'
        },
        {
            id: 11,
            name: 'fox',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20fox%20with%20big%20eyes%20and%20friendly%20expression&image_size=square'
        },
        {
            id: 12,
            name: 'owl',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20owl%20with%20big%20eyes%20and%20friendly%20expression&image_size=square'
        },
        {
            id: 13,
            name: 'penguin',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20penguin%20with%20big%20eyes%20and%20friendly%20expression&image_size=square'
        },
        {
            id: 14,
            name: 'koala',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20koala%20with%20big%20eyes%20and%20friendly%20expression&image_size=square'
        },
        {
            id: 15,
            name: 'zebra',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20zebra%20with%20big%20eyes%20and%20friendly%20expression&image_size=square'
        },
        {
            id: 16,
            name: 'hippo',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20hippo%20with%20big%20eyes%20and%20friendly%20expression&image_size=square'
        },
        {
            id: 17,
            name: 'kangaroo',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20kangaroo%20with%20big%20eyes%20and%20friendly%20expression&image_size=square'
        },
        {
            id: 18,
            name: 'dolphin',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20dolphin%20with%20big%20eyes%20and%20friendly%20expression&image_size=square'
        }
    ],
    
    // 初始化游戏
    init() {
        // 隐藏游戏界面，只显示主菜单
        document.getElementById('game-screen').style.display = 'none';
        document.getElementById('main-menu').style.display = 'block';
        
        this.setupEventListeners();
        this.initAudio();
    },
    
    // 设置事件监听器
    setupEventListeners() {
        // 主界面按钮
        document.getElementById('start-game-btn').addEventListener('click', () => this.startLevel(1));
        
        // 游戏界面按钮
        document.getElementById('music-btn').addEventListener('click', () => this.toggleMusic());
        document.getElementById('exit-to-menu').addEventListener('click', () => this.showMainMenu());
        
        // 胜利消息按钮
        document.getElementById('next-level-btn').addEventListener('click', () => this.nextLevel());
        document.getElementById('play-again-btn').addEventListener('click', () => this.restartLevel());
        document.getElementById('win-exit-btn').addEventListener('click', () => this.showMainMenu());
    },
    
    // 切换背景音乐
    toggleMusic() {
        const musicBtn = document.getElementById('music-btn');
        if (this.gameState.backgroundMusic) {
            // 停止音乐
            this.stopBackgroundMusic();
            this.gameState.musicEnabled = false;
            musicBtn.classList.remove('music-off');
            musicBtn.classList.add('music-on');
        } else {
            // 播放音乐
            this.playBackgroundMusic();
            this.gameState.musicEnabled = true;
            musicBtn.classList.remove('music-on');
            musicBtn.classList.add('music-off');
        }
    },
    
    // 显示主界面
    showMainMenu() {
        // 隐藏所有界面
        document.querySelectorAll('.game-container').forEach(screen => {
            screen.style.display = 'none';
        });
        // 显示主界面
        document.getElementById('main-menu').style.display = 'block';
    },
    
    // 显示游戏界面
    showGameScreen() {
        // 隐藏所有界面
        document.querySelectorAll('.game-container').forEach(screen => {
            screen.style.display = 'none';
        });
        // 显示游戏界面
        document.getElementById('game-screen').style.display = 'block';
    },
    
    // 开始关卡
    startLevel(level) {
        this.gameState.currentLevel = level;
        
        // 如果是第一关，重置翻牌次数
        if (level === 1) {
            this.gameState.flipCount = 0;
            this.startGlobalTimer();
        }
        
        this.resetGameState();
        this.showGameScreen();
        this.updateLevelTitle();
        this.createCards();
        this.renderGameBoard();
    },
    
    // 重置游戏状态
    resetGameState() {
        this.gameState.cards = [];
        this.gameState.flippedCards = [];
        this.gameState.matchedCards = [];
        this.gameState.timer = 0;
        this.gameState.gameStarted = false;
        this.gameState.failedAttempts = 0; // 重置失败计数
        
        if (this.gameState.timerInterval) {
            clearInterval(this.gameState.timerInterval);
        }
        
        // 更新UI
        document.getElementById('flip-count').textContent = this.gameState.flipCount;
        // 使用全局计时器
        this.updateGlobalTimerDisplay();
        document.getElementById('win-message').classList.remove('active');
    },
    
    // 启动全局计时器
    startGlobalTimer() {
        this.gameState.globalTimer = 0;
        if (this.gameState.globalTimerInterval) {
            clearInterval(this.gameState.globalTimerInterval);
        }
        
        this.gameState.globalTimerInterval = setInterval(() => {
            this.gameState.globalTimer++;
            this.updateGlobalTimerDisplay();
        }, 1000);
    },
    
    // 更新全局计时器显示
    updateGlobalTimerDisplay() {
        const minutes = Math.floor(this.gameState.globalTimer / 60).toString().padStart(2, '0');
        const seconds = (this.gameState.globalTimer % 60).toString().padStart(2, '0');
        document.getElementById('timer').textContent = `${minutes}:${seconds}`;
    },
    
    // 更新关卡标题
    updateLevelTitle() {
        const levelTitle = document.getElementById('level-title');
        const levelConfig = this.gameState.levelConfig[this.gameState.currentLevel];
        levelTitle.textContent = `第${this.gameState.currentLevel}关 (${levelConfig.rows}×${levelConfig.cols})`;
    },
    
    // 创建卡片
    createCards() {
        const levelConfig = this.gameState.levelConfig[this.gameState.currentLevel];
        const pairs = levelConfig.pairs;
        
        // 选择需要的动物图像
        const selectedAnimals = this.animalImages.slice(0, pairs);
        
        // 为每种动物创建两张卡片
        selectedAnimals.forEach((animal, index) => {
            // 第一张卡片
            this.gameState.cards.push({
                id: index * 2 + 1,
                animalId: animal.id,
                image: animal.image,
                flipped: false,
                matched: false
            });
            
            // 第二张卡片
            this.gameState.cards.push({
                id: index * 2 + 2,
                animalId: animal.id,
                image: animal.image,
                flipped: false,
                matched: false
            });
        });
        
        // 随机打乱卡片顺序
        this.shuffleCards();
    },
    
    // 随机打乱卡片顺序
    shuffleCards() {
        for (let i = this.gameState.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.gameState.cards[i], this.gameState.cards[j]] = [this.gameState.cards[j], this.gameState.cards[i]];
        }
    },
    
    // 渲染游戏棋盘
    renderGameBoard() {
        const gameBoard = document.getElementById('game-board');
        const levelConfig = this.gameState.levelConfig[this.gameState.currentLevel];
        
        // 重置棋盘样式
        gameBoard.className = 'game-board';
        
        // 为16×16关卡添加特殊样式
        if (levelConfig.rows === 16 && levelConfig.cols === 16) {
            gameBoard.classList.add('large-grid');
        }
        
        // 设置棋盘网格
        gameBoard.style.gridTemplateColumns = `repeat(${levelConfig.cols}, 1fr)`;
        gameBoard.innerHTML = '';
        
        this.gameState.cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            if (card.flipped || card.matched) {
                cardElement.classList.add('flip');
            }
            if (card.matched) {
                cardElement.classList.add('matched');
            }
            
            cardElement.dataset.id = card.id;
            
            // 卡片背面
            const backFace = document.createElement('div');
            backFace.classList.add('card-back');
            
            // 卡片正面
            const frontFace = document.createElement('div');
            frontFace.classList.add('card-front');
            
            const img = document.createElement('img');
            img.src = card.image;
            img.alt = `Cartoon ${this.animalImages[card.animalId - 1].name}`;
            frontFace.appendChild(img);
            
            cardElement.appendChild(backFace);
            cardElement.appendChild(frontFace);
            
            // 添加点击事件
            cardElement.addEventListener('click', () => this.flipCard(card.id));
            
            gameBoard.appendChild(cardElement);
        });
    },
    
    // 翻转卡片
    flipCard(cardId) {
        // 如果游戏未开始，开始游戏
        if (!this.gameState.gameStarted) {
            this.startGame();
        }
        
        const card = this.gameState.cards.find(c => c.id === cardId);
        
        // 如果卡片已经翻开或匹配，不做任何操作
        if (card.flipped || card.matched) {
            return;
        }
        
        // 如果已经翻开了两张卡片，立即翻回并继续
        if (this.gameState.flippedCards.length === 2) {
            // 翻回之前的两张卡片
            this.gameState.flippedCards.forEach(c => {
                c.flipped = false;
            });
            this.gameState.flippedCards = [];
            this.renderGameBoard();
        }
        
        // 播放翻牌音效
        this.playFlipSound();
        
        // 翻转卡片
        card.flipped = true;
        this.gameState.flippedCards.push(card);
        
        // 更新UI
        this.renderGameBoard();
        
        // 增加翻牌次数
        this.gameState.flipCount++;
        document.getElementById('flip-count').textContent = this.gameState.flipCount;
        
        // 检查是否翻开了两张卡片
        if (this.gameState.flippedCards.length === 2) {
            setTimeout(() => this.checkMatch(), 300);
        }
    },
    
    // 检查两张卡片是否匹配
    checkMatch() {
        const [card1, card2] = this.gameState.flippedCards;
        
        if (card1.animalId === card2.animalId) {
            // 播放匹配成功音效
            this.playMatchSound();
            
            // 卡片匹配，重置失败计数
            this.gameState.failedAttempts = 0;
            
            // 卡片匹配
            card1.matched = true;
            card2.matched = true;
            this.gameState.matchedCards.push(card1, card2);
            
            // 检查是否所有卡片都匹配
            if (this.gameState.matchedCards.length === this.gameState.cards.length) {
                this.endGame();
            }
        } else {
            // 卡片不匹配，翻回
            card1.flipped = false;
            card2.flipped = false;
            
            // 增加失败计数
            this.gameState.failedAttempts++;
            
            // 如果连续失败3次，播放失败音效
            if (this.gameState.failedAttempts >= 3) {
                this.playFailSound();
                // 重置失败计数
                this.gameState.failedAttempts = 0;
            }
        }
        
        // 清空翻开的卡片数组
        this.gameState.flippedCards = [];
        
        // 更新UI
        this.renderGameBoard();
    },
    
    // 开始游戏
    startGame() {
        this.gameState.gameStarted = true;
        // 只有当音乐开启时才播放
        if (this.gameState.musicEnabled) {
            this.playBackgroundMusic();
        }
    },
    
    // 结束游戏
    endGame() {
        // 检查是否是最后一关
        if (this.gameState.currentLevel === Object.keys(this.gameState.levelConfig).length) {
            // 停止全局计时器
            clearInterval(this.gameState.globalTimerInterval);
            
            // 停止背景音乐
            this.stopBackgroundMusic();
            
            // 显示通关消息
            const winMessage = document.getElementById('win-message');
            document.getElementById('final-time').textContent = document.getElementById('timer').textContent;
            document.getElementById('final-flips').textContent = this.gameState.flipCount;
            winMessage.classList.add('active');
            
            // 隐藏下一关按钮
            const nextLevelBtn = document.getElementById('next-level-btn');
            nextLevelBtn.style.display = 'none';
        } else {
            // 自动进入下一关
            setTimeout(() => {
                this.nextLevel();
            }, 500);
        }
    },
    
    // 重新开始当前关卡
    restartLevel() {
        this.startLevel(this.gameState.currentLevel);
    },
    
    // 进入下一关
    nextLevel() {
        const nextLevel = this.gameState.currentLevel + 1;
        if (nextLevel <= Object.keys(this.gameState.levelConfig).length) {
            this.startLevel(nextLevel);
        }
    }
};

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    MemoryGame.init();
});