let currentGameType = '';
let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let matchingPairs = [];
let selectedTerm = null;
let sortedItems = [];
let currentSortingIndex = 0;

// Ses Efektleri
const soundEffects = {
    correct: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'],
        volume: 0.5
    }),
    wrong: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/2002/2002-preview.mp3'],
        volume: 0.3
    }),
    click: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'],
        volume: 0.3
    }),
    success: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/2001/2001-preview.mp3'],
        volume: 0.5
    })
};

// 3D Arka Plan Animasyonu
let scene, camera, renderer, particles, emojiScene, emojiCamera, emojiRenderer, emojiMeshes = [];

function init3DBackground() {
    const container = document.getElementById('canvas-container');
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Renkli küpler oluştur
    const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const colors = [0xf093fb, 0xf5576c, 0x4facfe, 0x00f2fe, 0x43e97b];
    
    particles = [];
    for (let i = 0; i < 60; i++) {
        const material = new THREE.MeshBasicMaterial({ 
            color: colors[Math.floor(Math.random() * colors.length)],
            transparent: true,
            opacity: 0.7
        });
        const cube = new THREE.Mesh(geometry, material);
        
        cube.position.x = (Math.random() - 0.5) * 20;
        cube.position.y = (Math.random() - 0.5) * 20;
        cube.position.z = (Math.random() - 0.5) * 10 - 5;
        
        cube.scale.setScalar(Math.random() * 1.5 + 0.5);
        
        cube.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.025,
                (Math.random() - 0.5) * 0.025,
                (Math.random() - 0.5) * 0.015
            ),
            rotationSpeed: new THREE.Vector3(
                Math.random() * 0.03,
                Math.random() * 0.03,
                Math.random() * 0.03
            )
        };
        
        scene.add(cube);
        particles.push(cube);
    }
    
    camera.position.z = 5;
    
    animate();
}

// 3D Emoji Sistemi
function init3DEmojiSystem() {
    const container = document.getElementById('emoji-container');
    
    emojiScene = new THREE.Scene();
    emojiCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    emojiRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    emojiRenderer.setSize(window.innerWidth, window.innerHeight);
    emojiRenderer.setClearColor(0x000000, 0);
    container.appendChild(emojiRenderer.domElement);
    
    emojiRenderer.domElement.style.position = 'fixed';
    emojiRenderer.domElement.style.top = '0';
    emojiRenderer.domElement.style.left = '0';
    emojiRenderer.domElement.style.pointerEvents = 'none';
    emojiRenderer.domElement.style.zIndex = '1000';
    
    emojiCamera.position.z = 5;
    
    // Işıklandırma
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    emojiScene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    emojiScene.add(directionalLight);
    
    animateEmojis();
}

// 3D Emoji Oluşturma
function create3DEmoji(emoji, position) {
    const group = new THREE.Group();
    
    const emojiColors = {
        '📧': 0x4a90e2,
        '🌐': 0x48dbfb,
        '📱': 0x4a90e2,
        '💾': 0x666666,
        '📷': 0x666666,
        '🎧': 0x333333,
        '🔊': 0x666666,
        '🖨️': 0x666666,
        '📄': 0xffffff,
        '📊': 0x4caf50,
        '🚀': 0xff6b6b,
        '📡': 0x48dbfb,
        '🌐': 0x48dbfb,
        '💻': 0x4a90e2,
        '🌟': 0xffd700,
        '🎨': 0xff6b6b,
        '🎪': 0x48dbfb
    };
    
    const color = emojiColors[emoji] || 0xff6b6b;
    
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({ 
        color: color,
        shininess: 100,
        specular: 0x444444
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    group.add(sphere);
    
    group.position.copy(position);
    group.userData = {
        velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.005
        ),
        rotationSpeed: new THREE.Vector3(
            Math.random() * 0.02,
            Math.random() * 0.02,
            Math.random() * 0.02
        ),
        life: 300
    };
    
    emojiScene.add(group);
    emojiMeshes.push(group);
    
    return group;
}

// 3D Emoji Animasyonu
function animateEmojis() {
    requestAnimationFrame(animateEmojis);
    
    for (let i = emojiMeshes.length - 1; i >= 0; i--) {
        const emoji = emojiMeshes[i];
        
        emoji.position.add(emoji.userData.velocity);
        emoji.rotation.x += emoji.userData.rotationSpeed.x;
        emoji.rotation.y += emoji.userData.rotationSpeed.y;
        emoji.rotation.z += emoji.userData.rotationSpeed.z;
        
        emoji.userData.life--;
        
        if (emoji.userData.life <= 0) {
            emojiScene.remove(emoji);
            emojiMeshes.splice(i, 1);
        }
    }
    
    emojiRenderer.render(emojiScene, emojiCamera);
}

// Emoji Efekti
function spawnEmojiEffect(emoji, x, y) {
    const vector = new THREE.Vector3(
        (x / window.innerWidth) * 2 - 1,
        -(y / window.innerHeight) * 2 + 1,
        0.5
    );
    
    vector.unproject(emojiCamera);
    const dir = vector.sub(emojiCamera.position).normalize();
    const distance = -emojiCamera.position.z / dir.z;
    const pos = emojiCamera.position.clone().add(dir.multiplyScalar(distance));
    
    for (let i = 0; i < 5; i++) {
        const offset = new THREE.Vector3(
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 0.5
        );
        create3DEmoji(emoji, pos.clone().add(offset));
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    particles.forEach(particle => {
        particle.position.add(particle.userData.velocity);
        particle.rotation.x += particle.userData.rotationSpeed.x;
        particle.rotation.y += particle.userData.rotationSpeed.y;
        particle.rotation.z += particle.userData.rotationSpeed.z;
        
        // Sınırları kontrol et
        if (Math.abs(particle.position.x) > 10) particle.userData.velocity.x *= -1;
        if (Math.abs(particle.position.y) > 10) particle.userData.velocity.y *= -1;
        if (Math.abs(particle.position.z) > 5) particle.userData.velocity.z *= -1;
    });
    
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Sayfa yüklendiğinde 3D sistemleri başlat
window.addEventListener('load', () => {
    init3DBackground();
    init3DEmojiSystem();
});

// 6. Sınıf için çocuklara uygun, kapsamlı quiz soruları
const quizQuestions = [
    {
        question: "�️ Bilgisayarın hafızası ne işe yarar?",
        options: ["Resim gösterir", "Bilgi saklar", "Müzik çalar", "Video açar"],
        correct: 1
    },
    {
        question: "� İnternet'te bilgi aramak için ne kullanırız?",
        options: ["Arama motoru", "Hesap makinesi", "Paint", "Not defteri"],
        correct: 0
    },
    {
        question: "📱 Tablet ve telefonlar hangi özellikleri paylaşır?",
        options: ["Sadece klavye", "Dokunmatik ekran", "Sadece fare", "Sadece monitör"],
        correct: 1
    },
    {
        question: "� Şifre neden önemlidir?",
        options: ["Güzel görünür", "Bilgileri korur", "Hızlı çalışır", "Az yer kaplar"],
        correct: 1
    },
    {
        question: "📧 E-posta nedir?",
        options: ["Elektronik mektup", "Kâğıt mektup", "Telefon mesajı", "Mektup kutusu"],
        correct: 0
    },
    {
        question: "🎮 Bilgisayar oyunları nasıl çalışır?",
        options: ["Kendiliğinden", "Programlarla", "Sadece elektrikle", "Rastgele"],
        correct: 1
    },
    {
        question: "📷 Dijital kamera ne yapar?",
        options: ["Müzik çalar", "Resim çeker", "Video oynatır", "Yazı yazar"],
        correct: 1
    },
    {
        question: "💾 USB bellek ne işe yarar?",
        options: ["Sadece müzik", "Bilgi taşır", "Sadece video", "Sadece resim"],
        correct: 1
    },
    {
        question: "� Kulaklık ne işe yarar?",
        options: ["Resim gösterir", "Ses dinler", "Yazı yazar", "Video çeker"],
        correct: 1
    },
    {
        question: "🌟 Tablet nedir?",
        options: ["Sadece telefon", "Dokunmatik bilgisayar", "Sadece kamera", "Sadece müzik çalar"],
        correct: 1
    },
    {
        question: "📱 Akıllı telefon hangi özelliği vardır?",
        options: ["Sadece arama", "İnternet ve uygulama", "Sadece mesaj", "Sadece saat"],
        correct: 1
    },
    {
        question: "🎨 Paint programı ne yapar?",
        options: ["Müzik düzenler", "Resim çizer", "Video keser", "Yazı yazar"],
        correct: 1
    },
    {
        question: "📄 Word ne işe yarar?",
        options: ["Resim çizer", "Yazı yazar", "Müzik çalar", "Video açar"],
        correct: 1
    },
    {
        question: "📊 Excel ne yapar?",
        options: ["Tablo yapar", "Resim çizer", "Müzik çalar", "Video açar"],
        correct: 0
    },
    {
        question: "🎬 PowerPoint ne işe yarar?",
        options: ["Sunum yapar", "Resim çizer", "Müzik çalar", "Tablo yapar"],
        correct: 0
    }
];

// Görsel eşleştirme oyunu - daha kapsamlı
const matchingData = [
    { term: "📧", definition: "E-posta" },
    { term: "🌐", definition: "İnternet" },
    { term: "📱", definition: "Akıllı Telefon" },
    { term: "💾", definition: "USB Bellek" },
    { term: "📷", definition: "Dijital Kamera" },
    { term: "🎧", definition: "Kulaklık" },
    { term: "🔊", definition: "Hoparlör" },
    { term: "🖨️", definition: "Yazıcı" },
    { term: "📄", definition: "Word (Yazı)" },
    { term: "📊", definition: "Excel (Tablo)" }
];

// Sıralama oyunu - daha kapsamlı ve kolay
const sortingData = [
    {
        title: "📧 E-posta Gönderelim",
        items: [
            "E-posta programı aç",
            "Yeni e-posta seç",
            "Adresi yaz",
            "Gönder"
        ]
    },
    {
        title: "📱 Fotoğraf Çekelim",
        items: [
            "Kamerayı aç",
            "Kareyi seç",
            "Çek",
            "Kaydet"
        ]
    },
    {
        title: "🌐 İnternete Girelim",
        items: [
            "Tarayıcı aç",
            "Siteye git",
            "Gez",
            "Kapat"
        ]
    },
    {
        title: "� Word Belgesi Yapalım",
        items: [
            "Word aç",
            "Yaz",
            "Düzenle",
            "Kaydet"
        ]
    },
    {
        title: "💾 USB Bellek Kullanalım",
        items: [
            "USB tak",
            "Dosya seç",
            "Kopyala",
            "Çıkar"
        ]
    }
];

function startGame(gameType) {
    currentGameType = gameType;
    currentQuestionIndex = 0;
    score = 0;
    selectedTerm = null;
    sortedItems = [];
    currentSortingIndex = 0;
    
    // Ses efekti
    soundEffects.click.play();
    
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
    document.getElementById('result').classList.add('hidden');
    
    // Tüm oyun bölümlerini gizle
    document.querySelectorAll('.game-section').forEach(section => {
        section.classList.remove('active');
        section.classList.add('hidden');
    });
    
    if (gameType === 'quiz') {
        questions = [...quizQuestions].sort(() => Math.random() - 0.5);
        document.getElementById('quiz-section').classList.remove('hidden');
        document.getElementById('quiz-section').classList.add('active');
        document.getElementById('game-info').textContent = 'Soru: 1/15';
        showQuizQuestion();
    } else if (gameType === 'matching') {
        matchingPairs = [...matchingData].sort(() => Math.random() - 0.5);
        document.getElementById('matching-section').classList.remove('hidden');
        document.getElementById('matching-section').classList.add('active');
        document.getElementById('game-info').textContent = 'Eşleştirme: 0/' + matchingPairs.length;
        showMatchingGame();
    } else if (gameType === 'sorting') {
        document.getElementById('sorting-section').classList.remove('hidden');
        document.getElementById('sorting-section').classList.add('active');
        document.getElementById('game-info').textContent = 'Sıralama: 1/' + sortingData.length;
        showSortingGame();
    }
    
    updateProgress();
}

function showQuizQuestion() {
    const question = questions[currentQuestionIndex];
    
    document.getElementById('question').textContent = question.question;
    document.getElementById('score').textContent = score;
    document.getElementById('game-info').textContent = 'Soru: ' + (currentQuestionIndex + 1) + '/' + questions.length;
    
    updateProgress();
    
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.onclick = () => selectQuizAnswer(index);
        optionsContainer.appendChild(button);
    });
    
    document.getElementById('feedback').classList.add('hidden');
}

function selectQuizAnswer(selectedIndex) {
    const question = questions[currentQuestionIndex];
    const buttons = document.querySelectorAll('.option-btn');
    
    buttons.forEach((button, index) => {
        button.disabled = true;
        if (index === question.correct) {
            button.classList.add('correct');
        } else if (index === selectedIndex && selectedIndex !== question.correct) {
            button.classList.add('wrong');
        }
    });
    
    const feedback = document.getElementById('feedback');
    feedback.classList.remove('hidden');
    
    if (selectedIndex === question.correct) {
        score += 10;
        feedback.textContent = '🎉 Harika! +10 Puan';
        feedback.className = 'feedback correct';
        
        // Ses efekti
        soundEffects.correct.play();
        
        // Emoji efekti
        const rect = buttons[selectedIndex].getBoundingClientRect();
        spawnEmojiEffect('🌟', rect.left + rect.width / 2, rect.top + rect.height / 2);
    } else {
        feedback.textContent = '😊 Tekrar dene! Doğru cevap: ' + question.options[question.correct];
        feedback.className = 'feedback wrong';
        
        // Ses efekti
        soundEffects.wrong.play();
    }
    
    document.getElementById('score').textContent = score;
    
    setTimeout(() => {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < questions.length) {
            showQuizQuestion();
        } else {
            showResult();
        }
    }, 2500);
}

function showMatchingGame() {
    const termsColumn = document.getElementById('terms-column');
    const definitionsColumn = document.getElementById('definitions-column');
    
    termsColumn.innerHTML = '';
    definitionsColumn.innerHTML = '';
    
    // Terimleri karıştır
    const shuffledTerms = [...matchingPairs].sort(() => Math.random() - 0.5);
    const shuffledDefinitions = [...matchingPairs].sort(() => Math.random() - 0.5);
    
    shuffledTerms.forEach((pair, index) => {
        const item = document.createElement('div');
        item.className = 'matching-item';
        item.textContent = pair.term;
        item.dataset.index = matchingPairs.indexOf(pair);
        item.style.fontSize = '3em';
        item.onclick = () => selectTerm(item, pair);
        termsColumn.appendChild(item);
    });
    
    shuffledDefinitions.forEach((pair, index) => {
        const item = document.createElement('div');
        item.className = 'matching-item';
        item.textContent = pair.definition;
        item.dataset.index = matchingPairs.indexOf(pair);
        item.onclick = () => selectDefinition(item, pair);
        definitionsColumn.appendChild(item);
    });
    
    document.getElementById('matching-feedback').classList.add('hidden');
}

function selectTerm(element, pair) {
    if (element.classList.contains('matched')) return;
    
    // Önceki seçimi kaldır
    document.querySelectorAll('.matching-item').forEach(item => {
        if (!item.classList.contains('matched')) {
            item.classList.remove('selected');
        }
    });
    
    element.classList.add('selected');
    selectedTerm = { element, pair };
}

function selectDefinition(element, pair) {
    if (element.classList.contains('matched')) return;
    
    if (!selectedTerm) {
        document.querySelectorAll('.matching-item').forEach(item => {
            if (!item.classList.contains('matched')) {
                item.classList.remove('selected');
            }
        });
        element.classList.add('selected');
        return;
    }
    
    // Eşleştirme kontrolü
    if (selectedTerm.pair === pair) {
        selectedTerm.element.classList.add('matched');
        element.classList.add('matched');
        selectedTerm.element.classList.remove('selected');
        element.classList.remove('selected');
        
        score += 10;
        document.getElementById('score').textContent = score;
        
        const matchedCount = document.querySelectorAll('.matching-item.matched').length / 2;
        document.getElementById('game-info').textContent = 'Eşleştirme: ' + matchedCount + '/' + matchingPairs.length;
        updateProgress();
        
        // Ses efekti
        soundEffects.correct.play();
        
        // Emoji efekti
        const rect = element.getBoundingClientRect();
        spawnEmojiEffect('🎨', rect.left + rect.width / 2, rect.top + rect.height / 2);
        
        if (matchedCount === matchingPairs.length) {
            setTimeout(() => showResult(), 1500);
        }
    } else {
        element.classList.add('wrong');
        selectedTerm.element.classList.add('wrong');
        
        const feedback = document.getElementById('matching-feedback');
        feedback.classList.remove('hidden');
        feedback.textContent = '😅 Yanlış! Tekrar dene.';
        feedback.className = 'feedback wrong';
        
        setTimeout(() => {
            element.classList.remove('wrong');
            selectedTerm.element.classList.remove('wrong');
            feedback.classList.add('hidden');
        }, 2000);
    }
    
    selectedTerm = null;
}

function showSortingGame() {
    currentSortingIndex = 0;
    sortedItems = [];
    showSortingLevel();
}

function showSortingLevel() {
    if (currentSortingIndex >= sortingData.length) {
        showResult();
        return;
    }
    
    const levelData = sortingData[currentSortingIndex];
    document.getElementById('sorting-instruction').textContent = levelData.title;
    
    const sortingItems = document.getElementById('sorting-items');
    const sortedItemsContainer = document.getElementById('sorted-items');
    
    sortingItems.innerHTML = '';
    sortedItemsContainer.innerHTML = '';
    
    const shuffledItems = [...levelData.items].sort(() => Math.random() - 0.5);
    
    shuffledItems.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'sorting-item';
        itemElement.textContent = item;
        itemElement.dataset.originalIndex = levelData.items.indexOf(item);
        itemElement.onclick = () => moveToSorted(itemElement, item);
        sortingItems.appendChild(itemElement);
    });
    
    document.getElementById('sorting-feedback').classList.add('hidden');
}

function moveToSorted(element, item) {
    if (element.classList.contains('sorted')) return;
    
    const sortedItemsContainer = document.getElementById('sorted-items');
    element.classList.add('sorted');
    element.onclick = null;
    sortedItemsContainer.appendChild(element);
    
    sortedItems.push({
        item: item,
        originalIndex: parseInt(element.dataset.originalIndex)
    });
    
    const totalItems = sortingData[currentSortingIndex].items.length;
    if (sortedItems.length === totalItems) {
        checkSortingOrder();
    }
}

function checkSortingOrder() {
    let correctOrder = true;
    
    for (let i = 0; i < sortedItems.length; i++) {
        if (sortedItems[i].originalIndex !== i) {
            correctOrder = false;
            break;
        }
    }
    
    const feedback = document.getElementById('sorting-feedback');
    feedback.classList.remove('hidden');
    
    if (correctOrder) {
        score += 15;
        document.getElementById('score').textContent = score;
        feedback.textContent = '🎉 Mükemmel! +15 Puan';
        feedback.className = 'feedback correct';
        
        // Ses efekti
        soundEffects.correct.play();
        
        // Emoji efekti
        const rect = document.getElementById('sorted-items').getBoundingClientRect();
        spawnEmojiEffect('🎪', rect.left + rect.width / 2, rect.top + rect.height / 2);
        
        setTimeout(() => {
            currentSortingIndex++;
            document.getElementById('game-info').textContent = 'Sıralama: ' + (currentSortingIndex + 1) + '/' + sortingData.length;
            updateProgress();
            showSortingLevel();
        }, 2500);
    } else {
        feedback.textContent = '😊 Yanlış sırada! Tekrar dene.';
        feedback.className = 'feedback wrong';
        
        setTimeout(() => {
            feedback.classList.add('hidden');
            const sortedItemsContainer = document.getElementById('sorted-items');
            const sortingItems = document.getElementById('sorting-items');
            
            while (sortedItemsContainer.firstChild) {
                const item = sortedItemsContainer.firstChild;
                item.classList.remove('sorted');
                item.onclick = function() {
                    moveToSorted(this, item.textContent);
                };
                sortingItems.appendChild(item);
            }
            
            sortedItems = [];
        }, 2500);
    }
}

function updateProgress() {
    let progress = 0;
    
    if (currentGameType === 'quiz') {
        progress = ((currentQuestionIndex) / questions.length) * 100;
    } else if (currentGameType === 'matching') {
        const matchedCount = document.querySelectorAll('.matching-item.matched').length / 2;
        progress = (matchedCount / matchingPairs.length) * 100;
    } else if (currentGameType === 'sorting') {
        progress = (currentSortingIndex / sortingData.length) * 100;
    }
    
    document.getElementById('progress').style.width = progress + '%';
}

function showResult() {
    document.getElementById('game').classList.add('hidden');
    document.getElementById('result').classList.remove('hidden');
    
    // Başarı sesi
    soundEffects.success.play();
    
    let maxScore = 0;
    if (currentGameType === 'quiz') {
        maxScore = questions.length * 10;
    } else if (currentGameType === 'matching') {
        maxScore = matchingPairs.length * 10;
    } else if (currentGameType === 'sorting') {
        maxScore = sortingData.length * 15;
    }
    
    const percentage = (score / maxScore) * 100;
    document.getElementById('final-score').textContent = score + ' / ' + maxScore;
    
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    
    if (percentage >= 80) {
        resultTitle.textContent = '� Mükemmel!';
        resultMessage.textContent = 'Sen bir kodlama uzmanısın!';
    } else if (percentage >= 60) {
        resultTitle.textContent = '🌟 Güzel!';
        resultMessage.textContent = 'Çok iyisin, biraz daha pratik yap!';
    } else if (percentage >= 40) {
        resultTitle.textContent = '💪 Devam Et!';
        resultMessage.textContent = 'Güzel gidiyorsun, devam et!';
    } else {
        resultTitle.textContent = '📚 Çalışmaya Devam!';
        resultMessage.textContent = 'Endişelenme, pratik yaparak öğrenirsin!';
    }
}

function goToMenu() {
    document.getElementById('menu').classList.remove('hidden');
    document.getElementById('game').classList.add('hidden');
    document.getElementById('result').classList.add('hidden');
    document.getElementById('learning').classList.add('hidden');
    
    document.querySelectorAll('.game-section').forEach(section => {
        section.classList.remove('active');
        section.classList.add('hidden');
    });
}

// 6. Sınıf Öğrenme Alanı İçerikleri
const learningContent = {
    yenilikci: {
        title: "🚀 Yenilikçi Teknolojiler",
        content: `
            <h3>🚀 Yenilikçi Teknolojiler Nedir?</h3>
            <p>Yenilikçi teknolojiler, hayatımızı kolaylaştıran yeni ve gelişmiş teknolojilerdir.</p>
            
            <h3>🌟 Örnekler</h3>
            <ul>
                <li>🤖 <strong>Yapay Zekâ:</strong> Bilgisayarların düşünmesi</li>
                <li>🥽 <strong>Artırılmış Gerçeklik:</strong> Sanal dünyayı gerçeğe katmak</li>
                <li>⌚ <strong>Giyilebilir Teknolojiler:</strong> Akıllı saat, gözlük</li>
                <li>🚗 <strong>Otonom Araçlar:</strong> Kendi kendine giden arabalar</li>
                <li>🏠 <strong>Akıllı Ev:</strong> Sesle kontrol edilen evler</li>
            </ul>
            
            <h3>📱 Günlük Hayatta Kullanımı</h3>
            <ul>
                <li>Akıllı telefonlar ile her şeyi yapabiliriz</li>
                <li>Sesli asistanlar bize yardımcı olur</li>
                <li>Akıllı saatler sağlığımızı takip eder</li>
                <li>Ev otomasyonu hayatı kolaylaştırır</li>
            </ul>
            
            <h3>🔮 Gelecek Teknolojileri</h3>
            <ul>
                <li>Robotlar daha akıllı olacak</li>
                <li>Sürücüsüz araçlar yaygınlaşacak</li>
                <li>Sanal gerçeklik gelişecek</li>
                <li>Yapay zekâ hayatımızın her alanına girecek</li>
            </ul>
        `
    },
    iletisim: {
        title: "📡 İletişim Teknolojileri",
        content: `
            <h3>📡 İletişim Teknolojileri</h3>
            <p>İletişim teknolojileri, insanların birbiriyle iletişim kurmasını sağlayan araçlardır.</p>
            
            <h3>📧 İletişim Araçları</h3>
            <ul>
                <li>📧 <strong>E-posta:</strong> Elektronik mektup gönderme</li>
                <li>💬 <strong>Mesajlaşma:</strong> Anlık mesaj gönderme</li>
                <li>📞 <strong>Video Arama:</strong> Görüntülü konuşma</li>
                <li>📱 <strong>Sosyal Medya:</strong> Paylaşım platformları</li>
                <li>🎙️ <strong>Sesli Mesaj:</strong> Ses kaydı gönderme</li>
            </ul>
            
            <h3>⏰ İletişim Türleri</h3>
            <ul>
                <li><strong>Eş Zamanlı:</strong> Aynı anda (video arama)</li>
                <li><strong>Farklı Zamanlı:</strong> Farklı zamanlarda (e-posta)</li>
            </ul>
            
            <h3>🎯 İletişim Süreci</h3>
            <ul>
                <li><strong>Gönderen:</strong> Mesajı gönderen kişi</li>
                <li><strong>Alıcı:</strong> Mesajı alan kişi</li>
                <li><strong>Mesaj:</strong> İletilmek istenen bilgi</li>
                <li><strong>Kanal:</strong> İletişim aracı</li>
                <li><strong>Geri Bildirim:</strong> Cevap</li>
            </ul>
            
            <h3>📊 İleri Düzey Arama</h3>
            <ul>
                <li>Arama motorlarını doğru kullanma</li>
                <li>Anahtar kelimelerle arama</li>
                <li>Güvenilir kaynakları bulma</li>
                <li>Bilgiyi doğrulama</li>
            </ul>
        `
    },
    aglar: {
        title: "🌐 Bilgisayar Ağları",
        content: `
            <h3>🌐 Bilgisayar Ağları Nedir?</h3>
            <p>Bilgisayar ağları, birden fazla bilgisayarın birbirine bağlanarak bilgi paylaşmasını sağlar.</p>
            
            <h3>🌍 İnternet</h3>
            <ul>
                <li>Dünyadaki bilgisayarların birleşmesi</li>
                <li>Bilgiye kolay erişim</li>
                <li>İletişim imkanları</li>
                <li>Eğlence ve eğitim kaynakları</li>
            </ul>
            
            <h3>🔗 Ağ Türleri</h3>
            <ul>
                <li><strong>LAN:</strong> Yerel ağ (ev, okul)</li>
                <li><strong>WAN:</strong> Geniş alan ağı (internet)</li>
                <li><strong>WLAN:</strong> Kablosuz ağ (Wi-Fi)</li>
            </ul>
            
            <h3>📡 Ağ Bileşenleri</h3>
            <ul>
                <li>📶 <strong>Modem:</strong> İnternet bağlantısı</li>
                <li>📡 <strong>Router:</strong> Ağ yönlendirici</li>
                <li>🔌 <strong>Kablo:</strong> Fiziksel bağlantı</li>
                <li>📶 <strong>Wi-Fi:</strong> Kablosuz bağlantı</li>
            </ul>
            
            <h3>🔒 Ağ Güvenliği</h3>
            <ul>
                <li>Güçlü şifre kullanımı</li>
                <li>Güvenlik duvarı</li>
                <li>Antivirüs programları</li>
                <li>Düzenli güncelleme</li>
            </ul>
        `
    },
    programlama: {
        title: "💻 Programlama Temelleri",
        content: `
            <h3>💻 Programlama Nedir?</h3>
            <p>Programlama, bilgisayara komut verme sürecidir. Bilgisayarların ne yapacağını biz belirleriz.</p>
            
            <h3>🧠 Algoritma</h3>
            <ul>
                <li>Adım adım planlama</li>
                <li>Problem çözme yöntemi</li>
                <li>Mantıksal düşünme</li>
                <li>Sıralı işlem yapma</li>
            </ul>
            
            <h3>📝 Temel Kavramlar</h3>
            <ul>
                <li><strong>Değişken:</strong> Bilgi saklama</li>
                <li><strong>Döngü:</strong> Tekrar eden işlemler</li>
                <li><strong>Karar:</strong> Koşul kontrolü</li>
                <li><strong>Fonksiyon:</strong> Tekrar kullanılabilir kod</li>
            </ul>
            
            <h3>🎯 Blok Tabanlı Programlama</h3>
            <ul>
                <li>Görsel programlama</li>
                <li>Kod blokları sürükle-bırak</li>
                <li>Scratch gibi platformlar</li>
                <li>Çocuklar için uygun</li>
            </ul>
            
            <h3>🔧 Programlama Süreci</h3>
            <ul>
                <li>Problemi analiz et</li>
                <li>Algoritma tasarla</li>
                <li>Kodu yaz</li>
                <li>Test et ve düzelt</li>
            </ul>
        `
    }
};

function showLearningArea(topic) {
    const content = learningContent[topic];
    
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('learning').classList.remove('hidden');
    
    document.getElementById('learning-title').textContent = content.title;
    document.getElementById('learning-text').innerHTML = content.content;
}