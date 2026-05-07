const gplay = require('google-play-scraper').default;
const fs = require('fs');
console.log(gplay);
// Hàm quy đổi dung lượng dạng text sang Megabyte (MB) để mô phỏng tải app
const parseSizeToMB = (sizeStr) => {
    if (!sizeStr || sizeStr === 'Varies with device') {
        // Random 20MB đến 300MB cho các app ẩn dung lượng
        return Math.floor(Math.random() * (300 - 20 + 1)) + 20;
    }
    const upperSize = sizeStr.toUpperCase();
    let value = parseFloat(upperSize);
    if (upperSize.includes('M')) return value;
    if (upperSize.includes('G')) return value * 1024;
    if (upperSize.includes('K')) return value / 1024;
    return value || 50;
};

// Hàm delay để tránh bị ban IP
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const scrapeDetailedApps = async () => {
    console.log('Bắt đầu lấy danh sách App ID...');
    const appIds = new Set(); // Dùng Set để tự động loại bỏ ID trùng lặp

    const categories = [
        gplay.category.GAME_ACTION, gplay.category.GAME_ROLE_PLAYING,
        gplay.category.PRODUCTIVITY, gplay.category.EDUCATION,
        gplay.category.ENTERTAINMENT, gplay.category.TOOLS
    ];

    const collections = [gplay.collection.TOP_FREE, gplay.collection.TOP_PAID];

    // 1. Cào lấy danh sách App ID
    for (const category of categories) {
        for (const collection of collections) {
            try {
                const list = await gplay.list({
                    category, collection, num: 100, country: 'vn', lang: 'vi'
                });
                list.forEach(item => appIds.add(item.appId));
                console.log(`Đã lấy ID từ [${category}] - [${collection}]`);
            } catch (error) {
                console.log(`Lỗi khi lấy list: ${error.message}`);
            }
        }
    }

    const uniqueAppIds = Array.from(appIds).slice(0, 1000); // Lấy đúng 1000 app
    console.log(`\nTìm thấy ${uniqueAppIds.length} ứng dụng duy nhất. Bắt đầu lấy dữ liệu chi tiết...`);

    const detailedApps = [];
    let count = 0;

    // 2. Duyệt qua từng ID để lấy full chi tiết (Screenshot, Video, Mail dev...)
    for (const appId of uniqueAppIds) {
        count++;
        try {
            const details = await gplay.app({ appId, country: 'vn', lang: 'vi' });

            const appData = {
                appId: details.appId,
                title: details.title,
                summary: details.summary,
                description: details.description,
                developer: details.developer,
                developerId: details.developerId,
                developerEmail: details.developerEmail,
                developerWebsite: details.developerWebsite,
                icon: details.icon,
                headerImage: details.headerImage,
                screenshots: details.screenshots,
                video: details.video,
                videoImage: details.videoImage,
                price: details.price || 0,
                free: details.free,
                genre: details.genre,
                genreId: details.genreId,
                sizeText: details.size,
                sizeMB: parseSizeToMB(details.size), // Yêu cầu cốt lõi: Tính toán số MB
                score: details.score || 0,
                ratings: details.ratings || 0,
                reviews: details.reviews || 0,
                installs: details.installs,
                minInstalls: details.minInstalls || 0,
                version: details.version,
                androidVersionText: details.androidVersionText,
                released: details.released,
                updated: details.updated,
                recentChanges: details.recentChanges
            };

            detailedApps.push(appData);
            console.log(`[${count}/${uniqueAppIds.length}] Đã cào chi tiết: ${details.title}`);

            // Chờ 1 giây để Google không khoá IP
            await delay(1000);

        } catch (error) {
            console.error(`Lỗi cào app ${appId}:`, error.message);
        }
    }

    // 3. Ghi ra file JSON
    fs.writeFileSync('./apps-mock-data.json', JSON.stringify(detailedApps, null, 2));
    console.log('\nXong! Đã lưu toàn bộ dữ liệu chi tiết vào file apps-mock-data.json');
};

scrapeDetailedApps();