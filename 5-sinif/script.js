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
    
    // Renkli küreler oluştur
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const colors = [0xff6b6b, 0xfeca57, 0x48dbfb, 0x4facfe, 0x43e97b];
    
    particles = [];
    for (let i = 0; i < 50; i++) {
        const material = new THREE.MeshBasicMaterial({ 
            color: colors[Math.floor(Math.random() * colors.length)],
            transparent: true,
            opacity: 0.7
        });
        const sphere = new THREE.Mesh(geometry, material);
        
        sphere.position.x = (Math.random() - 0.5) * 20;
        sphere.position.y = (Math.random() - 0.5) * 20;
        sphere.position.z = (Math.random() - 0.5) * 10 - 5;
        
        sphere.scale.setScalar(Math.random() * 2 + 0.5);
        
        sphere.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.01
            ),
            rotationSpeed: new THREE.Vector3(
                Math.random() * 0.02,
                Math.random() * 0.02,
                Math.random() * 0.02
            )
        };
        
        scene.add(sphere);
        particles.push(sphere);
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
    // Basit 3D geometri ile emoji benzeri şekil oluştur
    const group = new THREE.Group();
    
    // Emoji rengine göre materyal
    const emojiColors = {
        '🖥️': 0x4a90e2,
        '⌨️': 0x333333,
        '🖱️': 0x333333,
        '🔊': 0x666666,
        '📷': 0x666666,
        '🌟': 0xffd700,
        '🎨': 0xff6b6b,
        '🎪': 0x48dbfb,
        '💻': 0x4a90e2,
        '🔒': 0xff6b6b,
        '🤖': 0x48dbfb,
        '📧': 0x4a90e2,
        '🌐': 0x48dbfb,
        '📱': 0x4a90e2,
        '💾': 0x666666,
        '🎧': 0x333333,
        '🖨️': 0x666666,
        '📄': 0xffffff,
        '📊': 0x4caf50
    };
    
    const color = emojiColors[emoji] || 0xff6b6b;
    
    // Ana küre
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({ 
        color: color,
        shininess: 100,
        specular: 0x444444
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    group.add(sphere);
    
    // Detaylar ekle
    if (emoji === '🖥️' || emoji === '💻') {
        // Ekran
        const screenGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.1);
        const screenMaterial = new THREE.MeshPhongMaterial({ color: 0x87ceeb });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.z = 0.3;
        group.add(screen);
    } else if (emoji === '⌨️') {
        // Tuşlar
        for (let i = 0; i < 6; i++) {
            const keyGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.1);
            const keyMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });
            const key = new THREE.Mesh(keyGeometry, keyMaterial);
            key.position.x = (i % 3 - 1) * 0.2;
            key.position.y = Math.floor(i / 3) * 0.2 - 0.1;
            key.position.z = 0.3;
            group.add(key);
        }
    }
    
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
        life: 300 // frame sayısı
    };
    
    emojiScene.add(group);
    emojiMeshes.push(group);
    
    return group;
}

// 3D Emoji Animasyonu
function animateEmojis() {
    requestAnimationFrame(animateEmojis);
    
    // Emoji'leri güncelle
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

// Çocuklara uygun basit quiz soruları
const quizQuestions = [
    {
        question: "🖥️ Bilgisayarın ekranına ne denir?",
        options: ["Monitör", "Klavye", "Fare", "Yazıcı"],
        correct: 0
    },
    {
        question: "⌨️ Yazı yazmak için hangi parçayı kullanırız?",
        options: ["Monitör", "Klavye", "Hoparlör", "Kulaklık"],
        correct: 1
    },
    {
        question: "🖱️ Ekrandaki şeyleri seçmek için hangisini kullanırız?",
        options: ["Klavye", "Monitör", "Fare", "Yazıcı"],
        correct: 2
    },
    {
        question: "🔊 Müzik dinlemek için hangi parça gerekir?",
        options: ["Monitör", "Klavye", "Hoparlör", "Yazıcı"],
        correct: 2
    },
    {
        question: "📷 Resim çekmek için hangi cihazı kullanırız?",
        options: ["Bilgisayar", "Kamera", "Hoparlör", "Klavye"],
        correct: 1
    },
    {
        question: "🌐 İnternet'te oyun oynamak için neye ihtiyacımız var?",
        options: ["Sadece bilgisayar", "İnternet bağlantısı", "Sadece klavye", "Sadece fare"],
        correct: 1
    },
    {
        question: "📱 Dokunmatik ekranlı küçük bilgisayara ne denir?",
        options: ["Tablet", "Monitör", "Klavye", "Yazıcı"],
        correct: 0
    },
    {
        question: "🎮 Bilgisayar oyunu oynamak için hangisini kullanırız?",
        options: ["Yazıcı", "Tarayıcı", "Oyun kolu", "Hoparlör"],
        correct: 2
    },
    {
        question: "📄 Yazıyı kağıda basmak için hangi parça gerekir?",
        options: ["Monitör", "Klavye", "Yazıcı", "Hoparlör"],
        correct: 2
    },
    {
        question: "💾 Bilgisayara bilgi kaydetmek için hangi parça lazım?",
        options: ["Hard Disk", "Monitör", "Klavye", "Hoparlör"],
        correct: 0
    }
];

// Görsel eşleştirme oyunu için veriler
const matchingData = [
    { term: "🖥️", definition: "Monitör" },
    { term: "⌨️", definition: "Klavye" },
    { term: "🖱️", definition: "Fare" },
    { term: "🔊", definition: "Hoparlör" },
    { term: "🖨️", definition: "Yazıcı" },
    { term: "📷", definition: "Kamera" },
    { term: "🎧", definition: "Kulaklık" },
    { term: "💾", definition: "Hard Disk" }
];

// Basit sıralama oyunu için adımlar
const sortingData = [
    {
        title: "🎮 Bilgisayarı Açalım",
        items: [
            "Prize tak",
            "Düğmeye bas",
            "Bekle",
            "Oyna"
        ]
    },
    {
        title: "🖼️ Resim Çizelim",
        items: [
            "Paint'i aç",
            "Boya seç",
            "Çiz",
            "Kaydet"
        ]
    },
    {
        title: "🌐 İnternete Girelim",
        items: [
            "Tarayıcı aç",
            "Siteye git",
            "Tıkla",
            "Gez"
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
        document.getElementById('game-info').textContent = 'Soru: 1/10';
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
        feedback.textContent = '🎉 Süper! +10 Puan';
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
        item.onclick = () => selectTerm(item, pair);
        item.style.fontSize = '3em';
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
        feedback.textContent = '🎉 Harika! +15 Puan';
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
        resultMessage.textContent = 'Sen bir bilgisayar uzmanısın!';
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

// Öğrenme Alanı İçerikleri
const learningContent = {
    bilişim: {
        title: "💻 Bilişim Teknolojileri Nedir?",
        content: `
            <h3>🌟 Bilişim Teknolojileri Nedir?</h3>
            <p>Bilişim teknolojileri, bilgisayar, internet, telefon gibi teknolojilerin tamamına denir. Bu teknolojiler günlük hayatımızı kolaylaştırır.</p>
            
            <h3>📱 Günlük Hayattaki Kullanım Alanları</h3>
            <ul>
                <li>🎮 Eğlence (oyunlar, filmler)</li>
                <li>📚 Eğitim (dersler, ödevler)</li>
                <li>💼 İş (ofis işleri, sunumlar)</li>
                <li>📞 İletişim (arama, mesaj)</li>
                <li>🛒 Alışveriş (online alışveriş)</li>
            </ul>
            
            <h3>⚡ Teknolojinin Faydaları</h3>
            <ul>
                <li>İşleri hızlandırır</li>
                <li>Bilgiye kolay ulaşırız</li>
                <li>İletişim kurmamızı sağlar</li>
                <li>Eğlence imkanları sunar</li>
            </ul>
            
            <h3>⚠️ Dikkat Edilmesi Gerekenler</h3>
            <ul>
                <li>Çok fazla ekran süresi zararlıdır</li>
                <li>Göz sağlığına dikkat etmeliyiz</li>
                <li>Düzenli mola vermelidir</li>
                <li>Fiziksel aktivite önemlidir</li>
            </ul>
        `
    },
    donanım: {
        title: "🖥️ Bilgisayar Donanımı",
        content: `
            <h3>🖥️ Bilgisayar Parçaları</h3>
            <p>Bilgisayar birçok parçadan oluşur. Her parçanın farklı bir görevi vardır.</p>
            
            <h3>📺 Giriş Birimleri (Veri Girişi)</h3>
            <ul>
                <li>⌨️ <strong>Klavye:</strong> Yazı yazmak için kullanılır</li>
                <li>🖱️ <strong>Fare:</strong> Ekrandaki şeyleri seçmek için kullanılır</li>
                <li>📷 <strong>Kamera:</strong> Resim ve video çekmek için kullanılır</li>
                <li>🎤 <strong>Mikrofon:</strong> Ses kaydetmek için kullanılır</li>
            </ul>
            
            <h3>📺 Çıkış Birimleri (Sonuç Gösterme)</h3>
            <ul>
                <li>🖥️ <strong>Monitör:</strong> Görüntüyü gösterir</li>
                <li>🔊 <strong>Hoparlör:</strong> Ses çalar</li>
                <li>🖨️ <strong>Yazıcı:</strong> Kağıda yazı ve resim basar</li>
                <li>🎧 <strong>Kulaklık:</strong> Ses dinlemek için kullanılır</li>
            </ul>
            
            <h3>💾 Depolama Birimleri</h3>
            <ul>
                <li>💾 <strong>Hard Disk:</strong> Bilgisayarın ana hafızası</li>
                <li>🔷 <strong>SSD:</strong> Daha hızlı yeni nesil hafıza</li>
                <li>📱 <strong>USB Bellek:</strong> Taşınabilir hafıza</li>
                <li>☁️ <strong>Bulut Hafıza:</strong> İnternet üzerindeki hafıza</li>
            </ul>
            
            <h3>🧠 İşlemci (Beyin)</h3>
            <p>İşlemci bilgisayarın beynidir. Tüm işlemleri burada yapılır. Ne kadar hızlı olursa bilgisayar o kadar hızlı çalışır.</p>
        `
    },
    güvenlik: {
        title: "🔒 Güvenlik ve Etik",
        content: `
            <h3>🔒 İnternet Güvenliği</h3>
            <p>İnternet kullanırken güvenliğimize dikkat etmeliyiz.</p>
            
            <h3>🔐 Şifre Güvenliği</h3>
            <ul>
                <li>Güçlü şifre kullanmalıyız</li>
                <li>Şifremizi kimseyle paylaşmamalıyız</li>
                <li>Farklı siteler için farklı şifreler kullanmalıyız</li>
                <li>Şifrelerimizde harf, rakam ve sembol kullanmalıyız</li>
            </ul>
            
            <h3>👤 Kişisel Bilgiler</h3>
            <ul>
                <li>Adres, telefon numarası gibi bilgileri paylaşmamalıyız</li>
                <li>Tanımadığımız kişilerle konuşmamalıyız</li>
                <li>Fotoğraflarımızı dikkatli paylaşmalıyız</li>
                <li>Konum bilgisini kapatmalıyız</li>
            </ul>
            
            <h3>🤝 Dijital Etik</h3>
            <ul>
                <li>İnternette kibar olmalıyız</li>
                <li>Başkalarına saygı duymalıyız</li>
                <li>Yalan bilgi paylaşmamalıyız</li>
                <li>Başkalarının eserlerini çalmamalıyız</li>
            </ul>
            
            <h3>🛡️ Güvenli İnternet Kullanımı</h3>
            <ul>
                <li>Sadece https:// ile başlayan siteleri kullanalım</li>
                <li>Tanımadığımız linklere tıklamayalım</li>
                <li>Antivirüs programı kullanalım</li>
                <li>Yazılım güncellemelerini yapalım</li>
            </ul>
        `
    },
    yapayzeka: {
        title: "🤖 Yapay Zekâ",
        content: `
            <h3>🤖 Yapay Zekâ Nedir?</h3>
            <p>Yapay zekâ, bilgisayarların insan gibi düşünmesini ve öğrenmesini sağlayan teknolojidir.</p>
            
            <h3>🎯 Yapay Zekâ Kullanım Alanları</h3>
            <ul>
                <li>📱 <strong>Sesli Asistanlar:</strong> Siri, Alexa gibi</li>
                <li>🚗 <strong>Otomobiller:</strong> Sürücüsüz arabalar</li>
                <li>🏥 <strong>Sağlık:</strong> Hastalık teşhisi</li>
                <li>🎮 <strong>Oyunlar:</strong> Akıllı oyun karakterleri</li>
                <li>📸 <strong>Fotoğraf:</strong> Yüz tanıma</li>
            </ul>
            
            <h3>🧠 Yapay Zekâ Nasıl Çalışır?</h3>
            <ul>
                <li>Çok fazla veri ile öğrenir</li>
                <li>Örneklerden ders alır</li>
                <li>Zamanla gelişir</li>
                <li>Hatalarından ders çıkarır</li>
            </ul>
            
            <h3>⚠️ Yapay Zekâ ve Güvenlik</h3>
            <ul>
                <li>Kişisel verilerimizi korumalıyız</li>
                <li>Yapay zekâ sonuçlarını kontrol etmeliyiz</li>
                <li>Aşırı bağımlılıktan kaçınmalıyız</li>
                <li>Etik kullanım önemlidir</li>
            </ul>
            
            <h3>🌟 Geleceğin Teknolojisi</h3>
            <p>Yapay zekâ gelecekte hayatımızı daha da kolaylaştıracak. Ancak dikkatli ve sorumlu kullanmalıyız.</p>
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