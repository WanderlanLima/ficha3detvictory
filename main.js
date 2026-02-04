import './style.css';
import html2canvas from 'html2canvas';

// State
const state = {
    currentId: null,
    data: {
        name: '',
        archetype: '',
        xp: 0,
        image: '',
        // Image Manipulation
        imgScale: 1,
        imgPosX: 0,
        imgPosY: 0,
        imgFullArt: false,

        p: 0, h: 0, r: 0,
        pas: 0, pms: 0, pvs: 0,

        kits: '',
        color_kits: '#FFD700',

        vantagens: '',
        color_vantagens: '#4CAF50',

        desvantagens: '',
        color_desvantagens: '#F44336',

        pericias: '',
        color_pericias: '#2196F3',

        tecnicas: '',
        color_tecnicas: '#9C27B0',

        inventario: '',
        color_inventario: '#FF9800'
    }
};

// Elements
const inputs = {
    name: document.getElementById('char-name'),
    archetype: document.getElementById('char-archetype'),
    xp: document.getElementById('char-xp'),

    imageUpload: document.getElementById('char-image-upload'),
    imageUrl: document.getElementById('char-image-url'),

    imgScale: document.getElementById('img-scale'),
    imgPosX: document.getElementById('img-pos-x'),
    imgPosY: document.getElementById('img-pos-y'),
    imgFullArt: document.getElementById('img-full-art'),

    p: document.getElementById('stat-p'),
    h: document.getElementById('stat-h'),
    r: document.getElementById('stat-r'),
    pas: document.getElementById('char-pas'),
    pms: document.getElementById('char-pms'),
    pvs: document.getElementById('char-pvs'),

    kits: document.getElementById('char-kits'),
    color_kits: document.getElementById('color-kits'),

    vantagens: document.getElementById('char-vantagens'),
    color_vantagens: document.getElementById('color-vantagens'),

    desvantagens: document.getElementById('char-desvantagens'),
    color_desvantagens: document.getElementById('color-desvantagens'),

    pericias: document.getElementById('char-pericias'),
    color_pericias: document.getElementById('color-pericias'),

    tecnicas: document.getElementById('char-tecnicas'),
    color_tecnicas: document.getElementById('color-tecnicas'),

    inventario: document.getElementById('char-inventario'),
    color_inventario: document.getElementById('color-inventario'),
};

const cardElements = {
    name: document.getElementById('card-name'),
    archetype: document.getElementById('card-archetype'),
    xp: document.getElementById('card-xp'),
    xpBadge: document.getElementById('xp-badge'),

    img: document.getElementById('card-img'),
    placeholder: document.getElementById('card-img-placeholder'),
    p: document.getElementById('card-p'),
    h: document.getElementById('card-h'),
    r: document.getElementById('card-r'),
    pas: document.getElementById('card-pas'),
    pm: document.getElementById('card-pm'),
    pv: document.getElementById('card-pv'),
    total: document.getElementById('card-total-points'),

    // Containers
    kits: document.getElementById('card-kits'),
    vantagens: document.getElementById('card-vantagens'),
    desvantagens: document.getElementById('card-desvantagens'),
    pericias: document.getElementById('card-pericias'),
    tecnicas: document.getElementById('card-tecnicas'),
    inventario: document.getElementById('card-inventario'),

    // Blocks to hide if empty
    block_kits: document.getElementById('block-kits'),
    block_vantagens: document.getElementById('block-vantagens'),
    block_desvantagens: document.getElementById('block-desvantagens'),
    block_pericias: document.getElementById('block-pericias'),
    block_tecnicas: document.getElementById('block-tecnicas'),
    block_inventario: document.getElementById('block-inventario'),
};



function updateCard() {
    // Update UI Stats
    cardElements.name.textContent = state.data.name || 'Nome do Personagem';

    // Archetype
    if (state.data.archetype) {
        cardElements.archetype.textContent = state.data.archetype;
        cardElements.archetype.style.display = 'block';
    } else {
        cardElements.archetype.style.display = 'none';
    }

    // XP
    if (state.data.xp > 0) {
        cardElements.xp.textContent = state.data.xp;
        cardElements.xpBadge.style.display = 'flex';
    } else {
        cardElements.xpBadge.style.display = 'none';
    }

    cardElements.p.textContent = state.data.p;
    cardElements.h.textContent = state.data.h;
    cardElements.r.textContent = state.data.r;

    cardElements.pas.textContent = state.data.p + state.data.pas;
    cardElements.pv.textContent = (state.data.r * 5) + state.data.pvs;
    cardElements.pm.textContent = (state.data.h * 5) + state.data.pms;

    // Render Tags
    renderTags(cardElements.kits, cardElements.block_kits, state.data.kits, state.data.color_kits);
    renderTags(cardElements.vantagens, cardElements.block_vantagens, state.data.vantagens, state.data.color_vantagens);
    renderTags(cardElements.desvantagens, cardElements.block_desvantagens, state.data.desvantagens, state.data.color_desvantagens);
    renderTags(cardElements.pericias, cardElements.block_pericias, state.data.pericias, state.data.color_pericias);
    renderTags(cardElements.tecnicas, cardElements.block_tecnicas, state.data.tecnicas, state.data.color_tecnicas);
    renderTags(cardElements.inventario, cardElements.block_inventario, state.data.inventario, state.data.color_inventario);

    const total = state.data.p + state.data.h + state.data.r;
    cardElements.total.textContent = total + 'pt';

    // Image
    if (state.data.image) {
        cardElements.img.src = state.data.image;
        cardElements.img.style.display = 'block';
        cardElements.placeholder.style.display = 'none';

        // Apply Transform
        const scale = state.data.imgScale || 1;
        const x = state.data.imgPosX || 0;
        const y = state.data.imgPosY || 0;
        cardElements.img.style.transform = `scale(${scale}) translate(${x}px, ${y}px)`;

        // Full Art Toggle
        const cardContainer = document.querySelector('.victory-card');
        const imgContainer = document.querySelector('.card-image-area');

        if (state.data.imgFullArt) {
            cardContainer.classList.add('full-art');
            imgContainer.classList.add('full-art');
        } else {
            cardContainer.classList.remove('full-art');
            imgContainer.classList.remove('full-art');
        }

    } else {
        cardElements.img.style.display = 'none';
        cardElements.placeholder.style.display = 'block';
    }
}

// Initialization
function init() {
    setupListeners();
    loadLastChar();
    updateCard();
}

function setupListeners() {
    // Input Listeners
    Object.keys(inputs).forEach(key => {
        if (!inputs[key]) return;
        inputs[key].addEventListener('input', (e) => {
            if (key === 'imageUpload') {
                handleImageUpload(e);
            } else if (key === 'imageUrl') {
                state.data.image = e.target.value;
                updateCard();
            } else if (key === 'imgFullArt') {
                // Special handling for checkbox
                state.data.imgFullArt = e.target.checked;
                updateCard();
            } else {
                updateStateFromInput(key, e.target.value);
            }
        });
    });

    // Navigation (Mobile)
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));

            e.target.classList.add('active');
            document.getElementById(e.target.dataset.target).classList.add('active');
        });
    });

    // Actions
    document.getElementById('btn-save').addEventListener('click', saveCharacter);
    document.getElementById('btn-share').addEventListener('click', shareCard);
    document.getElementById('btn-list').addEventListener('click', openLibrary);
    document.getElementById('btn-close-library').addEventListener('click', () => {
        document.getElementById('library-modal').close();
    });
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            state.data.image = event.target.result;
            updateCard();
        };
        reader.readAsDataURL(file);
    }
}

function updateStateFromInput(key, value) {
    if (['p', 'h', 'r', 'pas', 'pms', 'pvs'].includes(key)) {
        state.data[key] = parseInt(value) || 0;
    } else if (key === 'xp') {
        state.data[key] = parseInt(value) || 0;
    } else if (['imgScale', 'imgPosX', 'imgPosY'].includes(key)) {
        state.data[key] = parseFloat(value);
    } else {
        state.data[key] = value;
    }

    updateCard();
}

function renderTags(container, block, text, color) {
    if (!container) return;

    container.innerHTML = '';
    if (!text || text.trim() === '') {
        if (block) block.style.display = 'none';
        return;
    }

    if (block) block.style.display = 'block';

    const items = text.split(',').map(s => s.trim()).filter(s => s.length > 0);
    items.forEach(item => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = item;
        span.style.backgroundColor = color;
        container.appendChild(span);
    });
}



// Storage
function saveCharacter() {
    if (!state.data.name) {
        alert('Por favor, dê um nome ao personagem.');
        return;
    }

    const id = state.currentId || Date.now().toString();
    const savedList = JSON.parse(localStorage.getItem('victory_chars') || '[]');

    const charData = { id, ...state.data, lastUpdated: new Date() };

    const existingIndex = savedList.findIndex(c => c.id === id);
    if (existingIndex >= 0) {
        savedList[existingIndex] = charData;
    } else {
        savedList.push(charData);
    }

    localStorage.setItem('victory_chars', JSON.stringify(savedList));
    state.currentId = id;
    alert('Personagem salvo!');
}

function loadCharacter(id) {
    const savedList = JSON.parse(localStorage.getItem('victory_chars') || '[]');
    const char = savedList.find(c => c.id === id);
    if (char) {
        state.currentId = char.id;
        // Merge to ensure new fields exists
        state.data = { ...state.data, ...char };

        // Populate Inputs
        inputs.name.value = state.data.name || '';
        if (inputs.archetype) inputs.archetype.value = state.data.archetype || '';
        if (inputs.xp) inputs.xp.value = state.data.xp || 0;

        // Image Controls
        if (inputs.imageUrl) inputs.imageUrl.value = (state.data.image && state.data.image.startsWith('http')) ? state.data.image : '';
        if (inputs.imgScale) inputs.imgScale.value = state.data.imgScale || 1;
        if (inputs.imgPosX) inputs.imgPosX.value = state.data.imgPosX || 0;
        if (inputs.imgPosY) inputs.imgPosY.value = state.data.imgPosY || 0;
        if (inputs.imgFullArt) inputs.imgFullArt.checked = state.data.imgFullArt || false;

        inputs.p.value = state.data.p;
        inputs.h.value = state.data.h;
        inputs.r.value = state.data.r;
        inputs.pas.value = state.data.pas;
        inputs.pms.value = state.data.pms;
        inputs.pvs.value = state.data.pvs;

        if (inputs.kits) inputs.kits.value = state.data.kits || '';
        if (inputs.color_kits) inputs.color_kits.value = state.data.color_kits || '#FFD700';

        inputs.vantagens.value = state.data.vantagens || '';
        if (inputs.color_vantagens) inputs.color_vantagens.value = state.data.color_vantagens || '#4CAF50';

        inputs.desvantagens.value = state.data.desvantagens || '';
        if (inputs.color_desvantagens) inputs.color_desvantagens.value = state.data.color_desvantagens || '#F44336';

        inputs.pericias.value = state.data.pericias || '';
        if (inputs.color_pericias) inputs.color_pericias.value = state.data.color_pericias || '#2196F3';

        if (inputs.tecnicas) inputs.tecnicas.value = state.data.tecnicas || '';
        if (inputs.color_tecnicas) inputs.color_tecnicas.value = state.data.color_tecnicas || '#9C27B0';

        if (inputs.inventario) inputs.inventario.value = state.data.inventario || '';
        if (inputs.color_inventario) inputs.color_inventario.value = state.data.color_inventario || '#FF9800';

        updateCard();
        document.getElementById('library-modal').close();
    }
}

function openLibrary() {
    const savedList = JSON.parse(localStorage.getItem('victory_chars') || '[]');
    const listEl = document.getElementById('saved-list');
    listEl.innerHTML = '';

    savedList.forEach(char => {
        const li = document.createElement('li');
        li.textContent = char.name;
        li.onclick = () => loadCharacter(char.id);
        listEl.appendChild(li);
    });

    document.getElementById('library-modal').showModal();
}

function loadLastChar() {
    const savedList = JSON.parse(localStorage.getItem('victory_chars') || '[]');
    if (savedList.length > 0) {
        loadCharacter(savedList[savedList.length - 1].id);
    }
}

// Sharing
async function shareCard() {
    const card = document.getElementById('character-card');
    try {
        const canvas = await html2canvas(card, {
            backgroundColor: null,
            scale: 2 // High res,
        });

        canvas.toBlob(async (blob) => {
            if (!blob) return;

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'card.png', { type: 'image/png' })] })) {
                const file = new File([blob], `${state.data.name || 'card'}.png`, { type: 'image/png' });
                await navigator.share({
                    files: [file],
                    title: 'Ficha 3D&T Victory',
                    text: `Confira a ficha de ${state.data.name}!`
                });
            } else {
                // Fallback: Download
                const link = document.createElement('a');
                link.download = `${state.data.name || 'card'}.png`;
                link.href = canvas.toDataURL();
                link.click();
                alert('Card baixado para o dispositivo!');
            }
        });
    } catch (err) {
        console.error(err);
        alert('Erro ao gerar card.');
    }
}

init();
