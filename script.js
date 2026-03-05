// 游戏变量
let cards = [];
let flippedCards = [];
let matchedCards = [];
let flipCount = 0;
let timer = 0;
let timerInterval;
let gameStarted = false;

// 卡通动物图像数据（使用text_to_image API生成）
const animalImages = [
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
    }
];

// 初始化游戏
function initGame() {
    // 重置游戏状态
    cards = [];
    flippedCards = [];
    matchedCards = [];
    flipCount = 0;
    timer = 0;
    gameStarted = false;
    
    // 更新UI
    document.getElementById('flip-count').textContent = '0';
    document.getElementById('timer').textContent = '00:00';
    document.getElementById('win-message').classList.remove('active');
    
    // 清除定时器
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // 创建卡片
    createCards();
    
    // 渲染游戏棋盘
    renderGameBoard();
}

// 创建卡片数组
function createCards() {
    // 为每种动物创建两张卡片
    animalImages.forEach(animal => {
        // 第一张卡片
        cards.push({
            id: animal.id * 2 - 1,
            animalId: animal.id,
            image: animal.image,
            flipped: false,
            matched: false
        });
        
        // 第二张卡片
        cards.push({
            id: animal.id * 2,
            animalId: animal.id,
            image: animal.image,
            flipped: false,
            matched: false
        });
    });
    
    // 随机打乱卡片顺序
    shuffleCards();
}

// 随机打乱卡片顺序
function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
}

// 渲染游戏棋盘
function renderGameBoard() {
    const gameBoard = document.querySelector('.game-board');
    gameBoard.innerHTML = '';
    
    cards.forEach(card => {
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
        img.alt = `Cartoon ${animalImages[card.animalId - 1].name}`;
        frontFace.appendChild(img);
        
        cardElement.appendChild(backFace);
        cardElement.appendChild(frontFace);
        
        // 添加点击事件
        cardElement.addEventListener('click', () => flipCard(card.id));
        
        gameBoard.appendChild(cardElement);
    });
}

// 翻转卡片
function flipCard(cardId) {
    // 如果游戏未开始，开始游戏
    if (!gameStarted) {
        startGame();
    }
    
    const card = cards.find(c => c.id === cardId);
    
    // 如果卡片已经翻开或匹配，不做任何操作
    if (card.flipped || card.matched) {
        return;
    }
    
    // 如果已经翻开了两张卡片，不做任何操作
    if (flippedCards.length >= 2) {
        return;
    }
    
    // 翻转卡片
    card.flipped = true;
    flippedCards.push(card);
    
    // 更新UI
    renderGameBoard();
    
    // 增加翻牌次数
    flipCount++;
    document.getElementById('flip-count').textContent = flipCount;
    
    // 检查是否翻开了两张卡片
    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 1000);
    }
}

// 检查两张卡片是否匹配
function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.animalId === card2.animalId) {
        // 卡片匹配
        card1.matched = true;
        card2.matched = true;
        matchedCards.push(card1, card2);
        
        // 检查是否所有卡片都匹配
        if (matchedCards.length === cards.length) {
            endGame();
        }
    } else {
        // 卡片不匹配，翻回
        card1.flipped = false;
        card2.flipped = false;
    }
    
    // 清空翻开的卡片数组
    flippedCards = [];
    
    // 更新UI
    renderGameBoard();
}

// 开始游戏
function startGame() {
    gameStarted = true;
    
    // 开始计时
    timerInterval = setInterval(() => {
        timer++;
        const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
        const seconds = (timer % 60).toString().padStart(2, '0');
        document.getElementById('timer').textContent = `${minutes}:${seconds}`;
    }, 1000);
}

// 结束游戏
function endGame() {
    // 停止计时
    clearInterval(timerInterval);
    
    // 显示胜利消息
    const winMessage = document.getElementById('win-message');
    document.getElementById('final-time').textContent = document.getElementById('timer').textContent;
    document.getElementById('final-flips').textContent = flipCount;
    winMessage.classList.add('active');
}

// 事件监听器
document.addEventListener('DOMContentLoaded', function() {
    // 初始化游戏
    initGame();
    
    // 开始游戏按钮
    document.getElementById('start-btn').addEventListener('click', startGame);
    
    // 重新开始按钮
    document.getElementById('restart-btn').addEventListener('click', initGame);
    
    // 再玩一次按钮
    document.getElementById('play-again-btn').addEventListener('click', initGame);
});