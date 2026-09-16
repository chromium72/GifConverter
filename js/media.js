// --- ダウンロード・変換ロジック ---
async function downloadVideo() {
    if (mediaList.length === 0 || isProcessing) return;
    setProcessingState(true);

    const targetUrl = mediaList[currentIndex].url;
    // 複数ある場合はファイル名に _1, _2 などを付ける
    const suffix = mediaList.length > 1 ? `_${currentIndex + 1}` : '';
    const fileName = `twitter_video_${currentTweetId}${suffix}.mp4`;

    const downloadBtn = document.getElementById('downloadBtn');
    const originalHtml = downloadBtn.innerHTML;

    try {
        downloadBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 取得中...';

        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error('データ取得失敗');

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = fileName;

        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
        }, 100);

    } catch (error) {
        console.error('Download error:', error);
        showMessage('直接ダウンロードに失敗しました。ブラウザで開きますので、右クリック等から保存してください。', 'error');
        setTimeout(() => window.open(targetUrl, '_blank'), 1500);
    } finally {
        downloadBtn.innerHTML = originalHtml;
        setProcessingState(false);
    }
}

async function convertAndDownloadGif() {
    if (mediaList.length === 0 || isProcessing) return;
    setProcessingState(true);

    const targetUrl = mediaList[currentIndex].url;
    const suffix = mediaList.length > 1 ? `_${currentIndex + 1}` : '';
    const fileName = `twitter_converted_${currentTweetId}${suffix}.gif`;

    const convertBtn = document.getElementById('convertBtn');
    const progressArea = document.getElementById('progressArea');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const videoElement = document.getElementById('mediaPreview');

    try {
        convertBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 準備中...';
        progressArea.classList.remove('hidden');
        progressBar.style.width = '0%';
        progressText.innerText = '動画データを取得中...';

        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error('動画データの取得に失敗');
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const duration = videoElement.duration && isFinite(videoElement.duration) ? videoElement.duration : 5;

        let width = videoElement.videoWidth || 320;
        let height = videoElement.videoHeight || 320;
        const maxWidth = 320;
        if (width > maxWidth) {
            const ratio = maxWidth / width;
            width = maxWidth;
            height = Math.floor(height * ratio);
        }

        const fps = 10;
        const numFrames = Math.floor(duration * fps);

        progressText.innerText = 'ブラウザ内でGIFに変換中... (処理中は切り替えできません)';
        convertBtn.innerHTML = '<i class="fa-solid fa-gears fa-spin"></i> 変換処理中...';

        gifshot.createGIF({
            video: [blobUrl],
            gifWidth: width,
            gifHeight: height,
            numFrames: numFrames,
            frameDuration: 10,
            sampleInterval: 10,
            progressCallback: function (captureProgress) {
                const percent = Math.floor(captureProgress * 100);
                progressBar.style.width = percent + '%';
                if (percent > 95) {
                    progressText.innerText = '最終エンコード中...';
                }
            }
        }, function (obj) {
            window.URL.revokeObjectURL(blobUrl);
            progressArea.classList.add('hidden');

            if (!obj.error) {
                const base64Image = obj.image;
                const a = document.createElement('a');
                a.href = base64Image;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                convertBtn.innerHTML = '<i class="fa-solid fa-check"></i> 変換完了！';
                setTimeout(() => resetConvertBtn(), 3000);
            } else {
                throw new Error('エンコードに失敗しました');
            }
        });

    } catch (error) {
        console.error('GIF Convert error:', error);
        showMessage('GIFへの変換に失敗しました。動画サイズが大きいか非対応の形式です。<br>詳細: ' + error.message, 'error');
        resetConvertBtn();
    }

    function resetConvertBtn() {
        convertBtn.innerHTML = '<i class="fa-solid fa-file-arrow-down"></i> 本物のGIFに変換して保存';
        setProcessingState(false);
        progressArea.classList.add('hidden');
    }
}
