// 生成测试数据的脚本
function generateTestData() {
    const history = [];
    const today = new Date();
    
    // 生成最近30天的数据
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // 每天生成5-15条记录
        const count = Math.floor(Math.random() * 11) + 5;
        for (let j = 0; j < count; j++) {
            const correct = Math.random() > 0.3; // 70%正确率
            const hour = Math.floor(Math.random() * 12) + 8; // 8点到20点之间
            const minute = Math.floor(Math.random() * 60);
            const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
            
            history.push({
                date: dateStr,
                time: timeStr,
                question: `${Math.floor(Math.random() * 10)} + ${Math.floor(Math.random() * 10)} = ?`,
                correctAnswer: Math.floor(Math.random() * 20),
                selectedAnswer: correct ? Math.floor(Math.random() * 20) : Math.floor(Math.random() * 20),
                correct: correct,
                type: 'mixed_operation',
                operationCount: 2
            });
        }
    }
    
    // 保存到localStorage
    localStorage.setItem('mixedMathTrainingHistory', JSON.stringify(history));
    console.log('测试数据已生成并保存到localStorage');
}

// 运行脚本
generateTestData();