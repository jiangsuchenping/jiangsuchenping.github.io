/**
 * 学习系统工具模块
 * 实现艾宾浩斯记忆法和学习进度跟踪的通用功能
 */
const LearningUtil = {
    // 艾宾浩斯记忆法复习间隔（分钟）
    REVIEW_INTERVALS: [5, 30, 60, 180, 360, 720, 1440, 2880, 4320, 7200],

    /**
     * 获取下一个复习时间
     * @param {number} round - 当前复习轮次
     * @return {Date} - 下次复习时间
     */
    getNextReviewTime: function (round) {
        const now = new Date();
        const intervalIndex = Math.min(Math.max(round, 0), this.REVIEW_INTERVALS.length - 1);
        const interval = this.REVIEW_INTERVALS[intervalIndex];
        return new Date(now.getTime() + interval * 60000);
    },

    /**
     * 获取今日学习项目数量
     * @param {string} storageKey - 存储键名
     * @return {number} - 今日学习数量
     */
    getTodayLearnedCount: function (storageKey) {
        try {
            const data = StorageUtil.load(storageKey, {});
            const today = new Date().toDateString();
            return Object.values(data).filter(item =>
                new Date(item.lastTestTime).toDateString() === today
            ).length;
        } catch (error) {
            console.error('获取今日学习数量失败:', error);
            return 0;
        }
    },

    /**
     * 通用的学习项目更新函数
     * @param {string} storageKey - 存储键名
     * @param {string} itemKey - 项目键值
     * @param {Object} item - 项目数据
     * @param {boolean} isCorrect - 是否回答正确
     * @return {Object|null} - 更新后的项目数据，失败则返回null
     */
    updateLearningItem: function (storageKey, itemKey, item, isCorrect) {
        try {
            if (!itemKey) {
                console.error('更新学习数据失败: 项目键值为空');
                return null;
            }

            const data = StorageUtil.load(storageKey, {});

            // 如果项目数据不存在，则初始化
            if (!data[itemKey]) {
                data[itemKey] = {
                    ...item,
                    totalTests: 0,
                    correctCount: 0,
                    round: 0,
                    lastTestTime: new Date().toISOString(),
                    nextReviewTime: this.getNextReviewTime(0).toISOString()
                };
            }

            // 更新统计数据
            data[itemKey].totalTests++;
            if (isCorrect) {
                data[itemKey].correctCount++;
                data[itemKey].round = Math.min(data[itemKey].round + 1, this.REVIEW_INTERVALS.length - 1);
            } else {
                data[itemKey].round = Math.max(data[itemKey].round - 1, 0);
            }

            // 更新时间戳
            data[itemKey].lastTestTime = new Date().toISOString();
            data[itemKey].nextReviewTime = this.getNextReviewTime(data[itemKey].round).toISOString();

            // 保存数据
            if (StorageUtil.save(storageKey, data)) {
                return data[itemKey];
            }
            return null;
        } catch (error) {
            console.error('更新学习数据失败:', error);
            return null;
        }
    },

    /**
     * 获取需要学习的项目列表
     * @param {string} storageKey - 存储键名
     * @param {Array} itemPool - 所有可学习项目的数组
     * @param {string} itemKeyField - 项目键值字段名
     * @param {string} dailyLimitKey - 每日限制存储键名
     * @param {Function} itemTransform - 转换函数，将原始项目转换为学习项目
     * @return {Array} - 需要学习的项目列表
     */
    getItemsToLearn: function (storageKey, itemPool, itemKeyField, dailyLimitKey, itemTransform) {
        try {
            const data = StorageUtil.load(storageKey, {});
            const now = new Date();
            const dailyLimit = StorageUtil.loadNumber(dailyLimitKey, 20);
            const todayLearned = this.getTodayLearnedCount(storageKey);
            const remainingToday = Math.max(0, dailyLimit - todayLearned);

            if (remainingToday === 0) {
                return []; // 今日已达到学习上限
            }

            // 首先获取所有需要复习的项目（根据艾宾浩斯记忆法计算的时间）
            const reviewItems = Object.entries(data)
                .filter(([_, value]) => {
                    try {
                        return new Date(value.nextReviewTime) <= now;
                    } catch (error) {
                        console.error('解析复习时间失败:', error);
                        return false;
                    }
                })
                .map(([key, value]) => {
                    const baseItem = {
                        [itemKeyField]: key,
                        round: value.round || 0,
                        accuracy: value.totalTests > 0 ? Math.round((value.correctCount / value.totalTests) * 100) : 0,
                        ...value
                    };
                    return itemTransform ? itemTransform(baseItem) : baseItem;
                });

            // 如果有需要复习的项目，优先返回这些项目
            if (reviewItems.length > 0) {
                // 按照正确率从低到高排序，优先练习正确率低的项目
                reviewItems.sort((a, b) => a.accuracy - b.accuracy);
                return reviewItems.slice(0, remainingToday);
            }

            // 如果没有需要复习的项目，从项目池中找出未学习的项目
            const learnedKeys = new Set(Object.keys(data));
            let unlearnedItems = [];

            // 处理不同类型的项目池
            if (Array.isArray(itemPool)) {
                // 如果是数组类型的项目池
                unlearnedItems = itemPool.filter(item => !learnedKeys.has(item[itemKeyField]));
            } else if (typeof itemPool === 'string') {
                // 如果是字符串类型的项目池（如汉字字符串）
                unlearnedItems = itemPool.split('').filter(char => !learnedKeys.has(char)).map(char => ({
                    [itemKeyField]: char
                }));
            }

            if (unlearnedItems.length > 0) {
                // 随机选择未学习的项目
                const selectedItems = [];
                const maxItems = Math.min(remainingToday, unlearnedItems.length);
                const tempItems = [...unlearnedItems]; // 创建副本，避免修改原始数组

                for (let i = 0; i < maxItems; i++) {
                    const randomIndex = Math.floor(Math.random() * tempItems.length);
                    const item = tempItems[randomIndex];
                    const learningItem = {
                        ...item,
                        round: 0,
                        accuracy: 0
                    };
                    selectedItems.push(itemTransform ? itemTransform(learningItem) : learningItem);
                    tempItems.splice(randomIndex, 1);
                }
                return selectedItems;
            }

            // 如果所有项目都学习过了，随机返回已学习的项目
            const allItems = Object.entries(data).map(([key, value]) => {
                const baseItem = {
                    [itemKeyField]: key,
                    round: value.round || 0,
                    accuracy: value.totalTests > 0 ? Math.round((value.correctCount / value.totalTests) * 100) : 0,
                    ...value
                };
                return itemTransform ? itemTransform(baseItem) : baseItem;
            });

            if (allItems.length === 0) {
                // 如果没有学习记录，返回一些随机项目
                const defaultItems = itemPool.slice(0, remainingToday);
                return defaultItems.map(item => itemTransform ? itemTransform(item) : item);
            }

            const randomItems = [];
            const maxItems = Math.min(remainingToday, allItems.length);
            const tempItems = [...allItems]; // 创建副本，避免修改原始数组

            for (let i = 0; i < maxItems; i++) {
                const randomIndex = Math.floor(Math.random() * tempItems.length);
                randomItems.push(tempItems[randomIndex]);
                tempItems.splice(randomIndex, 1);
            }

            return randomItems;
        } catch (error) {
            console.error('获取学习项目失败:', error);
            // 发生错误时返回一些默认项目
            const defaultItems = Array.isArray(itemPool) ? itemPool.slice(0, 10) :
                (typeof itemPool === 'string' ? itemPool.slice(0, 10).split('') : []);
            return defaultItems.map(item => itemTransform ? itemTransform(item) : item);
        }
    }
};

// 导出工具模块
window.LearningUtil = LearningUtil; 