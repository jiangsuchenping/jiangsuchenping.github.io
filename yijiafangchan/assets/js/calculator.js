/**
 * 房产计算器 JavaScript
 * 提供贷款计算、税费计算、购房能力评估、投资回报率计算
 */

class PropertyCalculator {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('[PropertyCalculator] 房产计算器初始化');
        // 初始化默认显示贷款计算器
        this.showCalculator('loan');
    }
    
    /**
     * 切换计算器
     */
    switchCalculator(type) {
        // 隐藏所有计算器
        document.querySelectorAll('.calculator-panel').forEach(panel => {
            panel.style.display = 'none';
        });
        
        // 移除所有标签的active状态
        document.querySelectorAll('.calc-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // 显示选中的计算器
        const targetPanel = document.getElementById(type + '-calculator');
        const targetTab = event.target.closest('.calc-tab');
        
        if (targetPanel) {
            targetPanel.style.display = 'block';
        }
        
        if (targetTab) {
            targetTab.classList.add('active');
        }
    }
    
    /**
     * 贷款计算器
     */
    calculateLoan() {
        try {
            const housePrice = parseFloat(document.getElementById('housePrice').value) * 10000; // 转换为元
            const downPaymentRate = parseFloat(document.getElementById('downPaymentRate').value) / 100;
            const loanYears = parseInt(document.getElementById('loanYears').value);
            const loanRate = parseFloat(document.getElementById('loanRate').value) / 100;
            const paymentMethod = document.getElementById('paymentMethod').value;
            
            // 验证输入
            if (!housePrice || housePrice <= 0) {
                alert('请输入有效的房屋总价');
                return;
            }
            
            // 计算基础数据
            const downPayment = housePrice * downPaymentRate;
            const loanAmount = housePrice - downPayment;
            const monthlyRate = loanRate / 12;
            const totalMonths = loanYears * 12;
            
            let monthlyPayment, totalPayment, totalInterest;
            let paymentSchedule = [];
            
            if (paymentMethod === 'equal') {
                // 等额本息
                monthlyPayment = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / 
                               (Math.pow(1 + monthlyRate, totalMonths) - 1);
                totalPayment = monthlyPayment * totalMonths;
                totalInterest = totalPayment - loanAmount;
                
                // 生成还款计划
                let remainingPrincipal = loanAmount;
                for (let i = 1; i <= Math.min(12, totalMonths); i++) { // 只显示前12个月
                    const interestPayment = remainingPrincipal * monthlyRate;
                    const principalPayment = monthlyPayment - interestPayment;
                    remainingPrincipal -= principalPayment;
                    
                    paymentSchedule.push({
                        month: i,
                        monthly: monthlyPayment,
                        principal: principalPayment,
                        interest: interestPayment,
                        remaining: remainingPrincipal
                    });
                }
            } else {
                // 等额本金
                const monthlyPrincipal = loanAmount / totalMonths;
                totalPayment = 0;
                
                let remainingPrincipal = loanAmount;
                for (let i = 1; i <= totalMonths; i++) {
                    const interestPayment = remainingPrincipal * monthlyRate;
                    const currentMonthlyPayment = monthlyPrincipal + interestPayment;
                    totalPayment += currentMonthlyPayment;
                    remainingPrincipal -= monthlyPrincipal;
                    
                    if (i <= 12) { // 只保存前12个月的详细信息
                        paymentSchedule.push({
                            month: i,
                            monthly: currentMonthlyPayment,
                            principal: monthlyPrincipal,
                            interest: interestPayment,
                            remaining: remainingPrincipal
                        });
                    }
                }
                
                monthlyPayment = paymentSchedule[0].monthly; // 首月还款
                totalInterest = totalPayment - loanAmount;
            }
            
            this.displayLoanResults({
                housePrice,
                downPayment,
                loanAmount,
                monthlyPayment,
                totalPayment,
                totalInterest,
                paymentMethod,
                loanYears,
                paymentSchedule
            });
            
        } catch (error) {
            console.error('贷款计算错误:', error);
            alert('计算过程中发生错误，请检查输入数据');
        }
    }
    
    /**
     * 显示贷款计算结果
     */
    displayLoanResults(data) {
        const resultsDiv = document.getElementById('loan-results');
        
        const html = `
            <div class="highlight-result">
                <h4>月供金额</h4>
                <div class="result-value" style="font-size: 2em;">
                    ¥${this.formatNumber(data.monthlyPayment)}
                </div>
            </div>
            
            <div class="result-item">
                <span class="result-label">房屋总价:</span>
                <span class="result-value">¥${this.formatNumber(data.housePrice)}</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">首付金额:</span>
                <span class="result-value">¥${this.formatNumber(data.downPayment)}</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">贷款金额:</span>
                <span class="result-value">¥${this.formatNumber(data.loanAmount)}</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">还款总额:</span>
                <span class="result-value">¥${this.formatNumber(data.totalPayment)}</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">支付利息:</span>
                <span class="result-value">¥${this.formatNumber(data.totalInterest)}</span>
            </div>
            
            <div class="mt-4">
                <h5>前12个月还款明细</h5>
                <div style="max-height: 200px; overflow-y: auto;">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>期数</th>
                                <th>月供</th>
                                <th>本金</th>
                                <th>利息</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.paymentSchedule.map(item => `
                                <tr>
                                    <td>${item.month}</td>
                                    <td>¥${this.formatNumber(item.monthly)}</td>
                                    <td>¥${this.formatNumber(item.principal)}</td>
                                    <td>¥${this.formatNumber(item.interest)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        resultsDiv.innerHTML = html;
        resultsDiv.style.display = 'block';
    }
    
    /**
     * 税费计算器
     */
    calculateTax() {
        try {
            const houseType = document.getElementById('houseType').value;
            const houseArea = parseFloat(document.getElementById('houseArea').value);
            const unitPrice = parseFloat(document.getElementById('unitPrice').value);
            const overTwoYears = document.getElementById('overTwoYears').value === 'yes';
            const originalPrice = parseFloat(document.getElementById('originalPrice').value) * 10000;
            
            const totalPrice = houseArea * unitPrice;
            
            // 契税计算
            let deedTaxRate;
            if (houseType === 'first') {
                deedTaxRate = houseArea <= 90 ? 0.01 : (houseArea <= 144 ? 0.015 : 0.03);
            } else if (houseType === 'second') {
                deedTaxRate = houseArea <= 90 ? 0.01 : 0.02;
            } else {
                deedTaxRate = 0.03;
            }
            
            const deedTax = totalPrice * deedTaxRate;
            
            // 增值税（满二免征）
            const vatRate = overTwoYears ? 0 : 0.056;
            const vat = totalPrice * vatRate;
            
            // 个人所得税
            let personalIncomeTax = 0;
            if (!overTwoYears || houseType !== 'first') {
                const profit = totalPrice - originalPrice;
                personalIncomeTax = Math.max(profit * 0.2, totalPrice * 0.01);
            }
            
            // 其他费用
            const registrationFee = 550; // 登记费
            const transactionFee = houseArea * 3; // 交易手续费
            const evaluationFee = totalPrice * 0.005; // 评估费
            
            const otherFees = registrationFee + transactionFee + evaluationFee;
            const totalTax = deedTax + vat + personalIncomeTax + otherFees;
            
            this.displayTaxResults({
                totalPrice,
                houseArea,
                deedTax,
                vat,
                personalIncomeTax,
                otherFees,
                totalTax,
                houseType,
                overTwoYears
            });
            
        } catch (error) {
            console.error('税费计算错误:', error);
            alert('计算过程中发生错误，请检查输入数据');
        }
    }
    
    /**
     * 显示税费计算结果
     */
    displayTaxResults(data) {
        const resultsDiv = document.getElementById('tax-results');
        
        const html = `
            <div class="highlight-result">
                <h4>税费总计</h4>
                <div class="result-value" style="font-size: 2em;">
                    ¥${this.formatNumber(data.totalTax)}
                </div>
            </div>
            
            <div class="result-item">
                <span class="result-label">房屋总价:</span>
                <span class="result-value">¥${this.formatNumber(data.totalPrice)}</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">契税:</span>
                <span class="result-value">¥${this.formatNumber(data.deedTax)}</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">增值税:</span>
                <span class="result-value">${data.vat > 0 ? '¥' + this.formatNumber(data.vat) : '免征'}</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">个人所得税:</span>
                <span class="result-value">${data.personalIncomeTax > 0 ? '¥' + this.formatNumber(data.personalIncomeTax) : '免征'}</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">其他费用:</span>
                <span class="result-value">¥${this.formatNumber(data.otherFees)}</span>
            </div>
            
            <div class="mt-3">
                <small class="text-muted">
                    * 税费计算仅供参考，具体以当地政策为准<br>
                    * ${data.houseArea}平方米，${data.houseType === 'first' ? '首套房' : data.houseType === 'second' ? '二套房' : '豪华住宅'}
                </small>
            </div>
        `;
        
        resultsDiv.innerHTML = html;
        resultsDiv.style.display = 'block';
    }
    
    /**
     * 购房能力评估
     */
    calculateAffordability() {
        try {
            const monthlyIncome = parseFloat(document.getElementById('monthlyIncome').value);
            const monthlyExpense = parseFloat(document.getElementById('monthlyExpense').value);
            const currentSavings = parseFloat(document.getElementById('currentSavings').value) * 10000;
            const expectedYears = parseInt(document.getElementById('expectedYears').value);
            const riskLevel = document.getElementById('riskLevel').value;
            
            const netIncome = monthlyIncome - monthlyExpense;
            
            // 根据风险承受能力确定月供占收入比例
            const riskRatios = {
                'conservative': 0.3,
                'moderate': 0.4,
                'aggressive': 0.5
            };
            
            const maxMonthlyPayment = monthlyIncome * riskRatios[riskLevel];
            
            // 估算贷款利率
            const estimatedRate = 0.049; // 4.9%
            const monthlyRate = estimatedRate / 12;
            const totalMonths = expectedYears * 12;
            
            // 计算最大贷款额度
            const maxLoanAmount = maxMonthlyPayment * (Math.pow(1 + monthlyRate, totalMonths) - 1) /
                                (monthlyRate * Math.pow(1 + monthlyRate, totalMonths));
            
            // 首付比例30%，计算最大购房总价
            const maxHousePrice = (maxLoanAmount + currentSavings) / 0.7;
            
            // 建议的购房价格范围
            const recommendedPrice = maxHousePrice * 0.8; // 保守建议
            
            // 月度储蓄能力
            const monthlySavingCapacity = netIncome - maxMonthlyPayment;
            
            this.displayAffordabilityResults({
                monthlyIncome,
                netIncome,
                maxMonthlyPayment,
                maxLoanAmount,
                maxHousePrice,
                recommendedPrice,
                currentSavings,
                monthlySavingCapacity,
                riskLevel,
                expectedYears
            });
            
        } catch (error) {
            console.error('购房能力计算错误:', error);
            alert('计算过程中发生错误，请检查输入数据');
        }
    }
    
    /**
     * 显示购房能力评估结果
     */
    displayAffordabilityResults(data) {
        const resultsDiv = document.getElementById('affordability-results');
        
        const riskLevelText = {
            'conservative': '保守型',
            'moderate': '稳健型',
            'aggressive': '激进型'
        };
        
        const html = `
            <div class="highlight-result">
                <h4>建议购房总价</h4>
                <div class="result-value" style="font-size: 1.8em;">
                    ¥${this.formatNumber(data.recommendedPrice)}
                </div>
            </div>
            
            <div class="result-item">
                <span class="result-label">最大购房能力:</span>
                <span class="result-value">¥${this.formatNumber(data.maxHousePrice)}</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">最大月供能力:</span>
                <span class="result-value">¥${this.formatNumber(data.maxMonthlyPayment)}</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">最大贷款额度:</span>
                <span class="result-value">¥${this.formatNumber(data.maxLoanAmount)}</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">可用首付资金:</span>
                <span class="result-value">¥${this.formatNumber(data.currentSavings)}</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">月储蓄余额:</span>
                <span class="result-value">¥${this.formatNumber(data.monthlySavingCapacity)}</span>
            </div>
            
            <div class="mt-3 p-3" style="background: #fff3cd; border-radius: 5px;">
                <h6 class="text-warning"><i class="fas fa-lightbulb me-2"></i>购房建议</h6>
                <ul class="mb-0 small">
                    <li>您的风险类型：${riskLevelText[data.riskLevel]}</li>
                    <li>建议购房总价控制在 ¥${this.formatNumber(data.recommendedPrice)} 以内</li>
                    <li>保留3-6个月的应急资金</li>
                    <li>考虑装修、家具等额外费用约10-15%</li>
                </ul>
            </div>
        `;
        
        resultsDiv.innerHTML = html;
        resultsDiv.style.display = 'block';
    }
    
    /**
     * 投资回报率计算器
     */
    calculateROI() {
        try {
            const buyPrice = parseFloat(document.getElementById('buyPrice').value) * 10000;
            const monthlyRent = parseFloat(document.getElementById('monthlyRent').value);
            const appreciationRate = parseFloat(document.getElementById('appreciationRate').value) / 100;
            const holdingYears = parseInt(document.getElementById('holdingYears').value);
            const maintenanceCost = parseFloat(document.getElementById('maintenanceCost').value);
            
            // 年租金收入
            const annualRent = monthlyRent * 12;
            
            // 总租金收入
            const totalRentIncome = annualRent * holdingYears;
            
            // 房屋增值
            const futureValue = buyPrice * Math.pow(1 + appreciationRate, holdingYears);
            const capitalGain = futureValue - buyPrice;
            
            // 总维护成本
            const totalMaintenanceCost = maintenanceCost * holdingYears;
            
            // 净收益
            const netReturn = totalRentIncome + capitalGain - totalMaintenanceCost;
            
            // 投资回报率
            const totalROI = (netReturn / buyPrice) * 100;
            const annualROI = totalROI / holdingYears;
            
            // 租金回报率
            const rentalYield = (annualRent / buyPrice) * 100;
            
            // 现金流分析
            const annualCashFlow = annualRent - maintenanceCost;
            const totalCashFlow = annualCashFlow * holdingYears;
            
            this.displayROIResults({
                buyPrice,
                monthlyRent,
                annualRent,
                totalRentIncome,
                capitalGain,
                futureValue,
                totalMaintenanceCost,
                netReturn,
                totalROI,
                annualROI,
                rentalYield,
                annualCashFlow,
                totalCashFlow,
                holdingYears
            });
            
        } catch (error) {
            console.error('投资回报率计算错误:', error);
            alert('计算过程中发生错误，请检查输入数据');
        }
    }
    
    /**
     * 显示投资回报率结果
     */
    displayROIResults(data) {
        const resultsDiv = document.getElementById('roi-results');
        
        const html = `
            <div class="highlight-result">
                <h4>年化投资回报率</h4>
                <div class="result-value" style="font-size: 2em; color: ${data.annualROI > 0 ? '#28a745' : '#dc3545'}">
                    ${data.annualROI.toFixed(2)}%
                </div>
            </div>
            
            <div class="result-item">
                <span class="result-label">购买价格:</span>
                <span class="result-value">¥${this.formatNumber(data.buyPrice)}</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">持有${data.holdingYears}年后价值:</span>
                <span class="result-value">¥${this.formatNumber(data.futureValue)}</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">资本增值:</span>
                <span class="result-value" style="color: ${data.capitalGain > 0 ? '#28a745' : '#dc3545'}">
                    ¥${this.formatNumber(data.capitalGain)}
                </span>
            </div>
            
            <div class="result-item">
                <span class="result-label">总租金收入:</span>
                <span class="result-value">¥${this.formatNumber(data.totalRentIncome)}</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">维护成本:</span>
                <span class="result-value">¥${this.formatNumber(data.totalMaintenanceCost)}</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">净收益:</span>
                <span class="result-value" style="color: ${data.netReturn > 0 ? '#28a745' : '#dc3545'}">
                    ¥${this.formatNumber(data.netReturn)}
                </span>
            </div>
            
            <div class="result-item">
                <span class="result-label">租金收益率:</span>
                <span class="result-value">${data.rentalYield.toFixed(2)}%</span>
            </div>
            
            <div class="result-item">
                <span class="result-label">年现金流:</span>
                <span class="result-value" style="color: ${data.annualCashFlow > 0 ? '#28a745' : '#dc3545'}">
                    ¥${this.formatNumber(data.annualCashFlow)}
                </span>
            </div>
            
            <div class="mt-3 p-3" style="background: ${data.annualROI > 8 ? '#d4edda' : data.annualROI > 5 ? '#fff3cd' : '#f8d7da'}; border-radius: 5px;">
                <h6><i class="fas fa-chart-line me-2"></i>投资评价</h6>
                <p class="mb-0 small">
                    ${data.annualROI > 8 ? '投资回报率较高，是不错的投资选择' : 
                      data.annualROI > 5 ? '投资回报率中等，需要综合考虑其他因素' : 
                      '投资回报率较低，建议谨慎考虑'}
                </p>
            </div>
        `;
        
        resultsDiv.innerHTML = html;
        resultsDiv.style.display = 'block';
    }
    
    /**
     * 格式化数字显示
     */
    formatNumber(num) {
        if (typeof num !== 'number' || isNaN(num)) return '0';
        
        // 如果是整数且大于10000，以万为单位显示
        if (num >= 10000 && num % 1 === 0) {
            if (num >= 100000000) {
                return (num / 100000000).toFixed(2) + '亿';
            } else if (num >= 10000) {
                return (num / 10000).toFixed(2).replace(/\.?0+$/, '') + '万';
            }
        }
        
        // 普通数字格式化（添加千分符）
        return num.toLocaleString('zh-CN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    }
}

// 全局函数（供HTML调用）
function switchCalculator(type) {
    if (window.propertyCalculator) {
        window.propertyCalculator.switchCalculator(type);
    }
}

function calculateLoan() {
    if (window.propertyCalculator) {
        window.propertyCalculator.calculateLoan();
    }
}

function calculateTax() {
    if (window.propertyCalculator) {
        window.propertyCalculator.calculateTax();
    }
}

function calculateAffordability() {
    if (window.propertyCalculator) {
        window.propertyCalculator.calculateAffordability();
    }
}

function calculateROI() {
    if (window.propertyCalculator) {
        window.propertyCalculator.calculateROI();
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    window.propertyCalculator = new PropertyCalculator();
});

// 暴露到全局
window.PropertyCalculator = PropertyCalculator;