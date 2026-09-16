// --- データ取得ロジック ---
async function fetchMedia() {
    if (isProcessing) return;

    const urlInput = document.getElementById('tweetUrl').value.trim();
    if (!urlInput) {
        showMessage('URLを入力してください。');
        return;
    }

    const regex = /(?:twitter\.com|x\.com)\/([^/]+)\/status\/(\d+)/;
    const match = urlInput.match(regex);

    if (!match) {
        showMessage('有効なTwitter(X)のツイートURLを入力してください。');
        return;
    }

    const username = match[1];
    currentTweetId = match[2];

    toggleUI(true);

    try {
        const apiUrl = `https://api.fxtwitter.com/${username}/status/${currentTweetId}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            if (response.status === 404 || response.status === 401) {
                throw new Error('ツイートが見つからないか、非公開アカウントの可能性があります。');
            } else if (response.status === 403) {
                throw new Error('APIへのアクセスがブロックされました。時間をおいて再度お試しください。');
            } else {
                throw new Error(`ツイートの取得に失敗しました（HTTP ${response.status}）。`);
            }
        }

        const data = await response.json();
        const mediaExtended = data.tweet?.media?.all || [];

        if (mediaExtended.length === 0) {
            showMessage('このツイートにはメディアが含まれていません。');
            toggleUI(false);
            return;
        }

        // 動画とGIFのみを配列として抽出
        mediaList = mediaExtended.filter(m => m.type === 'video' || m.type === 'gif');

        if (mediaList.length === 0) {
            showMessage('このツイートには動画やGIFが含まれていません。（静止画のみ）');
            toggleUI(false);
            return;
        }

        currentIndex = 0; // 初期インデックスを0にリセット

        document.getElementById('resultArea').style.display = 'block';

        if (mediaList.length > 1) {
            showMessage(`${mediaList.length}件のメディアを検出しました。スワイプやタップで切り替えられます。`, 'success');
        } else {
            showMessage('メディアの抽出に成功しました。', 'success');
        }

        renderPreview();

    } catch (error) {
        console.error(error);
        showMessage(error.message || '通信エラーが発生しました。時間をおいて再度お試しください。');
    } finally {
        toggleUI(false);
    }
}
