// --- プレビュー表示ロジック ---
function renderPreview() {
    const currentMedia = mediaList[currentIndex];
    const videoElement = document.getElementById('mediaPreview');
    const counterElement = document.getElementById('mediaCounter');
    const thumbContainer = document.getElementById('thumbnailList');
    const badgeElement = document.getElementById('mediaTypeBadge');

    // プレビューの更新
    videoElement.src = currentMedia.url;
    document.getElementById('openLinkBtn').href = currentMedia.url;

    // バッジの更新 (GIFか動画か)
    badgeElement.style.display = 'block';
    badgeElement.innerText = currentMedia.type === 'gif' ? 'GIF (MP4)' : '動画';

    // 自動再生
    videoElement.play().catch(e => console.log("自動再生ブロック"));

    // 複数ある場合のUI制御
    if (mediaList.length > 1) {
        // カウンター
        counterElement.innerText = `${currentIndex + 1} / ${mediaList.length}`;
        counterElement.style.display = 'block';

        // 左右ボタン
        document.getElementById('prevBtn').style.display = currentIndex > 0 ? 'block' : 'none';
        document.getElementById('nextBtn').style.display = currentIndex < mediaList.length - 1 ? 'block' : 'none';

        // サムネイルリストの生成
        thumbContainer.style.display = 'flex';
        thumbContainer.innerHTML = '';

        mediaList.forEach((m, i) => {
            const img = document.createElement('img');
            // サムネイル画像がない場合のフォールバック
            img.src = m.thumbnail_url || 'https://via.placeholder.com/150/000000/FFFFFF?text=Video';
            img.alt = `Thumbnail ${i + 1}`;

            // 選択中かどうかでスタイルを変更
            const baseClass = "flex-none w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg cursor-pointer border-2 transition-all snap-start";
            const activeClass = i === currentIndex ? "border-twitter opacity-100 scale-105" : "border-transparent opacity-50 hover:opacity-80";
            img.className = `${baseClass} ${activeClass}`;

            // 処理中はクリック無効
            img.onclick = () => {
                if (!isProcessing) selectMedia(i);
            };

            thumbContainer.appendChild(img);
        });

        // 選択されたサムネイルが見える位置までスクロール
        const activeThumb = thumbContainer.children[currentIndex];
        if (activeThumb) {
            activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }

    } else {
        counterElement.style.display = 'none';
        thumbContainer.style.display = 'none';
        document.getElementById('prevBtn').style.display = 'none';
        document.getElementById('nextBtn').style.display = 'none';
    }
}

// --- メディア切り替え処理 ---
function selectMedia(index) {
    // 範囲外アクセスと処理中のロック
    if (index < 0 || index >= mediaList.length || isProcessing || index === currentIndex) return;
    currentIndex = index;
    renderPreview();
}

// --- スワイプイベントの処理 ---
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("DOMContentLoaded", () => {
    const previewContainer = document.getElementById('mainPreviewContainer');
    
    if (previewContainer) {
        previewContainer.addEventListener('touchstart', e => {
            if (isProcessing) return;
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        previewContainer.addEventListener('touchend', e => {
            if (isProcessing) return;
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
});

function handleSwipe() {
    const swipeThreshold = 50; // スワイプと判定する最低移動距離(px)
    if (touchEndX < touchStartX - swipeThreshold) {
        // 左にスワイプ -> 次の動画へ
        if (currentIndex < mediaList.length - 1) selectMedia(currentIndex + 1);
    }
    if (touchEndX > touchStartX + swipeThreshold) {
        // 右にスワイプ -> 前の動画へ
        if (currentIndex > 0) selectMedia(currentIndex - 1);
    }
}
