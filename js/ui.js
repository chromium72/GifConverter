// --- UI表示制御関数 ---
function showMessage(text, type = 'error') {
    const msgArea = document.getElementById('messageArea');
    msgArea.className = 'mt-6 rounded-xl p-4 text-sm text-center block transition-all';

    if (type === 'error') {
        msgArea.classList.add('bg-red-50', 'text-red-600', 'border', 'border-red-200');
        msgArea.innerHTML = `<i class="fa-solid fa-triangle-exclamation mr-1"></i> ${text}`;
    } else if (type === 'success') {
        msgArea.classList.add('bg-green-50', 'text-green-600', 'border', 'border-green-200');
        msgArea.innerHTML = `<i class="fa-solid fa-circle-check mr-1"></i> ${text}`;
    } else if (type === 'info') {
        msgArea.classList.add('bg-blue-50', 'text-blue-600', 'border', 'border-blue-200');
        msgArea.innerHTML = `<i class="fa-solid fa-circle-info mr-1"></i> ${text}`;
    }
}

function hideMessage() {
    const msgArea = document.getElementById('messageArea');
    msgArea.className = 'hidden';
    msgArea.innerHTML = '';
}

function toggleUI(isLoading) {
    document.getElementById('fetchBtn').disabled = isLoading;
    document.getElementById('loadingArea').style.display = isLoading ? 'flex' : 'none';
    if (isLoading) {
        document.getElementById('resultArea').style.display = 'none';
        hideMessage();
    }
}

// --- 状態ロック関数 ---
function setProcessingState(processing) {
    isProcessing = processing;
    const elements = ['downloadBtn', 'convertBtn', 'openLinkBtn', 'fetchBtn', 'tweetUrl'];
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.disabled = processing;
    });

    // サムネイルの透明度を下げて操作不可を視覚化
    const thumbContainer = document.getElementById('thumbnailList');
    if (thumbContainer) {
        thumbContainer.style.opacity = processing ? '0.5' : '1';
        thumbContainer.style.pointerEvents = processing ? 'none' : 'auto';
    }
}
