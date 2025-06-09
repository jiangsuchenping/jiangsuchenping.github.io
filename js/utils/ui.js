/**
 * UI工具模块
 * 封装UI相关的通用操作，减少重复代码
 */
const UIUtil = {
    /**
     * 创建或更新样式元素
     * @param {string} id - 样式元素ID
     * @param {string} css - CSS样式内容
     */
    addStyle: function (id, css) {
        let style = document.getElementById(id);
        if (!style) {
            style = document.createElement('style');
            style.id = id;
            document.head.appendChild(style);
        }
        style.textContent = css;
    },

    /**
     * 添加CSS样式到页面
     * @param {string} css - CSS样式内容
     */
    addStyles: function (css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    },

    /**
     * 通过ID查找元素并聚焦且全选其内容
     * @param {string} id - 元素ID
     */
    focusAndSelectInput: function (id) {
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
                element.focus();
                element.select();
            }
        }, 0);
    },

    /**
     * 禁用指定的按钮
     * @param {Array<string>} selectors - 按钮选择器数组
     */
    disableButtons: function (selectors) {
        selectors.forEach(selector => {
            const button = document.querySelector(selector);
            if (button) button.disabled = true;
        });
    },

    /**
     * 启用指定的按钮
     * @param {Array<string>} selectors - 按钮选择器数组
     */
    enableButtons: function (selectors) {
        selectors.forEach(selector => {
            const button = document.querySelector(selector);
            if (button) button.disabled = false;
        });
    },

    /**
     * 显示错误信息
     * @param {string} selector - 显示错误的元素选择器
     * @param {string} message - 错误消息
     * @param {string} className - 添加的CSS类名，默认为'wrong'
     */
    showError: function (selector, message, className = 'wrong') {
        const element = document.querySelector(selector);
        if (element) {
            element.className = `feedback ${className}`;
            element.textContent = message;
        }
    },

    /**
     * 显示带有自动聚焦的确认框
     * @param {string} message - 提示信息
     * @param {Function} callback - 点击确认后的回调函数
     */
    showConfirm: function (message, callback) {
        if (confirm(message) && callback) {
            callback();
        }
    },

    /**
     * 显示带有自动聚焦和全选的输入框
     * @param {Element} inputElement - 输入元素
     */
    focusAndSelect: function (inputElement) {
        if (inputElement) {
            setTimeout(() => {
                inputElement.focus();
                inputElement.select();
            }, 0);
        }
    },

    /**
     * 创建带有超时的禁用功能的按钮
     * @param {Element} button - 按钮元素
     * @param {boolean} disabled - 是否禁用
     * @param {number} timeout - 禁用时长(ms)，如果为0则不启用计时器
     */
    setButtonState: function (button, disabled, timeout = 0) {
        if (!button) return;

        button.disabled = disabled;

        if (disabled && timeout > 0) {
            setTimeout(() => {
                button.disabled = false;
            }, timeout);
        }
    },

    /**
     * 设置多个按钮的禁用状态
     * @param {Array<Element>} buttons - 按钮元素数组
     * @param {boolean} disabled - 是否禁用
     */
    setButtonsState: function (buttons, disabled) {
        if (!buttons || !Array.isArray(buttons)) return;

        buttons.forEach(button => {
            if (button) {
                button.disabled = disabled;
            }
        });
    },

    /**
     * 创建带有排序功能的历史表格
     * @param {Element} container - 容器元素
     * @param {Array} data - 表格数据
     * @param {Array} columns - 列配置 [{field, title, sortable}]
     * @param {string} sortSettingsKey - 排序设置的本地存储键
     * @param {Function} renderRow - 渲染行的函数
     */
    createSortableTable: function (container, data, columns, sortSettingsKey, renderRow) {
        if (!container || !data || !columns) return;

        // 获取排序设置
        const sortSettings = StorageUtil.load(sortSettingsKey, { field: columns[0].field, direction: 'desc' });

        // 创建表头
        let tableHTML = '<table class="history-table"><thead><tr>';
        columns.forEach(col => {
            const sortableClass = col.sortable ? 'sortable' : '';
            tableHTML += `<th class="${sortableClass}" data-sort="${col.field}" title="${col.title}">${col.title}</th>`;
        });
        tableHTML += '</tr></thead><tbody>';

        // 排序数据
        const sortedData = [...data].sort((a, b) => {
            let valueA = a[sortSettings.field];
            let valueB = b[sortSettings.field];

            // 特殊类型处理
            if (sortSettings.field.includes('Time')) {
                valueA = new Date(valueA).getTime();
                valueB = new Date(valueB).getTime();
            } else if (typeof valueA === 'number' || typeof valueB === 'number') {
                valueA = Number(valueA);
                valueB = Number(valueB);
            }

            if (sortSettings.direction === 'asc') {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });

        // 添加表格内容
        sortedData.forEach(item => {
            tableHTML += renderRow(item);
        });

        tableHTML += '</tbody></table>';
        container.innerHTML = tableHTML;

        // 添加表头排序事件监听
        const headers = container.querySelectorAll('th.sortable');
        headers.forEach(header => {
            // 设置初始排序样式
            if (header.dataset.sort === sortSettings.field) {
                header.classList.add(sortSettings.direction === 'asc' ? 'ascending' : 'descending');
            }

            header.addEventListener('click', () => {
                const field = header.dataset.sort;
                const currentDirection = header.classList.contains('ascending') ? 'desc' : 'asc';

                // 保存排序设置
                StorageUtil.save(sortSettingsKey, { field, direction: currentDirection });

                // 重新加载表格
                this.createSortableTable(container, data, columns, sortSettingsKey, renderRow);
            });
        });
    },

    /**
     * 排序数据列表
     * @param {Array} dataList - 要排序的数据列表
     * @param {string} sortBy - 排序字段
     * @param {boolean} ascending - 是否升序
     * @param {Object} valueGetters - 特殊字段的值获取函数 {fieldName: function(item) {...}}
     * @returns {Array} 排序后的数据列表
     */
    sortData: function (dataList, sortBy, ascending = true, valueGetters = {}) {
        return [...dataList].sort((a, b) => {
            let valueA, valueB;

            // 使用自定义的值获取函数或直接获取属性
            if (valueGetters[sortBy]) {
                valueA = valueGetters[sortBy](a);
                valueB = valueGetters[sortBy](b);
            } else {
                valueA = a[sortBy];
                valueB = b[sortBy];

                // 类型处理
                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    return ascending ?
                        valueA.localeCompare(valueB) :
                        valueB.localeCompare(valueA);
                }

                // 数字类型转换
                if (typeof valueA !== 'number') valueA = Number(valueA) || 0;
                if (typeof valueB !== 'number') valueB = Number(valueB) || 0;
            }

            return ascending ? valueA - valueB : valueB - valueA;
        });
    },

    /**
     * 防抖函数 - 限制函数在一定时间内只能执行一次
     * @param {Function} func - 要执行的函数
     * @param {number} wait - 等待时间(ms)
     * @param {boolean} immediate - 是否在开始时立即执行
     * @returns {Function} - 返回防抖后的函数
     */
    debounce: function (func, wait = 300, immediate = false) {
        let timeout;
        return function (...args) {
            const context = this;
            const later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },

    /**
     * 渲染带排序功能的历史记录表格
     * @param {Element} container - 容器元素
     * @param {Array} history - 历史数据数组
     * @param {Array} columns - 列定义 [{field, title, sortable}]
     * @param {Function} rowRenderer - 行渲染函数
     * @param {Object} options - 额外选项 {sortSettingsKey, defaultSort}
     */
    renderHistoryTable: function (container, history, columns, rowRenderer, options = {}) {
        if (!container || !history || !columns) return;

        const { sortSettingsKey, defaultSort = { field: 'lastTestTime', direction: 'desc' } } = options;

        // 获取排序设置
        let sortSettings;
        if (sortSettingsKey) {
            sortSettings = StorageUtil.load(sortSettingsKey, defaultSort);
        } else {
            sortSettings = defaultSort;
        }

        // 创建表头
        let tableHTML = '<table class="history-table"><thead><tr>';
        columns.forEach(col => {
            const sortableClass = col.sortable ? 'sortable' : '';
            tableHTML += `<th class="${sortableClass}" data-sort="${col.field}" title="${col.title}">${col.title}</th>`;
        });
        tableHTML += '</tr></thead><tbody>';

        // 排序数据
        const sortedHistory = this.sortData(
            history,
            sortSettings.field,
            sortSettings.direction === 'asc',
            {
                'lastTestTime': item => new Date(item.lastTestTime).getTime(),
                'nextReviewTime': item => new Date(item.nextReviewTime).getTime()
            }
        );

        // 添加表格内容
        sortedHistory.forEach(item => {
            tableHTML += rowRenderer(item);
        });

        tableHTML += '</tbody></table>';
        container.innerHTML = tableHTML;

        // 添加表头排序事件监听
        const headers = container.querySelectorAll('th.sortable');
        headers.forEach(header => {
            // 设置初始排序样式
            if (header.dataset.sort === sortSettings.field) {
                header.classList.add(sortSettings.direction === 'asc' ? 'ascending' : 'descending');
            }

            header.addEventListener('click', () => {
                const field = header.dataset.sort;
                let currentDirection = header.classList.contains('ascending') ? 'desc' : 'asc';

                // 移除所有表头的排序状态
                headers.forEach(h => {
                    h.classList.remove('ascending', 'descending');
                });

                // 添加当前排序状态
                header.classList.add(currentDirection === 'asc' ? 'ascending' : 'descending');

                // 保存排序设置
                if (sortSettingsKey) {
                    StorageUtil.save(sortSettingsKey, { field, direction: currentDirection });
                }

                // 重新渲染表格
                this.renderHistoryTable(container, history, columns, rowRenderer, {
                    sortSettingsKey,
                    defaultSort: { field, direction: currentDirection }
                });
            });
        });
    },

    /**
     * 添加过渡动画元素
     * @param {string} elementId - 元素ID
     * @param {string} message - 显示信息
     * @param {string} className - CSS类名
     * @param {number} duration - 持续时间(ms)
     */
    showAnimatedFeedback: function (elementId, message, className = 'success', duration = 1000) {
        const element = document.getElementById(elementId);
        if (!element) return;

        // 创建动画元素
        const feedback = document.createElement('div');
        feedback.className = `animated-feedback ${className}`;
        feedback.textContent = message;

        // 添加到容器
        element.appendChild(feedback);

        // 设置动画
        setTimeout(() => {
            feedback.classList.add('show');

            // 动画结束后移除
            setTimeout(() => {
                feedback.classList.remove('show');
                setTimeout(() => {
                    feedback.remove();
                }, 300);
            }, duration);
        }, 10);
    },

    /**
     * 为输入框绑定验证和提交事件
     * @param {Element} inputElement - 输入框元素
     * @param {Element} submitButton - 提交按钮元素
     * @param {Function} validator - 验证函数，返回true/false
     * @param {Function} onSubmit - 提交回调函数
     * @param {string} errorMessage - 错误提示消息
     */
    bindInputValidation: function (inputElement, submitButton, validator, onSubmit, errorMessage) {
        if (!inputElement || !submitButton) return;

        const validateAndSubmit = () => {
            const value = inputElement.value;
            if (validator(value)) {
                onSubmit(value);
            } else {
                alert(errorMessage);
                this.focusAndSelect(inputElement);
            }
        };

        // 绑定按钮点击事件
        submitButton.addEventListener('click', validateAndSubmit);

        // 绑定输入框回车键事件
        inputElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                validateAndSubmit();
            }
        });
    }
};

// 导出工具模块
window.UIUtil = UIUtil; 