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