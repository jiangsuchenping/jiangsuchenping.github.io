/**
 * 本地存储工具模块
 * 提供统一的本地存储接口，处理异常和类型转换
 */
const StorageUtil = {
    /**
     * 保存数据到localStorage
     * @param {string} key - 存储键名
     * @param {any} data - 要存储的数据
     * @return {boolean} - 是否保存成功
     */
    save: function (key, data) {
        try {
            const jsonData = JSON.stringify(data);
            localStorage.setItem(key, jsonData);
            return true;
        } catch (error) {
            console.error(`保存数据失败 [${key}]:`, error);
            return false;
        }
    },

    /**
     * 从localStorage加载数据
     * @param {string} key - 存储键名
     * @param {any} defaultValue - 默认值，当数据不存在或加载失败时返回
     * @return {any} - 加载的数据或默认值
     */
    load: function (key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error(`加载数据失败 [${key}]:`, error);
            return defaultValue;
        }
    },

    /**
     * 保存数值类型到localStorage
     * @param {string} key - 存储键名
     * @param {number} value - 要存储的数值
     * @param {number} defaultValue - 当值无效时使用的默认值
     * @return {boolean} - 是否保存成功
     */
    saveNumber: function (key, value, defaultValue = 0) {
        const num = parseInt(value);
        return this.save(key, isNaN(num) ? defaultValue : num);
    },

    /**
     * 从localStorage加载数值类型
     * @param {string} key - 存储键名
     * @param {number} defaultValue - 默认值
     * @return {number} - 加载的数值或默认值
     */
    loadNumber: function (key, defaultValue = 0) {
        const value = this.load(key, defaultValue);
        const num = parseInt(value);
        return isNaN(num) ? defaultValue : num;
    },

    /**
     * 删除localStorage中的数据
     * @param {string} key - 存储键名
     */
    remove: function (key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`删除数据失败 [${key}]:`, error);
        }
    }
};

// 导出工具模块
window.StorageUtil = StorageUtil; 