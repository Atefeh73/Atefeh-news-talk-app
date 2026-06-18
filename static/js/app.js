document.addEventListener('DOMContentLoaded', () => {
    // State
    let allUpdates = [];
    let activeFilter = 'all';
    let searchQuery = '';
    let selectedUpdateForTweet = null;
    let selectedUpdateForIG = null;

    // DOM Elements
    const refreshBtn = document.getElementById('refresh-btn');
    const refreshIcon = document.getElementById('refresh-icon');
    const searchInput = document.getElementById('search-input');
    const filterChips = document.querySelectorAll('.filter-chip');
    const notesList = document.getElementById('notes-list');
    
    // Status Elements
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const errorMessage = document.getElementById('error-message');
    const retryBtn = document.getElementById('retry-btn');
    const emptyState = document.getElementById('empty-state');

    // X / Twitter Modal Elements
    const shareModal = document.getElementById('share-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalBadge = document.getElementById('modal-badge');
    const modalDate = document.getElementById('modal-date');
    const modalHeadline = document.getElementById('modal-headline');
    const modalSourceText = document.getElementById('modal-source-text');
    const tweetTextarea = document.getElementById('tweet-textarea');
    const charCounter = document.getElementById('char-counter');
    const cancelTweetBtn = document.getElementById('cancel-tweet-btn');
    const sendTweetBtn = document.getElementById('send-tweet-btn');

    // Instagram Modal Elements
    const instagramModal = document.getElementById('instagram-modal');
    const closeIgModalBtn = document.getElementById('close-ig-modal-btn');
    const cancelIgBtn = document.getElementById('cancel-ig-btn');
    const copyIgCaptionBtn = document.getElementById('copy-ig-caption-btn');
    const downloadIgCardBtn = document.getElementById('download-ig-card-btn');
    const igCaptionTextarea = document.getElementById('ig-caption-textarea');
    const igCopiedNotification = document.getElementById('ig-copied-notification');
    const igCanvas = document.getElementById('ig-canvas');

    // Fetch and process data
    async function loadReleaseNotes() {
        showStatus('loading');
        try {
            const response = await fetch('/api/releases');
            if (!response.ok) {
                throw new Error(`Server returned status ${response.status}`);
            }
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.error || 'Failed to fetch news feed.');
            }
            
            allUpdates = processReleases(data.releases);
            renderUpdates();
        } catch (error) {
            console.error('Error fetching news feed:', error);
            errorMessage.textContent = error.message;
            showStatus('error');
        }
    }

    // Parse feed JSON items
    function processReleases(releases) {
        const parsedUpdates = [];

        releases.forEach(release => {
            const headline = release.headline || 'Breaking News';
            const contentHtml = release.content || '';
            const plainText = stripHtml(contentHtml);
            const type = classifyNews(headline, plainText);

            parsedUpdates.push({
                id: release.id,
                date: release.title, 
                updatedIso: release.updated,
                headline: headline,
                type: type,
                html: contentHtml,
                text: plainText
            });
        });

        return parsedUpdates;
    }

    // Simple keyword-based news classifier
    function classifyNews(headline, textContent) {
        const text = (headline + " " + textContent).toLowerCase();
        
        if (text.includes('trump') || text.includes('biden') || text.includes('election') || 
            text.includes('senate') || text.includes('politics') || text.includes('government') || 
            text.includes('court') || text.includes('mccarthy') || text.includes('white house') ||
            text.includes('gop') || text.includes('democrat')) {
            return 'politics';
        }
        
        if (text.includes('china') || text.includes('iran') || text.includes('g7') || 
            text.includes('summit') || text.includes('ukraine') || text.includes('international') || 
            text.includes('world') || text.includes('global') || text.includes('foreign')) {
            return 'world';
        }
        
        if (text.includes('fed') || text.includes('rates') || text.includes('economy') || 
            text.includes('market') || text.includes('stock') || text.includes('oil') || 
            text.includes('finance') || text.includes('business') || text.includes('debt') ||
            text.includes('interest rates')) {
            return 'business';
        }
        
        if (text.includes('tech') || text.includes('ai') || text.includes('chatgpt') || 
            text.includes('apple') || text.includes('netflix') || text.includes('space') || 
            text.includes('science') || text.includes('supermassive') || text.includes('astronomer') ||
            text.includes('black hole') || text.includes('digital') || text.includes('malware') || 
            text.includes('balloon') || text.includes('astronaut')) {
            return 'tech';
        }
        
        return 'general'; // Default fallback
    }

    function stripHtml(html) {
        // Strip out the CNN Read More link when showing preview text
        let cleanHtml = html.replace(/<p><a href=.*?Read full story on CNN.*?<\/a><\/p>/, '');
        const doc = new DOMParser().parseFromString(cleanHtml, 'text/html');
        return doc.body.textContent.trim() || "";
    }

    // Render filtered/searched list
    function renderUpdates() {
        const filtered = allUpdates.filter(update => {
            const matchesType = activeFilter === 'all' || update.type === activeFilter;
            const matchesSearch = !searchQuery || 
                update.headline.toLowerCase().includes(searchQuery) ||
                update.text.toLowerCase().includes(searchQuery) ||
                update.date.toLowerCase().includes(searchQuery) ||
                update.type.toLowerCase().includes(searchQuery);
            return matchesType && matchesSearch;
        });

        if (filtered.length === 0) {
            showStatus('empty');
            return;
        }

        notesList.innerHTML = '';
        filtered.forEach(update => {
            const card = document.createElement('article');
            card.className = `update-card card-${update.type}`;
            
            card.innerHTML = `
                <div class="card-header">
                    <div class="card-meta">
                        <span class="type-badge badge-${update.type}">${update.type}</span>
                        <span class="update-date">
                            <i class="fa-regular fa-clock"></i> ${update.date || 'Breaking'}
                        </span>
                    </div>
                </div>
                <div class="card-body">
                    <h3 style="font-family: var(--font-heading); font-size: 1.3rem; margin-bottom: 0.8rem; color: #fff; font-weight: 700; line-height: 1.35;">
                        ${update.headline}
                    </h3>
                    <div style="font-size: 0.95rem; color: rgba(255,255,255,0.8);">
                        ${update.html}
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn btn-secondary btn-ig-trigger" data-id="${update.id}" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
                        <i class="fa-brands fa-instagram"></i> Instagram Card
                    </button>
                    <button class="btn btn-share btn-tweet-trigger" data-id="${update.id}" style="padding: 0.5rem 1rem; font-size: 0.85rem; margin-left: 0.5rem;">
                        <i class="fa-brands fa-x-twitter"></i> Tweet Story
                    </button>
                </div>
            `;
            notesList.appendChild(card);
        });

        // Add event listeners to X/Twitter share buttons
        notesList.querySelectorAll('.btn-tweet-trigger').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const update = allUpdates.find(u => u.id === id);
                if (update) {
                    openTweetComposer(update);
                }
            });
        });

        // Add event listeners to Instagram share buttons
        notesList.querySelectorAll('.btn-ig-trigger').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const update = allUpdates.find(u => u.id === id);
                if (update) {
                    openInstagramComposer(update);
                }
            });
        });

        showStatus('list');
    }

    // View state switcher
    function showStatus(state) {
        loadingState.classList.add('hidden');
        errorState.classList.add('hidden');
        emptyState.classList.add('hidden');
        notesList.classList.add('hidden');

        if (state === 'loading') {
            loadingState.classList.remove('hidden');
            refreshIcon.classList.add('spin');
            refreshBtn.disabled = true;
        } else if (state === 'error') {
            errorState.classList.remove('hidden');
            refreshIcon.classList.remove('spin');
            refreshBtn.disabled = false;
        } else if (state === 'empty') {
            emptyState.classList.remove('hidden');
            refreshIcon.classList.remove('spin');
            refreshBtn.disabled = false;
        } else if (state === 'list') {
            notesList.classList.remove('hidden');
            refreshIcon.classList.remove('spin');
            refreshBtn.disabled = false;
        }
    }

    // Filter handlers
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeFilter = chip.getAttribute('data-type');
            renderUpdates();
        });
    });

    // Search handler with debounce
    let searchDebounce;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
            searchQuery = e.target.value.toLowerCase().trim();
            renderUpdates();
        }, 250);
    });

    // Refresh & Retry Button triggers
    refreshBtn.addEventListener('click', loadReleaseNotes);
    retryBtn.addEventListener('click', loadReleaseNotes);

    // X/Twitter Composer Modal Logic
    function openTweetComposer(update) {
        selectedUpdateForTweet = update;
        
        modalBadge.className = `type-badge badge-${update.type}`;
        modalBadge.textContent = update.type;
        modalDate.textContent = update.date || 'Breaking';
        modalHeadline.textContent = update.headline;
        modalSourceText.textContent = update.text;

        const brandTag = `[CNN]`;
        const categoryHash = `#${update.type.toUpperCase()}`;
        
        const fixedLength = brandTag.length + categoryHash.length + 8;
        const maxHeadlineLen = 280 - fixedLength;
        
        let tweetHeadline = update.headline;
        if (tweetHeadline.length > maxHeadlineLen) {
            tweetHeadline = tweetHeadline.substring(0, maxHeadlineLen - 3) + '...';
        }

        const defaultTweet = `${brandTag} ${tweetHeadline} ${categoryHash}`;
        tweetTextarea.value = defaultTweet;
        updateCharCounter();

        shareModal.classList.remove('hidden');
        tweetTextarea.focus();
    }

    function closeTweetComposer() {
        shareModal.classList.add('hidden');
        selectedUpdateForTweet = null;
    }

    function updateCharCounter() {
        const len = tweetTextarea.value.length;
        charCounter.textContent = `${len} / 280`;
        if (len > 280) {
            charCounter.style.color = '#ef4444';
            sendTweetBtn.disabled = true;
        } else {
            charCounter.style.color = 'var(--text-muted)';
            sendTweetBtn.disabled = false;
        }
    }

    tweetTextarea.addEventListener('input', updateCharCounter);
    closeModalBtn.addEventListener('click', closeTweetComposer);
    cancelTweetBtn.addEventListener('click', closeTweetComposer);

    sendTweetBtn.addEventListener('click', () => {
        const text = tweetTextarea.value;
        const twitterIntentUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(twitterIntentUrl, '_blank');
        closeTweetComposer();
    });

    // Instagram Composer Modal Logic
    function openInstagramComposer(update) {
        selectedUpdateForIG = update;
        igCopiedNotification.style.display = 'none';

        // 1. Generate description caption text
        const caption = `📢 CNN NEWS ALERT 📢\n\n🔹 ${update.headline.toUpperCase()}\n\n📝 ${update.text}\n\n📍 Read the full coverage on CNN.\n\n---\n#CNN #BreakingNews #NewsAlert #GlobalNews #${update.type.toUpperCase()}`;
        igCaptionTextarea.value = caption;

        // 2. Draw card image on canvas
        drawInstagramCard(update);

        // Show Modal
        instagramModal.classList.remove('hidden');
    }

    function closeInstagramComposer() {
        instagramModal.classList.add('hidden');
        selectedUpdateForIG = null;
    }

    // Draw card graphics dynamically using Canvas
    function drawInstagramCard(update) {
        const ctx = igCanvas.getContext('2d');
        const W = igCanvas.width;
        const H = igCanvas.height;

        // Background: Deep Navy
        ctx.fillStyle = '#030a16';
        ctx.fillRect(0, 0, W, H);

        // Radial Glow (Royal Blue)
        const gradient = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, W / 2);
        gradient.addColorStop(0, 'rgba(29, 78, 216, 0.18)');
        gradient.addColorStop(1, 'rgba(3, 10, 22, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);

        // Decorative borders
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 15;
        ctx.strokeRect(30, 30, W - 60, H - 60);

        // Category Badge Color Mapping
        const catColors = {
            politics: '#f87171',
            world: '#38bdf8',
            business: '#34d399',
            tech: '#a78bfa',
            general: '#94a3b8'
        };
        const catColor = catColors[update.type] || '#94a3b8';

        // Draw top brand banner
        ctx.font = 'bold 24px Outfit, system-ui, sans-serif';
        ctx.fillStyle = '#ef4444'; // CNN Red
        ctx.textAlign = 'center';
        ctx.fillText('CNN', W / 2 - 40, 95);

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.fillText('NEWS ALERT', W / 2 - 10, 95);

        // Draw thin partition line
        ctx.beginPath();
        ctx.moveTo(100, 130);
        ctx.lineTo(W - 100, 130);
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw Category Badge Capsule
        ctx.fillStyle = catColor;
        ctx.beginPath();
        ctx.roundRect(W / 2 - 80, 165, 160, 32, 16);
        ctx.fill();

        ctx.font = 'bold 13px Outfit, system-ui, sans-serif';
        ctx.fillStyle = '#030a16'; // Contrast text
        ctx.textAlign = 'center';
        ctx.fillText(update.type.toUpperCase(), W / 2, 186);

        // Draw main headline
        ctx.font = 'bold 36px Outfit, system-ui, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        
        // Wrap text algorithm
        const startY = 270;
        const lineH = 46;
        const maxW = 440;
        wrapCanvasText(ctx, update.headline, W / 2, startY, maxW, lineH);

        // Draw Date at the bottom
        ctx.font = '500 16px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.textAlign = 'center';
        ctx.fillText(update.date || 'LATEST BREAKING NEWS', W / 2, H - 90);
    }

    // Helper function to wrap lines on Canvas
    function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        const lines = [];

        for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + ' ';
            let metrics = ctx.measureText(testLine);
            let testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                lines.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);

        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i].trim(), x, y + (i * lineHeight));
        }
    }

    // Copy caption listener
    copyIgCaptionBtn.addEventListener('click', () => {
        igCaptionTextarea.select();
        document.execCommand('copy');
        
        // Show copying notification
        igCopiedNotification.style.display = 'inline';
        setTimeout(() => {
            igCopiedNotification.style.display = 'none';
        }, 2000);
    });

    // Download PNG Share Card listener
    downloadIgCardBtn.addEventListener('click', () => {
        const image = igCanvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.download = `cnn_story_${selectedUpdateForIG ? selectedUpdateForIG.type : 'share'}.png`;
        link.href = image;
        link.click();
    });

    // Close IG listeners
    closeIgModalBtn.addEventListener('click', closeInstagramComposer);
    cancelIgBtn.addEventListener('click', closeInstagramComposer);

    // Global background overlay click closes modals
    window.addEventListener('click', (e) => {
        if (e.target === shareModal) {
            closeTweetComposer();
        }
        if (e.target === instagramModal) {
            closeInstagramComposer();
        }
    });

    // Initial Load
    loadReleaseNotes();
});
