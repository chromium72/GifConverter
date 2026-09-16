// --- グローバル変数 ---
let mediaList = [];      // 抽出した動画/GIFのリスト
let currentIndex = 0;    // 現在選択されているメディアのインデックス
let currentTweetId = ''; // 現在のツイートID
let isProcessing = false;// ダウンロードまたは変換処理中フラグ
